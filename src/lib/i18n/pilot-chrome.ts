import type { Locale } from "@/lib/i18n/locales";

/** Visible Pilot chrome. Looked up with a switch so a language change cannot keep the previous label. */
export type PilotChrome = {
  title: string;
  speaking: string;
  listening: string;
  waiting: string;
  haltAck: string;
  converseOffer: string;
  emptyWatch: string;
  advisor: string;
  ask: string;
  send: string;
  stop: string;
  hide: string;
  open: string;
  empty: string;
  live: string;
  speakerOn: string;
  speakerOff: string;
};

const PILOT_CHROME = {
  en: {
    title: "Pilot",
    speaking: "Speaking",
    listening: "Listening",
    waiting: "Waiting",
    haltAck: "Stop. Listening.",
    converseOffer: "I am here. What do you care about — and how can I help?",
    emptyWatch: "What do you need? The picture, advice, comms — or something else.",
    advisor: "WATCH ADVISOR",
    ask: "Ask Pilot…",
    send: "Send",
    stop: "Stop",
    hide: "Hide",
    open: "Open Pilot",
    empty: "Ask about StarWall or StarDome 1 — speak or type.",
    live: "WATCH ADVISOR · LIVE · no sensors",
    speakerOn: "Speaker on",
    speakerOff: "Speaker off",
  },
  es: {
    title: "Pilot",
    speaking: "Habla",
    listening: "Escucha",
    waiting: "Espera",
    haltAck: "Alto. Escucho.",
    converseOffer: "Estoy aquí. ¿Qué le importa — y en qué puedo ayudar?",
    emptyWatch: "¿Qué necesita? La imagen, consejo, comms — u otra cosa.",
    advisor: "ASESOR DE GUARDIA",
    ask: "Preguntar a Pilot…",
    send: "Enviar",
    stop: "Parar",
    hide: "Ocultar",
    open: "Abrir Pilot",
    empty: "Pregunte por StarWall o StarDome 1 — voz o texto.",
    live: "ASESOR DE GUARDIA · LIVE · sin sensores",
    speakerOn: "Altavoz encendido",
    speakerOff: "Altavoz apagado",
  },
  fr: {
    title: "Pilot",
    speaking: "Parle",
    listening: "Écoute",
    waiting: "Attend",
    haltAck: "Stop. J’écoute.",
    converseOffer: "Je suis là. Qu’est-ce qui vous occupe — et comment puis-je aider ?",
    emptyWatch: "De quoi avez-vous besoin ? L’image, un conseil, les comms — ou autre chose.",
    advisor: "CONSEILLER DE QUART",
    ask: "Demander à Pilot…",
    send: "Envoyer",
    stop: "Stop",
    hide: "Masquer",
    open: "Ouvrir Pilot",
    empty: "Interrogez StarWall ou StarDome 1 — voix ou texte.",
    live: "CONSEILLER DE QUART · LIVE · aucun capteur",
    speakerOn: "Haut-parleur allumé",
    speakerOff: "Haut-parleur coupé",
  },
  de: {
    title: "Pilot",
    speaking: "Spricht",
    listening: "Hört",
    waiting: "Wartet",
    haltAck: "Stopp. Ich höre.",
    converseOffer: "Ich bin hier. Was ist Ihnen wichtig — und wobei kann ich helfen?",
    emptyWatch: "Was brauchen Sie? Lagebild, Rat, Funk — oder etwas anderes.",
    advisor: "WACHBERATER",
    ask: "Pilot fragen…",
    send: "Senden",
    stop: "Stopp",
    hide: "Ausblenden",
    open: "Pilot öffnen",
    empty: "Fragen Sie zu StarWall oder StarDome 1 — Sprache oder Text.",
    live: "WACHBERATER · LIVE · keine Sensoren",
    speakerOn: "Lautsprecher an",
    speakerOff: "Lautsprecher aus",
  },
  ru: {
    title: "Pilot",
    speaking: "Говорит",
    listening: "Слушает",
    waiting: "Ждёт",
    haltAck: "Стоп. Слушаю.",
    converseOffer: "Я здесь. Что вас интересует — и чем помочь?",
    emptyWatch: "Что вас интересует? Картина, совет, связь — или чем ещё помочь?",
    advisor: "СОВЕТНИК ВАХТЫ",
    ask: "Спросить Pilot…",
    send: "Отправить",
    stop: "Стоп",
    hide: "Скрыть",
    open: "Открыть Pilot",
    empty: "Спросите про StarWall или StarDome 1 — голосом или текстом.",
    live: "СОВЕТНИК ВАХТЫ · LIVE · нет датчиков",
    speakerOn: "Динамик включён",
    speakerOff: "Динамик выключен",
  },
  uk: {
    title: "Pilot",
    speaking: "Говорить",
    listening: "Слухає",
    waiting: "Чекає",
    haltAck: "Стоп. Слухаю.",
    converseOffer: "Я тут. Що вас цікавить — і чим допомогти?",
    emptyWatch: "Що вас цікавить? Картина, порада, зв’язок — чи чим ще допомогти?",
    advisor: "РАДНИК ВАХТИ",
    ask: "Запитати Pilot…",
    send: "Надіслати",
    stop: "Стоп",
    hide: "Сховати",
    open: "Відкрити Pilot",
    empty: "Запитайте про StarWall або StarDome 1 — голосом або текстом.",
    live: "РАДНИК ВАХТИ · LIVE · немає датчиків",
    speakerOn: "Динамік увімкнено",
    speakerOff: "Динамік вимкнено",
  },
  ar: {
    title: "Pilot",
    speaking: "يتكلم",
    listening: "يستمع",
    waiting: "ينتظر",
    haltAck: "توقف. أسمع.",
    converseOffer: "أنا هنا. ما الذي يهمك — وكيف أساعد؟",
    emptyWatch: "ماذا تحتاج؟ الصورة، النصيحة، الاتصال — أو شيء آخر.",
    advisor: "مستشار الخفارة",
    ask: "اسأل Pilot…",
    send: "إرسال",
    stop: "توقف",
    hide: "إخفاء",
    open: "فتح Pilot",
    empty: "اسأل عن StarWall أو StarDome 1 — صوتاً أو كتابة.",
    live: "مستشار الخفارة · LIVE · لا مستشعرات",
    speakerOn: "مكبر الصوت يعمل",
    speakerOff: "مكبر الصوت مغلق",
  },
  zh: {
    title: "Pilot",
    speaking: "正在说",
    listening: "正在听",
    waiting: "等待中",
    haltAck: "停止。在听。",
    converseOffer: "我在。您关心什么 — 我能帮什么？",
    emptyWatch: "您需要什么？画面、建议、通信 — 还是别的？",
    advisor: "值班顾问",
    ask: "询问 Pilot…",
    send: "发送",
    stop: "停止",
    hide: "隐藏",
    open: "打开 Pilot",
    empty: "询问 StarWall 或 StarDome 1 — 语音或文字。",
    live: "值班顾问 · LIVE · 无传感器",
    speakerOn: "扬声器开",
    speakerOff: "扬声器关",
  },
  ja: {
    title: "Pilot",
    speaking: "発話中",
    listening: "聴取中",
    waiting: "待機中",
    haltAck: "停止。聞いています。",
    converseOffer: "ここにいます。何が気になりますか。何をお手伝いしましょうか。",
    emptyWatch: "何が必要ですか。画面、助言、通信 — それ以外でも。",
    advisor: "当直アドバイザー",
    ask: "Pilot に尋ねる…",
    send: "送信",
    stop: "停止",
    hide: "隠す",
    open: "Pilot を開く",
    empty: "StarWall または StarDome 1 を音声または文字で尋ねてください。",
    live: "当直アドバイザー · LIVE · センサーなし",
    speakerOn: "スピーカーオン",
    speakerOff: "スピーカーオフ",
  },
  he: {
    title: "Pilot",
    speaking: "מדבר",
    listening: "מאזין",
    waiting: "ממתין",
    haltAck: "עצור. אני מאזין.",
    converseOffer: "אני כאן. מה מעניין אתכם — וכיצד לעזור?",
    emptyWatch: "מה אתם צריכים? התמונה, ייעוץ, קשר — או משהו אחר.",
    advisor: "יועץ משמרת",
    ask: "לשאול את Pilot…",
    send: "שליחה",
    stop: "עצור",
    hide: "הסתרה",
    open: "פתיחת Pilot",
    empty: "שאלו על StarWall או StarDome 1 — בדיבור או בכתב.",
    live: "יועץ משמרת · LIVE · אין חיישנים",
    speakerOn: "רמקול דולק",
    speakerOff: "רמקול כבוי",
  },
} as const satisfies Record<Locale, PilotChrome>;

/** Hide (and the rest of the Pilot bar) follow this switch — never the previous locale's leftover copy. */
export function pilotChrome(locale: Locale): PilotChrome {
  switch (locale) {
    case "es":
      return PILOT_CHROME.es;
    case "fr":
      return PILOT_CHROME.fr;
    case "de":
      return PILOT_CHROME.de;
    case "ru":
      return PILOT_CHROME.ru;
    case "uk":
      return PILOT_CHROME.uk;
    case "ar":
      return PILOT_CHROME.ar;
    case "zh":
      return PILOT_CHROME.zh;
    case "ja":
      return PILOT_CHROME.ja;
    case "he":
      return PILOT_CHROME.he;
    case "en":
    default:
      return PILOT_CHROME.en;
  }
}

export function pilotHide(locale: Locale): string {
  return pilotChrome(locale).hide;
}
