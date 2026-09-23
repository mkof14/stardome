"use client";

import { cn } from "@/lib/cn";
import {
  STUDIO_BARS,
  vuBand,
  vuBarColor,
  waveColor,
  waveHudColor,
  WAVE_BINS,
} from "@/lib/studio-meter";

export function StudioVu({
  levels,
  peak,
  live,
  vertical,
}: {
  levels: number[];
  peak: boolean;
  live: boolean;
  vertical?: boolean;
}) {
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
        "flex",
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
        const size = live ? Math.max(18, level * 100) : 22;
        return (
          <span
            key={index}
            data-band={band}
            data-lit={lit ? "1" : "0"}
            className={vertical ? "w-full min-h-[3px] flex-1" : "w-2"}
            style={{
              height: vertical ? undefined : `${size}%`,
              background: color,
              boxShadow: lit ? `0 0 8px ${color}` : "none",
              opacity: lit ? 1 : 0.85,
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
      className="relative flex h-full min-h-[9rem] w-full items-center justify-center overflow-hidden"
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-x-6 top-1/2 h-px",
          hud ? "bg-orange/30" : "bg-ok/25",
        )}
      />
      <div className="flex h-[78%] w-full items-center gap-px px-3">
        {wave.map((value, index) => {
          const mag = live
            ? Math.min(1, Math.max(0.05, Math.abs(value)))
            : hud
              ? Math.min(
                  1,
                  Math.max(
                    Math.abs(value),
                    0.14 + 0.22 * Math.abs(Math.sin((index / Math.max(1, wave.length)) * Math.PI)),
                  ),
                )
              : 0;
          const color = hud
            ? waveHudColor(index, wave.length, mag, peak && live)
            : waveColor(mag, peak && live);
          return (
            <span
              key={index}
              className="min-w-px flex-1 rounded-full"
              style={{
                height: `${Math.max(2, mag * 100)}%`,
                background: color,
                boxShadow: mag > 0.08 ? `0 0 10px ${color}` : "none",
                opacity: live || hud ? Math.max(0.35, mag + 0.25) : 0.22,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
