import type { MetadataRoute } from "next";

import { GUIDES } from "@/content/guides";
import { LOCALES, localizedPath } from "@/i18n/locales";
import { absoluteUrl, INDEXABLE, languageAlternates } from "@/lib/site";

/**
 * Mapa del sitio para Google. Google ignora `priority` y `changeFrequency`, pero sí usa `lastModified`
 * si es fiable: actualízalo cuando cambie de verdad el contenido de una página.
 *
 * Las páginas traducidas salen una vez por idioma, cada una con sus alternativas (hreflang). Las guías
 * y los textos legales solo están en castellano: solo sale su URL en castellano.
 */
const UPDATED = {
  home: "2026-11-27",
  plataformas: "2026-11-27",
  legal: "2026-11-26",
  /** Cuándo se añadieron los demás idiomas. */
  idiomas: "2026-11-28",
};

function translated(path: string, lastModified: string): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    Object.entries(languageAlternates(path)).map(([hreflang, href]) => [hreflang, absoluteUrl(href)]),
  );
  return LOCALES.map((locale) => ({
    url: absoluteUrl(localizedPath(locale, path)),
    lastModified: [lastModified, UPDATED.idiomas].sort().at(-1),
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  if (!INDEXABLE) return [];

  const latestGuide = GUIDES.map((g) => g.modified).sort().at(-1) ?? UPDATED.home;

  return [
    ...translated("/", UPDATED.home),
    ...translated("/buscar", UPDATED.home),
    ...translated("/plataformas", UPDATED.plataformas),
    { url: absoluteUrl("/guias"), lastModified: latestGuide },
    ...GUIDES.map((g) => ({ url: absoluteUrl(`/guias/${g.slug}`), lastModified: g.modified })),
    { url: absoluteUrl("/privacidad"), lastModified: UPDATED.legal },
    { url: absoluteUrl("/cookies"), lastModified: UPDATED.legal },
    { url: absoluteUrl("/aviso-legal"), lastModified: UPDATED.legal },
  ];
}
