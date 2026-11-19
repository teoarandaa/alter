"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { ChevronRight } from "lucide-react";
import { useRef } from "react";

import { APPLE_EASE } from "./Reveal";

/** Portada: titular grande que se aleja suavemente al hacer scroll. */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const appear = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, delay, ease: APPLE_EASE },
  });

  return (
    <section ref={ref} className="relative overflow-hidden bg-white">
      <motion.div
        style={{ scale, opacity, y }}
        className="mx-auto flex min-h-[78svh] max-w-[1024px] flex-col items-center justify-center px-4 py-24 text-center sm:px-6"
      >
        <motion.h1 {...appear(0)} className="headline text-[44px] sm:text-[72px] lg:text-[88px]">
          Segunda mano.
          <br />
          <span className="text-alter-500">Primera opción.</span>
        </motion.h1>
        <motion.p {...appear(0.25)} className="mt-6 max-w-[640px] text-[19px] leading-snug text-ink-2 sm:text-[24px]">
          Pega el enlace de lo que ibas a comprar nuevo o sube una foto. Alter lo encuentra de segunda mano y te dice
          cuánto ahorras.
        </motion.p>
        <motion.div {...appear(0.4)} className="mt-9 flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
          <a
            href="#buscar"
            className="rounded-full bg-alter-500 px-6 py-3 text-[17px] text-white transition-colors duration-300 hover:bg-alter-600"
          >
            Buscar alternativas
          </a>
          <a href="#como-funciona" className="group inline-flex items-center text-[17px] text-alter-500 hover:underline">
            Cómo funciona
            <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
