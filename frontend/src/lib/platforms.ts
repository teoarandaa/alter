/**
 * Webs de segunda mano en las que busca Alter, agrupadas como se muestran en /plataformas.
 * La configuración de búsqueda (URLs, prioridades, categorías) está en backend/platforms.json:
 * si se añade o quita una web allí, hay que reflejarlo también aquí.
 *
 * Los textos de cada web y de cada apartado (descripción, qué se encuentra…) están en los
 * diccionarios de cada idioma (i18n/dictionaries), con las mismas claves.
 */
import type { Dictionary } from "@/i18n/dictionaries/es";

export type PlatformInfo = {
  key: keyof Dictionary["platforms"];
  name: string;
  url: string;
  color: string;
  /** true si Alter muestra sus anuncios (scraper de Apify); false si solo enlaza su búsqueda. */
  inline?: boolean;
};

export type PlatformSection = {
  id: keyof Dictionary["platformSections"];
  platforms: PlatformInfo[];
};

export const PLATFORM_SECTIONS: PlatformSection[] = [
  {
    id: "generalistas",
    platforms: [
      {
        key: "wallapop",
        inline: true,
        name: "Wallapop",
        url: "https://es.wallapop.com",
        color: "#13C1AC",
      },
      {
        key: "milanuncios",
        inline: true,
        name: "Milanuncios",
        url: "https://www.milanuncios.com",
        color: "#F15A24",
      },
      {
        key: "ebay",
        inline: true,
        name: "eBay",
        url: "https://www.ebay.es",
        color: "#E53238",
      },
      {
        key: "cashconverters",
        name: "Cash Converters",
        url: "https://www.cashconverters.es",
        color: "#0B3D91",
      },
      {
        key: "secondbest",
        name: "Secondbest",
        url: "https://secondbest.es",
        color: "#222222",
      },
      {
        key: "todocoleccion",
        name: "Todocolección",
        url: "https://www.todocoleccion.net",
        color: "#C8102E",
      },
    ],
  },
  {
    id: "electronica",
    platforms: [
      {
        key: "backmarket",
        inline: true,
        name: "Back Market",
        url: "https://www.backmarket.es",
        color: "#000000",
      },
      {
        key: "refurbed",
        inline: true,
        name: "Refurbed",
        url: "https://www.refurbed.es",
        color: "#1A1A1A",
      },
      {
        key: "amazonrenewed",
        inline: true,
        name: "Amazon",
        url: "https://www.amazon.es/s?k=reacondicionado&i=renewed",
        color: "#FF9900",
      },
      {
        key: "cex",
        inline: true,
        name: "CeX",
        url: "https://es.webuy.com",
        color: "#E3001B",
      },
      {
        key: "rebuy",
        name: "Rebuy",
        url: "https://www.rebuy.es",
        color: "#00A0E2",
      },
    ],
  },
  {
    id: "moda",
    platforms: [
      {
        key: "vinted",
        inline: true,
        name: "Vinted",
        url: "https://www.vinted.es",
        color: "#09B1BA",
      },
      {
        key: "vestiaire",
        name: "Vestiaire Collective",
        url: "https://es.vestiairecollective.com",
        color: "#1A1A1A",
      },
      {
        key: "percentil",
        name: "Percentil",
        url: "https://percentil.com",
        color: "#F25C54",
      },
    ],
  },
  {
    id: "libros-musica",
    platforms: [
      {
        key: "iberlibro",
        name: "Iberlibro",
        url: "https://www.iberlibro.com",
        color: "#C8102E",
      },
      {
        key: "reverb",
        name: "Reverb",
        url: "https://reverb.com/es",
        color: "#F25C1F",
      },
    ],
  },
  {
    id: "vintage",
    platforms: [
      {
        key: "etsyvintage",
        name: "Etsy (vintage)",
        url: "https://www.etsy.com/es/search?q=vintage",
        color: "#F1641E",
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
