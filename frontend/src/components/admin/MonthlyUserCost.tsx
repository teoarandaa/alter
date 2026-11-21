"use client";

import { useState } from "react";

import { formatDay, formatMonth, formatUsd, PerUserMonth, PerUserStats } from "@/lib/admin";

const COLOR = "#6C3CE1";
const HEIGHT = 160;

function niceMax(value: number): number {
  if (value <= 0) return 0.1;
  const pow = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * pow >= value) ?? 10;
  return step * pow;
}

function monthLabel(m: PerUserMonth): string {
  return formatMonth(`${m.month}-01T00:00:00Z`);
}

/** Variación del coste por usuario respecto al mes anterior con datos. */
function change(months: PerUserMonth[], index: number): number | null {
  const now = months[index]?.usd_per_user;
  const prev = months
    .slice(0, index)
    .reverse()
    .find((m) => m.usd_per_user != null)?.usd_per_user;
  if (now == null || prev == null || prev === 0) return null;
  return (now - prev) / prev;
}

/** Coste medio de un usuario en cada mes natural: gasto del mes ÷ personas distintas que buscaron. */
export default function MonthlyUserCost({ data }: { data: PerUserStats }) {
  const [hover, setHover] = useState<number | null>(null);
  const months = data.months ?? [];

  if (data.status !== "ok" || months.length === 0) {
    return <p className="text-[15px] text-ink-2">{data.message ?? "Todavía no hay datos de gasto mensual."}</p>;
  }

  const shown = hover ?? months.length - 1;
  const active = months[shown];
  const delta = change(months, shown);
  const max = niceMax(Math.max(...months.map((m) => m.usd_per_user ?? 0)));
  const ticks = [max, max / 2, 0];
  const anyUsers = months.some((m) => m.users > 0);

  return (
    <div>
      {/* Cifra del mes elegido (por defecto, el actual) */}
      <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
        <div>
          <p className="text-[13px] text-ink-3">
            {monthLabel(active)}
            {active.current && " (en curso)"}
          </p>
          <p className="headline mt-1 text-[34px] tabular-nums">
            {active.usd_per_user != null ? formatUsd(active.usd_per_user, 3) : "—"}
            <span className="ml-1 text-[17px] font-normal text-ink-3">/ usuario</span>
          </p>
        </div>
        {delta != null && (
          <p className={`pb-2 text-[15px] tabular-nums ${delta > 0 ? "text-red-600" : "text-emerald-700"}`}>
            {delta > 0 ? "▲" : "▼"} {Math.abs(Math.round(delta * 100))} % frente al mes anterior
          </p>
        )}
        <dl className="flex gap-6 pb-2 text-[14px]">
          <div>
            <dt className="text-ink-3">Usuarios</dt>
            <dd className="tabular-nums text-ink">{active.users.toLocaleString("es-ES")}</dd>
          </div>
          <div>
            <dt className="text-ink-3">Búsquedas por usuario</dt>
            <dd className="tabular-nums text-ink">{active.searches_per_user?.toLocaleString("es-ES") ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-ink-3">Gasto del mes</dt>
            <dd className="tabular-nums text-ink">{formatUsd(active.usd)}</dd>
          </div>
        </dl>
      </div>
      {active.partial_count && active.counting_since && (
        <p className="mt-1 text-[13px] text-ink-3">
          Los usuarios se cuentan desde el {formatDay(active.counting_since)}, pero el gasto es del mes entero: este
          mes el coste por usuario sale más alto de lo real.
        </p>
      )}

      {/* Evolución mensual */}
      {anyUsers ? (
        <>
          <div className="relative mt-6 pl-14" style={{ height: HEIGHT }}>
            {ticks.map((t, i) => (
              <div
                key={t}
                className="absolute inset-x-0 flex items-center"
                style={{ top: `${(i / (ticks.length - 1)) * 100}%`, transform: "translateY(-50%)" }}
              >
                <span className="w-14 pr-2 text-right text-[11px] tabular-nums text-ink-3">{formatUsd(t, 2)}</span>
                <span className="h-px flex-1 bg-line" />
              </div>
            ))}
            <div className="relative flex h-full items-end gap-2" onMouseLeave={() => setHover(null)}>
              {months.map((m, i) => (
                <div
                  key={m.month}
                  className="flex h-full min-w-0 flex-1 cursor-default flex-col justify-end"
                  onMouseMove={() => hover !== i && setHover(i)}
                  onClick={() => setHover(i)}
                  aria-label={`${monthLabel(m)}: ${m.usd_per_user != null ? formatUsd(m.usd_per_user, 3) : "sin usuarios"} por usuario`}
                >
                  {m.usd_per_user != null && (
                    <div
                      className={`mx-auto w-full max-w-12 rounded-t-[4px] transition-opacity ${shown !== i ? "opacity-60" : ""}`}
                      style={{
                        height: `${(m.usd_per_user / max) * HEIGHT}px`,
                        minHeight: 2,
                        // Mes con recuento parcial: rayado, porque el dato está inflado.
                        background: m.partial_count
                          ? `repeating-linear-gradient(45deg, ${COLOR}, ${COLOR} 4px, ${COLOR}80 4px, ${COLOR}80 8px)`
                          : COLOR,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2 flex gap-2 pl-14 text-[11px] text-ink-3">
            {months.map((m, i) => (
              <span key={m.month} className={`min-w-0 flex-1 truncate text-center ${shown === i ? "font-semibold text-ink-2" : ""}`}>
                {monthLabel(m)}
              </span>
            ))}
          </div>
        </>
      ) : (
        <p className="mt-4 text-[14px] text-ink-2">
          El recuento de usuarios acaba de empezar: la evolución aparecerá en cuanto haya búsquedas.
        </p>
      )}

      <details className="mt-4 text-[14px]">
        <summary className="cursor-pointer text-alter-500">Ver tabla</summary>
        <table className="mt-3 w-full">
          <thead>
            <tr className="text-left text-[12px] text-ink-3">
              <th className="pb-2 font-medium">Mes</th>
              <th className="pb-2 pl-3 text-right font-medium">Usuarios</th>
              <th className="hidden pb-2 pl-3 text-right font-medium sm:table-cell">Búsquedas</th>
              <th className="pb-2 pl-3 text-right font-medium">Gasto</th>
              <th className="pb-2 pl-3 text-right font-medium">Por usuario</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line tabular-nums">
            {[...months].reverse().map((m) => (
              <tr key={m.month}>
                <td className="py-1.5">
                  {monthLabel(m)}
                  {m.partial_count && <span className="text-ink-3"> *</span>}
                </td>
                <td className="py-1.5 pl-3 text-right text-ink-2">{m.users.toLocaleString("es-ES")}</td>
                <td className="hidden py-1.5 pl-3 text-right text-ink-2 sm:table-cell">{m.searches.toLocaleString("es-ES")}</td>
                <td className="py-1.5 pl-3 text-right text-ink-2">{formatUsd(m.usd)}</td>
                <td className="py-1.5 pl-3 text-right">{m.usd_per_user != null ? formatUsd(m.usd_per_user, 3) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {months.some((m) => m.partial_count) && (
          <p className="mt-2 text-[12px] text-ink-3">* Recuento de usuarios iniciado a mitad de mes.</p>
        )}
      </details>

      <p className="mt-4 text-[12px] text-ink-3">
        Usuario = persona distinta que ha buscado al menos una vez ese mes (sin cookies: se cuenta con un identificador
        anónimo que cambia cada mes).
        {!data.includes_claude && " El gasto no incluye Claude porque falta su clave de administración."}
      </p>
    </div>
  );
}
