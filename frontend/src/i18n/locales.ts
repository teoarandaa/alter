/**
 * Idiomas de la web.
 *
 * El castellano va sin prefijo (alter2mano.es/buscar), como siempre; los demás llevan el suyo delante
 * (alter2mano.es/ca/buscar). El proxy (src/proxy.ts) se encarga de que las URL sin prefijo sirvan el
 * castellano y de que /es/… redirija a la URL sin prefijo.
 *
 * Para añadir un idioma: su entrada en LOCALES y LOCALE_INFO, y su diccionario en dictionaries/.
 * Este archivo no depende de React ni del servidor: lo usan también el proxy y el desplegable.
 */

export type LocaleInfo = {
  /** Nombre del idioma en ese mismo idioma: es lo que se ve en el desplegable. */
  name: string;
  /** Nombre en castellano, en pequeño debajo, para quien no lo reconozca. */
  spanishName: string;
  /** Abreviatura del botón del desplegable. */
  short: string;
  /** Etiqueta BCP 47 para <html lang>. */
  htmlLang: string;
  /**
   * Código hreflang para Google (ISO 639-1, el único que Google admite). Sin él, esa versión no se
   * anuncia como alternativa de idioma: es el caso de las variedades sin código propio (valenciano,
   * balear, canario) y de las lenguas sin código ISO 639-1 (asturleonés, fala).
   */
  hreflang?: string;
  /** Idioma de las tarjetas de Open Graph (idioma_PAÍS). */
  ogLocale: string;
};

/** En el orden del desplegable. El primero es el idioma por defecto (sin prefijo en la URL). */
export const LOCALES = ["es", "canarias", "ca", "va", "balear", "gl", "eu", "oc", "an", "ast", "fala"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = LOCALES[0];

export const LOCALE_INFO: Record<Locale, LocaleInfo> = {
  es: { name: "Español", spanishName: "Castellano", short: "ES", htmlLang: "es", hreflang: "es", ogLocale: "es_ES" },
  canarias: { name: "Canario", spanishName: "Castellano de Canarias", short: "CAN", htmlLang: "es-IC", ogLocale: "es_ES" },
  ca: { name: "Català", spanishName: "Catalán", short: "CA", htmlLang: "ca", hreflang: "ca", ogLocale: "ca_ES" },
  va: { name: "Valencià", spanishName: "Valenciano", short: "VA", htmlLang: "ca-ES-valencia", ogLocale: "ca_ES" },
  balear: { name: "Balear", spanishName: "Catalán de Baleares", short: "BAL", htmlLang: "ca", ogLocale: "ca_ES" },
  gl: { name: "Galego", spanishName: "Gallego", short: "GL", htmlLang: "gl", hreflang: "gl", ogLocale: "gl_ES" },
  eu: { name: "Euskara", spanishName: "Euskera", short: "EU", htmlLang: "eu", hreflang: "eu", ogLocale: "eu_ES" },
  oc: { name: "Aranés", spanishName: "Aranés (occitano)", short: "OC", htmlLang: "oc-aranes", hreflang: "oc", ogLocale: "oc_ES" },
  an: { name: "Aragonés", spanishName: "Aragonés", short: "AN", htmlLang: "an", hreflang: "an", ogLocale: "an_ES" },
  ast: { name: "Asturllionés", spanishName: "Asturleonés", short: "AST", htmlLang: "ast", ogLocale: "ast_ES" },
  fala: { name: "A fala", spanishName: "Fala de Xálima", short: "FALA", htmlLang: "fax", ogLocale: "es_ES" },
};

export function isLocale(value: string | undefined): value is Locale {
  return (LOCALES as readonly string[]).includes(value ?? "");
}

/**
 * Ruta de una página en un idioma: localizedPath("ca", "/buscar") → «/ca/buscar».
 * Acepta anclas y parámetros: localizedPath("ca", "/#como-funciona") → «/ca#como-funciona».
 */
export function localizedPath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE || /^[a-z]+:/i.test(path) || path.startsWith("#")) return path;
  const cut = path.search(/[?#]/);
  const pathname = cut === -1 ? path : path.slice(0, cut);
  const rest = cut === -1 ? "" : path.slice(cut);
  return `/${locale}${pathname === "/" ? "" : pathname}${rest}`;
}

/** Quita el prefijo de idioma de una ruta: «/ca/buscar» → «/buscar»; «/ca» → «/». */
export function stripLocale(pathname: string): string {
  const first = pathname.split("/")[1];
  if (!isLocale(first)) return pathname || "/";
  return pathname.slice(first.length + 1) || "/";
}
