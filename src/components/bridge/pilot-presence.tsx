"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import {
  PILOT_MOODS,
  PILOT_PLATES,
  type PilotMood,
} from "@/lib/pilot-presence";

export type PilotPresenceSize = "rail" | "talk" | "dock" | "watch";

const SIZE: Record<PilotPresenceSize, string> = {
  rail: "h-11 w-11 rounded-full",
  talk: "h-10 w-10 rounded-full",
  dock: "h-[10rem] w-[7.15rem] rounded-2xl",
  watch: "h-[10.5rem] w-[7.5rem] rounded-2xl sm:h-[13.25rem] sm:w-[9.4rem]",
};

export function PilotPresence({
  mood,
  size,
  level = 0,
  speaking,
  listening,
  className,
}: {
  mood: PilotMood;
  size: PilotPresenceSize;
  level?: number;
  speaking?: boolean;
  listening?: boolean;
  className?: string;
}) {
  const drive = Math.max(0, Math.min(1, level));
  return (
    <span
      data-testid="pilot-presence"
      data-mood={mood}
      data-size={size}
      data-speaking={speaking ? "true" : "false"}
      data-listening={listening ? "true" : "false"}
      className={cn("pilot-presence relative inline-flex shrink-0 overflow-hidden", SIZE[size], className)}
      style={{ "--pilot-level": String(drive) } as CSSProperties}
    >
      <span className="pilot-presence-well" aria-hidden />
      {PILOT_MOODS.map((key) => (
        // Stacked plates cross-fade; next/image fights the opacity stack.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={key}
          src={PILOT_PLATES[key]}
          alt=""
          draggable={false}
          className={cn("pilot-presence-plate", key === mood && "is-live")}
        />
      ))}
      <span className="pilot-presence-scan" aria-hidden />
      <span className="pilot-presence-blink" aria-hidden />
      <span className="pilot-presence-rim" aria-hidden />
    </span>
  );
}
