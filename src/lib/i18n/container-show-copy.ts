import type { Locale } from "@/lib/i18n/locales";

export type ContainerShowCopy = {
  kicker: string;
  title: string;
  lead: string;
  brandCaption: string;
  unitsTitle: string;
  unitsLead: string;
  units: [{ name: string; body: string }, { name: string; body: string }, { name: string; body: string }, { name: string; body: string }];
  systemsTitle: string;
  systems: [{ title: string; body: string }, { title: string; body: string }, { title: string; body: string }];
  sitesTitle: string;
  sitesLead: string;
  sitesThreeCaption: string;
  sitesFourCaption: string;
  homeKicker: string;
  homeTitle: string;
  homeLead: string;
  homeCta: string;
  footerKicker: string;
  footerTitle: string;
  footerLead: string;
  footerCta: string;
};

const en: ContainerShowCopy = {
  kicker: "AGRON · StarDome",
  title: "AGRON containers. StarDome systems.",
  lead:
    "AGRON is the steel — the box on a quay, a deck, an island road, or a van. StarDome is the system inside: the same watch picture as AGRON 1, on hardware you can put where the sensors have to live.",
  brandCaption: "AGRON and StarDome by AGRON — maritime intelligence, real protection.",
  unitsTitle: "The box, in the finish the site needs",
  unitsLead: "One family. Paint and size change for harbour, island, quay, and deck.",
  units: [
    {
      name: "Harbour — black",
      body: "StarDome by AGRON on a working quay. Antennas and cameras up. Built to sit in salt and floodlight.",
    },
    {
      name: "Island — sand",
      body: "The same box in a quiet finish, beside a villa. Protection without looking like cargo.",
    },
    {
      name: "Quay — white",
      body: "White hull, black and gold stripe. Reads as kit on a port apron, not a freight container.",
    },
    {
      name: "Deck — compact",
      body: "A smaller AGRON shelter on a working ship. Same mark, smaller footprint.",
    },
  ],
  systemsTitle: "What StarDome does in the box",
  systems: [
    {
      title: "Detect",
      body: "Radar, cameras, RF and sonar ride on the AGRON container. They feed StarWall — they do not invent a contact.",
    },
    {
      title: "One picture",
      body: "StarDome puts those feeds on one clock. AGRON 1 is the watch if you want the screen without the steel.",
    },
    {
      title: "Respond",
      body: "Some tiers carry a response bay. A person authorizes it. The box does not fire itself, and local law still applies.",
    },
  ],
  sitesTitle: "Where AGRON sits",
  sitesLead: "Marina, port, private island — or a van when the site is only there for a few days.",
  sitesThreeCaption:
    "AGRON shelters for marina, commercial port, and private island — compact nodes, not a 20-foot box on every lawn.",
  sitesFourCaption:
    "The same family as a mobile unit: rack in a van when the job is temporary.",
  homeKicker: "AGRON containers",
  homeTitle: "The steel box, and the StarDome system inside",
  homeLead:
    "Harbour, island, quay, deck, or a van. StarWall runs in the AGRON container. The show set is on the containers page.",
  homeCta: "AGRON containers and StarDome systems →",
  footerKicker: "AGRON · StarDome",
  footerTitle: "The steel on the site. The system inside.",
  footerLead: "Harbour, island, quay, deck, or a van.",
  footerCta: "AGRON containers →",
};

