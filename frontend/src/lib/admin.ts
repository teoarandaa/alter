/** Cliente del panel privado de gastos (GET /api/admin/stats del backend). */

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

type Status = "ok" | "not_configured" | "error";

interface Block {
  status: Status;
  message?: string;
}

export interface DailyCost {
  date: string;
  usd: number;
}

export interface ClaudeStats extends Block {
  usd?: number;
  requests?: number;
  daily?: DailyCost[];
  by_model?: { model: string; usd: number; requests: number }[];
  data_refreshed_at?: string | null;
  /** La franja empieza antes de lo que la API de costes puede dar (último año, desde 2026). */
  partial?: boolean;
}

export interface ApifyStats extends Block {
  plan?: string | null;
  included_usd?: number | null;
  limit_usd?: number | null;
  /** Gasto en la franja elegida. */
  usd?: number;
  /** Ciclo de facturación actual (para la barra de crédito del plan). */
  cycle_start?: string;
  cycle_end?: string;
  cycle_usd?: number;
  daily?: DailyCost[];
  by_platform?: { key: string; name: string; runs: number; usd: number; usd_per_run: number | null }[];
  by_service?: { service: string; usd: number }[];
}

export interface PerUserMonth {
  month: string; // AAAA-MM
  current: boolean;
  /** Fecha desde la que se cuentan usuarios ese mes; si es a mitad de mes, el dato sale inflado. */
  counting_since: string | null;
  partial_count: boolean;
  apify_usd: number;
  claude_usd: number;
  usd: number;
  users: number;
  searches: number;
  usd_per_user: number | null;
  searches_per_user: number | null;
}

export interface PerUserStats extends Block {
  includes_apify?: boolean;
  includes_claude?: boolean;
  months?: PerUserMonth[];
}

export interface AdminStats {
  generated_at: string;
  cached: boolean;
  period: { range: Range; start: string; end: string; source: "apify" | "range" };
  totals: {
    usd: number;
    searches: number | null;
    usd_per_search: number | null;
    complete: boolean;
  };
  claude: ClaudeStats;
  apify: ApifyStats;
  /** Coste por usuario de cada mes natural (no depende de la franja elegida). */
  per_user: PerUserStats;
  backend: { model: string; ai_enabled: boolean; demo_mode: boolean };
}

export type Range = "cycle" | "1d" | "7d" | "30d" | "90d" | "180d" | "365d" | "all";

export const RANGES: { value: Range; label: string }[] = [
  { value: "cycle", label: "Ciclo" },
  { value: "1d", label: "1 día" },
  { value: "7d", label: "1 semana" },
  { value: "30d", label: "1 mes" },
  { value: "90d", label: "3 meses" },
  { value: "180d", label: "6 meses" },
  { value: "365d", label: "1 año" },
  { value: "all", label: "Histórico" },
];

export class AuthError extends Error {}

export async function fetchAdminStats(token: string, range: Range = "cycle", refresh = false): Promise<AdminStats> {
  const params = new URLSearchParams({ range });
  if (refresh) params.set("refresh", "true");
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/admin/stats?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
  } catch {
    throw new Error("No hay conexión con el backend de Alter.");
  }
  if (res.status === 401) throw new AuthError("Contraseña incorrecta.");
  if (res.status === 404) throw new Error("El panel está desactivado: falta ALTER_ADMIN_TOKEN en el backend.");
  if (!res.ok) throw new Error(`El backend respondió con error ${res.status}.`);
  return res.json();
}

export function formatUsd(value: number | null | undefined, digits = 2): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatDay(iso: string, withYear = false): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    ...(withYear ? { year: "numeric" } : {}),
    timeZone: "UTC",
  }).format(new Date(iso));
}

export function formatMonth(iso: string): string {
  return new Intl.DateTimeFormat("es-ES", { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
}
