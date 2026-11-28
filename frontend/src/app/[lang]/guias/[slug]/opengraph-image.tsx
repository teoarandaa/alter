import { GUIDES, guideBySlug } from "@/content/guides";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Guía de Alter para comprar de segunda mano";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

/** Imagen al compartir una guía: con su propio título. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const guide = guideBySlug((await params).slug);
  return ogImage({ eyebrow: "Guía · Alter", title: guide?.title ?? "Guías para comprar de segunda mano" });
}
