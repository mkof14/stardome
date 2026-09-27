import type { BridgeSessionValue } from "@/lib/bridge-session-types";
import { messagesFor } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { pilotChrome } from "@/lib/i18n/pilot-chrome";
import {
  isContentAsk,
  isProductFactAsk,
  pilotFactReply,
  pilotStationReply,
} from "@/lib/pilot-facts";
import { heardTopic, isHearCheck, isTalkOpen } from "@/lib/pilot-orders";
import { localWatchAnswer, watchAskKind } from "@/lib/pilot-sim";

export const PILOT_SITE_BRIEFING = `You are Pilot, the watch advisor for StarWall by StarDome. Never call yourself Helm.

StarWall is maritime security intelligence for yacht, marina, port, and private-island watch. StarDome Inc. builds it. AGRON 1 is this watch program. StarDome Container is the steel box. You answer product questions with the published figures. You do not invent prices or live contacts.

Hard facts (use these numbers; do not shrug or ask "how can I help" instead):
- 3D AESA radar: 360° air and surface, up to 15 km. That is the container suite, not the AGRON 1 drill rings.
- Multi-spectrum cameras: day, night, thermal, SWIR, up to 10 km.
- Acoustic sonar: underwater threats up to 1 km.
- Acoustic radar: low, slow, small targets and surface disturbances.
- Spectral analyzer: RF and signal intelligence.
- Interceptor UAVs (selected tiers): remote, 200+ km/h, up to 20 km, up to 25 min. A licensed operator authorizes. They do not launch themselves.
- EW and microwave bays: licensed, never self-trigger.
- Container: about 20 ft, ~9,500 kg, 10–15 kW, −30 to +50 °C, 72+ hours, ready under two hours.
- Plans: LIGHT, ADVANCED, INTELLIGENCE, CUSTOM. No dollar figures. Send price to /contact.
- Risk words: Normal, Attention, Elevated, Critical.
- DEMO is a drill. LIVE is this install — empty until sensors are wired.
- The captain or security officer decides. You advise.

This website:
- Home: why one picture beats disconnected screens.
- How it works (/how-it-works): adapters on existing kit, one map and clock, optional line to StarDome's support desk.
- AGRON 1 (/interface): the watch program. Jump rail, picture, risk, recommended action, event log, Black Box, connections map, Pilot.
- Plans (/pricing), Technology (/technology), containers (/containers), About, FAQ, Contact.

Answer every on-topic question. If they only greet you or say "talk to me" with no leftover topic, ask what they care about and how you can help, then wait. If they ask whether you hear them, say yes in one short sentence and wait. If a talk or speak order still names a topic — radar, cameras, drones, laser, pulse, air or underwater defense, ELINT, GIS, sensors, plans, DEMO/LIVE, Starlink, containers, or the picture — answer that topic. Never answer a real question with only «I am here. What do you care about» or «чем помочь». Do not repeat their question. Do not invent live contacts in LIVE. Advice only — the human decides.`;

type Topic =
  | "plans"
  | "how"
  | "interface"
  | "containers"
  | "about"
  | "contact"
  | "demo"
  | "general";

function detectLang(message: string, fallback: Locale): Locale {
  if (/[ієїґІЄЇҐ]/.test(message)) return "uk";
  if (/[\u0400-\u04FF]/.test(message)) return "ru";
  if (/[\u0600-\u06FF]/.test(message)) return "ar";
  if (/[\u0590-\u05FF]/.test(message)) return "he";
  if (/[\u3040-\u30ff]/.test(message)) return "ja";
  if (/[\u4e00-\u9fff]/.test(message)) return "zh";
  return fallback;
}

function topicOf(message: string): Topic {
  const q = message.toLowerCase();
  if (/plan|pricing|price|тариф|цен[аыу]|план|prix|preis|precio|料金|价格|מחיר|سعر/.test(q)) {
    return "plans";
  }
  if (/how it works|как работ|comment ça|wie (es )?funkt|cómo funciona|كيف|怎么|どう|איך|як працю/.test(q)) {
    return "how";
  }
  if (/interface|bridge|agron\s*1|stardome\s*1|картин|обстанов|radar|радар|situational|вахт/.test(q)) {
    return "interface";
  }
  if (/container|контейнер|conteneur|コンテナ|集装箱|מכולה|حاوية/.test(q)) {
    return "containers";
  }
  if (/\bagron\b|\bstardome\b|about us|кто вы|qui êtes|wer (seid|ist)|quién|会社|关于|עלינו|من نحن/.test(q)) {
    return "about";
  }
  if (/contact|связ|контакт|contacto|kontakt|連絡|联系|צור|اتصال/.test(q)) {
    return "contact";
  }
  if (/\blive\b|\bdemo\b|режим|датчик|sensor/.test(q)) {
    return "demo";
  }
  return "general";
}

