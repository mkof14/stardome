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
  "заткнись",
  "молчать",
  "silence",
  "hush",
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
  "пилот",
]);

const TALK_GLUE = new Set([
  "to",
  "with",
  "me",
  "us",
  "you",
  "a",
  "the",
  "let",
  "lets",
  "can",
  "we",
  "i",
  "want",
  "start",
  "have",
  "со",
  "мной",
  "мною",
  "мне",
  "зі",
  "мною",
  "давай",
  "хочу",
  "conmigo",
  "avec",
  "moi",
  "mit",
  "mir",
  "معي",
  "listen",
  "listening",
  "слушай",
  "слушайте",
  "слухай",
  "меня",
  "тебя",
]);

const CONVERSE_WORD = new Set([
  "talk",
  "speak",
  "converse",
  "chat",
  "говори",
  "поговори",
  "поговорим",
  "пообщайся",
  "общайся",
  "разговаривай",
  "поговоримо",
  "hablemos",
  "parlons",
  "كلمني",
]);

const GREETING = new Set([
  "hi",
  "hey",
  "hello",
  "howdy",
  "привет",
  "здрасте",
  "здравствуй",
  "здравствуйте",
  "салют",
  "hola",
  "bonjour",
  "hallo",
  "שלום",
  "مرحبا",
  "你好",
  "こんにちは",
]);

const CONVERSE_PHRASE =
  /(talk to me|talk with me|speak to me|speak with me|speak with us|let s talk|lets talk|let us talk|can we talk|i want to talk|start talking|speak up|chat with me|have a (talk|chat|conversation)|listen to me|listen with me|говори со мной|говори со мною|поговори со мной|поговори со мною|давай поговорим|давай говорить|хочу поговорить|пообщайся со мной|общайся со мной|слушай меня|говори зі мною|давай поговоримо|habla conmigo|parle moi|parle avec moi|sprich mit mir|reden wir|تحدث معي|كلمني|跟我说话|跟我聊|話して|話そう|דבר איתי|תדבר איתי)/;

export function isHaltOrder(heard: string) {
  const words = normalizeHeard(heard)
    .split(" ")
    .filter(Boolean)
    .filter((word) => !FILLER.has(word));
  if (!words.length || words.length > 6) return false;
  return words.some((word) => HALT.has(word));
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

export function isConverseOffer(heard: string) {
  const q = normalizeHeard(heard);
  if (CONVERSE_PHRASE.test(q)) return true;
  const words = q
    .split(" ")
    .filter(Boolean)
    .filter((word) => !FILLER.has(word));
  if (!words.length || words.length > 6) return false;
  return words.some((word) => CONVERSE_WORD.has(word));
}

export function isGreeting(heard: string) {
  const q = normalizeHeard(heard);
  if (
    /^(добрый (день|вечер)|доброе утро|guten tag|good (morning|afternoon|evening|day))$/.test(
      q,
    )
  ) {
    return true;
  }
  const words = q
    .split(" ")
    .filter(Boolean)
    .filter((word) => !FILLER.has(word));
  if (!words.length || words.length > 2) return false;
  return GREETING.has(words[0] ?? "");
}

function leftoverAfterTalk(heard: string) {
  return normalizeHeard(heard)
    .split(" ")
    .filter((word) => word.length > 1)
    .filter((word) => !FILLER.has(word) && !CONVERSE_WORD.has(word) && !GREETING.has(word) && !TALK_GLUE.has(word));
}

/** Talk-to-me or a greeting with no other question attached. */
export function isTalkOpen(heard: string) {
  if (!(isConverseOffer(heard) || isGreeting(heard))) return false;
  return leftoverAfterTalk(heard).length === 0;
}

/** A real watch ask, not a one-word mutter or a halt. Used to cut speech and answer. */
export function isOfficerAsk(heard: string) {
  if (isHaltOrder(heard) || isListenOrder(heard)) return false;
  if (isTalkOpen(heard) || isHearCheck(heard)) return true;
  const words = normalizeHeard(heard).split(" ").filter(Boolean);
  if (!words.length) return false;
  return words.length >= 2 || words.join("").length >= 8;
}

export function pilotOrder(heard: string): PilotOrder {
  if (isHaltOrder(heard)) return "halt";
  if (isListenOrder(heard)) return "listen";
  return "ask";
}
