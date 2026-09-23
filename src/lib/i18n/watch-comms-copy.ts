import type { Locale } from "@/lib/i18n/locales";
import type { WatchBearer, WatchParty } from "@/lib/watch-comms";

export type WatchCommsCopy = {
  kicker: string;
  title: string;
  lead: string;
  leadLive: string;
  starlinkLead: string;
  starlinkLeadLive: string;
  raise: string;
  raised: string;
  liveEmpty: string;
  demoPath: string;
  party: Record<WatchParty, string>;
  bearer: Record<WatchBearer, string>;
  ask: Record<WatchParty, string>;
};

const COPY = {
  en: {
    kicker: "WATCH NET",
    title: "Watch communications",
    lead:
      "Raise the captain, the designated person, the vessel radio net, or Support Live Team. Two Starlink services sit on this net — Maritime and Priority — with lock, latency, SNR, and obstruction on the monitor. DEMO shows the path. LIVE stays honest: no live circuit on this install.",
    leadLive:
      "LIVE has no voice, radio, or Starlink circuit on this install. Switch to DEMO to drill the paths and read Maritime and Priority, or keep the watch on the picture.",
    starlinkLead:
      "Starlink Maritime (UT-A, Ku/Ka) is the primary watch data path. Starlink Priority (UT-B, Ka) is the second path.",
    starlinkLeadLive:
      "LIVE has no Starlink terminals on this install. Switch to DEMO to read Maritime and Priority.",
    raise: "Raise",
    raised: "Posted to Pilot",
    liveEmpty: "No live circuit",
    demoPath: "DEMO path",
    party: {
      captain: "Captain",
      designated: "Designated person",
      watch: "Watch / vessel",
      support: "Support Live Team",
    },
    bearer: {
      shipPhone: "Ship phone",
      mobile: "Mobile phone",
      localPhone: "Local onboard phone",
      personalRadio: "Personal radio",
      vesselRadio: "Vessel radio net",
      vhf: "VHF ch.16",
      satcomVoice: "Satcom voice",
      starlinkMaritime: "Starlink Maritime",
      starlinkPriority: "Starlink Priority",
      supportDesk: "Support Live desk",
      alarmNet: "Alarm channel",
    },
    ask: {
      captain: "Pilot, notify the captain on this circuit.",
      designated: "Pilot, notify the designated person on this circuit.",
      watch: "Pilot, put this on the watch net.",
      support: "Pilot, raise Support Live Team.",
    },
  },
  es: {
    kicker: "RED DE GUARDIA",
    title: "Comunicaciones de guardia",
    lead:
      "Llame al capitán, a la persona designada, a la red de radio del buque o a Support Live Team. En esta red hay dos servicios Starlink — Maritime y Priority — con lock, latencia, SNR y obstrucción en el monitor. DEMO muestra el camino. LIVE es honesto: no hay circuito en esta instalación.",
    leadLive:
      "LIVE no tiene circuito de voz, radio ni Starlink en esta instalación. Pase a DEMO para ensayar los caminos y leer Maritime y Priority, o conserve la guardia en la imagen.",
    starlinkLead:
      "Starlink Maritime (UT-A, Ku/Ka) es la vía principal de datos de guardia. Starlink Priority (UT-B, Ka) es la segunda vía.",
    starlinkLeadLive:
      "LIVE no tiene terminales Starlink en esta instalación. Pase a DEMO para leer Maritime y Priority.",
    raise: "Llamar",
    raised: "Enviado a Pilot",
    liveEmpty: "Sin circuito en vivo",
    demoPath: "Camino DEMO",
    party: {
      captain: "Capitán",
      designated: "Persona designada",
      watch: "Guardia / buque",
      support: "Support Live Team",
    },
    bearer: {
      shipPhone: "Teléfono del buque",
      mobile: "Teléfono móvil",
      localPhone: "Teléfono local a bordo",
      personalRadio: "Radio personal",
      vesselRadio: "Red de radio del buque",
      vhf: "VHF ch.16",
      satcomVoice: "Voz satcom",
      starlinkMaritime: "Starlink Maritime",
      starlinkPriority: "Starlink Priority",
      supportDesk: "Mesa Support Live",
      alarmNet: "Canal de alarma",
    },
    ask: {
      captain: "Pilot, avise al capitán por este circuito.",
      designated: "Pilot, avise a la persona designada por este circuito.",
      watch: "Pilot, póngalo en la red de guardia.",
      support: "Pilot, llame a Support Live Team.",
    },
  },
  fr: {
    kicker: "RÉSEAU DE QUART",
    title: "Communications de quart",
    lead:
      "Joignez le capitaine, la personne désignée, le réseau radio du navire ou Support Live Team. Deux services Starlink — Maritime et Priority — sont sur ce réseau, avec lock, latence, SNR et obstruction sur le moniteur. DEMO montre le chemin. LIVE reste honnête : aucun circuit sur cette installation.",
    leadLive:
      "LIVE n’a ni voix, ni radio, ni Starlink sur cette installation. Passez en DEMO pour exercer les chemins et lire Maritime et Priority, ou tenez le quart sur l’image.",
    starlinkLead:
      "Starlink Maritime (UT-A, Ku/Ka) est la voie de données de quart principale. Starlink Priority (UT-B, Ka) est la seconde voie.",
    starlinkLeadLive:
      "LIVE n’a pas de terminaux Starlink sur cette installation. Passez en DEMO pour lire Maritime et Priority.",
    raise: "Joindre",
    raised: "Envoyé à Pilot",
    liveEmpty: "Aucun circuit en direct",
    demoPath: "Chemin DEMO",
    party: {
      captain: "Capitaine",
      designated: "Personne désignée",
      watch: "Quart / navire",
      support: "Support Live Team",
    },
    bearer: {
      shipPhone: "Téléphone du navire",
      mobile: "Téléphone mobile",
      localPhone: "Téléphone local à bord",
      personalRadio: "Radio personnelle",
      vesselRadio: "Réseau radio du navire",
      vhf: "VHF ch.16",
      satcomVoice: "Voix satcom",
      starlinkMaritime: "Starlink Maritime",
      starlinkPriority: "Starlink Priority",
      supportDesk: "Bureau Support Live",
      alarmNet: "Canal d’alarme",
    },
    ask: {
      captain: "Pilot, prévenez le capitaine sur ce circuit.",
      designated: "Pilot, prévenez la personne désignée sur ce circuit.",
      watch: "Pilot, mettez ceci sur le réseau de quart.",
      support: "Pilot, joignez Support Live Team.",
    },
  },
  de: {
    kicker: "WACHNETZ",
    title: "Wachkommunikation",
    lead:
      "Erreichen Sie den Kapitän, die bestimmte Person, das Schiffs-Funknetz oder Support Live Team. Zwei Starlink-Dienste — Maritime und Priority — liegen auf diesem Netz, mit Lock, Latenz, SNR und Abschattung auf dem Monitor. DEMO zeigt den Weg. LIVE bleibt ehrlich: kein Kreis auf dieser Installation.",
    leadLive:
      "LIVE hat auf dieser Installation keinen Sprach-, Funk- oder Starlink-Kreis. Wechseln Sie zu DEMO, um die Wege zu üben und Maritime und Priority zu lesen, oder halten Sie Wache am Lagebild.",
    starlinkLead:
      "Starlink Maritime (UT-A, Ku/Ka) ist der primäre Wachdatenweg. Starlink Priority (UT-B, Ka) ist der zweite Weg.",
    starlinkLeadLive:
      "LIVE hat auf dieser Installation keine Starlink-Terminals. Wechseln Sie zu DEMO, um Maritime und Priority zu lesen.",
    raise: "Rufen",
    raised: "An Pilot übergeben",
    liveEmpty: "Kein Live-Kreis",
    demoPath: "DEMO-Weg",
    party: {
      captain: "Kapitän",
      designated: "Bestimmte Person",
      watch: "Wache / Schiff",
      support: "Support Live Team",
    },
    bearer: {
      shipPhone: "Schiffstelefon",
      mobile: "Mobiltelefon",
      localPhone: "Lokales Bordtelefon",
      personalRadio: "Personalfunk",
      vesselRadio: "Schiffs-Funknetz",
      vhf: "UKW Kanal 16",
      satcomVoice: "Satcom-Sprache",
      starlinkMaritime: "Starlink Maritime",
      starlinkPriority: "Starlink Priority",
      supportDesk: "Support-Live-Platz",
      alarmNet: "Alarmkanal",
    },
    ask: {
      captain: "Pilot, benachrichtigen Sie den Kapitän auf diesem Kreis.",
      designated: "Pilot, benachrichtigen Sie die bestimmte Person auf diesem Kreis.",
      watch: "Pilot, geben Sie das ins Wachnetz.",
      support: "Pilot, rufen Sie Support Live Team.",
    },
  },
  ru: {
    kicker: "СЕТЬ ВАХТЫ",
    title: "Связь вахты",
    lead:
      "Вызовите капитана, назначенное лицо, радиосеть судна или Support Live Team. На сети два сервиса Starlink — Maritime и Priority — с мониторингом lock, задержки, SNR и затенения. DEMO показывает путь. LIVE честен: на этой установке нет живого канала.",
    leadLive:
      "В LIVE на этой установке нет голосового, радио- или Starlink-канала. Переключитесь в DEMO, чтобы отработать пути и читать Maritime и Priority, или держите вахту по картине.",
    starlinkLead:
      "Starlink Maritime (UT-A, Ku/Ka) — основной канал данных вахты. Starlink Priority (UT-B, Ka) — второй путь.",
    starlinkLeadLive:
      "В LIVE на этой установке нет терминалов Starlink. Переключитесь в DEMO, чтобы читать Maritime и Priority.",
    raise: "Вызвать",
    raised: "Передано Pilot",
    liveEmpty: "Нет живого канала",
    demoPath: "Путь DEMO",
    party: {
      captain: "Капитан",
      designated: "Назначенное лицо",
      watch: "Вахта / судно",
      support: "Support Live Team",
    },
    bearer: {
      shipPhone: "Судовой телефон",
      mobile: "Мобильный телефон",
      localPhone: "Местный телефон на борту",
      personalRadio: "Персональное радио",
      vesselRadio: "Радиосеть судна",
      vhf: "УКВ 16",
      satcomVoice: "Голос satcom",
      starlinkMaritime: "Starlink Maritime",
      starlinkPriority: "Starlink Priority",
      supportDesk: "Пульт Support Live",
      alarmNet: "Канал тревоги",
    },
    ask: {
      captain: "Pilot, известить капитана по этому каналу.",
      designated: "Pilot, известить назначенного по этому каналу.",
      watch: "Pilot, выведи это в сеть вахты.",
      support: "Pilot, поднять Support Live Team.",
    },
  },
  uk: {
    kicker: "МЕРЕЖА ВАХТИ",
    title: "Зв’язок вахти",
    lead:
      "Викличте капітана, призначену особу, радіомережу судна або Support Live Team. У мережі два сервіси Starlink — Maritime і Priority — з моніторингом lock, затримки, SNR і затінення. DEMO показує шлях. LIVE чесний: на цій установці немає живого каналу.",
    leadLive:
      "У LIVE на цій установці немає голосового, радіо- чи Starlink-каналу. Перемкніться в DEMO, щоб відпрацювати шляхи й читати Maritime і Priority, або тримайте вахту за картиною.",
    starlinkLead:
      "Starlink Maritime (UT-A, Ku/Ka) — основний канал даних вахти. Starlink Priority (UT-B, Ka) — другий шлях.",
    starlinkLeadLive:
      "У LIVE на цій установці немає терміналів Starlink. Перемкніться в DEMO, щоб читати Maritime і Priority.",
    raise: "Викликати",
    raised: "Передано Pilot",
    liveEmpty: "Немає живого каналу",
    demoPath: "Шлях DEMO",
    party: {
      captain: "Капітан",
      designated: "Призначена особа",
      watch: "Вахта / судно",
      support: "Support Live Team",
    },
    bearer: {
      shipPhone: "Судновий телефон",
      mobile: "Мобільний телефон",
      localPhone: "Місцевий телефон на борту",
      personalRadio: "Персональне радіо",
      vesselRadio: "Радіомережа судна",
      vhf: "УКХ 16",
      satcomVoice: "Голос satcom",
      starlinkMaritime: "Starlink Maritime",
      starlinkPriority: "Starlink Priority",
      supportDesk: "Пульт Support Live",
      alarmNet: "Канал тривоги",
    },
    ask: {
      captain: "Pilot, сповістити капітана цим каналом.",
      designated: "Pilot, сповістити призначеного цим каналом.",
      watch: "Pilot, виведи це в мережу вахти.",
      support: "Pilot, підняти Support Live Team.",
    },
  },
  ar: {
    kicker: "شبكة الخفارة",
    title: "اتصالات الخفارة",
    lead:
      "اتصل بالربان أو المعيّن أو شبكة راديو السفينة أو Support Live Team. على هذه الشبكة خدمتا Starlink — Maritime وPriority — مع مراقبة القفل والتأخير وSNR والحجب. DEMO يعرض المسار. LIVE صادق: لا دائرة حية في هذا النشر.",
    leadLive:
      "LIVE بلا دائرة صوت أو راديو أو Starlink في هذا النشر. انتقلوا إلى DEMO لتمرين المسارات وقراءة Maritime وPriority، أو أبقوا الخفارة على الصورة.",
    starlinkLead:
      "Starlink Maritime (UT-A, Ku/Ka) هو مسار بيانات الخفارة الأساسي. Starlink Priority (UT-B, Ka) هو المسار الثاني.",
    starlinkLeadLive:
      "LIVE بلا محطات Starlink في هذا النشر. انتقلوا إلى DEMO لقراءة Maritime وPriority.",
    raise: "اتصل",
    raised: "أُرسل إلى Pilot",
    liveEmpty: "لا دائرة حية",
    demoPath: "مسار DEMO",
    party: {
      captain: "الربان",
      designated: "الشخص المعيّن",
      watch: "الخفارة / السفينة",
      support: "Support Live Team",
    },
    bearer: {
      shipPhone: "هاتف السفينة",
      mobile: "هاتف محمول",
      localPhone: "هاتف محلي على المتن",
      personalRadio: "راديو شخصي",
      vesselRadio: "شبكة راديو السفينة",
      vhf: "VHF قناة 16",
      satcomVoice: "صوت satcom",
      starlinkMaritime: "Starlink Maritime",
      starlinkPriority: "Starlink Priority",
      supportDesk: "مكتب Support Live",
      alarmNet: "قناة الإنذار",
    },
    ask: {
      captain: "Pilot، أبلغ الربان على هذه الدائرة.",
      designated: "Pilot، أبلغ المعيّن على هذه الدائرة.",
      watch: "Pilot، ضع هذا على شبكة الخفارة.",
      support: "Pilot، ارفع Support Live Team.",
    },
  },
  zh: {
    kicker: "值班网",
    title: "值班通信",
    lead:
      "呼叫船长、指定人员、全船无线电网或 Support Live Team。网上有两项 Starlink 服务 — Maritime 与 Priority — 监视器显示 lock、时延、SNR 与遮挡。DEMO 显示路径。LIVE 如实：此安装没有实况电路。",
    leadLive:
      "此安装的 LIVE 没有语音、无线电或 Starlink 电路。切换到 DEMO 演练路径并读取 Maritime 与 Priority，或继续按画面值班。",
    starlinkLead:
      "Starlink Maritime（UT-A，Ku/Ka）是值班数据主路径。Starlink Priority（UT-B，Ka）是第二路径。",
    starlinkLeadLive:
      "此安装的 LIVE 没有 Starlink 终端。切换到 DEMO 读取 Maritime 与 Priority。",
    raise: "呼叫",
    raised: "已交给 Pilot",
    liveEmpty: "无实况电路",
    demoPath: "DEMO 路径",
    party: {
      captain: "船长",
      designated: "指定人员",
      watch: "值班 / 船舶",
      support: "Support Live Team",
    },
    bearer: {
      shipPhone: "船用电话",
      mobile: "移动电话",
      localPhone: "船上本地电话",
      personalRadio: "个人电台",
      vesselRadio: "全船无线电网",
      vhf: "甚高频 16 频道",
      satcomVoice: "卫星语音",
      starlinkMaritime: "Starlink Maritime",
      starlinkPriority: "Starlink Priority",
      supportDesk: "Support Live 台席",
      alarmNet: "警报信道",
    },
    ask: {
      captain: "Pilot，通过此电路通知船长。",
      designated: "Pilot，通过此电路通知指定人员。",
      watch: "Pilot，把它放到值班网。",
      support: "Pilot，呼叫 Support Live Team。",
    },
  },
  ja: {
    kicker: "当直ネット",
    title: "当直通信",
    lead:
      "船長、指名者、船内無線網、Support Live Team を呼び出します。この網には Starlink の 2 サービス — Maritime と Priority — があり、モニターに lock・遅延・SNR・遮蔽を出します。DEMO は経路を示します。LIVE は正直です。この導入に実回線はありません。",
    leadLive:
      "この導入の LIVE に音声・無線・Starlink 回線はありません。経路の訓練と Maritime / Priority の読み取りは DEMO へ切り替えるか、画面の当直を続けてください。",
    starlinkLead:
      "Starlink Maritime（UT-A、Ku/Ka）は当直データの主経路です。Starlink Priority（UT-B、Ka）は第 2 経路です。",
    starlinkLeadLive:
      "この導入の LIVE に Starlink 端末はありません。Maritime と Priority を読むには DEMO へ切り替えてください。",
    raise: "呼び出す",
    raised: "Pilot へ送付",
    liveEmpty: "実回線なし",
    demoPath: "DEMO 経路",
    party: {
      captain: "船長",
      designated: "指名者",
      watch: "当直 / 船舶",
      support: "Support Live Team",
    },
    bearer: {
      shipPhone: "船内電話",
      mobile: "携帯電話",
      localPhone: "船上の内線",
      personalRadio: "個人無線",
      vesselRadio: "船内無線網",
      vhf: "VHF 16ch",
      satcomVoice: "satcom 音声",
      starlinkMaritime: "Starlink Maritime",
      starlinkPriority: "Starlink Priority",
      supportDesk: "Support Live 席",
      alarmNet: "警報チャネル",
    },
    ask: {
      captain: "Pilot、この回線で船長に知らせて。",
      designated: "Pilot、この回線で指名者に知らせて。",
      watch: "Pilot、当直ネットに出して。",
      support: "Pilot、Support Live Team を上げて。",
    },
  },
  he: {
    kicker: "רשת משמרת",
    title: "קשר משמרת",
    lead:
      "הזעיקו את הקברניט, את הממונה, את רשת הרדיו של הכלי או את Support Live Team. ברשת שירותי Starlink — Maritime ו־Priority — עם ניטור lock, השהיה, SNR והסתרה. DEMO מציג את הנתיב. LIVE כן: אין מעגל חי בהתקנה הזו.",
    leadLive:
      "ב־LIVE אין מעגל קול, רדיו או Starlink בהתקנה הזו. עברו ל־DEMO לתרגול הנתיבים ולקריאת Maritime ו־Priority, או שמרו משמרת על התמונה.",
    starlinkLead:
      "Starlink Maritime (UT-A, Ku/Ka) הוא נתיב נתוני המשמרת הראשי. Starlink Priority (UT-B, Ka) הוא הנתיב השני.",
    starlinkLeadLive:
      "ב־LIVE אין מסופי Starlink בהתקנה הזו. עברו ל־DEMO כדי לקרוא Maritime ו־Priority.",
    raise: "הזעקה",
    raised: "נמסר ל־Pilot",
    liveEmpty: "אין מעגל חי",
    demoPath: "נתיב DEMO",
    party: {
      captain: "קברניט",
      designated: "הממונה",
      watch: "משמרת / כלי",
      support: "Support Live Team",
    },
    bearer: {
      shipPhone: "טלפון כלי",
      mobile: "טלפון נייד",
      localPhone: "טלפון מקומי על הסיפון",
      personalRadio: "רדיו אישי",
      vesselRadio: "רשת רדיו של הכלי",
      vhf: "VHF ערוץ 16",
      satcomVoice: "קול satcom",
      starlinkMaritime: "Starlink Maritime",
      starlinkPriority: "Starlink Priority",
      supportDesk: "עמדת Support Live",
      alarmNet: "ערוץ אזעקה",
    },
    ask: {
      captain: "Pilot, הודע לקברניט במעגל הזה.",
      designated: "Pilot, הודע לממונה במעגל הזה.",
      watch: "Pilot, פרסם זאת לרשת המשמרת.",
      support: "Pilot, העלה את Support Live Team.",
    },
  },
} as const satisfies Record<Locale, WatchCommsCopy>;

export function watchCommsCopy(locale: Locale): WatchCommsCopy {
  switch (locale) {
    case "es":
      return COPY.es;
    case "fr":
      return COPY.fr;
    case "de":
      return COPY.de;
    case "ru":
      return COPY.ru;
    case "uk":
      return COPY.uk;
    case "ar":
      return COPY.ar;
    case "zh":
      return COPY.zh;
    case "ja":
      return COPY.ja;
    case "he":
      return COPY.he;
    case "en":
    default:
      return COPY.en;
  }
}
