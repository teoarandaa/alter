"use client";

import { AnimatePresence, motion } from "motion/react";
import { ImagePlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { Dictionary } from "@/i18n/dictionaries/es";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/locales";
import { shopDomain, track } from "@/lib/analytics";
import { searchByImage, searchByText, searchByUrl, SearchError, type SearchResponse } from "@/lib/api";
import { APPLE_EASE } from "./Reveal";
import Results from "./Results";
import Segmented from "./Segmented";

type Mode = "url" | "image" | "text";

/** Nombre de cada modo en la analítica (no se traduce: así se pueden comparar los idiomas). */
const MODE_NAME: Record<Mode, string> = { url: "enlace", image: "foto", text: "texto" };

/** Mensaje de error en el idioma de la página. */
function errorMessage(err: unknown, mode: Mode, locale: Locale, errors: Dictionary["search"]["errors"]): string {
  if (!(err instanceof SearchError)) return errors.generic;
  if (err.status === 0) return errors.network;
  // En castellano, el texto del backend es más preciso que el genérico (dice qué le pasa al enlace).
  if (locale === DEFAULT_LOCALE && err.detail) return err.detail;
  switch (err.status) {
    case 400:
      return mode === "url" ? errors.badLink : mode === "text" ? errors.shortText : errors.describeObject;
    case 413:
      return errors.imageTooBig;
    case 415:
      return errors.imageFormat;
    case 422:
      return errors.invalid;
    case 503:
      return mode === "image" ? errors.photosUnavailable : errors.generic;
    default:
      return errors.generic;
  }
}

const field =
  "w-full rounded-xl border border-transparent bg-paper px-4 text-[17px] text-ink outline-none transition duration-300 placeholder:text-ink-3 focus:border-alter-500 focus:bg-white focus:ring-4 focus:ring-alter-500/15";

export default function SearchPanel({
  locale,
  t,
  emptyIllustration = null,
  logos = {},
  initialText = "",
}: {
  locale: Locale;
  /** Textos del buscador y de los resultados en el idioma de la página. */
  t: { search: Dictionary["search"]; results: Dictionary["results"] };
  emptyIllustration?: string | null;
  logos?: Record<string, string>;
  /** Texto con el que abrir el modo «Descríbelo» (p. ej. desde una guía: /buscar?q=iPhone 13). No lanza la búsqueda. */
  initialText?: string;
}) {
  const [mode, setMode] = useState<Mode>(initialText ? "text" : "url");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [textQuery, setTextQuery] = useState(initialText);
  const [newPrice, setNewPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [searchCount, setSearchCount] = useState(0);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => setStep((s) => Math.min(s + 1, t.search.steps.length - 1)), 4500);
    return () => clearInterval(id);
  }, [loading, t.search.steps.length]);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    if (result) resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  function pickFile(f: File | null) {
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (mode === "url" && !/^https?:\/\/\S+\.\S+/.test(url.trim())) {
      setError(t.search.errors.invalidUrl);
      return;
    }
    if (mode === "image" && !file) {
      setError(t.search.errors.noPhoto);
      return;
    }
    if (mode === "text" && textQuery.trim().length < 3) {
      setError(t.search.errors.shortText);
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setStep(0);
    setLoading(true);
    try {
      const price = Number(newPrice.replace(",", ".")) || undefined;
      const data =
        mode === "url"
          ? await searchByUrl(url.trim(), notes.trim(), controller.signal)
          : mode === "image"
            ? await searchByImage(file!, description.trim(), price, controller.signal)
            : await searchByText(textQuery.trim(), price, controller.signal);
      setResult(data);
      setSearchCount((n) => n + 1);
      track("busqueda", {
        modo: MODE_NAME[mode],
        tienda: mode === "url" ? shopDomain(url.trim()) : undefined,
        // En texto sin IA, el nombre del producto es casi lo que escribió el usuario: no se envía.
        producto: mode === "text" && !data.ai_enabled ? undefined : data.product.name,
        marca: data.product.brand,
        categoria: data.product.category,
        resultados: data.listings.length,
        iguales: data.listings.filter((l) => l.match_type === "exact").length,
        mejor_ahorro: data.best_savings_pct != null ? Math.round(data.best_savings_pct) : undefined,
        precio_nuevo_conocido: data.product.new_price_eur != null,
        con_ia: data.ai_enabled,
      });
      setResultImage(mode === "image" ? preview : data.source_image);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError(errorMessage(err, mode, locale, t.search.errors));
        track("busqueda_error", { modo: MODE_NAME[mode] });
      }
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <form
        onSubmit={onSubmit}
        className="relative mx-auto w-full max-w-[680px] overflow-hidden rounded-[28px] bg-white p-5 shadow-[0_2px_40px_rgba(0,0,0,0.06)] sm:p-8"
      >
        {/* Barra de progreso fina mientras busca */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-0 top-0 h-[3px] overflow-hidden bg-alter-100"
            >
              <div className="animate-progress h-full w-2/5 rounded-full bg-alter-500" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-center">
          <Segmented
            label={t.search.modesLabel}
            value={mode}
            onChange={setMode}
            options={[
              { value: "url", label: t.search.modes.url },
              { value: "image", label: t.search.modes.image },
              { value: "text", label: t.search.modes.text },
            ]}
          />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {mode === "url" && (
            <motion.div
              key="url"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: APPLE_EASE }}
              className="mt-6 space-y-3"
            >
              <label htmlFor="url" className="sr-only">
                {t.search.urlLabel}
              </label>
              <input
                id="url"
                type="url"
                inputMode="url"
                placeholder={t.search.urlPlaceholder}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className={`${field} h-14`}
              />
              <input
                type="text"
                aria-label={t.search.notesLabel}
                placeholder={t.search.notesPlaceholder}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={1000}
                className={`${field} h-12 text-[15px]`}
              />
            </motion.div>
          )}
          {mode === "image" && (
            <motion.div
              key="image"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: APPLE_EASE }}
              className="mt-6 space-y-3"
            >
              {preview ? (
                <div className="flex items-center gap-4 rounded-xl bg-paper p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt={t.search.photoAlt} className="size-16 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] text-ink">{file?.name}</p>
                    <p className="text-xs text-ink-3">{file ? (file.size / 1024 / 1024).toFixed(1) : 0} MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => pickFile(null)}
                    aria-label={t.search.removePhoto}
                    className="grid size-8 place-items-center rounded-full bg-black/5 text-ink-2 transition hover:bg-black/10"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <label
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const f = e.dataTransfer.files?.[0];
                    if (f?.type.startsWith("image/")) pickFile(f);
                  }}
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl bg-paper px-4 py-10 text-center transition duration-300 hover:bg-[#f2f2f5]"
                >
                  <ImagePlus className="size-7 text-alter-500" strokeWidth={1.5} />
                  <span className="text-[17px] text-ink">{t.search.dropPhoto}</span>
                  <span className="text-xs text-ink-3">{t.search.photoFormats}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="sr-only"
                    onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              )}
              <textarea
                aria-label={t.search.descriptionLabel}
                placeholder={t.search.descriptionPlaceholder}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={1000}
                rows={2}
                className={`${field} resize-none py-3 text-[15px]`}
              />
              <input
                type="text"
                inputMode="decimal"
                aria-label={t.search.priceLabel}
                placeholder={t.search.pricePlaceholder}
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value.replace(/[^\d.,]/g, ""))}
                className={`${field} h-12 text-[15px]`}
              />
            </motion.div>
          )}
          {mode === "text" && (
            <motion.div
              key="text"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: APPLE_EASE }}
              className="mt-6 space-y-3"
            >
              <label htmlFor="text-query" className="sr-only">
                {t.search.textLabel}
              </label>
              <textarea
                id="text-query"
                placeholder={t.search.textPlaceholder}
                value={textQuery}
                onChange={(e) => setTextQuery(e.target.value)}
                onKeyDown={(e) => {
                  // Ctrl/Cmd + Intro busca sin tener que ir al botón
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) e.currentTarget.form?.requestSubmit();
                }}
                maxLength={1000}
                rows={4}
                className={`${field} resize-none py-3.5`}
              />
              <p className="px-1 text-xs text-ink-3">{t.search.textExample}</p>
              <input
                type="text"
                inputMode="decimal"
                aria-label={t.search.priceLabel}
                placeholder={t.search.priceOptionalPlaceholder}
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value.replace(/[^\d.,]/g, ""))}
                className={`${field} h-12 text-[15px]`}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 h-12 w-full rounded-full bg-alter-500 text-[17px] text-white transition-colors duration-300 hover:bg-alter-600 disabled:cursor-wait disabled:bg-alter-400"
        >
          {loading ? t.search.searching : t.search.submit}
        </button>

        <div className="min-h-6 pt-3 text-center" aria-live="polite">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.p
                key={step}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="text-[15px] text-ink-2"
              >
                {t.search.steps[step]}
              </motion.p>
            ) : (
              error && (
                <motion.p
                  key="error"
                  role="alert"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[15px] text-[#d70015]"
                >
                  {error}
                </motion.p>
              )
            )}
          </AnimatePresence>
        </div>
      </form>

      <div ref={resultsRef} className="scroll-mt-16">
        {result && (
          <Results
            key={searchCount}
            t={t.results}
            data={result}
            image={resultImage}
            emptyIllustration={emptyIllustration}
            logos={logos}
          />
        )}
      </div>
    </div>
  );
}
