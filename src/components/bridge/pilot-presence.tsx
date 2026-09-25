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

function PilotAssistant({
  mood,
  level,
  compact,
}: {
  mood: PilotMood;
  level: number;
  compact: boolean;
}) {
  const raw = useId().replaceAll(":", "");
  const glass = `pilot-glass-${raw}`;
  const visor = `pilot-visor-${raw}`;
  const glow = `pilot-glow-${raw}`;
  const keel = `pilot-keel-${raw}`;
  const drive = 0.22 + level * 0.78;
  const gaze = mood === "listen" ? 1.35 : mood === "urgent" ? 0.85 : 1;

  if (compact) {
    return (
      <svg viewBox="0 0 64 64" className="pilot-mark" aria-hidden>
        <defs>
          <radialGradient id={glow} cx="50%" cy="38%" r="62%">
            <stop offset="0%" stopColor="rgb(56 189 248 / 0.42)" />
            <stop offset="100%" stopColor="rgb(56 189 248 / 0)" />
          </radialGradient>
          <linearGradient id={visor} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#8BE7FF" />
            <stop offset="45%" stopColor="#1B6F8A" />
            <stop offset="100%" stopColor="#0B1C2A" />
          </linearGradient>
          <linearGradient id={glass} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="rgb(230 244 255 / 0.55)" />
            <stop offset="100%" stopColor="rgb(56 189 248 / 0.08)" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="28" fill={`url(#${glow})`} />
        <circle
          className="pilot-orbit"
          cx="32"
          cy="32"
          r="23.5"
          fill="none"
          stroke="rgb(56 189 248 / 0.35)"
          strokeWidth="0.8"
          strokeDasharray="3 5"
        />
        <g className="pilot-fig">
          <path
            d="M20 18.5 C20 13 26 9 32 9 C38 9 44 13 44 18.5 L44 36 C44 44 38 49 32 49 C26 49 20 44 20 36 Z"
            fill={`url(#${visor})`}
          />
          <path
            d="M22 19 C23 14.5 27.5 12 32 12 C36.5 12 41 14.5 42 19 L40.5 20 C39.5 16.5 36 15 32 15 C28 15 24.5 16.5 23.5 20 Z"
            fill={`url(#${glass})`}
          />
          <g className="pilot-gaze">
            <rect x="24.2" y="27.2" width="6.4" height={2.1 * gaze} rx="1" fill="#E7FBFF" />
            <rect x="33.4" y="27.2" width="6.4" height={2.1 * gaze} rx="1" fill="#E7FBFF" />
          </g>
          <rect
            className="pilot-voice"
            x={32 - 7.2 * drive}
            y="35.6"
            width={14.4 * drive}
            height="2.2"
            rx="1.1"
            fill="#7EE8FF"
            opacity={0.45 + level * 0.55}
          />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 148" className="pilot-mark" aria-hidden>
      <defs>
        <radialGradient id={glow} cx="50%" cy="22%" r="58%">
          <stop offset="0%" stopColor="rgb(56 189 248 / 0.28)" />
          <stop offset="100%" stopColor="rgb(56 189 248 / 0)" />
        </radialGradient>
        <linearGradient id={visor} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#B9F3FF" />
          <stop offset="38%" stopColor="#2A88A8" />
          <stop offset="100%" stopColor="#0A1826" />
        </linearGradient>
        <linearGradient id={glass} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#3A5574" />
          <stop offset="55%" stopColor="#152436" />
          <stop offset="100%" stopColor="#0A121C" />
        </linearGradient>
        <linearGradient id={keel} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#E8F7FF" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="36" rx="36" ry="40" fill={`url(#${glow})`} />
      <circle
        className="pilot-orbit"
        cx="50"
        cy="34"
        r="28"
        fill="none"
        stroke="rgb(56 189 248 / 0.28)"
        strokeWidth="0.7"
        strokeDasharray="4 6"
      />
      <g className="pilot-fig">
        <g className="pilot-torso">
          <path
            d="M24 72 C18 86 17 118 22 142 H78 C83 118 82 86 76 72 C68 66 32 66 24 72 Z"
            fill={`url(#${glass})`}
          />
          <path
            d="M36 70 L50 98 L64 70 Z"
            fill={`url(#${keel})`}
            opacity="0.22"
          />
          <path d="M42 70 L50 88 L58 70" fill="none" stroke="#C9A24A" strokeWidth="1.1" />
          <path d="M26 118 H39" stroke="#C9A24A" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M26 123 H37" stroke="#C9A24A" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M74 118 H61" stroke="#C9A24A" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M74 123 H63" stroke="#C9A24A" strokeWidth="1.2" strokeLinecap="round" />
          <g className="pilot-bars" transform="translate(50 108)">
            {[0, 1, 2, 3, 4].map((i) => {
              const mid = 1 - Math.abs(i - 2) / 2.6;
              const h = 3.2 + mid * 7.5 * (0.35 + level * 0.65);
              return (
                <rect
                  key={i}
                  className="pilot-bar"
                  x={-11 + i * 4.4}
                  y={-h}
                  width="2.6"
                  height={h}
                  rx="1.2"
                  fill="#7EE8FF"
                  opacity={0.35 + mid * 0.5}
                />
              );
            })}
          </g>
          <text
            x="50"
            y="132"
            textAnchor="middle"
            fill="#E6E4DF"
            fontSize="7.2"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            fontWeight="700"
            letterSpacing="1.6"
          >
            PILOT
          </text>
        </g>
        <g className="pilot-arm">
          <path
            d="M76 78 C88 90 90 108 84 122"
            fill="none"
            stroke="#2A4A68"
            strokeWidth="6.5"
            strokeLinecap="round"
          />
          <path
            d="M76 78 C88 90 90 108 84 122"
            fill="none"
            stroke="#7EE8FF"
            strokeWidth="1.15"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M80 118 L90 126 L80 128 Z"
            fill="#C9EFFF"
            opacity="0.9"
          />
        </g>
        <g className="pilot-visor">
          <path
            d="M33 16 C33 10 40 6 50 6 C60 6 67 10 67 16 L67 40 C67 50 60 56 50 56 C40 56 33 50 33 40 Z"
            fill={`url(#${visor})`}
          />
          <path
            d="M36 17 C37 12 43 10 50 10 C57 10 63 12 64 17 L62 18.5 C61 14.8 56 13.4 50 13.4 C44 13.4 39 14.8 38 18.5 Z"
            fill="rgb(232 247 255 / 0.42)"
          />
          <g className="pilot-gaze">
            <rect x="38.6" y="28" width="8.2" height={2.4 * gaze} rx="1.1" fill="#F4FDFF" />
            <rect x="53.2" y="28" width="8.2" height={2.4 * gaze} rx="1.1" fill="#F4FDFF" />
          </g>
          <rect
            className="pilot-voice"
            x={50 - 9.5 * drive}
            y="39.2"
            width={19 * drive}
            height="2.4"
            rx="1.2"
            fill="#7EE8FF"
            opacity={0.4 + level * 0.6}
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
  const compact = size === "rail" || size === "talk";
  return (
    <span
      data-testid="pilot-presence"
      data-mood={mood}
      data-size={size}
      data-anim="assistant"
      data-speaking={speaking ? "true" : "false"}
      data-listening={listening ? "true" : "false"}
      className={cn("pilot-presence relative inline-flex shrink-0 overflow-hidden", SIZE[size], className)}
      style={{ "--pilot-level": String(drive) } as CSSProperties}
    >
      <span className="pilot-presence-well" aria-hidden />
      <PilotAssistant mood={mood} level={drive} compact={compact} />
      <span className="pilot-presence-scan" aria-hidden />
      <span className="pilot-presence-rim" aria-hidden />
    </span>
  );
}
