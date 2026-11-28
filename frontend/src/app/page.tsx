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
import { illustration, type IllustrationName } from "@/lib/illustrations";
import { PLATFORMS } from "@/lib/platforms";
import { HOME_DESCRIPTION, HOME_TITLE } from "@/lib/seo-copy";
import { pageMetadata, SITE_TAGLINE } from "@/lib/site";
import { homeGraph } from "@/lib/structured-data";

export const metadata: Metadata = {
  ...pageMetadata({ title: HOME_TITLE, description: HOME_DESCRIPTION, path: "/", socialTitle: `Alter · ${SITE_TAGLINE}` }),
  // La portada no lleva « · Alter» al final: el título ya empieza por la marca.
  title: { absolute: HOME_TITLE },
};

const STEPS: {
  icon: typeof Link2;
  alt?: typeof Link2;
  title: string;
  altTitle?: string;
  text: string;
  image: IllustrationName;
}[] = [
  {
    icon: Link2,
    image: "paso-1-enlace.svg",
    title: "Pega un enlace,",
    alt: Camera,
    altTitle: "una foto o descríbelo.",
    text: "El enlace de la tienda donde ibas a comprarlo nuevo, una foto o unas pocas palabras: «sillón de piel marrón», «iPhone 13 128 GB»…",
  },
  {
    icon: ScanSearch,
    image: "paso-2-busqueda.svg",
    title: "La IA lo entiende.",
    text: "Reconoce el producto y sus características, y lo busca en las principales webs de segunda mano.",
  },
  {
    icon: Tags,
    image: "paso-3-ahorro.svg",
    title: "Tú ahorras.",
    text: "Enlaces directos a cada anuncio, su precio y cuánto te ahorras frente a comprarlo nuevo.",
  },
];

const FIGURES = [
  { eyebrow: "Plataformas", value: PLATFORMS.length, unit: "webs", label: "de segunda mano en una sola búsqueda." },
  { eyebrow: "Precio", value: 0, unit: "€", label: "Usar Alter es gratis." },
  { eyebrow: "Lo que necesitas", value: 1, unit: "enlace", label: "o una foto, o unas palabras. Nada más." },
];

export default function Home() {
  const impactImage = illustration("impacto.svg");
  const finalImage = illustration("final.svg");

  return (
    <>
      <Nav />
      <JsonLd data={homeGraph()} />

      <main>
        <Hero image={illustration("hero.svg")} />

        {/* Cómo funciona */}
        <section id="como-funciona" className="bg-white px-4 py-24 sm:px-6 sm:py-32">
          <div className="mx-auto max-w-[1024px]">
            <Reveal>
              <h2 className="headline text-[40px] sm:text-[64px]">Así de fácil.</h2>
            </Reveal>
            <ol className="mt-14 grid gap-5 md:grid-cols-3">
              {STEPS.map((s, i) => {
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
              text="Cada objeto que compras de segunda mano es uno que no hay que fabricar, empaquetar ni transportar. Reutilizar debería ser tan fácil como comprar nuevo. Ahora lo es."
            />
            {impactImage && (
              <Reveal className="mx-auto mt-20 max-w-[440px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={impactImage} alt="" className="h-auto w-full" />
              </Reveal>
            )}
            {/* Cifras destacadas: etiqueta arriba, número grande y frase corta abajo */}
            <div className="mt-20 grid gap-5 md:grid-cols-3">
              {FIGURES.map((f, i) => (
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
              <h2 className="headline text-[40px] sm:text-[64px]">Compra usado sin sustos.</h2>
              <p className="mt-4 max-w-[640px] text-[19px] text-ink-2 sm:text-[21px]">
                Qué revisar antes de pagar, en guías cortas y prácticas.
              </p>
            </Reveal>
            <ul className="mt-12 grid gap-5 md:grid-cols-3">
              {GUIDES.slice(0, 3).map((g, i) => (
                <Reveal as="li" key={g.slug} delay={i * 0.12}>
                  <Link
                    href={`/guias/${g.slug}`}
                    className="group flex h-full flex-col rounded-[28px] bg-white p-8 transition-colors hover:bg-alter-50"
                  >
                    <h3 className="text-[21px] font-semibold leading-snug tracking-[-0.02em] text-ink">{g.title}</h3>
                    <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-2">{g.excerpt}</p>
                    <span className="mt-5 inline-flex items-center text-[15px] text-alter-500">
                      Leer la guía
                      <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
            <Link href="/guias" className="group mt-8 inline-flex items-center text-[17px] text-alter-500 hover:underline">
              Ver todas las guías
              <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>

        <Faq />

        {/* Llamada final */}
        <section className="bg-paper px-4 py-24 text-center sm:px-6 sm:py-32">
          <Reveal className="mx-auto max-w-[680px]">
            <h2 className="headline text-[40px] sm:text-[64px]">Tu próxima compra ya existe.</h2>
            <p className="mt-4 text-[19px] text-ink-2 sm:text-[21px]">Solo hay que encontrarla.</p>
            <Link
              href="/buscar"
              className="mt-9 inline-block rounded-full bg-alter-500 px-6 py-3 text-[17px] text-white transition-colors duration-300 hover:bg-alter-600"
            >
              Empezar a buscar
            </Link>
            {finalImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={finalImage} alt="" className="mx-auto mt-16 h-44 w-auto sm:h-56" />
            )}
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}
