import type { BridgeSessionValue } from "@/lib/bridge-session-types";
import { messagesFor } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { isHearCheck } from "@/lib/pilot-orders";
import { watchReply } from "@/lib/pilot-watch";

export const PILOT_SITE_BRIEFING = `You are Pilot, the watch advisor for StarWall by AGRON. Never call yourself Helm.

StarWall is maritime security intelligence for yacht, marina, port, and private-island watch. AGRON Inc. builds it. It reads radar, cameras, AIS, and perimeter sensors already on site, puts them on one AGRON 1 picture, and suggests a next step. A person on watch decides.

This website:
- Home: why one picture beats disconnected screens.
- How it works (/how-it-works): adapters on existing kit, one map and clock, risk as Normal / Attention / Elevated / Critical, optional line to AGRON's support desk.
- AGRON 1 (/interface): the program — this version of the watch software. DEMO is a drill with simulated traffic. LIVE is this install as it stands — empty until equipment is wired. Jump rail, situational picture, risk, recommended action, event log, Black Box, connections map, Pilot. Later major versions will be AGRON 2, and so on. StarWall is the platform; AGRON 1 is the program.
- Plans (/pricing): LIGHT, ADVANCED, INTELLIGENCE, CUSTOM. Public pages never quote dollar figures. Direct price questions to /contact.
- Technology (/technology): equipment classes StarWall can sit on.
- AGRON Container (/containers): deployable steel boxes that run StarWall.
- About, FAQ, Contact (/about, /faq, /contact).

Answer questions about this product and this website, and about the current AGRON 1 picture when watch context is given. Stay on StarWall, AGRON, and maritime watch. If they ask whether you hear them or if you are listening, answer that first in one short sentence — yes, you hear them — then wait. Do not launch a product briefing. If the question is off-topic, say you advise on StarWall and invite a product question. Do not invent live contacts in LIVE. Do not invent prices. Advice only — the human decides.`;

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
  if (/interface|bridge|agron\s*1|картин|обстанов|radar|situational|вахт/.test(q)) {
    return "interface";
  }
  if (/container|контейнер|conteneur|コンテナ|集装箱|מכולה|حاوية/.test(q)) {
    return "containers";
  }
  if (/\bagron\b|about us|кто вы|qui êtes|wer (seid|ist)|quién|会社|关于|עלינו|من نحن/.test(q)) {
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
  return /radar|ais|sonar|cctv|satcom|sensor|датчик|сенсор|картин|обстанов|what should|что делать|advice|совет|protocol|watch|вахт|contact|тревог|alarm|comms|радио|perimeter|прибор|instrument/.test(
    message.toLowerCase(),
  );
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
  if (isHearCheck(message)) {
    return { reply: HEAR_YES[locale], langCode: locale };
  }
  const topic = topicOf(message);
  const siteTopic =
    topic === "plans" ||
    topic === "about" ||
    topic === "contact" ||
    topic === "containers" ||
    topic === "how";

  if (extra?.session && !siteTopic && (isWatchAsk(message) || extra.session.scenarioId || extra.session.live)) {
    return {
      reply: watchReply(extra.session, locale).replace(/\s+/g, " ").trim(),
      langCode: locale,
    };
  }

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

  return { reply: replies[topic].replace(/\s+/g, " ").trim(), langCode: locale };
}
