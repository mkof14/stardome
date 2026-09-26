import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import {
  localPilotReply,
  PILOT_SITE_BRIEFING,
} from "@/lib/pilot-knowledge";
import { isLocale, locales, type Locale } from "@/lib/i18n/locales";
import { claudeMessages, clipChatHistory } from "@/lib/pilot-sim";
import { sessionFromAssistantContext, watchReply } from "@/lib/pilot-watch";
import { clientKey, rateLimit, rateLimitResponse } from "@/lib/rate-limit";

type AssistantBody = {
  message?: unknown;
  history?: unknown;
  context?: {
    scenarioName?: unknown;
    riskLevel?: unknown;
    vessel?: unknown;
    mode?: unknown;
    locale?: unknown;
    path?: unknown;
    scenarioId?: unknown;
    panelType?: unknown;
    actionText?: unknown;
    recommended?: unknown;
    logText?: unknown;
    crisis?: unknown;
    faultId?: unknown;
  };
};

function asText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function parseLangTag(raw: string, fallback: Locale) {
  const match = raw.match(/^\[LANG:([a-z]{2})\]\s*/i);
  const code = match?.[1]?.toLowerCase();
  const langCode = isLocale(code) ? code : fallback;
  const reply = raw.replace(/^\[LANG:[a-z]{2}\]\s*/i, "").trim();
  return { reply, langCode };
}

export async function POST(request: Request) {
  const limited = rateLimit(clientKey(request, "assistant"), 30, 60_000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfterMs);

  let body: AssistantBody;
  try {
    body = (await request.json()) as AssistantBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const message = asText(body.message, "");
  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const localeRaw = asText(body.context?.locale, "en");
  const locale = isLocale(localeRaw) ? localeRaw : "en";
  const path = asText(body.context?.path, "/");
  const history = clipChatHistory(body.history);
  const watchSession = sessionFromAssistantContext(body.context ?? {});
  const live = watchSession.live;
  const watchBrief = watchReply(watchSession, locale);
  const onWatch = path.startsWith("/interface");

  const situation = live
    ? "Current mode is LIVE. There is no live scenario or sensor data. This deployment is not connected to any radar, AIS, camera, or other equipment. If asked about current status, say you do not have live sensor data yet — this vessel is not connected to any equipment. They can ask about StarWall in general, or switch to DEMO mode to see a simulated scenario. Do not invent contacts, risk levels, equipment status, or events."
    : `Current StarDome 1 picture (DEMO): scenario is '${watchSession.scenarioName}', risk level is '${watchSession.riskLevel}', aboard ${watchSession.vessel}. Panel: ${watchSession.panelType}. ${watchBrief} Advice only — the person on watch decides.`;

  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      localPilotReply(message, locale, { path, session: watchSession }),
    );
  }

  const watchRule = onWatch
    ? " The visitor is on AGRON 1. If they ask you to talk, speak with them, greet you, or do not name a watch task, do not brief the picture. Ask what they care about and how you can help, then wait. If they ask whether you hear them, say yes in one short sentence and wait. Answer from the current picture only when they ask about contacts, radar, advice, instruments, comms, or the picture. Do not pitch the product or website unless they ask about plans, StarDome, containers, or how StarWall works."
    : "";

  const system = `${PILOT_SITE_BRIEFING} The visitor is on ${path}. Spoken and written StarWall languages: ${locales.join(", ")}. Context locale is ${locale}. ${situation}${watchRule} Use the recent conversation if they refer back. Respond in 2-4 sentences unless more detail is needed. IMPORTANT: Reply in the visitor's language (the message if it is one of those languages, otherwise ${locale}). At the very start of your response, output a language code in this exact format on its own first line: [LANG:xx] where xx is one of ${locales.join(", ")} — then a newline, then your actual response.`;

  try {
    const client = new Anthropic({ apiKey });
    const result = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      system,
      messages: claudeMessages(history, message),
    });

    const raw = result.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    if (!raw) {
      return NextResponse.json(
        localPilotReply(message, locale, { path, session: watchSession }),
      );
    }

    return NextResponse.json(parseLangTag(raw, locale));
  } catch {
    return NextResponse.json(
      localPilotReply(message, locale, { path, session: watchSession }),
    );
  }
}
