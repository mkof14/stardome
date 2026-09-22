import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import {
  localPilotReply,
  PILOT_SITE_BRIEFING,
} from "@/lib/pilot-knowledge";
import { isLocale } from "@/lib/i18n/locales";
import { sessionFromAssistantContext, watchReply } from "@/lib/pilot-watch";
import { clientKey, rateLimit, rateLimitResponse } from "@/lib/rate-limit";

type AssistantBody = {
  message?: unknown;
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

function parseLangTag(raw: string) {
  const match = raw.match(/^\[LANG:([a-z]{2})\]\s*/i);
  const langCode = match?.[1]?.toLowerCase() ?? "en";
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
  const watchSession = sessionFromAssistantContext(body.context ?? {});
  const live = watchSession.live;
  const watchBrief = watchReply(watchSession, locale);

  const situation = live
    ? "Current mode is LIVE. There is no live scenario or sensor data. This deployment is not connected to any radar, AIS, camera, or other equipment. If asked about current status, say you do not have live sensor data yet — this vessel is not connected to any equipment. They can ask about StarWall in general, or switch to DEMO mode to see a simulated scenario. Do not invent contacts, risk levels, equipment status, or events."
    : `Current AGRON 1 picture (DEMO): scenario is '${watchSession.scenarioName}', risk level is '${watchSession.riskLevel}', aboard ${watchSession.vessel}. Panel: ${watchSession.panelType}. ${watchBrief} Advice only — the person on watch decides.`;

  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      localPilotReply(message, locale, { path, session: watchSession }),
    );
  }

  const system = `${PILOT_SITE_BRIEFING} The visitor is on ${path}. ${situation} Respond in 2-4 sentences unless more detail is needed. IMPORTANT: Respond in the exact same language the user's message is written in. At the very start of your response, output a language code in this exact format on its own first line: [LANG:xx] where xx is the ISO 639-1 code (e.g. [LANG:en], [LANG:ru], [LANG:fr]) — then a newline, then your actual response.`;

  try {
    const client = new Anthropic({ apiKey });
    const result = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      system,
      messages: [{ role: "user", content: message }],
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

    return NextResponse.json(parseLangTag(raw));
  } catch {
    return NextResponse.json(
      localPilotReply(message, locale, { path, session: watchSession }),
    );
  }
}
