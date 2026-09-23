import type { Locale } from "@/lib/i18n/locales";

/** Visible Pilot chrome. Looked up with a switch so a language change cannot keep the previous label. */
export type PilotChrome = {
  title: string;
  speaking: string;
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
    advisor: "WATCH ADVISOR",
    ask: "Ask Pilot…",
    send: "Send",
    stop: "Stop",
    hide: "Hide",
    open: "Open Pilot",
    empty: "Ask about StarWall or AGRON 1 — speak or type.",
    live: "WATCH ADVISOR · LIVE · no sensors",
    speakerOn: "Speaker on",
    speakerOff: "Speaker off",
  },
  es: {
    title: "Pilot",
    speaking: "Habla",
    advisor: "ASESOR DE GUARDIA",
    ask: "Preguntar a Pilot…",
    send: "Enviar",
    stop: "Parar",
    hide: "Ocultar",
    open: "Abrir Pilot",
    empty: "Pregunte por StarWall o AGRON 1 — voz o texto.",
    live: "ASESOR DE GUARDIA · LIVE · sin sensores",
    speakerOn: "Altavoz encendido",
    speakerOff: "Altavoz apagado",
  },
  fr: {
    title: "Pilot",
    speaking: "Parle",
    advisor: "CONSEILLER DE QUART",
    ask: "Demander à Pilot…",
    send: "Envoyer",
    stop: "Stop",
    hide: "Masquer",
    open: "Ouvrir Pilot",
    empty: "Interrogez StarWall ou AGRON 1 — voix ou texte.",
    live: "CONSEILLER DE QUART · LIVE · aucun capteur",
    speakerOn: "Haut-parleur allumé",
    speakerOff: "Haut-parleur coupé",
  },
  de: {
    title: "Pilot",
    speaking: "Spricht",
    advisor: "WACHBERATER",
    ask: "Pilot fragen…",
    send: "Senden",
    stop: "Stopp",
    hide: "Ausblenden",
    open: "Pilot öffnen",
    empty: "Fragen Sie zu StarWall oder AGRON 1 — Sprache oder Text.",
    live: "WACHBERATER · LIVE · keine Sensoren",
    speakerOn: "Lautsprecher an",
    speakerOff: "Lautsprecher aus",
  },
  ru: {
    title: "Pilot",
    speaking: "Говорит",
    advisor: "СОВЕТНИК ВАХТЫ",
    ask: "Спросить Pilot…",
    send: "Отправить",
    stop: "Стоп",
    hide: "Скрыть",
    open: "Открыть Pilot",
    empty: "Спросите про StarWall или AGRON 1 — голосом или текстом.",
    live: "СОВЕТНИК ВАХТЫ · LIVE · нет датчиков",
    speakerOn: "Динамик включён",
    speakerOff: "Динамик выключен",
  },
  uk: {
    title: "Pilot",
    speaking: "Говорить",
    advisor: "РАДНИК ВАХТИ",
    ask: "Запитати Pilot…",
    send: "Надіслати",
    stop: "Стоп",
    hide: "Сховати",
    open: "Відкрити Pilot",
    empty: "Запитайте про StarWall або AGRON 1 — голосом або текстом.",
    live: "РАДНИК ВАХТИ · LIVE · немає датчиків",
    speakerOn: "Динамік увімкнено",
    speakerOff: "Динамік вимкнено",
  },
  ar: {
    title: "Pilot",
    speaking: "يتكلم",
    advisor: "مستشار الخفارة",
    ask: "اسأل Pilot…",
    send: "إرسال",
    stop: "توقف",
    hide: "إخفاء",
    open: "فتح Pilot",
    empty: "اسأل عن StarWall أو AGRON 1 — صوتاً أو كتابة.",
    live: "مستشار الخفارة · LIVE · لا مستشعرات",
    speakerOn: "مكبر الصوت يعمل",
    speakerOff: "مكبر الصوت مغلق",
  },
  zh: {
    title: "Pilot",
    speaking: "正在说",
    advisor: "值班顾问",
    ask: "询问 Pilot…",
    send: "发送",
    stop: "停止",
    hide: "隐藏",
    open: "打开 Pilot",
    empty: "询问 StarWall 或 AGRON 1 — 语音或文字。",
    live: "值班顾问 · LIVE · 无传感器",
    speakerOn: "扬声器开",
    speakerOff: "扬声器关",
  },
  ja: {
    title: "Pilot",
    speaking: "発話中",
    advisor: "当直アドバイザー",
    ask: "Pilot に尋ねる…",
    send: "送信",
    stop: "停止",
    hide: "隠す",
    open: "Pilot を開く",
    empty: "StarWall または AGRON 1 を音声または文字で尋ねてください。",
    live: "当直アドバイザー · LIVE · センサーなし",
    speakerOn: "スピーカーオン",
    speakerOff: "スピーカーオフ",
  },
  he: {
    title: "Pilot",
    speaking: "מדבר",
    advisor: "יועץ משמרת",
    ask: "לשאול את Pilot…",
    send: "שליחה",
    stop: "עצור",
    hide: "הסתרה",
    open: "פתיחת Pilot",
    empty: "שאלו על StarWall או AGRON 1 — בדיבור או בכתב.",
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
