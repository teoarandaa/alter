/**
 * Textos de la web en asturleonés, con la norma de l'Academia de la Llingua Asturiana.
 * Mismas claves que es.ts. Conviene que lo revise un hablante nativo antes de darlo por bueno.
 */
import type { Dictionary } from "./es";

const ast: Dictionary = {
  meta: {
    homeTitle: "Alter · Buscador de segunda mano: Wallapop, Vinted, eBay y más",
    homeDescription:
      "Pega un enllaz, xubi una semeya o descríbilu: Alter busca esi productu de segunda mano en Wallapop, Vinted, Milanuncios, eBay y más webs, y dízte cuánto aforres. De baldre.",
    tagline: "Segunda mano. Primera opción.",
    searchTitle: "Buscar de segunda mano per enllaz, semeya o testu",
    searchDescription:
      "Pega l'enllaz de lo que dibes mercar nuevo, xubi una semeya o descríbilu y atopa alternatives de segunda mano en Wallapop, Vinted, Milanuncios, eBay y más.",
    platformsTitle: "{n} webs de segunda mano n'España",
    platformsDescription:
      "Les {n} webs de segunda mano nes que busca Alter: Wallapop, Vinted, Milanuncios, eBay, Back Market, Vestiaire Collective y más, y lo que vas atopar en caúna.",
    guidesTitle: "Guíes pa mercar de segunda mano",
    guidesDescription:
      "Guíes práctiques, en castellanu, pa mercar de segunda mano ensin sustos: cómo evitar estafes y qué revisar en móviles, portátiles, bicicletes y muebles usaos.",
    ogSubtitle:
      "Pega un enllaz, xubi una semeya o descríbilu: buscámoslu en {n} webs de segunda mano y dicímoste cuánto aforres.",
    organization:
      "Buscador de baldre de segunda mano: a partir d'un enllaz, una semeya o una descripción, atopa'l productu en {n} webs como Wallapop, Vinted, Milanuncios o eBay y calcula cuánto aforres frente a mercalu nuevu.",
  },

  and: "y",

  nav: {
    label: "Principal",
    home: "Alter, aniciu",
    search: "Buscar",
    how: "Cómo funciona",
    guides: "Guíes",
  },

  language: {
    label: "Llingua",
    change: "Camudar la llingua",
  },

  hero: {
    eyebrow: "El buscador de segunda mano",
    title: "Segunda mano.",
    highlight: "Primera opción.",
    text: "Pega l'enllaz de lo que dibes mercar nuevo, xubi una semeya o, a la cenciella, descríbilu. Alter atópalu de segunda mano y dízte cuánto aforres.",
    cta: "Buscar alternatives",
    how: "Cómo funciona",
  },

  home: {
    stepsTitle: "Asina de fácil.",
    steps: [
      {
        title: "Pega un enllaz,",
        altTitle: "una semeya o descríbilu.",
        text: "L'enllaz de la tienda onde lu dibes mercar nuevu, una semeya o delles palabres: «butaca de piel marrón», «iPhone 13 128 GB»…",
      },
      {
        title: "La IA entiéndelu.",
        text: "Reconoz el productu y les sos carauterístiques, y búscalu nes principales webs de segunda mano.",
      },
      {
        title: "Tu aforres.",
        text: "Enllaces direutos a cada anunciu, el so preciu y cuánto t'aforres frente a mercalu nuevu.",
      },
    ],
    impact:
      "Cada oxetu que merques de segunda mano ye ún que nun hai que fabricar, empaquetar nin tresportar. Reutilizar debería ser tan fácil como mercar nuevo. Agora yelo.",
    figures: [
      { eyebrow: "Plataformes", unit: "webs", label: "de segunda mano nuna sola busca." },
      { eyebrow: "Preciu", unit: "€", label: "Usar Alter ye de baldre." },
      { eyebrow: "Lo que necesites", unit: "enllaz", label: "o una semeya, o delles palabres. Nada más." },
    ],
    guidesTitle: "Merca usao ensin sustos.",
    guidesIntro: "Qué revisar enantes de pagar, en guíes curties y práctiques (en castellanu).",
    readGuide: "Lleer la guía",
    allGuides: "Ver toles guíes",
    finalTitle: "La to próxima compra yá esiste.",
    finalText: "Namái hai qu'atopala.",
    finalCta: "Entamar a buscar",
  },

  faq: {
    title: "Entrugues frecuentes",
    items: [
      {
        question: "¿Qué ye Alter?",
        answer:
          "Un buscador de segunda mano de baldre. Dícesle qué dibes mercar nuevo, con un enllaz, una semeya o delles palabres, y búscalu al empar en {n} webs como Wallapop, Vinted, Milanuncios o eBay. Dempués amuéstrate los anuncios y cuánto aforres frente al preciu nuevu.",
      },
      {
        question: "¿Cuánto cuesta usar Alter?",
        answer:
          "Nada: ye de baldre y nun fai falta rexistrase. La web finánciase con publicidá y con alcuerdos con delles plataformes, que los sos resultaos se marquen como «Patrocináu».",
      },
      {
        question: "¿En qué webs de segunda mano busca?",
        answer:
          "En {n}: {platforms}. Según lo que busques, amuéstrate los sos anuncios o llévate direutamente a la so busca. Tienes el detalle de caúna en [ónde buscamos](/plataformas).",
      },
      {
        question: "¿Alter vende los productos?",
        answer:
          "Non. Cada resultáu llévate al anunciu na web onde ta espublizáu, y la compra faise ellí, coles sos condiciones y la so proteición al comprador. Enantes de pagar, échai un güeyu a [cómo mercar de segunda mano ensin que t'estafen](/guias/comprar-segunda-mano-sin-riesgos) (en castellanu).",
      },
      {
        question: "¿Cómo funciona la busca per semeya?",
        answer:
          "Una intelixencia artificial reconoz l'oxetu de la semeya (qué ye y, si se ve, la marca y el modelu) y búscalu nes webs de segunda mano. La semeya úsase namái pa esa busca y nun se guarda. Más detalles na [política de privacidá](/privacidad) (en castellanu).",
      },
      {
        question: "¿Por qué mercar de segunda mano?",
        answer:
          "Porque sueles pagar abondo menos pol mesmo y porque cada oxetu reutilizáu ye ún que nun hai que fabricar, empaquetar nin tresportar. Coles comprobaciones afayadices, como les de les nueses [guíes](/guias) (en castellanu), ye igual de seguro que mercar nuevo.",
      },
    ],
  },

  searchPage: {
    title: "¿Qué dibes mercar?",
    subtitle: "Buscámoslu de segunda mano por ti.",
    platforms: "Buscamos en {n} webs de segunda mano.",
    seeWhich: "Ver cuáles",
    guides: "Guíes pa mercar ensin sustos",
  },

  search: {
    modesLabel: "Cómo quies buscar",
    modes: { url: "Enllaz", image: "Semeya", text: "Testu" },
    steps: [
      "Analizando'l productu…",
      "Buscando en Wallapop, Milanuncios, Vinted y eBay…",
      "Comparando cada anunciu col orixinal…",
      "Calculando cuánto aforres…",
    ],
    urlLabel: "Enllaz del productu nuevu",
    urlPlaceholder: "Enllaz del productu na tienda",
    notesLabel: "Detalles opcionales",
    notesPlaceholder: "Detalles opcionales: talla, color, presupuestu…",
    photoAlt: "Semeya xubida",
    removePhoto: "Quitar la semeya",
    dropPhoto: "Arrastra una semeya o escueyi una",
    photoFormats: "JPG, PNG o WEBP · hasta 5 MB",
    descriptionLabel: "Descripción del oxetu",
    descriptionPlaceholder: "Descríbilu si quies: marca, materiales, midíes…",
    priceLabel: "Preciu nuevu n'euros",
    pricePlaceholder: "Preciu nuevu en € (pa calcular l'aforru)",
    priceOptionalPlaceholder: "Preciu nuevu en € (opcional, pa calcular l'aforru)",
    textLabel: "Describi lo que busques",
    textPlaceholder: "Describi lo que busques: qué ye y, si lo sabes, marca, modelu, talla, color, materiales…",
    textExample: "Por exemplu: «butaca de llectura de piel marrón, estilu nórdicu» o «patinete llétricu Xiaomi Pro 2».",
    submit: "Buscar alternatives",
    searching: "Buscando…",
    errors: {
      invalidUrl: "Pega un enllaz válidu (entama por http:// o https://).",
      noPhoto: "Xubi una semeya del oxetu.",
      shortText: "Describi un poco más lo que busques.",
      badLink: "Nun podemos abrir esi enllaz. Comprueba que tea bien copiáu.",
      imageFormat: "Formatu d'imaxe non almitíu. Usa JPG, PNG, WEBP o GIF.",
      imageTooBig: "La imaxe ye enforma grande (5 MB como muncho).",
      describeObject: "Describi l'oxetu pa poder buscalu.",
      photosUnavailable: "Agora mesmo nun podemos analizar semeyes. Describi l'oxetu y vuelvi buscar.",
      invalid: "Revisa los datos: l'enllaz o la imaxe nun son válidos.",
      network: "Nun hai conexón col sirvidor d'Alter. Vuelvi tentalo en dellos segundos.",
      generic: "Daqué falló. Vuelvi tentalo.",
    },
  },

  results: {
    label: "Resultaos",
    newPrice: "{price} nuevu",
    demo: "Mou demo: anuncios d'exemplu que lleven a la busca real de cada web.",
    noAi: "Busca fecha ensin IA: l'análisis del productu ye aproximáu.",
    maxSavings: "d'aforru máximu",
    alternatives: { one: "alternativa", other: "alternatives" },
    lowestPrice: "el preciu más baxu",
    manualPrice: "¿Cuánto cuesta nuevu?",
    filterLabel: "Peñerar resultaos",
    filterAll: "Toos",
    filterExact: "Iguales ({n})",
    filterSimilar: "Paecíos ({n})",
    sortLabel: "Ordenar por",
    sortRecommended: "Recomendaos",
    sortCheapest: "Preciu más baxu",
    sortSavings: "Más aforru",
    empty: "Nun hai anuncios qu'encaxen. Preba nes webs d'embaxo o con otra descripción.",
    alsoSearch: "Busca tamién «{query}» en",
    resultsFrom: { one: "Resultaos d'una plataforma", other: "Resultaos de {n} plataformes" },
    unavailable: ". Nun pudimos consultar {list}",
    sponsored: "Patrocináu",
    youSave: "Aforres {amount}",
    exact: "El mesmu productu",
    similar: "Alternativa paecida",
  },

  platformsPage: {
    title: "{n} webs.",
    highlight: "Una sola busca.",
    intro:
      "Alter busca nes principales webs de segunda mano con mercáu n'España. Según lo que busques, amosámoste los sos anuncios o llevámoste direutamente a la so busca.",
    inline: "Anuncios n'Alter, con preciu y aforru",
    linked: "Enllazámoste la so busca",
    whatYouFind: "Lo que vas atopar",
    productsIn: "Productos en {name}",
    visit: "Visitar {name}",
    finalTitle: "Nun tienes que miráles una a una.",
    finalText: "Pega un enllaz, xubi una semeya o descríbilu, y buscamos por ti.",
    finalCta: "Buscar alternatives",
  },

  platformSections: {
    generalistas: {
      title: "Mercaos xeneralistes",
      intro:
        "Webs onde se vende de too al empar: teunoloxía, llar, ropa, motor, coleicionismu… Consultámosles seya cual seya'l productu.",
    },
    electronica: {
      title: "Electrónica y reacondicionaos",
      intro:
        "Si busques un móvil, un portátil o una consola, amosámoste tamién los anuncios de Back Market, Refurbed, Amazon Reacondicionados y CeX, y enllazámoste Rebuy.",
    },
    moda: {
      title: "Moda",
      intro: "Pa ropa, calzáu y complementos. Vinted consultámosla siempre; les otres, cuando busques moda.",
    },
    "libros-musica": { title: "Llibros y música", intro: "Pa llectores y músicos." },
    vintage: { title: "Vintage y decoración", intro: "Pa muebles, decoración y pieces con hestoria." },
  },

  platforms: {
    wallapop: {
      description: "L'app de compraventa ente particulares más usada n'España.",
      products: ["Móviles", "Muebles", "Ropa", "Bicis", "Motor", "De too"],
    },
    milanuncios: {
      description: "Anuncios clasificaos de particulares y profesionales de tola España.",
      products: ["Motor", "Llar", "Ferramientes", "Electrónica", "De too"],
    },
    ebay: {
      description: "Mercáu internacional con munchos vendedores n'España. Namái buscamos artículos usaos.",
      products: ["Electrónica", "Coleicionismu", "Recambios", "De too"],
    },
    cashconverters: {
      description: "Tiendes de segunda mano con venta en llinia y garantía nos sos productos.",
      products: ["Electrónica", "Xoyes y reloxos", "Ferramientes", "Instrumentos"],
    },
    secondbest: {
      description: "Tienda en llinia con artículos de segunda mano y d'ocasión de munches categoríes.",
      products: ["Llar", "Electrónica", "Varios"],
    },
    todocoleccion: {
      description: "El gran mercáu español de coleicionismu, antigüedaes y oxetos d'época.",
      products: ["Antigüedaes", "Coleicionismu", "Llibros antiguos", "Arte", "Vintage"],
    },
    backmarket: {
      description: "Electrónica reacondicionada por profesionales y con garantía.",
      products: ["Móviles", "Portátiles", "Tabletes", "Consoles"],
    },
    refurbed: {
      description: "Electrónica reacondicionada, revisada y con garantía.",
      products: ["Móviles", "Portátiles", "Tabletes", "Reloxos intelixentes"],
    },
    amazonrenewed: {
      description: "Productos reacondicionaos y revisaos que se venden n'Amazon.es.",
      products: ["Móviles", "Portátiles", "Electrodomésticos pequeños", "Audiu"],
    },
    cex: {
      description: "Compraventa de teunoloxía y entretenimientu usaos, con tiendes físiques n'España.",
      products: ["Móviles", "Consoles", "Videoxuegos", "Películes"],
    },
    rebuy: {
      description: "Electrónica y ociu de segunda mano revisaos enantes de la venta.",
      products: ["Móviles", "Tabletes", "Videoxuegos", "Llibros"],
    },
    vinted: {
      description: "Compraventa de ropa y complementos de segunda mano ente particulares.",
      products: ["Ropa", "Calzáu", "Bolsos", "Neños", "Llar"],
    },
    vestiaire: {
      description: "Moda de luxu y de diseñador de segunda mano, con verificación d'autenticidá.",
      products: ["Bolsos", "Ropa de diseñador", "Calzáu", "Xoyes"],
    },
    percentil: {
      description: "Tienda en llinia española de ropa de segunda mano revisada, tamién pa neños.",
      products: ["Ropa", "Complementos", "Ropa de neños"],
    },
    iberlibro: {
      description: "Llibros usaos, antiguos y descatalogaos de llibreríes d'España y de tol mundu.",
      products: ["Llibros usaos", "Primeres ediciones", "Descatalogaos"],
    },
    reverb: {
      description: "Mercáu d'instrumentos musicales y equipos de soníu nuevos y usaos.",
      products: ["Guitarres", "Teclaos", "Amplificadores", "Efeutos"],
    },
    etsyvintage: {
      description: "Artículos vintage de vendedores independientes, munchos d'ellos n'España.",
      products: ["Decoración", "Ropa vintage", "Xoyes", "Oxetos de coleición"],
    },
  },

  footer: {
    tagline: "El buscador de segunda mano: Wallapop, Vinted, eBay y {n} webs más nuna sola busca.",
    label: "Pie de páxina",
    links: {
      home: "Aniciu",
      search: "Buscar",
      how: "Cómo funciona",
      impact: "Impautu",
      faq: "Entrugues frecuentes",
    },
    guides: "Guíes",
    platforms: "Buscamos en",
    platformsLabel: "Webs nes que buscamos",
    allPlatforms: "Ver les {n} webs ›",
    disclaimer:
      "Los anuncios son de cada plataforma y los sos precios puen camudar. Los resultaos marcaos como «Patrocináu» apaecen destacaos por un alcuerdu comercial con esa plataforma.",
    legalLabel: "Información llegal",
    legal: { "aviso-legal": "Avisu llegal", privacidad: "Privacidá", cookies: "Cookies" },
  },

  breadcrumbs: {
    label: "Camín de navegación",
    home: "Aniciu",
  },

  guides: {
    title: "Guíes pa mercar de segunda mano",
    intro: "Lo que convién revisar enantes de pagar, pa que mercar usao seya igual de fácil y seguro que mercar nuevo.",
    readGuide: "Lleer la guía · {n} min",
    whereToSearch: "Ónde buscar",
    moreDetails: "Más detalles de caúna en [les {n} webs nes que busca Alter](/plataformas).",
    ctaTitle: "Atópalu en {n} webs al empar",
    ctaText:
      "Pega l'enllaz de lo que dibes mercar nuevo, xubi una semeya o descríbilu. Alter búscalu de segunda mano y dízte cuánto aforres. De baldre.",
    ctaButton: "Buscar de segunda mano",
    related: "Otres guíes",
  },

  spanishOnly: {
    guide: "Esta guía namái ta disponible en castellanu.",
    legal: "Esti testu llegal namái ta disponible en castellanu, que ye la versión válida.",
  },
};

export default ast;
