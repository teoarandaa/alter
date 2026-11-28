# Plan SEO de Alter

Última revisión: 27 de noviembre de 2026.

Nadie puede garantizar el puesto 1 en Google: depende de la competencia, de la antigüedad del dominio y de los
enlaces que recibas. Lo que sí se puede hacer es tener una base técnica sin fallos, contenido mejor que el de la
competencia y un plan constante. Este documento recoge las tres cosas.

## 1. Dónde podemos ganar (y dónde no)

| Búsqueda | Quién está arriba | Objetivo realista |
|---|---|---|
| «segunda mano», «comprar segunda mano» | Wallapop, Milanuncios, Vinted | No a corto plazo: son marcas enormes. |
| «buscador de segunda mano», «comparador segunda mano», «buscar en Wallapop y Vinted a la vez» | Pocos resultados buenos | **Sí: es la portada.** Alter es justo eso. |
| «webs de segunda mano en España», «alternativas a Wallapop» | Artículos de blogs y medios | **Sí: /plataformas.** |
| «comprar [producto] de segunda mano: qué revisar», «cómo evitar estafas en Wallapop» | Blogs, foros, medios | **Sí: /guias.** Es donde más tráfico hay. |
| «[producto] segunda mano» (p. ej. «iPhone 13 segunda mano») | Los propios marketplaces | A medio plazo, con guías por producto. |

## 2. Lo que ya está hecho en la web

- **Títulos y descripciones** propios en cada página, con la palabra clave al principio (en `meta` de cada
  diccionario, `src/i18n/dictionaries/`; `pageMetadata()` en `src/lib/site.ts` los convierte en metadatos).
- **Idiomas**: la interfaz y las páginas principales (portada, buscador y plataformas) están en cada idioma de
  `src/i18n/locales.ts`. El castellano va sin prefijo (`/buscar`) y los demás con el suyo (`/ca/buscar`). Cada
  versión lleva su canónica y las etiquetas `hreflang` de las demás, y salen todas en el sitemap. Las guías y los
  textos legales solo están en castellano: en los demás idiomas se muestran con un aviso y su canónica apunta a la
  versión en castellano, para que Google no los vea como contenido duplicado.
- **URL canónica** en todas las páginas, y redirecciones http → https y www → sin www (ya las hacía el hosting).
- **Preproducción fuera de Google**: solo `alter2mano.es` se deja indexar; cualquier otro dominio sale con
  `noindex` y un `robots.txt` que lo bloquea todo.
- **Sitemap** con fechas de actualización reales y **robots.txt** que excluye `/admin`.
- **Datos estructurados** (schema.org): Organization, WebSite (nombre del sitio en Google) y WebApplication en la
  portada; Article y BreadcrumbList en cada guía.
- **Imágenes para redes sociales** generadas automáticamente (`opengraph-image`), una por guía con su título.
- **Titular de la portada** con «El buscador de segunda mano» dentro del H1.
- **Velocidad (Core Web Vitals)**: los titulares ya no empiezan invisibles, así que el LCP (lo que más tarda en
  pintarse) ocurre en cuanto llega el HTML, sin esperar a la animación.
- **Sección de guías** (`/guias`) con 5 guías prácticas, cada una con resumen inicial, lista de comprobaciones,
  webs recomendadas y un botón que abre el buscador con el texto ya escrito (`/buscar?q=…`).
- **Preguntas frecuentes** en la portada (visibles y en el HTML).
- **Enlazado interno**: guías en el menú, en la portada y en el pie; cada guía enlaza a otras y al buscador.
- **Manifiesto web** (icono y nombre al guardar la web en el móvil).

Lo que **no** hemos hecho a propósito, porque Google dice que no sirve: `llms.txt`, meta `keywords`, marcado FAQ
(ya no da resultados enriquecidos) y textos escritos «para la IA». Para salir en los resúmenes con IA de Google
basta con estar indexado y tener contenido útil.

## 3. Lo que te toca hacer (una sola vez)