const HEAR_YES: Record<Locale, string> = {
  en: "Yes. I hear you.",
  es: "Sí. Le escucho.",
  fr: "Oui. Je vous entends.",
  de: "Ja. Ich höre Sie.",
  ru: "Да. Слышу вас.",
  uk: "Так. Чую вас.",
  ar: "نعم. أسمعك.",
  zh: "听得到。",
  ja: "はい、聞こえています。",
  he: "כן. אני שומע.",
};

function isWatchAsk(message: string) {
  return /radar|радар|ais|sonar|сонар|cctv|satcom|sensor|датчик|сенсор|картин|обстанов|what should|что делать|advice|совет|protocol|watch|вахт|contact|тревог|alarm|comms|радио|perimeter|периметр|прибор|instrument|what('s| is| s) this|what is going on|what'?s going on|что это|что тут|что происходит|що це|що відбувається|что показывает/.test(
    message.toLowerCase(),
  );
}

export function isHelpOffer(text: string) {
  return /(что вас интересует|чем помочь|what do you care about|how can i help|en qué puedo ayudar|qu.est-ce qui vous occupe|was ist ihnen wichtig|що вас цікавить|أين أساعد)/i.test(
    text,
  );
}

export function pilotDirectReply(message: string, locale: Locale): string | null {
  if (isHearCheck(message)) return HEAR_YES[locale];
  const fact = pilotFactReply(message, locale) ?? (heardTopic(message)
    ? pilotFactReply(heardTopic(message), locale)
    : null);
  if (fact) return fact;
  const station = pilotStationReply(message, locale);
  if (station) return station;
  if (isTalkOpen(message)) return pilotChrome(locale).converseOffer;
  return null;
}

export function localPilotReply(
  message: string,
  fallbackLocale: string | undefined,
  extra?: { path?: string; session?: BridgeSessionValue },
): { reply: string; langCode: string } {
  const locale = detectLang(
    message,
    isLocale(fallbackLocale) ? fallbackLocale : "en",
  );
  const t = messagesFor(locale);
  const asked = heardTopic(message) || message;
  const direct = pilotDirectReply(message, locale);
  if (direct) {
    return { reply: direct, langCode: locale };
  }
  const topic = topicOf(message) !== "general" ? topicOf(message) : topicOf(asked);
  const siteTopic =
    topic === "plans" ||
    topic === "about" ||
    topic === "contact" ||
    topic === "containers" ||
    topic === "how";
  const onWatch = Boolean(extra?.path?.startsWith("/interface"));
  const session = extra?.session;
  const watchKind = watchAskKind(asked) ?? watchAskKind(message);
  const factAsk = isProductFactAsk(message) || isProductFactAsk(asked);
  const watchFirst =
    Boolean(session) &&
    !siteTopic &&
    !factAsk &&
    (Boolean(watchKind) || isWatchAsk(asked) || isWatchAsk(message));
  const replies: Record<Topic, string> = {
    general: `${t.home.lead} ${t.home.cards[1].body} ${t.chrome.footerBlurb}`,
    plans: `${t.home.cards[2].body} ${t.auth.bodies.pricing}`,
    how: `${t.how.steps[0].body} ${t.how.steps[1].body} ${t.how.steps[2].body}`,
    interface: `${t.home.interfaceLead} ${t.auth.bodies.bridge}`,
    containers: `${t.auth.bodies.containers} ${t.home.containersLink}`,
    about: `${t.auth.bodies.about} ${t.chrome.footerBlurb}`,
    contact: `${t.auth.bodies.contact} ${t.nav.contact}: /contact.`,
    demo: `${t.home.interfacePoints[5].body} ${t.home.cards[1].body}`,
  };

  if (session && watchFirst) {
    return {
      reply: localWatchAnswer(session, locale, asked).replace(/\s+/g, " ").trim(),
      langCode: locale,
    };
  }

  if ((onWatch || session) && !siteTopic && !factAsk && !isContentAsk(message) && !isContentAsk(asked)) {
    if (session) {
      return {
        reply: localWatchAnswer(session, locale, asked).replace(/\s+/g, " ").trim(),
        langCode: locale,
      };
    }
    return { reply: replies.interface.replace(/\s+/g, " ").trim(), langCode: locale };
  }

  return { reply: replies[topic].replace(/\s+/g, " ").trim(), langCode: locale };
}