const ru: ContainerShowCopy = {
  kicker: "AGRON · StarDome",
  title: "Контейнеры AGRON. Системы StarDome.",
  lead:
    "AGRON — это сталь: ящик на пирсе, на палубе, на островной дороге или в фургоне. StarDome — система внутри: та же картина вахты, что на AGRON 1, на железе, которое ставят туда, где должны жить датчики.",
  brandCaption: "AGRON и StarDome by AGRON — морской интеллект, реальная защита.",
  unitsTitle: "Ящик в окраске, которую просит площадка",
  unitsLead: "Одно семейство. Краска и размер — под гавань, остров, причал и палубу.",
  units: [
    {
      name: "Гавань — чёрный",
      body: "StarDome by AGRON на рабочем пирсе. Антенны и камеры подняты. Соль и прожектор — расчётная среда.",
    },
    {
      name: "Остров — песок",
      body: "Тот же ящик в тихой окраске, у виллы. Защита без вида грузового контейнера.",
    },
    {
      name: "Причал — белый",
      body: "Белый корпус, чёрно-золотая полоса. На фартуке порта читается как техника, не как тара.",
    },
    {
      name: "Палуба — компакт",
      body: "Меньшее укрытие AGRON на рабочей палубе. Та же марка, меньше след.",
    },
  ],
  systemsTitle: "Что StarDome делает в ящике",
  systems: [
    {
      title: "Обнаружение",
      body: "Радар, камеры, радио и сонар стоят на контейнере AGRON. Кормят StarWall — контакт сами не выдумывают.",
    },
    {
      title: "Одна картина",
      body: "StarDome сводит эти потоки на одни часы. AGRON 1 — вахта, если нужен экран без стали.",
    },
    {
      title: "Реакция",
      body: "На части уровней есть отсек реагирования. Человек разрешает. Ящик сам не стреляет, местное право остаётся.",
    },
  ],
  sitesTitle: "Куда ставят AGRON",
  sitesLead: "Марина, порт, частный остров — или фургон, если площадка на несколько дней.",
  sitesThreeCaption:
    "Укрытия AGRON для марины, коммерческого порта и частного острова — компактные узлы, не двадцатифутовый ящик на каждой лужайке.",
  sitesFourCaption: "То же семейство в мобильном виде: стойка в фургоне, когда работа временная.",
  homeKicker: "Контейнеры AGRON",
  homeTitle: "Стальной ящик и система StarDome внутри",
  homeLead:
    "Гавань, остров, причал, палуба или фургон. StarWall крутится в контейнере AGRON. Показ — на странице контейнеров.",
  homeCta: "Контейнеры AGRON и системы StarDome →",
  footerKicker: "AGRON · StarDome",
  footerTitle: "Сталь на площадке. Система внутри.",
  footerLead: "Гавань, остров, причал, палуба или фургон.",
  footerCta: "Контейнеры AGRON →",
};

const uk: ContainerShowCopy = {
  kicker: "AGRON · StarDome",
  title: "Контейнери AGRON. Системи StarDome.",
  lead:
    "AGRON — це сталь: ящик на пірсі, на палубі, на острівній дорозі чи у фургоні. StarDome — система всередині: та сама картина вахти, що на AGRON 1, на залозі, яке ставлять туди, де мають жити датчики.",
  brandCaption: "AGRON і StarDome by AGRON — морський інтелект, реальний захист.",
  unitsTitle: "Ящик в окрасці, якої просить майданчик",
  unitsLead: "Одна родина. Фарба і розмір — під гавань, острів, причал і палубу.",
  units: [
    {
      name: "Гавань — чорний",
      body: "StarDome by AGRON на робочому пірсі. Антени й камери підняті. Сіль і прожектор — розрахункове середовище.",
    },
    {
      name: "Острів — пісок",
      body: "Той самий ящик у тихій окрасці, біля вілли. Захист без вигляду вантажного контейнера.",
    },
    {
      name: "Причал — білий",
      body: "Білий корпус, чорно-золота смуга. На фартусі порту читається як техніка, не як тара.",
    },
    {
      name: "Палуба — компакт",
      body: "Менше укриття AGRON на робочій палубі. Та сама марка, менший слід.",
    },
  ],
  systemsTitle: "Що StarDome робить у ящику",
  systems: [
    {
      title: "Виявлення",
      body: "Радар, камери, радіо і сонар стоять на контейнері AGRON. Живлять StarWall — контакт самі не вигадують.",
    },
    {
      title: "Одна картина",
      body: "StarDome зводить ці потоки на один годинник. AGRON 1 — вахта, якщо потрібен екран без сталі.",
    },
    {
      title: "Реакція",
      body: "На частині рівнів є відсік реагування. Людина дозволяє. Ящик сам не стріляє, місцеве право лишається.",
    },
  ],
  sitesTitle: "Куди ставлять AGRON",
  sitesLead: "Марина, порт, приватний острів — або фургон, якщо майданчик на кілька днів.",
  sitesThreeCaption:
    "Укриття AGRON для марини, комерційного порту та приватного острова — компактні вузли, не двадцятифутовий ящик на кожній галявині.",
  sitesFourCaption: "Та сама родина в мобільному вигляді: стійка у фургоні, коли робота тимчасова.",
  homeKicker: "Контейнери AGRON",
  homeTitle: "Сталевий ящик і система StarDome всередині",
  homeLead:
    "Гавань, острів, причал, палуба чи фургон. StarWall крутиться в контейнері AGRON. Показ — на сторінці контейнерів.",
  homeCta: "Контейнери AGRON і системи StarDome →",
  footerKicker: "AGRON · StarDome",
  footerTitle: "Сталь на майданчику. Система всередині.",
  footerLead: "Гавань, острів, причал, палуба чи фургон.",
  footerCta: "Контейнери AGRON →",
};

