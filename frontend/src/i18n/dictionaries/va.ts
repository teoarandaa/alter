/** Textos de la web en valenciano (norma de l'Acadèmia Valenciana de la Llengua). Mismas claves que es.ts. */
import type { Dictionary } from "./es";

const va: Dictionary = {
  meta: {
    homeTitle: "Alter · Buscador de segona mà: Wallapop, Vinted, eBay i més",
    homeDescription:
      "Apega un enllaç, puja una foto o descriu-lo: Alter busca eixe producte de segona mà en Wallapop, Vinted, Milanuncios, eBay i més webs, i et diu quant estalvies. Gratis.",
    tagline: "Segona mà. Primera opció.",
    searchTitle: "Busca de segona mà per enllaç, foto o text",
    searchDescription:
      "Apega l'enllaç del que anaves a comprar nou, puja una foto o descriu-lo i troba alternatives de segona mà en Wallapop, Vinted, Milanuncios, eBay i més.",
    platformsTitle: "{n} webs de segona mà a Espanya",
    platformsDescription:
      "Les {n} webs de segona mà en què busca Alter: Wallapop, Vinted, Milanuncios, eBay, Back Market, Vestiaire Collective i més, i què hi trobaràs en cadascuna.",
    guidesTitle: "Guies per a comprar de segona mà",
    guidesDescription:
      "Guies pràctiques, en castellà, per a comprar de segona mà sense sorpreses: com evitar estafes i què cal revisar en mòbils, portàtils, bicicletes i mobles usats.",
    ogSubtitle:
      "Apega un enllaç, puja una foto o descriu-lo: el busquem en {n} webs de segona mà i et diem quant estalvies.",
    organization:
      "Buscador gratuït de segona mà: a partir d'un enllaç, una foto o una descripció, troba el producte en {n} webs com Wallapop, Vinted, Milanuncios o eBay i calcula quant estalvies respecte de comprar-lo nou.",
  },

  and: "i",

  nav: {
    label: "Principal",
    home: "Alter, inici",
    search: "Buscar",
    how: "Com funciona",
    guides: "Guies",
  },

  language: {
    label: "Idioma",
    change: "Canvia l'idioma",
  },

  hero: {
    eyebrow: "El buscador de segona mà",
    title: "Segona mà.",
    highlight: "Primera opció.",
    text: "Apega l'enllaç del que anaves a comprar nou, puja una foto o simplement descriu-lo. Alter el troba de segona mà i et diu quant estalvies.",
    cta: "Busca alternatives",
    how: "Com funciona",
  },

  home: {
    stepsTitle: "Així de fàcil.",
    steps: [
      {
        title: "Apega un enllaç,",
        altTitle: "una foto o descriu-lo.",
        text: "L'enllaç de la botiga on l'anaves a comprar nou, una foto o unes quantes paraules: «butaca de pell marró», «iPhone 13 128 GB»…",
      },
      {
        title: "La IA ho entén.",
        text: "Reconeix el producte i les seues característiques, i el busca en les principals webs de segona mà.",
      },
      {
        title: "Tu estalvies.",
        text: "Enllaços directes a cada anunci, el seu preu i quant t'estalvies respecte de comprar-lo nou.",
      },
    ],
    impact:
      "Cada objecte que compres de segona mà és un objecte que no cal fabricar, empaquetar ni transportar. Reutilitzar hauria de ser tan fàcil com comprar nou. Ara ho és.",
    figures: [
      { eyebrow: "Plataformes", unit: "webs", label: "de segona mà en una sola busca." },
      { eyebrow: "Preu", unit: "€", label: "Usar Alter és gratis." },
      { eyebrow: "El que necessites", unit: "enllaç", label: "o una foto, o unes paraules. Res més." },
    ],
    guidesTitle: "Compra de segona mà sense sorpreses.",
    guidesIntro: "Què cal revisar abans de pagar, en guies curtes i pràctiques (en castellà).",
    readGuide: "Llig la guia",
    allGuides: "Mira totes les guies",
    finalTitle: "La teua pròxima compra ja existix.",
    finalText: "Només cal trobar-la.",
    finalCta: "Comença a buscar",
  },

  faq: {
    title: "Preguntes freqüents",
    items: [
      {
        question: "Què és Alter?",
        answer:
          "Un buscador de segona mà gratuït. Li dius què anaves a comprar nou, amb un enllaç, una foto o unes paraules, i el busca a la vegada en {n} webs com Wallapop, Vinted, Milanuncios o eBay. Després et mostra els anuncis i quant estalvies respecte del preu nou.",
      },
      {
        question: "Quant costa usar Alter?",
        answer:
          "Res: és gratis i no cal registrar-se. La web es finança amb publicitat i amb acords amb algunes plataformes, els resultats de les quals es marquen com a «Patrocinat».",
      },
      {
        question: "En quines webs de segona mà busca?",
        answer:
          "En {n}: {platforms}. Segons el que busques, et mostra els seus anuncis o et porta directament a la seua busca. Tens el detall de cadascuna en [on busquem](/plataformas).",
      },
      {
        question: "Alter ven els productes?",
        answer:
          "No. Cada resultat et porta a l'anunci en la web on està publicat, i la compra es fa allí, amb les seues condicions i la seua protecció al comprador. Abans de pagar, dona una ullada a [com comprar de segona mà sense que t'estafen](/guias/comprar-segunda-mano-sin-riesgos) (en castellà).",
      },
      {
        question: "Com funciona la busca per foto?",
        answer:
          "Una intel·ligència artificial reconeix l'objecte de la foto (què és i, si es veu, la marca i el model) i el busca en les webs de segona mà. La foto només s'usa per a eixa busca i no es guarda. Més detalls en la [política de privacitat](/privacidad) (en castellà).",
      },
      {
        question: "Per què comprar de segona mà?",
        answer:
          "Perquè sovint pagues prou menys pel mateix i perquè cada objecte reutilitzat és un objecte que no cal fabricar, empaquetar ni transportar. Amb les comprovacions adequades, com les de les nostres [guies](/guias) (en castellà), és igual de segur que comprar nou.",
      },
    ],
  },

  searchPage: {
    title: "Què anaves a comprar?",
    subtitle: "El busquem de segona mà per tu.",
    platforms: "Busquem en {n} webs de segona mà.",
    seeWhich: "Mira quines",
    guides: "Guies per a comprar sense sorpreses",
  },

  search: {
    modesLabel: "Com vols buscar",
    modes: { url: "Enllaç", image: "Foto", text: "Text" },
    steps: [
      "Analitzant el producte…",
      "Buscant en Wallapop, Milanuncios, Vinted i eBay…",
      "Comparant cada anunci amb l'original…",
      "Calculant quant estalvies…",
    ],
    urlLabel: "Enllaç del producte nou",
    urlPlaceholder: "Enllaç del producte en la botiga",
    notesLabel: "Detalls opcionals",
    notesPlaceholder: "Detalls opcionals: talla, color, pressupost…",
    photoAlt: "Foto pujada",
    removePhoto: "Lleva la foto",
    dropPhoto: "Arrossega una foto o tria'n una",
    photoFormats: "JPG, PNG o WEBP · fins a 5 MB",
    descriptionLabel: "Descripció de l'objecte",
    descriptionPlaceholder: "Descriu-lo si vols: marca, materials, mesures…",
    priceLabel: "Preu nou en euros",
    pricePlaceholder: "Preu nou en € (per a calcular l'estalvi)",
    priceOptionalPlaceholder: "Preu nou en € (opcional, per a calcular l'estalvi)",
    textLabel: "Descriu el que busques",
    textPlaceholder: "Descriu el que busques: què és i, si ho saps, marca, model, talla, color, materials…",
    textExample: "Per exemple: «butaca de lectura de pell marró, estil nòrdic» o «patinet elèctric Xiaomi Pro 2».",
    submit: "Busca alternatives",
    searching: "Buscant…",
    errors: {
      invalidUrl: "Apega un enllaç vàlid (comença per http:// o https://).",
      noPhoto: "Puja una foto de l'objecte.",
      shortText: "Descriu un poc més el que busques.",
      badLink: "No podem obrir eixe enllaç. Comprova que estiga ben copiat.",
      imageFormat: "Format d'imatge no admés. Usa JPG, PNG, WEBP o GIF.",
      imageTooBig: "La imatge és massa gran (màxim 5 MB).",
      describeObject: "Descriu l'objecte per a poder buscar-lo.",
      photosUnavailable: "Ara mateix no podem analitzar fotos. Descriu l'objecte i torna a buscar.",
      invalid: "Revisa les dades: l'enllaç o la imatge no són vàlids.",
      network: "No hi ha connexió amb el servidor d'Alter. Torna a intentar-ho d'ací a uns segons.",
      generic: "Alguna cosa ha fallat. Torna a intentar-ho.",
    },
  },

  results: {
    label: "Resultats",
    newPrice: "{price} nou",
    demo: "Mode demo: anuncis d'exemple que porten a la busca real de cada web.",
    noAi: "Busca feta sense IA: l'anàlisi del producte és aproximada.",
    maxSavings: "d'estalvi màxim",
    alternatives: { one: "alternativa", other: "alternatives" },
    lowestPrice: "el preu més baix",
    manualPrice: "Quant costa nou?",
    filterLabel: "Filtra els resultats",
    filterAll: "Tots",
    filterExact: "Iguals ({n})",
    filterSimilar: "Semblants ({n})",
    sortLabel: "Ordena per",
    sortRecommended: "Recomanats",
    sortCheapest: "Preu més baix",
    sortSavings: "Més estalvi",
    empty: "No hi ha anuncis que encaixen. Prova en les webs de davall o amb una altra descripció.",
    alsoSearch: "Busca també «{query}» en",
    resultsFrom: { one: "Resultats d'una plataforma", other: "Resultats de {n} plataformes" },
    unavailable: ". No hem pogut consultar {list}",
    sponsored: "Patrocinat",
    youSave: "Estalvies {amount}",
    exact: "Mateix producte",
    similar: "Alternativa semblant",
  },

  platformsPage: {
    title: "{n} webs.",
    highlight: "Una sola busca.",
    intro:
      "Alter busca en les principals webs de segona mà amb mercat a Espanya. Segons el que busques, et mostrem els seus anuncis o et portem directament a la seua busca.",
    inline: "Anuncis en Alter, amb preu i estalvi",
    linked: "T'enllacem la seua busca",
    whatYouFind: "Què hi trobaràs",
    productsIn: "Productes en {name}",
    visit: "Visita {name}",
    finalTitle: "No cal que les mires una per una.",
    finalText: "Apega un enllaç, puja una foto o descriu-lo, i busquem per tu.",
    finalCta: "Busca alternatives",
  },

  platformSections: {
    generalistas: {
      title: "Mercats generalistes",
      intro:
        "Webs on es ven de tot a la vegada: tecnologia, casa, roba, motor, col·leccionisme… Les consultem siga quin siga el producte.",
    },
    electronica: {
      title: "Electrònica i reacondicionats",
      intro:
        "Si busques un mòbil, un portàtil o una consola, també et mostrem els anuncis de Back Market, Refurbed, Amazon Reacondicionados i CeX, i t'enllacem Rebuy.",
    },
    moda: {
      title: "Moda",
      intro: "Per a roba, calçat i complements. Vinted la consultem sempre; les altres, quan busques moda.",
    },
    "libros-musica": { title: "Llibres i música", intro: "Per a lectors i músics." },
    vintage: { title: "Vintage i decoració", intro: "Per a mobles, decoració i peces amb història." },
  },

  platforms: {
    wallapop: {
      description: "L'app de compravenda entre particulars més utilitzada a Espanya.",
      products: ["Mòbils", "Mobles", "Roba", "Bicis", "Motor", "De tot"],
    },
    milanuncios: {
      description: "Anuncis classificats de particulars i professionals de tota Espanya.",
      products: ["Motor", "Casa", "Ferramentes", "Electrònica", "De tot"],
    },
    ebay: {
      description: "Mercat internacional amb molts venedors a Espanya. Només busquem articles usats.",
      products: ["Electrònica", "Col·leccionisme", "Recanvis", "De tot"],
    },
    cashconverters: {
      description: "Botigues de segona mà amb venda en línia i garantia en els seus productes.",
      products: ["Electrònica", "Joies i rellotges", "Ferramentes", "Instruments"],
    },
    secondbest: {
      description: "Botiga en línia amb articles de segona mà i d'ocasió de moltes categories.",
      products: ["Casa", "Electrònica", "Diversos"],
    },
    todocoleccion: {
      description: "El gran mercat espanyol de col·leccionisme, antiguitats i objectes d'època.",
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
      description: "Productes reacondicionats i revisats que es venen en Amazon.es.",
      products: ["Mòbils", "Portàtils", "Petits electrodomèstics", "Àudio"],
    },
    cex: {
      description: "Compravenda de tecnologia i entreteniment usats, amb botigues físiques a Espanya.",
      products: ["Mòbils", "Consoles", "Videojocs", "Pel·lícules"],
    },
    rebuy: {
      description: "Electrònica i oci de segona mà revisats abans de la venda.",
      products: ["Mòbils", "Tauletes", "Videojocs", "Llibres"],
    },
    vinted: {
      description: "Compravenda de roba i complements de segona mà entre particulars.",
      products: ["Roba", "Calçat", "Bosses", "Xiquets", "Casa"],
    },
    vestiaire: {
      description: "Moda de luxe i de dissenyador de segona mà, amb verificació d'autenticitat.",
      products: ["Bosses", "Roba de dissenyador", "Calçat", "Joies"],
    },
    percentil: {
      description: "Botiga en línia espanyola de roba de segona mà revisada, també per a xiquets.",
      products: ["Roba", "Complements", "Roba de xiquets"],
    },
    iberlibro: {
      description: "Llibres usats, antics i descatalogats de llibreries d'Espanya i de tot el món.",
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
    tagline: "El buscador de segona mà: Wallapop, Vinted, eBay i {n} webs més en una sola busca.",
    label: "Peu de pàgina",
    links: {
      home: "Inici",
      search: "Buscar",
      how: "Com funciona",
      impact: "Impacte",
      faq: "Preguntes freqüents",
    },
    guides: "Guies",
    platforms: "Busquem en",
    platformsLabel: "Webs en què busquem",
    allPlatforms: "Mira les {n} webs ›",
    disclaimer:
      "Els anuncis pertanyen a cada plataforma i els seus preus poden canviar. Els resultats marcats com a «Patrocinat» apareixen destacats per un acord comercial amb eixa plataforma.",
    legalLabel: "Informació legal",
    legal: { "aviso-legal": "Avís legal", privacidad: "Privacitat", cookies: "Galetes" },
  },

  breadcrumbs: {
    label: "Ruta de navegació",
    home: "Inici",
  },

  guides: {
    title: "Guies per a comprar de segona mà",
    intro: "El que convé revisar abans de pagar, perquè comprar de segona mà siga igual de fàcil i segur que comprar nou.",
    readGuide: "Llig la guia · {n} min",
    whereToSearch: "On buscar",
    moreDetails: "Més detalls de cadascuna en [les {n} webs on busca Alter](/plataformas).",
    ctaTitle: "Troba-ho en {n} webs a la vegada",
    ctaText:
      "Apega l'enllaç del que anaves a comprar nou, puja una foto o descriu-lo. Alter el busca de segona mà i et diu quant estalvies. Gratis.",
    ctaButton: "Busca de segona mà",
    related: "Altres guies",
  },

  spanishOnly: {
    guide: "Esta guia només està disponible en castellà.",
    legal: "Este text legal només està disponible en castellà, que és la versió vàlida.",
  },
};

export default va;
