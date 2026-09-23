import { describe, expect, it } from "vitest";
import { locales } from "@/lib/i18n/locales";
import { watchLayersCopy } from "@/lib/i18n/watch-layers-copy";
import {
  LAYER_IDS,
  isLayerId,
  layerMatchesTrack,
  layerStatus,
} from "@/lib/watch-layers";
import type { PictureContact } from "@/lib/picture-scenes";

function contact(partial: Partial<PictureContact> & Pick<PictureContact, "id">): PictureContact {
  return {
    label: "T",
    name: "Track",
    type: "air",
    dist: "1 NM",
    x: 410,
    y: 410,
    tone: "ok",
    ...partial,
  };
}

describe("watch layers", () => {
  it("keeps LIVE dark and DEMO honest on the flagship drone", () => {
    expect(layerStatus("droneIntercept", true, "recon-drone")).toBe("dark");
    expect(layerStatus("droneIntercept", false, "recon-drone")).toBe("attention");
    expect(layerStatus("pulseCannon", false, "recon-drone")).toBe("attention");
    expect(layerStatus("laser", false, "recon-drone")).toBe("attention");
    expect(layerStatus("antiAir", false, "recon-drone")).toBe("attention");
    expect(layerStatus("antiSub", false, "recon-drone")).toBe("standby");
    expect(layerStatus("antiSub", false, "stealth-uuv", "sonar")).toBe("attention");
    expect(layerStatus("elint", false, "comms-jamming", "spectrum")).toBe("attention");
  });

  it("binds stations to the matching picture tracks", () => {
    expect(isLayerId("droneIntercept")).toBe(true);
    expect(isLayerId("bridge")).toBe(false);
    expect(
      layerMatchesTrack(
        "droneIntercept",
        contact({ id: "uav", shape: "uav", altitudeM: 80, tone: "attn" }),
      ),
    ).toBe(true);
    expect(
      layerMatchesTrack("antiSub", contact({ id: "air", shape: "uav", altitudeM: 80 })),
    ).toBe(false);
    expect(
      layerMatchesTrack("antiSub", contact({ id: "uuv", shape: "sonar", depthM: 12 })),
    ).toBe(true);
    expect(layerMatchesTrack("elint", contact({ id: "rf", shape: "rf", freq: "2.4 GHz" }))).toBe(
      true,
    );
  });

  it("names detection, protection, and the geo centre in every locale", () => {
    for (const code of locales) {
      const copy = watchLayersCopy(code);
      expect(copy.detectTitle.length).toBeGreaterThan(4);
      expect(copy.geoTitle.length).toBeGreaterThan(4);
      expect(copy.routeAction.length).toBeGreaterThan(8);
      expect(copy.onPicture.length).toBeGreaterThan(2);
      for (const id of LAYER_IDS) {
        expect(copy.layers[id].name.length).toBeGreaterThan(1);
        expect(copy.layers[id].action.length).toBeGreaterThan(8);
      }
    }
    expect(watchLayersCopy("ru").layers.droneIntercept.name).toMatch(/дронов/i);
    expect(watchLayersCopy("en").detectTitle).toBe("Detection and protection");
  });
});
