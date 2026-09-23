import { describe, expect, it } from "vitest";
import { kitReading, kitStatus, WATCH_KIT } from "@/lib/watch-kit";

const base = {
  live: false,
  faultId: null,
  panelType: "radar" as const,
  scenarioId: "",
};

describe("watch kit", () => {
  it("lists radar, underwater, RF, and comms instruments", () => {
    const kinds = new Set(WATCH_KIT.map((item) => item.kind));
    expect(kinds.has("radar")).toBe(true);
    expect(kinds.has("underwater")).toBe(true);
    expect(kinds.has("rf")).toBe(true);
    expect(kinds.has("comms")).toBe(true);
    expect(WATCH_KIT.length).toBeGreaterThanOrEqual(12);
  });

  it("goes dark in LIVE and degrades on a matching fault", () => {
    const sband = WATCH_KIT.find((item) => item.id === "sband")!;
    expect(kitStatus(sband, { ...base, live: true })).toBe("dark");
    expect(kitStatus(sband, { ...base, faultId: "radar" })).toBe("degraded");
    expect(kitReading(sband, { ...base, scenarioId: "recon-drone" })).toMatch(/200 m/);
  });

  it("marks satcom offline when Support Center is lost", () => {
    const sat = WATCH_KIT.find((item) => item.id === "satcom")!;
    expect(kitStatus(sat, { ...base, panelType: "spectrum", scenarioId: "support-center-lost" })).toBe(
      "offline",
    );
  });
});
