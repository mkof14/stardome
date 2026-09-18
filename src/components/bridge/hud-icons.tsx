import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

const HEX = "16,2.4 28.2,9.2 28.2,22.8 16,29.6 3.8,22.8 3.8,9.2";

export function PilotHex({
  className,
  glow,
}: {
  className?: string;
  glow?: boolean;
}) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-6 w-6", className)} aria-hidden>
      <polygon
        points={HEX}
        fill="var(--bridge-bg)"
        stroke="#F15A00"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <polygon
        points="16,9 22.4,21.2 9.6,21.2"
        fill="none"
        stroke="#38BDF8"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      {glow ? <circle cx="16" cy="16.8" r="1.7" fill="#F15A00" /> : null}
    </svg>
  );
}

export function HexFrame({
  children,
  className,
  active,
}: {
  children: ReactNode;
  className?: string;
  active?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex h-8 w-8 items-center justify-center",
        className,
      )}
    >
      <svg viewBox="0 0 32 32" className="absolute inset-0 h-full w-full" aria-hidden>
        <polygon
          points={HEX}
          fill={active ? "rgb(241 90 0 / 0.12)" : "var(--bridge-bg)"}
          stroke={active ? "#F15A00" : "currentColor"}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <span className="relative z-[1] flex items-center justify-center">
        {children}
      </span>
    </span>
  );
}

