"use client";

import { useId, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import type { PilotMood } from "@/lib/pilot-presence";

export type PilotPresenceSize = "rail" | "talk" | "dock" | "watch";

const SIZE: Record<PilotPresenceSize, string> = {
  rail: "h-11 w-11 rounded-full",
  talk: "h-10 w-10 rounded-full",
  dock: "h-[10rem] w-[7.15rem] rounded-2xl",
  watch: "h-[10.5rem] w-[7.5rem] rounded-2xl sm:h-[13.25rem] sm:w-[9.4rem]",
};

function PilotMark({
  mood,
  level,
}: {
  mood: PilotMood;
  level: number;
}) {
  const raw = useId().replaceAll(":", "");
  const coat = `pilot-coat-${raw}`;
  const face = `pilot-face-${raw}`;
  const hair = `pilot-hair-${raw}`;
  const glow = `pilot-glow-${raw}`;
  const mouth = 1.1 + level * 3.4;
  return (
    <svg viewBox="0 0 100 140" className="pilot-mark" aria-hidden>
      <defs>
        <linearGradient id={coat} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#243656" />
          <stop offset="55%" stopColor="#152238" />
          <stop offset="100%" stopColor="#0B1424" />
        </linearGradient>
        <linearGradient id={face} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#E4D2B8" />
          <stop offset="100%" stopColor="#C4A888" />
        </linearGradient>
        <linearGradient id={hair} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#2A3340" />
          <stop offset="100%" stopColor="#151A22" />
        </linearGradient>
        <radialGradient id={glow} cx="50%" cy="28%" r="58%">
          <stop offset="0%" stopColor="rgb(56 189 248 / 0.22)" />
          <stop offset="100%" stopColor="rgb(56 189 248 / 0)" />
        </radialGradient>
      </defs>
      <ellipse className="pilot-mark-glow" cx="50" cy="40" rx="34" ry="38" fill={`url(#${glow})`} />
      <g className="pilot-fig">
        <g className="pilot-torso">
          <path
            d="M22 68 C20 86 18 112 21 136 L79 136 C82 112 80 86 78 68 C70 62 30 62 22 68 Z"
            fill={`url(#${coat})`}
          />
          <path d="M42 66 L50 92 L58 66 Z" fill="#E8EEF4" opacity="0.92" />
          <path d="M24 118 H40" stroke="#C9A24A" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M24 123 H38" stroke="#C9A24A" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M76 118 H60" stroke="#C9A24A" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M76 123 H62" stroke="#C9A24A" strokeWidth="1.4" strokeLinecap="round" />
        </g>
        <g className="pilot-arm">
          <path
            d="M78 74 C90 86 92 104 86 118"
            fill="none"
            stroke="#1B2B44"
            strokeWidth="11"
            strokeLinecap="round"
          />
          <path
            d="M78 74 C90 86 92 104 86 118"
            fill="none"
            stroke="#C9A24A"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.7"
          />
          <ellipse className="pilot-hand" cx="85" cy="122" rx="6.2" ry="5.2" fill="#D4B896" />
        </g>
        <path d="M44 58 C46 64 54 64 56 58" fill="#C4A888" />
        <g className="pilot-head">
          <ellipse cx="50" cy="28" rx="17.5" ry="8" fill={`url(#${hair})`} />
          <ellipse cx="50" cy="38" rx="16" ry="18" fill={`url(#${face})`} />
          <path d="M34 34 C36 20 64 20 66 34 C62 26 38 26 34 34 Z" fill={`url(#${hair})`} />
          <g className="pilot-eyes">
            <ellipse cx="43.5" cy="38" rx="2.1" ry="2.4" fill="#1A2430" />
            <ellipse cx="56.5" cy="38" rx="2.1" ry="2.4" fill="#1A2430" />
            <ellipse cx="43.2" cy="37.4" rx="0.55" ry="0.55" fill="#F4F7FA" />
            <ellipse cx="56.2" cy="37.4" rx="0.55" ry="0.55" fill="#F4F7FA" />
            <rect className="pilot-lids" x="40.4" y="34.6" width="20" height="5.8" fill={`url(#${face})`} />
          </g>
          <path d="M50 40 V45.2" stroke="#A88868" strokeWidth="1.1" strokeLinecap="round" />
          <ellipse
            className="pilot-mouth"
            cx="50"
            cy="49.4"
            rx={mood === "ease" ? 3.4 : 3.1}
            ry={mouth}
            fill="#7A4A42"
          />
        </g>
      </g>
    </svg>
  );
}

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
      data-anim="figure"
      data-speaking={speaking ? "true" : "false"}
      data-listening={listening ? "true" : "false"}
      className={cn("pilot-presence relative inline-flex shrink-0 overflow-hidden", SIZE[size], className)}
      style={{ "--pilot-level": String(drive) } as CSSProperties}
    >
      <span className="pilot-presence-well" aria-hidden />
      <PilotMark mood={mood} level={drive} />
      <span className="pilot-presence-scan" aria-hidden />
      <span className="pilot-presence-rim" aria-hidden />
    </span>
  );
}
