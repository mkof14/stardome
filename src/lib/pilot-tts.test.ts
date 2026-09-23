import { afterEach, describe, expect, it } from "vitest";
import { locales } from "@/lib/i18n/locales";
import { azureSsml, escapeSsml, providersFor, ttsPlan } from "@/lib/pilot-tts";
import { speechProsody, speechToneFor } from "@/lib/pilot-speech";
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

describe("speech tone", () => {
  it("speaks faster than the old slow watch voice", () => {
    const brief = speechProsody("brief");
    const warn = speechProsody("warn");
    expect(brief.rate.startsWith("+")).toBe(true);
    expect(brief.browserRate).toBeGreaterThan(1);
    expect(warn.browserPitch).toBeLessThan(brief.browserPitch);
    expect(warn.volume).toContain("+");
    expect(speechToneFor("Posted to the watch net. Confirm the designated.")).toBe(
      "warn",
    );
    expect(speechToneFor("Instruments are quiet.")).toBe("brief");
    expect(speechToneFor("Hold the picture.", true)).toBe("warn");
  });

  it("marks warning commands in SSML with a stronger voice", () => {
    const warn = azureSsml("Confirm the designated has it.", "en", "warn");
    const brief = azureSsml("Pilot on watch.", "en", "brief");
    expect(warn).toContain("emphasis");
    expect(warn).toContain('rate="+12%"');
    expect(warn).toContain("express-as");
    expect(brief).toContain('rate="+20%"');
    expect(brief).not.toContain("emphasis");
    expect(warn).toContain("Confirm the designated has it.");
  });
});