export function HudGlyph({
  name,
  className,
}: {
  name:
    | "talk"
    | "instruments"
    | "advice"
    | "comms"
    | "picture"
    | "risk"
    | "systems"
    | "action"
    | "library"
    | "crisis"
    | "log"
    | "demo"
    | "captain"
    | "person"
    | "support"
    | "drive"
    | "learn"
    | "map"
    | "mic"
    | "close"
    | "minus"
    | "wave";
  className?: string;
}) {
  const d: Record<typeof name, string> = {
    talk: "M6 7.2h12.4v8.2H11L8.2 18V15.4H6V7.2Zm14.2 2.2H26v7.2h-2.2V19l-2.6-2.6h0V9.4Z",
    instruments:
      "M16 4.2A11.8 11.8 0 1 0 27.8 16 11.8 11.8 0 0 0 16 4.2Zm0 2.4A9.4 9.4 0 1 1 6.6 16 9.4 9.4 0 0 1 16 6.6Zm.8 3.2v6.2l4.4 2.6-.9 1.5L15.2 17V9.8Z",
    advice:
      "M16 4.4 6.2 8v7.4c0 6 4 10 9.8 12.2 5.8-2.2 9.8-6.2 9.8-12.2V8L16 4.4Zm0 2.6 7.4 2.7v6.1c0 4.4-2.8 7.6-7.4 9.5-4.6-1.9-7.4-5.1-7.4-9.5V9.7L16 7Z",
    comms:
      "M16 5.2A8.8 8.8 0 0 0 7.2 14v3.4H10V14a6 6 0 1 1 12 0v3.4h2.8V14A8.8 8.8 0 0 0 16 5.2ZM8.4 19.2h2.8V26H8.4v-6.8Zm12.4 0H23.6V26h-2.8v-6.8Z",
    picture:
      "M16 4.4A11.6 11.6 0 1 0 27.6 16 11.6 11.6 0 0 0 16 4.4Zm0 2.4A9.2 9.2 0 1 1 6.8 16 9.2 9.2 0 0 1 16 6.8ZM16 10A6 6 0 1 0 22 16 6 6 0 0 0 16 10Zm1 6.4 3.6 2.1-1 1.7-4.2-2.4V11.4h1.6Z",
    risk: "M16 4.2 6.4 7.6v7.2c0 5.8 3.8 9.6 9.6 11.6 5.8-2 9.6-5.8 9.6-11.6V7.6L16 4.2Zm0 2.8 7.2 2.6v6.2c0 4.2-2.6 7.2-7.2 9-4.6-1.8-7.2-4.8-7.2-9V9.6L16 7Z",
    systems:
      "M14.8 4h2.4v5.2h-2.4V4ZM7.6 7.2l1.6 1.6 3.4-3.4-1.6-1.6-3.4 3.4Zm16.8 0 3.4-3.4-1.6-1.6-3.4 3.4 1.6 1.6ZM5.6 14.8v2.4h5.2v-2.4H5.6Zm15.6 0v2.4h5.2v-2.4h-5.2ZM16 12.4A3.6 3.6 0 1 0 19.6 16 3.6 3.6 0 0 0 16 12.4ZM8.8 22.4 6.8 27h2.6l1.1-2.6h10.2L21.8 27H24.4l-2-4.6H8.8Z",
    action:
      "M16 4.4A7.4 7.4 0 0 0 8.6 11.6c0 3.2 1.8 5.3 3.5 6.9V22h8v-3.5c1.7-1.6 3.5-3.7 3.5-6.9A7.4 7.4 0 0 0 16 4.4ZM13.6 24.2h4.8V26.6h-4.8V24.2Z",
    library: "M5.6 6.2h20.8v3.4H5.6V6.2Zm2 5h16.8v3.4H7.6v-3.4Zm2 5h12.8v3.4H9.6V16.2Zm2 5h8.8v3.6h-8.8V21.2Z",
    crisis:
      "M16 4.4 5.2 24.8h21.6L16 4.4Zm0 5.4.3 8.2h-0.6L16 9.8Zm0 10.4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z",
    log: "M16 4.4A11.6 11.6 0 1 0 27.6 16 11.6 11.6 0 0 0 16 4.4Zm0 2.4A9.2 9.2 0 1 1 6.8 16 9.2 9.2 0 0 1 16 6.8Zm-1.2 2.8h2.4v5.6l4 4-1.6 1.6-4.8-4.8V9.6Z",
    demo: "M16 4.4 26.4 10v12L16 27.6 5.6 22V10L16 4.4Zm0 2.8L8 11.2v9.6L16 25.2l8-4.4v-9.6L16 7.2Zm-1.6 4 6.8 4.4-6.8 4.4V11.2Z",
    captain:
      "M16 4.4 7.2 8 16 11.6 24.8 8 16 4.4ZM9.4 13.2 16 16l6.6-2.8v5.2A7 7 0 0 1 16 24.8 7 7 0 0 1 9.4 18.4v-5.2Z",
    person:
      "M16 5.2A4 4 0 1 1 12 9.2 4 4 0 0 1 16 5.2ZM7.6 25.2V23A8 8 0 0 1 16 15.2 8 8 0 0 1 24.4 23v2.2H7.6Z",
    support:
      "M16 5A3.6 3.6 0 1 1 12.4 8.6 3.6 3.6 0 0 1 16 5ZM6.4 16.2h3.6V22H6.4v-5.8Zm15.6 0H25.6V22h-3.6v-5.8ZM9.2 24.8A7 7 0 0 1 16 19.8a7 7 0 0 1 6.8 5H9.2Z",
    drive:
      "M5.6 8.4h20.8v15.2H5.6V8.4Zm2.4 2.4v10.4h16V10.8h-16Zm12.4 5.6a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8Z",
    learn:
      "M6 8.2 16 5.4 26 8.2v3.2L16 8.6 6 11.4V8.2Zm0 5.2 10-2.8 10 2.8V24l-10 2.6L6 24V13.4Z",
    map: "M7.2 6.4 14 8.6 24.8 6.4v19.2L14 23.4 7.2 25.6V6.4Zm2.2 2.6v13.4l3.4-1.2V8.8L9.4 9Zm8.4-.2v13.8l5.6 1.2V8.6l-5.6.2Z",
    mic: "M16 5.2A3.4 3.4 0 0 0 12.6 8.6v4.8a3.4 3.4 0 1 0 6.8 0V8.6A3.4 3.4 0 0 0 16 5.2Zm-6.4 8.4a1.1 1.1 0 0 0-2.2 0 8.4 8.4 0 0 0 7.3 8.2v2.4h-3a1.1 1.1 0 1 0 0 2.2h6.2a1.1 1.1 0 1 0 0-2.2h-3v-2.4A8.4 8.4 0 0 0 24.6 13.6a1.1 1.1 0 0 0-2.2 0 6.2 6.2 0 0 1-12.4 0Z",
    close: "M8.4 8.4 16 16l7.6-7.6 1.6 1.6L17.6 17.6l7.6 7.6-1.6 1.6L16 19.2l-7.6 7.6-1.6-1.6 7.6-7.6-7.6-7.6Z",
    minus: "M8 15.2h16v2.2H8V15.2Z",
    wave: "M4.8 16h2.4l2-7.2 3 14.4 3.2-18 3.4 16.4 2.8-10.4 2.2 5.2H27.2v2H21.4l-1.4-3.2-3.2 12-3.2-15.2-3 14.4-2.2-10.4L6.4 18H4.8V16Z",
  };
  return (
    <svg viewBox="0 0 32 32" className={cn("h-4 w-4", className)} aria-hidden>
      <path fill="currentColor" d={d[name]} />
    </svg>
  );
}
