import { ChevronDown } from "lucide-react";

import { FAQ } from "@/content/faq";

/**
 * Preguntas frecuentes con <details>: las respuestas están siempre en el HTML (Google las lee),
 * aunque se muestren plegadas.
 */
export default function Faq() {
  return (
    <section id="preguntas" aria-labelledby="preguntas-titulo" className="scroll-mt-12 bg-white px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-[760px]">
        <h2 id="preguntas-titulo" className="headline text-[36px] sm:text-[52px]">
          Preguntas frecuentes
        </h2>
        <div className="mt-10 divide-y divide-line border-y border-line">
          {FAQ.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[18px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                <h3>{item.question}</h3>
                <ChevronDown
                  className="size-5 shrink-0 text-ink-3 transition-transform duration-300 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-3 text-[16px] leading-relaxed text-ink-2 [&_a]:text-alter-500 [&_a]:hover:underline">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
