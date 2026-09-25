export type PilotMic = "idle" | "listening" | "processing" | "speaking";

export type PilotMood = "ease" | "idle" | "listen" | "speak" | "serious" | "urgent";

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