1. **Google Search Console** (search.google.com/search-console):
   - Añade la propiedad de tipo **Dominio** `alter2mano.es` y verifícala con el registro TXT que te da Google, en la
     zona DNS de Hostinger.
   - En **Sitemaps**, envía `https://alter2mano.es/sitemap.xml`.
   - En **Inspección de URLs**, pide la indexación de la portada, `/guias` y cada guía.
2. **Bing Webmaster Tools** (bing.com/webmasters): impórtalo desde Search Console con un clic. Bing también
   alimenta a otros buscadores y asistentes.
3. **Comprueba los datos estructurados** con la [Prueba de resultados enriquecidos](https://search.google.com/test/rich-results)
   y el [validador de schema.org](https://validator.schema.org/).
4. **Mide la velocidad** con [PageSpeed Insights](https://pagespeed.web.dev/) en móvil: el objetivo es LCP < 2,5 s,
   INP < 200 ms y CLS < 0,1.
5. **Perfiles de marca**: crea Alter en las redes que vayas a usar (Instagram, TikTok, LinkedIn, X) con el mismo
   nombre y logo. Cuando existan, añade sus URLs en `sameAs` de `src/lib/structured-data.ts`: ayuda a que Google
   entienda que todo es la misma marca.

## 4. Plan de contenido (lo que más posiciona)

Publica **1 guía cada semana o cada dos**. Mejor pocas y muy buenas que muchas y flojas: Google penaliza las
páginas hechas en serie con poco valor.

Próximas guías, por orden de interés:

1. Comprar una consola de segunda mano (PS5, Switch, Xbox): qué revisar.
2. Comprar una tablet o un iPad de segunda mano.
3. Comprar ropa de segunda mano en Vinted: tallas, estado y cómo negociar.
4. Carritos, cunas y artículos de bebé de segunda mano: qué es seguro comprar usado y qué no.
5. Cámaras y objetivos de segunda mano.
6. Wallapop, Vinted, Milanuncios o eBay: cuál usar para cada cosa (comparativa honesta).
7. Reacondicionado o de segunda mano: diferencias, garantía y cuándo compensa cada uno.
8. Cómo negociar el precio en Wallapop sin quedar mal.

Cómo escribir cada guía (para que Google la valore):

- **La respuesta primero**: el bloque «En resumen» responde a la pregunta en 3–5 puntos.
- **Experiencia real**: pasos concretos, rutas de menús exactas, fotos propias si puedes.
- **Datos propios**: es lo que más diferencia. Cuando haya suficientes búsquedas, publica datos de Alter, por
  ejemplo «cuánto se ahorra de media comprando un iPhone de segunda mano», a partir de los resultados reales.
- **Revisión periódica**: actualiza las guías cada pocos meses y cambia la fecha `modified` en `src/content/guides.tsx`.

## 5. Enlaces y menciones (autoridad)

Google sigue confiando en las webs que otras webs citan. Sin enlaces, ni el mejor contenido llega arriba.

- **Medios y blogs de sostenibilidad, consumo y tecnología**: una nota corta del tipo «una web busca a la vez en
  17 webs de segunda mano». Los medios locales (Sabadell, Vallès) son más fáciles al principio.
- **Directorios de startups y productos**: Product Hunt, directorios españoles de startups y de apps.
- **Comunidades**: responde en foros y en Reddit cuando alguien pregunte dónde comprar algo de segunda mano,
  aportando valor de verdad, no solo el enlace.
- **Colaboraciones**: blogs de ahorro, de crianza o de ciclismo pueden enlazar a la guía de su tema.
- **Nunca compres enlaces** ni uses redes de blogs: Google lo penaliza.

## 6. Cómo medir

- **Search Console** (semanal): clics, impresiones, posición media y qué búsquedas traen visitas. Si una guía sale
  en la posición 8–20 para una búsqueda, mejórala: es la que más rápido sube.
- **Umami**: visitas desde Google (Referrers) y el evento `busqueda` para ver si las guías llevan a buscar.
- **Hitos razonables**: indexación completa en 2–4 semanas; primeras visitas de las guías en 1–3 meses; posiciones
  estables en búsquedas de cola larga en 3–6 meses si publicas con constancia y consigues algunos enlaces.
