/**
 * Preguntas frecuentes de la portada. Responden a lo que la gente busca sobre Alter y la segunda mano,
 * con la respuesta en la primera frase (así también las entienden los resúmenes con IA de Google).
 */
import Link from "next/link";
import type { ReactNode } from "react";

import { PLATFORMS } from "@/lib/platforms";

export const FAQ: { question: string; answer: ReactNode }[] = [
  {
    question: "¿Qué es Alter?",
    answer: (
      <>
        Un buscador de segunda mano gratuito. Le dices qué ibas a comprar nuevo, con un enlace, una foto o unas palabras, y
        lo busca a la vez en {PLATFORMS.length} webs como Wallapop, Vinted, Milanuncios o eBay. Después te enseña los
        anuncios y cuánto ahorras frente al precio nuevo.
      </>
    ),
  },
  {
    question: "¿Cuánto cuesta usar Alter?",
    answer: (
      <>
        Nada: es gratis y no hace falta registrarse. La web se financia con publicidad y con acuerdos con algunas
        plataformas, cuyos resultados se marcan como «Patrocinado».
      </>
    ),
  },
  {
    question: "¿En qué webs de segunda mano busca?",
    answer: (
      <>
        En {PLATFORMS.length}: {PLATFORMS.slice(0, -1).join(", ")} y {PLATFORMS.at(-1)}. Según lo que busques, te enseña sus
        anuncios o te lleva directamente a su búsqueda. Tienes el detalle de cada una en{" "}
        <Link href="/plataformas">dónde buscamos</Link>.
      </>
    ),
  },
  {
    question: "¿Alter vende los productos?",
    answer: (
      <>
        No. Cada resultado te lleva al anuncio en la web donde está publicado, y la compra se hace allí, con sus
        condiciones y su protección al comprador. Antes de pagar, echa un vistazo a{" "}
        <Link href="/guias/comprar-segunda-mano-sin-riesgos">cómo comprar de segunda mano sin que te estafen</Link>.
      </>
    ),
  },
  {
    question: "¿Cómo funciona la búsqueda por foto?",
    answer: (
      <>
        Una inteligencia artificial reconoce el objeto de la foto (qué es y, si se ve, la marca y el modelo) y lo busca en
        las webs de segunda mano. La foto se usa solo para esa búsqueda y no se guarda. Más detalles en la{" "}
        <Link href="/privacidad">política de privacidad</Link>.
      </>
    ),
  },
  {
    question: "¿Por qué comprar de segunda mano?",
    answer: (
      <>
        Porque sueles pagar bastante menos por lo mismo y porque cada objeto reutilizado es uno que no hay que fabricar,
        empaquetar ni transportar. Con las comprobaciones adecuadas, como las de nuestras <Link href="/guias">guías</Link>,
        es igual de seguro que comprar nuevo.
      </>
    ),
  },
];
