import { afterEach, describe, expect, it } from "vitest";
import { locales } from "@/lib/i18n/locales";
import {
  azureSsml,
  ELEVEN_OFFICER_VOICE,
  ELEVEN_PILOT_VOICE,
  elevenVoiceId,
  elevenVoiceSettings,
  escapeSsml,
  providersFor,
  ttsPlan,
  ttsVoices,
} from "@/lib/pilot-tts";
import { speechProsody, speechToneFor } from "@/lib/pilot-speech";
import { maleVoiceFor, officerVoiceFor } from "@/lib/pilot-voice";

const KEYS = [
  "AZURE_SPEECH_KEY",
  "AZURE_SPEECH_REGION",
  "OPENAI_API_KEY",
  "ELEVENLABS_API_KEY",
  "ELEVENLABS_VOICE_ID",
  "ELEVENLABS_PILOT_VOICE_ID",
  "ELEVENLABS_OFFICER_VOICE_ID",
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

  it("prefers ElevenLabs when that key is present, even if Azure is also set", () => {
    for (const key of KEYS) delete process.env[key];
    process.env.ELEVENLABS_API_KEY = "xi-test";
    process.env.AZURE_SPEECH_KEY = "azure-test";
    expect(ttsPlan("en")).toEqual({
      provider: "elevenlabs",
      voice: ELEVEN_PILOT_VOICE,
      lang: "en-US",
    });
    expect(ttsPlan("en", "officer")).toEqual({
      provider: "elevenlabs",
      voice: ELEVEN_OFFICER_VOICE,
      lang: "en-US",
    });
    expect(ttsVoices("en")).toEqual({
      pilot: ELEVEN_PILOT_VOICE,
      officer: ELEVEN_OFFICER_VOICE,
    });
    expect(providersFor("en")[0]).toBe("elevenlabs");
  });

  it("keeps Azure when TTS_PROVIDER forces it", () => {
    for (const key of KEYS) delete process.env[key];
    process.env.ELEVENLABS_API_KEY = "xi-test";
    process.env.AZURE_SPEECH_KEY = "azure-test";
    process.env.TTS_PROVIDER = "azure";
    expect(ttsPlan("ru", "pilot").provider).toBe("azure");
    expect(ttsPlan("ru", "officer").voice).toBe(officerVoiceFor("ru").voice);
  });

  it("maps officer and Pilot to different ElevenLabs voice ids", () => {
    for (const key of KEYS) delete process.env[key];
    expect(elevenVoiceId("pilot")).toBe(ELEVEN_PILOT_VOICE);
    expect(elevenVoiceId("officer")).toBe(ELEVEN_OFFICER_VOICE);
    process.env.ELEVENLABS_PILOT_VOICE_ID = "pilot-custom";
    process.env.ELEVENLABS_OFFICER_VOICE_ID = "officer-custom";
    expect(elevenVoiceId("pilot")).toBe("pilot-custom");
    expect(elevenVoiceId("officer")).toBe("officer-custom");
    const warn = elevenVoiceSettings("warn", "pilot");
    const brief = elevenVoiceSettings("brief", "officer");
    expect(warn.stability).toBeLessThan(brief.stability);
    expect(warn.style).toBeGreaterThan(brief.style);
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

  it("puts the officer on a second neural voice", () => {
    const officer = azureSsml("Pilot, instruments.", "ru", "brief", "officer");
    const pilot = azureSsml("Instruments are quiet.", "ru", "brief", "pilot");
    expect(officer).toContain(officerVoiceFor("ru").voice);
    expect(pilot).toContain(maleVoiceFor("ru").voice);
    expect(officerVoiceFor("ru").voice).not.toBe(maleVoiceFor("ru").voice);
  });
});