const de: ContainerShowCopy = {
  kicker: "AGRON · StarDome",
  title: "AGRON-Container. StarDome-Systeme.",
  lead:
    "AGRON ist der Stahl — der Kasten an Kai, Deck, Inselstraße oder im Van. StarDome ist das System darin: dasselbe Wachbild wie AGRON 1, auf Hardware, die dorthin kommt, wo die Sensoren stehen müssen.",
  brandCaption: "AGRON und StarDome by AGRON — maritime Intelligenz, echter Schutz.",
  unitsTitle: "Der Kasten in der Farbe, die der Ort verlangt",
  unitsLead: "Eine Familie. Lack und Maß für Hafen, Insel, Kai und Deck.",
  units: [
    {
      name: "Hafen — schwarz",
      body: "StarDome by AGRON am Arbeitkai. Antennen und Kameras oben. Salz und Flutlicht sind eingeplant.",
    },
    {
      name: "Insel — Sand",
      body: "Derselbe Kasten in ruhiger Farbe neben einer Villa. Schutz ohne Frachtoptik.",
    },
    {
      name: "Kai — weiß",
      body: "Weißer Rumpf, schwarz-goldener Streifen. Wirkt auf der Kaifläche wie Gerät, nicht wie ein Frachtcontainer.",
    },
    {
      name: "Deck — kompakt",
      body: "Kleineres AGRON-Gehäuse auf einem Arbeitsschiff. Dieselbe Marke, kleinerer Fußabdruck.",
    },
  ],
  systemsTitle: "Was StarDome im Kasten tut",
  systems: [
    {
      title: "Erfassen",
      body: "Radar, Kameras, Funk und Sonar sitzen auf dem AGRON-Container. Sie speisen StarWall — sie erfinden keinen Kontakt.",
    },
    {
      title: "Ein Lagebild",
      body: "StarDome legt diese Feeds auf eine Uhr. AGRON 1 ist die Wache, wenn Sie den Schirm ohne Stahl wollen.",
    },
    {
      title: "Reagieren",
      body: "Manche Stufen tragen eine Wirkbucht. Ein Mensch gibt frei. Der Kasten schießt nicht selbst, örtliches Recht bleibt.",
    },
  ],
  sitesTitle: "Wohin AGRON kommt",
  sitesLead: "Marina, Hafen, Privatinsel — oder ein Van, wenn der Ort nur ein paar Tage da ist.",
  sitesThreeCaption:
    "AGRON-Gehäuse für Marina, Handelshafen und Privatinsel — kompakte Knoten, nicht überall ein 20-Fuß-Kasten.",
  sitesFourCaption: "Dieselbe Familie mobil: Gestell im Van, wenn der Einsatz vorübergehend ist.",
  homeKicker: "AGRON-Container",
  homeTitle: "Der Stahlkasten und das StarDome-System darin",
  homeLead:
    "Hafen, Insel, Kai, Deck oder Van. StarWall läuft im AGRON-Container. Der Schausatz steht auf der Containerseite.",
  homeCta: "AGRON-Container und StarDome-Systeme →",
  footerKicker: "AGRON · StarDome",
  footerTitle: "Stahl vor Ort. Das System darin.",
  footerLead: "Hafen, Insel, Kai, Deck oder Van.",
  footerCta: "AGRON-Container →",
};

