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

/** Real voice bins when Pilot is live; a calm field when the channel is quiet. */
export function fieldSamples(
  wave: number[] | undefined,
  bins: number,
  live: boolean,
  level = 0,
): number[] {
  const count = Math.max(8, bins);
  if (live && wave?.length) {
    const step = wave.length / count;
    return Array.from({ length: count }, (_, i) => {
      const index = Math.min(wave.length - 1, Math.floor(i * step));
      return Math.min(1, Math.max(0.06, Math.abs(wave[index] ?? 0)));
    });
  }
  const drive = Math.max(0, Math.min(1, level));
  return Array.from({ length: count }, (_, i) => {
    const t = i / Math.max(1, count - 1);
    return 0.16 + 0.2 * Math.sin(t * Math.PI) + drive * 0.18;
  });
}
