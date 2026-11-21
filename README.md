# Alter — Alternativas que ayudan al planeta

Alter busca de segunda mano lo que ibas a comprar nuevo. Pegas el enlace de la tienda, subes una foto o
simplemente lo describes; la IA entiende qué es el objeto y lo busca en las principales webs de segunda mano.
Recibes enlaces directos a los anuncios, el precio de cada uno y el % de ahorro frente al precio nuevo.

## Estructura

```
backend/    API en Python (FastAPI) + Claude API + Apify
frontend/   Web en Next.js 16 + TypeScript + Tailwind + Motion
```

### Cómo funciona una búsqueda

1. **Entrada**: enlace de la tienda (`POST /api/search/url`), foto + descripción (`POST /api/search/image`) o solo
   una descripción escrita (`POST /api/search/text`).
2. **Análisis** (`backend/app/ai.py`): Claude lee la página del producto (título, precio, JSON-LD, imagen) o la foto
   y devuelve una ficha estructurada: nombre, marca, modelo, materiales, precio nuevo y 2-4 búsquedas.
3. **Búsqueda** (`backend/app/platforms.py`): se lanzan los scrapers de Apify que encajan con el producto:
   Wallapop, Milanuncios, Vinted y eBay siempre, y además Back Market, Refurbed, Amazon Reacondicionados y CeX si
   es electrónica (CeX también para videojuegos y películas). Si la búsqueda más específica da pocos resultados,
   se prueba la siguiente más general.
4. **Comparación**: Claude puntúa cada anuncio (mismo producto / similar / descartado) y se calcula el ahorro.
5. **Orden** (`backend/app/search.py`): primero coincidencias exactas; dentro, las plataformas con más
   prioridad; después las más parecidas y las más baratas.
6. Otras webs sin API se muestran como enlaces directos a su búsqueda, **solo las que encajan con el producto**:
   Claude clasifica el producto en un grupo (electrónica, moda, hogar, libros y ocio, música…) y cada web de
   `backend/platforms.json` indica sus grupos en `categories`. Las de grupo `general` salen siempre.

   | Grupo | Webs enlazadas |
   | --- | --- |
   | Siempre | Cash Converters, Secondbest, Todocolección |
   | Electrónica | Rebuy (Back Market, Refurbed, Amazon y CeX dan anuncios dentro de Alter) |
   | Moda | Vestiaire Collective, Percentil, Etsy (vintage) |
   | Hogar y coleccionismo | Etsy (vintage) |
   | Libros y ocio | Iberlibro, Rebuy |
   | Música | Reverb |
   | Infantil | Percentil |

### Patrocinios (estrategia de negocio)

`backend/platforms.json` controla, por plataforma, `priority` (sale antes), `max_results` (cuántos anuncios
muestra) y `sponsored`. Al cerrar un acuerdo con una plataforma, basta con subir esos valores. Los anuncios
patrocinados llevan la etiqueta «Patrocinado» y `rel="sponsored"`: la normativa de consumo de la UE obliga a
indicar cuándo un resultado aparece destacado por pago.

## Puesta en marcha

### Todo de una vez

```bash
./run.sh
```

Necesita Python 3.10+ y Node.js. La primera vez crea el entorno virtual, instala las dependencias y copia los
`.env` de ejemplo; después arranca backend y frontend juntos (Ctrl+C para los dos). En Windows, ejecútalo desde
Git Bash.

| Opción | Qué hace |
| --- | --- |
| `./run.sh --prod` | Compila el frontend y lo sirve en modo producción |
| `./run.sh --install` | Reinstala las dependencias antes de arrancar |
| `BACKEND_PORT=8001 FRONTEND_PORT=3001 ./run.sh` | Usa otros puertos |

### Por separado

#### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # en Linux/Mac: source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env        # y rellena ANTHROPIC_API_KEY y APIFY_TOKEN
uvicorn app.main:app --reload --port 8000
```

Sin `APIFY_TOKEN` funciona en **modo demo** (anuncios de ejemplo que enlazan a la búsqueda real de cada web).
Sin `ANTHROPIC_API_KEY` el análisis usa heurísticas simples. Con ambas claves, todo es real.

Tests: `python -m pytest`

#### Frontend

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Abre http://localhost:3000.

## Costes a tener en cuenta

- **Claude API**: 2 llamadas por búsqueda (análisis + comparación) con `claude-opus-5-5`.
  Se puede cambiar con `CLAUDE_MODEL` en `.env`.
- **Apify**: cada scraper cobra por resultado. Precios aproximados por resultado (plan gratuito, noviembre de 2026):
  Back Market 0,0025 $, Refurbed 0,00225 $, Amazon 0,005 $ y CeX 0,001 $; con 8 resultados cada uno, una búsqueda
  de electrónica cuesta unos 0,09 $ más que una normal. `max_results` en `platforms.json` limita cuántos anuncios
  se piden por plataforma.
- **Límites del plan gratuito de Apify**: 5 scrapers a la vez y 16 GB de memoria en total. Alter lanza como mucho
  `ALTER_APIFY_MAX_CONCURRENCY` (4 por defecto) a la vez dentro de cada búsqueda, pero con varios usuarios buscando
  al mismo tiempo se superaría el límite: al publicar hace falta un plan de pago.
- **Vestiaire Collective, Reverb y Etsy** tienen scraper en Apify, pero devuelven anuncios de EE. UU. en dólares
  (y Etsy tarda más de un minuto), así que de momento solo se enlazan.

## Panel de gastos (`/admin`)

Página privada que junta en un sitio lo que cuesta Alter: gasto en Claude y en Apify, gasto por día (o por
semana o mes), gasto por web (qué scraper sale más caro) y **coste por búsqueda**. Se puede ver el ciclo de
facturación actual de Apify, 1 día, 1 semana, 1, 3 o 6 meses, 1 año o todo el histórico. Claude solo da datos del
último año (y desde 2026). No guarda nada:
cada vez que se abre consulta los servicios (con 5 minutos de caché). No aparece en el menú ni en el sitemap y
pide a los buscadores que no la indexen.

Se configura en el **backend** (`backend/.env` o las variables de entorno del hosting):

| Variable | Para qué | Dónde se consigue |
| --- | --- | --- |
| `ALTER_ADMIN_TOKEN` | Contraseña del panel. Sin ella, el panel no existe | Inventa una larga y aleatoria |
| `ANTHROPIC_ADMIN_KEY` | Gasto en Claude (llega con 4-24 h de retraso) | Claude Console → Settings → Admin keys (`sk-ant-admin…`). No es la `ANTHROPIC_API_KEY` |

Apify usa el `APIFY_TOKEN` de siempre. Cada bloque funciona por separado: si falta una clave, ese bloque dice
qué falta y el resto se muestra igual. Las búsquedas se estiman con las ejecuciones de los scrapers generalistas
(Wallapop, Milanuncios…), que se consultan en todas; las cifras exactas de uso están en Umami.

**Coste por usuario al mes.** El panel divide el gasto de cada mes natural entre las personas distintas que han
buscado ese mes, y muestra su evolución (últimos 12 meses) para ver si el coste por usuario sube o baja. Para
contarlas, el backend convierte cada búsqueda en un hash irreversible de IP + navegador + una sal secreta que cambia
cada mes: no se guardan IPs, no se usan cookies ni nada en el dispositivo, y no se puede seguir a nadie de un mes a
otro. Los recuentos se guardan en un almacén clave-valor de Apify llamado `alter-usage` (Render gratuito no tiene
disco). La sal sale de `ALTER_USAGE_SALT` o, si no existe, del `APIFY_TOKEN`; si cambia, el mes en curso empieza a
contar de cero. El primer mes sale inflado porque los usuarios solo se cuentan desde que se activó el recuento.

El panel **solo informa**: para no llevarte sustos, pon también un límite de gasto mensual en Claude Console
(Settings → Limits) y en Apify (Settings → Usage & billing).

## Despliegue

- Backend: cualquier instancia barata (Hetzner, Railway, Fly.io…) con
  `uvicorn app.main:app --host 0.0.0.0 --port 8000`. Pon la URL del frontend en `ALTER_ALLOWED_ORIGINS`.
- Frontend: Vercel o la misma instancia (`npm run build && npm start`). Configura `NEXT_PUBLIC_API_URL` y
  `NEXT_PUBLIC_SITE_URL`.

## Ilustraciones

Las ilustraciones son de [unDraw](https://undraw.co): gratis, para uso comercial y sin atribución. Su licencia
**no permite descargarlas de forma automática ni enlazarlas desde su web**, así que se descargan a mano y se
guardan en `frontend/public/illustrations/`.

1. En unDraw, elige el color **#6C3CE1** (selector de color de arriba).
2. Busca cada ilustración, descárgala en **SVG** y guárdala con este nombre:

| Archivo | Ilustración en unDraw | Dónde aparece |
| --- | --- | --- |
| `hero.svg` | Happy Customer | Portada, a la derecha del titular |
| `paso-1-enlace.svg` | Online shopping | Cómo funciona · paso 1 |
| `paso-2-busqueda.svg` | Searching Everywhere | Cómo funciona · paso 2 |
| `paso-3-ahorro.svg` | Price Drop Alert | Cómo funciona · paso 3 |
| `impacto.svg` | Eco conscious | Sección de impacto |
| `sin-resultados.svg` | Empty cart | Búsqueda sin resultados |
| `final.svg` | Window shopping | Llamada final |

Las que falten no se muestran (los pasos usan un icono), así que se pueden añadir poco a poco. La lista está
también en `frontend/src/lib/illustrations.ts`.

Si una ilustración se descarga con el violeta por defecto de unDraw (`#6C63FF`), se pasa al de Alter con:

