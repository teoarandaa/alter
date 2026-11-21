"use client";

import { useState } from "react";

import { DailyCost, formatDay, formatUsd } from "@/lib/admin";

// Colores validados (contraste entre sí y con daltonismo). El naranja no llega a 3:1 sobre
// blanco: por eso hay leyenda, valores al pasar el ratón y la tabla debajo.
const SERIES = [
  { key: "apify", label: "Apify", color: "#6C3CE1" },
  { key: "claude", label: "Claude", color: "#E8833A" },
] as const;

const DAY_MS = 86_400_000;

function niceMax(value: number): number {
  if (value <= 0) return 1;
  const pow = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * pow >= value) ?? 10;
  return step * pow;
}

/** Barras apiladas por día: Apify abajo, Claude arriba. Solo los días transcurridos del periodo. */
export default function DailyCostChart({
  start,
  end,
  now,
  claude,
  apify,
}: {
  start: string;
  end: string;
  /** Momento en que se generaron los datos: marca «Hoy» y limita la tabla a los días pasados. */
  now: string;
  claude: DailyCost[];
  apify: DailyCost[];
}) {
  const [hover, setHover] = useState<number | null>(null);

  const byDate = (rows: DailyCost[]) => new Map(rows.map((r) => [r.date, r.usd]));
  const claudeMap = byDate(claude);
  const apifyMap = byDate(apify);

  const first = Date.parse(start.slice(0, 10));
  // Todo el periodo, para ver cada día en su sitio; los días futuros quedan vacíos.
  const last = Date.parse(end) - 1;
  const today = now.slice(0, 10);
  const days: { date: string; apify: number; claude: number; total: number }[] = [];
  for (let t = first; t <= last; t += DAY_MS) {
    const date = new Date(t).toISOString().slice(0, 10);
    const a = apifyMap.get(date) ?? 0;
    const c = claudeMap.get(date) ?? 0;
    days.push({ date, apify: a, claude: c, total: a + c });
  }

  const max = niceMax(Math.max(...days.map((d) => d.total), 0));
  const ticks = [max, max / 2, 0];
  const active = hover != null ? days[hover] : null;

  return (
    <div>
      {/* Leyenda */}
      <div className="flex items-center gap-4 text-[13px] text-ink-2">
        {SERIES.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-[3px]" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
        <span className="ml-auto tabular-nums text-ink-3">
          {active ? (
            <>
              {formatDay(active.date)}: <span className="text-ink">{formatUsd(active.total)}</span> (Apify{" "}
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
          {days.map((d, i) => (
            <div
              key={d.date}
              className="flex h-full min-w-0 flex-1 cursor-default flex-col justify-end"
              onMouseMove={() => hover !== i && setHover(i)}
              onClick={() => setHover(i)}
              aria-label={`${formatDay(d.date)}: ${formatUsd(d.total)}`}
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
        {days.map((d, i) => (
          <span
            key={d.date}
            className={`flex min-w-0 flex-1 ${i === 0 ? "justify-start" : i === days.length - 1 ? "justify-end" : "justify-center"}`}
          >
            {i === 0 || i === days.length - 1 || d.date === today ? (
              <span className={`whitespace-nowrap ${d.date === today ? "font-semibold text-ink-2" : ""}`}>
                {d.date === today ? "Hoy" : formatDay(d.date)}
              </span>
            ) : null}
          </span>
        ))}
      </div>

      {/* Tabla con los mismos datos */}
      <details className="mt-4 text-[14px]">
        <summary className="cursor-pointer text-alter-500">Ver tabla</summary>
        <table className="mt-3 w-full">
          <thead>
            <tr className="text-left text-[12px] text-ink-3">
              <th className="pb-2 font-medium">Día</th>
              <th className="pb-2 text-right font-medium">Apify</th>
              <th className="pb-2 text-right font-medium">Claude</th>
              <th className="pb-2 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line tabular-nums">
            {days.filter((d) => d.date <= today).reverse().map((d) => (
              <tr key={d.date}>
                <td className="py-1.5">{formatDay(d.date)}</td>
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
