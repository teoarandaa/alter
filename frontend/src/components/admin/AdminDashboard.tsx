"use client";

import { AlertCircle, LogOut, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

import { AdminStats, AuthError, fetchAdminStats, formatDay, formatUsd } from "@/lib/admin";

import DailyCostChart from "./DailyCostChart";

const TOKEN_KEY = "alter-admin-token";

function readToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function saveToken(token: string | null) {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* sin almacenamiento: habrá que volver a escribir la contraseña */
  }
}

/** Panel privado: gasto en Claude y Apify, búsquedas y coste por búsqueda. */
export default function AdminDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load(t: string, refresh = false) {
    try {
      const data = await fetchAdminStats(t, refresh);
      saveToken(t);
      setToken(t);
      setStats(data);
      setError(null);
    } catch (err) {
      if (err instanceof AuthError) {
        saveToken(null);
        setToken(null);
        setStats(null);
      }
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  // Si ya se entró en esta pestaña, se carga directamente (si falla, se vuelve a pedir la contraseña).
  useEffect(() => {
    const saved = readToken();
    if (!saved) return;
    fetchAdminStats(saved)
      .then((data) => {
        setToken(saved);
        setStats(data);
      })
      .catch(() => saveToken(null));
  }, []);

  if (!token || !stats) {
    return (
      <form
        className="mx-auto mt-10 max-w-[380px] rounded-[28px] bg-white p-8 shadow-[0_2px_24px_rgba(0,0,0,0.04)]"
        onSubmit={(e) => {
          e.preventDefault();
          if (!password.trim()) return;
          setLoading(true);
          void load(password.trim());
        }}
      >
        <h1 className="headline text-[28px]">Panel de gastos</h1>
        <p className="mt-2 text-[15px] text-ink-2">Solo para el equipo de Alter.</p>
        <label className="mt-6 block text-[13px] font-medium text-ink-2" htmlFor="admin-password">
          Contraseña
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-xl bg-paper px-4 py-3 text-[17px] outline-none ring-alter-500/40 focus:ring-2"
        />
        {error && <p className="mt-3 text-[14px] text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-alter-500 px-6 py-3 text-[17px] text-white transition-colors hover:bg-alter-600 disabled:opacity-60"
        >
          {loading ? "Cargando…" : "Entrar"}
        </button>
      </form>
    );
  }

  const { totals, claude, apify, period, backend } = stats;
  const periodEnd = new Date(new Date(period.end).getTime() - 1).toISOString();

  return (
    <div className="mx-auto max-w-[1024px]">
      {/* Cabecera */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="headline text-[36px] sm:text-[48px]">Gastos</h1>
          <p className="mt-1 text-[15px] text-ink-2">
            {period.source === "apify" ? "Ciclo de facturación de Apify" : "Mes en curso"}: {formatDay(period.start)} –{" "}
            {formatDay(periodEnd)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-ink-3">
            Actualizado a las{" "}
            {new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit" }).format(new Date(stats.generated_at))}
          </span>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              void load(token, true);
            }}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[14px] text-ink shadow-[0_1px_8px_rgba(0,0,0,0.05)] hover:text-alter-500 disabled:opacity-60"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} strokeWidth={1.8} />
            Actualizar
          </button>
          <button
            type="button"
            onClick={() => {
              saveToken(null);
              setToken(null);
              setStats(null);
              setPassword("");
            }}
            aria-label="Salir"
            className="rounded-full bg-white p-2 text-ink-2 shadow-[0_1px_8px_rgba(0,0,0,0.05)] hover:text-ink"
          >
            <LogOut className="size-4" strokeWidth={1.8} />
          </button>
        </div>
      </div>
      {error && <p className="mt-4 text-[14px] text-red-600">{error}</p>}

      {/* Cifras principales */}
      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile
          label="Total gastado"
          value={formatUsd(totals.usd)}
          note={totals.complete ? "Claude + Apify" : "Incompleto: falta algún servicio"}
        />
        <Tile
          label="Claude"
          value={claude.status === "ok" ? formatUsd(claude.usd) : "—"}
          note={claude.status === "ok" ? `${(claude.requests ?? 0).toLocaleString("es-ES")} llamadas · llega con retraso` : statusText(claude.status)}
        />
        <Tile
          label="Apify"
          value={apify.status === "ok" ? formatUsd(apify.usd) : "—"}
          note={
            apify.status === "ok" && apify.included_usd
              ? `de ${formatUsd(apify.included_usd, 0)} incluidos en tu plan`
              : statusText(apify.status)
          }
          meter={apify.status === "ok" && apify.included_usd ? (apify.usd ?? 0) / apify.included_usd : undefined}
        />
        <Tile
          label="Coste por búsqueda"
          value={formatUsd(totals.usd_per_search, 3)}
          note={
            totals.searches == null
              ? "Sin datos de búsquedas"
              : `${totals.searches.toLocaleString("es-ES")} búsquedas (estimadas)`
          }
        />
      </div>

      {/* Gasto por día */}
      <Card title="Gasto por día" className="mt-3">
        <DailyCostChart
          start={period.start}
          end={period.end}
          now={stats.generated_at}
          claude={claude.status === "ok" ? (claude.daily ?? []) : []}
          apify={apify.status === "ok" ? (apify.daily ?? []) : []}
        />
      </Card>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        {/* Gasto por web */}
        <Card title="Apify: gasto por web">
          {apify.status !== "ok" ? (
            <Notice block={apify} />
          ) : (apify.by_platform ?? []).length === 0 ? (
            <p className="text-[15px] text-ink-2">Todavía no hay búsquedas en este ciclo.</p>
          ) : (
            <PlatformTable rows={apify.by_platform ?? []} />
          )}
        </Card>

        <div className="grid content-start gap-3">
          {/* Claude por modelo */}
          <Card title="Claude: gasto por modelo">
            {claude.status !== "ok" ? (
              <Notice block={claude} />
            ) : (claude.by_model ?? []).length === 0 ? (
              <p className="text-[15px] text-ink-2">Aún no hay datos de este periodo (pueden tardar hasta 24 h).</p>
            ) : (
              <ul className="divide-y divide-line">
                {(claude.by_model ?? []).map((m) => (
                  <li key={m.model} className="flex items-baseline justify-between gap-4 py-2.5 text-[15px]">
                    <span className="font-mono text-[13px] text-ink-2">{m.model}</span>
                    <span className="tabular-nums text-ink">
                      {formatUsd(m.usd, 3)} <span className="text-ink-3">· {m.requests.toLocaleString("es-ES")} llamadas</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {claude.status === "ok" && claude.data_refreshed_at && (
              <p className="mt-3 text-[12px] text-ink-3">
                Datos completos hasta el{" "}
                {new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(
                  new Date(claude.data_refreshed_at),
                )}
                .
              </p>
            )}
          </Card>

        </div>
      </div>

      <p className="mt-6 text-[13px] text-ink-3">
        Backend: modelo <span className="font-mono">{backend.model}</span> · IA {backend.ai_enabled ? "activada" : "desactivada"}
        {backend.demo_mode && " · modo demo"}
        {stats.cached && " · datos en caché (5 min)"}
      </p>
    </div>
  );
}

function statusText(status: string): string {
  return status === "not_configured" ? "Sin configurar" : "Error al consultar";
}

function Tile({ label, value, note, meter }: { label: string; value: string; note: string; meter?: number }) {
  return (
    <div className="flex flex-col rounded-[22px] bg-white p-5 sm:p-6">
      <p className="text-[13px] font-semibold text-ink-3">{label}</p>
      <p className="headline mt-3 text-[28px] tabular-nums sm:text-[34px]">{value}</p>
      {meter !== undefined && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-paper" role="presentation">
          <div
            className={`h-full rounded-full ${meter >= 0.8 ? "bg-red-500" : "bg-alter-500"}`}
            style={{ width: `${Math.min(100, Math.max(2, meter * 100))}%` }}
          />
        </div>
      )}
      <p className="mt-2 text-[13px] text-ink-2">{note}</p>
    </div>
  );
}

function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-[22px] bg-white p-5 sm:p-6 ${className}`}>
      <h2 className="text-[17px] font-semibold text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Notice({ block }: { block: { status: string; message?: string } }) {
  return (
    <p className="flex gap-2 text-[15px] text-ink-2">
      <AlertCircle className={`mt-0.5 size-4 shrink-0 ${block.status === "error" ? "text-red-500" : "text-ink-3"}`} />
      <span>
        <span className="font-medium text-ink">{statusText(block.status)}.</span> {block.message}
      </span>
    </p>
  );
}


function PlatformTable({ rows }: { rows: NonNullable<AdminStats["apify"]["by_platform"]> }) {
  const max = Math.max(...rows.map((r) => r.usd), 0.0001);
  return (
    <table className="w-full text-[15px]">
      <thead>
        <tr className="text-left text-[12px] text-ink-3">
          <th className="pb-2 font-medium">Web</th>
          <th className="pb-2 pl-3 text-right font-medium">Ejecuciones</th>
          <th className="hidden pb-2 pl-3 text-right font-medium sm:table-cell">Por ejecución</th>
          <th className="pb-2 pl-3 text-right font-medium">Total</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-line">
        {rows.map((r) => (
          <tr key={r.key}>
            <td className="py-2.5 pr-3">
              <span className="text-ink">{r.name}</span>
              <span className="mt-1 block h-1 rounded-full bg-alter-500/80" style={{ width: `${(r.usd / max) * 100}%` }} />
            </td>
            <td className="py-2.5 pl-3 text-right tabular-nums text-ink-2">{r.runs}</td>
            <td className="hidden py-2.5 pl-3 text-right tabular-nums text-ink-2 sm:table-cell">{formatUsd(r.usd_per_run, 3)}</td>
            <td className="whitespace-nowrap py-2.5 pl-3 text-right tabular-nums text-ink">{formatUsd(r.usd)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
