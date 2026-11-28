/** Utilidades para los textos de los diccionarios. Sirven en servidor y en cliente. */

/** Rellena los huecos de un texto: fill("Ver las {n} webs", { n: 19 }) → «Ver las 19 webs». */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/** Elige la forma en singular o plural y rellena {n}. */
export function plural(n: number, forms: { one: string; other: string }, values: Record<string, string | number> = {}): string {
  return fill(n === 1 ? forms.one : forms.other, { n, ...values });
}

/** Une una lista con comas y la conjunción del idioma: «A, B y C». */
export function joinList(items: string[], and: string): string {
  if (items.length < 2) return items.join("");
  return `${items.slice(0, -1).join(", ")} ${and} ${items.at(-1)}`;
}
