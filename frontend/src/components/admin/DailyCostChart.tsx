"use client";

import { useState } from "react";

import { DailyCost, formatDay, formatMonth, formatUsd } from "@/lib/admin";

// Colores validados (contraste entre sí y con daltonismo). El naranja no llega a 3:1 sobre
// blanco: por eso hay leyenda, valores al pasar el ratón y la tabla debajo.
const SERIES = [
  { key: "apify", label: "Apify", color: "#6C3CE1" },
  { key: "claude", label: "Claude", color: "#E8833A" },
] as const;

const DAY_MS = 86_400_000;

export type Granularity = "day" | "week" | "month";

/** Hasta un mes, barras por día; hasta 4 meses, por semana; más, por mes. */
export function granularityFor(start: string, end: string): Granularity {
  const days = (Date.parse(end) - Date.parse(start)) / DAY_MS;
  return days <= 31 ? "day" : days <= 120 ? "week" : "month";
}

interface Bucket {
  key: string;
  start: string; // primer día del grupo (AAAA-MM-DD)
  apify: number;
  claude: number;
  total: number;
}

function niceMax(value: number): number {
  if (value <= 0) return 1;
  const pow = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * pow >= value) ?? 10;
  return step * pow;
}

function bucketLabel(b: Bucket, g: Granularity): string {
  if (g === "month") return formatMonth(b.start);
  if (g === "week") return `Semana del ${formatDay(b.start)}`;
  return formatDay(b.start);
}

/** Barras apiladas: Apify abajo, Claude arriba. Cubre toda la franja; lo que aún no ha pasado queda vacío. */
export default function DailyCostChart({
  start,
  end,
  now,
  claude,
  apify,
}: {
  start: string;
  end: string;
  /** Momento en que se generaron los datos: marca «Hoy» y limita la tabla a lo ya ocurrido. */
  now: string;
  claude: DailyCost[];
  apify: DailyCost[];
}) {
  const [hover, setHover] = useState<number | null>(null);
  const granularity = granularityFor(start, end);
  const today = now.slice(0, 10);

  const claudeMap = new Map(claude.map((r) => [r.date, r.usd]));
  const apifyMap = new Map(apify.map((r) => [r.date, r.usd]));

  // Se recorre la franja día a día y se agrupa según la granularidad.
  const buckets: Bucket[] = [];
  const first = Date.parse(start.slice(0, 10));
  for (let t = first, i = 0; t < Date.parse(end); t += DAY_MS, i++) {
    const date = new Date(t).toISOString().slice(0, 10);
    const key = granularity === "day" ? date : granularity === "week" ? `w${Math.floor(i / 7)}` : date.slice(0, 7);
    let b = buckets[buckets.length - 1];
    if (!b || b.key !== key) {
      b = { key, start: date, apify: 0, claude: 0, total: 0 };
      buckets.push(b);
    }
    const a = apifyMap.get(date) ?? 0;
    const c = claudeMap.get(date) ?? 0;
    b.apify += a;
    b.claude += c;
    b.total += a + c;
  }
  const isCurrent = (i: number) =>
    buckets[i].start <= today && (i === buckets.length - 1 || buckets[i + 1].start > today);

  const max = niceMax(Math.max(...buckets.map((d) => d.total), 0));
  const ticks = [max, max / 2, 0];
  const active = hover != null ? buckets[hover] : null;
  const currentLabel = granularity === "day" ? "Hoy" : granularity === "week" ? "Esta semana" : "Este mes";

  return (
    <div>
      {/* Leyenda */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ink-2">
        {SERIES.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-[3px]" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
        <span className="ml-auto tabular-nums text-ink-3">
          {active ? (
            <>
              {bucketLabel(active, granularity)}: <span className="text-ink">{formatUsd(active.total)}</span> (Apify{" "}
              {formatUsd(active.apify)} · Claude {formatUsd(active.claude)})
            </>
          ) : (
            "Pasa el ratón por una barra"
          )}
        </span>
      </div>

      {/* Gráfico */}
      <div className="relative mt-4 h-[180px] pl-14">
        {ticks.map((t, i) => (
          <div
            key={t}
            className="absolute inset-x-0 flex items-center"
            style={{ top: `${(i / (ticks.length - 1)) * 100}%`, transform: "translateY(-50%)" }}
          >
            <span className="w-14 pr-2 text-right text-[11px] tabular-nums text-ink-3">
              {formatUsd(t, Number.isInteger(t) ? 0 : 2)}
            </span>
            <span className="h-px flex-1 bg-line" />
          </div>
        ))}
        <div className="relative flex h-full items-end gap-[3px]" onMouseLeave={() => setHover(null)}>
          {buckets.map((d, i) => (
            <div
              key={d.key}
              className="flex h-full min-w-0 flex-1 cursor-default flex-col justify-end"
              onMouseMove={() => hover !== i && setHover(i)}
              onClick={() => setHover(i)}
              aria-label={`${bucketLabel(d, granularity)}: ${formatUsd(d.total)}`}
            >
              <div
                className={`flex max-w-10 flex-col-reverse gap-[2px] self-center transition-opacity ${hover != null && hover !== i ? "opacity-50" : ""}`}
                style={{ width: "100%" }}
              >
                {d.apify > 0 && (
                  <div
                    className={`w-full ${d.claude > 0 ? "rounded-b-[2px]" : "rounded-t-[4px]"}`}
                    style={{ height: `${(d.apify / max) * 180}px`, minHeight: 2, background: SERIES[0].color }}
                  />
                )}
                {d.claude > 0 && (
                  <div
                    className="w-full rounded-t-[4px]"
                    style={{ height: `${(d.claude / max) * 180}px`, minHeight: 2, background: SERIES[1].color }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex pl-14 text-[11px] text-ink-3">
        {buckets.map((d, i) => {
          const current = isCurrent(i);
          const show = i === 0 || i === buckets.length - 1 || current;
          return (
            <span
              key={d.key}
              className={`flex min-w-0 flex-1 ${i === 0 ? "justify-start" : i === buckets.length - 1 ? "justify-end" : "justify-center"}`}
            >
              {show && (
                <span className={`whitespace-nowrap ${current ? "font-semibold text-ink-2" : ""}`}>
                  {current ? currentLabel : granularity === "month" ? formatMonth(d.start) : formatDay(d.start)}
                </span>
              )}
            </span>
          );
        })}
      </div>

      {/* Tabla con los mismos datos */}
      <details className="mt-4 text-[14px]">
        <summary className="cursor-pointer text-alter-500">Ver tabla</summary>
        <table className="mt-3 w-full">
          <thead>
            <tr className="text-left text-[12px] text-ink-3">
              <th className="pb-2 font-medium">{granularity === "day" ? "Día" : granularity === "week" ? "Semana" : "Mes"}</th>
              <th className="pb-2 text-right font-medium">Apify</th>
              <th className="pb-2 text-right font-medium">Claude</th>
              <th className="pb-2 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line tabular-nums">
            {buckets
              .filter((d) => d.start <= today)
              .reverse()
              .map((d) => (
                <tr key={d.key}>
                  <td className="py-1.5">{bucketLabel(d, granularity)}</td>
                  <td className="py-1.5 text-right text-ink-2">{formatUsd(d.apify)}</td>
                  <td className="py-1.5 text-right text-ink-2">{formatUsd(d.claude)}</td>
                  <td className="py-1.5 text-right">{formatUsd(d.total)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
