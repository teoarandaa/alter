/**
 * Datos estructurados de schema.org que usa Google para entender quién es Alter y qué hay en cada página.
 * Documentación: https://developers.google.com/search/docs/appearance/structured-data/search-gallery
 *
 * Regla de oro: todo lo que se declara aquí tiene que verse también en la página.
 */
import { PLATFORMS } from "./platforms";
import { absoluteUrl, CONTACT_EMAIL, SITE_NAME, SITE_TAGLINE } from "./site";

const ORG_ID = absoluteUrl("/#organization");
const WEBSITE_ID = absoluteUrl("/#website");

const DESCRIPTION = `Buscador gratuito de segunda mano: a partir de un enlace, una foto o una descripción, encuentra el producto en ${PLATFORMS.length} webs como Wallapop, Vinted, Milanuncios o eBay y calcula cuánto ahorras frente a comprarlo nuevo.`;

/** Organización, sitio web y aplicación: van en la portada. */
export function homeGraph() {
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
        slogan: SITE_TAGLINE,
        description: DESCRIPTION,
        contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: CONTACT_EMAIL, availableLanguage: "es" },
      },
      {
        // Nombre del sitio en los resultados de Google (https://developers.google.com/search/docs/appearance/site-names)
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: SITE_NAME,
        alternateName: ["Alter2mano", "alter2mano.es"],
        url: absoluteUrl("/"),
        inLanguage: "es-ES",
        publisher: { "@id": ORG_ID },
      },
      {
        "@type": "WebApplication",
        name: SITE_NAME,
        url: absoluteUrl("/buscar"),
        applicationCategory: "ShoppingApplication",
        operatingSystem: "Web",
        inLanguage: "es-ES",
        isAccessibleForFree: true,
        description: DESCRIPTION,
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

/** Migas de pan: Inicio › … › página actual. */
export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Inicio", path: "/" }, ...items].map((item, i) => ({
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
    inLanguage: "es-ES",
    author: { "@type": "Organization", "@id": ORG_ID, name: SITE_NAME, url: absoluteUrl("/") },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}
