import { describe, expect, it } from "vitest";
import {
  PILOT_LOOP_FRAMES,
  PILOT_MOODS,
  PILOT_PLATES,
  PILOT_VIDEOS,
  loopMs,
  loopStep,
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

  it("ships a plate, a frame loop, and a video loop for every mood", () => {
    for (const mood of PILOT_MOODS) {
      expect(PILOT_PLATES[mood]).toMatch(/^\/pilot\/.+\.webp$/);
      expect(PILOT_LOOP_FRAMES[mood].length).toBeGreaterThan(2);
      expect(PILOT_VIDEOS[mood].webm).toMatch(/anim-.+\.webm$/);
    }
  });

  it("ping-pongs the animation index", () => {
    expect(loopStep(0, 4, 1)).toEqual({ index: 1, dir: 1 });
    expect(loopStep(3, 4, 1)).toEqual({ index: 3, dir: -1 });
    expect(loopStep(3, 4, -1)).toEqual({ index: 2, dir: -1 });
    expect(loopStep(0, 4, -1)).toEqual({ index: 0, dir: 1 });
  });

  it("speaks faster than it idles", () => {
    expect(loopMs("speak", true, 0.8)).toBeLessThan(loopMs("ease", false, 0));
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
