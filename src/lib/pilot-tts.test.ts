import { afterEach, describe, expect, it } from "vitest";
import { locales } from "@/lib/i18n/locales";
import { escapeSsml, providersFor, ttsPlan } from "@/lib/pilot-tts";
import { maleVoiceFor } from "@/lib/pilot-voice";

const KEYS = [
  "AZURE_SPEECH_KEY",
  "AZURE_SPEECH_REGION",
  "OPENAI_API_KEY",
  "ELEVENLABS_API_KEY",
  "TTS_PROVIDER",
] as const;

const snapshot = Object.fromEntries(
  KEYS.map((key) => [key, process.env[key]]),
);

afterEach(() => {
  for (const key of KEYS) {
    const value = snapshot[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

describe("ttsPlan", () => {
  it("defaults to Edge male Neural voices with no keys", () => {
    for (const key of KEYS) delete process.env[key];
    for (const code of locales) {
      const plan = ttsPlan(code);
      expect(plan.provider).toBe("edge");
      expect(plan.voice).toBe(maleVoiceFor(code).voice);
      expect(providersFor(code)[0]).toBe("edge");
    }
  });

  it("prefers Azure when a speech key is present", () => {
    for (const key of KEYS) delete process.env[key];
    process.env.AZURE_SPEECH_KEY = "test-key";
    process.env.AZURE_SPEECH_REGION = "eastus";
    expect(ttsPlan("he")).toEqual({
      provider: "azure",
      voice: "he-IL-AvriNeural",
      lang: "he-IL",
    });
    expect(providersFor("he")).toEqual(["azure", "edge"]);
  });
});

describe("escapeSsml", () => {
  it("escapes markup so spoken text cannot break the voice request", () => {
    expect(escapeSsml(`Hold <radar> & "plot"`)).toBe(
      "Hold &lt;radar&gt; &amp; &quot;plot&quot;",
    );
  });
});
