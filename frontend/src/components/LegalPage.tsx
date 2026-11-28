import type { ReactNode } from "react";

import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import SpanishOnlyNotice from "@/components/SpanishOnlyNotice";
import { DEFAULT_LOCALE } from "@/i18n/locales";
import { getI18n } from "@/i18n/server";
import { LEGAL } from "@/lib/legal";

/**
 * Plantilla común de las páginas legales: cabecera, fecha de actualización y texto con estilo.
 * Los textos legales solo están en castellano; en los demás idiomas se avisa antes del texto.
 */
export default async function LegalPage({ title, intro, children }: { title: string; intro?: ReactNode; children: ReactNode }) {
  const { locale, t } = await getI18n();
  return (
    <>
      <Nav />
      <main className="flex-1 bg-white px-4 pb-24 pt-16 sm:px-6 sm:pt-24">
        <SpanishOnlyNotice text={t.spanishOnly.legal} className="mx-auto mb-10 max-w-[720px]" />
        <article className="mx-auto max-w-[720px]" lang={locale === DEFAULT_LOCALE ? undefined : "es"}>
          <h1 className="headline text-[36px] sm:text-[52px]">{title}</h1>
          <p className="mt-3 text-sm text-ink-3">Última actualización: {LEGAL.updated}</p>
          {intro && <div className="mt-6 text-[17px] leading-relaxed text-ink-2 sm:text-[19px]">{intro}</div>}

          <div
            className={[
              "mt-12 text-[15px] leading-relaxed text-ink-2 sm:text-base",
              "[&_h2]:mt-12 [&_h2]:text-[22px] [&_h2]:font-semibold [&_h2]:tracking-[-0.02em] [&_h2]:text-ink sm:[&_h2]:text-[26px]",
              "[&_h3]:mt-8 [&_h3]:text-[17px] [&_h3]:font-semibold [&_h3]:text-ink",
              "[&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5",
              "[&_strong]:font-semibold [&_strong]:text-ink",
              "[&_a]:text-alter-500 [&_a]:underline-offset-2 hover:[&_a]:underline",
              "[&_table]:mt-5 [&_table]:w-full [&_table]:text-left [&_table]:text-sm",
              "[&_th]:border-b [&_th]:border-line [&_th]:py-2 [&_th]:pr-4 [&_th]:font-semibold [&_th]:text-ink",
              "[&_td]:border-b [&_td]:border-line [&_td]:py-2.5 [&_td]:pr-4 [&_td]:align-top",
            ].join(" ")}
          >
            {children}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

/** Muestra un dato del titular; si aún es un hueco «[…]», lo resalta para rellenarlo. */
export function Field({ value }: { value: string }) {
  if (!value.startsWith("[")) return <>{value}</>;
  return <mark className="rounded bg-yellow-100 px-1 text-ink">{value}</mark>;
}

/** Enlace externo que se abre en otra pestaña. */
export function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
