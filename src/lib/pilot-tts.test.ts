import { afterEach, describe, expect, it } from "vitest";
import { locales } from "@/lib/i18n/locales";
import {
  azureSsml,
  ELEVEN_OFFICER_VOICE,
  ELEVEN_PILOT_VOICE,
  elevenLanguageCode,
  elevenVoiceId,
  elevenVoiceSettings,
  escapeSsml,
  providersFor,
  ttsCatalog,
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
  "ELEVENLABS_PILOT_VOICE_ID_RU",
  "ELEVENLABS_OFFICER_VOICE_ID_JA",
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
    process.env.ELEVENLABS_PILOT_VOICE_ID_RU = "pilot-ru";
    process.env.ELEVENLABS_OFFICER_VOICE_ID_JA = "officer-ja";
    expect(elevenVoiceId("pilot", "en")).toBe("pilot-custom");
    expect(elevenVoiceId("officer", "en")).toBe("officer-custom");
    expect(elevenVoiceId("pilot", "ru")).toBe("pilot-ru");
    expect(elevenVoiceId("officer", "ja")).toBe("officer-ja");
    const warn = elevenVoiceSettings("warn", "pilot");
    const brief = elevenVoiceSettings("brief", "officer");
    expect(warn.stability).toBeLessThan(brief.stability);
    expect(warn.style).toBeGreaterThan(brief.style);
  });

  it("covers every StarWall language with two distinct voices", () => {
    for (const key of KEYS) delete process.env[key];
    const catalog = ttsCatalog();
    expect(catalog.map((row) => row.locale)).toEqual([...locales]);
    for (const row of catalog) {
      expect(row.eleven).toBe(elevenLanguageCode(row.locale));
      expect(row.pilot).not.toBe(row.officer);
      expect(row.lang.length).toBeGreaterThan(2);
      expect(row.native.length).toBeGreaterThan(0);
      expect(ttsPlan(row.locale, "pilot").voice).toBe(row.pilot);
      expect(ttsPlan(row.locale, "officer").voice).toBe(row.officer);
    }
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
  it("holds a measured captain voice, lower and firmer on warning", () => {
    const brief = speechProsody("brief");
    const warn = speechProsody("warn");
    expect(brief.rate.startsWith("-")).toBe(true);
    expect(brief.browserRate).toBeLessThan(1);
    expect(brief.browserPitch).toBeLessThan(0.9);
    expect(warn.browserPitch).toBeLessThan(brief.browserPitch);
    expect(warn.volume).toContain("+");
    expect(brief.style).toBe("narration-professional");
    expect(warn.style).toBe("newscast");
    expect(speechToneFor("Posted to the watch net. Confirm the designated.")).toBe(
      "warn",
    );
    expect(speechToneFor("Instruments are quiet.")).toBe("brief");
    expect(speechToneFor("Hold the picture.", true)).toBe("warn");
    expect(speechToneFor("C'est une alarme urgente.")).toBe("warn");
    expect(speechToneFor("Das ist kritisch.")).toBe("warn");
    expect(speechToneFor("Сповістити призначеного.")).toBe("warn");
    expect(speechToneFor("立即撤离。")).toBe("warn");
  });

  it("marks warning commands in SSML with a stronger captain voice", () => {
    const warn = azureSsml("Confirm the designated has it.", "en", "warn");
    const brief = azureSsml("Pilot on watch. Instruments are quiet.", "en", "brief");
    expect(warn).toContain("emphasis");
    expect(warn).toContain('rate="+4%"');
    expect(warn).toContain('style="newscast"');
    expect(brief).toContain('rate="-6%"');
    expect(brief).toContain("narration-professional");
    expect(brief).toContain("break");
    expect(brief).not.toContain("emphasis");
    expect(brief).not.toContain("customerservice");
    expect(warn).toContain("Confirm the designated has it.");
    expect(warn).toContain("en-US-DavisNeural");
  });

  it("puts the officer on a second neural voice", () => {
    const officer = azureSsml("Pilot, instruments.", "ru", "brief", "officer");
    const pilot = azureSsml("Instruments are quiet.", "ru", "brief", "pilot");
    expect(officer).toContain(officerVoiceFor("ru").voice);
    expect(pilot).toContain(maleVoiceFor("ru").voice);
    expect(officerVoiceFor("ru").voice).not.toBe(maleVoiceFor("ru").voice);
    expect(officerVoiceFor("ru").voice).toMatch(/Brian/);
    expect(officerVoiceFor("ru").voice).not.toMatch(/Svetlana|Polina|Hila|Zariyah/i);
  });
});
