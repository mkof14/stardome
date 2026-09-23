import type { Locale } from "@/lib/i18n/locales";
import type { WatchBearer, WatchParty } from "@/lib/watch-comms";

export type WatchCommsCopy = {
  kicker: string;
  title: string;
  lead: string;
  leadLive: string;
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
      "Raise the captain, the designated person, the vessel radio net, or Support Live Team. DEMO shows the path. LIVE stays honest: no live circuit on this install.",
    leadLive:
      "LIVE has no voice or radio circuit on this install. Switch to DEMO to drill the paths, or keep the watch on the picture.",
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
      "Llame al capitán, a la persona designada, a la red de radio del buque o a Support Live Team. DEMO muestra el camino. LIVE es honesto: no hay circuito en esta instalación.",
    leadLive:
      "LIVE no tiene circuito de voz ni radio en esta instalación. Pase a DEMO para ensayar los caminos, o conserve la guardia en la imagen.",
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
      "Joignez le capitaine, la personne désignée, le réseau radio du navire ou Support Live Team. DEMO montre le chemin. LIVE reste honnête : aucun circuit sur cette installation.",
    leadLive:
      "LIVE n’a ni voix ni radio sur cette installation. Passez en DEMO pour exercer les chemins, ou tenez le quart sur l’image.",
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
      "Erreichen Sie den Kapitän, die bestimmte Person, das Schiffs-Funknetz oder Support Live Team. DEMO zeigt den Weg. LIVE bleibt ehrlich: kein Kreis auf dieser Installation.",
    leadLive:
      "LIVE hat auf dieser Installation keinen Sprach- oder Funkkreis. Wechseln Sie zu DEMO, um die Wege zu üben, oder halten Sie Wache am Lagebild.",
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
      "Вызовите капитана, назначенное лицо, радиосеть судна или Support Live Team. DEMO показывает путь. LIVE честен: на этой установке нет живого канала.",
    leadLive:
      "В LIVE на этой установке нет голосового или радиоканала. Переключитесь в DEMO, чтобы отработать пути, или держите вахту по картине.",
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
      "Викличте капітана, призначену особу, радіомережу судна або Support Live Team. DEMO показує шлях. LIVE чесний: на цій установці немає живого каналу.",
    leadLive:
      "У LIVE на цій установці немає голосового чи радіоканалу. Перемкніться в DEMO, щоб відпрацювати шляхи, або тримайте вахту за картиною.",
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
      "اتصل بالربان أو المعيّن أو شبكة راديو السفينة أو Support Live Team. DEMO يعرض المسار. LIVE صادق: لا دائرة حية في هذا النشر.",
    leadLive:
      "LIVE بلا دائرة صوت أو راديو في هذا النشر. انتقلوا إلى DEMO لتمرين المسارات، أو أبقوا الخفارة على الصورة.",
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
      "呼叫船长、指定人员、全船无线电网或 Support Live Team。DEMO 显示路径。LIVE 如实：此安装没有实况电路。",
    leadLive: "此安装的 LIVE 没有语音或无线电电路。切换到 DEMO 演练路径，或继续按画面值班。",
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
      "船長、指名者、船内無線網、Support Live Team を呼び出します。DEMO は経路を示します。LIVE は正直です。この導入に実回線はありません。",
    leadLive:
      "この導入の LIVE に音声・無線回線はありません。経路の訓練は DEMO へ切り替えるか、画面の当直を続けてください。",
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
      "הזעיקו את הקברניט, את הממונה, את רשת הרדיו של הכלי או את Support Live Team. DEMO מציג את הנתיב. LIVE כן: אין מעגל חי בהתקנה הזו.",
    leadLive:
      "ב־LIVE אין מעגל קול או רדיו בהתקנה הזו. עברו ל־DEMO לתרגול הנתיבים, או שמרו משמרת על התמונה.",
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
