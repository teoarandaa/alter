"""Uso de la API de Claude: entender el producto y puntuar los anuncios encontrados.

Si no hay ANTHROPIC_API_KEY, se usan heurísticas sencillas para que la app siga
funcionando en local (con resultados menos finos).
"""

from __future__ import annotations

import base64
import logging
import re
import unicodedata
from typing import Literal

import anthropic
from pydantic import BaseModel

from .config import settings
from .product_page import PageInfo
from .schemas import Listing, ProductProfile

log = logging.getLogger("alter.ai")

FALLBACK_BETA = "server-side-fallback-2026-07-01"

ANALYZE_SYSTEM = """Eres el analista de producto de Alter, una web que ayuda a la gente a comprar \
de segunda mano en lugar de nuevo. Recibes la información de un producto nuevo (página de venta, \
foto y/o descripción del usuario) y devuelves una ficha del producto.

- Escribe en español.
- Si un dato no aparece y no puedes deducirlo con seguridad, déjalo vacío; no lo inventes.
- new_price_eur solo si el precio aparece en la información (convierte a euros si viene en otra moneda).
- Las search_queries son lo que escribiría una persona en Wallapop o Vinted: cortas, sin adjetivos \
de marketing, con marca y modelo cuando se conozcan. La primera la más específica, la última la más \
general (tipo de objeto + rasgo clave)."""

SCORE_SYSTEM = """Eres el comparador de Alter. Recibes la ficha de un producto nuevo y una lista de \
anuncios de segunda mano. Para cada anuncio decide si es el mismo producto o una alternativa \
razonable que podría sustituirlo.

- match_type "exact": mismo producto (misma marca y modelo, o idéntico en lo esencial).
- match_type "similar": producto distinto pero que cumple la misma función con características parecidas.
- match_type "unrelated": accesorios, piezas, fundas, cajas vacías, anuncios de compra ("compro..."), \
productos de otra categoría o claramente distintos.
- similarity: 0-100, lo bien que el anuncio sustituye al producto nuevo.
Devuelve una puntuación por cada id recibido."""


class ListingScore(BaseModel):
    id: str
    similarity: int
    match_type: Literal["exact", "similar", "unrelated"]


class ScoreResult(BaseModel):
    scores: list[ListingScore]


_client: anthropic.AsyncAnthropic | None = None


def _get_client() -> anthropic.AsyncAnthropic:
    global _client
    if _client is None:
        _client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
    return _client


async def _parse(system: str, content: list[dict], output_format: type[BaseModel], max_tokens: int = 8000):
    """Llamada a Claude con salida estructurada y modelo de respaldo si hay un rechazo."""
    response = await _get_client().beta.messages.parse(
        model=settings.claude_model,
        max_tokens=max_tokens,
        system=system,
        messages=[{"role": "user", "content": content}],
        output_format=output_format,
        output_config={"effort": "medium"},
        betas=[FALLBACK_BETA],
        fallbacks="default",
    )
    if response.stop_reason == "refusal" or response.parsed_output is None:
        raise RuntimeError(f"Claude no devolvió una respuesta válida (stop_reason={response.stop_reason})")
    return response.parsed_output


# ---------------------------------------------------------------------------
# Análisis del producto
# ---------------------------------------------------------------------------

async def analyze_page(page: PageInfo | None, url: str, notes: str | None) -> ProductProfile:
    usable = page is not None and not page.redirected_away
    if not settings.ai_enabled:
        if usable:
            return heuristic_profile(page.title, notes, page.price_eur)
        return heuristic_profile(_slug_words(url), notes, None)

    text = page.as_prompt() if page else f"URL: {url}\n(No se ha podido descargar la página; deduce lo que puedas del enlace.)"
    if notes:
        text += f"\n\nNotas del usuario: {notes}"
    content: list[dict] = [{"type": "text", "text": text}]
    if usable and page.image:
        content.insert(0, {"type": "image", "source": {"type": "url", "url": page.image}})
    try:
        profile = await _parse(ANALYZE_SYSTEM, content, ProductProfile)
    except anthropic.BadRequestError:
        if len(content) == 1:
            raise
        # La imagen remota puede no ser accesible: reintentamos solo con texto.
        profile = await _parse(ANALYZE_SYSTEM, content[1:], ProductProfile)
    if profile.new_price_eur is None and usable and page.price_eur:
        profile.new_price_eur = page.price_eur
    return profile


async def analyze_image(image: bytes, media_type: str, description: str, new_price_eur: float | None) -> ProductProfile:
    if not settings.ai_enabled:
        return heuristic_profile(description, None, new_price_eur)

    text = f"Descripción del usuario: {description or '(sin descripción)'}"
    if new_price_eur:
        text += f"\nPrecio nuevo indicado por el usuario: {new_price_eur} EUR"
    content = [
        {
            "type": "image",
            "source": {"type": "base64", "media_type": media_type, "data": base64.standard_b64encode(image).decode()},
        },
        {"type": "text", "text": text},
    ]
    profile = await _parse(ANALYZE_SYSTEM, content, ProductProfile)
    if new_price_eur:
        profile.new_price_eur = new_price_eur
    return profile


