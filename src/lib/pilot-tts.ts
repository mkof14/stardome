import { Readable } from "node:stream";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { maleVoiceFor } from "@/lib/pilot-voice";

export const TTS_MAX_CHARS = 1800;

export type TtsProvider = "azure" | "edge" | "openai" | "elevenlabs";

export type SpeechClip = {
  audio: Buffer;
  contentType: string;
  provider: TtsProvider;
  voice: string;
};

export function escapeSsml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function envText(name: string) {
  return process.env[name]?.trim() ?? "";
}

function azureReady() {
  return Boolean(envText("AZURE_SPEECH_KEY"));
}

function openaiReady() {
  return Boolean(envText("OPENAI_API_KEY"));
}

function elevenReady() {
  return Boolean(envText("ELEVENLABS_API_KEY"));
}

export function ttsPlan(locale: Locale): {
  provider: TtsProvider;
  voice: string;
  lang: string;
} {
  const male = maleVoiceFor(locale);
  const forced = envText("TTS_PROVIDER").toLowerCase();
  if (forced === "azure" && azureReady()) {
    return { provider: "azure", ...male };
  }
  if (forced === "openai" && openaiReady()) {
    return {
      provider: "openai",
      voice: envText("OPENAI_TTS_VOICE") || "onyx",
      lang: male.lang,
    };
  }
  if (forced === "elevenlabs" && elevenReady()) {
    return {
      provider: "elevenlabs",
      voice: envText("ELEVENLABS_VOICE_ID") || "pNInz6obpgDQGcFmaJgB",
      lang: male.lang,
    };
  }
  if (forced === "edge") return { provider: "edge", ...male };
  if (azureReady()) return { provider: "azure", ...male };
  return { provider: "edge", ...male };
}

export function providersFor(locale: Locale): TtsProvider[] {
  const preferred = ttsPlan(locale).provider;
  const available: TtsProvider[] = [];
  if (azureReady()) available.push("azure");
  available.push("edge");
  if (openaiReady()) available.push("openai");
  if (elevenReady()) available.push("elevenlabs");
  return [preferred, ...available.filter((name) => name !== preferred)];
}

function bufferFromAudioStream(stream: Readable, timeoutMs: number) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const timer = setTimeout(() => {
      stream.destroy(new Error("Speech timed out."));
    }, timeoutMs);
    stream.on("data", (chunk: Buffer | Uint8Array | string) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    stream.once("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
    stream.once("end", () => {
      clearTimeout(timer);
      const audio = Buffer.concat(chunks);
      if (!audio.length) reject(new Error("No audio data received."));
      else resolve(audio);
    });
  });
}

async function withRetry<T>(run: () => Promise<T>, attempts = 3): Promise<T> {
  let last: unknown;
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await run();
    } catch (err) {
      last = err;
    }
  }
  throw last instanceof Error ? last : new Error("Speech is unavailable.");
}

async function synthEdge(text: string, locale: Locale): Promise<SpeechClip> {
  return withRetry(async () => {
    const male = maleVoiceFor(locale);
    const tts = new MsEdgeTTS();
    try {
      await tts.setMetadata(
        male.voice,
        OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3,
      );
      const { audioStream } = tts.toStream(escapeSsml(text), {
        rate: "-8%",
        pitch: "-5Hz",
        volume: "+22%",
      });
      const audio = await bufferFromAudioStream(audioStream, 22_000);
      return {
        audio,
        contentType: "audio/mpeg",
        provider: "edge",
        voice: male.voice,
      };
    } finally {
      tts.close();
    }
  });
}

async function synthAzure(text: string, locale: Locale): Promise<SpeechClip> {
  const male = maleVoiceFor(locale);
  const region = envText("AZURE_SPEECH_REGION") || "eastus";
  const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="${male.lang}"><voice name="${male.voice}"><prosody rate="-8%" pitch="-5Hz" volume="+22%">${escapeSsml(text)}</prosody></voice></speak>`;
  const res = await fetch(
    `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
    {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": envText("AZURE_SPEECH_KEY"),
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
        "User-Agent": "starwall-pilot",
      },
      body: ssml,
    },
  );
  if (!res.ok) throw new Error(`Azure speech ${res.status}`);
  const audio = Buffer.from(await res.arrayBuffer());
  if (!audio.length) throw new Error("Azure returned empty audio.");
  return {
    audio,
    contentType: "audio/mpeg",
    provider: "azure",
    voice: male.voice,
  };
}

async function synthOpenAI(text: string): Promise<SpeechClip> {
  const voice = envText("OPENAI_TTS_VOICE") || "onyx";
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${envText("OPENAI_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: envText("OPENAI_TTS_MODEL") || "tts-1-hd",
      voice,
      input: text,
      response_format: "mp3",
    }),
  });
  if (!res.ok) throw new Error(`OpenAI speech ${res.status}`);
  const audio = Buffer.from(await res.arrayBuffer());
  if (!audio.length) throw new Error("OpenAI returned empty audio.");
  return { audio, contentType: "audio/mpeg", provider: "openai", voice };
}

async function synthEleven(text: string): Promise<SpeechClip> {
  const voice = envText("ELEVENLABS_VOICE_ID") || "pNInz6obpgDQGcFmaJgB";
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice)}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": envText("ELEVENLABS_API_KEY"),
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: envText("ELEVENLABS_MODEL") || "eleven_multilingual_v2",
      }),
    },
  );
  if (!res.ok) throw new Error(`ElevenLabs speech ${res.status}`);
  const audio = Buffer.from(await res.arrayBuffer());
  if (!audio.length) throw new Error("ElevenLabs returned empty audio.");
  return { audio, contentType: "audio/mpeg", provider: "elevenlabs", voice };
}

export async function synthesizePilotSpeech(
  text: string,
  locale: Locale,
): Promise<SpeechClip> {
  const clipped = text.trim().slice(0, TTS_MAX_CHARS);
  if (!clipped) throw new Error("Text is required.");
  const errors: string[] = [];
  for (const provider of providersFor(locale)) {
    try {
      if (provider === "azure") return await synthAzure(clipped, locale);
      if (provider === "edge") return await synthEdge(clipped, locale);
      if (provider === "openai") return await synthOpenAI(clipped);
      if (provider === "elevenlabs") return await synthEleven(clipped);
    } catch (err) {
      errors.push(
        `${provider}: ${err instanceof Error ? err.message : "failed"}`,
      );
    }
  }
  throw new Error(errors.join("; ") || "Speech is unavailable.");
}

export function localeFromBody(raw: unknown): Locale {
  return typeof raw === "string" && isLocale(raw) ? raw : "en";
}
