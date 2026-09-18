import { describe, expect, it } from "vitest";
import { locales } from "@/lib/i18n/locales";
import { pilotDemoCopy } from "@/lib/i18n/pilot-demo-copy";
import { demoBeats, voiceNeedLine } from "@/lib/pilot-demo";
import {
  isLikelyMaleVoice,
  maleVoiceFor,
  pickVoice,
  speakTag,
  voiceNeed,
} from "@/lib/pilot-voice";
import type { BridgeSessionValue } from "@/lib/bridge-session-types";

const idle: BridgeSessionValue = {
  scenarioName: "Normal watch",
  riskLevel: "NORMAL",
  vessel: "M/Y AURELIA",
  scenarioId: "",
  panelType: "radar",
  actionText: "",
  recommended: "",
  logText: "",
  crisis: false,
  faultId: null,
  live: false,
};

describe("pilotDemoCopy", () => {
  it("has a Demo label and watch calls in every locale", () => {
    for (const code of locales) {
      const copy = pilotDemoCopy(code);
      expect(copy.demo.length).toBeGreaterThan(0);
      expect(copy.callStatus.toLowerCase()).toMatch(/pilot/);
      expect(copy.intro.toLowerCase()).not.toMatch(/\bcommand\b/);
    }
  });
});

describe("demoBeats", () => {
  it("stays honest in LIVE and drills instruments in DEMO", () => {
    const live = demoBeats({ ...idle, live: true }, "en");
    expect(live).toHaveLength(1);
    expect(live[0]?.text).toMatch(/LIVE/);
    const demo = demoBeats(idle, "ru");
    expect(demo.some((beat) => beat.role === "officer")).toBe(true);
    expect(demo.some((beat) => beat.raise?.instruments)).toBe(true);
    expect(demo.some((beat) => beat.raise?.comms)).toBe(true);
  });
});

describe("pickVoice", () => {
  it("prefers an exact BCP-47 match for the locale", () => {
    const voices = [
      { lang: "en-US", name: "English US", localService: true },
      { lang: "ru-RU", name: "Russian", localService: true },
      { lang: "uk-UA", name: "Ukrainian", localService: false },
    ];
    expect(pickVoice(voices, "ru")?.name).toBe("Russian");
    expect(pickVoice(voices, "uk")?.name).toBe("Ukrainian");
    expect(speakTag("he")).toBe("he-IL");
    expect(voiceNeed("ja", []).tts).toBe("none");
    expect(voiceNeed("en", voices).tts).toBe("native");
    expect(voiceNeed("zh", voices).tts).toBe("fallback");
  });

  it("prefers a male voice over a female voice in the same language", () => {
    const voices = [
      { lang: "en-US", name: "Microsoft Zira", localService: true },
      { lang: "en-US", name: "Microsoft David", localService: false },
      { lang: "ru-RU", name: "Microsoft Irina", localService: true },
    ];
    expect(pickVoice(voices, "en")?.name).toBe("Microsoft David");
    expect(isLikelyMaleVoice("Microsoft David")).toBe(true);
    expect(isLikelyMaleVoice("Microsoft Zira")).toBe(false);
  });
});

describe("male neural voices", () => {
  it("maps every site language to a male Neural voice", () => {
    for (const code of locales) {
      const male = maleVoiceFor(code);
      expect(male.voice).toMatch(/Neural$/);
      expect(male.lang.toLowerCase().startsWith(code === "zh" ? "zh" : code)).toBe(
        true,
      );
      const copy = pilotDemoCopy(code);
      expect(copy.voiceNeural).toMatch(/\{lang\}/);
      expect(copy.voiceNeural).toMatch(/\{voice\}/);
      const line = voiceNeedLine(code, {
        tts: "neural",
        stt: "ready",
        voiceName: male.voice,
      });
      expect(line).toContain(male.voice);
    }
    expect(
      voiceNeed("ru", [], {
        ready: true,
        voice: "ru-RU-DmitryNeural",
        provider: "edge",
      }).tts,
    ).toBe("neural");
  });
});