const es: ContainerShowCopy = {
  kicker: "AGRON · StarDome",
  title: "Contenedores AGRON. Sistemas StarDome.",
  lead:
    "AGRON es el acero: la caja en un muelle, una cubierta, un camino de isla o una furgoneta. StarDome es el sistema dentro: la misma imagen de guardia que AGRON 1, en el hardware que se pone donde tienen que vivir los sensores.",
  brandCaption: "AGRON y StarDome by AGRON — inteligencia marítima, protección real.",
  unitsTitle: "La caja, en el acabado que pide el sitio",
  unitsLead: "Una familia. Pintura y tamaño para puerto, isla, muelle y cubierta.",
  units: [
    {
      name: "Puerto — negro",
      body: "StarDome by AGRON en un muelle de trabajo. Antenas y cámaras arriba. Sal y focos son el entorno previsto.",
    },
    {
      name: "Isla — arena",
      body: "La misma caja en un acabado discreto, junto a una villa. Protección sin aspecto de carga.",
    },
    {
      name: "Muelle — blanco",
      body: "Casco blanco, franja negra y oro. En el muelle se lee como equipo, no como contenedor de flete.",
    },
    {
      name: "Cubierta — compacto",
      body: "Un refugio AGRON más pequeño en un buque de trabajo. Misma marca, menor huella.",
    },
  ],
  systemsTitle: "Qué hace StarDome en la caja",
  systems: [
    {
      title: "Detectar",
      body: "Radar, cámaras, RF y sónar van en el contenedor AGRON. Alimentan StarWall; no inventan un contacto.",
    },
    {
      title: "Una imagen",
      body: "StarDome pone esos flujos en un solo reloj. AGRON 1 es la guardia si quiere la pantalla sin el acero.",
    },
    {
      title: "Responder",
      body: "Algunos niveles llevan bahía de respuesta. Una persona autoriza. La caja no dispara sola; rige la ley local.",
    },
  ],
  sitesTitle: "Dónde se coloca AGRON",
  sitesLead: "Marina, puerto, isla privada — o una furgoneta si el sitio dura unos días.",
  sitesThreeCaption:
    "Refugios AGRON para marina, puerto comercial e isla privada: nodos compactos, no un contenedor de 20 pies en cada césped.",
  sitesFourCaption: "La misma familia en móvil: rack en una furgoneta cuando el trabajo es temporal.",
  homeKicker: "Contenedores AGRON",
  homeTitle: "La caja de acero y el sistema StarDome dentro",
  homeLead:
    "Puerto, isla, muelle, cubierta o furgoneta. StarWall corre en el contenedor AGRON. El set de muestra está en la página de contenedores.",
  homeCta: "Contenedores AGRON y sistemas StarDome →",
  footerKicker: "AGRON · StarDome",
  footerTitle: "El acero en el sitio. El sistema dentro.",
  footerLead: "Puerto, isla, muelle, cubierta o furgoneta.",
  footerCta: "Contenedores AGRON →",
};

