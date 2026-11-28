import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";
import { PLATFORMS } from "@/lib/platforms";

export const alt = "Alter: segunda mano, primera opción. Buscador de segunda mano en Wallapop, Vinted, eBay y más.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Imagen por defecto al compartir cualquier página de Alter. */
export default function Image() {
  return ogImage({
    eyebrow: "Alter",
    title: "Segunda mano. Primera opción.",
    subtitle: `Pega un enlace, sube una foto o descríbelo: lo buscamos en ${PLATFORMS.length} webs de segunda mano y te decimos cuánto ahorras.`,
  });
}
