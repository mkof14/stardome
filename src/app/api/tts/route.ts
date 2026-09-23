import { NextResponse } from "next/server";
import { isLocale } from "@/lib/i18n/locales";
import { isSpeechSpeaker, isSpeechTone } from "@/lib/pilot-speech";
import {
  localeFromBody,
  synthesizePilotSpeech,
  ttsPlan,
  ttsVoices,
} from "@/lib/pilot-tts";
import { clientKey, rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const localeRaw = url.searchParams.get("locale") ?? "en";
  const locale = isLocale(localeRaw) ? localeRaw : "en";
  const speaker = isSpeechSpeaker(url.searchParams.get("speaker"))
    ? url.searchParams.get("speaker")
    : "pilot";
  const plan = ttsPlan(locale, speaker === "officer" ? "officer" : "pilot");
  const voices = ttsVoices(locale);
  return NextResponse.json({
    ready: true,
    gender: "male",
    ...plan,
    officerVoice: voices.officer,
    voices,
  });
}

export async function POST(request: Request) {
  const limited = rateLimit(clientKey(request, "tts"), 40, 60_000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfterMs);

  let body: {
    text?: unknown;
    locale?: unknown;
    tone?: unknown;
    speaker?: unknown;
  };
  try {
    body = (await request.json()) as {
      text?: unknown;
      locale?: unknown;
      tone?: unknown;
      speaker?: unknown;
    };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) {
    return NextResponse.json({ error: "Text is required." }, { status: 400 });
  }

  const locale = localeFromBody(body.locale);
  const tone = isSpeechTone(body.tone) ? body.tone : "brief";
  const speaker = isSpeechSpeaker(body.speaker) ? body.speaker : "pilot";

  try {
    const clip = await synthesizePilotSpeech(text, locale, tone, speaker);
    return new NextResponse(new Uint8Array(clip.audio), {
      status: 200,
      headers: {
        "Content-Type": clip.contentType,
        "Content-Length": String(clip.audio.length),
        "X-Pilot-Voice": clip.voice,
        "X-Pilot-Provider": clip.provider,
        "X-Pilot-Speaker": clip.speaker,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Speech is unavailable." },
      { status: 503 },
    );
  }
}
