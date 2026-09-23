import { describe, expect, it } from "vitest";
import { locales } from "@/lib/i18n/locales";
import { watchLayersCopy } from "@/lib/i18n/watch-layers-copy";
import { LAYER_IDS, layerStatus } from "@/lib/watch-layers";

describe("watch layers", () => {
  it("keeps LIVE dark and DEMO honest on the flagship drone", () => {
    expect(layerStatus("droneIntercept", true, "recon-drone")).toBe("dark");
    expect(layerStatus("droneIntercept", false, "recon-drone")).toBe("attention");
    expect(layerStatus("antiSub", false, "stealth-uuv")).toBe("attention");
    expect(layerStatus("elint", false, "comms-jamming")).toBe("attention");
    expect(layerStatus("pulseCannon", false, "recon-drone")).toBe("standby");
  });

  it("names detection, protection, and the geo centre in every locale", () => {
    for (const code of locales) {
      const copy = watchLayersCopy(code);
      expect(copy.detectTitle.length).toBeGreaterThan(4);
      expect(copy.geoTitle.length).toBeGreaterThan(4);
      expect(copy.functionsLater.length).toBeGreaterThan(8);
      for (const id of LAYER_IDS) {
        expect(copy.layers[id].name.length).toBeGreaterThan(1);
      }
    }
    expect(watchLayersCopy("ru").layers.droneIntercept.name).toMatch(/дронов/i);
    expect(watchLayersCopy("en").detectTitle).toBe("Detection and protection");
  });
});
