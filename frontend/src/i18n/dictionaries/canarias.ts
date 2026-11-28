/**
 * Textos de la web en el castellano de Canarias. Por escrito apenas se distingue del castellano
 * general, así que es el mismo texto con algunas palabras de las islas donde encajan con naturalidad
 * (un fisco, un fleje, carros). Mismas claves que es.ts.
 */
import type { Dictionary } from "./es";

const canarias: Dictionary = {
  meta: {
    homeTitle: "Alter · Buscador de segunda mano: Wallapop, Vinted, eBay y más",
    homeDescription:
      "Pega un enlace, sube una foto o descríbelo: Alter busca ese producto de segunda mano en Wallapop, Vinted, Milanuncios, eBay y más webs, y te dice cuánto ahorras. Gratis.",
    tagline: "Segunda mano. Primera opción.",
    searchTitle: "Buscar de segunda mano por enlace, foto o texto",
    searchDescription:
      "Pega el enlace de lo que ibas a comprar nuevo, sube una foto o descríbelo y encuentra alternativas de segunda mano en Wallapop, Vinted, Milanuncios, eBay y más.",
    platformsTitle: "{n} webs de segunda mano en España",
    platformsDescription:
      "Las {n} webs de segunda mano en las que busca Alter: Wallapop, Vinted, Milanuncios, eBay, Back Market, Vestiaire Collective y más, y qué encontrarás en cada una.",
    guidesTitle: "Guías para comprar de segunda mano",
    guidesDescription:
      "Guías prácticas para comprar de segunda mano sin sustos: cómo evitar estafas y qué revisar en móviles, portátiles, bicicletas y muebles usados.",
    ogSubtitle:
      "Pega un enlace, sube una foto o descríbelo: lo buscamos en {n} webs de segunda mano y te decimos cuánto ahorras.",
    organization:
      "Buscador gratuito de segunda mano: a partir de un enlace, una foto o una descripción, encuentra el producto en {n} webs como Wallapop, Vinted, Milanuncios o eBay y calcula cuánto ahorras frente a comprarlo nuevo.",
  },

  and: "y",

  nav: {
    label: "Principal",
    home: "Alter, inicio",
    search: "Buscar",
    how: "Cómo funciona",
    guides: "Guías",
  },

  language: {
    label: "Idioma",
    change: "Cambiar el idioma",
  },

  hero: {
    eyebrow: "El buscador de segunda mano",
    title: "Segunda mano.",
    highlight: "Primera opción.",
    text: "Pega el enlace de lo que ibas a comprar nuevo, sube una foto o simplemente descríbelo. Alter lo encuentra de segunda mano y te dice cuánto ahorras.",
    cta: "Buscar alternativas",
    how: "Cómo funciona",
  },

  home: {
    stepsTitle: "Así de fácil.",
    steps: [
      {
        title: "Pega un enlace,",
        altTitle: "una foto o descríbelo.",
        text: "El enlace de la tienda donde ibas a comprarlo nuevo, una foto o unas pocas palabras: «sillón de piel marrón», «iPhone 13 128 GB»…",
      },
      {
        title: "La IA lo entiende.",
        text: "Reconoce el producto y sus características, y lo busca en las principales webs de segunda mano.",
      },
      {
        title: "Tú ahorras.",
        text: "Enlaces directos a cada anuncio, su precio y cuánto te ahorras frente a comprarlo nuevo.",
      },
    ],
    impact:
      "Cada objeto que compras de segunda mano es uno que no hay que fabricar, empaquetar ni transportar. Reutilizar debería ser tan fácil como comprar nuevo. Ahora lo es.",
    figures: [
      { eyebrow: "Plataformas", unit: "webs", label: "de segunda mano en una sola búsqueda." },
      { eyebrow: "Precio", unit: "€", label: "Usar Alter es gratis." },
      { eyebrow: "Lo que necesitas", unit: "enlace", label: "o una foto, o unas palabras. Nada más." },
    ],
    guidesTitle: "Compra usado sin sustos.",
    guidesIntro: "Qué revisar antes de pagar, en guías cortas y prácticas.",
    readGuide: "Leer la guía",
    allGuides: "Ver todas las guías",
    finalTitle: "Tu próxima compra ya existe.",
    finalText: "Solo hay que encontrarla.",
    finalCta: "Empezar a buscar",
  },

  faq: {
    title: "Preguntas frecuentes",
    items: [
      {
        question: "¿Qué es Alter?",
        answer:
          "Un buscador de segunda mano gratuito. Le dices qué ibas a comprar nuevo, con un enlace, una foto o unas palabras, y lo busca a la vez en {n} webs como Wallapop, Vinted, Milanuncios o eBay. Después te enseña los anuncios y cuánto ahorras frente al precio nuevo.",
      },
      {
        question: "¿Cuánto cuesta usar Alter?",
        answer:
          "Nada: es gratis y no hace falta registrarse. La web se financia con publicidad y con acuerdos con algunas plataformas, cuyos resultados se marcan como «Patrocinado».",
      },
      {
        question: "¿En qué webs de segunda mano busca?",
        answer:
          "En {n}: {platforms}. Según lo que busques, te enseña sus anuncios o te lleva directamente a su búsqueda. Tienes el detalle de cada una en [dónde buscamos](/plataformas).",
      },
      {
        question: "¿Alter vende los productos?",
        answer:
          "No. Cada resultado te lleva al anuncio en la web donde está publicado, y la compra se hace allí, con sus condiciones y su protección al comprador. Antes de pagar, echa un vistazo a [cómo comprar de segunda mano sin que te estafen](/guias/comprar-segunda-mano-sin-riesgos).",
      },
      {
        question: "¿Cómo funciona la búsqueda por foto?",
        answer:
          "Una inteligencia artificial reconoce el objeto de la foto (qué es y, si se ve, la marca y el modelo) y lo busca en las webs de segunda mano. La foto se usa solo para esa búsqueda y no se guarda. Más detalles en la [política de privacidad](/privacidad).",
      },
      {
        question: "¿Por qué comprar de segunda mano?",
        answer:
          "Porque sueles pagar un fleje menos por lo mismo y porque cada objeto reutilizado es uno que no hay que fabricar, empaquetar ni transportar. Con las comprobaciones adecuadas, como las de nuestras [guías](/guias), es igual de seguro que comprar nuevo.",
      },
    ],
  },

  searchPage: {
    title: "¿Qué ibas a comprar?",
    subtitle: "Lo buscamos de segunda mano por ti.",
    platforms: "Buscamos en {n} webs de segunda mano.",
    seeWhich: "Ver cuáles",
    guides: "Guías para comprar sin sustos",
  },

  search: {
    modesLabel: "Cómo quieres buscar",
    modes: { url: "Enlace", image: "Foto", text: "Texto" },
    steps: [
      "Analizando el producto…",
      "Buscando en Wallapop, Milanuncios, Vinted y eBay…",
      "Comparando cada anuncio con el original…",
      "Calculando cuánto ahorras…",
    ],
    urlLabel: "Enlace del producto nuevo",
    urlPlaceholder: "Enlace del producto en la tienda",
    notesLabel: "Detalles opcionales",
    notesPlaceholder: "Detalles opcionales: talla, color, presupuesto…",
    photoAlt: "Foto subida",
    removePhoto: "Quitar foto",
    dropPhoto: "Arrastra una foto o elige una",
    photoFormats: "JPG, PNG o WEBP · hasta 5 MB",
    descriptionLabel: "Descripción del objeto",
    descriptionPlaceholder: "Descríbelo si quieres: marca, materiales, medidas…",
    priceLabel: "Precio nuevo en euros",
    pricePlaceholder: "Precio nuevo en € (para calcular el ahorro)",
    priceOptionalPlaceholder: "Precio nuevo en € (opcional, para calcular el ahorro)",
    textLabel: "Describe lo que buscas",
    textPlaceholder: "Describe lo que buscas: qué es y, si lo sabes, marca, modelo, talla, color, materiales…",
    textExample: "Por ejemplo: «sillón de lectura de piel marrón, estilo nórdico» o «patinete eléctrico Xiaomi Pro 2».",
    submit: "Buscar alternativas",
    searching: "Buscando…",
    errors: {
      invalidUrl: "Pega un enlace válido (empieza por http:// o https://).",
      noPhoto: "Sube una foto del objeto.",
      shortText: "Describe un fisco más lo que buscas.",
      badLink: "No podemos abrir ese enlace. Comprueba que está bien copiado.",
      imageFormat: "Formato de imagen no admitido. Usa JPG, PNG, WEBP o GIF.",
      imageTooBig: "La imagen es demasiado grande (máximo 5 MB).",
      describeObject: "Describe el objeto para poder buscarlo.",
      photosUnavailable: "Ahora mismo no podemos analizar fotos. Describe el objeto y vuelve a buscar.",
      invalid: "Revisa los datos: el enlace o la imagen no son válidos.",
      network: "No hay conexión con el servidor de Alter. Inténtalo de nuevo en unos segundos.",
      generic: "Algo ha fallado. Inténtalo de nuevo.",
    },
  },

  results: {
    label: "Resultados",
    newPrice: "{price} nuevo",
    demo: "Modo demo: anuncios de ejemplo que llevan a la búsqueda real de cada web.",
    noAi: "Búsqueda hecha sin IA: el análisis del producto es aproximado.",
    maxSavings: "de ahorro máximo",
    alternatives: { one: "alternativa", other: "alternativas" },
    lowestPrice: "el precio más bajo",
    manualPrice: "¿Cuánto cuesta nuevo?",
    filterLabel: "Filtrar resultados",
    filterAll: "Todos",
    filterExact: "Iguales ({n})",
    filterSimilar: "Similares ({n})",
    sortLabel: "Ordenar por",
    sortRecommended: "Recomendados",
    sortCheapest: "Precio más bajo",
    sortSavings: "Mayor ahorro",
    empty: "No hay anuncios que encajen. Prueba en las webs de abajo o con otra descripción.",
    alsoSearch: "Busca también «{query}» en",
    resultsFrom: { one: "Resultados de {n} plataforma", other: "Resultados de {n} plataformas" },
    unavailable: ". No hemos podido consultar {list}",
    sponsored: "Patrocinado",
    youSave: "Ahorras {amount}",
    exact: "Mismo producto",
    similar: "Alternativa similar",
  },

  platformsPage: {
    title: "{n} webs.",
    highlight: "Una sola búsqueda.",
    intro:
      "Alter busca en las principales webs de segunda mano con mercado en España. Según lo que busques, te enseñamos sus anuncios o te llevamos directamente a su búsqueda.",
    inline: "Anuncios en Alter, con precio y ahorro",
    linked: "Te enlazamos su búsqueda",
    whatYouFind: "Qué encontrarás",
    productsIn: "Productos en {name}",
    visit: "Visitar {name}",
    finalTitle: "No tienes que mirarlas una a una.",
    finalText: "Pega un enlace, sube una foto o descríbelo, y buscamos por ti.",
    finalCta: "Buscar alternativas",
  },

  platformSections: {
    generalistas: {
      title: "Mercados generalistas",
      intro:
        "Webs donde se vende de todo a la vez: tecnología, hogar, ropa, carros, coleccionismo… Las consultamos sea cual sea el producto.",
    },
    electronica: {
      title: "Electrónica y reacondicionados",
      intro:
        "Si buscas un móvil, un portátil o una consola, te enseñamos también los anuncios de Back Market, Refurbed, Amazon Reacondicionados y CeX, y te enlazamos Rebuy.",
    },
    moda: {
      title: "Moda",
      intro: "Para ropa, calzado y complementos. Vinted la consultamos siempre; las demás, cuando buscas moda.",
    },
    "libros-musica": { title: "Libros y música", intro: "Para lectores y músicos." },
    vintage: { title: "Vintage y decoración", intro: "Para muebles, decoración y piezas con historia." },
  },

  platforms: {
    wallapop: {
      description: "La app de compraventa entre particulares más usada en España.",
      products: ["Móviles", "Muebles", "Ropa", "Bicis", "Carros", "De todo"],
    },
    milanuncios: {
      description: "Anuncios clasificados de particulares y profesionales de toda España.",
      products: ["Carros y motos", "Hogar", "Herramientas", "Electrónica", "De todo"],
    },
    ebay: {
      description: "Mercado internacional con muchos vendedores en España. Buscamos solo artículos usados.",
      products: ["Electrónica", "Coleccionismo", "Recambios", "De todo"],
    },
    cashconverters: {
      description: "Tiendas de segunda mano con venta online y garantía en sus productos.",
      products: ["Electrónica", "Joyas y relojes", "Herramientas", "Instrumentos"],
    },
    secondbest: {
      description: "Tienda online con artículos de segunda mano y de ocasión de muchas categorías.",
      products: ["Hogar", "Electrónica", "Varios"],
    },
    todocoleccion: {
      description: "El gran mercado español de coleccionismo, antigüedades y objetos de época.",
      products: ["Antigüedades", "Coleccionismo", "Libros antiguos", "Arte", "Vintage"],
    },
    backmarket: {
      description: "Electrónica reacondicionada por profesionales y con garantía.",
      products: ["Móviles", "Portátiles", "Tablets", "Consolas"],
    },
    refurbed: {
      description: "Electrónica reacondicionada, revisada y con garantía.",
      products: ["Móviles", "Portátiles", "Tablets", "Relojes inteligentes"],
    },
    amazonrenewed: {
      description: "Productos reacondicionados y revisados que se venden en Amazon.es.",
      products: ["Móviles", "Portátiles", "Electrodomésticos pequeños", "Audio"],
    },
    cex: {
      description: "Compraventa de tecnología y entretenimiento usados, con tiendas físicas en España.",
      products: ["Móviles", "Consolas", "Videojuegos", "Películas"],
    },
    rebuy: {
      description: "Electrónica y ocio de segunda mano revisados antes de la venta.",
      products: ["Móviles", "Tablets", "Videojuegos", "Libros"],
    },
    vinted: {
      description: "Compraventa de ropa y complementos de segunda mano entre particulares.",
      products: ["Ropa", "Calzado", "Bolsos", "Infantil", "Hogar"],
    },
    vestiaire: {
      description: "Moda de lujo y de diseñador de segunda mano, con verificación de autenticidad.",
      products: ["Bolsos", "Ropa de diseñador", "Calzado", "Joyas"],
    },
    percentil: {
      description: "Tienda online española de ropa de segunda mano revisada, también infantil.",
      products: ["Ropa", "Complementos", "Ropa infantil"],
    },
    iberlibro: {
      description: "Libros usados, antiguos y descatalogados de librerías de España y de todo el mundo.",
      products: ["Libros usados", "Primeras ediciones", "Descatalogados"],
    },
    reverb: {
      description: "Mercado de instrumentos musicales y equipo de sonido nuevos y usados.",
      products: ["Guitarras", "Teclados", "Amplificadores", "Efectos"],
    },
    etsyvintage: {
      description: "Artículos vintage de vendedores independientes, muchos de ellos en España.",
      products: ["Decoración", "Ropa vintage", "Joyas", "Objetos de colección"],
    },
  },

  footer: {
    tagline: "El buscador de segunda mano: Wallapop, Vinted, eBay y {n} webs más en una sola búsqueda.",
    label: "Pie de página",
    links: {
      home: "Inicio",
      search: "Buscar",
      how: "Cómo funciona",
      impact: "Impacto",
      faq: "Preguntas frecuentes",
    },
    guides: "Guías",
    platforms: "Buscamos en",
    platformsLabel: "Webs en las que buscamos",
    allPlatforms: "Ver las {n} webs ›",
    disclaimer:
      "Los anuncios pertenecen a cada plataforma y sus precios pueden cambiar. Los resultados marcados como «Patrocinado» aparecen destacados por acuerdo comercial con esa plataforma.",
    legalLabel: "Información legal",
    legal: { "aviso-legal": "Aviso legal", privacidad: "Privacidad", cookies: "Cookies" },
  },

  breadcrumbs: {
    label: "Migas de pan",
    home: "Inicio",
  },

  guides: {
    title: "Guías para comprar de segunda mano",
    intro: "Lo que conviene revisar antes de pagar, para que comprar usado sea igual de fácil y seguro que comprar nuevo.",
    readGuide: "Leer la guía · {n} min",
    whereToSearch: "Dónde buscar",
    moreDetails: "Más detalles de cada una en [las {n} webs en las que busca Alter](/plataformas).",
    ctaTitle: "Encuéntralo en {n} webs a la vez",
    ctaText:
      "Pega el enlace de lo que ibas a comprar nuevo, sube una foto o descríbelo. Alter lo busca de segunda mano y te dice cuánto ahorras. Gratis.",
    ctaButton: "Buscar de segunda mano",
    related: "Otras guías",
  },

  spanishOnly: {
    guide: "",
    legal: "",
  },
};

export default canarias;
