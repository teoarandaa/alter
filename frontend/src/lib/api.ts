export type MatchType = "exact" | "similar";

export interface ProductProfile {
  name: string;
  brand: string | null;
  model: string | null;
  category: string;
  materials: string[];
  key_features: string[];
  new_price_eur: number | null;
  search_queries: string[];
}

export interface Listing {
  id: string;
  platform: string;
  title: string;
  price_eur: number | null;
  url: string;
  image: string | null;
  location: string | null;
  condition: string | null;
  similarity: number | null;
  match_type: MatchType | null;
  savings_eur: number | null;
  savings_pct: number | null;
  sponsored: boolean;
}

export interface PlatformLink {
  platform: string;
  name: string;
  url: string;
}

export interface PlatformStatus {
  platform: string;
  name: string;
  ok: boolean;
  count: number;
  error: string | null;
}

export interface SearchResponse {
  product: ProductProfile;
  source_image: string | null;
  listings: Listing[];
  links: PlatformLink[];
  platforms: PlatformStatus[];
  best_savings_pct: number | null;
  demo_mode: boolean;
  ai_enabled: boolean;
}

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

async function handle(res: Response): Promise<SearchResponse> {
  if (res.ok) return res.json();
  let message = "Algo ha fallado. Inténtalo de nuevo.";
  try {
    const body = await res.json();
    if (typeof body.detail === "string") message = body.detail;
    else if (Array.isArray(body.detail) && res.status === 422) message = "Revisa los datos: el enlace o la imagen no son válidos.";
  } catch {
    /* respuesta sin JSON */
  }
  throw new Error(message);
}

/**
 * Despierta el backend sin esperar respuesta. En el plan gratuito de Render se apaga tras 15 minutos
 * sin uso y tarda casi un minuto en arrancar: avisándole al abrir la web, ya está listo (o casi)
 * cuando el usuario pulsa buscar. `no-cors` porque no hace falta leer la respuesta.
 */
export function wakeBackend(): void {
  fetch(`${API_URL}/api/health`, { mode: "no-cors", cache: "no-store" }).catch(() => {
    /* si falla, la búsqueda lo volverá a intentar */
  });
}

function networkError(): Error {
  return new Error("No hay conexión con el servidor de Alter. ¿Está arrancado el backend?");
}

export async function searchByUrl(url: string, notes?: string, signal?: AbortSignal): Promise<SearchResponse> {
  const res = await fetch(`${API_URL}/api/search/url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, notes: notes || null }),
    signal,
  }).catch((e) => {
    if (e?.name === "AbortError") throw e;
    throw networkError();
  });
  return handle(res);
}

export async function searchByText(description: string, newPrice?: number, signal?: AbortSignal): Promise<SearchResponse> {
  const res = await fetch(`${API_URL}/api/search/text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description, new_price_eur: newPrice && newPrice > 0 ? newPrice : null }),
    signal,
  }).catch((e) => {
    if (e?.name === "AbortError") throw e;
    throw networkError();
  });
  return handle(res);
}

export async function searchByImage(
  image: File,
  description: string,
  newPrice?: number,
  signal?: AbortSignal,
): Promise<SearchResponse> {
  const form = new FormData();
  form.append("image", image);
  form.append("description", description);
  if (newPrice && newPrice > 0) form.append("new_price_eur", String(newPrice));
  const res = await fetch(`${API_URL}/api/search/image`, { method: "POST", body: form, signal }).catch((e) => {
    if (e?.name === "AbortError") throw e;
    throw networkError();
  });
  return handle(res);
}

export const PLATFORM_COLORS: Record<string, string> = {
  wallapop: "#13C1AC",
  milanuncios: "#F15A24",
  vinted: "#09B1BA",
  ebay: "#E53238",
  backmarket: "#000000",
  refurbed: "#1A1A1A",
  amazonrenewed: "#FF9900",
  cex: "#E3001B",
  cashconverters: "#0B3D91",
  secondbest: "#222222",
  todocoleccion: "#C8102E",
};

export const PLATFORM_NAMES: Record<string, string> = {
  wallapop: "Wallapop",
  milanuncios: "Milanuncios",
  vinted: "Vinted",
  ebay: "eBay",
  backmarket: "Back Market",
  refurbed: "Refurbed",
  amazonrenewed: "Amazon Reacondicionados",
  cex: "CeX",
  cashconverters: "Cash Converters",
  secondbest: "Secondbest",
  todocoleccion: "Todocolección",
};

const eur = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
export const formatEur = (value: number | null | undefined) => (value == null ? "—" : eur.format(value));
