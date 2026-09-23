import { describe, expect, it } from "vitest";
import { SCENARIOS } from "@/lib/scenarios";
import {
  SCOPE,
  TONE_ATTN,
  TONE_CRIT,
  TONE_OK,
  TRACK_HUES,
  polar,
  primaryTrack,
  radarScene,
  sceneTracks,
  toneColor,
  trackHue,
} from "@/lib/picture-scenes";

describe("scope ring", () => {
  it("keeps a large PPI ring so contacts plot on a detailed circle", () => {
    expect(SCOPE.ring).toBeGreaterThan(300);
    expect(SCOPE.size).toBeGreaterThan(SCOPE.ring * 2);
    const north = polar(0, SCOPE.maxNm);
    expect(north.x).toBeCloseTo(SCOPE.cx);
    expect(north.y).toBeCloseTo(SCOPE.cy - SCOPE.ring);
  });
});

describe("toneColor", () => {
  it("uses alarm red for critical contacts, not brand orange", () => {
    expect(TONE_CRIT).toBe("#DC2626");
    expect(toneColor("crit")).toBe(TONE_CRIT);
    expect(toneColor("attn")).toBe(TONE_ATTN);
    expect(toneColor("ok")).toBe(TONE_OK);
    expect(toneColor("crit").toLowerCase()).not.toBe("#f15a00");
  });
});

describe("trackHue", () => {
  it("gives T01 and T02 distinct shades that stay stable", () => {
    expect(trackHue("T01")).toBe(TRACK_HUES[0]);
    expect(trackHue("T02")).toBe(TRACK_HUES[1]);
    expect(trackHue("T01")).not.toBe(trackHue("T02"));
    expect(trackHue({ trackNo: "T03" })).toBe(TRACK_HUES[2]);
    expect(trackHue(undefined, 0)).toBe(TRACK_HUES[0]);
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