const fr: ContainerShowCopy = {
  kicker: "AGRON · StarDome",
  title: "Conteneurs AGRON. Systèmes StarDome.",
  lead:
    "AGRON, c'est l'acier : le caisson sur un quai, un pont, une route d'île ou dans un fourgon. StarDome est le système dedans : le même tableau de quart qu'AGRON 1, sur le matériel qu'on pose là où les capteurs doivent vivre.",
  brandCaption: "AGRON et StarDome by AGRON — intelligence maritime, protection réelle.",
  unitsTitle: "Le caisson, dans la teinte que le site demande",
  unitsLead: "Une famille. Peinture et taille pour port, île, quai et pont.",
  units: [
    {
      name: "Port — noir",
      body: "StarDome by AGRON sur un quai de travail. Antennes et caméras levées. Sel et projecteurs sont prévus.",
    },
    {
      name: "Île — sable",
      body: "Le même caisson dans une teinte calme, près d'une villa. Protéger sans l'air d'un fret.",
    },
    {
      name: "Quai — blanc",
      body: "Coque blanche, bande noire et or. Sur le terre-plein, ça se lit comme un équipement, pas une caisse.",
    },
    {
      name: "Pont — compact",
      body: "Un abri AGRON plus petit sur un navire de travail. Même marque, plus petite emprise.",
    },
  ],
  systemsTitle: "Ce que StarDome fait dans le caisson",
  systems: [
    {
      title: "Détecter",
      body: "Radar, caméras, RF et sonar tiennent sur le conteneur AGRON. Ils nourrissent StarWall — ils n'inventent pas un contact.",
    },
    {
      title: "Une image",
      body: "StarDome met ces flux sur une même horloge. AGRON 1 est le quart si vous voulez l'écran sans l'acier.",
    },
    {
      title: "Répondre",
      body: "Certains niveaux portent une baie de réponse. Une personne autorise. Le caisson ne tire pas seul ; le droit local reste.",
    },
  ],
  sitesTitle: "Où poser AGRON",
  sitesLead: "Marina, port, île privée — ou un fourgon si le site ne dure que quelques jours.",
  sitesThreeCaption:
    "Abris AGRON pour marina, port commercial et île privée — nœuds compacts, pas un caisson de 20 pieds sur chaque pelouse.",
  sitesFourCaption: "La même famille en mobile : baie dans un fourgon quand le travail est temporaire.",
  homeKicker: "Conteneurs AGRON",
  homeTitle: "Le caisson d'acier et le système StarDome dedans",
  homeLead:
    "Port, île, quai, pont ou fourgon. StarWall tourne dans le conteneur AGRON. Le jeu de démonstration est sur la page conteneurs.",
  homeCta: "Conteneurs AGRON et systèmes StarDome →",
  footerKicker: "AGRON · StarDome",
  footerTitle: "L'acier sur site. Le système dedans.",
  footerLead: "Port, île, quai, pont ou fourgon.",
  footerCta: "Conteneurs AGRON →",
};

