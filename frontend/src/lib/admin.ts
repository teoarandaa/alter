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
}

export interface ApifyStats extends Block {
  plan?: string | null;
  included_usd?: number | null;
  limit_usd?: number | null;
  usd?: number;
  daily?: DailyCost[];
  by_platform?: { key: string; name: string; runs: number; usd: number; usd_per_run: number | null }[];
  by_service?: { service: string; usd: number }[];
}

export interface AdminStats {
  generated_at: string;
  cached: boolean;
  period: { start: string; end: string; source: "apify" | "month" };
  totals: {
    usd: number;
    searches: number | null;
    usd_per_search: number | null;
    complete: boolean;
  };
  claude: ClaudeStats;
  apify: ApifyStats;
  backend: { model: string; ai_enabled: boolean; demo_mode: boolean };
}

export class AuthError extends Error {}

export async function fetchAdminStats(token: string, refresh = false): Promise<AdminStats> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/admin/stats${refresh ? "?refresh=true" : ""}`, {
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

export function formatDay(iso: string): string {
  return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(iso));
}
