"""Recuento de usuarios únicos que buscan, por mes (para el coste por usuario del panel /admin).

Privacidad: no se guardan IPs ni se pone nada en el dispositivo del usuario (ni cookies ni almacenamiento).
Cada búsqueda se convierte en un hash irreversible de IP + navegador + una sal secreta que cambia cada mes,
así que solo sirve para contar personas distintas dentro de un mismo mes: no permite identificar a nadie
ni seguirlo de un mes a otro.

Persistencia: Render (plan gratuito) no tiene disco, así que los recuentos se guardan en un almacén
clave-valor de Apify («alter-usage»), uno por mes. En memoria se acumula lo nuevo y se vuelca cada pocos
minutos y al apagar el servidor. Sin token de Apify, los recuentos solo viven en memoria.
"""

from __future__ import annotations

import asyncio
import hashlib
import json
import logging
from datetime import datetime, timezone

import httpx
from fastapi import Request

from .config import settings

log = logging.getLogger("alter.usage")

APIFY_API = "https://api.apify.com/v2"
STORE_NAME = "alter-usage"
FLUSH_EVERY_S = 120

_pending_users: dict[str, set[str]] = {}  # mes -> hashes aún no guardados
_pending_searches: dict[str, int] = {}  # mes -> búsquedas aún no guardadas
_first_seen: dict[str, str] = {}  # mes -> primera búsqueda contada en este proceso (ISO)
_saved: dict[str, dict] = {}  # mes -> último registro leído/escrito {"users": [...], "searches": n}
_store_id: str | None = None
_lock = asyncio.Lock()


def _month(now: datetime | None = None) -> str:
    return (now or datetime.now(timezone.utc)).strftime("%Y-%m")


def _salt() -> str:
    # Secreto estable entre reinicios: el propio, o uno derivado de un token que ya existe.
    return settings.usage_salt or hashlib.sha256(f"alter:{settings.apify_token or 'local'}".encode()).hexdigest()


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:  # detrás del proxy de Render: la primera IP es la del usuario
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "?"


def visitor_hash(ip: str, user_agent: str, month: str) -> str:
    raw = f"{_salt()}|{month}|{ip}|{user_agent}"
    return hashlib.sha256(raw.encode()).hexdigest()[:20]


def record_search(request: Request) -> None:
    """Apunta una búsqueda y a quién la hace (solo su hash del mes)."""
    now = datetime.now(timezone.utc)
    month = _month(now)
    _first_seen.setdefault(month, now.isoformat())
    h = visitor_hash(_client_ip(request), request.headers.get("user-agent", ""), month)
    _pending_users.setdefault(month, set()).add(h)
    _pending_searches[month] = _pending_searches.get(month, 0) + 1


# ---------------------------------------------------------------------------
# Almacén en Apify
# ---------------------------------------------------------------------------

def _headers() -> dict:
    return {"Authorization": f"Bearer {settings.apify_token}"}


async def _store(client: httpx.AsyncClient) -> str:
    global _store_id
    if _store_id is None:
        r = await client.post(f"{APIFY_API}/key-value-stores", params={"name": STORE_NAME}, headers=_headers())
        r.raise_for_status()
        _store_id = r.json()["data"]["id"]
    return _store_id


async def _read(client: httpx.AsyncClient, month: str) -> dict:
    store = await _store(client)
    r = await client.get(f"{APIFY_API}/key-value-stores/{store}/records/month-{month}", headers=_headers())
    if r.status_code == 404:
        return {"users": [], "searches": 0}
    r.raise_for_status()
    return r.json()


async def flush() -> None:
    """Vuelca lo acumulado en memoria al almacén (sumándolo a lo que ya hubiera)."""
    if not settings.apify_token or not (_pending_users or _pending_searches):
        return
    async with _lock:
        months = set(_pending_users) | set(_pending_searches)
        try:
            async with httpx.AsyncClient(timeout=20) as client:
                store = await _store(client)
                for month in sorted(months):
                    users = _pending_users.get(month, set())
                    searches = _pending_searches.get(month, 0)
                    current = await _read(client, month)
                    record = {
                        "users": sorted(set(current.get("users", [])) | users),
                        "searches": int(current.get("searches", 0)) + searches,
                        # Desde cuándo se cuenta este mes (el recuento pudo empezar a mitad de mes).
                        "since": current.get("since") or _first_seen.get(month),
                    }
                    r = await client.put(
                        f"{APIFY_API}/key-value-stores/{store}/records/month-{month}",
                        headers={**_headers(), "Content-Type": "application/json"},
                        content=json.dumps(record),
                    )
                    r.raise_for_status()
                    _saved[month] = record
                    # Solo se descuenta lo que se ha guardado (pudo llegar más mientras tanto).
                    _pending_users[month] = _pending_users.get(month, set()) - users
                    _pending_searches[month] = _pending_searches.get(month, 0) - searches
                    if not _pending_users[month]:
                        del _pending_users[month]
                    if not _pending_searches[month]:
                        del _pending_searches[month]
        except Exception as exc:  # noqa: BLE001 - se reintentará en el siguiente volcado
            log.warning("No se pudieron guardar los recuentos de uso: %s", exc)


async def flush_periodically() -> None:
    while True:
        await asyncio.sleep(FLUSH_EVERY_S)
        await flush()


async def monthly_counts(months: list[str]) -> dict[str, dict]:
    """Usuarios únicos y búsquedas de cada mes (lo guardado más lo pendiente de guardar)."""
    stored: dict[str, dict] = {}
    if settings.apify_token:
        try:
            async with httpx.AsyncClient(timeout=20) as client:
                records = await asyncio.gather(*(_read(client, m) for m in months))
            stored = dict(zip(months, records))
            _saved.update(stored)
        except Exception as exc:  # noqa: BLE001
            log.warning("No se pudieron leer los recuentos de uso: %s", exc)
            stored = {m: _saved[m] for m in months if m in _saved}
    result = {}
    for m in months:
        rec = stored.get(m, {"users": [], "searches": 0})
        users = set(rec.get("users", [])) | _pending_users.get(m, set())
        result[m] = {
            "users": len(users),
            "searches": int(rec.get("searches", 0)) + _pending_searches.get(m, 0),
            "since": rec.get("since") or _first_seen.get(m),
        }
    return result
