import Link from "next/link";
import { Fragment } from "react";

import { localizedPath, type Locale } from "@/i18n/locales";

/**
 * Pinta un texto de los diccionarios convirtiendo `[texto](/ruta)` en enlaces internos, con la ruta
 * en el idioma de la página («/plataformas» → «/ca/plataformas»).
 */
export default function RichText({ text, locale, className }: { text: string; locale: Locale; className?: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        if (!link) return <Fragment key={i}>{part}</Fragment>;
        return (
          <Link key={i} href={localizedPath(locale, link[2])} className={className}>
            {link[1]}
          </Link>
        );
      })}
    </>
  );
}
