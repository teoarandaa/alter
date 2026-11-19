import asyncio

import pytest

from app import ai
from app.platforms import build_links, load_platforms, normalize_items
from app.product_page import UnsafeUrlError, assert_safe_url, extract_page_info, parse_price
from app.schemas import Listing, ProductProfile
from app.search import apply_savings, rank


@pytest.mark.parametrize(
    "raw, expected",
    [
        ("1.299,99 €", 1299.99),
        ("1,299.99", 1299.99),
        ("49,90", 49.9),
        ("1.299", 1299.0),
        (49, 49.0),
        ("12.5", 12.5),
        ("", None),
        (None, None),
    ],
)
def test_parse_price(raw, expected):
    assert parse_price(raw) == expected


def test_extract_page_info_reads_jsonld():
    html = """
    <html><head><title>Silla | Tienda</title>
    <meta property="og:image" content="/img/silla.jpg">
    <script type="application/ld+json">
      {"@context":"https://schema.org","@type":"Product","name":"Silla Nórdica",
       "brand":{"@type":"Brand","name":"Ikea"},"offers":{"price":"89.99","priceCurrency":"EUR"}}
    </script></head><body><p>Silla de madera de haya</p></body></html>
    """
    info = extract_page_info("https://shop.example.com/p/1", html)
    assert info.title == "Silla | Tienda"
    assert info.brand == "Ikea"
    assert info.price_eur == 89.99
    assert info.image == "https://shop.example.com/img/silla.jpg"
    assert "madera de haya" in info.text


@pytest.mark.parametrize("url", ["http://127.0.0.1/admin", "http://localhost:8000", "ftp://example.com", "http://10.0.0.5/"])
def test_unsafe_urls_rejected(url):
    with pytest.raises(UnsafeUrlError):
        asyncio.run(assert_safe_url(url))


def test_normalize_platform_items():
    wallapop = normalize_items(
        "wallapop",
        [
            {"id": "a1", "title": "iPhone 15", "price": 500, "url": "https://es.wallapop.com/item/a1",
             "image": "https://cdn.wallapop.com/a1.jpg", "location": {"city": "Madrid"}},
            {"id": "a1", "title": "duplicado", "price": 1, "url": "https://es.wallapop.com/item/a1"},
            {"id": "a2", "title": "", "url": "https://x"},
        ],
        10,
    )
    assert [l.id for l in wallapop] == ["wallapop-a1"]
    assert wallapop[0].location == "Madrid"

    vinted = normalize_items(
        "vinted",
        [{"id": 7, "title": "Chaqueta", "brand_title": "Zara", "price": {"amount": "15.0", "currency_code": "EUR"},
          "url": "https://www.vinted.es/items/7", "photo": {"url": "https://img/7.jpg"}, "status": "Muy bueno"}],
        10,
    )
    assert vinted[0].price_eur == 15.0 and vinted[0].image == "https://img/7.jpg" and "Zara" in vinted[0].title

    ebay = normalize_items(
        "ebay",
        [{"_analytics": True}, {"itemId": "1", "title": "Lamp", "priceValue": 20, "currency": "USD", "url": "https://ebay.com/itm/1"},
         {"itemId": "2", "title": "Lámpara", "priceValue": 25, "currency": "EUR", "url": "https://ebay.es/itm/2"}],
        10,
    )
    assert [l.id for l in ebay] == ["ebay-2"]


def _listing(id, platform, price, similarity=80, match="similar"):
    return Listing(id=id, platform=platform, title=id, price_eur=price, url="https://x", similarity=similarity, match_type=match)


def test_savings_and_ranking():
    items = [
        _listing("caro", "wallapop", 120),
        _listing("vinted-similar", "vinted", 50, 90),
        _listing("ebay-exact", "ebay", 70, 95, "exact"),
        _listing("wallapop-similar", "wallapop", 60, 70),
    ]
    kept = apply_savings(items, 100)
    assert "caro" not in [i.id for i in kept]
    assert next(i for i in kept if i.id == "vinted-similar").savings_pct == 50.0

    ranked = rank(kept, load_platforms())
    # Exacto primero; después la plataforma con más prioridad (Wallapop) aunque sea menos parecida.
    assert [i.id for i in ranked] == ["ebay-exact", "wallapop-similar", "vinted-similar"]


def test_links_for_platforms_without_api():
    links = build_links("silla nórdica")
    assert {l.platform for l in links} == {"cashconverters", "secondbest", "todocoleccion"}
    assert all("silla+n%C3%B3rdica" in l.url for l in links)


def test_heuristics():
    profile = ai.heuristic_profile("Auriculares Sony WH-1000XM5 | MediaMarkt", None, 299.0)
    assert profile.new_price_eur == 299.0
    assert profile.search_queries[0].startswith("Auriculares Sony")

    scored = ai.heuristic_scores(
        profile,
        [
            Listing(id="1", platform="wallapop", title="Sony WH-1000XM5 auriculares", url="https://x"),
            Listing(id="2", platform="wallapop", title="Funda para auriculares Sony", url="https://x"),
            Listing(id="3", platform="wallapop", title="Bicicleta de montaña", url="https://x"),
        ],
    )
    assert [l.id for l in scored] == ["1"]


