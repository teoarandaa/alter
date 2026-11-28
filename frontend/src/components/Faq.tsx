import { ChevronDown } from "lucide-react";

import { fill, joinList } from "@/i18n/format";
import { getI18n } from "@/i18n/server";
import { PLATFORMS } from "@/lib/platforms";

import RichText from "./RichText";

/**
 * Preguntas frecuentes con <details>: las respuestas están siempre en el HTML (Google las lee),
 * aunque se muestren plegadas. Responden a lo que la gente busca sobre Alter y la segunda mano, con
 * la respuesta en la primera frase (así también las entienden los resúmenes con IA de Google).
 * Los textos están en el diccionario de cada idioma (faq).
 */
export default async function Faq() {
  const { locale, t } = await getI18n();
  const values = { n: PLATFORMS.length, platforms: joinList(PLATFORMS, t.and) };

  return (
    <section id="preguntas" aria-labelledby="preguntas-titulo" className="scroll-mt-12 bg-white px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-[760px]">
        <h2 id="preguntas-titulo" className="headline text-[36px] sm:text-[52px]">
          {t.faq.title}
        </h2>
        <div className="mt-10 divide-y divide-line border-y border-line">
          {t.faq.items.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[18px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                <h3>{item.question}</h3>
                <ChevronDown
                  className="size-5 shrink-0 text-ink-3 transition-transform duration-300 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-3 text-[16px] leading-relaxed text-ink-2 [&_a]:text-alter-500 [&_a]:hover:underline">
                <RichText text={fill(item.answer, values)} locale={locale} />
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
