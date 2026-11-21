"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

import { APPLE_EASE } from "./Reveal";

/** Portada: titular grande que se aleja suavemente al hacer scroll, con ilustración opcional debajo. */
export default function Hero({ image = null }: { image?: string | null }) {
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
        className="mx-auto flex min-h-[78svh] max-w-[1024px] items-center px-4 py-24 sm:px-6"
      >
        {/* Con ilustración: texto a la izquierda e imagen a la derecha, con la altura del texto.
            Sin ilustración: todo centrado. */}
        <div
          className={
            image
              ? "grid w-full gap-12 text-center md:grid-cols-[1.15fr_1fr] md:text-left"
              : "flex w-full flex-col items-center text-center"
          }
        >
          <div>
            <motion.h1
              {...appear(0)}
              className={`headline ${image ? "text-[44px] sm:text-[60px] lg:text-[68px]" : "text-[44px] sm:text-[72px] lg:text-[88px]"}`}
            >
              Segunda mano.
              <br />
              <span className="text-alter-500">Primera opción.</span>
            </motion.h1>
            <motion.p
              {...appear(0.25)}
              className={`mt-6 text-[19px] leading-snug text-ink-2 ${image ? "mx-auto max-w-[520px] sm:text-[21px] md:mx-0" : "max-w-[640px] sm:text-[24px]"}`}
            >
              Pega el enlace de lo que ibas a comprar nuevo, sube una foto o simplemente descríbelo. Alter lo encuentra de segunda mano y te dice
              cuánto ahorras.
            </motion.p>
            <motion.div
              {...appear(0.4)}
              className={`mt-9 flex flex-col items-center gap-5 sm:flex-row sm:gap-8 ${image ? "sm:justify-center md:justify-start" : ""}`}
            >
              <Link
                href="/buscar"
                className="rounded-full bg-alter-500 px-6 py-3 text-[17px] text-white transition-colors duration-300 hover:bg-alter-600"
              >
                Buscar alternativas
              </Link>
              <a href="#como-funciona" className="group inline-flex items-center text-[17px] text-alter-500 hover:underline">
                Cómo funciona
                <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
            </motion.div>
          </div>

          {image && (
            <motion.div {...appear(0.3)} className="relative h-56 sm:h-72 md:h-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" className="absolute inset-0 size-full object-contain" />
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
