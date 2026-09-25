import type { EquipmentId } from "@/lib/equipment";
import type { PanelType } from "@/lib/scenarios";

export type KitKind = "radar" | "underwater" | "rf" | "comms";
export type KitStatus = "watching" | "standby" | "degraded" | "offline" | "dark";

export type KitInstrument = {
  id: string;
  kind: KitKind;
  name: string;
  band: string;
  faultKey?: EquipmentId;
};

export const WATCH_KIT: KitInstrument[] = [
  { id: "sband", kind: "radar", name: "S-band ARPA", band: "RDR-6 · 3 GHz", faultKey: "radar" },
  { id: "xband", kind: "radar", name: "X-band nav", band: "9.4 GHz · 12 NM" },
  { id: "aesa", kind: "radar", name: "AESA 3D", band: "Container volume scan" },
  { id: "hfsonar", kind: "underwater", name: "HF sonar", band: "200 kHz · 1 NM", faultKey: "sonar" },
  { id: "passive", kind: "underwater", name: "Passive array", band: "Flank / hull" },
  { id: "acoustic", kind: "underwater", name: "Acoustic intercept", band: "Broadband listen" },
  { id: "spectrum", kind: "rf", name: "Spectrum SA-58", band: "2.4–5.8 GHz" },
  { id: "gnss", kind: "rf", name: "GNSS / PNT", band: "L1 / L2" },
  { id: "ais", kind: "rf", name: "AIS receiver", band: "161.975 MHz", faultKey: "ais" },
  { id: "rfew", kind: "rf", name: "RF / EW watch", band: "Drone & jammer" },
  { id: "satcom", kind: "comms", name: "Satcom Ka", band: "Support uplink", faultKey: "satcom" },
  { id: "starlink-maritime", kind: "comms", name: "Starlink Maritime", band: "Ku / Ka · UT-A" },
  { id: "starlink-priority", kind: "comms", name: "Starlink Priority", band: "Ka · UT-B" },
  { id: "vhf", kind: "comms", name: "VHF ch.16", band: "156.800 MHz" },
  { id: "support", kind: "comms", name: "Support Center", band: "Authorized path" },
  { id: "lan", kind: "comms", name: "Onboard LAN", band: "Core / StarDome 1" },
];

export const KIT_KINDS: KitKind[] = ["radar", "underwater", "rf", "comms"];

type KitContext = {
  live: boolean;
  faultId: EquipmentId | null;
  panelType: PanelType;
  scenarioId: string;
};

export function kitStatus(item: KitInstrument, ctx: KitContext): KitStatus {
  if (ctx.live) return "dark";
  if (item.faultKey && ctx.faultId === item.faultKey) return "degraded";
  if (item.id === "satcom" || item.id === "support") {
    if (ctx.scenarioId === "support-center-lost" || ctx.faultId === "satcom") return "offline";
  }
  if (item.id === "gnss" && ctx.scenarioId === "gps-spoofing") return "degraded";
  if (item.id === "spectrum" && (ctx.scenarioId === "comms-jamming" || ctx.scenarioId === "anomalous-rf")) {
    return "watching";
  }
  if (item.kind === "radar" && (ctx.panelType === "radar" || !ctx.panelType)) return "watching";
  if (item.kind === "underwater" && ctx.panelType === "sonar") return "watching";
  if (item.kind === "rf" && ctx.panelType === "spectrum") return "watching";
  if (item.id === "ais" && ctx.panelType === "radar") return "watching";
  if (item.id === "starlink-maritime") {
    if (ctx.scenarioId === "comms-jamming") return "degraded";
    return "watching";
  }
  if (item.id === "starlink-priority") {
    if (ctx.scenarioId === "comms-jamming") return "standby";
    return "watching";
  }
  if (item.kind === "comms") return item.id === "vhf" || item.id === "lan" ? "watching" : "standby";
  return "standby";
}

export function kitReading(item: KitInstrument, ctx: KitContext): string {
  if (ctx.live) return "—";
  if (item.faultKey && ctx.faultId === item.faultKey) return "NO FEED";
  const id = ctx.scenarioId;
  if (item.id === "sband") {
    if (id === "recon-drone") return "PRI UAV · 200 m · 090°";
    if (id === "drone-swarm") return "6 UAV · 1.8–2.8 NM";
    if (id === "payload-drone") return "INBOUND UAV · 1.4 NM";
    if (id === "critical-closing-speed") return "CPA < 50 m · 22 kn";
    if (id === "usv-swarm") return "4 USV · 1.6–2.2 NM";
    return "6.0 NM · 3 tracks";
  }
  if (item.id === "aesa") {
    if (id.startsWith("drone") || id.includes("drone") || id === "multi-domain-event") {
      return "Air volume · tracks held";
    }
    return "Volume quiet";
  }
  if (item.id === "hfsonar") {
    if (id === "diver-near-hull") return "SWIMMER · 15 m · 3 m depth";
    if (id === "uuv-payload") return "UUV · 410 m inbound";
    if (id === "stealth-uuv") return "Weak return · brg 200";
    return "Passive watch";
  }
  if (item.id === "spectrum") {
    if (id === "anomalous-rf") return "Burst 5.8 GHz · −18 dBm";
    if (id === "comms-jamming") return "Noise floor up · VHF/L";
    if (id === "network-intrusion") return "Unknown host on LAN";
    return "Scan stable";
  }
  if (item.id === "gnss") {
    if (id === "gps-spoofing") return "PNT offset 340 m";
    return "Fix 14 SV";
  }
  if (item.id === "satcom") {
    if (id === "support-center-lost") return "No lock · 3 retries";
    if (id === "comms-jamming") return "Link quality 12%";
    return "Ka lock · 38 ms";
  }
  if (item.id === "starlink-maritime") {
    if (id === "comms-jamming") return "Obstructed · 210 ms · 12 Mbps";
    return "LOCK · 28 ms · 184 / 22 Mbps";
  }
  if (item.id === "starlink-priority") {
    if (id === "comms-jamming") return "SEARCH · no lock";
    if (id === "support-center-lost") return "LOCK · holding watch data";
    return "LOCK · 41 ms · 96 / 14 Mbps";
  }
  if (item.id === "ais") return id === "vessel-no-ais" || id === "converging-vessel" ? "Dark contact" : "2 known MMSI";
  if (item.id === "vhf") return "Watch 16 · clear";
  if (item.id === "support") return id === "support-center-lost" ? "Path down" : "Stand by";
  if (item.id === "lan") return id === "network-intrusion" ? "Auth watch" : "Core 0.4 ms";
  return item.band;
}
