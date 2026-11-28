import { fill } from "@/i18n/format";
import { DEFAULT_LOCALE, isLocale, LOCALES } from "@/i18n/locales";
import { getDictionary } from "@/i18n/server";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";
import { PLATFORMS } from "@/lib/platforms";

export const alt = "Alter: segunda mano, primera opción. Buscador de segunda mano en Wallapop, Vinted, eBay y más.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Una imagen por idioma, generada al compilar. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

/** Imagen por defecto al compartir cualquier página de Alter, en el idioma de la página. */
export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { meta } = getDictionary(isLocale(lang) ? lang : DEFAULT_LOCALE);
  return ogImage({
    eyebrow: "Alter",
    title: meta.tagline,
    subtitle: fill(meta.ogSubtitle, { n: PLATFORMS.length }),
  });
}