```bash
sed -i 's/#6[cC]63[fF][fF]/#6C3CE1/g' frontend/public/illustrations/*.svg
```

## Estadísticas (Umami)

La web está preparada para [Umami](https://umami.is): analítica **sin cookies y sin datos personales**, así que
no necesita banner de consentimiento. Mientras no se configure, no se carga ningún script ni se mide nada.

**Al publicar la web:**

1. Crea una cuenta gratuita en Umami Cloud y añade la web con su dominio.
2. Copia el *Website ID* en `NEXT_PUBLIC_UMAMI_WEBSITE_ID` (en `frontend/.env.local` o en las variables de
   entorno del hosting) y el dominio en `NEXT_PUBLIC_UMAMI_DOMAINS`.
3. Vuelve a compilar el frontend (`npm run build`): las variables `NEXT_PUBLIC_*` se fijan al compilar.

Además de las visitas, se envían estos eventos (se ven en *Events* dentro de Umami):

| Evento | Cuándo | Datos |
| --- | --- | --- |
| `busqueda` | Una búsqueda termina bien | modo (enlace/foto/texto), tienda (solo el dominio), producto, marca, categoría, resultados, iguales, mejor ahorro, si se conocía el precio nuevo, si se usó IA |
| `busqueda_error` | Una búsqueda falla | modo |
| `clic_anuncio` | Se abre un anuncio | plataforma, posición, orden, precio, % de ahorro, igual/similar, patrocinado |
| `clic_web_externa` | Se abre Cash Converters, Secondbest o Todocolección | plataforma |

Nunca se envían enlaces completos, textos escritos por el usuario ni fotos. Se respeta la opción «No rastrear»
del navegador. Cuando la web sea pública, conviene mencionarlo en una página de política de privacidad.

## Logos de las plataformas

Cada web tiene su logo en `frontend/public/logos/<clave>.svg` (o `.png`/`.webp` si la marca no publica SVG). Se
muestran en `/plataformas` y en las tarjetas de resultados; si falta el archivo, se usa un punto de color y el nombre.

| Archivo | Origen |
| --- | --- |
| `wallapop.svg`, `backmarket.svg`, `cex.svg`, `rebuy.svg`, `vinted.svg`, `vestiaire.svg`, `todocoleccion.svg` | SVG oficial de la cabecera de su web |
| `milanuncios.svg`, `ebay.svg`, `refurbed.svg`, `reverb.svg` | SVG incrustado en su web, con los colores fijados |
| `percentil.svg` | SVG de su web, pasado a su verde de marca (`#022F11`) porque el original es claro, para fondo oscuro |
| `cashconverters.svg` | Logotipo de Cash Converters (web de Australia/Reino Unido) en el magenta de la web española |
| `amazonrenewed.svg`, `etsyvintage.svg` | Wikimedia Commons (dominio público) |
| `secondbest.webp`, `iberlibro.png` | Imagen oficial de su web: estas marcas no publican el logo en SVG |

Los logos son marcas registradas de sus dueños y se usan solo para identificar cada web. Si se cierra un acuerdo
con alguna plataforma, conviene pedirle su kit de marca y sustituir el archivo.