const ar: ContainerShowCopy = {
  kicker: "AGRON · StarDome",
  title: "حاويات AGRON. أنظمة StarDome.",
  lead:
    "AGRON هو الفولاذ: الصندوق على رصيف أو سطح أو طريق جزيرة أو في شاحنة. StarDome هو النظام داخله: نفس صورة النوبة كما في AGRON 1، على عتاد يُوضع حيث يجب أن تعيش المستشعرات.",
  brandCaption: "AGRON وStarDome by AGRON — استخبارات بحرية، حماية حقيقية.",
  unitsTitle: "الصندوق باللون الذي يطلبه الموقع",
  unitsLead: "عائلة واحدة. الطلاء والحجم للميناء والجزيرة والرصيف والسطح.",
  units: [
    {
      name: "الميناء — أسود",
      body: "StarDome by AGRON على رصيف عامل. الهوائيات والكاميرات مرفوعة. الملح والكشافات بيئة محسوبة.",
    },
    {
      name: "الجزيرة — رملي",
      body: "الصندوق نفسه بلون هادئ بجانب فيلا. حماية بلا هيئة شحن.",
    },
    {
      name: "الرصيف — أبيض",
      body: "هيكل أبيض وشريط أسود وذهبي. يُقرأ على ساحة الميناء كعتاد لا كحاوية شحن.",
    },
    {
      name: "السطح — مدمج",
      body: "مأوى AGRON أصغر على سفينة عاملة. العلامة نفسها، أثر أصغر.",
    },
  ],
  systemsTitle: "ماذا يفعل StarDome داخل الصندوق",
  systems: [
    {
      title: "كشف",
      body: "الرادار والكاميرات والترددات والصوت على حاوية AGRON. تغذي StarWall ولا تخترع جهة اتصال.",
    },
    {
      title: "صورة واحدة",
      body: "يضع StarDome هذه التغذيات على ساعة واحدة. AGRON 1 هو النوبة إن أردتم الشاشة بلا فولاذ.",
    },
    {
      title: "استجابة",
      body: "بعض المستويات تحمل حجرة استجابة. يأذن إنسان. الصندوق لا يطلق من تلقاء نفسه، والقانون المحلي يبقى.",
    },
  ],
  sitesTitle: "أين يُوضع AGRON",
  sitesLead: "مرسى أو ميناء أو جزيرة خاصة — أو شاحنة إن دام الموقع أياماً.",
  sitesThreeCaption:
    "مآوي AGRON للمرسى والميناء التجاري والجزيرة الخاصة — عقد مدمجة، لا صندوق عشرين قدماً على كل عشب.",
  sitesFourCaption: "العائلة نفسها متنقلة: رف في شاحنة حين يكون العمل مؤقتاً.",
  homeKicker: "حاويات AGRON",
  homeTitle: "الصندوق الفولاذي ونظام StarDome داخله",
  homeLead:
    "ميناء أو جزيرة أو رصيف أو سطح أو شاحنة. يعمل StarWall داخل حاوية AGRON. مجموعة العرض على صفحة الحاويات.",
  homeCta: "حاويات AGRON وأنظمة StarDome →",
  footerKicker: "AGRON · StarDome",
  footerTitle: "الفولاذ في الموقع. النظام في الداخل.",
  footerLead: "ميناء أو جزيرة أو رصيف أو سطح أو شاحنة.",
  footerCta: "حاويات AGRON →",
};

