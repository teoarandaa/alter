import Link from "next/link";

import { localizedPath } from "@/i18n/locales";
import { getI18n } from "@/i18n/server";

import LanguageSwitcher from "./LanguageSwitcher";
import { LogoMark } from "./Logo";

/** Menú fijo y translúcido: deja ver el contenido difuminado debajo. */
export default async function Nav() {
  const { locale, t } = await getI18n();
  const links = [
    { href: "/buscar", label: t.nav.search },
    { href: "/#como-funciona", label: t.nav.how },
    { href: "/guias", label: t.nav.guides },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-white/75 backdrop-blur-xl backdrop-saturate-150">
      <nav className="mx-auto flex h-12 max-w-[1024px] items-center justify-between px-4 sm:px-6" aria-label={t.nav.label}>
        <Link
          href={localizedPath(locale, "/")}
          aria-label={t.nav.home}
          className="opacity-90 transition-opacity hover:opacity-100"
        >
          <LogoMark className="size-10" />
        </Link>
        <ul className="flex items-center gap-5 text-xs text-ink/80 sm:gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={localizedPath(locale, l.href)} className="transition-colors hover:text-ink">
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <LanguageSwitcher current={locale} label={t.language.label} changeLabel={t.language.change} />
          </li>
        </ul>
      </nav>
    </header>
  );
}
