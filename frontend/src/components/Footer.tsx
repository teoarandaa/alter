import Link from "next/link";

import Logo from "./Logo";

// Solo rutas que existen hoy en la web.
const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/#buscar", label: "Buscar" },
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/#impacto", label: "Impacto" },
];

const PLATFORMS = ["Wallapop", "Milanuncios", "Vinted", "eBay", "Cash Converters", "Secondbest", "Todocolección"];

export default function Footer() {
  return (
    <footer className="bg-paper px-4 text-xs text-ink-2 sm:px-6">
      <div className="mx-auto max-w-[1024px] border-t border-line pb-10 pt-10">
        <div className="grid gap-10 sm:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-[280px] leading-relaxed text-ink-3">
              Alternativas de segunda mano que ayudan al planeta.
            </p>
          </div>

          <nav aria-label="Pie de página">
            <h2 className="font-semibold text-ink">Alter</h2>
            <ul className="mt-3 space-y-2.5">
              {NAV.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-ink hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-semibold text-ink">Buscamos en</h2>
            <ul className="mt-3 space-y-2.5">
              {PLATFORMS.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-line pt-5 leading-relaxed text-ink-3">
          Los anuncios pertenecen a cada plataforma y sus precios pueden cambiar. Los resultados marcados como
          «Patrocinado» aparecen destacados por acuerdo comercial con esa plataforma.
        </p>
      </div>
    </footer>
  );
}
