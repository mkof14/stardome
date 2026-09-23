import type { EquipmentId } from "@/lib/equipment";
import type { KitStatus } from "@/lib/watch-kit";
import { KIT_KINDS, WATCH_KIT, kitStatus } from "@/lib/watch-kit";
import type { PanelType } from "@/lib/scenarios";

export type PlantTone = "ok" | "warn" | "fail" | "dark";

export type PlantRow = {
  id: string;
  label: string;
  value: string;
  note?: string;
  tone: PlantTone;
};

export type PlantSectionId =
  | "container"
  | "power"
  | "cooling"
  | "sensors"
  | "comms"
  | "compute"
  | "storage";

export type PlantSection = {
  id: PlantSectionId;
  rows: PlantRow[];
};

type PlantContext = {
  live: boolean;
  faultId: EquipmentId | null;
  panelType: PanelType;
  scenarioId: string;
  blackBoxCount: number;
  lastBlackBox?: string;
};

function toneFromKit(status: KitStatus): PlantTone {
  if (status === "dark") return "dark";
  if (status === "degraded" || status === "offline") return status === "offline" ? "fail" : "warn";
  return "ok";
}

export function plantSections(ctx: PlantContext): PlantSection[] {
  if (ctx.live) {
    return [
      {
        id: "container",
        rows: [
          { id: "hull", label: "Hull / ISO", value: "NO DATA", tone: "dark" },
          { id: "hatch", label: "Hatches", value: "NO DATA", tone: "dark" },
          { id: "env", label: "Internal climate", value: "NO DATA", tone: "dark" },
        ],
      },
      {
        id: "power",
        rows: [
          { id: "bus", label: "Vessel / shore bus", value: "NO DATA", tone: "dark" },
          { id: "gen", label: "Diesel generator", value: "NO DATA", tone: "dark" },
          { id: "batt", label: "Battery bank", value: "NO DATA", tone: "dark" },
          { id: "ups", label: "UPS racks", value: "NO DATA", tone: "dark" },
        ],
      },
      {
        id: "cooling",
        rows: [
          { id: "hvac", label: "HVAC loop", value: "NO DATA", tone: "dark" },
          { id: "rack", label: "Rack cooling", value: "NO DATA", tone: "dark" },
          { id: "sea", label: "Seawater pump", value: "NO DATA", tone: "dark" },
        ],
      },
      {
        id: "sensors",
        rows: KIT_KINDS.map((kind) => ({
          id: kind,
          label: kind,
          value: "NO SENSORS",
          tone: "dark" as const,
        })),
      },
      {
        id: "comms",
        rows: [
          { id: "sat", label: "Satcom", value: "NO PATH", tone: "dark" },
          { id: "cloud", label: "Cloud sync", value: "NOT WIRED", tone: "dark" },
          { id: "desk", label: "Support path", value: "NO PATH", tone: "dark" },
        ],
      },
      {
        id: "compute",
        rows: [
          { id: "core", label: "StarWall Core", value: "NO DATA", tone: "dark" },
          { id: "pilot", label: "Pilot host", value: "NO DATA", tone: "dark" },
          { id: "clock", label: "Time source", value: "NO DATA", tone: "dark" },
        ],
      },
      {
        id: "storage",
        rows: [
          { id: "disk", label: "Watch store", value: "NO DATA", tone: "dark" },
          { id: "box", label: "Black Box", value: "LOCAL ONLY", tone: "dark" },
          { id: "sync", label: "Cloud copy", value: "NOT CONFIGURED", tone: "dark" },
        ],
      },
    ];
  }

  const jammed = ctx.scenarioId === "comms-jamming";
  const lost = ctx.scenarioId === "support-center-lost" || ctx.faultId === "satcom";
  const spoof = ctx.scenarioId === "gps-spoofing";
  const intrusion = ctx.scenarioId === "network-intrusion";
  const powerWarn = ctx.faultId === "radar" || ctx.faultId === "sonar";

  return [
    {
      id: "container",
      rows: [
        { id: "hull", label: "Hull / ISO", value: "20 ft · sealed", note: "AGRON Container", tone: "ok" },
        { id: "hatch", label: "Service hatches", value: "3 locked", tone: "ok" },
        { id: "env", label: "Internal climate", value: "21.2°C · 44% RH", tone: "ok" },
      ],
    },
    {
      id: "power",
      rows: [
        {
          id: "bus",
          label: "Vessel / shore bus",
          value: "230 V · 41 A",
          note: "11.2 kW draw",
          tone: powerWarn ? "warn" : "ok",
        },
        {
          id: "gen",
          label: "Diesel generator",
          value: lost ? "RUNNING · 8.4 kW" : "STANDBY · 0 kW",
          note: lost ? "Auto start after satcom loss" : "Warm, 12 min to load",
          tone: lost ? "warn" : "ok",
        },
        {
          id: "batt",
          label: "Battery bank",
          value: "86% · 18.4 kWh",
          note: "41 h autonomy at this draw",
          tone: "ok",
        },
        {
          id: "ups",
          label: "UPS racks",
          value: "12 min hold",
          note: "Core + AGRON 1 + recorder",
          tone: "ok",
        },
      ],
    },
    {
      id: "cooling",
      rows: [
        { id: "hvac", label: "HVAC loop", value: "18.0°C supply", note: "Return 22.4°C", tone: "ok" },
        { id: "rack", label: "Rack cooling", value: "22°C · 41% RH", tone: "ok" },
        { id: "sea", label: "Seawater pump", value: "1.2 bar · 38 L/min", tone: "ok" },
      ],
    },
    {
      id: "sensors",
      rows: KIT_KINDS.map((kind) => {
        const items = WATCH_KIT.filter((item) => item.kind === kind);
        const worst = items.reduce<KitStatus>((acc, item) => {
          const next = kitStatus(item, ctx);
          if (next === "offline" || acc === "offline") return "offline";
          if (next === "degraded" || acc === "degraded") return "degraded";
          if (next === "watching" || acc === "watching") return "watching";
          return acc;
        }, "standby");
        const watching = items.filter((item) => kitStatus(item, ctx) === "watching").length;
        return {
          id: kind,
          label: kind,
          value: `${watching}/${items.length} watching`,
          note: items.map((item) => item.name).join(" · "),
          tone: toneFromKit(worst),
        };
      }),
    },
    {
      id: "comms",
      rows: [
        {
          id: "sat",
          label: "Satcom Ka",
          value: lost ? "NO LOCK" : jammed ? "12% quality" : "LOCK · 38 ms",
          tone: lost ? "fail" : jammed ? "warn" : "ok",
        },
        {
          id: "vhf",
          label: "VHF ch.16",
          value: jammed ? "DEGRADED" : "WATCH",
          tone: jammed ? "warn" : "ok",
        },
        {
          id: "desk",
          label: "Support path",
          value: lost ? "DOWN" : "STAND BY",
          tone: lost ? "fail" : "ok",
        },
        {
          id: "cloud",
          label: "Cloud uplink",
          value: lost ? "HELD LOCAL" : "READY",
          note: "Sync only when a database is configured",
          tone: lost ? "warn" : "ok",
        },
      ],
    },
    {
      id: "compute",
      rows: [
        {
          id: "core",
          label: "StarWall Core",
          value: intrusion ? "23% CPU · AUTH WATCH" : "17% CPU · 11 GB",
          tone: intrusion ? "warn" : "ok",
        },
        { id: "pilot", label: "Pilot host", value: "READY · DEMO voice", tone: "ok" },
        {
          id: "clock",
          label: "Time source",
          value: spoof ? "HOLDOVER · GNSS OFFSET" : "GNSS · 14 SV",
          tone: spoof ? "warn" : "ok",
        },
      ],
    },
    {
      id: "storage",
      rows: [
        { id: "disk", label: "Watch store", value: "2.1 / 8.0 TB", note: "RAID-1", tone: "ok" },
        {
          id: "box",
          label: "Black Box",
          value: `${ctx.blackBoxCount} records`,
          note: ctx.lastBlackBox ? `Last write ${ctx.lastBlackBox}` : "Recorder armed",
          tone: "ok",
        },
        {
          id: "sync",
          label: "Cloud copy",
          value: lost ? "QUEUED LOCAL" : "ON DEVICE FIRST",
          note: "Cloud only if this install has a database",
          tone: lost ? "warn" : "ok",
        },
      ],
    },
  ];
}
