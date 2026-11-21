"""API de Alter.

Arranque en local:  uvicorn app.main:app --reload --port 8000
"""

from __future__ import annotations

import asyncio
import hmac
import logging
from contextlib import asynccontextmanager

import anthropic
import httpx
from fastapi import FastAPI, File, Form, Header, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from . import admin, ai, usage
from .config import settings
from .product_page import UnsafeUrlError, assert_safe_url, fetch_product_page
from .schemas import SearchByTextRequest, SearchByUrlRequest, SearchResponse
from .search import run_search

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
log = logging.getLogger("alter")

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_IMAGE_BYTES = 5 * 1024 * 1024

@asynccontextmanager
async def lifespan(_: FastAPI):
    # Los recuentos de usuarios se guardan cada pocos minutos y al apagar el servidor.
    task = asyncio.create_task(usage.flush_periodically())
    try:
        yield
    finally:
        task.cancel()
        await usage.flush()


app = FastAPI(
    title="Alter API",
    version="0.1.0",
    description="Alternativas de segunda mano que ayudan al planeta",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health() -> dict:
    return {"status": "ok", "ai_enabled": settings.ai_enabled, "demo_mode": settings.demo_mode}


@app.get("/api/admin/stats", include_in_schema=False)
async def admin_stats(
    range: admin.Range = "cycle",  # noqa: A002 - es el nombre del parámetro en la URL
    refresh: bool = False,
    authorization: str | None = Header(default=None),
) -> dict:
    """Panel privado de gastos. Sin ALTER_ADMIN_TOKEN configurado, no existe."""
    if not settings.admin_token:
        raise HTTPException(404, "Not Found")
    token = (authorization or "").removeprefix("Bearer ").strip()
    if not hmac.compare_digest(token.encode(), settings.admin_token.encode()):
        await asyncio.sleep(1)  # frena los intentos de adivinar la contraseña
        raise HTTPException(401, "Contraseña incorrecta.")
    return await admin.get_stats(range, refresh=refresh)


def _log_ai_failure(exc: Exception, what: str) -> None:
    """Claude ha fallado: se registra el motivo y la búsqueda sigue sin IA."""
    if isinstance(exc, anthropic.APIStatusError):
        log.error("Claude falló analizando %s (HTTP %s): %s", what, exc.status_code, exc.message)
    else:
        log.exception("Claude falló analizando %s", what)


@app.post("/api/search/url", response_model=SearchResponse)
async def search_by_url(body: SearchByUrlRequest, request: Request) -> SearchResponse:
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
    usage.record_search(request)
    return await run_search(profile, source_image=page.image if page else None, ai_used=ai_used)


@app.post("/api/search/text", response_model=SearchResponse)
async def search_by_text(body: SearchByTextRequest, request: Request) -> SearchResponse:
    description = body.description.strip()
    if len(description) < 3:
        raise HTTPException(400, "Describe un poco más lo que buscas.")
    ai_used = True
    try:
        profile = await ai.analyze_text(description, body.new_price_eur)
    except Exception as exc:  # noqa: BLE001 - sin IA se busca con las palabras de la descripción
        _log_ai_failure(exc, "una descripción")
        profile, ai_used = ai.heuristic_profile(description, None, body.new_price_eur), False
    usage.record_search(request)
    return await run_search(profile, ai_used=ai_used)


@app.post("/api/search/image", response_model=SearchResponse)
async def search_by_image(
    request: Request,
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
    usage.record_search(request)
    return await run_search(profile, ai_used=ai_used)
