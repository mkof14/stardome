"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { fieldSamples, type PilotMood } from "@/lib/pilot-presence";

export type PilotPresenceSize = "rail" | "talk" | "dock" | "watch";

const SIZE: Record<PilotPresenceSize, string> = {
  rail: "h-8 w-8 rounded-full",
  talk: "h-8 w-8 rounded-full",
  dock: "h-14 w-14 rounded-full",
  watch: "h-12 w-12 rounded-full sm:h-14 sm:w-14",
};

const BINS: Record<PilotPresenceSize, number> = {
  rail: 11,
  talk: 11,
  dock: 18,
  watch: 18,
};

export function PilotPresence({
  mood,
  size,
  level = 0,
  speaking,
  listening,
  wave,
  className,
}: {
  mood: PilotMood;
  size: PilotPresenceSize;
  level?: number;
  speaking?: boolean;
  listening?: boolean;
  wave?: number[];
  className?: string;
}) {
  const drive = Math.max(0, Math.min(1, level));
  const live = Boolean(speaking || listening);
  const samples = fieldSamples(wave, BINS[size], live, drive);
  return (
    <span
      data-testid="pilot-presence"
      data-mood={mood}
      data-size={size}
      data-anim="channel"
      data-name="Pilot"
      data-speaking={speaking ? "true" : "false"}
      data-listening={listening ? "true" : "false"}
      aria-label="Pilot"
      className={cn("pilot-presence relative inline-flex shrink-0 overflow-hidden", SIZE[size], className)}
      style={{ "--pilot-level": String(drive) } as CSSProperties}
    >
      <span className="pilot-presence-well" aria-hidden />
      <span className="pilot-pulse" aria-hidden />
      <span className="pilot-orbit" aria-hidden />
      <span className="pilot-glow" aria-hidden />
      <span className="pilot-field" aria-hidden>
        {samples.map((value, index) => (
          <span
            key={index}
            className="pilot-field-bar"
            style={
              {
                "--pilot-bar": String(value),
                "--pilot-i": String(index),
              } as CSSProperties
            }
          />
        ))}
      </span>
      <span className="pilot-core" aria-hidden />
      <span className="pilot-presence-rim" aria-hidden />
    </span>
  );
}
