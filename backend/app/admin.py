"""Panel privado de gastos: junta en una sola respuesta lo que cuesta Alter.

- Claude: API de uso y costes de Anthropic (necesita ANTHROPIC_ADMIN_KEY). Llega con 4-24 h de retraso y
  solo cubre el último año (y nunca antes del 1 de enero de 2026).
- Apify: plan, gasto del ciclo de facturación actual, gasto por día y por web (con el APIFY_TOKEN de siempre).
  Las búsquedas se estiman con las ejecuciones de los scrapers generalistas.

Las cifras se calculan para una franja de tiempo (ciclo actual, 1 día, 1 semana… o todo el histórico).
No se guarda nada: cada consulta pregunta a los servicios y el resultado se cachea unos minutos.
Cada bloque falla por separado: si un servicio no responde, el resto del panel sigue funcionando.
"""

from __future__ import annotations

import asyncio
import logging
import time
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from typing import Any, Literal

import anthropic
import httpx

from . import usage
from .config import settings
from .platforms import load_platforms

log = logging.getLogger("alter.admin")

APIFY_API = "https://api.apify.com/v2"
CACHE_TTL_S = 300
MIN_REFRESH_S = 30
MAX_RUN_PAGES = 50
MAX_CYCLES = 40  # ciclos de Apify que se recorren como mucho (más de 3 años)
CLAUDE_FIRST_DAY = datetime(2026, 1, 1, tzinfo=timezone.utc)  # la API de costes no tiene datos anteriores
CLAUDE_MAX_DAYS = 31  # días como mucho por petición a la API de costes

Range = Literal["cycle", "1d", "7d", "30d", "90d", "180d", "365d", "all"]
PER_USER_MONTHS = 12  # meses que se muestran en el coste por usuario

RANGE_DAYS = {"1d": 1, "7d": 7, "30d": 30, "90d": 90, "180d": 180, "365d": 365}

_cache: dict[str, dict[str, Any]] = {}  # franja -> {"at": ..., "data": ...}
_actor_ids: dict[str, str] = {}  # "usuario~actor" -> id interno de Apify
_closed_cycles: dict[str, dict] = {}  # ciclos de Apify ya cerrados (no cambian): inicio -> datos


