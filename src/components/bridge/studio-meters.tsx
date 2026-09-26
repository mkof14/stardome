"use client";

import { cn } from "@/lib/cn";
import {
  compactWave,
  STUDIO_BARS,
  vuBand,
  vuBarColor,
  waveColor,
  waveHudColor,
  WAVE_BINS,
} from "@/lib/studio-meter";

export function StudioVu({
  levels,
  samples,
  peak,
  live,
  vertical,
  compact,
  tone = "listen",
}: {
  levels: number[];
  samples?: number[];
  peak: boolean;
  live: boolean;
  vertical?: boolean;
  compact?: boolean;
  tone?: "speak" | "listen" | "idle";
}) {
  if (compact) {
    const bins = samples?.length ? compactWave(samples, 28) : levels.length ? levels : Array.from({ length: STUDIO_BARS }, () => 0);
    return (
      <div
        data-testid="assistant-vu"
        data-peak={peak ? "1" : "0"}
        data-live={live ? "1" : "0"}
        className="relative h-5 min-w-0 flex-1 overflow-hidden rounded-md bg-bridge-bg/80"
        aria-hidden
      >
        <span className="pointer-events-none absolute inset-x-1 top-1/2 h-px -translate-y-px bg-bridge-line/80" />
        <div className="flex h-full w-full items-center gap-px px-0.5">
          {bins.map((value, index) => {
            const mag = live ? Math.min(1, Math.max(0.04, value)) : 0.06;
            const color = live
              ? tone === "speak"
                ? peak
                  ? "#DC2626"
                  : "rgb(251 146 60)"
                : waveColor(mag, peak)
              : "rgb(148 163 168 / 0.35)";
            return (
              <span
                key={index}
                className="min-w-px flex-1 self-center rounded-full"
                style={{
                  height: `${Math.max(8, mag * 92)}%`,
                  background: color,
                  opacity: live ? Math.max(0.45, mag + 0.2) : 0.35,
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }

  const bars = levels.length ? levels : Array.from({ length: STUDIO_BARS }, () => 0);
  const litCount = live
    ? bars.reduce((count, level, index) => (level > 0.04 ? index + 1 : count), 0)
    : 0;
  return (
    <div
      data-testid="assistant-vu"
      data-peak={peak ? "1" : "0"}
      data-live={live ? "1" : "0"}
      className={cn(
        "flex overflow-hidden",
        vertical
          ? "h-full w-4 flex-col-reverse items-center gap-0.5"
          : "h-10 min-w-0 flex-1 items-end gap-0.5",
      )}
      aria-hidden
    >
      {bars.map((level, index) => {
        const lit = vertical ? index < litCount : live && level > 0.04;
        const band = vuBand(index, bars.length);
        const color = vuBarColor(index, bars.length, lit, peak && live);
        const size = live ? Math.max(10, Math.min(100, level * 100)) : 12;
        return (
          <span
            key={index}
            data-band={band}
            data-lit={lit ? "1" : "0"}
            className={vertical ? "w-full min-h-[3px] flex-1" : "w-2"}
            style={{
              height: vertical ? undefined : `${size}%`,
              background: color,
              opacity: lit ? 1 : 0.45,
            }}
          />
        );
      })}
    </div>
  );
}

export function StudioWave({
  samples,
  peak,
  live,
  hud,
}: {
  samples: number[];
  peak: boolean;
  live: boolean;
  hud?: boolean;
}) {
  const wave = samples.length ? samples : Array.from({ length: WAVE_BINS }, () => 0);
  return (
    <div
      data-testid="studio-wave"
      className="relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden"
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-x-3 top-1/2 h-px",
          hud ? "bg-orange/30" : "bg-ok/25",
        )}
      />
      <div className="flex h-full max-h-full w-full items-center gap-px px-2 py-1">
        {wave.map((value, index) => {
          const mag = live
            ? Math.min(1, Math.max(0.04, Math.abs(value)))
            : hud
              ? Math.min(
                  1,
                  Math.max(
                    Math.abs(value),
                    0.1 + 0.16 * Math.abs(Math.sin((index / Math.max(1, wave.length)) * Math.PI)),
                  ),
                )
              : 0.05;
          const color = hud
            ? waveHudColor(index, wave.length, mag, peak && live)
            : waveColor(mag, peak && live);
          return (
            <span
              key={index}
              className="min-w-px flex-1 self-center rounded-full"
              style={{
                height: `${Math.max(6, mag * 88)}%`,
                background: color,
                opacity: live || hud ? Math.max(0.35, mag + 0.2) : 0.22,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
