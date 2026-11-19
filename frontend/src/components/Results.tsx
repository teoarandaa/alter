"use client";

import { motion } from "motion/react";
import { ArrowUpRight, ExternalLink, Info, Leaf, MapPin, PackageSearch, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { formatEur, PLATFORM_COLORS, PLATFORM_NAMES, type Listing, type SearchResponse } from "@/lib/api";

type Filter = "all" | "exact" | "similar";
type Sort = "recommended" | "cheapest" | "savings";

export default function Results({ data, image }: { data: SearchResponse; image: string | null }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("recommended");
  const { product } = data;

  const listings = useMemo(() => {
    const filtered = data.listings.filter((l) => filter === "all" || l.match_type === filter);
    if (sort === "recommended") return filtered;
    const price = (l: Listing) => l.price_eur ?? Number.POSITIVE_INFINITY;
    return [...filtered].sort((a, b) =>
      sort === "cheapest" ? price(a) - price(b) : (b.savings_pct ?? -1) - (a.savings_pct ?? -1),
    );
  }, [data.listings, filter, sort]);

  const cheapest = data.listings.reduce<Listing | null>(
    (best, l) => (l.price_eur != null && (!best || l.price_eur < (best.price_eur ?? Infinity)) ? l : best),
    null,
  );
  const exactCount = data.listings.filter((l) => l.match_type === "exact").length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto mt-14 w-full max-w-6xl"
      aria-label="Resultados"
    >
      {(data.demo_mode || !data.ai_enabled) && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <Info className="mt-0.5 size-4 shrink-0" />
          <p>
            {data.demo_mode && "Modo demo: los anuncios son de ejemplo y los enlaces llevan a la búsqueda real de cada web. "}
            {!data.ai_enabled && "Sin clave de Claude: el análisis del producto es aproximado. "}
            Configura las claves en <code className="rounded bg-amber-100 px-1">backend/.env</code>.
          </p>
        </div>
      )}

      {/* Ficha del producto */}
      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <div className="flex gap-5 rounded-3xl border border-alter-100 bg-white p-5">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={product.name} className="size-24 shrink-0 rounded-2xl bg-alter-50 object-contain sm:size-28" />
          ) : (
            <div className="grid size-24 shrink-0 place-items-center rounded-2xl bg-alter-50 sm:size-28">
              <PackageSearch className="size-8 text-alter-400" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-alter-500">{product.category}</p>
            <h2 className="font-display mt-1 text-xl font-semibold text-alter-950 sm:text-2xl">{product.name}</h2>
            <p className="mt-1 text-sm text-alter-900/60">
              {[product.brand, product.model].filter(Boolean).join(" · ")}
              {product.new_price_eur != null && (
                <>
                  {(product.brand || product.model) && " · "}Nuevo: <strong className="text-alter-900">{formatEur(product.new_price_eur)}</strong>
                </>
              )}
            </p>
            {(product.key_features.length > 0 || product.materials.length > 0) && (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {[...product.materials, ...product.key_features].slice(0, 6).map((f) => (
                  <li key={f} className="rounded-full bg-alter-50 px-2.5 py-1 text-xs text-alter-800">
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-3xl bg-alter-500 p-6 text-white md:min-w-64">
          {data.best_savings_pct != null ? (
            <>
              <p className="text-sm text-alter-100">Ahorro de hasta</p>
              <p className="font-display text-5xl font-bold tracking-tight">{Math.round(data.best_savings_pct)}%</p>
              {cheapest && <p className="mt-1 text-sm text-alter-100">Desde {formatEur(cheapest.price_eur)} de segunda mano</p>}
            </>
          ) : (
            <>
              <p className="text-sm text-alter-100">Alternativas encontradas</p>
              <p className="font-display text-5xl font-bold tracking-tight">{data.listings.length}</p>
              <p className="mt-1 text-sm text-alter-100">Añade el precio nuevo para ver el ahorro</p>
            </>
          )}
          <p className="mt-4 flex items-center gap-1.5 text-xs text-alter-100">
            <Leaf className="size-3.5" /> Cada compra de segunda mano evita fabricar un objeto nuevo
          </p>
        </div>
      </div>

      {/* Controles */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", `Todos (${data.listings.length})`],
              ["exact", `Mismo producto (${exactCount})`],
              ["similar", `Similares (${data.listings.length - exactCount})`],
            ] as [Filter, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                filter === value ? "bg-alter-950 text-white" : "bg-alter-50 text-alter-900 hover:bg-alter-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-alter-900/70">
          Ordenar
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-full border border-alter-100 bg-white px-3 py-2 text-alter-900 outline-none focus:border-alter-400"
          >
            <option value="recommended">Recomendados</option>
            <option value="cheapest">Más baratos</option>
            <option value="savings">Más ahorro</option>
          </select>
        </label>
      </div>

      {/* Anuncios */}
      {listings.length > 0 ? (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((l, i) => (
            <ListingCard key={l.id} listing={l} index={i} />
          ))}
        </ul>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-alter-200 p-10 text-center text-alter-900/60">
          No hemos encontrado anuncios que encajen. Prueba en las webs de abajo o con otra descripción.
        </div>
      )}

      {/* Plataformas sin API */}
      {data.links.length > 0 && (
        <div className="mt-10 rounded-3xl bg-alter-50 p-6">
          <h3 className="font-display text-lg font-semibold text-alter-950">Busca también en</h3>
          <p className="mt-1 text-sm text-alter-900/60">
            Hemos preparado la búsqueda «{product.search_queries[0]}» en estas tiendas de segunda mano.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.links.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-alter-100 bg-white px-4 py-2 text-sm font-medium text-alter-900 transition hover:border-alter-300 hover:text-alter-700"
              >
                <span className="size-2 rounded-full" style={{ background: PLATFORM_COLORS[link.platform] }} />
                {link.name}
                <ExternalLink className="size-3.5 opacity-50 transition group-hover:opacity-100" />
              </a>
            ))}
          </div>
        </div>
      )}

      {data.platforms.some((p) => !p.ok) && (
        <p className="mt-4 text-xs text-alter-900/50">
          No hemos podido consultar: {data.platforms.filter((p) => !p.ok).map((p) => p.name).join(", ")}.
        </p>
      )}
    </motion.section>
  );
}

function ListingCard({ listing: l, index }: { listing: Listing; index: number }) {
  const color = PLATFORM_COLORS[l.platform] ?? "#6C3CE1";
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.5), duration: 0.35 }}
    >
      <a
        href={l.url}
        target="_blank"
        rel={`noopener noreferrer${l.sponsored ? " sponsored" : ""}`}
        className="group flex h-full flex-col overflow-hidden rounded-3xl border border-alter-100 bg-white transition hover:-translate-y-1 hover:border-alter-300 hover:shadow-xl hover:shadow-alter-500/10"
      >
        <div className="relative aspect-[4/3] bg-alter-50">
          {l.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={l.image} alt={l.title} loading="lazy" className="size-full object-cover" />
          ) : (
            <div className="grid size-full place-items-center">
              <PackageSearch className="size-10 text-alter-300" />
            </div>
          )}
          <span
            className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold text-white shadow"
            style={{ background: color }}
          >
            {PLATFORM_NAMES[l.platform] ?? l.platform}
          </span>
          {l.savings_pct != null && l.savings_pct > 0 && (
            <span className="absolute right-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-alter-600 shadow">
              −{Math.round(l.savings_pct)}%
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div className="mb-2 flex flex-wrap items-center gap-1.5 text-[11px] font-medium">
            {l.match_type === "exact" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-alter-100 px-2 py-0.5 text-alter-700">
                <Sparkles className="size-3" /> Mismo producto
              </span>
            ) : (
              <span className="rounded-full bg-alter-50 px-2 py-0.5 text-alter-800">Alternativa similar</span>
            )}
            {l.similarity != null && <span className="text-alter-900/45">{l.similarity}% parecido</span>}
            {l.sponsored && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">Patrocinado</span>}
          </div>
          <h3 className="line-clamp-2 text-sm font-medium text-alter-950">{l.title}</h3>
          <div className="mt-auto flex items-end justify-between pt-4">
            <div>
              <p className="font-display text-2xl font-bold text-alter-950">{formatEur(l.price_eur)}</p>
              {l.savings_eur != null && l.savings_eur > 0 && (
                <p className="text-xs font-medium text-emerald-600">Te ahorras {formatEur(l.savings_eur)}</p>
              )}
            </div>
            <ArrowUpRight className="size-5 text-alter-300 transition group-hover:text-alter-600" />
          </div>
          {(l.location || l.condition) && (
            <p className="mt-2 flex items-center gap-1 truncate text-xs text-alter-900/50">
              {l.location && <MapPin className="size-3 shrink-0" />}
              {[l.location, l.condition].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </a>
    </motion.li>
  );
}
