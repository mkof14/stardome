"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { fieldSamples, type PilotMood } from "@/lib/pilot-presence";

export type PilotPresenceSize = "rail" | "talk" | "dock" | "watch";

const SIZE: Record<PilotPresenceSize, string> = {
  rail: "h-11 w-11 rounded-full",
  talk: "h-10 w-10 rounded-full",
  dock: "h-[10rem] w-[7.15rem] rounded-2xl",
  watch: "h-[10.5rem] w-[7.5rem] rounded-2xl sm:h-[13.25rem] sm:w-[9.4rem]",
};

const BINS: Record<PilotPresenceSize, number> = {
  rail: 14,
  talk: 14,
  dock: 28,
  watch: 32,
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
  const compact = size === "rail" || size === "talk";
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
      {compact ? null : <span className="pilot-word">PILOT</span>}
      <span className="pilot-presence-rim" aria-hidden />
    </span>
  );
}
