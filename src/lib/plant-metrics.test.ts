import { describe, expect, it } from "vitest";
import { plantCopy } from "@/lib/i18n/plant-copy";
import { plantSections } from "@/lib/plant-metrics";

const ctx = {
  live: false,
  faultId: null as null,
  panelType: "radar" as const,
  scenarioId: "",
  blackBoxCount: 2,
  lastBlackBox: "00:12:08",
};

describe("plantSections", () => {
  it("covers power, cooling, comms, compute, storage, and the container", () => {
    const ids = plantSections(ctx).map((section) => section.id);
    expect(ids).toEqual([
      "container",
      "power",
      "cooling",
      "sensors",
      "comms",
      "compute",
      "storage",
    ]);
    const power = plantSections(ctx).find((section) => section.id === "power")!;
    expect(power.rows.some((row) => /kWh|V|UPS|generator/i.test(`${row.label} ${row.value}`))).toBe(
      true,
    );
  });

  it("stays honest in LIVE", () => {
    const live = plantSections({ ...ctx, live: true });
    expect(live.every((section) => section.rows.every((row) => row.tone === "dark"))).toBe(true);
  });

  it("flags satcom loss on the plant comms board", () => {
    const comms = plantSections({
      ...ctx,
      scenarioId: "support-center-lost",
      panelType: "spectrum",
    }).find((section) => section.id === "comms")!;
    expect(comms.rows.some((row) => row.tone === "fail")).toBe(true);
  });
});

describe("plant view name", () => {
  it("labels the switcher Monitoring, not PLANT", () => {
    expect(plantCopy("en").plant).toBe("Monitoring");
    expect(plantCopy("ru").plant).toBe("Мониторинг");
    expect(plantCopy("en").plant).not.toMatch(/PLANT/i);
    expect(plantCopy("ru").plant).not.toMatch(/PLANT/i);
  });
});
