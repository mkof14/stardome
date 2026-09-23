import { describe, expect, it } from "vitest";
import { SCENARIOS } from "@/lib/scenarios";
import {
  TONE_ATTN,
  TONE_CRIT,
  TONE_OK,
  primaryTrack,
  radarScene,
  sceneTracks,
  toneColor,
} from "@/lib/picture-scenes";

describe("toneColor", () => {
  it("uses alarm red for critical contacts, not brand orange", () => {
    expect(TONE_CRIT).toBe("#DC2626");
    expect(toneColor("crit")).toBe(TONE_CRIT);
    expect(toneColor("attn")).toBe(TONE_ATTN);
    expect(toneColor("ok")).toBe(TONE_OK);
    expect(toneColor("crit").toLowerCase()).not.toBe("#f15a00");
  });
});

describe("scenario tracks", () => {
  it("gives every catalog case a primary track with range, object, and threat", () => {
    for (const scenario of SCENARIOS) {
      const tracks = sceneTracks(scenario.panelType, scenario.id);
      expect(tracks.length, scenario.id).toBeGreaterThan(0);
      const primary = primaryTrack(tracks);
      expect(primary, scenario.id).toBeTruthy();
      expect(primary?.object, scenario.id).toBeTruthy();
      expect(primary?.threat, scenario.id).toBeTruthy();
      expect(primary?.rangeText || primary?.dist, scenario.id).toBeTruthy();
    }
  });

  it("keeps the reconnaissance UAV at 200 m as the primary radar track", () => {
    const scene = radarScene("recon-drone");
    const uav = scene.contacts.find((item) => item.id === "recon");
    expect(uav?.primary).toBe(true);
    expect(uav?.rangeText).toBe("200 m");
    expect(uav?.object).toMatch(/UAV/i);
    expect(uav?.threat).toMatch(/Surveillance/i);
  });
});
