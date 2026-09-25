export type PilotMic = "idle" | "listening" | "processing" | "speaking";

export type PilotMood = "ease" | "idle" | "listen" | "speak" | "serious" | "urgent";

export const PILOT_MOODS: readonly PilotMood[] = [
  "ease",
  "idle",
  "listen",
  "speak",
  "serious",
  "urgent",
];

export const PILOT_PLATES: Record<PilotMood, string> = {
  ease: "/pilot/ease.webp",
  idle: "/pilot/idle.webp",
  listen: "/pilot/listen.webp",
  speak: "/pilot/speak.webp",
  serious: "/pilot/serious.webp",
  urgent: "/pilot/urgent.webp",
};

export const PILOT_LOOP_FRAMES: Record<PilotMood, readonly string[]> = {
  ease: ["/pilot/ease.webp", "/pilot/idle-breath.webp", "/pilot/idle.webp", "/pilot/ease.webp"],
  idle: [
    "/pilot/idle.webp",
    "/pilot/idle-breath.webp",
    "/pilot/idle-turn.webp",
    "/pilot/idle.webp",
    "/pilot/idle-blink.webp",
  ],
  listen: ["/pilot/listen.webp", "/pilot/listen-nod.webp", "/pilot/idle-turn.webp"],
  speak: [
    "/pilot/speak.webp",
    "/pilot/speak-open.webp",
    "/pilot/speak-point.webp",
    "/pilot/speak-close.webp",
  ],
  serious: ["/pilot/serious.webp", "/pilot/idle-turn.webp", "/pilot/idle-blink.webp"],
  urgent: ["/pilot/urgent.webp", "/pilot/urgent-lean.webp", "/pilot/speak-point.webp"],
};

export const PILOT_VIDEOS: Record<PilotMood, { webm: string; mp4: string }> = {
  ease: { webm: "/pilot/anim-ease.webm", mp4: "/pilot/anim-ease.mp4" },
  idle: { webm: "/pilot/anim-idle.webm", mp4: "/pilot/anim-idle.mp4" },
  listen: { webm: "/pilot/anim-listen.webm", mp4: "/pilot/anim-listen.mp4" },
  speak: { webm: "/pilot/anim-speak.webm", mp4: "/pilot/anim-speak.mp4" },
  serious: { webm: "/pilot/anim-serious.webm", mp4: "/pilot/anim-serious.mp4" },
  urgent: { webm: "/pilot/anim-urgent.webm", mp4: "/pilot/anim-urgent.mp4" },
};

export function loopStep(
  index: number,
  length: number,
  dir: 1 | -1,
): { index: number; dir: 1 | -1 } {
  if (length <= 1) return { index: 0, dir: 1 };
  let next = index + dir;
  let nextDir = dir;
  if (next >= length - 1) {
    next = length - 1;
    nextDir = -1;
  } else if (next <= 0) {
    next = 0;
    nextDir = 1;
  }
  return { index: next, dir: nextDir };
}

export function loopMs(mood: PilotMood, speaking: boolean, level: number) {
  const drive = Math.max(0, Math.min(1, level));
  if (speaking || mood === "speak") return Math.round(160 - drive * 55);
  if (mood === "urgent") return 220;
  if (mood === "listen") return 300;
  return 360;
}

export type RiskTone = "calm" | "attention" | "urgent";

export function riskTone(risk?: string): RiskTone {
  const value = (risk ?? "").trim().toUpperCase();
  if (value === "CRITICAL" || value === "ELEVATED") return "urgent";
  if (value === "ATTENTION") return "attention";
  return "calm";
}

export function pilotMood(input: {
  mic: PilotMic;
  urgent?: boolean;
  risk?: string;
}): PilotMood {
  const tone = input.urgent || riskTone(input.risk) === "urgent" ? "urgent" : riskTone(input.risk);
  if (input.mic === "speaking") return tone === "urgent" ? "urgent" : "speak";
  if (input.mic === "listening" || input.mic === "processing") return "listen";
  if (tone === "urgent") return "urgent";
  if (tone === "attention") return "serious";
  return "ease";
}

export function voiceLevelFromBars(bars: number[]): number {
  if (!bars.length) return 0;
  return Math.min(1, Math.max(0, ...bars));
}
