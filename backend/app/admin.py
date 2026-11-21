"""Panel privado de gastos: junta en una sola respuesta lo que cuesta Alter.

- Claude: API de uso y costes de Anthropic (necesita ANTHROPIC_ADMIN_KEY). Llega con 4-24 h de retraso.
- Apify: plan, gasto del ciclo de facturación, gasto por día y por web (con el APIFY_TOKEN de siempre).
  Las búsquedas se estiman con las ejecuciones de los scrapers generalistas.

No se guarda nada: cada consulta pregunta a los servicios y el resultado se cachea unos minutos.
Cada bloque falla por separado: si un servicio no responde, el resto del panel sigue funcionando.
"""

from __future__ import annotations

import asyncio
import logging
import time
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from typing import Any

import anthropic
import httpx

from .config import settings
from .platforms import load_platforms

log = logging.getLogger("alter.admin")

APIFY_API = "https://api.apify.com/v2"
CACHE_TTL_S = 300
MIN_REFRESH_S = 30
MAX_RUN_PAGES = 20

_cache: dict[str, Any] = {"at": 0.0, "data": None}
_actor_ids: dict[str, str] = {}  # "usuario~actor" -> id interno de Apify


def _iso(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


def _parse_dt(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def _month_period(now: datetime) -> tuple[datetime, datetime]:
    start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    end = (start + timedelta(days=32)).replace(day=1)
    return start, end


def _error(exc: Exception) -> dict:
    if isinstance(exc, httpx.HTTPStatusError):
        code = exc.response.status_code
        message = "Clave no válida o sin permisos." if code in (401, 403) else f"El servicio respondió con error {code}."
    elif isinstance(exc, anthropic.APIStatusError):
        code = exc.status_code
        message = (
            "La clave de Anthropic no es de administración o no tiene permisos."
            if code in (401, 403)
            else f"Anthropic respondió con error {code}: {exc.message}"
        )
    elif isinstance(exc, (httpx.TimeoutException, anthropic.APITimeoutError)):
        message = "El servicio tardó demasiado en responder."
    else:
        message = "No se pudo consultar el servicio."
    return {"status": "error", "message": message}


# ---------------------------------------------------------------------------
# Apify
# ---------------------------------------------------------------------------

def _actor_names() -> dict[str, str]:
    """Nombre del actor de Apify ("usuario~actor") -> clave de la plataforma en Alter."""
    names: dict[str, str] = {}
    for p in load_platforms().values():
        if p.actor:
            names[p.actor] = p.key
        elif p.standby_url:
            # https://usuario--actor.apify.actor -> usuario~actor
            host = httpx.URL(p.standby_url).host.split(".")[0]
            names[host.replace("--", "~", 1)] = p.key
    return names


async def _resolve_actor_ids(client: httpx.AsyncClient, headers: dict) -> dict[str, str]:
    """Id interno de cada actor -> clave de la plataforma (las ejecuciones solo traen el id)."""
    names = _actor_names()
    missing = [n for n in names if n not in _actor_ids]

    async def resolve(name: str) -> None:
        try:
            r = await client.get(f"{APIFY_API}/acts/{name}", headers=headers)
            r.raise_for_status()
            _actor_ids[name] = r.json()["data"]["id"]
        except Exception:  # noqa: BLE001 - un actor no encontrado no debe romper el panel
            log.warning("No se pudo resolver el actor de Apify %s", name)

    await asyncio.gather(*(resolve(n) for n in missing))
    return {_actor_ids[n]: key for n, key in names.items() if n in _actor_ids}


async def _apify(client: httpx.AsyncClient) -> dict:
    if not settings.apify_token:
        return {"status": "not_configured", "message": "Falta APIFY_TOKEN en el backend."}
    headers = {"Authorization": f"Bearer {settings.apify_token}"}
    try:
        me, usage, ids = await asyncio.gather(
            client.get(f"{APIFY_API}/users/me", headers=headers),
            client.get(f"{APIFY_API}/users/me/usage/monthly", headers=headers),
            _resolve_actor_ids(client, headers),
        )
        me.raise_for_status()
        usage.raise_for_status()
        plan = me.json()["data"].get("plan") or {}
        data = usage.json()["data"]
        start = _parse_dt(data["usageCycle"]["startAt"])
        end = _parse_dt(data["usageCycle"]["endAt"]) + timedelta(milliseconds=1)

        daily = [
            {"date": d["date"][:10], "usd": round(float(d.get("totalUsageCreditsUsd") or 0), 4)}
            for d in data.get("dailyServiceUsages", [])
        ]
        by_service: dict[str, float] = defaultdict(float)
        for d in data.get("dailyServiceUsages", []):
            for service, info in (d.get("serviceUsage") or {}).items():
                by_service[service] += float(info.get("baseAmountUsd") or 0)

        # Gasto por web: se suman las ejecuciones de cada actor dentro del ciclo.
        runs: dict[str, dict] = defaultdict(lambda: {"runs": 0, "usd": 0.0})
        offset, done = 0, False
        for _ in range(MAX_RUN_PAGES):
            r = await client.get(
                f"{APIFY_API}/actor-runs",
                params={"desc": 1, "limit": 1000, "offset": offset},
                headers=headers,
            )
            r.raise_for_status()
            items = r.json()["data"]["items"]
            for run in items:
                if _parse_dt(run["startedAt"]) < start:
                    done = True
                    break
                key = ids.get(run.get("actId"), "otros")
                runs[key]["runs"] += 1
                runs[key]["usd"] += float(run.get("usageTotalUsd") or 0)
            if done or len(items) < 1000:
                break
            offset += 1000

        platforms = load_platforms()
        by_platform = sorted(
            (
                {
                    "key": key,
                    "name": platforms[key].name if key in platforms else "Otros actores",
                    "runs": v["runs"],
                    "usd": round(v["usd"], 4),
                    "usd_per_run": round(v["usd"] / v["runs"], 4) if v["runs"] else None,
                }
                for key, v in runs.items()
            ),
            key=lambda x: x["usd"],
            reverse=True,
        )
        total = float(data.get("totalUsageCreditsUsdAfterVolumeDiscount") or 0)
        return {
            "status": "ok",
            "plan": plan.get("id"),
            "included_usd": plan.get("monthlyUsageCreditsUsd"),
            "limit_usd": plan.get("maxMonthlyUsageUsd"),
            "usd": round(total, 4),
            "cycle_start": _iso(start),
            "cycle_end": _iso(end),
            "daily": daily,
            "by_platform": by_platform,
            "by_service": sorted(
                ({"service": s, "usd": round(u, 4)} for s, u in by_service.items() if u >= 0.001),
                key=lambda x: x["usd"],
                reverse=True,
            ),
        }
    except Exception as exc:  # noqa: BLE001
        log.warning("Panel: fallo consultando Apify: %s", exc)
        return _error(exc)


# ---------------------------------------------------------------------------
# Claude (API de uso y costes de Anthropic)
# ---------------------------------------------------------------------------

async def _claude(start: datetime, end: datetime) -> dict:
    if not settings.anthropic_admin_key:
        return {
            "status": "not_configured",
            "message": "Falta ANTHROPIC_ADMIN_KEY (una clave de administración, no la de la API).",
        }
    now = datetime.now(timezone.utc)
    # Los extremos se redondean al día (UTC); se pide hasta mañana para incluir lo que haya de hoy.
    ending = min(end, (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0))
    if ending <= start:
        return {"status": "ok", "usd": 0.0, "requests": 0, "daily": [], "by_model": [], "data_refreshed_at": None}
    try:
        client = anthropic.AsyncAnthropic(api_key=settings.anthropic_admin_key, max_retries=1, timeout=30)

        async def fetch(until: datetime):
            return await client.beta.organization.analytics.cost.list(
                starting_at=start,
                ending_at=until,
                time_bucket_width="1d",
                group_by=["model"],
                order_by="time",
                order="asc",
                limit=1000,
            )

        try:
            page = await fetch(ending)
        except anthropic.BadRequestError:
            # Por si la API no acepta un final en el futuro: se pide hasta hoy a las 00:00 UTC.
            today = now.replace(hour=0, minute=0, second=0, microsecond=0)
            if today <= start:
                return {"status": "ok", "usd": 0.0, "requests": 0, "daily": [], "by_model": [], "data_refreshed_at": None}
            page = await fetch(today)
        daily: dict[str, float] = defaultdict(float)
        models: dict[str, dict] = defaultdict(lambda: {"usd": 0.0, "requests": 0})
        async for row in page:
            usd = float(row.cost.amount) / 100  # viene en céntimos
            daily[row.starting_at.date().isoformat()] += usd
            model = row.group.model or "otros"
            models[model]["usd"] += usd
            models[model]["requests"] += row.cost.requests or 0
        total = sum(daily.values())
        return {
            "status": "ok",
            "usd": round(total, 4),
            "requests": sum(m["requests"] for m in models.values()),
            "daily": [{"date": d, "usd": round(u, 4)} for d, u in sorted(daily.items())],
            "by_model": sorted(
                ({"model": m, "usd": round(v["usd"], 4), "requests": v["requests"]} for m, v in models.items()),
                key=lambda x: x["usd"],
                reverse=True,
            ),
            "data_refreshed_at": _iso(page.data_refreshed_at) if page.data_refreshed_at else None,
        }
    except Exception as exc:  # noqa: BLE001
        log.warning("Panel: fallo consultando el coste de Claude: %s", exc)
        return _error(exc)


# ---------------------------------------------------------------------------
# Panel completo
# ---------------------------------------------------------------------------

async def build_stats() -> dict:
    now = datetime.now(timezone.utc)
    async with httpx.AsyncClient(timeout=30) as client:
        apify = await _apify(client)
        # El periodo común es el ciclo de facturación de Apify (si no hay, el mes natural).
        if apify.get("status") == "ok":
            start, end, source = _parse_dt(apify["cycle_start"]), _parse_dt(apify["cycle_end"]), "apify"
        else:
            (start, end), source = _month_period(now), "month"
        claude = await _claude(start, end)

    usd = sum(x.get("usd", 0) for x in (claude, apify) if x.get("status") == "ok")
    searches = None
    if apify.get("status") == "ok":
        # Las webs generalistas se consultan en cada búsqueda, así que sus ejecuciones
        # dan una estimación de las búsquedas (algo alta si hubo reintentos).
        platforms = load_platforms()
        general = [
            p["runs"] for p in apify["by_platform"]
            if p["key"] in platforms and "general" in platforms[p["key"]].categories
        ]
        if general:
            searches = max(general)
    return {
        "generated_at": _iso(now),
        "period": {"start": _iso(start), "end": _iso(end), "source": source},
        "totals": {
            "usd": round(usd, 4),
            "searches": searches,
            "usd_per_search": round(usd / searches, 4) if searches else None,
            "complete": claude.get("status") == "ok" and apify.get("status") == "ok",
        },
        "claude": claude,
        "apify": apify,
        "backend": {
            "model": settings.claude_model,
            "ai_enabled": settings.ai_enabled,
            "demo_mode": settings.demo_mode,
        },
    }


async def get_stats(refresh: bool = False) -> dict:
    age = time.monotonic() - _cache["at"]
    if _cache["data"] is not None and (age < CACHE_TTL_S and not (refresh and age >= MIN_REFRESH_S)):
        return {**_cache["data"], "cached": True}
    data = await build_stats()
    _cache.update(at=time.monotonic(), data=data)
    return {**data, "cached": False}
