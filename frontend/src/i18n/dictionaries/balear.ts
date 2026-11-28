/**
 * Textos de la web en catalán de las Islas Baleares, en registro coloquial: article salat (es, sa, ses),
 * primera persona del plural en -am/-im (cercam, deim) y léxico de las islas (aferrar, guaitar,
 * al·lots, de franc, res pus…). Mismas claves que es.ts.
 */
import type { Dictionary } from "./es";

const balear: Dictionary = {
  meta: {
    homeTitle: "Alter · Es cercador de segona mà: Wallapop, Vinted, eBay i més",
    homeDescription:
      "Aferra un enllaç, puja una foto o descriu-lo: Alter cerca aquest producte de segona mà a Wallapop, Vinted, Milanuncios, eBay i més webs, i et diu quant estalvies. De franc.",
    tagline: "Segona mà. Primera opció.",
    searchTitle: "Cerca de segona mà per enllaç, foto o text",
    searchDescription:
      "Aferra s'enllaç d'allò que anaves a comprar nou, puja una foto o descriu-lo i troba alternatives de segona mà a Wallapop, Vinted, Milanuncios, eBay i més.",
    platformsTitle: "{n} webs de segona mà a Espanya",
    platformsDescription:
      "Ses {n} webs de segona mà on cerca Alter: Wallapop, Vinted, Milanuncios, eBay, Back Market, Vestiaire Collective i més, i què hi trobaràs a cadascuna.",
    guidesTitle: "Guies per comprar de segona mà",
    guidesDescription:
      "Guies pràctiques, en castellà, per comprar de segona mà sense ensurts: com evitar estafes i què has de revisar en mòbils, portàtils, bicicletes i mobles usats.",
    ogSubtitle:
      "Aferra un enllaç, puja una foto o descriu-lo: el cercam a {n} webs de segona mà i et deim quant estalvies.",
    organization:
      "Cercador de segona mà de franc: a partir d'un enllaç, una foto o una descripció, troba es producte a {n} webs com Wallapop, Vinted, Milanuncios o eBay i calcula quant estalvies respecte de comprar-lo nou.",
  },

  and: "i",

  nav: {
    label: "Principal",
    home: "Alter, inici",
    search: "Cercar",
    how: "Com funciona",
    guides: "Guies",
  },

  language: {
    label: "Llengua",
    change: "Canvia sa llengua",
  },

  hero: {
    eyebrow: "Es cercador de segona mà",
    title: "Segona mà.",
    highlight: "Primera opció.",
    text: "Aferra s'enllaç d'allò que anaves a comprar nou, puja una foto o simplement descriu-lo. Alter el troba de segona mà i et diu quant estalvies.",
    cta: "Cerca alternatives",
    how: "Com funciona",
  },

  home: {
    stepsTitle: "Així de fàcil.",
    steps: [
      {
        title: "Aferra un enllaç,",
        altTitle: "una foto o descriu-lo.",
        text: "S'enllaç de sa botiga on l'anaves a comprar nou, una foto o un parell de paraules: «butaca de pell marró», «iPhone 13 128 GB»…",
      },
      {
        title: "Sa IA ho entén.",
        text: "Reconeix es producte i ses seves característiques, i el cerca a ses principals webs de segona mà.",
      },
      {
        title: "Tu estalvies.",
        text: "Enllaços directes a cada anunci, es seu preu i quant estalvies respecte de comprar-lo nou.",
      },
    ],
    impact:
      "Cada cosa que compres de segona mà és una cosa que no s'ha de fabricar, empaquetar ni transportar. Reutilitzar hauria de ser tan fàcil com comprar nou. Ara ho és.",
    figures: [
      { eyebrow: "Plataformes", unit: "webs", label: "de segona mà en una sola cerca." },
      { eyebrow: "Preu", unit: "€", label: "Fer servir Alter és de franc." },
      { eyebrow: "Allò que necessites", unit: "enllaç", label: "o una foto, o un parell de paraules. Res pus." },
    ],
    guidesTitle: "Compra de segona mà sense ensurts.",
    guidesIntro: "Què has de revisar abans de pagar, en guies curtes i pràctiques (en castellà).",
    readGuide: "Llegeix sa guia",
    allGuides: "Guaita totes ses guies",
    finalTitle: "Sa teva pròxima compra ja existeix.",
    finalText: "Només l'has de trobar.",
    finalCta: "Comença a cercar",
  },

  faq: {
    title: "Preguntes freqüents",
    items: [
      {
        question: "Què és Alter?",
        answer:
          "Un cercador de segona mà de franc. Li dius què anaves a comprar nou, amb un enllaç, una foto o un parell de paraules, i el cerca alhora a {n} webs com Wallapop, Vinted, Milanuncios o eBay. Llavors et mostra ets anuncis i quant estalvies respecte des preu nou.",
      },
      {
        question: "Quant costa fer servir Alter?",
        answer:
          "Res: és de franc i no t'has de registrar. Sa web es finança amb publicitat i amb acords amb algunes plataformes, i es seus resultats es marquen com a «Patrocinat».",
      },
      {
        question: "A quines webs de segona mà cerca?",
        answer:
          "A {n}: {platforms}. Segons què cerquis, et mostra es seus anuncis o et du directament a sa seva cerca. Tens es detall de cadascuna a [on cercam](/plataformas).",
      },
      {
        question: "Alter ven es productes?",
        answer:
          "No. Cada resultat et du a s'anunci a sa web on està publicat, i sa compra es fa allà, amb ses seves condicions i sa seva protecció an es comprador. Abans de pagar, fes una ullada a [com comprar de segona mà sense que t'estafin](/guias/comprar-segunda-mano-sin-riesgos) (en castellà).",
      },
      {
        question: "Com funciona sa cerca per foto?",
        answer:
          "Una intel·ligència artificial reconeix s'objecte de sa foto (què és i, si es veu, sa marca i es model) i el cerca a ses webs de segona mà. Sa foto només s'utilitza per a aquesta cerca i no es desa. Més detalls a sa [política de privadesa](/privacidad) (en castellà).",
      },
      {
        question: "Per què comprar de segona mà?",
        answer:
          "Perquè sovint pagues molt manco pes mateix i perquè cada cosa reutilitzada és una cosa que no s'ha de fabricar, empaquetar ni transportar. Amb ses comprovacions adequades, com ses de ses nostres [guies](/guias) (en castellà), és igual de segur que comprar nou.",
      },
    ],
  },

  searchPage: {
    title: "Què anaves a comprar?",
    subtitle: "El te cercam de segona mà.",
    platforms: "Cercam a {n} webs de segona mà.",
    seeWhich: "Guaita quines",
    guides: "Guies per comprar sense ensurts",
  },

  search: {
    modesLabel: "Com vols cercar",
    modes: { url: "Enllaç", image: "Foto", text: "Text" },
    steps: [
      "Analitzant es producte…",
      "Cercant a Wallapop, Milanuncios, Vinted i eBay…",
      "Comparant cada anunci amb s'original…",
      "Calculant quant estalvies…",
    ],
    urlLabel: "Enllaç des producte nou",
    urlPlaceholder: "Enllaç des producte a sa botiga",
    notesLabel: "Detalls opcionals",
    notesPlaceholder: "Detalls opcionals: talla, color, pressupost…",
    photoAlt: "Foto pujada",
    removePhoto: "Lleva sa foto",
    dropPhoto: "Arrossega una foto o tria'n una",
    photoFormats: "JPG, PNG o WEBP · fins a 5 MB",
    descriptionLabel: "Descripció de s'objecte",
    descriptionPlaceholder: "Descriu-lo si vols: marca, materials, mides…",
    priceLabel: "Preu nou en euros",
    pricePlaceholder: "Preu nou en € (per calcular s'estalvi)",
    priceOptionalPlaceholder: "Preu nou en € (opcional, per calcular s'estalvi)",
    textLabel: "Descriu què cerques",
    textPlaceholder: "Descriu què cerques: què és i, si ho saps, marca, model, talla, color, materials…",
    textExample: "Per exemple: «butaca de lectura de pell marró, estil nòrdic» o «patinet elèctric Xiaomi Pro 2».",
    submit: "Cerca alternatives",
    searching: "Cercant…",
    errors: {
      invalidUrl: "Aferra un enllaç vàlid (comença per http:// o https://).",
      noPhoto: "Puja una foto de s'objecte.",
      shortText: "Descriu un poc més què cerques.",
      badLink: "No podem obrir aquest enllaç. Comprova que estigui ben copiat.",
      imageFormat: "Format d'imatge no admès. Fes servir JPG, PNG, WEBP o GIF.",
      imageTooBig: "Sa imatge és massa grossa (5 MB com a màxim).",
      describeObject: "Descriu s'objecte per poder-lo cercar.",
      photosUnavailable: "Ara mateix no podem analitzar fotos. Descriu s'objecte i torna a cercar.",
      invalid: "Revisa ses dades: s'enllaç o sa imatge no són vàlids.",
      network: "No hi ha connexió amb es servidor d'Alter. Torna-ho a provar d'aquí a uns segons.",
      generic: "Qualque cosa ha fallat. Torna-ho a provar.",
    },
  },

  results: {
    label: "Resultats",
    newPrice: "{price} nou",
    demo: "Mode demo: anuncis d'exemple que duen a sa cerca real de cada web.",
    noAi: "Cerca feta sense IA: s'anàlisi des producte és aproximada.",
    maxSavings: "d'estalvi màxim",
    alternatives: { one: "alternativa", other: "alternatives" },
    lowestPrice: "es preu més baix",
    manualPrice: "Quant costa nou?",
    filterLabel: "Filtra es resultats",
    filterAll: "Tots",
    filterExact: "Iguals ({n})",
    filterSimilar: "Semblants ({n})",
    sortLabel: "Ordena per",
    sortRecommended: "Recomanats",
    sortCheapest: "Preu més baix",
    sortSavings: "Més estalvi",
    empty: "No hi ha anuncis que hi encaixin. Prova-ho a ses webs de davall o amb una altra descripció.",
    alsoSearch: "Cerca també «{query}» a",
    resultsFrom: { one: "Resultats d'una plataforma", other: "Resultats de {n} plataformes" },
    unavailable: ". No hem pogut consultar {list}",
    sponsored: "Patrocinat",
    youSave: "Estalvies {amount}",
    exact: "Es mateix producte",
    similar: "Alternativa semblant",
  },

  platformsPage: {
    title: "{n} webs.",
    highlight: "Una sola cerca.",
    intro:
      "Alter cerca a ses principals webs de segona mà amb mercat a Espanya. Segons què cerquis, et mostram es seus anuncis o et duim directament a sa seva cerca.",
    inline: "Anuncis a Alter, amb preu i estalvi",
    linked: "T'enllaçam sa seva cerca",
    whatYouFind: "Què hi trobaràs",
    productsIn: "Productes a {name}",
    visit: "Visita {name}",
    finalTitle: "No les has de mirar una per una.",
    finalText: "Aferra un enllaç, puja una foto o descriu-lo, i cercam per tu.",
    finalCta: "Cerca alternatives",
  },

  platformSections: {
    generalistas: {
      title: "Mercats generalistes",
      intro:
        "Webs on es ven de tot: tecnologia, casa, roba, motor, col·leccionisme… Les consultam sigui quin sigui es producte.",
    },
    electronica: {
      title: "Electrònica i reacondicionats",
      intro:
        "Si cerques un mòbil, un portàtil o una consola, també et mostram ets anuncis de Back Market, Refurbed, Amazon Reacondicionados i CeX, i t'enllaçam Rebuy.",
    },
    moda: {
      title: "Moda",
      intro: "Per a roba, sabates i complements. Vinted la consultam sempre; ses altres, quan cerques moda.",
    },
    "libros-musica": { title: "Llibres i música", intro: "Per a lectors i músics." },
    vintage: { title: "Vintage i decoració", intro: "Per a mobles, decoració i peces amb història." },
  },

  platforms: {
    wallapop: {
      description: "S'app de compravenda entre particulars més utilitzada a Espanya.",
      products: ["Mòbils", "Mobles", "Roba", "Bicis", "Motor", "De tot"],
    },
    milanuncios: {
      description: "Anuncis classificats de particulars i professionals de tot Espanya.",
      products: ["Motor", "Casa", "Eines", "Electrònica", "De tot"],
    },
    ebay: {
      description: "Mercat internacional amb molts de venedors a Espanya. Només cercam articles usats.",
      products: ["Electrònica", "Col·leccionisme", "Recanvis", "De tot"],
    },
    cashconverters: {
      description: "Botigues de segona mà amb venda per internet i garantia en es seus productes.",
      products: ["Electrònica", "Joies i rellotges", "Eines", "Instruments"],
    },
    secondbest: {
      description: "Botiga per internet amb articles de segona mà i d'ocasió de moltes de categories.",
      products: ["Casa", "Electrònica", "Diversos"],
    },
    todocoleccion: {
      description: "Es gran mercat espanyol de col·leccionisme, antiguitats i objectes d'època.",
      products: ["Antiguitats", "Col·leccionisme", "Llibres antics", "Art", "Vintage"],
    },
    backmarket: {
      description: "Electrònica reacondicionada per professionals i amb garantia.",
      products: ["Mòbils", "Portàtils", "Tauletes", "Consoles"],
    },
    refurbed: {
      description: "Electrònica reacondicionada, revisada i amb garantia.",
      products: ["Mòbils", "Portàtils", "Tauletes", "Rellotges intel·ligents"],
    },
    amazonrenewed: {
      description: "Productes reacondicionats i revisats que es venen a Amazon.es.",
      products: ["Mòbils", "Portàtils", "Petits electrodomèstics", "Àudio"],
    },
    cex: {
      description: "Compravenda de tecnologia i entreteniment usats, amb botigues físiques a Espanya.",
      products: ["Mòbils", "Consoles", "Videojocs", "Pel·lícules"],
    },
    rebuy: {
      description: "Electrònica i oci de segona mà revisats abans de sa venda.",
      products: ["Mòbils", "Tauletes", "Videojocs", "Llibres"],
    },
    vinted: {
      description: "Compravenda de roba i complements de segona mà entre particulars.",
      products: ["Roba", "Sabates", "Bosses", "Al·lots", "Casa"],
    },
    vestiaire: {
      description: "Moda de luxe i de dissenyador de segona mà, amb verificació d'autenticitat.",
      products: ["Bosses", "Roba de dissenyador", "Sabates", "Joies"],
    },
    percentil: {
      description: "Botiga per internet espanyola de roba de segona mà revisada, també per a al·lots.",
      products: ["Roba", "Complements", "Roba per a al·lots"],
    },
    iberlibro: {
      description: "Llibres usats, antics i descatalogats de llibreries d'Espanya i de tot es món.",
      products: ["Llibres usats", "Primeres edicions", "Descatalogats"],
    },
    reverb: {
      description: "Mercat d'instruments musicals i equip de so nous i usats.",
      products: ["Guitarres", "Teclats", "Amplificadors", "Efectes"],
    },
    etsyvintage: {
      description: "Articles vintage de venedors independents, molts d'ells a Espanya.",
      products: ["Decoració", "Roba vintage", "Joies", "Objectes de col·lecció"],
    },
  },

  footer: {
    tagline: "Es cercador de segona mà: Wallapop, Vinted, eBay i {n} webs més en una sola cerca.",
    label: "Peu de pàgina",
    links: {
      home: "Inici",
      search: "Cercar",
      how: "Com funciona",
      impact: "Impacte",
      faq: "Preguntes freqüents",
    },
    guides: "Guies",
    platforms: "Cercam a",
    platformsLabel: "Webs on cercam",
    allPlatforms: "Guaita ses {n} webs ›",
    disclaimer:
      "Ets anuncis són de cada plataforma i es seus preus poden canviar. Es resultats marcats com a «Patrocinat» surten destacats per un acord comercial amb aquesta plataforma.",
    legalLabel: "Informació legal",
    legal: { "aviso-legal": "Avís legal", privacidad: "Privadesa", cookies: "Galetes" },
  },

  breadcrumbs: {
    label: "Ruta de navegació",
    home: "Inici",
  },

  guides: {
    title: "Guies per comprar de segona mà",
    intro: "Allò que convé revisar abans de pagar, perquè comprar de segona mà sigui igual de bo i segur que comprar nou.",
    readGuide: "Llegeix sa guia · {n} min",
    whereToSearch: "On cercar",
    moreDetails: "Més detalls de cadascuna a [ses {n} webs on cerca Alter](/plataformas).",
    ctaTitle: "Troba-ho a {n} webs alhora",
    ctaText:
      "Aferra s'enllaç d'allò que anaves a comprar nou, puja una foto o descriu-lo. Alter el cerca de segona mà i et diu quant estalvies. De franc.",
    ctaButton: "Cerca de segona mà",
    related: "Altres guies",
  },

  spanishOnly: {
    guide: "Aquesta guia només està en castellà.",
    legal: "Aquest text legal només està en castellà, que és sa versió vàlida.",
  },
};

export default balear;
