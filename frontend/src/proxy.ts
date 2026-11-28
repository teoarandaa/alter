import { NextResponse, type NextRequest } from "next/server";

import { DEFAULT_LOCALE, isLocale } from "@/i18n/locales";

/**
 * Rutas por idioma. Todas las páginas viven en app/[lang], pero el castellano conserva sus URL de
 * siempre, sin prefijo:
 * - /buscar → sirve /es/buscar (reescritura interna: la URL del navegador no cambia).
 * - /es/buscar → redirige a /buscar, para que cada página tenga una sola URL.
 * - /ca/buscar y los demás idiomas → tal cual.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  if (first === DEFAULT_LOCALE) {
    // Next.js enlaza las imágenes para redes con el prefijo (/es/opengraph-image): esas se sirven tal cual.
    if (pathname.endsWith("/opengraph-image")) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(DEFAULT_LOCALE.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (isLocale(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Fuera quedan los archivos internos de Next.js y todo lo que tiene extensión (robots.txt,
  // sitemap.xml, iconos, ilustraciones, logos, ads.txt…).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
