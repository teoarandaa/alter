import { ChevronRight } from "lucide-react";
import Link from "next/link";

import JsonLd from "@/components/JsonLd";
import { localizedPath } from "@/i18n/locales";
import { getI18n } from "@/i18n/server";
import { breadcrumbs } from "@/lib/structured-data";

type Crumb = { name: string; path: string; /** Idioma del nombre, si no es el de la página. */ lang?: string };

/**
 * Migas de pan visibles (Inicio › …) y sus datos estructurados para Google.
 * Las rutas se pasan en castellano («/guias»); aquí se les pone el prefijo del idioma.
 */
export default async function Breadcrumbs({ items }: { items: Crumb[] }) {
  const { locale, t } = await getI18n();
  const home: Crumb = { name: t.breadcrumbs.home, path: localizedPath(locale, "/") };
  const localized = items.map((item) => ({ ...item, path: localizedPath(locale, item.path) }));
  const all: Crumb[] = [home, ...localized];
  return (
    <nav aria-label={t.breadcrumbs.label} className="text-xs text-ink-3">
      <JsonLd data={breadcrumbs(localized, home)} />
      <ol className="flex flex-wrap items-center gap-1">
        {all.map((item, i) => (
          <li key={item.path} className="flex items-center gap-1" lang={item.lang}>
            {i > 0 && <ChevronRight className="size-3" aria-hidden="true" />}
            {i < all.length - 1 ? (
              <Link href={item.path} className="hover:text-ink hover:underline">
                {item.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink-2">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
