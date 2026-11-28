"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { LOCALE_INFO, LOCALES, localizedPath, stripLocale, type Locale } from "@/i18n/locales";
import { APPLE_EASE } from "./Reveal";

/**
 * Desplegable de idioma del menú. Lleva a la misma página en el idioma elegido (con recarga completa,
 * para que cambie también el <html lang> y los metadatos). Los buscadores encuentran las otras
 * versiones por las etiquetas hreflang, no por este menú.
 */
export default function LanguageSwitcher({
  current,
  label,
  changeLabel,
}: {
  current: Locale;
  label: string;
  changeLabel: string;
}) {
  const [open, setOpen] = useState(false);
  // Ruta de la página actual sin el prefijo de idioma, con sus parámetros y su ancla.
  const [here, setHere] = useState("/");
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const menuId = useId();
  const info = LOCALE_INFO[current];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    // Al abrir, el foco va al idioma actual para poder moverse con las flechas.
    listRef.current?.querySelector<HTMLAnchorElement>('[aria-current="true"]')?.focus();
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function toggle() {
    if (!open) setHere(`${stripLocale(window.location.pathname)}${window.location.search}${window.location.hash}`);
    setOpen((o) => !o);
  }

  function onListKeyDown(e: React.KeyboardEvent<HTMLUListElement>) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const items = [...(listRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [])];
    const index = items.indexOf(document.activeElement as HTMLAnchorElement);
    const next =
      e.key === "Home" ? 0 : e.key === "End" ? items.length - 1 : (index + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
    items[next]?.focus();
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${changeLabel}: ${info.name}`}
        className="flex items-center gap-1 rounded-full py-1 transition-colors hover:text-ink aria-expanded:text-ink"
      >
        <Globe className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
        <span className="sm:hidden">{info.short}</span>
        <span className="hidden sm:inline">{info.name}</span>
        <ChevronDown
          className={`size-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: APPLE_EASE }}
            className="absolute right-0 top-full z-50 mt-3 w-60 origin-top-right overflow-hidden rounded-2xl border border-black/[0.06] bg-white/95 shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl"
          >
            <p className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-ink-3">{label}</p>
            <ul
              ref={listRef}
              onKeyDown={onListKeyDown}
              className="max-h-[calc(100svh-7rem)] overflow-y-auto pb-1.5"
            >
              {LOCALES.map((locale) => {
                const item = LOCALE_INFO[locale];
                const active = locale === current;
                return (
                  <li key={locale}>
                    <a
                      href={localizedPath(locale, here)}
                      hrefLang={item.htmlLang}
                      lang={item.htmlLang}
                      aria-current={active ? "true" : undefined}
                      onClick={(e) => {
                        if (active) {
                          e.preventDefault();
                          setOpen(false);
                        }
                      }}
                      className={`flex items-center justify-between gap-3 px-4 py-2 outline-none transition-colors hover:bg-alter-50 focus-visible:bg-alter-50 ${
                        active ? "text-alter-600" : "text-ink"
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block text-[14px] leading-tight">{item.name}</span>
                        <span lang="es" className="block text-[11px] leading-tight text-ink-3">
                          {item.spanishName}
                        </span>
                      </span>
                      {active && <Check className="size-4 shrink-0" aria-hidden="true" />}
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
