import { NextResponse } from "next/server";
import { isLocale } from "@/lib/i18n/locales";
import { isSpeechTone } from "@/lib/pilot-speech";
import {
  localeFromBody,
  synthesizePilotSpeech,
  ttsPlan,
} from "@/lib/pilot-tts";
import { clientKey, rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const localeRaw = url.searchParams.get("locale") ?? "en";
  const locale = isLocale(localeRaw) ? localeRaw : "en";
  const plan = ttsPlan(locale);
  return NextResponse.json({
    ready: true,
    gender: "male",
    ...plan,
  });
}

export async function POST(request: Request) {
  const limited = rateLimit(clientKey(request, "tts"), 20, 60_000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfterMs);

  let body: { text?: unknown; locale?: unknown; tone?: unknown };
  try {
    body = (await request.json()) as { text?: unknown; locale?: unknown; tone?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) {
    return NextResponse.json({ error: "Text is required." }, { status: 400 });
  }

  const locale = localeFromBody(body.locale);
  const tone = isSpeechTone(body.tone) ? body.tone : "brief";

  try {
    const clip = await synthesizePilotSpeech(text, locale, tone);
    return new NextResponse(new Uint8Array(clip.audio), {
      status: 200,
      headers: {
        "Content-Type": clip.contentType,
        "Content-Length": String(clip.audio.length),
        "X-Pilot-Voice": clip.voice,
        "X-Pilot-Provider": clip.provider,
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
