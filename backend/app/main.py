"""API de Alter.

Arranque en local:  uvicorn app.main:app --reload --port 8000
"""

from __future__ import annotations

import logging

import anthropic
import httpx
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from . import ai
from .config import settings
from .product_page import UnsafeUrlError, assert_safe_url, fetch_product_page
from .schemas import SearchByUrlRequest, SearchResponse
from .search import run_search

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
log = logging.getLogger("alter")

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_IMAGE_BYTES = 5 * 1024 * 1024

app = FastAPI(title="Alter API", version="0.1.0", description="Alternativas de segunda mano que ayudan al planeta")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health() -> dict:
    return {"status": "ok", "ai_enabled": settings.ai_enabled, "demo_mode": settings.demo_mode}


def _log_ai_failure(exc: Exception, what: str) -> None:
    """Claude ha fallado: se registra el motivo y la búsqueda sigue sin IA."""
    if isinstance(exc, anthropic.APIStatusError):
        log.error("Claude falló analizando %s (HTTP %s): %s", what, exc.status_code, exc.message)
    else:
        log.exception("Claude falló analizando %s", what)


@app.post("/api/search/url", response_model=SearchResponse)
async def search_by_url(body: SearchByUrlRequest) -> SearchResponse:
    url = str(body.url)
    try:
        await assert_safe_url(url)
    except UnsafeUrlError as exc:
        raise HTTPException(400, str(exc)) from exc

    page = None
    try:
        page = await fetch_product_page(url)
    except UnsafeUrlError as exc:
        raise HTTPException(400, str(exc)) from exc
    except httpx.HTTPError as exc:
        # Muchas tiendas bloquean descargas automáticas: seguimos solo con el enlace.
        log.info("No se pudo descargar %s: %s", url, exc)

    ai_used = True
    try:
        profile = await ai.analyze_page(page, url, body.notes)
    except Exception as exc:  # noqa: BLE001 - sin IA la búsqueda sigue funcionando
        _log_ai_failure(exc, url)
        profile, ai_used = ai.heuristic_page_profile(page, url, body.notes), False
    return await run_search(profile, source_image=page.image if page else None, ai_used=ai_used)


@app.post("/api/search/image", response_model=SearchResponse)
async def search_by_image(
    image: UploadFile = File(...),
    description: str = Form("", max_length=1000),
    new_price_eur: float | None = Form(None, gt=0),
) -> SearchResponse:
    if image.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(415, "Formato de imagen no admitido. Usa JPG, PNG, WEBP o GIF.")
    data = await image.read(MAX_IMAGE_BYTES + 1)
    if len(data) > MAX_IMAGE_BYTES:
        raise HTTPException(413, "La imagen es demasiado grande (máximo 5 MB).")
    if not data:
        raise HTTPException(400, "La imagen está vacía.")
    if not settings.ai_enabled and not description.strip():
        raise HTTPException(400, "Describe el objeto para poder buscarlo.")

    ai_used = True
    try:
        profile = await ai.analyze_image(data, image.content_type, description.strip(), new_price_eur)
    except Exception as exc:  # noqa: BLE001 - sin IA solo podemos usar la descripción
        _log_ai_failure(exc, "una imagen")
        if not description.strip():
            raise HTTPException(503, "Ahora mismo no podemos analizar fotos. Describe el objeto y vuelve a buscar.") from exc
        profile, ai_used = ai.heuristic_profile(description.strip(), None, new_price_eur), False
    return await run_search(profile, ai_used=ai_used)
