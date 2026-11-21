import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Logos de las webs de segunda mano: un archivo por web en public/logos/<clave>.<svg|png|webp>
 * (la clave es la de backend/platforms.json, p. ej. "wallapop.svg", "iberlibro.png").
 * Se prefiere SVG; PNG y WebP son la alternativa para las webs que no publican su logo en SVG.
 * Si no hay archivo, la web se muestra con un punto de color y su nombre.
 *
 * Solo para el servidor: comprueba qué archivos existen.
 */
const EXTENSIONS = ["svg", "png", "webp"];

export function availableLogos(keys: string[]): Record<string, string> {
  const dir = path.join(process.cwd(), "public", "logos");
  const logos: Record<string, string> = {};
  for (const key of keys) {
    const ext = EXTENSIONS.find((e) => existsSync(path.join(dir, `${key}.${e}`)));
    if (ext) logos[key] = `/logos/${key}.${ext}`;
  }
  return logos;
}
