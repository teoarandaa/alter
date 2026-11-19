"""Orquesta una búsqueda: plataformas en paralelo, puntuación con IA, ahorro y orden."""

from __future__ import annotations

import asyncio
import logging

import httpx

from . import ai
from .config import settings
from .demo import demo_listings
from .platforms import Platform, build_links, load_platforms, search_apify
from .schemas import Listing, PlatformStatus, ProductProfile, SearchResponse

log = logging.getLogger("alter.search")

MIN_RESULTS_BEFORE_FALLBACK = 3


async def _search_platform(
    platform: Platform, profile: ProductProfile, client: httpx.AsyncClient
) -> tuple[list[Listing], PlatformStatus]:
    """Prueba las búsquedas de la más específica a la más general hasta tener suficientes anuncios."""
    found: dict[str, Listing] = {}
    error: str | None = None
    for query in profile.search_queries[:3]:
        try:
            if settings.demo_mode:
                results = demo_listings(platform, profile, query)
            else:
                results = await search_apify(platform, query, client)
        except httpx.HTTPStatusError as exc:
            error = f"HTTP {exc.response.status_code}"
            log.warning("%s falló (%s) con '%s'", platform.name, error, query)
            break
        except httpx.HTTPError as exc:
            error = type(exc).__name__
            log.warning("%s falló (%s) con '%s'", platform.name, error, query)
            break
        for item in results:
            found.setdefault(item.id, item)
        if len(found) >= MIN_RESULTS_BEFORE_FALLBACK:
            break
    listings = list(found.values())[: platform.max_results]
    for item in listings:
        item.sponsored = platform.sponsored
    status = PlatformStatus(
        platform=platform.key, name=platform.name, ok=error is None or bool(listings), count=len(listings), error=error
    )
    return listings, status


# Un anuncio por menos del 10 % del precio nuevo casi nunca es el producto: estafa, accesorio o precio de relleno.
MIN_PRICE_RATIO = 0.10


def apply_savings(listings: list[Listing], new_price: float | None) -> list[Listing]:
    """Calcula el ahorro frente al precio nuevo y descarta lo que sale más caro o sospechosamente barato."""
    kept = []
    for item in listings:
        if new_price and item.price_eur is not None:
            if item.price_eur < new_price * MIN_PRICE_RATIO:
                continue
            item.savings_eur = round(new_price - item.price_eur, 2)
            item.savings_pct = round((new_price - item.price_eur) / new_price * 100, 1)
            if item.savings_eur < 0:
                continue
        kept.append(item)
    return kept


def rank(listings: list[Listing], platforms: dict[str, Platform]) -> list[Listing]:
    """Orden: coincidencias exactas primero; dentro, plataformas con más prioridad (patrocinio),
    después las más parecidas y, a igualdad, las más baratas."""

    def key(item: Listing):
        platform = platforms.get(item.platform)
        return (
            0 if item.match_type == "exact" else 1,
            -(platform.priority if platform else 0),
            -(item.similarity or 0),
            item.price_eur if item.price_eur is not None else float("inf"),
        )

    return sorted(listings, key=key)


async def run_search(profile: ProductProfile, source_image: str | None = None, ai_used: bool = True) -> SearchResponse:
    """ai_used=False si el análisis tuvo que hacerse sin Claude: tampoco se usa para puntuar."""
    ai_used = ai_used and settings.ai_enabled
    platforms = load_platforms()
    apify_platforms = [p for p in platforms.values() if p.type == "apify"]

    async with httpx.AsyncClient() as client:
        results = await asyncio.gather(*(_search_platform(p, profile, client) for p in apify_platforms))

    listings = [item for found, _ in results for item in found]
    statuses = [status for _, status in results]

    listings = await ai.score_listings(profile, listings, use_ai=ai_used)
    listings = apply_savings(listings, profile.new_price_eur)
    listings = rank(listings, platforms)

    savings = [i.savings_pct for i in listings if i.savings_pct is not None]
    return SearchResponse(
        product=profile,
        source_image=source_image,
        listings=listings,
        links=build_links(profile.search_queries[0]),
        platforms=statuses,
        best_savings_pct=max(savings) if savings else None,
        demo_mode=settings.demo_mode,
        ai_enabled=ai_used,
    )
