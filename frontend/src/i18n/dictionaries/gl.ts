/** Textos de la web en gallego (norma da Real Academia Galega). Mismas claves que es.ts. */
import type { Dictionary } from "./es";

const gl: Dictionary = {
  meta: {
    homeTitle: "Alter · Buscador de segunda man: Wallapop, Vinted, eBay e máis",
    homeDescription:
      "Pega unha ligazón, sube unha foto ou descríbeo: Alter busca ese produto de segunda man en Wallapop, Vinted, Milanuncios, eBay e máis webs, e diche canto aforras. De balde.",
    tagline: "Segunda man. Primeira opción.",
    searchTitle: "Buscar de segunda man por ligazón, foto ou texto",
    searchDescription:
      "Pega a ligazón do que ías mercar novo, sube unha foto ou descríbeo e atopa alternativas de segunda man en Wallapop, Vinted, Milanuncios, eBay e máis.",
    platformsTitle: "{n} webs de segunda man en España",
    platformsDescription:
      "As {n} webs de segunda man nas que busca Alter: Wallapop, Vinted, Milanuncios, eBay, Back Market, Vestiaire Collective e máis, e que atoparás en cada unha.",
    guidesTitle: "Guías para mercar de segunda man",
    guidesDescription:
      "Guías prácticas, en castelán, para mercar de segunda man sen sustos: como evitar estafas e que revisar en móbiles, portátiles, bicicletas e mobles usados.",
    ogSubtitle:
      "Pega unha ligazón, sube unha foto ou descríbeo: buscámolo en {n} webs de segunda man e dicímosche canto aforras.",
    organization:
      "Buscador gratuíto de segunda man: a partir dunha ligazón, unha foto ou unha descrición, atopa o produto en {n} webs como Wallapop, Vinted, Milanuncios ou eBay e calcula canto aforras fronte a mercalo novo.",
  },

  and: "e",

  nav: {
    label: "Principal",
    home: "Alter, inicio",
    search: "Buscar",
    how: "Como funciona",
    guides: "Guías",
  },

  language: {
    label: "Idioma",
    change: "Cambiar o idioma",
  },

  hero: {
    eyebrow: "O buscador de segunda man",
    title: "Segunda man.",
    highlight: "Primeira opción.",
    text: "Pega a ligazón do que ías mercar novo, sube unha foto ou simplemente descríbeo. Alter atópao de segunda man e diche canto aforras.",
    cta: "Buscar alternativas",
    how: "Como funciona",
  },

  home: {
    stepsTitle: "Así de fácil.",
    steps: [
      {
        title: "Pega unha ligazón,",
        altTitle: "unha foto ou descríbeo.",
        text: "A ligazón da tenda onde ías mercalo novo, unha foto ou unhas poucas palabras: «butaca de pel marrón», «iPhone 13 128 GB»…",
      },
      {
        title: "A IA enténdeo.",
        text: "Recoñece o produto e as súas características, e búscao nas principais webs de segunda man.",
      },
      {
        title: "Ti aforras.",
        text: "Ligazóns directas a cada anuncio, o seu prezo e canto aforras fronte a mercalo novo.",
      },
    ],
    impact:
      "Cada obxecto que mercas de segunda man é un que non hai que fabricar, empaquetar nin transportar. Reutilizar debería ser tan doado como mercar novo. Agora éo.",
    figures: [
      { eyebrow: "Plataformas", unit: "webs", label: "de segunda man nunha soa busca." },
      { eyebrow: "Prezo", unit: "€", label: "Usar Alter é de balde." },
      { eyebrow: "O que precisas", unit: "ligazón", label: "ou unha foto, ou unhas palabras. Nada máis." },
    ],
    guidesTitle: "Merca usado sen sustos.",
    guidesIntro: "Que revisar antes de pagar, en guías curtas e prácticas (en castelán).",
    readGuide: "Ler a guía",
    allGuides: "Ver todas as guías",
    finalTitle: "A túa próxima compra xa existe.",
    finalText: "Só hai que atopala.",
    finalCta: "Comezar a buscar",
  },

  faq: {
    title: "Preguntas frecuentes",
    items: [
      {
        question: "Que é Alter?",
        answer:
          "Un buscador de segunda man gratuíto. Dislle que ías mercar novo, cunha ligazón, unha foto ou unhas palabras, e búscao á vez en {n} webs como Wallapop, Vinted, Milanuncios ou eBay. Despois amósache os anuncios e canto aforras fronte ao prezo novo.",
      },
      {
        question: "Canto custa usar Alter?",
        answer:
          "Nada: é de balde e non fai falta rexistrarse. A web finánciase con publicidade e con acordos con algunhas plataformas, cuxos resultados se marcan como «Patrocinado».",
      },
      {
        question: "En que webs de segunda man busca?",
        answer:
          "En {n}: {platforms}. Segundo o que busques, amósache os seus anuncios ou lévate directamente á súa busca. Tes o detalle de cada unha en [onde buscamos](/plataformas).",
      },
      {
        question: "Alter vende os produtos?",
        answer:
          "Non. Cada resultado lévate ao anuncio na web onde está publicado, e a compra faise alí, coas súas condicións e a súa protección ao comprador. Antes de pagar, bota unha ollada a [como mercar de segunda man sen que te estafen](/guias/comprar-segunda-mano-sin-riesgos) (en castelán).",
      },
      {
        question: "Como funciona a busca por foto?",
        answer:
          "Unha intelixencia artificial recoñece o obxecto da foto (que é e, se se ve, a marca e o modelo) e búscao nas webs de segunda man. A foto úsase só para esa busca e non se garda. Máis detalles na [política de privacidade](/privacidad) (en castelán).",
      },
      {
        question: "Por que mercar de segunda man?",
        answer:
          "Porque adoitas pagar bastante menos polo mesmo e porque cada obxecto reutilizado é un que non hai que fabricar, empaquetar nin transportar. Coas comprobacións axeitadas, como as das nosas [guías](/guias) (en castelán), é igual de seguro que mercar novo.",
      },
    ],
  },

  searchPage: {
    title: "Que ías mercar?",
    subtitle: "Buscámolo de segunda man por ti.",
    platforms: "Buscamos en {n} webs de segunda man.",
    seeWhich: "Ver cales",
    guides: "Guías para mercar sen sustos",
  },

  search: {
    modesLabel: "Como queres buscar",
    modes: { url: "Ligazón", image: "Foto", text: "Texto" },
    steps: [
      "Analizando o produto…",
      "Buscando en Wallapop, Milanuncios, Vinted e eBay…",
      "Comparando cada anuncio co orixinal…",
      "Calculando canto aforras…",
    ],
    urlLabel: "Ligazón do produto novo",
    urlPlaceholder: "Ligazón do produto na tenda",
    notesLabel: "Detalles opcionais",
    notesPlaceholder: "Detalles opcionais: talla, cor, orzamento…",
    photoAlt: "Foto subida",
    removePhoto: "Quitar a foto",
    dropPhoto: "Arrastra unha foto ou escolle unha",
    photoFormats: "JPG, PNG ou WEBP · ata 5 MB",
    descriptionLabel: "Descrición do obxecto",
    descriptionPlaceholder: "Descríbeo se queres: marca, materiais, medidas…",
    priceLabel: "Prezo novo en euros",
    pricePlaceholder: "Prezo novo en € (para calcular o aforro)",
    priceOptionalPlaceholder: "Prezo novo en € (opcional, para calcular o aforro)",
    textLabel: "Describe o que buscas",
    textPlaceholder: "Describe o que buscas: que é e, se o sabes, marca, modelo, talla, cor, materiais…",
    textExample: "Por exemplo: «butaca de lectura de pel marrón, estilo nórdico» ou «patinete eléctrico Xiaomi Pro 2».",
    submit: "Buscar alternativas",
    searching: "Buscando…",
    errors: {
      invalidUrl: "Pega unha ligazón válida (comeza por http:// ou https://).",
      noPhoto: "Sube unha foto do obxecto.",
      shortText: "Describe un pouco máis o que buscas.",
      badLink: "Non podemos abrir esa ligazón. Comproba que está ben copiada.",
      imageFormat: "Formato de imaxe non admitido. Usa JPG, PNG, WEBP ou GIF.",
      imageTooBig: "A imaxe é demasiado grande (máximo 5 MB).",
      describeObject: "Describe o obxecto para poder buscalo.",
      photosUnavailable: "Agora mesmo non podemos analizar fotos. Describe o obxecto e volve buscar.",
      invalid: "Revisa os datos: a ligazón ou a imaxe non son válidas.",
      network: "Non hai conexión co servidor de Alter. Téntao de novo nuns segundos.",
      generic: "Algo fallou. Téntao de novo.",
    },
  },

  results: {
    label: "Resultados",
    newPrice: "{price} novo",
    demo: "Modo demo: anuncios de exemplo que levan á busca real de cada web.",
    noAi: "Busca feita sen IA: a análise do produto é aproximada.",
    maxSavings: "de aforro máximo",
    alternatives: { one: "alternativa", other: "alternativas" },
    lowestPrice: "o prezo máis baixo",
    manualPrice: "Canto custa novo?",
    filterLabel: "Filtrar resultados",
    filterAll: "Todos",
    filterExact: "Iguais ({n})",
    filterSimilar: "Similares ({n})",
    sortLabel: "Ordenar por",
    sortRecommended: "Recomendados",
    sortCheapest: "Prezo máis baixo",
    sortSavings: "Maior aforro",
    empty: "Non hai anuncios que encaixen. Proba nas webs de abaixo ou con outra descrición.",
    alsoSearch: "Busca tamén «{query}» en",
    resultsFrom: { one: "Resultados dunha plataforma", other: "Resultados de {n} plataformas" },
    unavailable: ". Non puidemos consultar {list}",
    sponsored: "Patrocinado",
    youSave: "Aforras {amount}",
    exact: "Mesmo produto",
    similar: "Alternativa similar",
  },

  platformsPage: {
    title: "{n} webs.",
    highlight: "Unha soa busca.",
    intro:
      "Alter busca nas principais webs de segunda man con mercado en España. Segundo o que busques, amosámosche os seus anuncios ou levámoste directamente á súa busca.",
    inline: "Anuncios en Alter, con prezo e aforro",
    linked: "Ligámosche a súa busca",
    whatYouFind: "Que atoparás",
    productsIn: "Produtos en {name}",
    visit: "Visitar {name}",
    finalTitle: "Non tes que miralas unha a unha.",
    finalText: "Pega unha ligazón, sube unha foto ou descríbeo, e buscamos por ti.",
    finalCta: "Buscar alternativas",
  },

  platformSections: {
    generalistas: {
      title: "Mercados xeneralistas",
      intro:
        "Webs onde se vende de todo á vez: tecnoloxía, fogar, roupa, motor, coleccionismo… Consultámolas sexa cal sexa o produto.",
    },
    electronica: {
      title: "Electrónica e recondicionados",
      intro:
        "Se buscas un móbil, un portátil ou unha consola, amosámosche tamén os anuncios de Back Market, Refurbed, Amazon Reacondicionados e CeX, e ligámosche Rebuy.",
    },
    moda: {
      title: "Moda",
      intro: "Para roupa, calzado e complementos. Vinted consultámola sempre; as demais, cando buscas moda.",
    },
    "libros-musica": { title: "Libros e música", intro: "Para lectores e músicos." },
    vintage: { title: "Vintage e decoración", intro: "Para mobles, decoración e pezas con historia." },
  },

  platforms: {
    wallapop: {
      description: "A app de compravenda entre particulares máis usada en España.",
      products: ["Móbiles", "Mobles", "Roupa", "Bicis", "Motor", "De todo"],
    },
    milanuncios: {
      description: "Anuncios clasificados de particulares e profesionais de toda España.",
      products: ["Motor", "Fogar", "Ferramentas", "Electrónica", "De todo"],
    },
    ebay: {
      description: "Mercado internacional con moitos vendedores en España. Buscamos só artigos usados.",
      products: ["Electrónica", "Coleccionismo", "Recambios", "De todo"],
    },
    cashconverters: {
      description: "Tendas de segunda man con venda en liña e garantía nos seus produtos.",
      products: ["Electrónica", "Xoias e reloxos", "Ferramentas", "Instrumentos"],
    },
    secondbest: {
      description: "Tenda en liña con artigos de segunda man e de ocasión de moitas categorías.",
      products: ["Fogar", "Electrónica", "Varios"],
    },
    todocoleccion: {
      description: "O gran mercado español de coleccionismo, antigüidades e obxectos de época.",
      products: ["Antigüidades", "Coleccionismo", "Libros antigos", "Arte", "Vintage"],
    },
    backmarket: {
      description: "Electrónica recondicionada por profesionais e con garantía.",
      products: ["Móbiles", "Portátiles", "Tabletas", "Consolas"],
    },
    refurbed: {
      description: "Electrónica recondicionada, revisada e con garantía.",
      products: ["Móbiles", "Portátiles", "Tabletas", "Reloxos intelixentes"],
    },
    amazonrenewed: {
      description: "Produtos recondicionados e revisados que se venden en Amazon.es.",
      products: ["Móbiles", "Portátiles", "Pequenos electrodomésticos", "Audio"],
    },
    cex: {
      description: "Compravenda de tecnoloxía e entretemento usados, con tendas físicas en España.",
      products: ["Móbiles", "Consolas", "Videoxogos", "Películas"],
    },
    rebuy: {
      description: "Electrónica e lecer de segunda man revisados antes da venda.",
      products: ["Móbiles", "Tabletas", "Videoxogos", "Libros"],
    },
    vinted: {
      description: "Compravenda de roupa e complementos de segunda man entre particulares.",
      products: ["Roupa", "Calzado", "Bolsos", "Infantil", "Fogar"],
    },
    vestiaire: {
      description: "Moda de luxo e de deseñador de segunda man, con verificación de autenticidade.",
      products: ["Bolsos", "Roupa de deseñador", "Calzado", "Xoias"],
    },
    percentil: {
      description: "Tenda en liña española de roupa de segunda man revisada, tamén infantil.",
      products: ["Roupa", "Complementos", "Roupa infantil"],
    },
    iberlibro: {
      description: "Libros usados, antigos e descatalogados de librarías de España e de todo o mundo.",
      products: ["Libros usados", "Primeiras edicións", "Descatalogados"],
    },
    reverb: {
      description: "Mercado de instrumentos musicais e equipo de son novos e usados.",
      products: ["Guitarras", "Teclados", "Amplificadores", "Efectos"],
    },
    etsyvintage: {
      description: "Artigos vintage de vendedores independentes, moitos deles en España.",
      products: ["Decoración", "Roupa vintage", "Xoias", "Obxectos de colección"],
    },
  },

  footer: {
    tagline: "O buscador de segunda man: Wallapop, Vinted, eBay e {n} webs máis nunha soa busca.",
    label: "Pé de páxina",
    links: {
      home: "Inicio",
      search: "Buscar",
      how: "Como funciona",
      impact: "Impacto",
      faq: "Preguntas frecuentes",
    },
    guides: "Guías",
    platforms: "Buscamos en",
    platformsLabel: "Webs nas que buscamos",
    allPlatforms: "Ver as {n} webs ›",
    disclaimer:
      "Os anuncios pertencen a cada plataforma e os seus prezos poden cambiar. Os resultados marcados como «Patrocinado» aparecen destacados por un acordo comercial con esa plataforma.",
    legalLabel: "Información legal",
    legal: { "aviso-legal": "Aviso legal", privacidad: "Privacidade", cookies: "Cookies" },
  },

  breadcrumbs: {
    label: "Ruta de navegación",
    home: "Inicio",
  },

  guides: {
    title: "Guías para mercar de segunda man",
    intro: "O que convén revisar antes de pagar, para que mercar usado sexa igual de doado e seguro que mercar novo.",
    readGuide: "Ler a guía · {n} min",
    whereToSearch: "Onde buscar",
    moreDetails: "Máis detalles de cada unha en [as {n} webs nas que busca Alter](/plataformas).",
    ctaTitle: "Atópao en {n} webs á vez",
    ctaText:
      "Pega a ligazón do que ías mercar novo, sube unha foto ou descríbeo. Alter búscao de segunda man e diche canto aforras. De balde.",
    ctaButton: "Buscar de segunda man",
    related: "Outras guías",
  },

  spanishOnly: {
    guide: "Esta guía só está dispoñible en castelán.",
    legal: "Este texto legal só está dispoñible en castelán, que é a versión válida.",
  },
};

export default gl;
