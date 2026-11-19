"use client";

import { motion } from "motion/react";
import { ChevronRight, Info, PackageSearch } from "lucide-react";
import { useMemo, useState } from "react";

import { track } from "@/lib/analytics";
import { formatEur, PLATFORM_COLORS, PLATFORM_NAMES, type Listing, type SearchResponse } from "@/lib/api";
import PlatformMark from "./PlatformMark";
import { APPLE_EASE } from "./Reveal";
import Segmented from "./Segmented";

type Filter = "all" | "exact" | "similar";
type Sort = "recommended" | "cheapest" | "savings";

export default function Results({
  data,
  image,
  emptyIllustration = null,
  logos = [],
}: {
  data: SearchResponse;
  image: string | null;
  emptyIllustration?: string | null;
  /** Claves de las webs con logo en public/logos/. */
  logos?: string[];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("recommended");
  const [manualPrice, setManualPrice] = useState("");
  const { product } = data;

  // Si la tienda no dejó leer el precio, el usuario puede escribirlo y el ahorro se calcula aquí.
  const typedPrice = Number(manualPrice.replace(",", "."));
  const newPrice = product.new_price_eur ?? (typedPrice > 0 ? typedPrice : null);
  const allListings = useMemo(() => {
    if (product.new_price_eur != null || newPrice == null) return data.listings;
    return data.listings.map((l) => {
      if (l.price_eur == null || l.price_eur > newPrice) return { ...l, savings_eur: null, savings_pct: null };
      const savings = newPrice - l.price_eur;
      return { ...l, savings_eur: Math.round(savings * 100) / 100, savings_pct: Math.round((savings / newPrice) * 1000) / 10 };
    });
  }, [data.listings, product.new_price_eur, newPrice]);
  const bestSavings =
    data.best_savings_pct ??
    allListings.reduce<number | null>((best, l) => (l.savings_pct != null && l.savings_pct > (best ?? -1) ? l.savings_pct : best), null);

  const listings = useMemo(() => {
    const filtered = allListings.filter((l) => filter === "all" || l.match_type === filter);
    if (sort === "recommended") return filtered;
    const price = (l: Listing) => l.price_eur ?? Number.POSITIVE_INFINITY;
    return [...filtered].sort((a, b) =>
      sort === "cheapest" ? price(a) - price(b) : (b.savings_pct ?? -1) - (a.savings_pct ?? -1),
    );
  }, [allListings, filter, sort]);

  const cheapest = allListings.reduce<number | null>(
    (min, l) => (l.price_eur != null && (min == null || l.price_eur < min) ? l.price_eur : min),
    null,
  );
  const exactCount = allListings.filter((l) => l.match_type === "exact").length;
  const platformsWithResults = data.platforms.filter((p) => p.count > 0).length;
  const details = [...product.materials, ...product.key_features].slice(0, 4);

  const stats = [
    bestSavings != null
      ? { value: `${Math.round(bestSavings)} %`, label: "de ahorro máximo", accent: true }
      : { value: "—", label: "de ahorro máximo", accent: false },
    { value: String(allListings.length), label: allListings.length === 1 ? "alternativa" : "alternativas", accent: false },
    { value: cheapest != null ? formatEur(cheapest) : "—", label: "el precio más bajo", accent: false },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: APPLE_EASE }}
      className="mx-auto mt-24 w-full max-w-[1024px]"
      aria-label="Resultados"
    >
      {/* Ficha del producto */}
      <header className="mx-auto max-w-[680px] text-center">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={product.name} className="mx-auto mb-8 h-40 w-auto max-w-full object-contain mix-blend-multiply" />
        ) : null}
        <p className="text-[15px] font-semibold capitalize text-alter-500">{product.category}</p>
        <h2 className="headline mt-2 text-[34px] sm:text-[48px]">{product.name}</h2>
        {(product.brand || product.model || product.new_price_eur != null) && (
          <p className="mt-3 text-[19px] text-ink-2">
            {[product.brand, product.model].filter(Boolean).join(" · ")}
            {product.new_price_eur != null && (
              <>
                {(product.brand || product.model) && " · "}
                {formatEur(product.new_price_eur)} nuevo
              </>
            )}
          </p>
        )}
        {details.length > 0 && <p className="mt-2 text-[15px] text-ink-3">{details.join(" · ")}</p>}
      </header>

      {(data.demo_mode || !data.ai_enabled) && (
        <p className="mx-auto mt-8 flex max-w-[680px] items-start justify-center gap-2 text-center text-xs text-ink-3">
          <Info className="mt-px size-3.5 shrink-0" />
          <span>
            {data.demo_mode && "Modo demo: anuncios de ejemplo que llevan a la búsqueda real de cada web. "}
            {!data.ai_enabled && "Búsqueda hecha sin IA: el análisis del producto es aproximado."}
          </span>
        </p>
      )}

      {/* Cifras clave */}
      <dl className="mx-auto mt-14 grid max-w-[880px] grid-cols-3 divide-x divide-line">
        {stats.map((s) => (
          <div key={s.label} className="px-2 text-center sm:px-6">
            <dt className="sr-only">{s.label}</dt>
            <dd className={`headline text-[28px] sm:text-[48px] ${s.accent ? "text-alter-500" : "text-ink"}`}>{s.value}</dd>
            <dd className="mt-1 text-xs text-ink-2 sm:text-[15px]">{s.label}</dd>
          </div>
        ))}
      </dl>

      {product.new_price_eur == null && (
        <div className="mx-auto mt-8 flex max-w-[420px] items-center justify-center gap-3">
          <label htmlFor="manual-price" className="shrink-0 text-[15px] text-ink-2">
            ¿Cuánto cuesta nuevo?
          </label>
          <span className="flex h-10 items-center rounded-full bg-white px-4 shadow-[0_1px_8px_rgba(0,0,0,0.06)] focus-within:ring-4 focus-within:ring-alter-500/15">
            <input
              id="manual-price"
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={manualPrice}
              onChange={(e) => setManualPrice(e.target.value.replace(/[^\d.,]/g, ""))}
              className="w-20 bg-transparent text-right text-[15px] text-ink outline-none placeholder:text-ink-3"
            />
            <span className="ml-1 text-[15px] text-ink-3">€</span>
          </span>
        </div>
      )}

      {/* Controles */}
      <div className="mt-16 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <Segmented
          label="Filtrar resultados"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: `Todos` },
            { value: "exact", label: `Iguales (${exactCount})` },
            { value: "similar", label: `Similares (${allListings.length - exactCount})` },
          ]}
        />
        <label className="flex items-center gap-2 text-[14px] text-ink-2">
          Ordenar por
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="cursor-pointer bg-transparent text-ink outline-none"
          >
            <option value="recommended">Recomendados</option>
            <option value="cheapest">Precio más bajo</option>
            <option value="savings">Mayor ahorro</option>
          </select>
        </label>
      </div>

      {/* Anuncios */}
      {listings.length > 0 ? (
        <ul className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((l, i) => (
            <ListingCard key={l.id} listing={l} index={i} sort={sort} hasLogoFile={logos.includes(l.platform)} />
          ))}
        </ul>
      ) : (
        <div className="mt-16 text-center">
          {emptyIllustration && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={emptyIllustration} alt="" className="mx-auto mb-8 h-40 w-auto" />
          )}
          <p className="text-[17px] text-ink-2">
            No hay anuncios que encajen. Prueba en las webs de abajo o con otra descripción.
          </p>
        </div>
      )}

      {/* Plataformas sin API */}
      {data.links.length > 0 && (
        <div className="mt-20 border-t border-line pt-10 text-center">
          <p className="text-[17px] text-ink-2">
            Busca también «{product.search_queries[0]}» en
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {data.links.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("clic_web_externa", { plataforma: link.platform })}
                className="group inline-flex items-center text-[17px] text-alter-500 hover:underline"
              >
                {link.name}
                <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
            ))}
          </div>
        </div>
      )}

      <p className="mt-10 text-center text-xs text-ink-3">
        Resultados de {platformsWithResults} {platformsWithResults === 1 ? "plataforma" : "plataformas"}
        {data.platforms.some((p) => !p.ok) &&
          `. No hemos podido consultar ${data.platforms.filter((p) => !p.ok).map((p) => p.name).join(", ")}`}
        .
      </p>
    </motion.section>
  );
}

