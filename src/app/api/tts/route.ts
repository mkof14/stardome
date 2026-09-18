import { NextResponse } from "next/server";
import { isLocale } from "@/lib/i18n/locales";
import {
  localeFromBody,
  synthesizePilotSpeech,
  ttsPlan,
} from "@/lib/pilot-tts";

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
  let body: { text?: unknown; locale?: unknown };
  try {
    body = (await request.json()) as { text?: unknown; locale?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) {
    return NextResponse.json({ error: "Text is required." }, { status: 400 });
  }

  const locale = localeFromBody(body.locale);

  try {
    const clip = await synthesizePilotSpeech(text, locale);
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