const zh: ContainerShowCopy = {
  kicker: "AGRON · StarDome",
  title: "AGRON 集装箱。StarDome 系统。",
  lead:
    "AGRON 是钢材：停在码头、甲板、岛路或厢式车上的箱子。StarDome 是箱内的系统：与 AGRON 1 同一幅值班态势，装在传感器必须落地的硬件上。",
  brandCaption: "AGRON 与 StarDome by AGRON — 海上情报，真正的防护。",
  unitsTitle: "按场地需要涂装的箱子",
  unitsLead: "同一系列。油漆与尺寸对应港口、岛屿、码头与甲板。",
  units: [
    {
      name: "港口 — 黑色",
      body: "StarDome by AGRON 停在作业码头。天线与摄像机就位。盐雾与探照灯是设计条件。",
    },
    {
      name: "岛屿 — 沙色",
      body: "同一只箱子，安静涂装，放在别墅旁。防护，但不像货运箱。",
    },
    {
      name: "码头 — 白色",
      body: "白壳、黑金条。在港区坪上看起来是设备，不是货柜。",
    },
    {
      name: "甲板 — 紧凑",
      body: "更小的 AGRON 舱体装在作业船上。同一标志，更小占地。",
    },
  ],
  systemsTitle: "StarDome 在箱内做什么",
  systems: [
    {
      title: "探测",
      body: "雷达、摄像机、射频与声呐装在 AGRON 集装箱上。它们喂给 StarWall，不会虚构目标。",
    },
    {
      title: "一幅态势",
      body: "StarDome 把这些源放到同一时钟。若只要屏幕不要钢材，用 AGRON 1。",
    },
    {
      title: "响应",
      body: "部分层级带响应舱。由人授权。箱子不会自行开火，当地法律仍然有效。",
    },
  ],
  sitesTitle: "AGRON 放在哪里",
  sitesLead: "游艇码头、港口、私人岛屿——或场地只有几天时用厢式车。",
  sitesThreeCaption: "AGRON 舱体用于游艇码头、商港与私人岛屿——紧凑节点，不是每块草坪一只二十英尺箱。",
  sitesFourCaption: "同一系列的机动形态：任务临时时，机柜装进厢式车。",
  homeKicker: "AGRON 集装箱",
  homeTitle: "钢箱，以及箱内的 StarDome 系统",
  homeLead: "港口、岛屿、码头、甲板或厢式车。StarWall 在 AGRON 集装箱内运行。展示套装在集装箱页。",
  homeCta: "AGRON 集装箱与 StarDome 系统 →",
  footerKicker: "AGRON · StarDome",
  footerTitle: "场地上的钢材。箱内的系统。",
  footerLead: "港口、岛屿、码头、甲板或厢式车。",
  footerCta: "AGRON 集装箱 →",
};

const ja: ContainerShowCopy = {
  kicker: "AGRON · StarDome",
  title: "AGRON コンテナ。StarDome システム。",
  lead:
    "AGRON は鋼です。岸壁、甲板、島の道、バンに置く箱。StarDome はその中のシステムです。AGRON 1 と同じ当直の絵を、センサーが居なければならない場所のハードウェアに載せます。",
  brandCaption: "AGRON と StarDome by AGRON — 海上インテリジェンス、実際の防護。",
  unitsTitle: "現場が求める仕上げの箱",
  unitsLead: "一つの系列。港、島、岸壁、甲板で塗色と寸法を変えます。",
  units: [
    {
      name: "港 — 黒",
      body: "作業岸壁の StarDome by AGRON。アンテナとカメラを上げた状態。塩と投光は想定環境です。",
    },
    {
      name: "島 — 砂色",
      body: "同じ箱を静かな仕上げでヴィラの横に。貨物コンテナには見えません。",
    },
    {
      name: "岸壁 — 白",
      body: "白い胴体に黒と金の帯。埠頭では機材に見え、貨物箱には見えません。",
    },
    {
      name: "甲板 — コンパクト",
      body: "作業船の上の小型 AGRON シェルター。同じマーク、小さい足跡。",
    },
  ],
  systemsTitle: "箱の中で StarDome がすること",
  systems: [
    {
      title: "探知",
      body: "レーダー、カメラ、RF、ソナーは AGRON コンテナに乗ります。StarWall に送ります。接触を捏造しません。",
    },
    {
      title: "一枚の絵",
      body: "StarDome はそれらのフィードを一つの時計に載せます。鋼なしで画面だけなら AGRON 1 です。",
    },
    {
      title: "対応",
      body: "一部のティアには対応ベイがあります。人が許可します。箱は自ら撃ちません。現地法が残ります。",
    },
  ],
  sitesTitle: "AGRON を置く場所",
  sitesLead: "マリーナ、港、私有島。現場が数日ならバン。",
  sitesThreeCaption:
    "マリーナ、商港、私有島向けの AGRON シェルター。コンパクトな節。芝生ごとに 20 フィート箱を置きません。",
  sitesFourCaption: "同じ系列の機動型。仕事が一時ならバンにラックを載せます。",
  homeKicker: "AGRON コンテナ",
  homeTitle: "鋼の箱と、中の StarDome システム",
  homeLead:
    "港、島、岸壁、甲板、バン。StarWall は AGRON コンテナで動きます。展示セットはコンテナ頁にあります。",
  homeCta: "AGRON コンテナと StarDome システム →",
  footerKicker: "AGRON · StarDome",
  footerTitle: "現場の鋼。中のシステム。",
  footerLead: "港、島、岸壁、甲板、バン。",
  footerCta: "AGRON コンテナ →",
};

