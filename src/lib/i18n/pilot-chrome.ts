import type { Locale } from "@/lib/i18n/locales";

/** Visible Pilot chrome. Looked up with a switch so a language change cannot keep the previous label. */
export type PilotChrome = {
  title: string;
  advisor: string;
  ask: string;
  send: string;
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
    advisor: "WATCH ADVISOR",
    ask: "Ask Pilot…",
    send: "Send",
    hide: "Hide",
    open: "Open Pilot",
    empty:
      "Pilot is on watch. Ask about StarWall, the AGRON 1 picture, plans, or AGRON containers — speak or type. Advice only; you decide.",
    live: "WATCH ADVISOR · LIVE · no sensors",
    speakerOn: "Speaker on",
    speakerOff: "Speaker off",
  },
  es: {
    title: "Pilot",
    advisor: "ASESOR DE GUARDIA",
    ask: "Preguntar a Pilot…",
    send: "Enviar",
    hide: "Ocultar",
    open: "Abrir Pilot",
    empty:
      "Pilot está de guardia. Pregunte por StarWall, AGRON 1, los planes o los contenedores AGRON — voz o texto. Solo consejo; usted decide.",
    live: "ASESOR DE GUARDIA · LIVE · sin sensores",
    speakerOn: "Altavoz encendido",
    speakerOff: "Altavoz apagado",
  },
  fr: {
    title: "Pilot",
    advisor: "CONSEILLER DE QUART",
    ask: "Demander à Pilot…",
    send: "Envoyer",
    hide: "Masquer",
    open: "Ouvrir Pilot",
    empty:
      "Pilot est de quart. Interrogez StarWall, AGRON 1, les offres ou les conteneurs AGRON — voix ou texte. Conseil seulement ; vous décidez.",
    live: "CONSEILLER DE QUART · LIVE · aucun capteur",
    speakerOn: "Haut-parleur allumé",
    speakerOff: "Haut-parleur coupé",
  },
  de: {
    title: "Pilot",
    advisor: "WACHBERATER",
    ask: "Pilot fragen…",
    send: "Senden",
    hide: "Ausblenden",
    open: "Pilot öffnen",
    empty:
      "Pilot hat Wache. Fragen Sie zu StarWall, dem AGRON 1-Lagebild, den Plänen oder AGRON-Containern — Sprache oder Text. Nur Rat; Sie entscheiden.",
    live: "WACHBERATER · LIVE · keine Sensoren",
    speakerOn: "Lautsprecher an",
    speakerOff: "Lautsprecher aus",
  },
  ru: {
    title: "Pilot",
    advisor: "СОВЕТНИК ВАХТЫ",
    ask: "Спросить Pilot…",
    send: "Отправить",
    hide: "Скрыть",
    open: "Открыть Pilot",
    empty:
      "Pilot на вахте. Спросите про StarWall, картину AGRON 1, планы или контейнеры AGRON — голосом или текстом. Это совет; решение за вами.",
    live: "СОВЕТНИК ВАХТЫ · LIVE · нет датчиков",
    speakerOn: "Динамик включён",
    speakerOff: "Динамик выключен",
  },
  uk: {
    title: "Pilot",
    advisor: "РАДНИК ВАХТИ",
    ask: "Запитати Pilot…",
    send: "Надіслати",
    hide: "Сховати",
    open: "Відкрити Pilot",
    empty:
      "Pilot на вахті. Запитайте про StarWall, картину AGRON 1, плани або контейнери AGRON — голосом або текстом. Це порада; рішення за вами.",
    live: "РАДНИК ВАХТИ · LIVE · немає датчиків",
    speakerOn: "Динамік увімкнено",
    speakerOff: "Динамік вимкнено",
  },
  ar: {
    title: "Pilot",
    advisor: "مستشار الخفارة",
    ask: "اسأل Pilot…",
    send: "إرسال",
    hide: "إخفاء",
    open: "فتح Pilot",
    empty:
      "Pilot على الخفارة. اسأل عن StarWall أو صورة AGRON 1 أو الخطط أو حاويات AGRON — صوتاً أو كتابة. نصيحة فقط؛ القرار لكم.",
    live: "مستشار الخفارة · LIVE · لا مستشعرات",
    speakerOn: "مكبر الصوت يعمل",
    speakerOff: "مكبر الصوت مغلق",
  },
  zh: {
    title: "Pilot",
    advisor: "值班顾问",
    ask: "询问 Pilot…",
    send: "发送",
    hide: "隐藏",
    open: "打开 Pilot",
    empty:
      "Pilot 正在值班。可询问 StarWall、AGRON 1 画面、方案或 AGRON 集装箱 — 语音或文字。仅供建议，由您决定。",
    live: "值班顾问 · LIVE · 无传感器",
    speakerOn: "扬声器开",
    speakerOff: "扬声器关",
  },
  ja: {
    title: "Pilot",
    advisor: "当直アドバイザー",
    ask: "Pilot に尋ねる…",
    send: "送信",
    hide: "隠す",
    open: "Pilot を開く",
    empty:
      "Pilot は当直中です。StarWall、AGRON 1 の画面、プラン、AGRON コンテナについて音声または文字で尋ねてください。助言のみ。判断はあなたです。",
    live: "当直アドバイザー · LIVE · センサーなし",
    speakerOn: "スピーカーオン",
    speakerOff: "スピーカーオフ",
  },
  he: {
    title: "Pilot",
    advisor: "יועץ משמרת",
    ask: "לשאול את Pilot…",
    send: "שליחה",
    hide: "הסתרה",
    open: "פתיחת Pilot",
    empty:
      "Pilot במשמרת. שאלו על StarWall, תמונת ה-AGRON 1, התוכניות או מכולות AGRON — בדיבור או בכתב. ייעוץ בלבד; ההחלטה שלכם.",
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
