import type { MetadataRoute } from "next";

import { HOME_DESCRIPTION } from "@/lib/seo-copy";

/** Manifiesto web: nombre, colores e icono al guardar Alter en la pantalla de inicio del móvil. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Alter · Buscador de segunda mano",
    short_name: "Alter",
    description: HOME_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6C3CE1",
    lang: "es-ES",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon.png", type: "image/png", sizes: "180x180" },
    ],
  };
}
