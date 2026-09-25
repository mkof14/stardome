import { describe, expect, it } from "vitest";
import {
  fieldSamples,
  pilotMood,
  riskTone,
  voiceLevelFromBars,
} from "@/lib/pilot-presence";

describe("pilotMood", () => {
  it("stays easy on a quiet watch", () => {
    expect(pilotMood({ mic: "idle", risk: "NORMAL" })).toBe("ease");
  });

  it("tightens on attention and points on a closing contact", () => {
    expect(pilotMood({ mic: "idle", risk: "ATTENTION" })).toBe("serious");
    expect(pilotMood({ mic: "idle", risk: "CRITICAL" })).toBe("urgent");
    expect(pilotMood({ mic: "idle", urgent: true, risk: "NORMAL" })).toBe("urgent");
  });

  it("listens when the officer talks, and speaks when Pilot answers", () => {
    expect(pilotMood({ mic: "listening", risk: "NORMAL" })).toBe("listen");
    expect(pilotMood({ mic: "processing", risk: "ATTENTION" })).toBe("listen");
    expect(pilotMood({ mic: "speaking", risk: "NORMAL" })).toBe("speak");
    expect(pilotMood({ mic: "speaking", risk: "CRITICAL" })).toBe("urgent");
  });
});

describe("riskTone and voice field", () => {
  it("reads the watch risk without inventing urgency", () => {
    expect(riskTone("NORMAL")).toBe("calm");
    expect(riskTone("attention")).toBe("attention");
    expect(riskTone()).toBe("calm");
  });

  it("takes the loudest bar as the voice drive", () => {
    expect(voiceLevelFromBars([])).toBe(0);
    expect(voiceLevelFromBars([0.1, 0.8, 0.2])).toBe(0.8);
  });

  it("uses the live wave when Pilot is speaking, and a calm field when quiet", () => {
    const live = fieldSamples([0, 0.5, 1, 0.25], 8, true, 0);
    expect(live).toHaveLength(8);
    expect(Math.max(...live)).toBeGreaterThan(Math.min(...live));
    const idle = fieldSamples(undefined, 12, false, 0);
    expect(idle).toHaveLength(12);
    expect(Math.max(...idle)).toBeLessThan(0.5);
  });
});
