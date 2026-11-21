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
    general = {"cashconverters", "secondbest", "todocoleccion"}
    links = build_links("silla nórdica")
    assert {l.platform for l in links} == general
    assert all("silla+n%C3%B3rdica" in l.url for l in links)
    assert next(l for l in links if l.platform == "secondbest").url == (
        "https://secondbest.es/?s=silla+n%C3%B3rdica&post_type=product"
    )

    electronics = [l.platform for l in build_links("iphone 13", "electronica")]
    # Primero las especializadas en electrónica que solo se enlazan, después las generales.
    # Back Market, Refurbed, Amazon y CeX no salen como enlace: Alter muestra sus anuncios.
    assert electronics[0] == "rebuy"
    assert set(electronics[1:]) == general
    assert not {"backmarket", "refurbed", "amazonrenewed", "cex", "percentil", "iberlibro"} & set(electronics)

    fashion = {l.platform for l in build_links("abrigo", "moda")}
    assert {"vestiaire", "percentil", "etsyvintage"} <= fashion and "backmarket" not in fashion


def test_guess_group_without_ai():
    assert ai.guess_group("Compra un iPhone 16") == "electronica"
    assert ai.guess_group("Abrigo de lana") == "moda"
    assert ai.guess_group("Guitarra eléctrica Fender") == "musica"
    assert ai.guess_group("Algo raro") == "general"
    assert ai.heuristic_profile("Sofá de tres plazas", None, None).category_group == "hogar"


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
    assert body["product"]["category_group"] == "hogar"
    assert {l["platform"] for l in body["links"]} == {"etsyvintage", "cashconverters", "secondbest", "todocoleccion"}

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


def test_milanuncios_image_gets_size_rule():
    items = normalize_items(
        "milanuncios",
        [{"id": 1, "title": "Bici", "price": 100, "url": "https://www.milanuncios.com/a-1.htm",
          "images": ["https://images.milanuncios.com/api/v1/ma-ad-media-pro/images/abc"]}],
        10,
    )
    assert items[0].image == "https://images.milanuncios.com/api/v1/ma-ad-media-pro/images/abc?rule=detail_640x480"


def test_scrapers_chosen_by_product_group():
    platforms = load_platforms()
    def scrapers(group):
        return {p.key for p in platforms.values() if p.searchable and p.applies_to(group)}
    general = {"wallapop", "milanuncios", "vinted", "ebay"}
    assert scrapers("general") == general
    assert scrapers("moda") == general
    assert scrapers("electronica") == general | {"backmarket", "refurbed", "amazonrenewed", "cex"}
    assert scrapers("libros_ocio") == general | {"cex"}


def test_normalize_new_electronics_scrapers():
    bm = normalize_items("backmarket", [{
        "id": "ef56", "url": "https://www.backmarket.es/es-es/p/iphone-13/ef56", "title": "iPhone 13", "model": "iPhone 13",
        "price": 263, "currency": "EUR", "condition": "Correcto", "imageUrl": "https://img/bm.jpg", "warrantyMonths": 24,
    }, {"id": "usd", "url": "https://x", "title": "iPhone", "price": 1, "currency": "USD"}], 10)
    assert [l.id for l in bm] == ["backmarket-ef56"]
    assert bm[0].price_eur == 263 and bm[0].condition == "Correcto · 24 meses de garantía"

    rf = normalize_items("refurbed", [{
        "title": "iPhone 13", "price": 255, "currency": "EUR", "condition": "B",
        "variant": "128 GB | Dual-SIM | Medianoche | Grade B (14162)", "url": "https://www.refurbed.es/p/iphone-13/14162b/",
        "imageUrl": "https://files.refurbed.com/pi/iphone-13.jpg",
    }], 10)
    assert rf[0].id == "refurbed-14162b" and rf[0].title == "iPhone 13 · 128 GB | Dual-SIM | Medianoche"
    assert rf[0].condition == "Reacondicionado · Muy bueno"

    az = normalize_items("amazonrenewed", [{
        "asin": "B09MGFJK73", "title": "Apple iPhone 13, 128GB, Medianoche (Reacondicionado)",
        "price": {"value": 261.06, "currency": "€"}, "imageUrl": "https://m.media-amazon.com/i.jpg",
    }], 10)
    assert az[0].url == "https://www.amazon.es/dp/B09MGFJK73" and az[0].price_eur == 261.06
    assert "(Reacondicionado)" not in az[0].title

    cex = normalize_items("cex", [{
        "boxId": "SAPPI13128GALIBB", "title": "Apple iPhone 13 128GB Azul, Libre B", "sellPrice": 320, "in_stock": True,
        "image_medium": "https://es.static.webuy.com/product_images/Móviles/Moviles - iPhone/SAPPI13128GALIBB_m.jpg",
    }, {"boxId": "AGOTADO", "title": "x", "sellPrice": 1, "in_stock": False}], 10)
    assert [l.id for l in cex] == ["cex-SAPPI13128GALIBB"]
    assert cex[0].url == "https://es.webuy.com/product-detail/?id=SAPPI13128GALIBB"
    assert cex[0].image == "https://es.static.webuy.com/product_images/M%C3%B3viles/Moviles%20-%20iPhone/SAPPI13128GALIBB_m.jpg"


def test_text_search_endpoint(monkeypatch):
    """Búsqueda por descripción: sin claves (modo demo y heurística) y con fallo de Claude."""
    from fastapi.testclient import TestClient

    from app import config, main, search

    no_keys = config.Settings(anthropic_api_key=None, apify_token=None)
    for module in (config, ai, search, main):
        monkeypatch.setattr(module, "settings", no_keys, raising=False)
    client = TestClient(main.app)

    res = client.post("/api/search/text", json={"description": "Bicicleta de montaña Orbea talla M", "new_price_eur": 450})
    assert res.status_code == 200, res.text
    body = res.json()
    assert body["product"]["category_group"] == "deporte"
    assert body["product"]["search_queries"][0].lower().startswith("bicicleta")
    assert body["product"]["new_price_eur"] == 450
    assert body["listings"]

    assert client.post("/api/search/text", json={"description": "  "}).status_code in (400, 422)
    assert client.post("/api/search/text", json={"description": "x" * 1001}).status_code == 422

    keys = config.Settings(anthropic_api_key="sk-ant-test", apify_token=None)
    for module in (config, ai, search, main):
        monkeypatch.setattr(module, "settings", keys, raising=False)

    async def boom(*args, **kwargs):
        raise RuntimeError("sin crédito")

    monkeypatch.setattr(ai, "analyze_text", boom)
    monkeypatch.setattr(ai, "_score_with_claude", boom)
    res = client.post("/api/search/text", json={"description": "Sofá de tres plazas gris"})
    assert res.status_code == 200 and res.json()["ai_enabled"] is False
