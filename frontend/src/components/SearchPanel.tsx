"use client";

import { AnimatePresence, motion } from "motion/react";
import { Camera, Link2, Loader2, Search, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { searchByImage, searchByUrl, type SearchResponse } from "@/lib/api";
import Results from "./Results";

type Mode = "url" | "image";

const STEPS = [
  "Analizando el producto con IA…",
  "Buscando en Wallapop, Milanuncios, Vinted y eBay…",
  "Comparando anuncios con el original…",
  "Calculando cuánto te ahorras…",
];

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
        className="mx-auto w-full max-w-2xl rounded-3xl border border-alter-100 bg-white/90 p-3 shadow-[0_20px_60px_-20px_rgba(108,60,225,0.35)] backdrop-blur"
      >
        <div role="tablist" aria-label="Cómo quieres buscar" className="relative mb-3 grid grid-cols-2 rounded-2xl bg-alter-50 p-1">
          {(["url", "image"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={`relative z-10 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-colors ${
                mode === m ? "text-alter-700" : "text-alter-900/60 hover:text-alter-700"
              }`}
            >
              {mode === m && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 -z-10 rounded-xl bg-white shadow-sm"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              {m === "url" ? <Link2 className="size-4" /> : <Camera className="size-4" />}
              {m === "url" ? "Pegar enlace" : "Subir foto"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {mode === "url" ? (
            <motion.div
              key="url"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-2 px-1"
            >
              <label htmlFor="url" className="sr-only">
                Enlace del producto nuevo
              </label>
              <input
                id="url"
                type="url"
                inputMode="url"
                placeholder="https://tienda.com/producto-que-ibas-a-comprar"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full rounded-2xl border border-alter-100 bg-white px-4 py-3.5 text-base outline-none transition placeholder:text-alter-900/35 focus:border-alter-400 focus:ring-4 focus:ring-alter-100"
              />
              <input
                type="text"
                placeholder="Detalles opcionales (talla, color, presupuesto…)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={1000}
                className="w-full rounded-2xl border border-transparent bg-alter-50/60 px-4 py-2.5 text-sm outline-none transition placeholder:text-alter-900/40 focus:border-alter-200 focus:bg-white"
              />
            </motion.div>
          ) : (
            <motion.div
              key="image"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-2 px-1"
            >
              {preview ? (
                <div className="relative flex items-center gap-4 rounded-2xl border border-alter-100 bg-alter-50/50 p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Foto subida" className="size-20 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="truncate font-medium text-alter-900">{file?.name}</p>
                    <p className="text-alter-900/50">{file ? (file.size / 1024 / 1024).toFixed(1) : 0} MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => pickFile(null)}
                    aria-label="Quitar foto"
                    className="rounded-full p-2 text-alter-900/50 transition hover:bg-white hover:text-alter-700"
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
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-alter-200 bg-alter-50/40 px-4 py-7 text-center transition hover:border-alter-400 hover:bg-alter-50"
                >
                  <Upload className="size-6 text-alter-500" />
                  <span className="text-sm font-medium text-alter-800">Arrastra una foto o haz clic para elegirla</span>
                  <span className="text-xs text-alter-900/50">JPG, PNG o WEBP · máx. 5 MB</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="sr-only"
                    onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              )}
              <textarea
                placeholder="Describe el objeto: marca, materiales, dimensiones…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={1000}
                rows={2}
                className="w-full resize-none rounded-2xl border border-alter-100 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-alter-900/35 focus:border-alter-400 focus:ring-4 focus:ring-alter-100"
              />
              <input
                type="text"
                inputMode="decimal"
                placeholder="Precio nuevo en € (opcional, para calcular el ahorro)"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value.replace(/[^\d.,]/g, ""))}
                className="w-full rounded-2xl border border-transparent bg-alter-50/60 px-4 py-2.5 text-sm outline-none transition placeholder:text-alter-900/40 focus:border-alter-200 focus:bg-white"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.98 }}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-alter-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-alter-500/30 transition hover:bg-alter-600 disabled:cursor-wait disabled:opacity-80"
        >
          {loading ? <Loader2 className="size-5 animate-spin" /> : <Search className="size-5" />}
          {loading ? "Buscando alternativas…" : "Buscar alternativas de segunda mano"}
        </motion.button>

        <AnimatePresence>
          {loading && (
            <motion.p
              key={step}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              aria-live="polite"
              className="mt-3 text-center text-sm text-alter-700"
            >
              {STEPS[step]}
            </motion.p>
          )}
          {error && !loading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              role="alert"
              className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-center text-sm text-red-700"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </form>

      <div ref={resultsRef} className="scroll-mt-6">
        {result && <Results data={result} image={resultImage} />}
      </div>
    </div>
  );
}
