"""Búsqueda en las plataformas de segunda mano (Apify) y enlaces directos para las demás."""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass
from functools import lru_cache
from typing import Any, Callable
from urllib.parse import quote_plus

import httpx

from .config import settings
from .product_page import parse_price
from .schemas import Listing, PlatformLink

log = logging.getLogger("alter.platforms")

APIFY_RUN_URL = "https://api.apify.com/v2/acts/{actor}/run-sync-get-dataset-items"


@dataclass(frozen=True)
class Platform:
    key: str
    name: str
    type: str  # "apify" | "link"
    priority: int
    sponsored: bool
    color: str
    actor: str | None = None
    max_results: int = 10
    search_url: str | None = None


@lru_cache
def load_platforms() -> dict[str, Platform]:
    data = json.loads(settings.platforms_file.read_text(encoding="utf-8"))
    platforms = {}
    for key, cfg in data["platforms"].items():
        platforms[key] = Platform(
            key=key,
            name=cfg["name"],
            type=cfg["type"],
            priority=int(cfg.get("priority", 0)),
            sponsored=bool(cfg.get("sponsored", False)),
            color=cfg.get("color", "#6C3CE1"),
            actor=cfg.get("actor"),
            max_results=int(cfg.get("max_results", settings.max_results_per_platform)),
            search_url=cfg.get("search_url"),
        )
    return platforms


# ---------------------------------------------------------------------------
# Entrada de cada actor de Apify
# ---------------------------------------------------------------------------

def _input_wallapop(query: str, limit: int) -> dict:
    return {"keyword": query, "order_by": "most_relevance", "max_pages": 1}


def _input_milanuncios(query: str, limit: int) -> dict:
    return {"keywords": query, "maxItems": limit, "maxPages": 1, "fetchDetails": False, "stripSellerPII": True}


def _input_vinted(query: str, limit: int) -> dict:
    # Con la URL de vinted.es los resultados son de España; con "keywords" a veces llegaban de otros países.
    url = f"https://www.vinted.es/catalog?search_text={quote_plus(query)}"
    return {"startUrls": [{"url": url}], "maxProducts": limit}


def _input_ebay(query: str, limit: int) -> dict:
    return {
        "searchQuery": query,
        "marketplace": "ebay.es",
        "mode": "active",
        "condition": "used",
        "maxItems": limit,
        "detailedItems": False,
        "includeLegacyFields": False,
        "includeSummary": False,
    }


# ---------------------------------------------------------------------------
# Normalización de la salida de cada actor
# ---------------------------------------------------------------------------

def _first(value: Any) -> Any:
    if isinstance(value, list):
        return value[0] if value else None
    return value


def _image(value: Any) -> str | None:
    value = _first(value)
    if isinstance(value, dict):
        value = value.get("url") or value.get("full_size_url") or value.get("src")
    return value if isinstance(value, str) and value.startswith("http") else None


def _norm_wallapop(item: dict) -> Listing | None:
    loc = item.get("location") or {}
    return Listing(
        id=f"wallapop-{item.get('id')}",
        platform="wallapop",
        title=item.get("title") or "",
        price_eur=parse_price(item.get("price")),
        url=item.get("url") or "",
        image=_image(item.get("image") or item.get("images")),
        location=", ".join(filter(None, [loc.get("city"), loc.get("region")])) or None,
    )


def _milanuncios_image(url: str | None) -> str | None:
    """El scraper da la URL sin tamaño y Milanuncios responde 404: hay que pedir un 'rule'."""
    if url and "images.milanuncios.com" in url and "rule=" not in url:
        return f"{url}{'&' if '?' in url else '?'}rule=detail_640x480"
    return url


def _norm_milanuncios(item: dict) -> Listing | None:
    return Listing(
        id=f"milanuncios-{item.get('id')}",
        platform="milanuncios",
        title=item.get("title") or "",
        price_eur=parse_price(item.get("price")),
        url=item.get("url") or "",
        image=_milanuncios_image(_image(item.get("images"))),
        location=", ".join(filter(None, [item.get("cityName"), item.get("provinceName")])) or None,
    )


def _norm_vinted(item: dict) -> Listing | None:
    price = item.get("price")
    if isinstance(price, dict):
        price = price.get("amount")
    return Listing(
        id=f"vinted-{item.get('id')}",
        platform="vinted",
        title=" · ".join(filter(None, [item.get("title"), item.get("brand_title")])),
        price_eur=parse_price(price),
        url=item.get("url") or "",
        image=_image(item.get("photo") or item.get("photos")),
        condition=item.get("status"),
    )


def _norm_ebay(item: dict) -> Listing | None:
    if item.get("_analytics") or item.get("_searchMeta"):
        return None
    currency = (item.get("currency") or "EUR").upper()
    if currency not in {"EUR", "€"}:
        return None  # evitamos comparar precios en otra moneda
    return Listing(
        id=f"ebay-{item.get('itemId')}",
        platform="ebay",
        title=item.get("title") or "",
        price_eur=parse_price(item.get("priceValue") if item.get("priceValue") is not None else item.get("price")),
        url=item.get("url") or "",
        image=_image(item.get("image") or item.get("images")),
        location=item.get("itemLocation"),
        condition=item.get("condition"),
    )


ADAPTERS: dict[str, tuple[Callable[[str, int], dict], Callable[[dict], Listing | None]]] = {
    "wallapop": (_input_wallapop, _norm_wallapop),
    "milanuncios": (_input_milanuncios, _norm_milanuncios),
    "vinted": (_input_vinted, _norm_vinted),
    "ebay": (_input_ebay, _norm_ebay),
}


def normalize_items(platform_key: str, items: list[dict], limit: int) -> list[Listing]:
    _, normalizer = ADAPTERS[platform_key]
    listings: list[Listing] = []
    seen: set[str] = set()
    for raw in items:
        if not isinstance(raw, dict):
            continue
        try:
            listing = normalizer(raw)
        except Exception:  # noqa: BLE001 - un anuncio raro no debe tumbar la búsqueda
            log.debug("Anuncio de %s ignorado: %r", platform_key, raw)
            continue
        if not listing or not listing.title or not listing.url.startswith("http") or listing.id in seen:
            continue
        if listing.price_eur is not None and listing.price_eur <= 1:
            listing.price_eur = None  # 0 € o 1 € suele ser «a convenir», no un precio real
        seen.add(listing.id)
        listings.append(listing)
        if len(listings) >= limit:
            break
    return listings


async def search_apify(platform: Platform, query: str, client: httpx.AsyncClient) -> list[Listing]:
    build_input, _ = ADAPTERS[platform.key]
    resp = await client.post(
        APIFY_RUN_URL.format(actor=platform.actor),
        params={"timeout": int(settings.apify_timeout_s), "clean": "true"},
        headers={"Authorization": f"Bearer {settings.apify_token}"},
        json=build_input(query, platform.max_results),
        timeout=settings.apify_timeout_s + 15,
    )
    resp.raise_for_status()
    items = resp.json()
    return normalize_items(platform.key, items if isinstance(items, list) else [], platform.max_results)


def build_links(query: str) -> list[PlatformLink]:
    links = []
    for p in sorted(load_platforms().values(), key=lambda p: -p.priority):
        if p.type == "link" and p.search_url:
            links.append(PlatformLink(platform=p.key, name=p.name, url=p.search_url.format(query=quote_plus(query))))
    return links
