import { Camera, Leaf, Link2, Recycle, ScanSearch, Tags } from "lucide-react";
import Link from "next/link";

import Logo from "@/components/Logo";
import Reveal from "@/components/Reveal";
import SearchPanel from "@/components/SearchPanel";

const PLATFORMS = ["Wallapop", "Milanuncios", "Vinted", "eBay", "Cash Converters", "Secondbest", "Todocolección"];

const STEPS = [
  {
    icon: Link2,
    title: "Pega el enlace o sube una foto",
    text: "El enlace de la tienda donde ibas a comprarlo nuevo, o una foto con una descripción (marca, materiales, medidas…).",
  },
  {
    icon: ScanSearch,
    title: "La IA analiza el objeto",
    text: "Reconoce el producto, sus especificaciones y materiales, y busca ese mismo objeto o similares en las principales webs de segunda mano.",
  },
  {
    icon: Tags,
    title: "Compara y ahorra",
    text: "Recibes enlaces directos a los anuncios con su precio, la comparación con el precio nuevo y el % que te ahorras.",
  },
];

export default function Home() {
  return (
    <>
      <header className="bg-grain">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <Link href="/" aria-label="Alter, inicio">
            <Logo />
          </Link>
          <a
            href="#como-funciona"
            className="rounded-full px-4 py-2 text-sm font-medium text-alter-800 transition hover:bg-white/70"
          >
            Cómo funciona
          </a>
        </nav>

        <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-16">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-alter-200 bg-white/70 px-3 py-1 text-xs font-medium text-alter-700">
              <Leaf className="size-3.5" /> Gratis · Alternativas que ayudan al planeta
            </p>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-alter-950 sm:text-6xl">
              Antes de comprarlo nuevo,{" "}
              <span className="bg-gradient-to-r from-alter-500 to-alter-400 bg-clip-text text-transparent">búscalo de segunda mano</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-alter-900/65">
              Pega el enlace de lo que ibas a comprar o sube una foto. Alter encuentra el mismo objeto o alternativas
              parecidas en las webs de segunda mano y te dice cuánto ahorras.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-10">
            <SearchPanel />
          </Reveal>

          <Reveal delay={0.2} className="mx-auto mt-10 max-w-3xl">
            <p className="text-center text-xs font-medium uppercase tracking-wider text-alter-900/40">Buscamos en</p>
            <ul className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold text-alter-900/55">
              {PLATFORMS.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </Reveal>
        </main>
      </header>

      <section id="como-funciona" className="scroll-mt-10 bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight text-alter-950 sm:text-4xl">Cómo funciona</h2>
          </Reveal>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.08} className="rounded-3xl border border-alter-100 p-6">
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-2xl bg-alter-500 text-white">
                    <s.icon className="size-5" />
                  </span>
                  <span className="font-display text-4xl font-bold text-alter-100">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-alter-950">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-alter-900/65">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-alter-950 py-20 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Menos objetos nuevos, <span className="text-alter-300">más vida para los que ya existen</span>
            </h2>
            <p className="mt-4 text-alter-100/75">
              Cada objeto que compras de segunda mano es uno que no hay que fabricar, empaquetar ni transportar. Alter
              quiere que reutilizar sea tan fácil como comprar nuevo: el mismo producto, al alcance de un clic, y más barato.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="grid grid-cols-2 gap-4">
            {[
              { icon: Recycle, title: "Reutiliza", text: "Alarga la vida útil de los objetos" },
              { icon: Leaf, title: "Reduce", text: "Menos fabricación y menos residuos" },
              { icon: Tags, title: "Ahorra", text: "Compara el precio nuevo y el de segunda mano" },
              { icon: Camera, title: "Fácil", text: "Un enlace o una foto, nada más" },
            ].map((c) => (
              <div key={c.title} className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
                <c.icon className="size-5 text-alter-300" />
                <p className="mt-3 font-semibold">{c.title}</p>
                <p className="mt-1 text-sm text-alter-100/60">{c.text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-alter-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-alter-900/50 sm:flex-row sm:px-6">
          <Logo small />
          <p>Alter es gratis. Los anuncios pertenecen a cada plataforma; los marcados como «Patrocinado» aparecen destacados por acuerdo comercial.</p>
        </div>
      </footer>
    </>
  );
}
