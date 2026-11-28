import type { MetadataRoute } from "next";

import { GUIDES } from "@/content/guides";
import { absoluteUrl, INDEXABLE } from "@/lib/site";

/**
 * Mapa del sitio para Google. Google ignora `priority` y `changeFrequency`, pero sí usa `lastModified`
 * si es fiable: actualízalo cuando cambie de verdad el contenido de una página.
 */
const UPDATED = {
  home: "2026-11-27",
  plataformas: "2026-11-27",
  legal: "2026-11-26",
};

export default function sitemap(): MetadataRoute.Sitemap {
  if (!INDEXABLE) return [];

  const latestGuide = GUIDES.map((g) => g.modified).sort().at(-1) ?? UPDATED.home;

  return [
    { url: absoluteUrl("/"), lastModified: UPDATED.home },
    { url: absoluteUrl("/buscar"), lastModified: UPDATED.home },
    { url: absoluteUrl("/plataformas"), lastModified: UPDATED.plataformas },
    { url: absoluteUrl("/guias"), lastModified: latestGuide },
    ...GUIDES.map((g) => ({ url: absoluteUrl(`/guias/${g.slug}`), lastModified: g.modified })),
    { url: absoluteUrl("/privacidad"), lastModified: UPDATED.legal },
    { url: absoluteUrl("/cookies"), lastModified: UPDATED.legal },
    { url: absoluteUrl("/aviso-legal"), lastModified: UPDATED.legal },
  ];
}
