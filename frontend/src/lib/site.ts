import type { Metadata } from "next";

import { DEFAULT_LOCALE, LOCALE_INFO, LOCALES, localizedPath, type Locale } from "@/i18n/locales";

/** URL pública de la web, sin barra final (p. ej. https://alter2mano.es). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** Dominio de producción. Solo ese se deja indexar: preproducción y local llevan noindex. */
export const PRODUCTION_HOST = "alter2mano.es";
export const INDEXABLE = new URL(SITE_URL).hostname === PRODUCTION_HOST;

export const SITE_NAME = "Alter";
export const CONTACT_EMAIL = "hola@alter2mano.es";

/** URL absoluta a partir de una ruta («/buscar» → https://alter2mano.es/buscar). */
export function absoluteUrl(path = "/"): string {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

/**
 * Versiones de una página en cada idioma, para las etiquetas hreflang:
 * { es: "/buscar", ca: "/ca/buscar", …, "x-default": "/buscar" }.
 */
export function languageAlternates(path: string): Record<string, string> {
  const entries = LOCALES.flatMap((locale) => {
    const { hreflang } = LOCALE_INFO[locale];
    return hreflang ? [[hreflang, localizedPath(locale, path)] as const] : [];
  });
  return { ...Object.fromEntries(entries), "x-default": localizedPath(DEFAULT_LOCALE, path) };
}

/**
 * Metadatos de una página: título, descripción, URL canónica, versiones en otros idiomas y las
 * tarjetas para redes sociales.
 *
 * Next.js no mezcla `openGraph` entre el layout y la página: si la página no lo define entero,
 * hereda el de la portada. Por eso cada página pasa por aquí.
 */
export function pageMetadata({
  title,
  description,
  path,
  locale = DEFAULT_LOCALE,
  translated = true,
  socialTitle,
  article,
}: {
  title: string;
  description: string;
  /** Ruta en castellano, sin prefijo de idioma («/buscar»). */
  path: string;
  locale?: Locale;
  /**
   * false si el contenido solo existe en castellano (guías y textos legales): en los demás idiomas
   * la canónica apunta a la versión en castellano y no se anuncian alternativas de idioma.
   */
  translated?: boolean;
  /** Título para redes si debe ser distinto del de la pestaña. */
  socialTitle?: string;
  /** Si es un artículo (guía): fechas ISO de publicación y última revisión. */
  article?: { published: string; modified: string };
}): Metadata {
  const canonical = translated ? localizedPath(locale, path) : path;
  const shareTitle = socialTitle ?? `${title} · ${SITE_NAME}`;
  const common = {
    locale: LOCALE_INFO[translated ? locale : DEFAULT_LOCALE].ogLocale,
    siteName: SITE_NAME,
    url: canonical,
    title: shareTitle,
    description,
  };
  return {
    title,
    description,
    // Las alternativas de idioma solo salen en las versiones que forman parte del grupo (las que tienen hreflang).
    alternates:
      translated && LOCALE_INFO[locale].hreflang ? { canonical, languages: languageAlternates(path) } : { canonical },
    openGraph: article
      ? { ...common, type: "article", publishedTime: article.published, modifiedTime: article.modified }
      : { ...common, type: "website" },
    twitter: { card: "summary_large_image", title: shareTitle, description },
  };
}

/** Serializa datos estructurados para un <script type="application/ld+json"> sin riesgo de inyectar HTML. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
