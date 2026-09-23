import {
  sceneTracks,
  type PictureContact,
} from "@/lib/picture-scenes";
import type { PanelType } from "@/lib/scenarios";

export type LayerId =
  | "droneIntercept"
  | "pulseCannon"
  | "laser"
  | "antiAir"
  | "antiSub"
  | "elint";

export type LayerStatus = "ready" | "standby" | "attention" | "dark";

export const LAYER_IDS: LayerId[] = [
  "droneIntercept",
  "pulseCannon",
  "laser",
  "antiAir",
  "antiSub",
  "elint",
];

function blob(contact: PictureContact) {
  return `${contact.shape ?? ""} ${contact.type} ${contact.object ?? ""} ${contact.threat ?? ""}`.toLowerCase();
}

export function layerMatchesTrack(id: LayerId, contact: PictureContact): boolean {
  const text = blob(contact);
  if (id === "antiSub") {
    return (
      contact.shape === "sonar" ||
      contact.depthM != null ||
      /uuv|diver|sub|under|hull/.test(text)
    );
  }
  if (id === "elint") {
    return contact.shape === "rf" || Boolean(contact.freq) || /rf|jam|spoof|link|emitter/.test(text);
  }
  return (
    contact.shape === "uav" ||
    contact.altitudeM != null ||
    /uav|drone|uas|бвс|бпла/.test(text)
  );
}

export function isLayerId(value: string | null | undefined): value is LayerId {
  return Boolean(value && LAYER_IDS.includes(value as LayerId));
}

export function tracksForLayer(tracks: PictureContact[], id: LayerId) {
  return tracks.filter((contact) => layerMatchesTrack(id, contact));
}

export function layerStatus(
  id: LayerId,
  live: boolean,
  scenarioId: string,
  panelType: PanelType = "radar",
): LayerStatus {
  if (live) return "dark";
  const tracks = sceneTracks(panelType, scenarioId, false);
  const hits = tracksForLayer(tracks, id);
  if (!hits.length) return "standby";
  const hot = hits.some((contact) => contact.primary || contact.tone !== "ok");
  return hot ? "attention" : "ready";
}
