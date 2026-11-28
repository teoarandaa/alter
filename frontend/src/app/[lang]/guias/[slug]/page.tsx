import type { Metadata } from "next";
import { ArrowUpRight, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import Nav from "@/components/Nav";
import RichText from "@/components/RichText";
import SpanishOnlyNotice from "@/components/SpanishOnlyNotice";
import { GUIDES, guideBySlug } from "@/content/guides";
import { fill } from "@/i18n/format";
import { DEFAULT_LOCALE, isLocale, localizedPath } from "@/i18n/locales";
import { getI18n } from "@/i18n/server";
import { platformByKey, PLATFORMS } from "@/lib/platforms";
import { PROSE } from "@/lib/prose";
import { pageMetadata } from "@/lib/site";
import { articleData } from "@/lib/structured-data";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/guias/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide || !isLocale(lang)) return {};
  // Las guías solo están en castellano: en los demás idiomas la canónica es la guía en castellano.
  return pageMetadata({
    title: guide.metaTitle,
    description: guide.description,
    path: `/guias/${guide.slug}`,
    locale: lang,
    translated: false,
    article: { published: guide.published, modified: guide.modified },
  });
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(iso),
  );
}

export default function GuidePage({ params }: PageProps<"/[lang]/guias/[slug]">) {
  // Todas las guías se generan al compilar (generateStaticParams), así que el HTML ya lleva el texto
  // completo; el <Suspense> solo hace que la navegación entre páginas sea instantánea.
  return (
    <>
      <Nav />
      <Suspense fallback={<main className="flex-1 bg-white" />}>
        <GuideContent params={params} />
      </Suspense>
      <Footer />
    </>
  );
}

async function GuideContent({ params }: { params: PageProps<"/[lang]/guias/[slug]">["params"] }) {
  const guide = guideBySlug((await params).slug);
  if (!guide) notFound();
  const { locale, t } = await getI18n();
  const spanish = locale === DEFAULT_LOCALE;
  // El artículo está escrito en castellano; lo que lo rodea (avisos, «Dónde buscar»…) va en el idioma de la página.
  const guideLang = spanish ? undefined : "es";

  const path = `/guias/${guide.slug}`;
  const platforms = guide.platforms.map(platformByKey).filter((p) => p !== undefined);
  const related = guide.related.map(guideBySlug).filter((g) => g !== undefined);
  const searchHref = localizedPath(
    locale,
    guide.search.query ? `/buscar?q=${encodeURIComponent(guide.search.query)}` : "/buscar",
  );

  return (
    <>
      <JsonLd
        data={articleData({
          title: guide.title,
          description: guide.description,
          path,
          published: guide.published,
          modified: guide.modified,
        })}
      />
      <main className="flex-1 bg-white px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
        <article className="mx-auto max-w-[720px]">
          <Breadcrumbs
            items={[
              { name: t.nav.guides, path: "/guias" },
              { name: guide.title, path, lang: guideLang },
            ]}
          />
          <SpanishOnlyNotice text={t.spanishOnly.guide} className="mt-8" />
          <div lang={guideLang}>
          <h1 className="headline mt-10 text-[34px] sm:text-[48px]">{guide.title}</h1>
          <p className="mt-4 text-sm text-ink-3">
            Actualizada el <time dateTime={guide.modified}>{formatDate(guide.modified)}</time> · {guide.readingMinutes} min de
            lectura
          </p>

          {/* La respuesta primero: lo esencial antes del detalle */}
          <section aria-labelledby="resumen" className="mt-10 rounded-[28px] bg-alter-50 p-7 sm:p-8">
            <h2 id="resumen" className="text-[17px] font-semibold text-ink">
              En resumen
            </h2>
            <ul className="mt-4 space-y-3 text-[16px] leading-relaxed text-ink-2">
              {guide.summary.map((point) => (
                <li key={point} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[9px] size-1.5 shrink-0 rounded-full bg-alter-500" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className={`mt-4 ${PROSE}`}>{guide.body}</div>
          </div>

          {/* Dónde buscar: las webs que encajan con la guía */}
          {platforms.length > 0 && (
            <section aria-labelledby="donde-buscar" className="mt-16">
              <h2 id="donde-buscar" className="text-[24px] font-semibold tracking-[-0.02em] text-ink sm:text-[28px]">
                {t.guides.whereToSearch}
              </h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {platforms.map((p) => (
                  <li key={p.key} className="rounded-2xl bg-paper p-5">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-ink hover:underline"
                    >
                      {p.name}
                      <ArrowUpRight className="size-3.5 text-ink-3" aria-hidden="true" />
                    </a>
                    <p className="mt-1 text-sm leading-relaxed text-ink-2">{t.platforms[p.key].description}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-ink-3">
                <RichText
                  text={fill(t.guides.moreDetails, { n: PLATFORMS.length })}
                  locale={locale}
                  className="text-alter-500 hover:underline"
                />
              </p>
            </section>
          )}

          {/* Llamada a la acción: buscar en Alter con el texto ya escrito */}
          <section className="mt-16 rounded-[28px] bg-ink p-8 text-white sm:p-10">
            <h2 className="text-[24px] font-semibold leading-tight tracking-[-0.02em] sm:text-[28px]">
              {fill(t.guides.ctaTitle, { n: PLATFORMS.length })}
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-white/75">{t.guides.ctaText}</p>
            <Link
              href={searchHref}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-alter-500 px-6 py-3 text-[16px] text-white transition-colors hover:bg-alter-400"
            >
              <Search className="size-4" aria-hidden="true" />
              {spanish ? guide.search.label : t.guides.ctaButton}
            </Link>
          </section>

          {related.length > 0 && (
            <section aria-labelledby="relacionadas" className="mt-16">
              <h2 id="relacionadas" className="text-[24px] font-semibold tracking-[-0.02em] text-ink sm:text-[28px]">
                {t.guides.related}
              </h2>
              <ul className="mt-6 space-y-3">
                {related.map((g) => (
                  <li key={g.slug}>
                    <Link
                      href={localizedPath(locale, `/guias/${g.slug}`)}
                      className="group flex items-center justify-between gap-4 rounded-2xl bg-paper p-5 transition-colors hover:bg-alter-50"
                    >
                      <span lang={guideLang} className="font-semibold text-ink">
                        {g.title}
                      </span>
                      <ChevronRight className="size-4 shrink-0 text-alter-500 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </main>
    </>
  );
}
