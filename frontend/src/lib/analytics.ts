/**
 * Analítica con Umami (https://umami.is): sin cookies y sin datos personales.
 *
 * No hace nada hasta que se configura NEXT_PUBLIC_UMAMI_WEBSITE_ID: sin ese ID no se carga
 * ningún script ni se envía ningún evento (por ejemplo, en local).
 *
 * Nunca se envían enlaces completos, textos escritos por el usuario ni fotos.
 */

export const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || "";
export const UMAMI_SCRIPT_URL = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || "https://cloud.umami.is/script.js";
/** Dominios donde se mide (separados por comas). Vacío = cualquiera. Evita contar visitas de pruebas. */
export const UMAMI_DOMAINS = process.env.NEXT_PUBLIC_UMAMI_DOMAINS || "";

type EventData = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string | number | boolean>) => void };
  }
}

/** Envía un evento a Umami. Si Umami no está cargado (sin ID, bloqueador…), no hace nada. */
export function track(event: string, data: EventData = {}) {
  if (!UMAMI_WEBSITE_ID || typeof window === "undefined" || !window.umami) return;
  const clean: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) continue;
    clean[key] = typeof value === "string" ? value.slice(0, 100) : value;
  }
  try {
    window.umami.track(event, clean);
  } catch {
    // La analítica nunca debe romper la web.
  }
}

/** Solo el dominio de la tienda, sin ruta ni parámetros (pueden llevar datos de seguimiento). */
export function shopDomain(url: string): string | undefined {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}
