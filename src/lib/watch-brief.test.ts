import { describe, expect, it } from "vitest";
import type { BridgeSessionValue } from "@/lib/bridge-session-types";
import { briefWatch } from "@/lib/watch-brief";

function session(partial: Partial<BridgeSessionValue> = {}): BridgeSessionValue {
  return {
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
    ...partial,
  };
}

describe("briefWatch", () => {
  it("announces the recon-drone case, range, threat, and captain order", () => {
    const text = briefWatch(
      session({
        scenarioId: "recon-drone",
        scenarioName: "Reconnaissance drone",
        riskLevel: "ATTENTION",
        panelType: "radar",
        actionText: "Hold visual track. Keep it in sight.",
      }),
      "en",
    );
    expect(text).toMatch(/Reconnaissance drone/);
    expect(text).toMatch(/ATTENTION/);
    expect(text).toMatch(/200 m/);
    expect(text).toMatch(/Surveillance/i);
    expect(text).toMatch(/Captain:/);
    expect(text).toMatch(/Officer of the watch:/);
    expect(text).not.toMatch(/\$/);
  });

  it("names multiple swarm tracks", () => {
    const text = briefWatch(
      session({
        scenarioId: "drone-swarm",
        scenarioName: "Drone swarm",
        riskLevel: "CRITICAL",
        panelType: "radar",
        crisis: true,
      }),
      "en",
    );
    expect(text).toMatch(/UAV-1/);
    expect(text).toMatch(/Also on the picture/);
    expect(text).toMatch(/Wake the captain/);
  });
});
