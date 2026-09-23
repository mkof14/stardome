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

const DRONE = /drone|uav|swarm|loitering/;
const SUB = /uuv|diver|sonar|stealth|underwater|hull/;
const RF = /jam|spoof|rf|spectrum|intrusion|satcom|anomalous/;

export function layerStatus(id: LayerId, live: boolean, scenarioId: string): LayerStatus {
  if (live) return "dark";
  const key = scenarioId.toLowerCase();
  if (!key) return "standby";
  if (id === "droneIntercept" && DRONE.test(key)) return "attention";
  if (id === "antiAir" && DRONE.test(key)) return "attention";
  if (id === "antiSub" && SUB.test(key)) return "attention";
  if (id === "elint" && RF.test(key)) return "attention";
  return "standby";
}