function ListingCard({
  listing: l,
  index,
  sort,
  hasLogoFile,
}: {
  listing: Listing;
  index: number;
  sort: Sort;
  hasLogoFile: boolean;
}) {
  const color = PLATFORM_COLORS[l.platform] ?? "#6C3CE1";
  // Si la foto no carga (enlace caducado, bloqueo de la web…), se muestra el icono en lugar de una imagen rota.
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.6), duration: 0.8, ease: APPLE_EASE }}
    >
      <a
        href={l.url}
        target="_blank"
        rel={`noopener noreferrer${l.sponsored ? " sponsored" : ""}`}
        onClick={() =>
          track("clic_anuncio", {
            plataforma: l.platform,
            posicion: index + 1,
            orden: sort,
            precio: l.price_eur,
            ahorro_pct: l.savings_pct != null ? Math.round(l.savings_pct) : undefined,
            tipo: l.match_type === "exact" ? "igual" : "similar",
            patrocinado: l.sponsored,
          })
        }
        className="group block"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-white">
          {l.image && !imageFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={l.image}
              alt={l.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImageFailed(true)}
              className="size-full object-cover transition-transform duration-700 ease-[var(--ease-apple)] group-hover:scale-[1.04]"
            />
          ) : (
            <div className="grid size-full place-items-center">
              <PackageSearch className="size-10 text-line" strokeWidth={1.25} />
            </div>
          )}
          {l.savings_pct != null && l.savings_pct > 0 && (
            <span className="absolute right-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-xs font-semibold text-alter-600 backdrop-blur-md">
              −{Math.round(l.savings_pct)} %
            </span>
          )}
        </div>

        <div className="mt-4 px-1">
          <p className="flex items-center gap-1.5 text-xs text-ink-2">
            <PlatformMark
              platformKey={l.platform}
              name={PLATFORM_NAMES[l.platform] ?? l.platform}
              color={color}
              hasLogoFile={hasLogoFile}
              size="sm"
            />
            {l.sponsored && <span className="text-ink-3">· Patrocinado</span>}
          </p>
          <h3 className="mt-1.5 line-clamp-2 text-[17px] font-semibold leading-snug text-ink transition-colors group-hover:text-alter-600">
            {l.title}
          </h3>
          <p className="mt-1 text-[17px] text-ink">{formatEur(l.price_eur)}</p>
          {l.savings_eur != null && l.savings_eur > 0 && (
            <p className="text-[14px] text-alter-500">Ahorras {formatEur(l.savings_eur)}</p>
          )}
          <p className="mt-2 text-xs text-ink-3">
            {[
              l.match_type === "exact" ? "Mismo producto" : "Alternativa similar",
              l.condition,
              l.location,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      </a>
    </motion.li>
  );
}
