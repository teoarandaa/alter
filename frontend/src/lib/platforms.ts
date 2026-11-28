/**
 * Webs de segunda mano en las que busca Alter, agrupadas como se muestran en /plataformas.
 * La configuración de búsqueda (URLs, prioridades, categorías) está en backend/platforms.json:
 * si se añade o quita una web allí, hay que reflejarlo también aquí.
 */

export type PlatformInfo = {
  key: string;
  name: string;
  url: string;
  color: string;
  description: string;
  products: string[];
  /** true si Alter muestra sus anuncios (scraper de Apify); false si solo enlaza su búsqueda. */
  inline?: boolean;
};

export type PlatformSection = {
  id: string;
  title: string;
  intro: string;
  platforms: PlatformInfo[];
};

export const PLATFORM_SECTIONS: PlatformSection[] = [
  {
    id: "generalistas",
    title: "Mercados generalistas",
    intro: "Webs donde se vende de todo a la vez: tecnología, hogar, ropa, motor, coleccionismo… Las consultamos sea cual sea el producto.",
    platforms: [
      {
        key: "wallapop",
        inline: true,
        name: "Wallapop",
        url: "https://es.wallapop.com",
        color: "#13C1AC",
        description: "La app de compraventa entre particulares más usada en España.",
        products: ["Móviles", "Muebles", "Ropa", "Bicis", "Motor", "De todo"],
      },
      {
        key: "milanuncios",
        inline: true,
        name: "Milanuncios",
        url: "https://www.milanuncios.com",
        color: "#F15A24",
        description: "Anuncios clasificados de particulares y profesionales de toda España.",
        products: ["Motor", "Hogar", "Herramientas", "Electrónica", "De todo"],
      },
      {
        key: "ebay",
        inline: true,
        name: "eBay",
        url: "https://www.ebay.es",
        color: "#E53238",
        description: "Mercado internacional con muchos vendedores en España. Buscamos solo artículos usados.",
        products: ["Electrónica", "Coleccionismo", "Recambios", "De todo"],
      },
      {
        key: "cashconverters",
        name: "Cash Converters",
        url: "https://www.cashconverters.es",
        color: "#0B3D91",
        description: "Tiendas de segunda mano con venta online y garantía en sus productos.",
        products: ["Electrónica", "Joyas y relojes", "Herramientas", "Instrumentos"],
      },
      {
        key: "secondbest",
        name: "Secondbest",
        url: "https://secondbest.es",
        color: "#222222",
        description: "Tienda online con artículos de segunda mano y de ocasión de muchas categorías.",
        products: ["Hogar", "Electrónica", "Varios"],
      },
      {
        key: "todocoleccion",
        name: "Todocolección",
        url: "https://www.todocoleccion.net",
        color: "#C8102E",
        description: "El gran mercado español de coleccionismo, antigüedades y objetos de época.",
        products: ["Antigüedades", "Coleccionismo", "Libros antiguos", "Arte", "Vintage"],
      },
    ],
  },
  {
    id: "electronica",
    title: "Electrónica y reacondicionados",
    intro:
      "Si buscas un móvil, un portátil o una consola, te enseñamos también los anuncios de Back Market, Refurbed, Amazon Reacondicionados y CeX, y te enlazamos Rebuy.",
    platforms: [
      {
        key: "backmarket",
        inline: true,
        name: "Back Market",
        url: "https://www.backmarket.es",
        color: "#000000",
        description: "Electrónica reacondicionada por profesionales y con garantía.",
        products: ["Móviles", "Portátiles", "Tablets", "Consolas"],
      },
      {
        key: "refurbed",
        inline: true,
        name: "Refurbed",
        url: "https://www.refurbed.es",
        color: "#1A1A1A",
        description: "Electrónica reacondicionada, revisada y con garantía.",
        products: ["Móviles", "Portátiles", "Tablets", "Relojes inteligentes"],
      },
      {
        key: "amazonrenewed",
        inline: true,
        name: "Amazon",
        url: "https://www.amazon.es/s?k=reacondicionado&i=renewed",
        color: "#FF9900",
        description: "Productos reacondicionados y revisados que se venden en Amazon.es.",
        products: ["Móviles", "Portátiles", "Electrodomésticos pequeños", "Audio"],
      },
      {
        key: "cex",
        inline: true,
        name: "CeX",
        url: "https://es.webuy.com",
        color: "#E3001B",
        description: "Compraventa de tecnología y entretenimiento usados, con tiendas físicas en España.",
        products: ["Móviles", "Consolas", "Videojuegos", "Películas"],
      },
      {
        key: "rebuy",
        name: "Rebuy",
        url: "https://www.rebuy.es",
        color: "#00A0E2",
        description: "Electrónica y ocio de segunda mano revisados antes de la venta.",
        products: ["Móviles", "Tablets", "Videojuegos", "Libros"],
      },
    ],
  },
  {
    id: "moda",
    title: "Moda",
    intro: "Para ropa, calzado y complementos. Vinted la consultamos siempre; las demás, cuando buscas moda.",
    platforms: [
      {
        key: "vinted",
        inline: true,
        name: "Vinted",
        url: "https://www.vinted.es",
        color: "#09B1BA",
        description: "Compraventa de ropa y complementos de segunda mano entre particulares.",
        products: ["Ropa", "Calzado", "Bolsos", "Infantil", "Hogar"],
      },
      {
        key: "vestiaire",
        name: "Vestiaire Collective",
        url: "https://es.vestiairecollective.com",
        color: "#1A1A1A",
        description: "Moda de lujo y de diseñador de segunda mano, con verificación de autenticidad.",
        products: ["Bolsos", "Ropa de diseñador", "Calzado", "Joyas"],
      },
      {
        key: "percentil",
        name: "Percentil",
        url: "https://percentil.com",
        color: "#F25C54",
        description: "Tienda online española de ropa de segunda mano revisada, también infantil.",
        products: ["Ropa", "Complementos", "Ropa infantil"],
      },
    ],
  },
  {
    id: "libros-musica",
    title: "Libros y música",
    intro: "Para lectores y músicos.",
    platforms: [
      {
        key: "iberlibro",
        name: "Iberlibro",
        url: "https://www.iberlibro.com",
        color: "#C8102E",
        description: "Libros usados, antiguos y descatalogados de librerías de España y de todo el mundo.",
        products: ["Libros usados", "Primeras ediciones", "Descatalogados"],
      },
      {
        key: "reverb",
        name: "Reverb",
        url: "https://reverb.com/es",
        color: "#F25C1F",
        description: "Mercado de instrumentos musicales y equipo de sonido nuevos y usados.",
        products: ["Guitarras", "Teclados", "Amplificadores", "Efectos"],
      },
    ],
  },
  {
    id: "vintage",
    title: "Vintage y decoración",
    intro: "Para muebles, decoración y piezas con historia.",
    platforms: [
      {
        key: "etsyvintage",
        name: "Etsy (vintage)",
        url: "https://www.etsy.com/es/search?q=vintage",
        color: "#F1641E",
        description: "Artículos vintage de vendedores independientes, muchos de ellos en España.",
        products: ["Decoración", "Ropa vintage", "Joyas", "Objetos de colección"],
      },
    ],
  },
];

/** Nombres de todas las webs, sin repetir, en el orden de los apartados. */
export const PLATFORMS = PLATFORM_SECTIONS.flatMap((s) => s.platforms.map((p) => p.name));

/** Ficha de una web por su clave (p. ej. «wallapop»), junto al apartado en el que aparece. */
export function platformByKey(key: string): (PlatformInfo & { sectionId: string }) | undefined {
  for (const section of PLATFORM_SECTIONS) {
    const platform = section.platforms.find((p) => p.key === key);
    if (platform) return { ...platform, sectionId: section.id };
  }
  return undefined;
}
