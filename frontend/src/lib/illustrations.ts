import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Ilustraciones de unDraw (https://undraw.co), descargadas a mano con el color #6C3CE1
 * y guardadas en public/illustrations/. La licencia de unDraw no permite descargarlas
 * de forma automática ni enlazarlas desde su web, por eso viven en el proyecto.
 *
 * Nombre del archivo → ilustración que hay que descargar de unDraw.
 */
export const ILLUSTRATIONS = {
  "paso-1-enlace.svg": "Online shopping",
  "paso-2-busqueda.svg": "Searching Everywhere",
  "paso-3-ahorro.svg": "Price Drop Alert",
  "impacto.svg": "Eco conscious",
  "sin-resultados.svg": "Empty cart",
  "final.svg": "Window shopping",
} as const;

export type IllustrationName = keyof typeof ILLUSTRATIONS;

/** Devuelve la URL pública de la ilustración, o null si todavía no se ha añadido el archivo. */
export function illustration(name: IllustrationName): string | null {
  const file = path.join(process.cwd(), "public", "illustrations", name);
  return existsSync(file) ? `/illustrations/${name}` : null;
}
