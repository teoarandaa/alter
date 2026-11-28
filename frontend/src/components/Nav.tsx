import Link from "next/link";

import { LogoMark } from "./Logo";

const LINKS = [
  { href: "/buscar", label: "Buscar" },
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/guias", label: "Guías" },
];

/** Menú fijo y translúcido: deja ver el contenido difuminado debajo. */
export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-white/75 backdrop-blur-xl backdrop-saturate-150">
      <nav className="mx-auto flex h-12 max-w-[1024px] items-center justify-between px-4 sm:px-6" aria-label="Principal">
        <Link href="/" aria-label="Alter, inicio" className="opacity-90 transition-opacity hover:opacity-100">
          <LogoMark className="size-10" />
        </Link>
        <ul className="flex items-center gap-5 text-xs text-ink/80 sm:gap-8">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="transition-colors hover:text-ink">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
