import { describe, expect, it } from "vitest";
import {
  PILOT_MOODS,
  PILOT_PLATES,
  pilotMood,
  riskTone,
  voiceLevelFromBars,
} from "@/lib/pilot-presence";

describe("pilotMood", () => {
  it("smiles on a quiet watch", () => {
    expect(pilotMood({ mic: "idle", risk: "NORMAL" })).toBe("ease");
  });

  it("goes serious on attention and urgent on a closing contact", () => {
    expect(pilotMood({ mic: "idle", risk: "ATTENTION" })).toBe("serious");
    expect(pilotMood({ mic: "idle", risk: "CRITICAL" })).toBe("urgent");
    expect(pilotMood({ mic: "idle", urgent: true, risk: "NORMAL" })).toBe("urgent");
  });

  it("listens when the officer is speaking, and talks with a gesture when Pilot answers", () => {
    expect(pilotMood({ mic: "listening", risk: "NORMAL" })).toBe("listen");
    expect(pilotMood({ mic: "processing", risk: "ATTENTION" })).toBe("listen");
    expect(pilotMood({ mic: "speaking", risk: "NORMAL" })).toBe("speak");
    expect(pilotMood({ mic: "speaking", risk: "CRITICAL" })).toBe("urgent");
  });

  it("ships a plate for every mood", () => {
    for (const mood of PILOT_MOODS) {
      expect(PILOT_PLATES[mood]).toMatch(/^\/pilot\/.+\.webp$/);
    }
  });
});

describe("riskTone and voice level", () => {
  it("reads the watch risk without inventing urgency", () => {
    expect(riskTone("NORMAL")).toBe("calm");
    expect(riskTone("attention")).toBe("attention");
    expect(riskTone()).toBe("calm");
  });

  it("takes the loudest bar as the mouth drive", () => {
    expect(voiceLevelFromBars([])).toBe(0);
    expect(voiceLevelFromBars([0.1, 0.8, 0.2])).toBe(0.8);
  });
});
