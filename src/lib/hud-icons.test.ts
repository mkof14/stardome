import { describe, expect, it } from "vitest";
import { GLYPHS } from "@/components/bridge/hud-icons";

const REQUIRED = [
  "talk",
  "fullscreen",
  "fullscreenExit",
  "clear",
  "radio",
  "phone",
  "mobile",
  "ship",
  "lock",
  "radar",
  "sonar",
  "spectrum",
  "perimeter",
  "satellite",
  "antenna",
  "globe",
  "sun",
  "moon",
  "back",
  "next",
  "reset",
  "compress",
  "bell",
  "drone",
  "pulse",
  "laser",
  "antiAir",
] as const;

describe("HUD cockpit glyphs", () => {
  it("ships a large visor icon set", () => {
    expect(Object.keys(GLYPHS).length).toBeGreaterThan(50);
    for (const name of REQUIRED) {
      expect(GLYPHS[name].length).toBeGreaterThan(12);
    }
  });
});
