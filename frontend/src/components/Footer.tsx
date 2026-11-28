import Link from "next/link";

import { GUIDES } from "@/content/guides";
import { LEGAL_PAGES } from "@/lib/legal";
import { PLATFORM_SECTIONS, PLATFORMS } from "@/lib/platforms";

import Logo from "./Logo";

// Solo rutas que existen hoy en la web.
const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/buscar", label: "Buscar" },
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/#impacto", label: "Impacto" },
  { href: "/#preguntas", label: "Preguntas frecuentes" },
];

export default function Footer() {
  return (
    <footer className="bg-paper px-4 text-xs text-ink-2 sm:px-6">
      <div className="mx-auto max-w-[1024px] border-t border-line pb-10 pt-10">
        <div className="grid gap-10 sm:grid-cols-3 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="sm:col-span-3 lg:col-span-1">
            <Logo />
            <p className="mt-3 max-w-[280px] leading-relaxed text-ink-3">
              El buscador de segunda mano: Wallapop, Vinted, eBay y {PLATFORMS.length - 3} webs más en una sola búsqueda.
            </p>
          </div>

          <nav aria-label="Pie de página">
            <p className="font-semibold text-ink">Alter</p>
            <ul className="mt-3 space-y-2.5">
              {NAV.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-ink hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="mailto:hola@alter2mano.es" className="transition-colors hover:text-ink hover:underline">
                  hola@alter2mano.es
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Guías">
            <p className="font-semibold text-ink">
              <Link href="/guias" className="hover:underline">
                Guías
              </Link>
            </p>
            <ul className="mt-3 space-y-2.5">
              {GUIDES.map((g) => (
                <li key={g.slug}>
                  <Link href={`/guias/${g.slug}`} className="transition-colors hover:text-ink hover:underline">
                    {g.navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Webs en las que buscamos">
            <p className="font-semibold text-ink">
              <Link href="/plataformas" className="hover:underline">
                Buscamos en
              </Link>
            </p>
            <ul className="mt-3 space-y-2.5">
              {PLATFORM_SECTIONS.map((s) => (
                <li key={s.id}>
                  <Link href={`/plataformas#${s.id}`} className="transition-colors hover:text-ink hover:underline">
                    {s.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/plataformas" className="text-alter-500 hover:underline">
                  Ver las {PLATFORMS.length} webs ›
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <p className="mt-10 border-t border-line pt-5 leading-relaxed text-ink-3">
          Los anuncios pertenecen a cada plataforma y sus precios pueden cambiar. Los resultados marcados como
          «Patrocinado» aparecen destacados por acuerdo comercial con esa plataforma.
        </p>

        <div className="mt-5 text-ink-3">
          <nav aria-label="Información legal">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {LEGAL_PAGES.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-ink hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
