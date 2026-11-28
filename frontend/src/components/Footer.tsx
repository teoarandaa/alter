import Link from "next/link";

import { GUIDES } from "@/content/guides";
import { fill } from "@/i18n/format";
import { DEFAULT_LOCALE, localizedPath } from "@/i18n/locales";
import { getI18n } from "@/i18n/server";
import { LEGAL_PAGES } from "@/lib/legal";
import { PLATFORM_SECTIONS, PLATFORMS } from "@/lib/platforms";

import Logo from "./Logo";

export default async function Footer({
  roomForIllustration = false,
}: {
  /** Deja hueco arriba para las piernas de la ilustración sentada sobre la línea (portada). */
  roomForIllustration?: boolean;
}) {
  const { locale, t } = await getI18n();
  const href = (path: string) => localizedPath(locale, path);
  // Las guías solo están en castellano: sus títulos se marcan como tal para lectores de pantalla y buscadores.
  const guidesLang = locale === DEFAULT_LOCALE ? undefined : "es";

  // Solo rutas que existen hoy en la web.
  const nav = [
    { href: "/", label: t.footer.links.home },
    { href: "/buscar", label: t.footer.links.search },
    { href: "/#como-funciona", label: t.footer.links.how },
    { href: "/#impacto", label: t.footer.links.impact },
    { href: "/#preguntas", label: t.footer.links.faq },
  ];

  return (
    <footer className="bg-paper px-4 text-xs text-ink-2 sm:px-6">
      <div
        className={`mx-auto max-w-[1024px] border-t border-line pb-10 ${roomForIllustration ? "pt-24 sm:pt-28" : "pt-10"}`}
      >
        <div className="grid gap-10 sm:grid-cols-3 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="sm:col-span-3 lg:col-span-1">
            <Logo />
            <p className="mt-3 max-w-[280px] leading-relaxed text-ink-3">{fill(t.footer.tagline, { n: PLATFORMS.length - 3 })}</p>
          </div>

          <nav aria-label={t.footer.label}>
            <p className="font-semibold text-ink">Alter</p>
            <ul className="mt-3 space-y-2.5">
              {nav.map((l) => (
                <li key={l.href}>
                  <Link href={href(l.href)} className="transition-colors hover:text-ink hover:underline">
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

          <nav aria-label={t.footer.guides}>
            <p className="font-semibold text-ink">
              <Link href={href("/guias")} className="hover:underline">
                {t.footer.guides}
              </Link>
            </p>
            <ul className="mt-3 space-y-2.5" lang={guidesLang}>
              {GUIDES.map((g) => (
                <li key={g.slug}>
                  <Link href={href(`/guias/${g.slug}`)} className="transition-colors hover:text-ink hover:underline">
                    {g.navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t.footer.platformsLabel}>
            <p className="font-semibold text-ink">
              <Link href={href("/plataformas")} className="hover:underline">
                {t.footer.platforms}
              </Link>
            </p>
            <ul className="mt-3 space-y-2.5">
              {PLATFORM_SECTIONS.map((s) => (
                <li key={s.id}>
                  <Link href={href(`/plataformas#${s.id}`)} className="transition-colors hover:text-ink hover:underline">
                    {t.platformSections[s.id].title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={href("/plataformas")} className="text-alter-500 hover:underline">
                  {fill(t.footer.allPlatforms, { n: PLATFORMS.length })}
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <p className="mt-10 border-t border-line pt-5 leading-relaxed text-ink-3">{t.footer.disclaimer}</p>

        <div className="mt-5 text-ink-3">
          <nav aria-label={t.footer.legalLabel}>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {LEGAL_PAGES.map((l) => (
                <li key={l.slug}>
                  <Link href={href(`/${l.slug}`)} className="transition-colors hover:text-ink hover:underline">
                    {t.footer.legal[l.slug]}
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
