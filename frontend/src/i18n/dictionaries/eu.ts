/** Textos de la web en euskera (euskara batua). Mismas claves que es.ts. */
import type { Dictionary } from "./es";

const eu: Dictionary = {
  meta: {
    homeTitle: "Alter · Bigarren eskuko bilatzailea: Wallapop, Vinted, eBay eta gehiago",
    homeDescription:
      "Itsatsi esteka bat, igo argazki bat edo deskribatu: Alterrek produktu hori bigarren eskuan bilatzen du Wallapop, Vinted, Milanuncios, eBay eta beste webgune batzuetan, eta zenbat aurrezten duzun esaten dizu. Doan.",
    tagline: "Bigarren eskua. Lehen aukera.",
    searchTitle: "Bilatu bigarren eskuan esteka, argazki edo testu bidez",
    searchDescription:
      "Itsatsi berria erosi nahi zenuenaren esteka, igo argazki bat edo deskribatu, eta aurkitu bigarren eskuko alternatibak Wallapop, Vinted, Milanuncios, eBay eta beste batzuetan.",
    platformsTitle: "Bigarren eskuko {n} webgune Espainian",
    platformsDescription:
      "Alterrek kontsultatzen dituen bigarren eskuko {n} webguneak: Wallapop, Vinted, Milanuncios, eBay, Back Market, Vestiaire Collective eta gehiago, eta bakoitzean zer aurkituko duzun.",
    guidesTitle: "Bigarren eskuan erosteko gidak",
    guidesDescription:
      "Bigarren eskuan ezustekorik gabe erosteko gida praktikoak, gaztelaniaz: iruzurrak nola saihestu eta zer begiratu mugikor, eramangarri, bizikleta eta altzari erabilietan.",
    ogSubtitle:
      "Itsatsi esteka bat, igo argazki bat edo deskribatu: bigarren eskuko {n} webgunetan bilatzen dugu eta zenbat aurrezten duzun esaten dizugu.",
    organization:
      "Bigarren eskuko bilatzaile doakoa: esteka, argazki edo deskribapen batetik abiatuta, produktua Wallapop, Vinted, Milanuncios edo eBay bezalako {n} webgunetan aurkitzen du, eta berria erostearekin alderatuta zenbat aurrezten duzun kalkulatzen du.",
  },

  and: "eta",

  nav: {
    label: "Nagusia",
    home: "Alter, hasiera",
    search: "Bilatu",
    how: "Nola dabil",
    guides: "Gidak",
  },

  language: {
    label: "Hizkuntza",
    change: "Aldatu hizkuntza",
  },

  hero: {
    eyebrow: "Bigarren eskuko bilatzailea",
    title: "Bigarren eskua.",
    highlight: "Lehen aukera.",
    text: "Itsatsi berria erosi nahi zenuenaren esteka, igo argazki bat edo, besterik gabe, deskribatu. Alterrek bigarren eskuan aurkitzen du eta zenbat aurrezten duzun esaten dizu.",
    cta: "Bilatu alternatibak",
    how: "Nola dabil",
  },

  home: {
    stepsTitle: "Hain erraza.",
    steps: [
      {
        title: "Itsatsi esteka bat,",
        altTitle: "argazki bat edo deskribatu.",
        text: "Berria erosi nahi zenuen dendako esteka, argazki bat edo hitz gutxi batzuk: «larruzko besaulki marroia», «iPhone 13 128 GB»…",
      },
      {
        title: "AAk ulertzen du.",
        text: "Produktua eta haren ezaugarriak ezagutzen ditu, eta bigarren eskuko webgune nagusietan bilatzen du.",
      },
      {
        title: "Zuk aurrezten duzu.",
        text: "Iragarki bakoitzerako esteka zuzenak, haren prezioa eta berria erostearekin alderatuta zenbat aurrezten duzun.",
      },
    ],
    impact:
      "Bigarren eskuan erosten duzun objektu bakoitza fabrikatu, paketatu eta garraiatu behar ez den bat da. Berrerabiltzea berria erostea bezain erraza izan beharko litzateke. Orain, hala da.",
    figures: [
      { eyebrow: "Plataformak", unit: "webgune", label: "bigarren eskukoak, bilaketa bakar batean." },
      { eyebrow: "Prezioa", unit: "€", label: "Alter erabiltzea doakoa da." },
      { eyebrow: "Behar duzuna", unit: "esteka", label: "edo argazki bat, edo hitz batzuk. Besterik ez." },
    ],
    guidesTitle: "Erosi erabilia, ezustekorik gabe.",
    guidesIntro: "Ordaindu aurretik zer begiratu, gida labur eta praktikoetan (gaztelaniaz).",
    readGuide: "Irakurri gida",
    allGuides: "Ikusi gida guztiak",
    finalTitle: "Zure hurrengo erosketa badago jada.",
    finalText: "Aurkitzea besterik ez da falta.",
    finalCta: "Hasi bilatzen",
  },

  faq: {
    title: "Ohiko galderak",
    items: [
      {
        question: "Zer da Alter?",
        answer:
          "Bigarren eskuko bilatzaile doako bat. Berria zer erosi nahi zenuen esaten diozu, esteka, argazki edo hitz batzuen bidez, eta aldi berean {n} webgunetan bilatzen du, hala nola Wallapop, Vinted, Milanuncios edo eBay. Gero, iragarkiak erakusten dizkizu, baita prezio berriarekin alderatuta zenbat aurrezten duzun ere.",
      },
      {
        question: "Zenbat balio du Alter erabiltzeak?",
        answer:
          "Ezer ez: doakoa da eta ez da erregistratu behar. Webgunea publizitatearekin eta plataforma batzuekin egindako akordioekin finantzatzen da; plataforma horien emaitzak «Babestua» gisa markatzen dira.",
      },
      {
        question: "Bigarren eskuko zein webgunetan bilatzen du?",
        answer:
          "{n} webgunetan: {platforms}. Bilatzen duzunaren arabera, haien iragarkiak erakusten dizkizu edo zuzenean haien bilaketara eramaten zaitu. Bakoitzaren xehetasunak [non bilatzen dugun](/plataformas) atalean dituzu.",
      },
      {
        question: "Alterrek saltzen ditu produktuak?",
        answer:
          "Ez. Emaitza bakoitzak argitaratuta dagoen webguneko iragarkira eramaten zaitu, eta erosketa han egiten da, haren baldintzekin eta erosleari ematen dion babesarekin. Ordaindu aurretik, begiratu [bigarren eskuan iruzurrik gabe nola erosi](/guias/comprar-segunda-mano-sin-riesgos) (gaztelaniaz).",
      },
      {
        question: "Nola dabil argazki bidezko bilaketa?",
        answer:
          "Adimen artifizial batek argazkiko objektua ezagutzen du (zer den eta, ikusten bada, marka eta modeloa) eta bigarren eskuko webguneetan bilatzen du. Argazkia bilaketa horretarako bakarrik erabiltzen da eta ez da gordetzen. Xehetasun gehiago [pribatutasun-politikan](/privacidad) (gaztelaniaz).",
      },
      {
        question: "Zergatik erosi bigarren eskuan?",
        answer:
          "Gauza bera askoz merkeago ordaindu ohi duzulako, eta berrerabilitako objektu bakoitza fabrikatu, paketatu eta garraiatu behar ez den bat delako. Egiaztapen egokiekin (gure [gidetan](/guias) dituzu, gaztelaniaz), berria erostea bezain segurua da.",
      },
    ],
  },

  searchPage: {
    title: "Zer erosi nahi zenuen?",
    subtitle: "Bigarren eskuan bilatzen dizugu.",
    platforms: "Bigarren eskuko {n} webgunetan bilatzen dugu.",
    seeWhich: "Ikusi zein",
    guides: "Ezustekorik gabe erosteko gidak",
  },

  search: {
    modesLabel: "Nola bilatu nahi duzu",
    modes: { url: "Esteka", image: "Argazkia", text: "Testua" },
    steps: [
      "Produktua aztertzen…",
      "Wallapop, Milanuncios, Vinted eta eBayn bilatzen…",
      "Iragarki bakoitza jatorrizkoarekin alderatzen…",
      "Zenbat aurrezten duzun kalkulatzen…",
    ],
    urlLabel: "Produktu berriaren esteka",
    urlPlaceholder: "Produktuaren esteka dendan",
    notesLabel: "Aukerako xehetasunak",
    notesPlaceholder: "Aukerako xehetasunak: neurria, kolorea, aurrekontua…",
    photoAlt: "Igotako argazkia",
    removePhoto: "Kendu argazkia",
    dropPhoto: "Arrastatu argazki bat edo aukeratu bat",
    photoFormats: "JPG, PNG edo WEBP · 5 MB arte",
    descriptionLabel: "Objektuaren deskribapena",
    descriptionPlaceholder: "Deskribatu nahi baduzu: marka, materialak, neurriak…",
    priceLabel: "Prezio berria eurotan",
    pricePlaceholder: "Prezio berria eurotan (aurrezkia kalkulatzeko)",
    priceOptionalPlaceholder: "Prezio berria eurotan (aukerakoa, aurrezkia kalkulatzeko)",
    textLabel: "Deskribatu zer bilatzen duzun",
    textPlaceholder: "Deskribatu zer bilatzen duzun: zer den eta, jakinez gero, marka, modeloa, neurria, kolorea, materialak…",
    textExample: "Adibidez: «larruzko irakurketa-besaulki marroia, estilo nordikoa» edo «Xiaomi Pro 2 patinete elektrikoa».",
    submit: "Bilatu alternatibak",
    searching: "Bilatzen…",
    errors: {
      invalidUrl: "Itsatsi baliozko esteka bat (http:// edo https:// hasierarekin).",
      noPhoto: "Igo objektuaren argazki bat.",
      shortText: "Deskribatu pixka bat gehiago zer bilatzen duzun.",
      badLink: "Ezin dugu esteka hori ireki. Egiaztatu ondo kopiatuta dagoela.",
      imageFormat: "Irudi-formatu hori ez da onartzen. Erabili JPG, PNG, WEBP edo GIF.",
      imageTooBig: "Irudia handiegia da (gehienez 5 MB).",
      describeObject: "Deskribatu objektua bilatu ahal izateko.",
      photosUnavailable: "Une honetan ezin ditugu argazkiak aztertu. Deskribatu objektua eta bilatu berriro.",
      invalid: "Berrikusi datuak: esteka edo irudia ez dira baliozkoak.",
      network: "Ez dago konexiorik Alterren zerbitzariarekin. Saiatu berriro segundo batzuk barru.",
      generic: "Zerbaitek huts egin du. Saiatu berriro.",
    },
  },

  results: {
    label: "Emaitzak",
    newPrice: "{price} berria",
    demo: "Demo modua: webgune bakoitzeko benetako bilaketara eramaten duten adibide-iragarkiak.",
    noAi: "AArik gabe egindako bilaketa: produktuaren azterketa gutxi gorabeherakoa da.",
    maxSavings: "gehieneko aurrezkia",
    alternatives: { one: "alternatiba", other: "alternatiba" },
    lowestPrice: "preziorik baxuena",
    manualPrice: "Zenbat balio du berriak?",
    filterLabel: "Iragazi emaitzak",
    filterAll: "Guztiak",
    filterExact: "Berdinak ({n})",
    filterSimilar: "Antzekoak ({n})",
    sortLabel: "Ordenatu",
    sortRecommended: "Gomendatuak",
    sortCheapest: "Preziorik baxuena",
    sortSavings: "Aurrezki handiena",
    empty: "Ez dago bat datorren iragarkirik. Saiatu beheko webguneetan edo beste deskribapen batekin.",
    alsoSearch: "Bilatu «{query}» hauetan ere:",
    resultsFrom: { one: "Plataforma bateko emaitzak", other: "{n} plataformatako emaitzak" },
    unavailable: ". Ezin izan dugu kontsultatu: {list}",
    sponsored: "Babestua",
    youSave: "Aurrezkia: {amount}",
    exact: "Produktu bera",
    similar: "Antzeko alternatiba",
  },

  platformsPage: {
    title: "{n} webgune.",
    highlight: "Bilaketa bakarra.",
    intro:
      "Alterrek Espainian merkatua duten bigarren eskuko webgune nagusietan bilatzen du. Bilatzen duzunaren arabera, haien iragarkiak erakusten dizkizugu edo zuzenean haien bilaketara eramaten zaitugu.",
    inline: "Iragarkiak Alterren, prezioarekin eta aurrezkiarekin",
    linked: "Haien bilaketaren esteka ematen dizugu",
    whatYouFind: "Zer aurkituko duzu",
    productsIn: "Produktuak: {name}",
    visit: "Bisitatu {name}",
    finalTitle: "Ez dituzu banan-banan begiratu behar.",
    finalText: "Itsatsi esteka bat, igo argazki bat edo deskribatu, eta zuregatik bilatzen dugu.",
    finalCta: "Bilatu alternatibak",
  },

  platformSections: {
    generalistas: {
      title: "Merkatu orokorrak",
      intro:
        "Denetarik saltzen den webguneak: teknologia, etxea, arropa, motorra, bildumazaletasuna… Produktua edozein dela ere, kontsultatzen ditugu.",
    },
    electronica: {
      title: "Elektronika eta berrituak",
      intro:
        "Mugikor, eramangarri edo kontsola bat bilatzen baduzu, Back Market, Refurbed, Amazon Reacondicionados eta CeX-en iragarkiak ere erakusten dizkizugu, eta Rebuyren esteka ematen dizugu.",
    },
    moda: {
      title: "Moda",
      intro: "Arropa, oinetakoak eta osagarriak bilatzeko. Vinted beti kontsultatzen dugu; besteak, moda bilatzen duzunean.",
    },
    "libros-musica": { title: "Liburuak eta musika", intro: "Irakurle eta musikarientzat." },
    vintage: { title: "Vintage eta dekorazioa", intro: "Altzari, dekorazio eta historia duten piezetarako." },
  },

  platforms: {
    wallapop: {
      description: "Espainian partikularren arteko salerosketarako app erabiliena.",
      products: ["Mugikorrak", "Altzariak", "Arropa", "Bizikletak", "Motorra", "Denetarik"],
    },
    milanuncios: {
      description: "Espainia osoko partikularren eta profesionalen iragarki sailkatuak.",
      products: ["Motorra", "Etxea", "Erremintak", "Elektronika", "Denetarik"],
    },
    ebay: {
      description: "Nazioarteko merkatua, Espainian saltzaile asko dituena. Erabilitako artikuluak bakarrik bilatzen ditugu.",
      products: ["Elektronika", "Bildumak", "Ordezko piezak", "Denetarik"],
    },
    cashconverters: {
      description: "Bigarren eskuko dendak, online salmenta eta produktuetan bermea dutenak.",
      products: ["Elektronika", "Bitxiak eta erlojuak", "Erremintak", "Musika-tresnak"],
    },
    secondbest: {
      description: "Kategoria askotako bigarren eskuko eta okasioko artikuluak dituen online denda.",
      products: ["Etxea", "Elektronika", "Askotarikoak"],
    },
    todocoleccion: {
      description: "Bildumazaletasunaren, antzinatasunen eta garai bateko objektuen Espainiako merkatu handia.",
      products: ["Antzinatasunak", "Bildumak", "Liburu zaharrak", "Artea", "Vintage"],
    },
    backmarket: {
      description: "Profesionalek berritutako elektronika, bermearekin.",
      products: ["Mugikorrak", "Eramangarriak", "Tabletak", "Kontsolak"],
    },
    refurbed: {
      description: "Elektronika berritua, berrikusia eta bermeduna.",
      products: ["Mugikorrak", "Eramangarriak", "Tabletak", "Erloju adimendunak"],
    },
    amazonrenewed: {
      description: "Amazon.es-en saltzen diren produktu berrituak eta berrikusiak.",
      products: ["Mugikorrak", "Eramangarriak", "Etxetresna txikiak", "Audioa"],
    },
    cex: {
      description: "Erabilitako teknologia eta aisialdiaren salerosketa, Espainian denda fisikoak dituena.",
      products: ["Mugikorrak", "Kontsolak", "Bideojokoak", "Filmak"],
    },
    rebuy: {
      description: "Saldu aurretik berrikusitako bigarren eskuko elektronika eta aisialdia.",
      products: ["Mugikorrak", "Tabletak", "Bideojokoak", "Liburuak"],
    },
    vinted: {
      description: "Partikularren arteko bigarren eskuko arropa eta osagarrien salerosketa.",
      products: ["Arropa", "Oinetakoak", "Poltsak", "Haurrentzat", "Etxea"],
    },
    vestiaire: {
      description: "Bigarren eskuko luxuzko eta diseinatzaileen moda, benetakotasuna egiaztatuta.",
      products: ["Poltsak", "Diseinatzaileen arropa", "Oinetakoak", "Bitxiak"],
    },
    percentil: {
      description: "Berrikusitako bigarren eskuko arropa saltzen duen Espainiako online denda, haurrentzakoa ere bai.",
      products: ["Arropa", "Osagarriak", "Haur-arropa"],
    },
    iberlibro: {
      description: "Espainiako eta mundu osoko liburu-dendetako liburu erabiliak, zaharrak eta katalogoz kanpokoak.",
      products: ["Liburu erabiliak", "Lehen argitalpenak", "Katalogoz kanpokoak"],
    },
    reverb: {
      description: "Musika-tresna eta soinu-ekipo berri eta erabilien merkatua.",
      products: ["Gitarrak", "Teklatuak", "Anplifikadoreak", "Efektuak"],
    },
    etsyvintage: {
      description: "Saltzaile independenteen vintage artikuluak, asko Espainian.",
      products: ["Dekorazioa", "Vintage arropa", "Bitxiak", "Bilduma-objektuak"],
    },
  },

  footer: {
    tagline: "Bigarren eskuko bilatzailea: Wallapop, Vinted, eBay eta beste {n} webgune, bilaketa bakar batean.",
    label: "Orri-oina",
    links: {
      home: "Hasiera",
      search: "Bilatu",
      how: "Nola dabil",
      impact: "Eragina",
      faq: "Ohiko galderak",
    },
    guides: "Gidak",
    platforms: "Plataformak",
    platformsLabel: "Bilaketak egiten ditugun webguneak",
    allPlatforms: "Ikusi {n} webguneak ›",
    disclaimer:
      "Iragarkiak plataforma bakoitzarenak dira eta haien prezioak alda daitezke. «Babestua» gisa markatutako emaitzak plataforma horrekin egindako akordio komertzial bati esker agertzen dira nabarmenduta.",
    legalLabel: "Lege-informazioa",
    legal: { "aviso-legal": "Lege-oharra", privacidad: "Pribatutasuna", cookies: "Cookieak" },
  },

  breadcrumbs: {
    label: "Nabigazio-bidea",
    home: "Hasiera",
  },

  guides: {
    title: "Bigarren eskuan erosteko gidak",
    intro: "Ordaindu aurretik begiratu beharrekoa, erabilia erostea berria erostea bezain erraza eta segurua izan dadin.",
    readGuide: "Irakurri gida · {n} min",
    whereToSearch: "Non bilatu",
    moreDetails: "Bakoitzaren xehetasun gehiago: [Alterrek kontsultatzen dituen {n} webguneak](/plataformas).",
    ctaTitle: "Aurkitu {n} webgunetan aldi berean",
    ctaText:
      "Itsatsi berria erosi nahi zenuenaren esteka, igo argazki bat edo deskribatu. Alterrek bigarren eskuan bilatzen du eta zenbat aurrezten duzun esaten dizu. Doan.",
    ctaButton: "Bilatu bigarren eskuan",
    related: "Beste gida batzuk",
  },

  spanishOnly: {
    guide: "Gida hau gaztelaniaz bakarrik dago eskuragarri.",
    legal: "Lege-testu hau gaztelaniaz bakarrik dago eskuragarri, eta hori da baliozko bertsioa.",
  },
};

export default eu;
