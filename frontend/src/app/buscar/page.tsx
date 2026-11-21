import type { Metadata } from "next";
import Link from "next/link";

import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import SearchPanel from "@/components/SearchPanel";
import { illustration } from "@/lib/illustrations";
import { availableLogos } from "@/lib/logos";
import { PLATFORM_SECTIONS, PLATFORMS } from "@/lib/platforms";

export const metadata: Metadata = {
  title: "Buscar alternativas",
  description:
    "Pega el enlace de lo que ibas a comprar nuevo, sube una foto o descríbelo y encuentra alternativas de segunda mano en Wallapop, Vinted, Milanuncios, eBay y más.",
  alternates: { canonical: "/buscar" },
};

export default function BuscarPage() {
  return (
    <>
      <Nav />

      <main className="flex-1 bg-paper px-4 pb-24 pt-16 sm:px-6 sm:pb-32 sm:pt-24">
        <Reveal className="mx-auto max-w-[680px] text-center">
          <h1 className="headline text-[36px] sm:text-[56px]">¿Qué ibas a comprar?</h1>
          <p className="mt-3 text-[19px] text-ink-2 sm:text-[21px]">Lo buscamos de segunda mano por ti.</p>
        </Reveal>
        <Reveal delay={0.1} className="mt-12">
          <SearchPanel
            emptyIllustration={illustration("sin-resultados.svg")}
            logos={availableLogos(PLATFORM_SECTIONS.flatMap((s) => s.platforms.map((p) => p.key)))}
          />
        </Reveal>
        <Reveal delay={0.2} className="mx-auto mt-12 max-w-[680px] text-center text-xs leading-relaxed text-ink-3">
          Buscamos en {PLATFORMS.length} webs de segunda mano.{" "}
          <Link href="/plataformas" className="text-alter-500 hover:underline">
            Ver cuáles
          </Link>
        </Reveal>
      </main>

      <Footer />
    </>
  );
}
