import { normalizeHeard } from "@/lib/barge-in";

export type PilotOrder = "halt" | "listen" | "ask";

const HALT = new Set([
  "stop",
  "stopp",
  "halt",
  "enough",
  "quiet",
  "silence",
  "hush",
  "mute",
  "cancel",
  "wait",
  "стоп",
  "остановись",
  "остановитесь",
  "останови",
  "остановите",
  "стой",
  "тише",
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
  "alto",
  "basta",
  "silencio",
  "para",
  "stoppe",
  "arrete",
  "arrête",
  "assez",
  "ruhe",
  "genug",
  "still",
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

export function pilotOrder(heard: string): PilotOrder {
  if (isHaltOrder(heard)) return "halt";
  if (isListenOrder(heard)) return "listen";
  return "ask";
}
