import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Logos de las webs de segunda mano: un SVG por web en public/logos/<clave>.svg
 * (la clave es la de backend/platforms.json, p. ej. "wallapop.svg", "backmarket.svg").
 * Si no hay archivo, se usa el icono de Simple Icons (eBay, Vinted, Etsy) o un punto de color.
 *
 * Solo para el servidor: comprueba qué archivos existen.
 */
export function availableLogos(keys: string[]): string[] {
  const dir = path.join(process.cwd(), "public", "logos");
  return keys.filter((key) => existsSync(path.join(dir, `${key}.svg`)));
}
