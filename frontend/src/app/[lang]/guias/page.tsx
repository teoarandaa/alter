import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import SpanishOnlyNotice from "@/components/SpanishOnlyNotice";
import { GUIDES } from "@/content/guides";
import { fill } from "@/i18n/format";
import { DEFAULT_LOCALE, isLocale, localizedPath } from "@/i18n/locales";
import { getDictionary, getI18n } from "@/i18n/server";
import { pageMetadata } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/guias">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { meta } = getDictionary(lang);
  // Las guías solo están en castellano: en los demás idiomas la canónica es la página en castellano.
  return pageMetadata({ title: meta.guidesTitle, description: meta.guidesDescription, path: "/guias", locale: lang, translated: false });
}

export default async function GuiasPage() {
  const { locale, t } = await getI18n();
  const guidesLang = locale === DEFAULT_LOCALE ? undefined : "es";

  return (
    <>
      <Nav />
      <main className="flex-1 bg-white px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
        <div className="mx-auto max-w-[1024px]">
          <Breadcrumbs items={[{ name: t.nav.guides, path: "/guias" }]} />
          <header className="mt-10 max-w-[720px]">
            <h1 className="headline text-[40px] sm:text-[56px]">{t.guides.title}</h1>
            <p className="mt-4 text-[19px] text-ink-2 sm:text-[21px]">{t.guides.intro}</p>
            <SpanishOnlyNotice text={t.spanishOnly.guide} className="mt-6" />
          </header>

          <ul className="mt-14 grid gap-5 sm:grid-cols-2">
            {GUIDES.map((g) => (
              <li key={g.slug}>
                <Link
                  href={localizedPath(locale, `/guias/${g.slug}`)}
                  className="group flex h-full flex-col rounded-[28px] bg-paper p-7 transition-colors hover:bg-alter-50 sm:p-8"
                >
                  <h2 lang={guidesLang} className="text-[21px] font-semibold leading-snug tracking-[-0.02em] text-ink">
                    {g.title}
                  </h2>
                  <p lang={guidesLang} className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-2">
                    {g.excerpt}
                  </p>
                  <span className="mt-5 inline-flex items-center text-[15px] text-alter-500">
                    {fill(t.guides.readGuide, { n: g.readingMinutes })}
                    <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
