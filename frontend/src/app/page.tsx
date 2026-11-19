import { Camera, Link2, ScanSearch, Tags } from "lucide-react";

import Hero from "@/components/Hero";
import CountUp from "@/components/CountUp";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import ScrollText from "@/components/ScrollText";
import SearchPanel from "@/components/SearchPanel";
import { illustration, type IllustrationName } from "@/lib/illustrations";

const PLATFORMS = ["Wallapop", "Milanuncios", "Vinted", "eBay", "Cash Converters", "Secondbest", "Todocolección"];

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
    title: "Pega un enlace.",
    alt: Camera,
    altTitle: "O sube una foto.",
    text: "El enlace de la tienda donde ibas a comprarlo nuevo. O una foto, con marca, materiales o medidas si los sabes.",
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
  { eyebrow: "Plataformas", value: 7, unit: "webs", label: "de segunda mano en una sola búsqueda." },
  { eyebrow: "Precio", value: 0, unit: "€", label: "Usar Alter es gratis." },
  { eyebrow: "Lo que necesitas", value: 1, unit: "enlace", label: "o una foto del objeto. Nada más." },
];

export default function Home() {
  const impactImage = illustration("impacto.svg");
  const finalImage = illustration("final.svg");

  return (
    <>
      <Nav />

      <main>
        <Hero image={illustration("hero.svg")} />

        {/* Buscador */}
        <section id="buscar" className="bg-paper px-4 py-20 sm:px-6 sm:py-28">
          <Reveal className="mx-auto max-w-[680px] text-center">
            <h2 className="headline text-[36px] sm:text-[56px]">¿Qué ibas a comprar?</h2>
            <p className="mt-3 text-[19px] text-ink-2 sm:text-[21px]">Lo buscamos de segunda mano por ti.</p>
          </Reveal>
          <Reveal delay={0.1} className="mt-12">
            <SearchPanel emptyIllustration={illustration("sin-resultados.svg")} />
          </Reveal>
          <Reveal delay={0.2} className="mx-auto mt-12 max-w-[680px] text-center text-xs leading-relaxed text-ink-3">
            Buscamos en {PLATFORMS.slice(0, -1).join(", ")} y {PLATFORMS.at(-1)}.
          </Reveal>
        </section>

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

        {/* Llamada final */}
        <section className="bg-paper px-4 py-24 text-center sm:px-6 sm:py-32">
          <Reveal className="mx-auto max-w-[680px]">
            <h2 className="headline text-[40px] sm:text-[64px]">Tu próxima compra ya existe.</h2>
            <p className="mt-4 text-[19px] text-ink-2 sm:text-[21px]">Solo hay que encontrarla.</p>
            <a
              href="#buscar"
              className="mt-9 inline-block rounded-full bg-alter-500 px-6 py-3 text-[17px] text-white transition-colors duration-300 hover:bg-alter-600"
            >
              Empezar a buscar
            </a>
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
