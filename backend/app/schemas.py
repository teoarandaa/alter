"""Modelos de datos compartidos por la API."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field, HttpUrl

# Grupos de producto: deciden qué webs de segunda mano especializadas se enlazan (ver platforms.json).
CategoryGroup = Literal[
    "general", "electronica", "moda", "hogar", "deporte", "libros_ocio", "musica", "infantil", "motor", "coleccionismo"
]


class ProductProfile(BaseModel):
    """Lo que la IA entiende del objeto nuevo que el usuario quiere comprar."""

    name: str = Field(description="Nombre corto y claro del producto, en español")
    brand: str | None = Field(default=None, description="Marca, si se conoce")
    model: str | None = Field(default=None, description="Modelo o referencia, si se conoce")
    category: str = Field(description="Categoría general (p. ej. 'móviles', 'muebles', 'ropa')")
    category_group: CategoryGroup = Field(
        default="general",
        description="Grupo del producto: electronica (móviles, ordenadores, consolas, electrodomésticos pequeños), "
        "moda (ropa, calzado, bolsos, joyas), hogar (muebles, decoración, cocina), deporte (bicis, material "
        "deportivo), libros_ocio (libros, videojuegos, películas, juegos de mesa), musica (instrumentos y equipo "
        "de sonido), infantil (bebés y niños), motor (coches, motos y recambios), coleccionismo (antigüedades, "
        "monedas, arte) o general si no encaja en ninguno",
    )
    materials: list[str] = Field(default_factory=list, description="Materiales principales")
    key_features: list[str] = Field(default_factory=list, description="3-6 características clave")
    new_price_eur: float | None = Field(default=None, description="Precio nuevo en euros, si aparece")
    search_queries: list[str] = Field(
        description="2-4 búsquedas cortas (2-5 palabras) para encontrar este objeto o similares de segunda mano, "
        "de la más específica a la más general"
    )


class SearchByUrlRequest(BaseModel):
    url: HttpUrl
    notes: str | None = Field(default=None, max_length=1000)


class SearchByTextRequest(BaseModel):
    """Búsqueda describiendo el objeto con palabras, sin enlace ni foto."""

    description: str = Field(min_length=3, max_length=1000)
    new_price_eur: float | None = Field(default=None, gt=0)


class Listing(BaseModel):
    """Un anuncio de segunda mano normalizado, venga de la plataforma que venga."""

    id: str
    platform: str
    title: str
    price_eur: float | None = None
    url: str
    image: str | None = None
    location: str | None = None
    condition: str | None = None
    similarity: int | None = Field(default=None, ge=0, le=100)
    match_type: Literal["exact", "similar"] | None = None
    savings_eur: float | None = None
    savings_pct: float | None = None
    sponsored: bool = False


class PlatformLink(BaseModel):
    """Plataformas sin API: enlazamos directamente a su búsqueda."""

    platform: str
    name: str
    url: str


class PlatformStatus(BaseModel):
    platform: str
    name: str
    ok: bool
    count: int = 0
    error: str | None = None


class SearchResponse(BaseModel):
    product: ProductProfile
    source_image: str | None = None
    listings: list[Listing]
    links: list[PlatformLink]
    platforms: list[PlatformStatus]
    best_savings_pct: float | None = None
    demo_mode: bool = False
    ai_enabled: bool = True
