import { Readable } from "node:stream";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import {
  isSpeechSpeaker,
  speechProsody,
  ssmlInner,
  type SpeechSpeaker,
  type SpeechTone,
} from "@/lib/pilot-speech";
import { neuralVoiceFor } from "@/lib/pilot-voice";

export const TTS_MAX_CHARS = 1800;

/** Premade ElevenLabs voices: Adam (Pilot) and Josh (officer). */
export const ELEVEN_PILOT_VOICE = "pNInz6obpgDQGcFmaJgB";
export const ELEVEN_OFFICER_VOICE = "TxGEqnHWrfWFTfGW9XjX";

export type TtsProvider = "azure" | "edge" | "openai" | "elevenlabs";

export type SpeechClip = {
  audio: Buffer;
  contentType: string;
  provider: TtsProvider;
  voice: string;
  speaker: SpeechSpeaker;
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

export function elevenVoiceId(speaker: SpeechSpeaker = "pilot") {
  if (speaker === "officer") {
    return (
      envText("ELEVENLABS_OFFICER_VOICE_ID") || ELEVEN_OFFICER_VOICE
    );
  }
  return (
    envText("ELEVENLABS_PILOT_VOICE_ID") ||
    envText("ELEVENLABS_VOICE_ID") ||
    ELEVEN_PILOT_VOICE
  );
}

function openaiVoiceId(speaker: SpeechSpeaker = "pilot") {
  if (speaker === "officer") {
    return envText("OPENAI_OFFICER_TTS_VOICE") || "echo";
  }
  return envText("OPENAI_TTS_VOICE") || "onyx";
}

export function ttsPlan(
  locale: Locale,
  speaker: SpeechSpeaker = "pilot",
): {
  provider: TtsProvider;
  voice: string;
  lang: string;
} {
  const neural = neuralVoiceFor(locale, speaker);
  const forced = envText("TTS_PROVIDER").toLowerCase();
  if (forced === "azure" && azureReady()) {
    return { provider: "azure", ...neural };
  }
  if (forced === "openai" && openaiReady()) {
    return {
      provider: "openai",
      voice: openaiVoiceId(speaker),
      lang: neural.lang,
    };
  }
  if (forced === "elevenlabs" && elevenReady()) {
    return {
      provider: "elevenlabs",
      voice: elevenVoiceId(speaker),
      lang: neural.lang,
    };
  }
  if (forced === "edge") return { provider: "edge", ...neural };
  if (elevenReady()) {
    return {
      provider: "elevenlabs",
      voice: elevenVoiceId(speaker),
      lang: neural.lang,
    };
  }
  if (azureReady()) return { provider: "azure", ...neural };
  return { provider: "edge", ...neural };
}

export function ttsVoices(locale: Locale) {
  return {
    pilot: ttsPlan(locale, "pilot").voice,
    officer: ttsPlan(locale, "officer").voice,
  };
}

export function providersFor(locale: Locale): TtsProvider[] {
  const preferred = ttsPlan(locale).provider;
  const available: TtsProvider[] = [];
  if (elevenReady()) available.push("elevenlabs");
  if (azureReady()) available.push("azure");
  available.push("edge");
  if (openaiReady()) available.push("openai");
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

async function synthEdge(
  text: string,
  locale: Locale,
  tone: SpeechTone,
  speaker: SpeechSpeaker,
): Promise<SpeechClip> {
  return withRetry(async () => {
    const neural = neuralVoiceFor(locale, speaker);
    const voice = speechProsody(tone);
    const tts = new MsEdgeTTS();
    try {
      await tts.setMetadata(
        neural.voice,
        OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3,
      );
      const { audioStream } = tts.toStream(escapeSsml(text), {
        rate: voice.rate,
        pitch: voice.pitch,
        volume: voice.volume,
      });
      const audio = await bufferFromAudioStream(audioStream, 22_000);
      return {
        audio,
        contentType: "audio/mpeg",
        provider: "edge",
        voice: neural.voice,
        speaker,
      };
    } finally {
      tts.close();
    }
  });
}

export function azureSsml(
  text: string,
  locale: Locale,
  tone: SpeechTone,
  speaker: SpeechSpeaker = "pilot",
) {
  const neural = neuralVoiceFor(locale, speaker);
  const voice = speechProsody(tone);
  const inner = ssmlInner(text, tone, escapeSsml);
  const style =
    tone === "warn"
      ? `<mstts:express-as style="customerservice" styledegree="2"><prosody rate="${voice.rate}" pitch="${voice.pitch}" volume="${voice.volume}">${inner}</prosody></mstts:express-as>`
      : `<prosody rate="${voice.rate}" pitch="${voice.pitch}" volume="${voice.volume}">${inner}</prosody>`;
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="${neural.lang}"><voice name="${neural.voice}">${style}</voice></speak>`;
}

async function synthAzure(
  text: string,
  locale: Locale,
  tone: SpeechTone,
  speaker: SpeechSpeaker,
): Promise<SpeechClip> {
  const neural = neuralVoiceFor(locale, speaker);
  const region = envText("AZURE_SPEECH_REGION") || "eastus";
  const ssml = azureSsml(text, locale, tone, speaker);
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
    voice: neural.voice,
    speaker,
  };
}

async function synthOpenAI(
  text: string,
  speaker: SpeechSpeaker,
): Promise<SpeechClip> {
  const voice = openaiVoiceId(speaker);
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
  return {
    audio,
    contentType: "audio/mpeg",
    provider: "openai",
    voice,
    speaker,
  };
}

export function elevenVoiceSettings(tone: SpeechTone, speaker: SpeechSpeaker) {
  if (speaker === "officer") {
    return tone === "warn"
      ? {
          stability: 0.38,
          similarity_boost: 0.72,
          style: 0.42,
          use_speaker_boost: true,
          speed: 1.05,
        }
      : {
          stability: 0.58,
          similarity_boost: 0.7,
          style: 0.08,
          use_speaker_boost: true,
          speed: 1.08,
        };
  }
  return tone === "warn"
    ? {
        stability: 0.28,
        similarity_boost: 0.82,
        style: 0.55,
        use_speaker_boost: true,
        speed: 1.05,
      }
    : {
        stability: 0.42,
        similarity_boost: 0.78,
        style: 0.18,
        use_speaker_boost: true,
        speed: 1.15,
      };
}

async function synthEleven(
  text: string,
  tone: SpeechTone,
  speaker: SpeechSpeaker,
): Promise<SpeechClip> {
  const voice = elevenVoiceId(speaker);
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
        voice_settings: elevenVoiceSettings(tone, speaker),
      }),
    },
  );
  if (!res.ok) throw new Error(`ElevenLabs speech ${res.status}`);
  const audio = Buffer.from(await res.arrayBuffer());
  if (!audio.length) throw new Error("ElevenLabs returned empty audio.");
  return {
    audio,
    contentType: "audio/mpeg",
    provider: "elevenlabs",
    voice,
    speaker,
  };
}

export async function synthesizePilotSpeech(
  text: string,
  locale: Locale,
  tone: SpeechTone = "brief",
  speaker: SpeechSpeaker = "pilot",
): Promise<SpeechClip> {
  const clipped = text.trim().slice(0, TTS_MAX_CHARS);
  if (!clipped) throw new Error("Text is required.");
  const who = isSpeechSpeaker(speaker) ? speaker : "pilot";
  const errors: string[] = [];
  for (const provider of providersFor(locale)) {
    try {
      if (provider === "azure") {
        return await synthAzure(clipped, locale, tone, who);
      }
      if (provider === "edge") {
        return await synthEdge(clipped, locale, tone, who);
      }
      if (provider === "openai") return await synthOpenAI(clipped, who);
      if (provider === "elevenlabs") {
        return await synthEleven(clipped, tone, who);
      }
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
