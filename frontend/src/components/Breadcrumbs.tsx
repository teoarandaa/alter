import { ChevronRight } from "lucide-react";
import Link from "next/link";

import JsonLd from "@/components/JsonLd";
import { breadcrumbs } from "@/lib/structured-data";

/** Migas de pan visibles (Inicio › …) y sus datos estructurados para Google. */
export default function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  const all = [{ name: "Inicio", path: "/" }, ...items];
  return (
    <nav aria-label="Migas de pan" className="text-xs text-ink-3">
      <JsonLd data={breadcrumbs(items)} />
      <ol className="flex flex-wrap items-center gap-1">
        {all.map((item, i) => (
          <li key={item.path} className="flex items-center gap-1">
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