# ---------------------------------------------------------------------------
# Puntuación de anuncios
# ---------------------------------------------------------------------------

async def score_listings(profile: ProductProfile, listings: list[Listing]) -> list[Listing]:
    """Rellena similarity/match_type y descarta lo que no tiene relación."""
    if not listings:
        return []
    if settings.ai_enabled:
        try:
            return await _score_with_claude(profile, listings)
        except Exception:  # noqa: BLE001 - si falla la IA, mejor resultados heurísticos que ninguno
            log.exception("Fallo al puntuar con Claude; se usa la heurística")
    return heuristic_scores(profile, listings)


async def _score_with_claude(profile: ProductProfile, listings: list[Listing]) -> list[Listing]:
    lines = [
        f"- id={item.id} | {item.platform} | {item.title} | "
        f"{'%.2f EUR' % item.price_eur if item.price_eur is not None else 'sin precio'}"
        + (f" | estado: {item.condition}" if item.condition else "")
        for item in listings
    ]
    text = (
        "Producto nuevo:\n" + profile.model_dump_json(indent=2) + "\n\nAnuncios de segunda mano:\n" + "\n".join(lines)
    )
    result: ScoreResult = await _parse(SCORE_SYSTEM, [{"type": "text", "text": text}], ScoreResult, max_tokens=16000)
    by_id = {s.id: s for s in result.scores}
    scored: list[Listing] = []
    for item in listings:
        score = by_id.get(item.id)
        if score is None or score.match_type == "unrelated":
            continue
        item.similarity = max(0, min(100, score.similarity))
        item.match_type = score.match_type
        scored.append(item)
    return scored


# ---------------------------------------------------------------------------
# Heurísticas sin IA
# ---------------------------------------------------------------------------

_STOPWORDS = {
    "de", "la", "el", "los", "las", "y", "con", "para", "en", "un", "una", "del", "al", "por", "sin",
    "the", "and", "with", "for", "new", "nuevo", "nueva", "oferta", "envio", "gratis", "comprar",
}
_EXCLUDE = {"funda", "carcasa", "protector", "caja", "cargador", "compro", "busco", "repuesto", "piezas"}


def _normalize(text: str) -> str:
    text = unicodedata.normalize("NFKD", text.lower())
    return "".join(c for c in text if not unicodedata.combining(c))


def _tokens(text: str) -> set[str]:
    return {t for t in re.findall(r"[a-z0-9]+", _normalize(text)) if len(t) > 1 and t not in _STOPWORDS}


_URL_NOISE = {"es", "en", "www", "html", "htm", "php", "product", "products", "producto", "productos", "item", "dp", "ref"}


def _slug_words(url: str) -> str:
    """Palabras útiles del enlace: '/es/es/p/poang-sillon-abedul-s293/' -> 'poang sillon abedul'."""
    path = re.sub(r"https?://[^/]+", "", url).split("?")[0]
    words = [w for w in re.split(r"[/\-_.=&+]+", path) if w.isalpha() and len(w) > 2 and w.lower() not in _URL_NOISE]
    return " ".join(words[:8]) or url


def heuristic_profile(title: str | None, notes: str | None, price: float | None) -> ProductProfile:
    base = (title or notes or "producto").strip()
    base = re.split(r"\s[|\-–]\s", base)[0]  # quita " | Tienda" del título
    words = [w for w in re.findall(r"\w+", base) if _normalize(w) not in _STOPWORDS]
    queries = [" ".join(words[:5]), " ".join(words[:3])]
    queries = [q for i, q in enumerate(queries) if q and q not in queries[:i]]
    return ProductProfile(
        name=base[:120],
        category="general",
        key_features=[notes[:200]] if notes else [],
        new_price_eur=price,
        search_queries=queries or [base[:60]],
    )


def heuristic_scores(profile: ProductProfile, listings: list[Listing]) -> list[Listing]:
    reference = _tokens(" ".join(filter(None, [profile.name, profile.brand, profile.model, *profile.search_queries])))
    scored: list[Listing] = []
    for item in listings:
        title_tokens = _tokens(item.title)
        if title_tokens & _EXCLUDE and not reference & _EXCLUDE:
            continue
        overlap = len(reference & title_tokens) / max(1, len(reference))
        similarity = round(overlap * 100)
        if similarity < 20:
            continue
        item.similarity = similarity
        item.match_type = "exact" if similarity >= 75 else "similar"
        scored.append(item)
    return scored
