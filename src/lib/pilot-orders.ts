import { normalizeHeard } from "@/lib/barge-in";

export type PilotOrder = "halt" | "listen" | "ask";

const HALT = new Set([
  "stop",
  "stopp",
  "enough",
  "quiet",
  "стоп",
  "остановись",
  "остановитесь",
  "останови",
  "остановите",
  "тишина",
  "молчи",
  "замолчи",
  "хватит",
  "прекрати",
  "прекратите",
  "зупинись",
  "зупиніться",
  "зупини",
  "мовчи",
  "доволі",
  "досить",
  "тиша",
  "basta",
  "silencio",
  "arrete",
  "arrête",
  "assez",
  "توقف",
  "صمت",
  "اسكت",
  "停止",
  "停下",
  "别说",
  "黙れ",
  "止まれ",
  "ストップ",
  "やめて",
  "עצור",
  "שקט",
  "די",
]);

const LISTEN = new Set([
  "listen",
  "listening",
  "слушай",
  "слушайте",
  "слухай",
  "слухайте",
  "escucha",
  "écoute",
  "ecoute",
  "zuhören",
  "استمع",
  "听",
  "聞け",
  "הקשב",
]);

const FILLER = new Set([
  "please",
  "now",
  "just",
  "пожалуйста",
  "сейчас",
  "просто",
  "будь",
  "ласка",
  "por",
  "favor",
  "s'il",
  "te",
  "bitte",
  "من",
  "فضلك",
  "请",
  "ください",
  "בבקשה",
  "pilot",
]);

export function isHaltOrder(heard: string) {
  const words = normalizeHeard(heard)
    .split(" ")
    .filter(Boolean)
    .filter((word) => !FILLER.has(word));
  if (!words.length || words.length > 3) return false;
  return words.every((word) => HALT.has(word));
}

export function isListenOrder(heard: string) {
  const words = normalizeHeard(heard)
    .split(" ")
    .filter(Boolean)
    .filter((word) => !FILLER.has(word));
  if (!words.length || words.length > 3) return false;
  return words.every((word) => LISTEN.has(word));
}

export function isHearCheck(heard: string) {
  const q = normalizeHeard(heard);
  return /(hear me|hearing me|can you hear|do you hear|are you listen|me escuch|m entends|horst du|слыш|чуеш|чуєш|تسمع|听得|听我|聞こ|שומע)/.test(
    q,
  );
}

/** A real watch ask, not a one-word mutter or a halt. Used to cut speech and answer. */
export function isOfficerAsk(heard: string) {
  if (isHaltOrder(heard) || isListenOrder(heard)) return false;
  const words = normalizeHeard(heard).split(" ").filter(Boolean);
  if (!words.length) return false;
  return words.length >= 2 || words.join("").length >= 8;
}

export function pilotOrder(heard: string): PilotOrder {
  if (isHaltOrder(heard)) return "halt";
  if (isListenOrder(heard)) return "listen";
  return "ask";
}
