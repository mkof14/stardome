import type { EquipmentId } from "@/lib/equipment";

export type StarlinkServiceId = "maritime" | "priority";
export type StarlinkState = "lock" | "search" | "obstructed" | "offline" | "dark";

export type StarlinkLink = {
  id: StarlinkServiceId;
  name: string;
  service: string;
  terminal: string;
  band: string;
  role: string;
  state: StarlinkState;
  latencyMs: string;
  downMbps: string;
  upMbps: string;
  snrDb: string;
  obstruction: string;
  satellites: string;
  lastOk: string;
};

type StarlinkContext = {
  live: boolean;
  scenarioId: string;
  faultId: EquipmentId | null;
};

export const STARLINK_SERVICES: StarlinkServiceId[] = ["maritime", "priority"];

export function starlinkLinks(ctx: StarlinkContext): StarlinkLink[] {
  if (ctx.live) {
    return [
      darkLink("maritime"),
      darkLink("priority"),
    ];
  }
  const jammed = ctx.scenarioId === "comms-jamming";
  const lost = ctx.scenarioId === "support-center-lost" || ctx.faultId === "satcom";
  return [
    {
      id: "maritime",
      name: "Starlink Maritime",
      service: "Maritime",
      terminal: "UT-A · Flat HP",
      band: "Ku / Ka",
      role: "Primary watch data",
      state: jammed ? "obstructed" : "lock",
      latencyMs: jammed ? "210" : "28",
      downMbps: jammed ? "12" : "184",
      upMbps: jammed ? "2" : "22",
      snrDb: jammed ? "4.1" : "11.4",
      obstruction: jammed ? "38%" : "2%",
      satellites: jammed ? "9" : "43",
      lastOk: jammed ? "degraded path" : "handshake 4 s",
    },
    {
      id: "priority",
      name: "Starlink Priority",
      service: "Priority",
      terminal: "UT-B · Performance",
      band: "Ka",
      role: "Second path · Support",
      state: jammed ? "search" : lost ? "lock" : "lock",
      latencyMs: jammed ? "—" : "41",
      downMbps: jammed ? "0" : lost ? "76" : "96",
      upMbps: jammed ? "0" : lost ? "9" : "14",
      snrDb: jammed ? "—" : "9.8",
      obstruction: jammed ? "—" : "0%",
      satellites: jammed ? "0" : "38",
      lastOk: jammed ? "no lock" : lost ? "holding watch data" : "handshake 6 s",
    },
  ];
}

function darkLink(id: StarlinkServiceId): StarlinkLink {
  const maritime = id === "maritime";
  return {
    id,
    name: maritime ? "Starlink Maritime" : "Starlink Priority",
    service: maritime ? "Maritime" : "Priority",
    terminal: maritime ? "UT-A · Flat HP" : "UT-B · Performance",
    band: maritime ? "Ku / Ka" : "Ka",
    role: maritime ? "Primary watch data" : "Second path · Support",
    state: "dark",
    latencyMs: "—",
    downMbps: "—",
    upMbps: "—",
    snrDb: "—",
    obstruction: "—",
    satellites: "—",
    lastOk: "no terminal on this install",
  };
}
