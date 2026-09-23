export const VU_GREEN = "#33D3A6";
export const VU_YELLOW = "#F5C518";
export const VU_RED = "#DC2626";
export const STUDIO_BARS = 12;
export const WAVE_BINS = 96;
export const VU_YELLOW_RATIO = 0.48;
export const VU_RED_RATIO = 0.72;
export const PEAK_RMS = 0.42;
export const PEAK_SAMPLE = 0.78;

export type VuBand = "green" | "yellow" | "red";

export function vuBand(index: number, count: number): VuBand {
  const ratio = count <= 0 ? 1 : (index + 1) / count;
  if (ratio >= VU_RED_RATIO) return "red";
  if (ratio >= VU_YELLOW_RATIO) return "yellow";
  return "green";
}

export function vuBandColor(band: VuBand, lit: boolean): string {
  if (band === "red") return lit ? VU_RED : "rgb(220 38 38 / 0.45)";
  if (band === "yellow") return lit ? VU_YELLOW : "rgb(245 197 24 / 0.45)";
  return lit ? VU_GREEN : "rgb(51 211 166 / 0.42)";
}

export type StudioReading = {
  rms: number;
  peak: boolean;
  maxAbs: number;
  wave: number[];
  bars: number[];
};

export function downsampleWave(samples: Uint8Array, bins: number): number[] {
  const wave = Array.from({ length: bins }, () => 0);
  if (!samples.length || bins <= 0) return wave;
  const step = samples.length / bins;
  for (let i = 0; i < bins; i += 1) {
    const index = Math.min(samples.length - 1, Math.floor(i * step));
    wave[i] = ((samples[index] ?? 128) - 128) / 128;
  }
  return wave;
}

export function meterFromTimeDomain(
  samples: Uint8Array,
  barCount = STUDIO_BARS,
  waveBins = WAVE_BINS,
): StudioReading {
  let sum = 0;
  let maxAbs = 0;
  for (let i = 0; i < samples.length; i += 1) {
    const value = ((samples[i] ?? 128) - 128) / 128;
    sum += value * value;
    const abs = Math.abs(value);
    if (abs > maxAbs) maxAbs = abs;
  }
  const rms = samples.length ? Math.sqrt(sum / samples.length) : 0;
  const peak = rms >= PEAK_RMS || maxAbs >= PEAK_SAMPLE;
  const lit = Math.min(barCount, Math.round(rms * 24));
  const bars = Array.from({ length: barCount }, (_, index) =>
    index < lit ? Math.min(1, 0.28 + rms * 1.8) : 0,
  );
  return {
    rms,
    peak,
    maxAbs,
    wave: downsampleWave(samples, waveBins),
    bars,
  };
}

export function vuBarColor(
  index: number,
  count: number,
  lit: boolean,
  peak: boolean,
): string {
  const band = vuBand(index, count);
  if (peak && lit && band !== "green") return VU_RED;
  return vuBandColor(band, lit);
}

export function waveColor(magnitude: number, peak: boolean): string {
  if (peak || magnitude >= 0.72) return VU_RED;
  if (magnitude >= 0.42) return VU_YELLOW;
  return VU_GREEN;
}

export function waveHudColor(index: number, count: number, magnitude: number, peak: boolean): string {
  if (peak || magnitude >= 0.78) return VU_RED;
  const t = count <= 1 ? 0.5 : index / (count - 1);
  const r = Math.round(241 + (56 - 241) * t);
  const g = Math.round(90 + (189 - 90) * t);
  const b = Math.round(0 + (248 - 0) * t);
  const a = Math.max(0.35, Math.min(1, 0.4 + magnitude * 0.75));
  return `rgb(${r} ${g} ${b} / ${a})`;
}

export function silenceWave(bins = WAVE_BINS): number[] {
  return Array.from({ length: bins }, () => 0);
}

export function silenceBars(count = STUDIO_BARS): number[] {
  return Array.from({ length: count }, () => 0);
}
