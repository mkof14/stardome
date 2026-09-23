import { describe, expect, it } from "vitest";
import {
  FLAGSHIP_SCENARIO_ID,
  flagshipScenario,
  sessionForDemo,
} from "@/lib/demo-flagship";
import { demoBeats } from "@/lib/pilot-demo";
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

describe("flagship DEMO", () => {
  it("uses reconnaissance drone as the partner picture", () => {
    const flag = flagshipScenario();
    expect(flag.id).toBe(FLAGSHIP_SCENARIO_ID);
    expect(flag.riskLevel).toBe("ATTENTION");
    expect(flag.options?.some((option) => option.recommended)).toBe(true);
  });

  it("fills an empty DEMO session so Pilot DEMO never speaks a quiet watch", () => {
    const next = sessionForDemo(idle);
    expect(next.scenarioId).toBe(FLAGSHIP_SCENARIO_ID);
    expect(next.recommended).toMatch(/Hold visual track/i);
    expect(sessionForDemo({ ...idle, live: true }).scenarioId).toBe("");
  });

  it("speaks the flagship picture when DEMO starts with no case selected", () => {
    const beats = demoBeats(idle, "en");
    expect(beats.some((beat) => /UAV|200 m|Hold visual/i.test(beat.text))).toBe(
      true,
    );
    expect(beats.every((beat) => !/instruments are quiet/i.test(beat.text))).toBe(
      true,
    );
  });
});
