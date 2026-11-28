/**
 * Idioma y textos de la página actual, para componentes de servidor.
 *
 * El idioma sale del primer tramo de la ruta (app/[lang]), que Next.js expone como «root param»:
 * cualquier componente de servidor lo puede leer sin pasarlo de padre a hijo.
 */
import { lang } from "next/root-params";

import es, { type Dictionary } from "./dictionaries/es";
import an from "./dictionaries/an";
import ca from "./dictionaries/ca";
import eu from "./dictionaries/eu";
import gl from "./dictionaries/gl";
import oc from "./dictionaries/oc";
import va from "./dictionaries/va";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./locales";

const DICTIONARIES: Record<Locale, Dictionary> = { es, ca, va, gl, eu, oc, an };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

/** Idioma de la página que se está generando. */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Idioma y diccionario de la página que se está generando. */
export async function getI18n(): Promise<{ locale: Locale; t: Dictionary }> {
  const locale = await getLocale();
  return { locale, t: getDictionary(locale) };
}

export type { Dictionary, Locale };
