"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import type { PilotMood } from "@/lib/pilot-presence";

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
  const compact = size === "rail" || size === "talk";
  return (
    <span
      data-testid="pilot-presence"
      data-mood={mood}
      data-size={size}
      data-anim="assistant"
      data-name="Pilot"
      data-speaking={speaking ? "true" : "false"}
      data-listening={listening ? "true" : "false"}
      aria-label="Pilot"
      className={cn("pilot-presence relative inline-flex shrink-0 overflow-hidden", SIZE[size], className)}
      style={{ "--pilot-level": String(drive) } as CSSProperties}
    >
      <span className="pilot-presence-well" aria-hidden />
      <span className="pilot-stage" aria-hidden>
        <span className="pilot-halo" />
        <span className="pilot-ticks" />
        <span className="pilot-ring pilot-ring-a" />
        <span className="pilot-ring pilot-ring-b" />
        <span className="pilot-sweep" />
        <span className="pilot-core">
          <span className="pilot-hex" />
          <span className="pilot-nucleus" />
        </span>
      </span>
      {compact ? null : (
        <span className="pilot-plate" aria-hidden>
          <span className="pilot-word">PILOT</span>
          <span className="pilot-meters">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="pilot-bar" />
            ))}
          </span>
        </span>
      )}
      <span className="pilot-presence-scan" aria-hidden />
      <span className="pilot-presence-rim" aria-hidden />
    </span>
  );
}
