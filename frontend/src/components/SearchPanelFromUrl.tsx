"use client";

import { useSearchParams } from "next/navigation";
import type { ComponentProps } from "react";

import SearchPanel from "./SearchPanel";

/**
 * Buscador que se abre con el texto de ?q= ya escrito (enlaces desde las guías).
 * Va dentro de un <Suspense>: la página sigue siendo estática y solo esta parte lee la URL.
 */
export default function SearchPanelFromUrl(props: Omit<ComponentProps<typeof SearchPanel>, "initialText">) {
  const q = (useSearchParams().get("q") ?? "").slice(0, 200);
  return <SearchPanel key={q} {...props} initialText={q} />;
}
