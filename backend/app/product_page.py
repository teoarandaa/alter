"""Descarga la página del producto nuevo y extrae lo útil (título, precio, imagen, texto).

Como la URL la pone el usuario, se valida cada salto (también las redirecciones)
para no hacer peticiones a direcciones internas (SSRF).
"""

from __future__ import annotations

import asyncio
import ipaddress
import json
import re
import socket
from dataclasses import dataclass, field
from urllib.parse import urljoin, urlparse

import httpx
from bs4 import BeautifulSoup

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/131.0 Safari/537.36 AlterBot/1.0"
)
MAX_BYTES = 3_000_000
MAX_REDIRECTS = 5
MAX_TEXT_CHARS = 6_000


class UnsafeUrlError(ValueError):
    pass


@dataclass
class PageInfo:
    url: str
    title: str | None = None
    description: str | None = None
    image: str | None = None
    price_eur: float | None = None
    brand: str | None = None
    text: str = ""
    structured: list[dict] = field(default_factory=list)
    requested_url: str | None = None

    @property
    def redirected_away(self) -> bool:
        """True si la tienda nos mandó a otra página (p. ej. producto descatalogado → catálogo)."""
        if not self.requested_url:
            return False
        return urlparse(self.requested_url).path.rstrip("/") != urlparse(self.url).path.rstrip("/")

    def as_prompt(self) -> str:
        if self.redirected_away:
            return (
                f"URL pedida por el usuario: {self.requested_url}\n"
                f"La tienda redirigió a otra página ({self.url}, título: {self.title!r}), probablemente porque el "
                "producto ya no está disponible. Deduce el producto sobre todo a partir de la URL pedida."
            )
        parts = [f"URL: {self.url}"]
        if self.title:
            parts.append(f"Título: {self.title}")
        if self.brand:
            parts.append(f"Marca: {self.brand}")
        if self.price_eur is not None:
            parts.append(f"Precio detectado: {self.price_eur} EUR")
        if self.description:
            parts.append(f"Descripción: {self.description}")
        if self.structured:
            parts.append("Datos estructurados (JSON-LD):\n" + json.dumps(self.structured, ensure_ascii=False)[:3000])
        if self.text:
            parts.append("Texto de la página (recortado):\n" + self.text)
        return "\n\n".join(parts)


def _is_public_ip(ip: str) -> bool:
    addr = ipaddress.ip_address(ip)
    return not (
        addr.is_private
        or addr.is_loopback
        or addr.is_link_local
        or addr.is_multicast
        or addr.is_reserved
        or addr.is_unspecified
    )


async def assert_safe_url(url: str) -> None:
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"} or not parsed.hostname:
        raise UnsafeUrlError("Solo se admiten enlaces http(s).")
    loop = asyncio.get_running_loop()
    try:
        infos = await loop.getaddrinfo(parsed.hostname, parsed.port or (443 if parsed.scheme == "https" else 80))
    except socket.gaierror as exc:
        raise UnsafeUrlError("No se puede resolver el dominio del enlace.") from exc
    for info in infos:
        if not _is_public_ip(info[4][0]):
            raise UnsafeUrlError("El enlace apunta a una dirección no permitida.")


def parse_price(value: object) -> float | None:
    """Convierte '1.299,99 €', '1299.99', 49 ... en float."""
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return float(value)
    text = re.sub(r"[^\d,.\-]", "", str(value))
    if not text:
        return None
    if "," in text and "." in text:
        # El separador que aparece último es el decimal.
        if text.rfind(",") > text.rfind("."):
            text = text.replace(".", "").replace(",", ".")
        else:
            text = text.replace(",", "")
    elif "," in text:
        head, _, tail = text.rpartition(",")
        text = f"{head.replace(',', '')}.{tail}" if len(tail) <= 2 else text.replace(",", "")
    elif text.count(".") > 1 or (text.count(".") == 1 and len(text.rpartition(".")[2]) == 3):
        text = text.replace(".", "")
    try:
        return float(text)
    except ValueError:
        return None


def _walk_jsonld(node: object) -> list[dict]:
    found: list[dict] = []
    if isinstance(node, list):
        for item in node:
            found.extend(_walk_jsonld(item))
    elif isinstance(node, dict):
        if "@graph" in node:
            found.extend(_walk_jsonld(node["@graph"]))
        types = node.get("@type")
        types = types if isinstance(types, list) else [types]
        if "Product" in types:
            found.append(node)
    return found


def extract_page_info(url: str, html: str) -> PageInfo:
    soup = BeautifulSoup(html, "html.parser")
    info = PageInfo(url=url)

    def meta(*names: str) -> str | None:
        for name in names:
            tag = soup.find("meta", attrs={"property": name}) or soup.find("meta", attrs={"name": name})
            if tag and tag.get("content"):
                return tag["content"].strip()
        return None

    info.title = meta("og:title", "twitter:title") or (soup.title.string.strip() if soup.title and soup.title.string else None)
    info.description = meta("og:description", "description", "twitter:description")
    image = meta("og:image", "og:image:secure_url", "twitter:image")
    info.image = urljoin(url, image) if image else None
    info.price_eur = parse_price(meta("product:price:amount", "og:price:amount"))

    for script in soup.find_all("script", attrs={"type": "application/ld+json"}):
        try:
            data = json.loads(script.string or "")
        except (json.JSONDecodeError, TypeError):
            continue
        for product in _walk_jsonld(data):
            slim = {k: product.get(k) for k in ("name", "brand", "model", "sku", "material", "description", "offers", "image") if product.get(k)}
            info.structured.append(slim)
            brand = product.get("brand")
            if isinstance(brand, dict):
                brand = brand.get("name")
            if brand and not info.brand:
                info.brand = str(brand)
            offers = product.get("offers")
            offers = offers[0] if isinstance(offers, list) and offers else offers
            if isinstance(offers, dict) and info.price_eur is None:
                info.price_eur = parse_price(offers.get("price") or offers.get("lowPrice"))
            if not info.image and product.get("image"):
                img = product["image"]
                img = img[0] if isinstance(img, list) else img
                img = img.get("url") if isinstance(img, dict) else img
                if isinstance(img, str):
                    info.image = urljoin(url, img)

    for tag in soup(["script", "style", "noscript", "svg", "header", "footer", "nav"]):
        tag.decompose()
    text = re.sub(r"\s+", " ", soup.get_text(" ")).strip()
    info.text = text[:MAX_TEXT_CHARS]
    return info


async def fetch_product_page(url: str) -> PageInfo:
    headers = {"User-Agent": USER_AGENT, "Accept-Language": "es-ES,es;q=0.9"}
    async with httpx.AsyncClient(timeout=15, headers=headers, follow_redirects=False) as client:
        current = url
        for _ in range(MAX_REDIRECTS + 1):
            await assert_safe_url(current)
            async with client.stream("GET", current) as resp:
                if resp.is_redirect and resp.headers.get("location"):
                    current = urljoin(current, resp.headers["location"])
                    continue
                resp.raise_for_status()
                chunks: list[bytes] = []
                size = 0
                async for chunk in resp.aiter_bytes():
                    size += len(chunk)
                    if size > MAX_BYTES:
                        break
                    chunks.append(chunk)
                html = b"".join(chunks).decode(resp.encoding or "utf-8", errors="replace")
                info = extract_page_info(str(resp.url), html)
                info.requested_url = url
                return info
        raise UnsafeUrlError("Demasiadas redirecciones.")
