import type { Metadata } from "next";
import { Camera, ChevronRight, Link2, ScanSearch, Tags } from "lucide-react";
import Link from "next/link";

import Hero from "@/components/Hero";
import CountUp from "@/components/CountUp";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import ScrollText from "@/components/ScrollText";
import { GUIDES } from "@/content/guides";
import { DEFAULT_LOCALE, isLocale, localizedPath } from "@/i18n/locales";
import { getDictionary, getI18n } from "@/i18n/server";
import { illustration, type IllustrationName } from "@/lib/illustrations";
import { PLATFORMS } from "@/lib/platforms";
import { pageMetadata } from "@/lib/site";
import { homeGraph } from "@/lib/structured-data";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { meta } = getDictionary(lang);
  return {
    ...pageMetadata({
      title: meta.homeTitle,
      description: meta.homeDescription,
      path: "/",
      locale: lang,
      socialTitle: `Alter · ${meta.tagline}`,
    }),
    // La portada no lleva « · Alter» al final: el título ya empieza por la marca.
    title: { absolute: meta.homeTitle },
  };
}

/** Iconos e ilustraciones de los tres pasos; los textos están en el diccionario (home.steps). */
const STEPS: { icon: typeof Link2; alt?: typeof Link2; image: IllustrationName }[] = [
  { icon: Link2, alt: Camera, image: "paso-1-enlace.svg" },
  { icon: ScanSearch, image: "paso-2-busqueda.svg" },
  { icon: Tags, image: "paso-3-ahorro.svg" },
];

/** Cifras destacadas; los textos están en el diccionario (home.figures). */
const FIGURE_VALUES = [PLATFORMS.length, 0, 1];

