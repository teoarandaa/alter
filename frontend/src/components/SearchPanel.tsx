"use client";

import { AnimatePresence, motion } from "motion/react";
import { ImagePlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { searchByImage, searchByUrl, type SearchResponse } from "@/lib/api";
import { APPLE_EASE } from "./Reveal";
import Results from "./Results";
import Segmented from "./Segmented";

type Mode = "url" | "image";

const STEPS = [
  "Analizando el producto…",
  "Buscando en Wallapop, Milanuncios, Vinted y eBay…",
  "Comparando cada anuncio con el original…",
  "Calculando cuánto ahorras…",
];

const field =
  "w-full rounded-xl border border-transparent bg-paper px-4 text-[17px] text-ink outline-none transition duration-300 placeholder:text-ink-3 focus:border-alter-500 focus:bg-white focus:ring-4 focus:ring-alter-500/15";

export default function SearchPanel() {
  const [mode, setMode] = useState<Mode>("url");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
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
    const id = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 4500);
    return () => clearInterval(id);
  }, [loading]);

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
      setError("Pega un enlace válido (empieza por http:// o https://).");
      return;
    }
    if (mode === "image" && !file) {
      setError("Sube una foto del objeto.");
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setStep(0);
    setLoading(true);
    try {
      const data =
        mode === "url"
          ? await searchByUrl(url.trim(), notes.trim(), controller.signal)
          : await searchByImage(file!, description.trim(), Number(newPrice.replace(",", ".")) || undefined, controller.signal);
      setResult(data);
      setSearchCount((n) => n + 1);
      setResultImage(mode === "image" ? preview : data.source_image);
    } catch (err) {
      if ((err as Error).name !== "AbortError") setError((err as Error).message);
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
            label="Cómo quieres buscar"
            value={mode}
            onChange={setMode}
            options={[
              { value: "url", label: "Enlace" },
              { value: "image", label: "Foto" },
            ]}
          />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {mode === "url" ? (
            <motion.div
              key="url"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: APPLE_EASE }}
              className="mt-6 space-y-3"
            >
              <label htmlFor="url" className="sr-only">
                Enlace del producto nuevo
              </label>
              <input
                id="url"
                type="url"
                inputMode="url"
                placeholder="Enlace del producto en la tienda"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className={`${field} h-14`}
              />
              <input
                type="text"
                aria-label="Detalles opcionales"
                placeholder="Detalles opcionales: talla, color, presupuesto…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={1000}
                className={`${field} h-12 text-[15px]`}
              />
            </motion.div>
          ) : (
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
                  <img src={preview} alt="Foto subida" className="size-16 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] text-ink">{file?.name}</p>
                    <p className="text-xs text-ink-3">{file ? (file.size / 1024 / 1024).toFixed(1) : 0} MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => pickFile(null)}
                    aria-label="Quitar foto"
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
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl bg-paper px-4 py-10 text-center transition duration-300 hover:bg-[#ececf0]"
                >
                  <ImagePlus className="size-7 text-alter-500" strokeWidth={1.5} />
                  <span className="text-[17px] text-ink">Arrastra una foto o elige una</span>
                  <span className="text-xs text-ink-3">JPG, PNG o WEBP · hasta 5 MB</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="sr-only"
                    onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              )}
              <textarea
                aria-label="Descripción del objeto"
                placeholder="Descríbelo si quieres: marca, materiales, medidas…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={1000}
                rows={2}
                className={`${field} resize-none py-3 text-[15px]`}
              />
              <input
                type="text"
                inputMode="decimal"
                aria-label="Precio nuevo en euros"
                placeholder="Precio nuevo en € (para calcular el ahorro)"
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
          {loading ? "Buscando…" : "Buscar alternativas"}
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
                {STEPS[step]}
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
        {result && <Results key={searchCount} data={result} image={resultImage} />}
      </div>
    </div>
  );
}