def _iso(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


def _parse_dt(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def _day(dt: datetime) -> datetime:
    return dt.replace(hour=0, minute=0, second=0, microsecond=0)


def _month_period(now: datetime) -> tuple[datetime, datetime]:
    start = _day(now).replace(day=1)
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

def _apify_headers() -> dict:
    return {"Authorization": f"Bearer {settings.apify_token}"}


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


async def _resolve_actor_ids(client: httpx.AsyncClient) -> dict[str, str]:
    """Id interno de cada actor -> clave de la plataforma (las ejecuciones solo traen el id)."""
    names = _actor_names()
    missing = [n for n in names if n not in _actor_ids]

    async def resolve(name: str) -> None:
        try:
            r = await client.get(f"{APIFY_API}/acts/{name}", headers=_apify_headers())
            r.raise_for_status()
            _actor_ids[name] = r.json()["data"]["id"]
        except Exception:  # noqa: BLE001 - un actor no encontrado no debe romper el panel
            log.warning("No se pudo resolver el actor de Apify %s", name)

    await asyncio.gather(*(resolve(n) for n in missing))
    return {_actor_ids[n]: key for n, key in names.items() if n in _actor_ids}


async def _apify_account(client: httpx.AsyncClient) -> dict:
    """Plan, fecha de alta y ciclo de facturación actual de Apify."""
    if not settings.apify_token:
        return {"status": "not_configured", "message": "Falta APIFY_TOKEN en el backend."}
    try:
        me, usage = await asyncio.gather(
            client.get(f"{APIFY_API}/users/me", headers=_apify_headers()),
            client.get(f"{APIFY_API}/users/me/usage/monthly", headers=_apify_headers()),
        )
        me.raise_for_status()
        usage.raise_for_status()
        user = me.json()["data"]
        plan = user.get("plan") or {}
        data = usage.json()["data"]
        return {
            "status": "ok",
            "created_at": _parse_dt(user["createdAt"]),
            "plan": plan.get("id"),
            "included_usd": plan.get("monthlyUsageCreditsUsd"),
            "limit_usd": plan.get("maxMonthlyUsageUsd"),
            "cycle_start": _parse_dt(data["usageCycle"]["startAt"]),
            "cycle_end": _parse_dt(data["usageCycle"]["endAt"]) + timedelta(milliseconds=1),
            "cycle_usd": float(data.get("totalUsageCreditsUsdAfterVolumeDiscount") or 0),
            "current_cycle": data,
        }
    except Exception as exc:  # noqa: BLE001
        log.warning("Panel: fallo consultando la cuenta de Apify: %s", exc)
        return _error(exc)


async def _apify_daily(client: httpx.AsyncClient, account: dict, start: datetime, end: datetime) -> list[dict]:
    """Gasto diario de Apify entre start y end: recorre los ciclos de facturación que tocan la franja."""
    days: list[dict] = []
    cursor = start
    for _ in range(MAX_CYCLES):
        if cursor >= end:
            break
        cached = next((c["data"] for c in _closed_cycles.values() if c["start"] <= cursor < c["end"]), None)
        if account["cycle_start"] <= cursor < account["cycle_end"]:
            data = account["current_cycle"]
        elif cached is not None:
            data = cached
        else:
            r = await client.get(
                f"{APIFY_API}/users/me/usage/monthly",
                params={"date": cursor.date().isoformat()},
                headers=_apify_headers(),
            )
            r.raise_for_status()
            data = r.json()["data"]
            cycle_start = _parse_dt(data["usageCycle"]["startAt"])
            cycle_end = _parse_dt(data["usageCycle"]["endAt"]) + timedelta(milliseconds=1)
            if cycle_end <= account["cycle_start"]:  # ciclo cerrado: ya no cambia
                _closed_cycles[_iso(cycle_start)] = {"start": cycle_start, "end": cycle_end, "data": data}
        for d in data.get("dailyServiceUsages", []):
            day = _parse_dt(d["date"])
            if start <= day < end:
                days.append(d)
        cursor = _parse_dt(data["usageCycle"]["endAt"]) + timedelta(milliseconds=1)
    return days


async def _apify(client: httpx.AsyncClient, account: dict, start: datetime, end: datetime) -> dict:
    if account["status"] != "ok":
        return {k: v for k, v in account.items() if k in ("status", "message")}
    try:
        days, ids = await asyncio.gather(_apify_daily(client, account, start, end), _resolve_actor_ids(client))

        daily = [
            {"date": d["date"][:10], "usd": round(float(d.get("totalUsageCreditsUsd") or 0), 4)} for d in days
        ]
        by_service: dict[str, float] = defaultdict(float)
        for d in days:
            for service, info in (d.get("serviceUsage") or {}).items():
                by_service[service] += float(info.get("baseAmountUsd") or 0)

        # Gasto por web: se suman las ejecuciones de cada actor dentro de la franja.
        runs: dict[str, dict] = defaultdict(lambda: {"runs": 0, "usd": 0.0})
        offset, done = 0, False
        for _ in range(MAX_RUN_PAGES):
            r = await client.get(
                f"{APIFY_API}/actor-runs",
                params={"desc": 1, "limit": 1000, "offset": offset},
                headers=_apify_headers(),
            )
            r.raise_for_status()
            items = r.json()["data"]["items"]
            for run in items:
                started = _parse_dt(run["startedAt"])
                if started < start:
                    done = True
                    break
                if started >= end:
                    continue
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
        return {
            "status": "ok",
            "usd": round(sum(x["usd"] for x in daily), 4),
            "plan": account["plan"],
            "included_usd": account["included_usd"],
            "limit_usd": account["limit_usd"],
            "cycle_start": _iso(account["cycle_start"]),
            "cycle_end": _iso(account["cycle_end"]),
            "cycle_usd": round(account["cycle_usd"], 4),
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
    today = _day(now)
    # La API solo cubre el último año y desde 2026; los extremos se redondean al día (UTC).
    first = max(start, CLAUDE_FIRST_DAY, today - timedelta(days=364))
    # Se pide hasta mañana para incluir lo que haya de hoy.
    last = min(end, today + timedelta(days=1))
    empty = {"status": "ok", "usd": 0.0, "requests": 0, "daily": [], "by_model": [], "data_refreshed_at": None}
    if last <= first:
        return {**empty, "partial": start < first}
    try:
        client = anthropic.AsyncAnthropic(api_key=settings.anthropic_admin_key, max_retries=1, timeout=30)

        async def fetch(a: datetime, b: datetime):
            return await client.beta.organization.analytics.cost.list(
                starting_at=a,
                ending_at=b,
                time_bucket_width="1d",
                group_by=["model"],
                order_by="time",
                order="asc",
                limit=1000,
            )

        daily: dict[str, float] = defaultdict(float)
        models: dict[str, dict] = defaultdict(lambda: {"usd": 0.0, "requests": 0})
        refreshed = None
        # Cada petición cubre como mucho 31 días: las franjas largas se piden por trozos.
        chunk_start = first
        while chunk_start < last:
            chunk_end = min(chunk_start + timedelta(days=CLAUDE_MAX_DAYS), last)
            try:
                page = await fetch(chunk_start, chunk_end)
            except anthropic.BadRequestError:
                # Por si la API no acepta un final en el futuro: se pide hasta hoy a las 00:00 UTC.
                if chunk_end <= today or today <= chunk_start:
                    break
                page = await fetch(chunk_start, today)
            async for row in page:
                usd = float(row.cost.amount) / 100  # viene en céntimos
                daily[row.starting_at.date().isoformat()] += usd
                model = row.group.model or "otros"
                models[model]["usd"] += usd
                models[model]["requests"] += row.cost.requests or 0
            if page.data_refreshed_at:
                refreshed = page.data_refreshed_at
            chunk_start = chunk_end

        return {
            "status": "ok",
            "usd": round(sum(daily.values()), 4),
            "requests": sum(m["requests"] for m in models.values()),
            "daily": [{"date": d, "usd": round(u, 4)} for d, u in sorted(daily.items())],
            "by_model": sorted(
                ({"model": m, "usd": round(v["usd"], 4), "requests": v["requests"]} for m, v in models.items()),
                key=lambda x: x["usd"],
                reverse=True,
            ),
            "data_refreshed_at": _iso(refreshed) if refreshed else None,
            # True si la franja empieza antes de lo que la API de costes puede dar.
            "partial": start < first,
        }
    except Exception as exc:  # noqa: BLE001
        log.warning("Panel: fallo consultando el coste de Claude: %s", exc)
        return _error(exc)


# ---------------------------------------------------------------------------
# Coste por usuario y mes
# ---------------------------------------------------------------------------

def _month_starts(first: datetime, now: datetime) -> list[datetime]:
    months, m = [], first.replace(day=1)
    while m <= now:
        months.append(m)
        m = (m + timedelta(days=32)).replace(day=1)
    return months


async def _per_user(client: httpx.AsyncClient, account: dict, now: datetime) -> dict:
    """Coste de cada mes natural entre los usuarios únicos que buscaron ese mes."""
    first = _day(now).replace(day=1)
    for _ in range(PER_USER_MONTHS - 1):
        first = (first - timedelta(days=1)).replace(day=1)
    if account.get("status") == "ok":  # no tiene sentido empezar antes del alta en Apify
        first = max(first, _day(account["created_at"]).replace(day=1))
    tomorrow = _day(now) + timedelta(days=1)
    months = _month_starts(first, now)
    keys = [m.strftime("%Y-%m") for m in months]

    apify_by_month: dict[str, float] = defaultdict(float)
    apify_ok = account.get("status") == "ok"
    if apify_ok:
        try:
            for d in await _apify_daily(client, account, first, tomorrow):
                apify_by_month[d["date"][:7]] += float(d.get("totalUsageCreditsUsd") or 0)
        except Exception as exc:  # noqa: BLE001
            log.warning("Panel: fallo leyendo el gasto mensual de Apify: %s", exc)
            apify_ok = False
    claude, counts = await asyncio.gather(_claude(first, tomorrow), usage.monthly_counts(keys))
    claude_ok = claude.get("status") == "ok"
    claude_by_month: dict[str, float] = defaultdict(float)
    for d in claude.get("daily", []) if claude_ok else []:
        claude_by_month[d["date"][:7]] += d["usd"]

    rows = []
    for key in keys:
        usd = apify_by_month[key] + claude_by_month[key]
        users = counts[key]["users"]
        searches = counts[key]["searches"]
        since = counts[key]["since"]
        rows.append(
            {
                "month": key,
                # Si el recuento empezó a mitad de mes, el coste por usuario de ese mes sale inflado.
                "counting_since": since,
                "partial_count": bool(since) and since[:10] > f"{key}-01",
                "current": key == now.strftime("%Y-%m"),
                "apify_usd": round(apify_by_month[key], 4),
                "claude_usd": round(claude_by_month[key], 4),
                "usd": round(usd, 4),
                "users": users,
                "searches": searches,
                "usd_per_user": round(usd / users, 4) if users else None,
                "searches_per_user": round(searches / users, 2) if users else None,
            }
        )
    return {
        "status": "ok" if apify_ok or claude_ok else "error",
        "includes_apify": apify_ok,
        "includes_claude": claude_ok,
        "months": rows,
    }


# ---------------------------------------------------------------------------
# Panel completo
# ---------------------------------------------------------------------------

def _resolve_range(range_key: Range, now: datetime, account: dict) -> tuple[datetime, datetime]:
    """Inicio y fin (exclusivo) de la franja. Las de N días terminan hoy (incluido) en UTC."""
    tomorrow = _day(now) + timedelta(days=1)
    if range_key in RANGE_DAYS:
        return tomorrow - timedelta(days=RANGE_DAYS[range_key]), tomorrow
    if range_key == "all":
        first = _day(account["created_at"]) if account.get("status") == "ok" else CLAUDE_FIRST_DAY
        return first, tomorrow
    # Ciclo de facturación actual de Apify (si no hay Apify, el mes natural).
    if account.get("status") == "ok":
        return account["cycle_start"], account["cycle_end"]
    return _month_period(now)


async def build_stats(range_key: Range = "cycle") -> dict:
    now = datetime.now(timezone.utc)
    async with httpx.AsyncClient(timeout=30) as client:
        account = await _apify_account(client)
        start, end = _resolve_range(range_key, now, account)
        apify, claude = await asyncio.gather(_apify(client, account, start, end), _claude(start, end))

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
        "period": {
            "range": range_key,
            "start": _iso(start),
            "end": _iso(end),
            "source": "apify" if range_key == "cycle" and account.get("status") == "ok" else "range",
        },
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


async def build_per_user() -> dict:
    now = datetime.now(timezone.utc)
    async with httpx.AsyncClient(timeout=30) as client:
        account = await _apify_account(client)
        return await _per_user(client, account, now)


async def _cached(key: str, refresh: bool, build) -> tuple[dict, bool]:
    entry = _cache.get(key)
    if entry is not None:
        age = time.monotonic() - entry["at"]
        if age < CACHE_TTL_S and not (refresh and age >= MIN_REFRESH_S):
            return entry["data"], True
    data = await build()
    _cache[key] = {"at": time.monotonic(), "data": data}
    return data, False


async def get_stats(range_key: Range = "cycle", refresh: bool = False) -> dict:
    # El coste por usuario va por meses y no depende de la franja elegida: se cachea aparte.
    (data, cached), (per_user, _) = await asyncio.gather(
        _cached(range_key, refresh, lambda: build_stats(range_key)),
        _cached("per_user", refresh, build_per_user),
    )
    return {**data, "per_user": per_user, "cached": cached}