export default async function Home() {
  const { locale, t } = await getI18n();
  const href = (path: string) => localizedPath(locale, path);
  // Las guías solo están en castellano: sus tarjetas se marcan como tal.
  const guidesLang = locale === DEFAULT_LOCALE ? undefined : "es";
  const impactImage = illustration("impacto.svg");
  const perchImage = illustration("sentada.svg");
  const steps = STEPS.map((s, i) => ({ ...s, ...t.home.steps[i] }));
  const figures = t.home.figures.map((f, i) => ({ ...f, value: FIGURE_VALUES[i] }));

  return (
    <>
      <Nav />
      <JsonLd data={homeGraph(locale, t)} />

      <main>
        <Hero image={illustration("hero.svg")} t={t.hero} searchHref={href("/buscar")} />

        {/* Cómo funciona */}
        <section id="como-funciona" className="bg-white px-4 py-24 sm:px-6 sm:py-32">
          <div className="mx-auto max-w-[1024px]">
            <Reveal>
              <h2 className="headline text-[40px] sm:text-[64px]">{t.home.stepsTitle}</h2>
            </Reveal>
            <ol className="mt-14 grid gap-5 md:grid-cols-3">
              {steps.map((s, i) => {
                const image = illustration(s.image);
                return (
                  <Reveal as="li" key={s.title} delay={i * 0.12} className="flex flex-col rounded-[28px] bg-paper p-8 sm:p-10">
                    <span className="text-[15px] font-semibold text-ink-3">{i + 1}</span>
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image} alt="" className="mt-6 h-40 w-full object-contain" />
                    ) : (
                      <div className="mt-10 flex gap-3 text-alter-500">
                        <s.icon className="size-8" strokeWidth={1.5} />
                        {s.alt && <s.alt className="size-8" strokeWidth={1.5} />}
                      </div>
                    )}
                    <h3 className="headline mt-6 text-[28px]">
                      {s.title}
                      {s.altTitle && <span className="block text-ink-3">{s.altTitle}</span>}
                    </h3>
                    <p className="mt-3 text-[17px] text-ink-2">{s.text}</p>
                  </Reveal>
                );
              })}
            </ol>
          </div>
        </section>

        {/* Impacto: texto que se revela con el scroll */}
        <section id="impacto" className="bg-white px-4 pb-24 pt-8 sm:px-6 sm:pb-36">
          <div className="mx-auto max-w-[1024px]">
            <ScrollText
              className="text-[32px] sm:text-[48px] lg:text-[56px]"
              text={t.home.impact}
            />
            {impactImage && (
              <Reveal className="mx-auto mt-20 max-w-[440px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={impactImage} alt="" className="h-auto w-full" />
              </Reveal>
            )}
            {/* Cifras destacadas: etiqueta arriba, número grande y frase corta abajo */}
            <div className="mt-20 grid gap-5 md:grid-cols-3">
              {figures.map((f, i) => (
                <Reveal
                  key={f.eyebrow}
                  delay={i * 0.12}
                  className="flex flex-col rounded-[28px] bg-paper p-8 sm:p-10"
                >
                  <p className="text-[15px] font-semibold text-ink-3">{f.eyebrow}</p>
                  <div className="mt-12 sm:mt-16">
                    <p className="headline flex items-baseline gap-2 text-alter-500">
                      <span className="text-[72px] leading-none sm:text-[88px]">
                        <CountUp to={f.value} />
                      </span>
                      <span className="text-[28px] sm:text-[32px]">{f.unit}</span>
                    </p>
                    <p className="mt-3 text-[17px] text-ink-2">{f.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Guías: contenido útil que Google posiciona y que enlaza con el buscador */}
        <section id="guias" className="bg-paper px-4 py-24 sm:px-6 sm:py-32">
          <div className="mx-auto max-w-[1024px]">
            <Reveal>
              <h2 className="headline text-[40px] sm:text-[64px]">{t.home.guidesTitle}</h2>
              <p className="mt-4 max-w-[640px] text-[19px] text-ink-2 sm:text-[21px]">{t.home.guidesIntro}</p>
            </Reveal>
            <ul className="mt-12 grid gap-5 md:grid-cols-3">
              {GUIDES.slice(0, 3).map((g, i) => (
                <Reveal as="li" key={g.slug} delay={i * 0.12}>
                  <Link
                    href={href(`/guias/${g.slug}`)}
                    className="group flex h-full flex-col rounded-[28px] bg-white p-8 transition-colors hover:bg-alter-50"
                  >
                    <h3 lang={guidesLang} className="text-[21px] font-semibold leading-snug tracking-[-0.02em] text-ink">
                      {g.title}
                    </h3>
                    <p lang={guidesLang} className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-2">
                      {g.excerpt}
                    </p>
                    <span className="mt-5 inline-flex items-center text-[15px] text-alter-500">
                      {t.home.readGuide}
                      <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
            <Link href={href("/guias")} className="group mt-8 inline-flex items-center text-[17px] text-alter-500 hover:underline">
              {t.home.allGuides}
              <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>

        <Faq />

        {/* Llamada final */}
        <section className={`bg-paper px-4 pt-24 text-center sm:px-6 sm:pt-32 ${perchImage ? "" : "pb-24 sm:pb-32"}`}>
          <Reveal className="mx-auto max-w-[680px]">
            <h2 className="headline text-[40px] sm:text-[64px]">{t.home.finalTitle}</h2>
            <p className="mt-4 text-[19px] text-ink-2 sm:text-[21px]">{t.home.finalText}</p>
            <Link
              href={href("/buscar")}
              className="mt-9 inline-block rounded-full bg-alter-500 px-6 py-3 text-[17px] text-white transition-colors duration-300 hover:bg-alter-600"
            >
              {t.home.finalCta}
            </Link>
          </Reveal>
          {perchImage && (
            // La pareja se sienta sobre la línea superior del pie: el asiento está al 65,64 % de la altura
            // de la imagen, así que el margen negativo hace bajar el 34,36 % restante (las piernas) al pie.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={perchImage}
              alt=""
              className="relative z-10 mx-auto mt-14 h-(--perch-h) w-auto -mb-[calc(var(--perch-h)*0.3436)] [--perch-h:190px] sm:mt-16 sm:[--perch-h:240px]"
            />
          )}
        </section>
      </main>

      <Footer roomForIllustration={Boolean(perchImage)} />
    </>
  );
}
