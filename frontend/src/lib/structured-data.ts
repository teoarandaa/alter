/**
 * Datos estructurados de schema.org que usa Google para entender quién es Alter y qué hay en cada página.
 * Documentación: https://developers.google.com/search/docs/appearance/structured-data/search-gallery
 *
 * Regla de oro: todo lo que se declara aquí tiene que verse también en la página.
 */
import type { Dictionary } from "@/i18n/dictionaries/es";
import { fill } from "@/i18n/format";
import { DEFAULT_LOCALE, LOCALE_INFO, LOCALES, localizedPath, type Locale } from "@/i18n/locales";

import { PLATFORMS } from "./platforms";
import { absoluteUrl, CONTACT_EMAIL, SITE_NAME } from "./site";

const ORG_ID = absoluteUrl("/#organization");
const WEBSITE_ID = absoluteUrl("/#website");

/** Organización, sitio web y aplicación: van en la portada de cada idioma. */
export function homeGraph(locale: Locale, t: Dictionary) {
  const description = fill(t.meta.organization, { n: PLATFORMS.length });
  const inLanguage = LOCALE_INFO[locale].htmlLang;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: SITE_NAME,
        alternateName: "Alter2mano",
        url: absoluteUrl("/"),
        logo: { "@type": "ImageObject", url: absoluteUrl("/apple-icon.png"), width: 180, height: 180 },
        email: CONTACT_EMAIL,
        slogan: t.meta.tagline,
        description,
        contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: CONTACT_EMAIL, availableLanguage: "es" },
      },
      {
        // Nombre del sitio en los resultados de Google (https://developers.google.com/search/docs/appearance/site-names)
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: SITE_NAME,
        alternateName: ["Alter2mano", "alter2mano.es"],
        url: absoluteUrl("/"),
        inLanguage: LOCALES.map((l) => LOCALE_INFO[l].htmlLang),
        publisher: { "@id": ORG_ID },
      },
      {
        "@type": "WebApplication",
        name: SITE_NAME,
        url: absoluteUrl(localizedPath(locale, "/buscar")),
        applicationCategory: "ShoppingApplication",
        operatingSystem: "Web",
        inLanguage,
        isAccessibleForFree: true,
        description,
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

/** Migas de pan: Inicio › … › página actual (rutas ya con el prefijo de idioma). */
export function breadcrumbs(items: { name: string; path: string }[], home: { name: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [home, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Artículo de una guía. */
export function articleData({
  title,
  description,
  path,
  published,
  modified,
}: {
  title: string;
  description: string;
  path: string;
  published: string;
  modified: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: absoluteUrl(path),
    mainEntityOfPage: absoluteUrl(path),
    image: absoluteUrl(`${path}/opengraph-image`),
    datePublished: published,
    dateModified: modified,
    // Las guías solo están escritas en castellano.
    inLanguage: LOCALE_INFO[DEFAULT_LOCALE].htmlLang,
    author: { "@type": "Organization", "@id": ORG_ID, name: SITE_NAME, url: absoluteUrl("/") },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}
