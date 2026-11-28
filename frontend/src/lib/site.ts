import type { Metadata } from "next";

/** URL pública de la web, sin barra final (p. ej. https://alter2mano.es). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** Dominio de producción. Solo ese se deja indexar: preproducción y local llevan noindex. */
export const PRODUCTION_HOST = "alter2mano.es";
export const INDEXABLE = new URL(SITE_URL).hostname === PRODUCTION_HOST;

export const SITE_NAME = "Alter";
export const SITE_TAGLINE = "Segunda mano. Primera opción.";
export const CONTACT_EMAIL = "hola@alter2mano.es";

/** URL absoluta a partir de una ruta («/buscar» → https://alter2mano.es/buscar). */
export function absoluteUrl(path = "/"): string {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

/**
 * Metadatos de una página: título, descripción, URL canónica y las tarjetas para redes sociales.
 *
 * Next.js no mezcla `openGraph` entre el layout y la página: si la página no lo define entero,
 * hereda el de la portada. Por eso cada página pasa por aquí.
 */
export function pageMetadata({
  title,
  description,
  path,
  socialTitle,
  article,
}: {
  title: string;
  description: string;
  path: string;
  /** Título para redes si debe ser distinto del de la pestaña. */
  socialTitle?: string;
  /** Si es un artículo (guía): fechas ISO de publicación y última revisión. */
  article?: { published: string; modified: string };
}): Metadata {
  const shareTitle = socialTitle ?? `${title} · ${SITE_NAME}`;
  const common = { locale: "es_ES", siteName: SITE_NAME, url: path, title: shareTitle, description };
  return {
    title,
    description,
    alternates: { canonical: path },
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
