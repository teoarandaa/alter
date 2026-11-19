# Alter — Alternativas que ayudan al planeta

Alter busca de segunda mano lo que ibas a comprar nuevo. Pegas el enlace de la tienda (o subes una foto
con una descripción), la IA entiende qué es el objeto y lo busca en las principales webs de segunda mano.
Recibes enlaces directos a los anuncios, el precio de cada uno y el % de ahorro frente al precio nuevo.

## Estructura

```
backend/    API en Python (FastAPI) + Claude API + Apify
frontend/   Web en Next.js 16 + TypeScript + Tailwind + Motion
```

### Cómo funciona una búsqueda

1. **Entrada**: enlace de la tienda (`POST /api/search/url`) o foto + descripción (`POST /api/search/image`).
2. **Análisis** (`backend/app/ai.py`): Claude lee la página del producto (título, precio, JSON-LD, imagen) o la foto
   y devuelve una ficha estructurada: nombre, marca, modelo, materiales, precio nuevo y 2-4 búsquedas.
3. **Búsqueda** (`backend/app/platforms.py`): se lanzan en paralelo los actores de Apify de Wallapop, Milanuncios,
   Vinted y eBay. Si la búsqueda más específica da pocos resultados, se prueba la siguiente más general.
4. **Comparación**: Claude puntúa cada anuncio (mismo producto / similar / descartado) y se calcula el ahorro.
5. **Orden** (`backend/app/search.py`): primero coincidencias exactas; dentro, las plataformas con más
   prioridad; después las más parecidas y las más baratas.
6. Cash Converters, Secondbest y Todocolección no tienen API: se muestran enlaces directos a su búsqueda.

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
- **Apify**: cada actor cobra por resultado o por ejecución; revisa los precios de cada uno.
  `max_results` en `platforms.json` limita cuántos anuncios se piden por plataforma.

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