def test_product_profile_schema_is_strict_compatible():
    """El SDK debe poder convertir los modelos a un esquema JSON para salidas estructuradas."""
    from anthropic.lib._parse._transform import transform_schema  # noqa: PLC0415

    for model in (ProductProfile, ai.ScoreResult):
        schema = transform_schema(model)
        assert schema["type"] == "object"
        assert schema.get("additionalProperties") is False


def test_redirected_page_falls_back_to_url_words():
    from app.product_page import PageInfo

    page = PageInfo(url="https://www.ikea.com/es/es/cat/productos-products/", title="Todos los productos")
    page.requested_url = "https://www.ikea.com/es/es/p/poang-sillon-abedul-chapa-s29305931/"
    assert page.redirected_away
    assert "URL pedida" in page.as_prompt()
    assert ai._slug_words(page.requested_url) == "poang sillon abedul chapa"


def test_image_search_endpoint_demo(monkeypatch):
    """Recorrido completo de la API sin claves: heurística + modo demo."""
    from fastapi.testclient import TestClient

    from app import config, main, search

    no_keys = config.Settings(anthropic_api_key=None, apify_token=None)
    for module in (config, ai, search, main):
        monkeypatch.setattr(module, "settings", no_keys, raising=False)

    client = TestClient(main.app)
    res = client.post(
        "/api/search/image",
        files={"image": ("silla.png", b"\x89PNG fake", "image/png")},
        data={"description": "Silla nórdica de madera", "new_price_eur": "120"},
    )
    assert res.status_code == 200, res.text
    body = res.json()
    assert body["demo_mode"] and not body["ai_enabled"]
    assert body["product"]["new_price_eur"] == 120
    assert body["listings"], "debería haber anuncios de ejemplo"
    assert all(0 <= l["savings_pct"] <= 100 for l in body["listings"])
    assert len(body["links"]) == 3

    bad = client.post("/api/search/image", files={"image": ("x.txt", b"hola", "text/plain")}, data={"description": "x"})
    assert bad.status_code == 415


def test_search_survives_claude_failure(monkeypatch):
    """Si Claude falla (sin crédito, caída…), la búsqueda sigue con el análisis sin IA."""
    from fastapi.testclient import TestClient

    from app import config, main, search

    keys = config.Settings(anthropic_api_key="sk-ant-test", apify_token=None)
    for module in (config, ai, search, main):
        monkeypatch.setattr(module, "settings", keys, raising=False)

    async def boom(*args, **kwargs):
        raise RuntimeError("sin crédito")

    async def no_page(url):
        raise main.httpx.ConnectError("bloqueado")

    monkeypatch.setattr(ai, "analyze_page", boom)
    monkeypatch.setattr(ai, "analyze_image", boom)
    monkeypatch.setattr(ai, "_score_with_claude", boom)
    monkeypatch.setattr(main, "fetch_product_page", no_page)
    monkeypatch.setattr(main, "assert_safe_url", lambda url: __import__("asyncio").sleep(0))

    client = TestClient(main.app)
    res = client.post("/api/search/url", json={"url": "https://www.tienda.es/p/silla-nordica-madera-123"})
    assert res.status_code == 200, res.text
    assert res.json()["ai_enabled"] is False
    assert res.json()["product"]["search_queries"][0] == "silla nordica madera"

    photo = client.post("/api/search/image", files={"image": ("a.png", b"x", "image/png")}, data={"description": ""})
    assert photo.status_code == 503


def test_heuristic_cleans_shop_words_and_free_prices():
    profile = ai.heuristic_profile("Compra un iPhone\xa016", None, 1009.0)
    assert profile.name == "iPhone 16"
    assert profile.search_queries == ["iPhone 16"]

    items = normalize_items(
        "milanuncios",
        [{"id": 1, "title": "iPhone 16", "price": 0, "url": "https://www.milanuncios.com/a-1.htm"}],
        10,
    )
    assert items[0].price_eur is None
    assert apply_savings(items, 1009.0)[0].savings_pct is None


def test_heuristic_requires_model_numbers_and_skips_broken():
    profile = ai.heuristic_profile("iPhone 16", None, 1009.0)
    titles = {
        "a": "iPhone 16 128GB Azul",
        "b": "iPhone 16e 256GB",
        "c": "Apple iPhone SE de 2016",
        "d": "Iphone 8 plus 64gb",
        "e": "iPhone 16 (No enciende)",
        "f": "iPhone 16 DIY=XR modificación",
    }
    listings = [Listing(id=k, platform="wallapop", title=v, url="https://x") for k, v in titles.items()]
    assert [l.id for l in ai.heuristic_scores(profile, listings)] == ["a", "b"]


def test_suspiciously_cheap_listings_dropped():
    items = [_listing("estafa", "milanuncios", 30), _listing("bueno", "wallapop", 370)]
    assert [i.id for i in apply_savings(items, 1009.0)] == ["bueno"]
