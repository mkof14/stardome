import { describe, expect, it } from "vitest";
import {
  meterFromTimeDomain,
  PEAK_SAMPLE,
  silenceBars,
  silenceWave,
  STUDIO_BARS,
  VU_GREEN,
  VU_RED,
  vuBarColor,
  WAVE_BINS,
  waveColor,
  waveHudColor,
} from "@/lib/studio-meter";

function sine(amplitude: number, length = 2048) {
  const samples = new Uint8Array(length);
  for (let i = 0; i < length; i += 1) {
    const value = Math.sin((i / length) * Math.PI * 8) * amplitude;
    samples[i] = Math.max(0, Math.min(255, Math.round(128 + value * 127)));
  }
  return samples;
}

describe("studio meter", () => {
  it("reads real time-domain samples and stays silent on a flat line", () => {
    const quiet = meterFromTimeDomain(new Uint8Array(64).fill(128));
    expect(quiet.rms).toBeLessThan(0.02);
    expect(quiet.peak).toBe(false);
    expect(quiet.bars.every((bar) => bar === 0)).toBe(true);
    expect(quiet.wave).toHaveLength(WAVE_BINS);
    expect(silenceWave()).toHaveLength(WAVE_BINS);
    expect(silenceBars()).toHaveLength(STUDIO_BARS);
  });

  it("lights green then red from real amplitude, never a simulated floor", () => {
    const soft = meterFromTimeDomain(sine(0.25));
    expect(soft.peak).toBe(false);
    expect(soft.bars.some((bar) => bar > 0)).toBe(true);
    expect(vuBarColor(0, STUDIO_BARS, true, false)).toBe(VU_GREEN);
    expect(vuBarColor(STUDIO_BARS - 1, STUDIO_BARS, true, false)).toBe(VU_RED);
    expect(vuBarColor(0, STUDIO_BARS, false, false)).toMatch(/0\.16/);

    const hot = meterFromTimeDomain(sine(PEAK_SAMPLE + 0.05));
    expect(hot.peak).toBe(true);
    expect(waveColor(0.3, false)).toBe(VU_GREEN);
    expect(waveColor(0.8, false)).toBe(VU_RED);
    expect(waveColor(0.2, true)).toBe(VU_RED);
    expect(waveHudColor(0, 10, 0.5, false)).toMatch(/241|240/);
    expect(waveHudColor(9, 10, 0.5, false)).toMatch(/56|57/);
    expect(waveHudColor(4, 10, 0.9, false)).toBe(VU_RED);
  });
});
