import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { GUIDES } from "@/content/guides";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Guías para comprar de segunda mano",
  description:
    "Guías prácticas para comprar de segunda mano sin sustos: cómo evitar estafas y qué revisar en móviles, portátiles, bicicletas y muebles usados.",
  path: "/guias",
});

export default function GuiasPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 bg-white px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
        <div className="mx-auto max-w-[1024px]">
          <Breadcrumbs items={[{ name: "Guías", path: "/guias" }]} />
          <header className="mt-10 max-w-[720px]">
            <h1 className="headline text-[40px] sm:text-[56px]">Guías para comprar de segunda mano</h1>
            <p className="mt-4 text-[19px] text-ink-2 sm:text-[21px]">
              Lo que conviene revisar antes de pagar, para que comprar usado sea igual de fácil y seguro que comprar nuevo.
            </p>
          </header>

          <ul className="mt-14 grid gap-5 sm:grid-cols-2">
            {GUIDES.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/guias/${g.slug}`}
                  className="group flex h-full flex-col rounded-[28px] bg-paper p-7 transition-colors hover:bg-alter-50 sm:p-8"
                >
                  <h2 className="text-[21px] font-semibold leading-snug tracking-[-0.02em] text-ink">{g.title}</h2>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-2">{g.excerpt}</p>
                  <span className="mt-5 inline-flex items-center text-[15px] text-alter-500">
                    Leer la guía · {g.readingMinutes} min
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
