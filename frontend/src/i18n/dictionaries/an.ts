/**
 * Textos de la web en aragonés (ortografía de l'Academia de l'Aragonés). Mismas claves que es.ts.
 * Conviene que lo revise un hablante nativo antes de darlo por bueno.
 */
import type { Dictionary } from "./es";

const an: Dictionary = {
  meta: {
    homeTitle: "Alter · Buscador de segunda man: Wallapop, Vinted, eBay y más",
    homeDescription:
      "Apega un vinclo, puya una foto u describe-lo: Alter busca ixe producto de segunda man en Wallapop, Vinted, Milanuncios, eBay y más webs, y te diz quánto aforras. De baldes.",
    tagline: "Segunda man. Primera opción.",
    searchTitle: "Buscar de segunda man per vinclo, foto u texto",
    searchDescription:
      "Apega o vinclo d'o que ibas a crompar nuevo, puya una foto u describe-lo y troba alternativas de segunda man en Wallapop, Vinted, Milanuncios, eBay y más.",
    platformsTitle: "{n} webs de segunda man en España",
    platformsDescription:
      "As {n} webs de segunda man an que busca Alter: Wallapop, Vinted, Milanuncios, eBay, Back Market, Vestiaire Collective y más, y o que i trobarás en cadaguna.",
    guidesTitle: "Guías ta crompar de segunda man",
    guidesDescription:
      "Guías practicas, en castellano, ta crompar de segunda man sinse sustos: cómo evitar estafas y qué revisar en mobils, portatils, bicicletas y mobles usaus.",
    ogSubtitle:
      "Apega un vinclo, puya una foto u describe-lo: lo buscamos en {n} webs de segunda man y te dicimos quánto aforras.",
    organization:
      "Buscador de baldes de segunda man: dende un vinclo, una foto u una descripción, troba o producto en {n} webs como Wallapop, Vinted, Milanuncios u eBay y calcula quánto aforras en comparanza con crompar-lo nuevo.",
  },

  and: "y",

  nav: {
    label: "Prencipal",
    home: "Alter, inicio",
    search: "Buscar",
    how: "Cómo funciona",
    guides: "Guías",
  },

  language: {
    label: "Luenga",
    change: "Cambiar a luenga",
  },

  hero: {
    eyebrow: "O buscador de segunda man",
    title: "Segunda man.",
    highlight: "Primera opción.",
    text: "Apega o vinclo d'o que ibas a crompar nuevo, puya una foto u simplament describe-lo. Alter lo troba de segunda man y te diz quánto aforras.",
    cta: "Buscar alternativas",
    how: "Cómo funciona",
  },

  home: {
    stepsTitle: "Asinas de fácil.",
    steps: [
      {
        title: "Apega un vinclo,",
        altTitle: "una foto u describe-lo.",
        text: "O vinclo d'a botiga an que l'ibas a crompar nuevo, una foto u bellas parolas: «butaca de piel marrón», «iPhone 13 128 GB»…",
      },
      {
        title: "A IA lo entiende.",
        text: "Reconoixe o producto y as suyas caracteristicas, y lo busca en as webs de segunda man prencipals.",
      },
      {
        title: "Tu aforras.",
        text: "Vinclos directos a cada anuncio, o suyo precio y quánto t'aforras en comparanza con crompar-lo nuevo.",
      },
    ],
    impact:
      "Cada obchecto que crompas de segunda man ye uno que no cal fabricar, empaquetar ni transportar. Reutilizar habría d'estar tan fácil como crompar nuevo. Agora ya lo ye.",
    figures: [
      { eyebrow: "Plataformas", unit: "webs", label: "de segunda man en una sola busca." },
      { eyebrow: "Precio", unit: "€", label: "Fer servir Alter ye de baldes." },
      { eyebrow: "O que te cal", unit: "vinclo", label: "u una foto, u bellas parolas. Cosa más." },
    ],
    guidesTitle: "Crompa usau sinse sustos.",
    guidesIntro: "Qué revisar antes de pagar, en guías curtas y practicas (en castellano).",
    readGuide: "Leyer a guía",
    allGuides: "Veyer todas as guías",
    finalTitle: "A tuya siguient crompa ya existe.",
    finalText: "Nomás cal trobar-la.",
    finalCta: "Prencipiar a buscar",
  },

  faq: {
    title: "Preguntas freqüents",
    items: [
      {
        question: "¿Qué ye Alter?",
        answer:
          "Un buscador de segunda man de baldes. Le dices qué ibas a crompar nuevo, con un vinclo, una foto u bellas parolas, y lo busca a la vegada en {n} webs como Wallapop, Vinted, Milanuncios u eBay. Dimpués t'amuestra os anuncios y quánto aforras en comparanza con o precio nuevo.",
      },
      {
        question: "¿Quánto cuesta fer servir Alter?",
        answer:
          "Cosa: ye de baldes y no cal rechistrar-se. A web se financia con publicidat y con alcuerdos con bellas plataformas, os resultaus d'as qualas se sinyalan como «Patrocinau».",
      },
      {
        question: "¿En qué webs de segunda man busca?",
        answer:
          "En {n}: {platforms}. Seguntes o que busques, t'amuestra os suyos anuncios u te leva dreitament ta la suya busca. Tiens o detalle de cadaguna en [an buscamos](/plataformas).",
      },
      {
        question: "¿Alter vende os productos?",
        answer:
          "No. Cada resultau te leva ta l'anuncio en a web an que ye publicau, y a crompa se fa allí, con as suyas condicions y a suya protección a o comprador. Antes de pagar, fe una uellada a [cómo crompar de segunda man sinse que t'estafen](/guias/comprar-segunda-mano-sin-riesgos) (en castellano).",
      },
      {
        question: "¿Cómo funciona a busca per foto?",
        answer:
          "Una intelichencia artificial reconoixe l'obchecto d'a foto (qué ye y, si se veye, a marca y o modelo) y lo busca en as webs de segunda man. A foto nomás s'emplega ta ixa busca y no s'alza. Más detalles en a [politica de privacidat](/privacidad) (en castellano).",
      },
      {
        question: "¿Per qué crompar de segunda man?",
        answer:
          "Porque sueles pagar prou menos per o mesmo y porque cada obchecto reutilizau ye uno que no cal fabricar, empaquetar ni transportar. Con as comprebacions adequadas, como as d'as nuestras [guías](/guias) (en castellano), ye igual de seguro que crompar nuevo.",
      },
    ],
  },

  searchPage: {
    title: "¿Qué ibas a crompar?",
    subtitle: "Lo buscamos de segunda man per tu.",
    platforms: "Buscamos en {n} webs de segunda man.",
    seeWhich: "Veyer quálas",
    guides: "Guías ta crompar sinse sustos",
  },

  search: {
    modesLabel: "Cómo quiers buscar",
    modes: { url: "Vinclo", image: "Foto", text: "Texto" },
    steps: [
      "Analizando o producto…",
      "Buscando en Wallapop, Milanuncios, Vinted y eBay…",
      "Comparando cada anuncio con l'orichinal…",
      "Calculando quánto aforras…",
    ],
    urlLabel: "Vinclo d'o producto nuevo",
    urlPlaceholder: "Vinclo d'o producto en a botiga",
    notesLabel: "Detalles opcionals",
    notesPlaceholder: "Detalles opcionals: talla, color, presupuesto…",
    photoAlt: "Foto puyada",
    removePhoto: "Sacar a foto",
    dropPhoto: "Arrocega una foto u tría-ne una",
    photoFormats: "JPG, PNG u WEBP · dica 5 MB",
    descriptionLabel: "Descripción de l'obchecto",
    descriptionPlaceholder: "Describe-lo si quiers: marca, materials, mesuras…",
    priceLabel: "Precio nuevo en euros",
    pricePlaceholder: "Precio nuevo en € (ta calcular l'aforro)",
    priceOptionalPlaceholder: "Precio nuevo en € (opcional, ta calcular l'aforro)",
    textLabel: "Describe o que buscas",
    textPlaceholder: "Describe o que buscas: qué ye y, si lo sabes, marca, modelo, talla, color, materials…",
    textExample: "Per eixemplo: «butaca de leyer de piel marrón, estilo nordico» u «patinete electrico Xiaomi Pro 2».",
    submit: "Buscar alternativas",
    searching: "Buscando…",
    errors: {
      invalidUrl: "Apega un vinclo valido (prencipia per http:// u https://).",
      noPhoto: "Puya una foto de l'obchecto.",
      shortText: "Describe un poquet más o que buscas.",
      badLink: "No podemos ubrir ixe vinclo. Comprueba que siga bien copiau.",
      imageFormat: "Formato d'imachen no aceptau. Fe servir JPG, PNG, WEBP u GIF.",
      imageTooBig: "A imachen ye masiau gran (como muito 5 MB).",
      describeObject: "Describe l'obchecto ta poder buscar-lo.",
      photosUnavailable: "Agora mesmo no podemos analizar fotos. Describe l'obchecto y torna a buscar.",
      invalid: "Revisa os datos: o vinclo u a imachen no son validos.",
      network: "No i hai connexión con o servidor d'Alter. Torna a prebar-lo en bells segundos.",
      generic: "Bella cosa ha fallau. Torna a prebar-lo.",
    },
  },

  results: {
    label: "Resultaus",
    newPrice: "{price} nuevo",
    demo: "Modo demo: anuncios d'eixemplo que levan ta la busca real de cada web.",
    noAi: "Busca feita sinse IA: l'analisi d'o producto ye aproximada.",
    maxSavings: "d'aforro maximo",
    alternatives: { one: "alternativa", other: "alternativas" },
    lowestPrice: "o precio más baixo",
    manualPrice: "¿Quánto cuesta nuevo?",
    filterLabel: "Filtrar resultaus",
    filterAll: "Totz",
    filterExact: "Iguals ({n})",
    filterSimilar: "Semellants ({n})",
    sortLabel: "Ordenar per",
    sortRecommended: "Recomendaus",
    sortCheapest: "Precio más baixo",
    sortSavings: "Más aforro",
    empty: "No i hai anuncios que encaixen. Preba en as webs d'abaixo u con unatra descripción.",
    alsoSearch: "Busca tamién «{query}» en",
    resultsFrom: { one: "Resultaus d'una plataforma", other: "Resultaus de {n} plataformas" },
    unavailable: ". No hemos puesto consultar {list}",
    sponsored: "Patrocinau",
    youSave: "Aforras {amount}",
    exact: "Mesmo producto",
    similar: "Alternativa semellant",
  },

  platformsPage: {
    title: "{n} webs.",
    highlight: "Una sola busca.",
    intro:
      "Alter busca en as webs de segunda man prencipals con mercau en España. Seguntes o que busques, t'amostramos os suyos anuncios u te levamos dreitament ta la suya busca.",
    inline: "Anuncios en Alter, con precio y aforro",
    linked: "Te vinclamos a suya busca",
    whatYouFind: "Qué i trobarás",
    productsIn: "Productos en {name}",
    visit: "Vesitar {name}",
    finalTitle: "No te cal mirar-las una per una.",
    finalText: "Apega un vinclo, puya una foto u describe-lo, y buscamos per tu.",
    finalCta: "Buscar alternativas",
  },

  platformSections: {
    generalistas: {
      title: "Mercaus chenerals",
      intro:
        "Webs an que se vende de tot a la vegada: tecnolochía, casa, roba, motor, coleccionismo… As consultamos sía qual sía o producto.",
    },
    electronica: {
      title: "Electronica y reacondicionaus",
      intro:
        "Si buscas un mobil, un portatil u una consola, t'amostramos tamién os anuncios de Back Market, Refurbed, Amazon Reacondicionados y CeX, y te vinclamos Rebuy.",
    },
    moda: {
      title: "Moda",
      intro: "Ta roba, calzau y complementos. Vinted la consultamos siempre; as atras, quan buscas moda.",
    },
    "libros-musica": { title: "Libros y mosica", intro: "Ta lectors y mosicos." },
    vintage: { title: "Vintage y decoración", intro: "Ta mobles, decoración y pezas con historia." },
  },

  platforms: {
    wallapop: {
      description: "L'app de compravenda entre particulars más emplegada en España.",
      products: ["Mobils", "Mobles", "Roba", "Bicis", "Motor", "De tot"],
    },
    milanuncios: {
      description: "Anuncios clasificaus de particulars y profesionals de toda España.",
      products: ["Motor", "Casa", "Ferramientas", "Electronica", "De tot"],
    },
    ebay: {
      description: "Mercau internacional con muitos venedors en España. Nomás buscamos articlos usaus.",
      products: ["Electronica", "Coleccionismo", "Recambios", "De tot"],
    },
    cashconverters: {
      description: "Botigas de segunda man con venda en linia y garantía en os suyos productos.",
      products: ["Electronica", "Joyas y reloches", "Ferramientas", "Instrumentos"],
    },
    secondbest: {
      description: "Botiga en linia con articlos de segunda man y d'ocasión de muitas categorías.",
      products: ["Casa", "Electronica", "Diversos"],
    },
    todocoleccion: {
      description: "O gran mercau espanyol de coleccionismo, antigüedaz y obchectos d'época.",
      products: ["Antigüedaz", "Coleccionismo", "Libros antigos", "Arte", "Vintage"],
    },
    backmarket: {
      description: "Electronica reacondicionada per profesionals y con garantía.",
      products: ["Mobils", "Portatils", "Tabletas", "Consolas"],
    },
    refurbed: {
      description: "Electronica reacondicionada, revisada y con garantía.",
      products: ["Mobils", "Portatils", "Tabletas", "Reloches intelichents"],
    },
    amazonrenewed: {
      description: "Productos reacondicionaus y revisaus que se venden en Amazon.es.",
      products: ["Mobils", "Portatils", "Electrodomesticos chicotz", "Audio"],
    },
    cex: {
      description: "Compravenda de tecnolochía y entretenimiento usaus, con botigas fisicas en España.",
      products: ["Mobils", "Consolas", "Videochuegos", "Peliculas"],
    },
    rebuy: {
      description: "Electronica y lecer de segunda man revisaus antes d'a venda.",
      products: ["Mobils", "Tabletas", "Videochuegos", "Libros"],
    },
    vinted: {
      description: "Compravenda de roba y complementos de segunda man entre particulars.",
      products: ["Roba", "Calzau", "Bolsos", "Ninos", "Casa"],
    },
    vestiaire: {
      description: "Moda de luxo y de diseñador de segunda man, con verificación d'autenticidat.",
      products: ["Bolsos", "Roba de diseñador", "Calzau", "Joyas"],
    },
    percentil: {
      description: "Botiga en linia espanyola de roba de segunda man revisada, tamién ta ninos.",
      products: ["Roba", "Complementos", "Roba ta ninos"],
    },
    iberlibro: {
      description: "Libros usaus, antigos y descatalogaus de librerías d'España y de tot o mundo.",
      products: ["Libros usaus", "Primeras edicions", "Descatalogaus"],
    },
    reverb: {
      description: "Mercau d'instrumentos musicals y equipos de son nuevos y usaus.",
      products: ["Guitarras", "Teclaus", "Amplificadors", "Efectos"],
    },
    etsyvintage: {
      description: "Articlos vintage de venedors independients, muitos d'ells en España.",
      products: ["Decoración", "Roba vintage", "Joyas", "Obchectos de colección"],
    },
  },

  footer: {
    tagline: "O buscador de segunda man: Wallapop, Vinted, eBay y {n} webs más en una sola busca.",
    label: "Piet de pachina",
    links: {
      home: "Inicio",
      search: "Buscar",
      how: "Cómo funciona",
      impact: "Impacto",
      faq: "Preguntas freqüents",
    },
    guides: "Guías",
    platforms: "Buscamos en",
    platformsLabel: "Webs an que buscamos",
    allPlatforms: "Veyer as {n} webs ›",
    disclaimer:
      "Os anuncios pertenexen a cada plataforma y os suyos precios pueden cambiar. Os resultaus sinyalaus como «Patrocinau» amaneixen destacaus per un alcuerdo comercial con ixa plataforma.",
    legalLabel: "Información legal",
    legal: { "aviso-legal": "Aviso legal", privacidad: "Privacidat", cookies: "Cookies" },
  },

  breadcrumbs: {
    label: "Rastro de navegación",
    home: "Inicio",
  },

  guides: {
    title: "Guías ta crompar de segunda man",
    intro: "O que conviene revisar antes de pagar, ta que crompar usau siga igual de fácil y seguro que crompar nuevo.",
    readGuide: "Leyer a guía · {n} min",
    whereToSearch: "An buscar",
    moreDetails: "Más detalles de cadaguna en [as {n} webs an que busca Alter](/plataformas).",
    ctaTitle: "Troba-lo en {n} webs a la vegada",
    ctaText:
      "Apega o vinclo d'o que ibas a crompar nuevo, puya una foto u describe-lo. Alter lo busca de segunda man y te diz quánto aforras. De baldes.",
    ctaButton: "Buscar de segunda man",
    related: "Atras guías",
  },

  spanishOnly: {
    guide: "Ista guía nomás ye disponible en castellano.",
    legal: "Iste texto legal nomás ye disponible en castellano, que ye a versión valida.",
  },
};

export default an;
