export type ContactTone = "ok" | "attn" | "crit";
export type ContactShape = "vessel" | "uav" | "usv" | "mob" | "sonar" | "rf" | "site";
export type ContactMotion = "static" | "close" | "inbound" | "orbit" | "hold";
export type IdStatus = "identified" | "classified" | "unidentified";
export type AisState = "ok" | "none" | "spoof" | "na";

export type PictureContact = {
  id: string;
  label: string;
  name: string;
  type: string;
  dist: string;
  x: number;
  y: number;
  tone: ContactTone;
  shape?: ContactShape;
  motion?: ContactMotion;
  trackNo?: string;
  bearing?: number;
  rangeNm?: number;
  rangeText?: string;
  speedKn?: number | null;
  course?: number | null;
  object?: string;
  threat?: string;
  size?: string;
  tempC?: number | null;
  altitudeM?: number | null;
  depthM?: number | null;
  ais?: AisState;
  cpa?: string;
  tcpa?: string;
  idStatus?: IdStatus;
  primary?: boolean;
  freq?: string;
  power?: string;
};

export type RadarScene = {
  kind: "radar";
  extra: string;
  heading: string;
  contacts: PictureContact[];
};

export type SonarScene = {
  kind: "sonar";
  extra: string;
  contacts: PictureContact[];
  note: string;
};

export type SpectrumScene = {
  kind: "spectrum";
  extra: string;
  variant: "watch" | "anomaly" | "spoof" | "jam" | "intrusion" | "satcom";
  callout: string;
  tracks: PictureContact[];
};

export type PerimeterScene = {
  kind: "perimeter";
  extra: string;
  variant: "watch" | "breach" | "vehicle" | "tailgate" | "object" | "vip";
  callout: string;
  tracks: PictureContact[];
};

export type PictureScene = RadarScene | SonarScene | SpectrumScene | PerimeterScene;

/** Square PPI: larger ring, room for bearing numerals. */
export const SCOPE = {
  size: 820,
  cx: 410,
  cy: 410,
  ring: 348,
  maxNm: 6,
} as const;

const CX = SCOPE.cx;
const CY = SCOPE.cy;
const RING = SCOPE.ring;

