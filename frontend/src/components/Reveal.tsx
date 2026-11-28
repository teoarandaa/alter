"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export const APPLE_EASE = [0.28, 0.11, 0.32, 1] as const;

/** Aparece suavemente, subiendo un poco, cuando entra en pantalla. */
export default function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  fade = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li";
  /** false para lo que se ve al cargar (titulares): solo sube, sin empezar invisible. Mejora el LCP. */
  fade?: boolean;
}) {
  const Component = as === "li" ? motion.li : motion.div;
  return (
    <Component
      className={className}
      initial={fade ? { opacity: 0, y: 28 } : { y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, delay, ease: APPLE_EASE }}
    >
      {children}
    </Component>
  );
}
