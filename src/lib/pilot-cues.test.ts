import { describe, expect, it } from "vitest";
import {
  CUE_NOTES,
  PILOT_CUES_KEY,
  PILOT_VOICE_KEY,
  cueDurationMs,
  cueForDemoBeat,
  cuesEnabled,
  voiceEnabled,
  writeCuesEnabled,
  writeVoiceEnabled,
  type PilotCue,
} from "@/lib/pilot-cues";

const KINDS: PilotCue[] = [
  "open",
  "demo",
  "listen",
  "speak",
  "scan",
  "note",
  "ack",
  "posted",
  "warn",
  "urgent",
  "error",
  "stop",
];

describe("pilot cues", () => {
  it("keeps a distinct recipe for every watch meaning", () => {
    const signatures = new Set<string>();
    for (const kind of KINDS) {
      const notes = CUE_NOTES[kind];
      expect(notes.length).toBeGreaterThan(0);
      expect(cueDurationMs(kind)).toBeGreaterThan(40);
      expect(cueDurationMs(kind)).toBeLessThan(500);
      const signature = notes
        .map((note) => `${note.freq}:${note.wave}:${note.start.toFixed(2)}`)
        .join("|");
      expect(signatures.has(signature)).toBe(false);
      signatures.add(signature);
    }
    expect(CUE_NOTES.warn.some((note) => note.wave === "square")).toBe(true);
    expect(CUE_NOTES.urgent.length).toBeGreaterThan(CUE_NOTES.listen.length);
    expect(CUE_NOTES.urgent[0]?.gain).toBeGreaterThan(CUE_NOTES.speak[0]?.gain ?? 0);
  });

  it("maps demo beats to the matching signal", () => {
    expect(
      cueForDemoBeat({
        role: "officer",
        focus: "calls",
        tone: "brief",
        speak: false,
      }),
    ).toBe("listen");
    expect(
      cueForDemoBeat({
        role: "pilot",
        focus: "instruments",
        tone: "brief",
        speak: true,
      }),
    ).toBe("scan");
    expect(
      cueForDemoBeat({
        role: "pilot",
        focus: "advice",
        tone: "brief",
        speak: true,
      }),
    ).toBe("note");
    expect(
      cueForDemoBeat({
        role: "pilot",
        focus: "comms",
        tone: "warn",
        speak: true,
      }),
    ).toBe("warn");
  });

  it("remembers the mute in storage and defaults to on", () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
    };
    expect(cuesEnabled(storage)).toBe(true);
    writeCuesEnabled(false, storage);
    expect(store.get(PILOT_CUES_KEY)).toBe("off");
    expect(cuesEnabled(storage)).toBe(false);
    writeCuesEnabled(true, storage);
    expect(cuesEnabled(storage)).toBe(true);
    expect(cuesEnabled(null)).toBe(true);
  });

  it("remembers speaker mute separately from signals", () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
    };
    expect(voiceEnabled(storage)).toBe(true);
    writeVoiceEnabled(false, storage);
    expect(store.get(PILOT_VOICE_KEY)).toBe("off");
    expect(voiceEnabled(storage)).toBe(false);
    expect(cuesEnabled(storage)).toBe(true);
    writeVoiceEnabled(true, storage);
    expect(voiceEnabled(storage)).toBe(true);
  });
});