export function polar(bearingDeg: number, nm: number, maxNm = 6) {
  const r = Math.min(nm / maxNm, 1) * RING;
  const rad = ((bearingDeg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

export function formatRange(nm: number): string {
  if (nm < 0.25) return `${Math.round(nm * 1852)} m`;
  return `${nm.toFixed(1)} NM`;
}

type MarkInput = {
  id: string;
  label: string;
  name: string;
  object: string;
  threat: string;
  bearing: number;
  rangeNm: number;
  plotNm?: number;
  maxNm?: number;
  tone: ContactTone;
  shape?: ContactShape;
  motion?: ContactMotion;
  speedKn?: number | null;
  course?: number | null;
  size?: string;
  tempC?: number | null;
  altitudeM?: number | null;
  depthM?: number | null;
  ais?: AisState;
  cpa?: string;
  tcpa?: string;
  idStatus?: IdStatus;
  primary?: boolean;
  type?: string;
  dist?: string;
  rangeText?: string;
  freq?: string;
  power?: string;
  x?: number;
  y?: number;
};

function mark(input: MarkInput): PictureContact {
  const rangeText = input.rangeText ?? formatRange(input.rangeNm);
  const pos =
    input.x != null && input.y != null
      ? { x: input.x, y: input.y }
      : polar(input.bearing, input.plotNm ?? Math.max(input.rangeNm, 0.35), input.maxNm ?? 6);
  const speedBit = input.speedKn != null ? ` · ${input.speedKn} kn` : "";
  return {
    id: input.id,
    label: input.label,
    name: input.name,
    type: input.type ?? `${input.object} · ${input.threat}`,
    dist: input.dist ?? `${rangeText} · brg ${String(input.bearing).padStart(3, "0")}°${speedBit}`,
    ...pos,
    tone: input.tone,
    shape: input.shape,
    motion: input.motion,
    bearing: input.bearing,
    rangeNm: input.rangeNm,
    rangeText,
    speedKn: input.speedKn ?? null,
    course: input.course ?? null,
    object: input.object,
    threat: input.threat,
    size: input.size,
    tempC: input.tempC ?? null,
    altitudeM: input.altitudeM ?? null,
    depthM: input.depthM ?? null,
    ais: input.ais ?? "na",
    cpa: input.cpa,
    tcpa: input.tcpa,
    idStatus: input.idStatus ?? "unidentified",
    primary: input.primary,
    freq: input.freq,
    power: input.power,
  };
}

function numbered(contacts: PictureContact[]): PictureContact[] {
  return contacts.map((contact, index) => ({
    ...contact,
    trackNo: `T${String(index + 1).padStart(2, "0")}`,
  }));
}

function headline(range: string, contacts: PictureContact[]) {
  const primary = contacts.find((item) => item.primary) ?? contacts.find((item) => item.tone !== "ok");
  const tag = primary ? ` · PRI ${primary.trackNo} ${primary.label}` : "";
  return `${range} · ${contacts.length} ON PICTURE${tag}`;
}

const KESTREL = mark({
  id: "kestrel",
  label: "KESTREL 2",
  name: "M/V KESTREL 2",
  object: "Cargo ship",
  threat: "None — known traffic",
  bearing: 318,
  rangeNm: 3.1,
  tone: "ok",
  shape: "vessel",
  speedKn: 9.2,
  course: 142,
  size: "118 m · 4200 t",
  tempC: 14,
  ais: "ok",
  idStatus: "identified",
  type: "Cargo · 4200t · AIS ok",
});

const SIRENA = mark({
  id: "sirena",
  label: "SIRENA",
  name: "M/Y SIRENA",
  object: "Motor yacht",
  threat: "None — known traffic",
  bearing: 48,
  rangeNm: 2.0,
  tone: "ok",
  shape: "vessel",
  speedKn: 11.0,
  course: 226,
  size: "38 m",
  tempC: 16,
  ais: "ok",
  idStatus: "identified",
  type: "Yacht · 38m · known",
});

const UNIDENT_WATCH = mark({
  id: "unident",
  label: "UNIDENT.",
  name: "Fishing vessel (unident.)",
  object: "Fishing vessel",
  threat: "None held — no AIS",
  bearing: 142,
  rangeNm: 4.6,
  tone: "ok",
  shape: "vessel",
  speedKn: 6.4,
  course: 310,
  size: "22 m",
  tempC: 15,
  ais: "none",
  idStatus: "unidentified",
  primary: true,
  type: "No AIS signal",
});

function radarOf(heading: string, range: string, contacts: PictureContact[]): RadarScene {
  const listed = numbered(contacts);
  return {
    kind: "radar",
    extra: headline(range, listed),
    heading,
    contacts: listed,
  };
}

const RADAR: Record<string, RadarScene> = {
  watch: radarOf("HDG 247° · 11.4KN", "RANGE 6.0 NM", [KESTREL, SIRENA, UNIDENT_WATCH]),
  "recon-drone": radarOf("HDG 247° · 11.4KN", "RANGE 6.0 NM", [
    KESTREL,
    SIRENA,
    mark({
      id: "recon",
      label: "UAV",
      name: "Reconnaissance UAV",
      object: "Quad-rotor UAV",
      threat: "Surveillance — camera payload",
      bearing: 90,
      rangeNm: 0.108,
      plotNm: 1.15,
      rangeText: "200 m",
      tone: "attn",
      shape: "uav",
      motion: "orbit",
      speedKn: 18,
      course: 270,
      size: "1.2 m",
      tempC: 19,
      altitudeM: 80,
      ais: "na",
      idStatus: "unidentified",
      primary: true,
      type: "Camera-equipped · no remote ID",
      cpa: "180 m",
      tcpa: "hold",
    }),
  ]),
  "payload-drone": radarOf("HDG 247° · 11.4KN", "RANGE 6.0 NM", [
    KESTREL,
    SIRENA,
    mark({
      id: "payload",
      label: "UAV INBOUND",
      name: "Payload-carrying UAV",
      object: "Fixed-wing UAV",
      threat: "Inbound payload — mass anomaly",
      bearing: 45,
      rangeNm: 1.4,
      tone: "crit",
      shape: "uav",
      motion: "inbound",
      speedKn: 42,
      course: 225,
      size: "2.4 m",
      tempC: 28,
      altitudeM: 60,
      ais: "na",
      idStatus: "classified",
      primary: true,
      type: "Direct inbound · payload profile",
      cpa: "80 m",
      tcpa: "2.0 min",
    }),
  ]),
  "drone-swarm": radarOf("HDG 247° · 11.4KN", "RANGE 6.0 NM", [
    mark({
      id: "s1",
      label: "UAV-1",
      name: "Swarm UAV 1",
      object: "Quad-rotor UAV",
      threat: "Coordinated swarm",
      bearing: 78,
      rangeNm: 2.4,
      tone: "crit",
      shape: "uav",
      motion: "inbound",
      speedKn: 38,
      course: 258,
      size: "0.9 m",
      tempC: 21,
      altitudeM: 90,
      primary: true,
      cpa: "120 m",
      tcpa: "3.8 min",
    }),
    mark({
      id: "s2",
      label: "UAV-2",
      name: "Swarm UAV 2",
      object: "Quad-rotor UAV",
      threat: "Coordinated swarm",
      bearing: 86,
      rangeNm: 2.1,
      tone: "crit",
      shape: "uav",
      motion: "inbound",
      speedKn: 41,
      course: 266,
      size: "0.9 m",
      tempC: 22,
      altitudeM: 85,
    }),
    mark({
      id: "s3",
      label: "UAV-3",
      name: "Swarm UAV 3",
      object: "Quad-rotor UAV",
      threat: "Coordinated swarm",
      bearing: 94,
      rangeNm: 1.8,
      tone: "crit",
      shape: "uav",
      motion: "close",
      speedKn: 44,
      course: 274,
      size: "1.0 m",
      tempC: 23,
      altitudeM: 70,
      cpa: "90 m",
      tcpa: "2.4 min",
    }),
    mark({
      id: "s4",
      label: "UAV-4",
      name: "Swarm UAV 4",
      object: "Quad-rotor UAV",
      threat: "Coordinated swarm",
      bearing: 102,
      rangeNm: 2.2,
      tone: "crit",
      shape: "uav",
      motion: "inbound",
      speedKn: 36,
      course: 282,
      size: "0.8 m",
      tempC: 20,
      altitudeM: 95,
    }),
    mark({
      id: "s5",
      label: "UAV-5",
      name: "Swarm UAV 5",
      object: "Quad-rotor UAV",
      threat: "Coordinated swarm",
      bearing: 90,
      rangeNm: 2.8,
      tone: "crit",
      shape: "uav",
      motion: "hold",
      speedKn: 12,
      course: 270,
      size: "1.1 m",
      tempC: 18,
      altitudeM: 110,
    }),
    mark({
      id: "s6",
      label: "UAV-6",
      name: "Swarm UAV 6",
      object: "Quad-rotor UAV",
      threat: "Coordinated swarm",
      bearing: 110,
      rangeNm: 2.6,
      tone: "crit",
      shape: "uav",
      motion: "close",
      speedKn: 39,
      course: 290,
      size: "0.9 m",
      tempC: 21,
      altitudeM: 88,
    }),
  ]),
  "loitering-drone": radarOf("HDG 247° · 11.4KN", "RANGE 6.0 NM", [
    KESTREL,
    SIRENA,
    mark({
      id: "loiter",
      label: "UAV HOLD",
      name: "Loitering UAV",
      object: "Quad-rotor UAV",
      threat: "Loiter — station keeping 14 min",
      bearing: 270,
      rangeNm: 0.043,
      plotNm: 1.05,
      rangeText: "80 m",
      tone: "attn",
      shape: "uav",
      motion: "hold",
      speedKn: 2,
      course: 90,
      size: "1.0 m",
      tempC: 18,
      altitudeM: 80,
      idStatus: "classified",
      primary: true,
      type: "Fixed station · alt 80 m",
      cpa: "80 m",
      tcpa: "hold",
    }),
  ]),
  "converging-vessel": radarOf("HDG 247° · 11.4KN", "RANGE 6.0 NM", [
    KESTREL,
    SIRENA,
    { ...UNIDENT_WATCH, primary: false },
    mark({
      id: "closing",
      label: "NEW CONTACT",
      name: "NEW CONTACT",
      object: "Unidentified surface craft",
      threat: "Closing intercept — no AIS",
      bearing: 130,
      rangeNm: 4.2,
      tone: "crit",
      shape: "vessel",
      motion: "close",
      speedKn: 8,
      course: 310,
      size: "18 m",
      tempC: 16,
      ais: "none",
      idStatus: "unidentified",
      primary: true,
      type: "Unidentified · no AIS",
      cpa: "0.4 NM",
      tcpa: "18 min",
    }),
  ]),
  "vessel-no-ais": radarOf("HDG 000° · 0.0KN", "RANGE 6.0 NM", [
    SIRENA,
    mark({
      id: "anchor",
      label: "NO AIS",
      name: "Vessel without AIS",
      object: "Motor vessel",
      threat: "Dark ship at anchor",
      bearing: 210,
      rangeNm: 0.8,
      tone: "attn",
      shape: "vessel",
      motion: "static",
      speedKn: 0,
      course: 0,
      size: "24 m",
      tempC: 17,
      ais: "none",
      idStatus: "unidentified",
      primary: true,
      type: "At anchor · no transponder",
      cpa: "0.8 NM",
      tcpa: "stationary 40 min",
    }),
  ]),
  "usv-swarm": radarOf("HDG 247° · 11.4KN", "RANGE 6.0 NM", [
    mark({
      id: "u1",
      label: "USV-1",
      name: "Small surface contact",
      object: "Uncrewed surface vehicle",
      threat: "Coordinated surface swarm",
      bearing: 118,
      rangeNm: 1.6,
      tone: "crit",
      shape: "usv",
      motion: "inbound",
      speedKn: 18,
      course: 298,
      size: "3.5 m",
      tempC: 19,
      ais: "none",
      primary: true,
      cpa: "70 m",
      tcpa: "5.3 min",
    }),
    mark({
      id: "u2",
      label: "USV-2",
      name: "Small surface contact",
      object: "Uncrewed surface vehicle",
      threat: "Coordinated surface swarm",
      bearing: 128,
      rangeNm: 1.8,
      tone: "crit",
      shape: "usv",
      motion: "inbound",
      speedKn: 18,
      course: 308,
      size: "3.4 m",
      tempC: 18,
      ais: "none",
    }),
    mark({
      id: "u3",
      label: "USV-3",
      name: "Small surface contact",
      object: "Uncrewed surface vehicle",
      threat: "Coordinated surface swarm",
      bearing: 138,
      rangeNm: 2.0,
      tone: "crit",
      shape: "usv",
      motion: "close",
      speedKn: 18,
      course: 318,
      size: "3.6 m",
      tempC: 19,
      ais: "none",
    }),
    mark({
      id: "u4",
      label: "USV-4",
      name: "Small surface contact",
      object: "Uncrewed surface vehicle",
      threat: "Coordinated surface swarm",
      bearing: 148,
      rangeNm: 2.2,
      tone: "crit",
      shape: "usv",
      motion: "inbound",
      speedKn: 18,
      course: 328,
      size: "3.5 m",
      tempC: 18,
      ais: "none",
    }),
  ]),
  "critical-closing-speed": radarOf("HDG 247° · 11.4KN", "RANGE 6.0 NM", [
    KESTREL,
    SIRENA,
    mark({
      id: "fast",
      label: "CLOSING 22KN",
      name: "High-speed contact",
      object: "Fast surface craft",
      threat: "Collision — CPA under 50 m",
      bearing: 155,
      rangeNm: 1.1,
      tone: "crit",
      shape: "vessel",
      motion: "inbound",
      speedKn: 22,
      course: 335,
      size: "12 m",
      tempC: 20,
      ais: "none",
      idStatus: "unidentified",
      primary: true,
      type: "CPA under 50 m · 3 min",
      cpa: "< 50 m",
      tcpa: "3.0 min",
    }),
  ]),
  "man-overboard": radarOf("HDG 247° · 4.0KN", "RANGE 0.5 NM", [
    mark({
      id: "mob",
      label: "MOB",
      name: "Person in the water",
      object: "Person",
      threat: "Man overboard — port",
      bearing: 270,
      rangeNm: 0.022,
      plotNm: 0.55,
      maxNm: 0.8,
      rangeText: "40 m",
      tone: "crit",
      shape: "mob",
      motion: "hold",
      speedKn: 0.4,
      course: 247,
      size: "1.8 m",
      tempC: 32,
      ais: "na",
      idStatus: "classified",
      primary: true,
      type: "Port side · crew report",
      cpa: "40 m",
      tcpa: "mark",
    }),
  ]),
  "multi-domain-event": radarOf("HDG 247° · 11.4KN", "RANGE 6.0 NM", [
    mark({
      id: "md-uav",
      label: "UAV",
      name: "Airborne UAV",
      object: "Quad-rotor UAV",
      threat: "Air raid with surface contact",
      bearing: 90,
      rangeNm: 1.6,
      tone: "crit",
      shape: "uav",
      motion: "inbound",
      speedKn: 36,
      course: 270,
      size: "1.3 m",
      tempC: 24,
      altitudeM: 75,
      primary: true,
      cpa: "200 m",
      tcpa: "2.6 min",
    }),
    mark({
      id: "md-surf",
      label: "NEW CONTACT",
      name: "Unidentified surface vessel",
      object: "Surface craft",
      threat: "Simultaneous surface close",
      bearing: 140,
      rangeNm: 2.4,
      tone: "crit",
      shape: "vessel",
      motion: "close",
      speedKn: 14,
      course: 320,
      size: "16 m",
      tempC: 17,
      ais: "none",
      idStatus: "unidentified",
    }),
    KESTREL,
  ]),
};

function sonarOf(extra: string, note: string, contacts: PictureContact[]): SonarScene {
  return { kind: "sonar", extra: headline(extra, numbered(contacts)), note, contacts: numbered(contacts) };
}

const SONAR: Record<string, SonarScene> = {
  watch: sonarOf("RANGE 1.0 NM", "PASSIVE WATCH", [
    mark({
      id: "bio",
      label: "CONTACT",
      name: "Acoustic contact",
      object: "Biological / uncertain",
      threat: "None held",
      bearing: 40,
      rangeNm: 0.42,
      plotNm: 3.4,
      tone: "ok",
      shape: "sonar",
      motion: "hold",
      speedKn: 3,
      size: "unknown",
      tempC: 17,
      depthM: 15,
      idStatus: "unidentified",
      primary: true,
    }),
  ]),
  "stealth-uuv": sonarOf("RANGE 1.0 NM", "WEAK RETURN · BRG 200", [
    mark({
      id: "uuv",
      label: "WEAK · UUV?",
      name: "Stealth underwater drone",
      object: "Possible UUV",
      threat: "Covert underwater approach",
      bearing: 200,
      rangeNm: 0.55,
      plotNm: 3.2,
      tone: "attn",
      shape: "sonar",
      motion: "hold",
      speedKn: 4,
      course: 20,
      size: "2.1 m",
      tempC: 17,
      depthM: 15,
      idStatus: "unidentified",
      primary: true,
      type: "Low confidence · possible UUV",
    }),
  ]),
  "diver-near-hull": sonarOf("RANGE 1.0 NM", "SWIMMER · DEPTH 3 M", [
    mark({
      id: "diver",
      label: "SWIMMER",
      name: "Diver near hull",
      object: "Swimmer / diver",
      threat: "Hull approach",
      bearing: 250,
      rangeNm: 0.008,
      plotNm: 1.05,
      rangeText: "15 m",
      tone: "attn",
      shape: "sonar",
      motion: "close",
      speedKn: 1.2,
      size: "1.8 m",
      tempC: 18,
      depthM: 3,
      idStatus: "classified",
      primary: true,
      type: "Swimmer signature · 15 m",
      cpa: "15 m",
      tcpa: "closing",
    }),
  ]),
  "uuv-payload": sonarOf("RANGE 1.0 NM", "NON-BIOLOGICAL · INBOUND", [
    mark({
      id: "payload-uuv",
      label: "UUV INBOUND",
      name: "UUV approaching infrastructure",
      object: "UUV",
      threat: "Payload UUV — hull / pier",
      bearing: 175,
      rangeNm: 0.22,
      plotNm: 1.8,
      rangeText: "410 m",
      tone: "crit",
      shape: "sonar",
      motion: "inbound",
      speedKn: 6,
      course: 355,
      size: "3.2 m",
      tempC: 16,
      depthM: 8,
      idStatus: "classified",
      primary: true,
      type: "Non-biological · hull/pier",
      cpa: "8 m",
      tcpa: "2.1 min",
    }),
  ]),
};

function rf(
  id: string,
  label: string,
  name: string,
  object: string,
  threat: string,
  tone: ContactTone,
  extra: Partial<MarkInput> = {},
): PictureContact {
  return mark({
    id,
    label,
    name,
    object,
    threat,
    bearing: extra.bearing ?? 0,
    rangeNm: extra.rangeNm ?? 0,
    rangeText: extra.rangeText ?? (extra.rangeNm ? undefined : "—"),
    tone,
    shape: "rf",
    idStatus: extra.idStatus ?? "unidentified",
    primary: extra.primary,
    freq: extra.freq,
    power: extra.power,
    type: extra.type,
    dist: extra.dist ?? `${extra.freq ?? "RF"} · ${extra.power ?? ""}`.trim(),
    x: extra.x ?? 0,
    y: extra.y ?? 0,
    tempC: extra.tempC,
    size: extra.size,
  });
}

const SPECTRUM: Record<string, SpectrumScene> = {
  watch: {
    kind: "spectrum",
    extra: "WIDE-BAND SCAN · 0 ALERTS",
    variant: "watch",
    callout: "SCAN STABLE",
    tracks: numbered([
      rf("vhf", "VHF 16", "Watch VHF", "Marine VHF", "None — licensed", "ok", {
        freq: "156.800 MHz",
        power: "−42 dBm",
        idStatus: "identified",
        primary: true,
        type: "Ch.16 watch",
      }),
    ]),
  },
  "anomalous-rf": {
    kind: "spectrum",
    extra: "WIDE-BAND SCAN · BURST",
    variant: "anomaly",
    callout: "ANOMALY — 5.8GHz",
    tracks: numbered([
      rf("burst", "5.8 GHz", "Anomalous burst", "ISM / video downlink", "Unknown emitter", "attn", {
        freq: "5.800 GHz",
        power: "−18 dBm",
        primary: true,
        type: "Burst · no match",
        size: "narrow hop",
      }),
    ]),
  },
  "gps-spoofing": {
    kind: "spectrum",
    extra: "PNT CHECK · OFFSET 340 M",
    variant: "spoof",
    callout: "GPS ≠ RADAR · 340 M",
    tracks: numbered([
      rf("spoof", "GPS L1", "Spoofed PNT", "GNSS L1", "Spoof — 340 m offset", "attn", {
        freq: "1575.42 MHz",
        power: "−12 dBm",
        idStatus: "classified",
        primary: true,
        type: "GPS ≠ radar plot",
        rangeNm: 0.184,
        rangeText: "340 m",
      }),
    ]),
  },
  "comms-jamming": {
    kind: "spectrum",
    extra: "SATCOM / VHF · DEGRADED",
    variant: "jam",
    callout: "JAMMING — LINK QUALITY DOWN",
    tracks: numbered([
      rf("jam", "JAMMER", "Broadband jammer", "Noise jammer", "Comms denial", "crit", {
        freq: "VHF + L-band",
        power: "−6 dBm",
        idStatus: "classified",
        primary: true,
        type: "Link quality 12%",
      }),
    ]),
  },
  "network-intrusion": {
    kind: "spectrum",
    extra: "ONBOARD NET · AUTH WATCH",
    variant: "intrusion",
    callout: "UNRECOGNIZED DEVICE",
    tracks: numbered([
      rf("nic", "HOST ?", "Unrecognized host", "Onboard Ethernet / Wi-Fi", "Intrusion attempt", "attn", {
        freq: "2.4 / 5 GHz + LAN",
        power: "local",
        idStatus: "unidentified",
        primary: true,
        type: "Unknown MAC",
        size: "1 host",
      }),
    ]),
  },
  "support-center-lost": {
    kind: "spectrum",
    extra: "SATCOM · 3 FAILED RETRIES",
    variant: "satcom",
    callout: "SUPPORT LINK LOST",
    tracks: numbered([
      rf("sat", "SATCOM", "Support satcom", "Ka-band satcom", "Link lost", "crit", {
        freq: "Ka-band",
        power: "no lock",
        idStatus: "identified",
        primary: true,
        type: "3 failed retries",
      }),
    ]),
  },
};

function site(
  id: string,
  label: string,
  name: string,
  object: string,
  threat: string,
  tone: ContactTone,
  extra: Partial<MarkInput> = {},
): PictureContact {
  return mark({
    id,
    label,
    name,
    object,
    threat,
    bearing: extra.bearing ?? 0,
    rangeNm: extra.rangeNm ?? 0,
    rangeText: extra.rangeText ?? (extra.rangeNm ? undefined : "—"),
    tone,
    shape: "site",
    idStatus: extra.idStatus ?? "unidentified",
    primary: extra.primary,
    size: extra.size,
    tempC: extra.tempC,
    speedKn: extra.speedKn,
    type: extra.type,
    dist: extra.dist ?? extra.rangeText ?? name,
    x: extra.x ?? 0,
    y: extra.y ?? 0,
  });
}

const PERIMETER: Record<string, PerimeterScene> = {
  watch: {
    kind: "perimeter",
    extra: "5 SENSORS · QUIET",
    variant: "watch",
    callout: "ALL SECTORS CLEAR",
    tracks: numbered([
      site("clear", "SECTORS", "All sectors", "Site sensors", "None", "ok", {
        idStatus: "identified",
        primary: true,
        type: "5 sensors quiet",
        rangeText: "—",
      }),
    ]),
  },
  "perimeter-breach": {
    kind: "perimeter",
    extra: "5 SENSORS · 1 ALERT",
    variant: "breach",
    callout: "SECTOR 4 — TRIGGERED",
    tracks: numbered([
      site("breach", "SECTOR 4", "Perimeter breach", "Person", "Fence / sector trip", "attn", {
        rangeNm: 0.022,
        rangeText: "40 m",
        size: "1.8 m",
        tempC: 34,
        idStatus: "classified",
        primary: true,
        type: "IR + beam",
        speedKn: 5,
      }),
    ]),
  },
  "unauthorized-vehicle": {
    kind: "perimeter",
    extra: "GATE 2 · HOLD",
    variant: "vehicle",
    callout: "VEHICLE — NO CREDENTIAL",
    tracks: numbered([
      site("veh", "GATE 2", "Unauthorized vehicle", "SUV", "No credential", "attn", {
        rangeText: "at barrier",
        size: "4.8 m",
        tempC: 41,
        idStatus: "unidentified",
        primary: true,
        type: "Plate unread",
        speedKn: 0,
      }),
    ]),
  },
  tailgating: {
    kind: "perimeter",
    extra: "ACCESS POINT · TWO PERSONS",
    variant: "tailgate",
    callout: "TAILGATE — SINGLE BADGE",
    tracks: numbered([
      site("tail", "ACCESS", "Tailgating", "Two persons", "Single badge, two bodies", "attn", {
        rangeText: "at door",
        size: "2 persons",
        tempC: 33,
        idStatus: "classified",
        primary: true,
        type: "1 badge / 2 IR",
      }),
    ]),
  },
  "unattended-object": {
    kind: "perimeter",
    extra: "ZONE B · 20 MIN",
    variant: "object",
    callout: "UNATTENDED OBJECT",
    tracks: numbered([
      site("bag", "ZONE B", "Unattended object", "Bag / package", "Left 20 min", "attn", {
        rangeText: "Zone B",
        size: "0.6 m",
        tempC: 22,
        idStatus: "unidentified",
        primary: true,
        type: "No owner in frame",
      }),
    ]),
  },
  "special-event-mode": {
    kind: "perimeter",
    extra: "VIP PROFILE · RAISED SENSITIVITY",
    variant: "vip",
    callout: "SPECIAL EVENT MODE",
    tracks: numbered([
      site("vip", "VIP", "Special event watch", "Site profile", "Raised sensitivity — no trip", "ok", {
        idStatus: "identified",
        primary: true,
        type: "Thresholds tightened",
        rangeText: "all zones",
      }),
    ]),
  },
};

export function radarScene(scenarioId: string): RadarScene {
  return RADAR[scenarioId] ?? RADAR.watch;
}

export function sonarScene(scenarioId: string): SonarScene {
  return SONAR[scenarioId] ?? SONAR.watch;
}

export function spectrumScene(scenarioId: string): SpectrumScene {
  return SPECTRUM[scenarioId] ?? SPECTRUM.watch;
}

export function perimeterScene(scenarioId: string): PerimeterScene {
  return PERIMETER[scenarioId] ?? PERIMETER.watch;
}

export function sceneTracks(
  panelType: "radar" | "sonar" | "spectrum" | "perimeter",
  scenarioId: string,
  empty?: boolean,
): PictureContact[] {
  if (empty) return [];
  if (panelType === "radar") return radarScene(scenarioId).contacts;
  if (panelType === "sonar") return sonarScene(scenarioId).contacts;
  if (panelType === "spectrum") return spectrumScene(scenarioId).tracks;
  return perimeterScene(scenarioId).tracks;
}

export function primaryTrack(contacts: PictureContact[]): PictureContact | null {
  return (
    contacts.find((item) => item.primary) ??
    contacts.find((item) => item.tone !== "ok") ??
    contacts[0] ??
    null
  );
}

export function sceneExtra(
  panelType: "radar" | "sonar" | "spectrum" | "perimeter",
  scenarioId: string,
  empty?: boolean,
): string {
  if (empty) return "NO SENSORS";
  if (panelType === "radar") return radarScene(scenarioId).extra;
  if (panelType === "sonar") return sonarScene(scenarioId).extra;
  if (panelType === "spectrum") return spectrumScene(scenarioId).extra;
  return perimeterScene(scenarioId).extra;
}

/** Alarm / crisis red — keep in sync with Tailwind `crit`. */
export const TONE_CRIT = "#DC2626";
export const TONE_ATTN = "#E8B23D";
export const TONE_OK = "#33D3A6";

/** Distinct T01…T10 identities — plot, chips, and table stay on the same hue. */
export const TRACK_HUES = [
  "#38BDF8",
  "#F59E0B",
  "#A78BFA",
  "#34D399",
  "#F472B6",
  "#FB923C",
  "#22D3EE",
  "#FACC15",
  "#818CF8",
  "#FB7185",
] as const;

export function toneColor(tone: ContactTone) {
  if (tone === "attn") return TONE_ATTN;
  if (tone === "crit") return TONE_CRIT;
  return TONE_OK;
}

export function trackHue(
  track?: { trackNo?: string } | string | null,
  index = 0,
): string {
  const raw = typeof track === "string" ? track : track?.trackNo;
  const parsed = raw ? Number.parseInt(raw.replace(/\D/g, ""), 10) : Number.NaN;
  const n = Number.isFinite(parsed) && parsed > 0 ? parsed : index + 1;
  return TRACK_HUES[(n - 1) % TRACK_HUES.length];
}

export function trackTint(hex: string, alpha = 0.16) {
  const n = hex.replace("#", "");
  const r = Number.parseInt(n.slice(0, 2), 16);
  const g = Number.parseInt(n.slice(2, 4), 16);
  const b = Number.parseInt(n.slice(4, 6), 16);
  if ([r, g, b].some((value) => Number.isNaN(value))) return `rgb(56 189 248 / ${alpha})`;
  return `rgb(${r} ${g} ${b} / ${alpha})`;
}

export function motionTowardOwnShip(x: number, y: number, px: number) {
  const dx = CX - x;
  const dy = CY - y;
  const len = Math.hypot(dx, dy) || 1;
  return { mx: (dx / len) * px, my: (dy / len) * px };
}