const he: ContainerShowCopy = {
  kicker: "AGRON · StarDome",
  title: "מכולות AGRON. מערכות StarDome.",
  lead:
    "AGRON הוא הפלדה — התיבה על רציף, סיפון, דרך באי או בטנדר. StarDome היא המערכת בפנים: אותה תמונת משמרת כמו AGRON 1, על חומרה ששמים במקום שבו החיישנים צריכים לחיות.",
  brandCaption: "AGRON ו־StarDome by AGRON — מודיעין ימי, הגנה אמיתית.",
  unitsTitle: "התיבה בגימור שהאתר דורש",
  unitsLead: "משפחה אחת. צבע וגודל לנמל, לאי, לרציף ולסיפון.",
  units: [
    {
      name: "נמל — שחור",
      body: "StarDome by AGRON על רציף עבודה. אנטנות ומצלמות למעלה. מלח וזרקורים הם סביבת התכנון.",
    },
    {
      name: "אי — חול",
      body: "אותה תיבה בגימור שקט ליד וילה. הגנה בלי מראה של מטען.",
    },
    {
      name: "רציף — לבן",
      body: "גוף לבן, פס שחור וזהב. על רחבת הנמל זה נקרא כציוד, לא כמכולת הובלה.",
    },
    {
      name: "סיפון — קומפקטי",
      body: "מקלט AGRON קטן יותר על אוניית עבודה. אותה סימניה, טביעת רגל קטנה יותר.",
    },
  ],
  systemsTitle: "מה StarDome עושה בתיבה",
  systems: [
    {
      title: "גילוי",
      body: "מכ״ם, מצלמות, תדר וסונאר יושבים על מכולת AGRON. הם מזינים את StarWall — לא ממציאים מגע.",
    },
    {
      title: "תמונה אחת",
      body: "StarDome שם את ההזנות על שעון אחד. AGRON 1 הוא המשמרת אם רוצים את המסך בלי הפלדה.",
    },
    {
      title: "מענה",
      body: "חלק מהרמות נושאות תא מענה. אדם מאשר. התיבה לא יורה מעצמה, והחוק המקומי נשאר.",
    },
  ],
  sitesTitle: "היכן שמים AGRON",
  sitesLead: "מרינה, נמל, אי פרטי — או טנדר כשהאתר קיים רק כמה ימים.",
  sitesThreeCaption:
    "מקלטי AGRON למרינה, לנמל מסחרי ולאי פרטי — צמתים קומפקטיים, לא תיבת 20 רגל על כל דשא.",
  sitesFourCaption: "אותה משפחה בנייד: מתקן בטנדר כשהעבודה זמנית.",
  homeKicker: "מכולות AGRON",
  homeTitle: "תיבת הפלדה ומערכת StarDome בפנים",
  homeLead:
    "נמל, אי, רציף, סיפון או טנדר. StarWall רץ במכולת AGRON. סט ההצגה בעמוד המכולות.",
  homeCta: "מכולות AGRON ומערכות StarDome →",
  footerKicker: "AGRON · StarDome",
  footerTitle: "הפלדה באתר. המערכת בפנים.",
  footerLead: "נמל, אי, רציף, סיפון או טנדר.",
  footerCta: "מכולות AGRON →",
};

const COPY: Record<Locale, ContainerShowCopy> = {
  en,
  ru,
  uk,
  de,
  es,
  fr,
  ar,
  zh,
  ja,
  he,
};

export function containerShowCopy(locale: Locale): ContainerShowCopy {
  return COPY[locale] ?? en;
}
