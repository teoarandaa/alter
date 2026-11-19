"""Anuncios de ejemplo para probar Alter sin token de Apify.

Los enlaces llevan a la búsqueda real de cada plataforma, no a anuncios inventados.
"""

from __future__ import annotations

import hashlib
import random
from urllib.parse import quote_plus

from .platforms import Platform
from .schemas import Listing, ProductProfile

SEARCH_URLS = {
    "wallapop": "https://es.wallapop.com/app/search?keywords={q}",
    "milanuncios": "https://www.milanuncios.com/anuncios/?s={q}",
    "vinted": "https://www.vinted.es/catalog?search_text={q}",
    "ebay": "https://www.ebay.es/sch/i.html?_nkw={q}&LH_ItemCondition=3000",
}
CONDITIONS = ["Como nuevo", "En buen estado", "Nuevo con etiquetas", "Usado", "En su caja"]
CITIES = ["Madrid", "Barcelona", "Valencia", "Sevilla", "Bilbao", "Zaragoza", "Málaga"]
SUFFIXES = ["", " - poco uso", " (como nuevo)", " + accesorios", " con factura", " impecable"]


def demo_listings(platform: Platform, profile: ProductProfile, query: str) -> list[Listing]:
    seed = int(hashlib.sha256(f"{platform.key}:{query}".encode()).hexdigest()[:8], 16)
    rng = random.Random(seed)
    base_price = profile.new_price_eur or rng.choice([60, 120, 250, 480])
    count = rng.randint(2, min(5, platform.max_results))
    listings = []
    for i in range(count):
        price = round(base_price * rng.uniform(0.35, 0.85), 0)
        listings.append(
            Listing(
                id=f"demo-{platform.key}-{i}",
                platform=platform.key,
                title=f"{profile.name}{rng.choice(SUFFIXES)}",
                price_eur=price,
                url=SEARCH_URLS[platform.key].format(q=quote_plus(query)),
                location=rng.choice(CITIES),
                condition=rng.choice(CONDITIONS),
            )
        )
    return listings
