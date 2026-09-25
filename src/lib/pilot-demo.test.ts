import { describe, expect, it } from "vitest";
import { locales } from "@/lib/i18n/locales";
import { pilotDemoCopy } from "@/lib/i18n/pilot-demo-copy";
import { demoBeats, voiceNeedLine } from "@/lib/pilot-demo";
import {
  isLikelyFemaleVoice,
  isLikelyMaleVoice,
  maleVoiceFor,
  neuralVoiceFor,
  officerVoiceFor,
  pickOfficerVoice,
  pickVoice,
  speakTag,
  spokenBrowserVoice,
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
      expect(copy.interruptHint.length).toBeGreaterThan(0);
      expect(copy.soundOn.length).toBeGreaterThan(0);
      expect(copy.signalsOn.length).toBeGreaterThan(0);
      expect(copy.signalsOff.length).toBeGreaterThan(0);
      expect(copy.signalsOn).not.toBe(copy.signalsOff);
      expect(copy.whoPilot).toMatch(/Pilot/);
      expect(copy.whoOfficer.length).toBeGreaterThan(0);
      expect(copy.whoOfficer).not.toBe(copy.whoPilot);
      expect(copy.studio.length).toBeGreaterThan(0);
      expect(copy.hearPilot.length).toBeGreaterThan(0);
      expect(copy.hearOfficer.length).toBeGreaterThan(0);
      expect(copy.previewPilot.length).toBeGreaterThan(8);
      expect(copy.previewOfficer.length).toBeGreaterThan(4);
      expect(copy.now.length).toBeGreaterThan(0);
      expect(copy.linkLive.length).toBeGreaterThan(0);
      expect(copy.bargeHint.length).toBeGreaterThan(0);
      expect(copy.talkListening.length).toBeGreaterThan(0);
      expect(copy.peakHold.length).toBeGreaterThan(0);
      expect(copy.back.length).toBeGreaterThan(0);
      expect(copy.reset.length).toBeGreaterThan(0);
      expect(copy.next.length).toBeGreaterThan(0);
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
    expect(
      demo.filter((beat) => beat.role === "officer").every((beat) => beat.speak),
    ).toBe(true);
    expect(demo.filter((beat) => beat.speak).length).toBe(demo.length);
    expect(demo.some((beat) => beat.raise?.instruments)).toBe(true);
    expect(demo.some((beat) => beat.raise?.comms)).toBe(true);
    expect(demo.every((beat) => beat.action.length > 0)).toBe(true);
    expect(demo.some((beat) => beat.focus === "instruments")).toBe(true);
    expect(demo.some((beat) => beat.tone === "warn" && beat.focus === "comms")).toBe(
      true,
    );
    expect(demo.every((beat) => beat.tone === "brief" || beat.tone === "warn")).toBe(
      true,
    );
    const recon = demoBeats(
      {
        ...idle,
        scenarioId: "recon-drone",
        scenarioName: "Reconnaissance drone",
        riskLevel: "ATTENTION",
        recommended: "Hold visual track",
      },
      "en",
    );
    const picture = recon.find(
      (beat) => beat.role === "pilot" && beat.action === pilotDemoCopy("en").actionInstruments,
    );
    expect(picture?.text).toMatch(/200 m|UAV|Recon/i);
    expect(picture?.text.length).toBeLessThan(420);
    expect(picture?.text).not.toMatch(/Captain:/);

    const crisis = demoBeats({ ...idle, crisis: true }, "en");
    expect(crisis.filter((beat) => beat.speak && beat.tone === "warn").length).toBeGreaterThan(
      1,
    );
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
      { lang: "en-US", name: "Microsoft Mark", localService: true },
      { lang: "ru-RU", name: "Microsoft Irina", localService: true },
    ];
    expect(pickVoice(voices, "en")?.name).toBe("Microsoft Mark");
    expect(isLikelyMaleVoice("Microsoft David")).toBe(true);
    expect(isLikelyMaleVoice("Microsoft Zira")).toBe(false);
    expect(pickOfficerVoice(voices, "en", "Microsoft Mark")?.name).toBe(
      "Microsoft David",
    );
    expect(pickOfficerVoice(voices, "en", "Microsoft Mark")?.name).not.toBe(
      "Microsoft Zira",
    );
    expect(isLikelyFemaleVoice("Microsoft Irina")).toBe(true);
    expect(pickVoice(voices, "ru")).toBeNull();
    expect(spokenBrowserVoice(voices, "ru", "pilot")).toBeNull();
    expect(spokenBrowserVoice([{ lang: "ru-RU", name: "Microsoft Irina", localService: true }], "ru")).toBeNull();
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
      expect(copy.voicePair).toMatch(/\{voice\}/);
      expect(copy.voicePair).toMatch(/\{officer\}/);
      expect(copy.voiceEdge).toMatch(/ELEVENLABS_API_KEY/);
      expect(copy.voiceEleven).toMatch(/ElevenLabs/);
      expect(copy.voiceEdge).not.toBe(copy.voiceEleven);
      const officer = officerVoiceFor(code);
      expect(neuralVoiceFor(code, "officer").voice).toBe(officer.voice);
      expect(officer.voice).not.toBe(male.voice);
      expect(isLikelyMaleVoice(officer.voice)).toBe(true);
      expect(isLikelyMaleVoice(male.voice)).toBe(true);
      const edge = voiceNeedLine(code, {
        tts: "neural",
        stt: "ready",
        voiceName: male.voice,
        provider: "edge",
      });
      expect(edge).toContain(male.voice);
      expect(edge).toContain(officer.voice);
      expect(edge).toMatch(/ELEVENLABS_API_KEY/);
      const eleven = voiceNeedLine(code, {
        tts: "neural",
        stt: "ready",
        voiceName: "Adam",
        officerVoiceName: "Josh",
        provider: "elevenlabs",
      });
      expect(eleven).toMatch(/ElevenLabs/);
      expect(eleven).toContain("Adam");
      expect(eleven).toContain("Josh");
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
