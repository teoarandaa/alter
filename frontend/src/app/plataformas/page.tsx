import type { Metadata } from "next";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import Link from "next/link";

import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import PlatformMark from "@/components/PlatformMark";
import Reveal from "@/components/Reveal";
import { availableLogos } from "@/lib/logos";
import { PLATFORM_SECTIONS, PLATFORMS } from "@/lib/platforms";

export const metadata: Metadata = {
  title: "Dónde buscamos",
  description: `Las ${PLATFORMS.length} webs de segunda mano en las que busca Alter: Wallapop, Vinted, Milanuncios, eBay, Back Market, Vestiaire Collective y más, y qué encontrarás en cada una.`,
  alternates: { canonical: "/plataformas" },
};

export default function PlataformasPage() {
  const logos = availableLogos(PLATFORM_SECTIONS.flatMap((s) => s.platforms.map((p) => p.key)));

  return (
    <>
      <Nav />

      <main className="flex-1">
        {/* Cabecera */}
        <section className="bg-white px-4 pb-12 pt-20 text-center sm:px-6 sm:pb-16 sm:pt-28">
          <Reveal className="mx-auto max-w-[760px]">
            <h1 className="headline text-[40px] sm:text-[64px]">
              {PLATFORMS.length} webs.
              <br />
              <span className="text-alter-500">Una sola búsqueda.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-[620px] text-[19px] text-ink-2 sm:text-[21px]">
              Alter busca en las principales webs de segunda mano con mercado en España. Según lo que busques, te
              enseñamos sus anuncios o te llevamos directamente a su búsqueda.
            </p>
          </Reveal>

          {/* Accesos rápidos a cada apartado */}
          <Reveal delay={0.1} className="mx-auto mt-10 flex max-w-[860px] flex-wrap justify-center gap-x-6 gap-y-3">
            {PLATFORM_SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="group inline-flex items-center text-[15px] text-alter-500 hover:underline">
                {s.title}
                <ChevronRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
            ))}
          </Reveal>
        </section>

        {/* Apartados */}
        {PLATFORM_SECTIONS.map((section, si) => (
          <section
            key={section.id}
            id={section.id}
            className={`scroll-mt-12 px-4 py-16 sm:px-6 sm:py-20 ${si % 2 === 0 ? "bg-paper" : "bg-white"}`}
          >
            <div className="mx-auto max-w-[1024px]">
              <Reveal>
                <h2 className="headline text-[32px] sm:text-[44px]">{section.title}</h2>
                <p className="mt-2 max-w-[640px] text-[17px] text-ink-2 sm:text-[19px]">{section.intro}</p>
              </Reveal>

              <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {section.platforms.map((p, i) => (
                  <Reveal
                    as="li"
                    key={p.key}
                    delay={i * 0.08}
                    className={`flex flex-col rounded-[28px] p-7 sm:p-8 ${si % 2 === 0 ? "bg-white" : "bg-paper"}`}
                  >
                    <h3 className="flex h-8 items-center text-[21px] font-semibold tracking-[-0.02em] text-ink">
                      <PlatformMark platformKey={p.key} name={p.name} color={p.color} logo={logos[p.key]} />
                    </h3>
                    <p className={`mt-2 text-xs font-medium ${p.inline ? "text-alter-600" : "text-ink-3"}`}>
                      {p.inline ? "Anuncios en Alter, con precio y ahorro" : "Te enlazamos su búsqueda"}
                    </p>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{p.description}</p>

                    <p className="mt-5 text-xs font-semibold text-ink-3">Qué encontrarás</p>
                    <ul className="mt-2 flex flex-wrap gap-1.5" aria-label={`Productos en ${p.name}`}>
                      {p.products.map((product) => (
                        <li key={product} className="rounded-full bg-alter-50 px-2.5 py-1 text-xs text-alter-700">
                          {product}
                        </li>
                      ))}
                    </ul>

                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-auto inline-flex items-center gap-1 pt-6 text-[15px] text-alter-500 hover:underline"
                    >
                      Visitar {p.name}
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </Reveal>
                ))}
              </ul>
            </div>
          </section>
        ))}

        {/* Llamada final */}
        <section className="bg-white px-4 py-20 text-center sm:px-6 sm:py-28">
          <Reveal className="mx-auto max-w-[680px]">
            <h2 className="headline text-[32px] sm:text-[48px]">No tienes que mirarlas una a una.</h2>
            <p className="mt-3 text-[19px] text-ink-2">Pega un enlace, sube una foto o descríbelo, y buscamos por ti.</p>
            <Link
              href="/buscar"
              className="mt-8 inline-block rounded-full bg-alter-500 px-6 py-3 text-[17px] text-white transition-colors duration-300 hover:bg-alter-600"
            >
              Buscar alternativas
            </Link>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}
