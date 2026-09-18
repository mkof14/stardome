import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type HudVisorVariant = "overlay" | "window" | "rail" | "inset" | "chip";

const STROKE = "#F15A00";
const STROKE_DIM = "rgb(241 90 0 / 0.55)";
const STROKE_CYAN = "rgb(56 189 248 / 0.7)";

export function HudVisor({
  variant = "window",
  className,
}: {
  variant?: HudVisorVariant;
  className?: string;
}) {
  const box =
    variant === "rail"
      ? "0 0 64 1000"
      : variant === "chip"
        ? "0 0 32 32"
        : variant === "inset"
          ? "0 0 400 300"
          : "0 0 1000 620";

  return (
    <svg
      viewBox={box}
      preserveAspectRatio="none"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className,
      )}
      aria-hidden
    >
      {variant === "overlay" ? <OverlayPaths /> : null}
      {variant === "window" ? <WindowPaths /> : null}
      {variant === "rail" ? <RailPaths /> : null}
      {variant === "inset" ? <InsetPaths /> : null}
      {variant === "chip" ? <ChipPaths /> : null}
    </svg>
  );
}

function OverlayPaths() {
  return (
    <g fill="none" strokeLinecap="square" strokeLinejoin="miter">
      <path
        d="M46 28 H188 L214 8 H392 L418 28 H954 L992 66 V554 L954 592 H46 L8 554 V66 Z"
        stroke={STROKE}
        strokeWidth="2.2"
        vectorEffect="nonScalingStroke"
      />
      <path
        d="M70 52 H210 L228 38 H386 L404 52 H930 L962 84 V536 L930 568 H70 L38 536 V84 Z"
        stroke={STROKE_DIM}
        strokeWidth="1.2"
        vectorEffect="nonScalingStroke"
      />
      <path d="M70 52 h36 v36" stroke={STROKE} strokeWidth="2.4" vectorEffect="nonScalingStroke" />
      <path d="M930 52 h-36 v36" stroke={STROKE} strokeWidth="2.4" vectorEffect="nonScalingStroke" />
      <path d="M70 568 h36 v-36" stroke={STROKE} strokeWidth="2.4" vectorEffect="nonScalingStroke" />
      <path d="M930 568 h-36 v-36" stroke={STROKE} strokeWidth="2.4" vectorEffect="nonScalingStroke" />
      <path d="M118 52 h24 M118 60 h16 M118 44 h10" stroke={STROKE_DIM} strokeWidth="1.4" vectorEffect="nonScalingStroke" />
      <path d="M882 52 h-24 M882 60 h-16 M882 44 h-10" stroke={STROKE_DIM} strokeWidth="1.4" vectorEffect="nonScalingStroke" />
      <path d="M214 8 H392" stroke={STROKE} strokeWidth="1.6" vectorEffect="nonScalingStroke" />
      <path d="M500 52 v10 M512 52 v6 M488 52 v6" stroke={STROKE_CYAN} strokeWidth="1.3" vectorEffect="nonScalingStroke" />
      <path d="M38 200 h10 M38 212 h6 M38 420 h10 M38 432 h6" stroke={STROKE_DIM} strokeWidth="1.3" vectorEffect="nonScalingStroke" />
      <path d="M962 200 h-10 M962 212 h-6 M962 420 h-10 M962 432 h-6" stroke={STROKE_DIM} strokeWidth="1.3" vectorEffect="nonScalingStroke" />
      <circle cx="70" cy="52" r="2.2" fill={STROKE} stroke="none" />
      <circle cx="930" cy="52" r="2.2" fill={STROKE} stroke="none" />
      <circle cx="70" cy="568" r="2.2" fill={STROKE_CYAN} stroke="none" />
      <circle cx="930" cy="568" r="2.2" fill={STROKE_CYAN} stroke="none" />
    </g>
  );
}

function WindowPaths() {
  return (
    <g fill="none" strokeLinecap="square" strokeLinejoin="miter">
      <path
        d="M28 44 H170 L190 20 H360 L380 44 H972 L992 64 V556 L972 576 H28 L8 556 V64 Z"
        stroke={STROKE}
        strokeWidth="2"
        vectorEffect="nonScalingStroke"
      />
      <path
        d="M48 62 H186 L200 46 H350 L364 62 H952 L968 78 V542 L952 558 H48 L32 542 V78 Z"
        stroke={STROKE_DIM}
        strokeWidth="1.15"
        vectorEffect="nonScalingStroke"
      />
      <path d="M48 62 h30 v30" stroke={STROKE} strokeWidth="2.2" vectorEffect="nonScalingStroke" />
      <path d="M952 62 h-30 v30" stroke={STROKE} strokeWidth="2.2" vectorEffect="nonScalingStroke" />
      <path d="M48 558 h30 v-30" stroke={STROKE} strokeWidth="2.2" vectorEffect="nonScalingStroke" />
      <path d="M952 558 h-30 v-30" stroke={STROKE} strokeWidth="2.2" vectorEffect="nonScalingStroke" />
      <path d="M92 62 h18 M92 70 h12" stroke={STROKE_DIM} strokeWidth="1.3" vectorEffect="nonScalingStroke" />
      <path d="M908 62 h-18 M908 70 h-12" stroke={STROKE_DIM} strokeWidth="1.3" vectorEffect="nonScalingStroke" />
      <path d="M190 20 H360" stroke={STROKE} strokeWidth="1.5" vectorEffect="nonScalingStroke" />
      <path d="M500 62 v8 M510 62 v5 M490 62 v5" stroke={STROKE_CYAN} strokeWidth="1.2" vectorEffect="nonScalingStroke" />
      <path d="M32 200 h8 M32 420 h8 M968 200 h-8 M968 420 h-8" stroke={STROKE_DIM} strokeWidth="1.2" vectorEffect="nonScalingStroke" />
    </g>
  );
}

function RailPaths() {
  return (
    <g fill="none" strokeLinecap="square" strokeLinejoin="miter">
      <path
        d="M8 22 L22 8 H42 L56 22 V978 L42 992 H22 L8 978 Z"
        stroke={STROKE}
        strokeWidth="1.8"
        vectorEffect="nonScalingStroke"
      />
      <path
        d="M14 30 L24 18 H40 L50 30 V970 L40 982 H24 L14 970 Z"
        stroke={STROKE_DIM}
        strokeWidth="1.1"
        vectorEffect="nonScalingStroke"
      />
      <path d="M14 30 h12 v12" stroke={STROKE} strokeWidth="1.8" vectorEffect="nonScalingStroke" />
      <path d="M50 30 h-12 v12" stroke={STROKE} strokeWidth="1.8" vectorEffect="nonScalingStroke" />
      <path d="M14 970 h12 v-12" stroke={STROKE} strokeWidth="1.8" vectorEffect="nonScalingStroke" />
      <path d="M50 970 h-12 v-12" stroke={STROKE} strokeWidth="1.8" vectorEffect="nonScalingStroke" />
      <path d="M32 48 v10 M32 62 v6 M32 938 v-10 M32 924 v-6" stroke={STROKE_CYAN} strokeWidth="1.2" vectorEffect="nonScalingStroke" />
    </g>
  );
}

function InsetPaths() {
  return (
    <g fill="none" strokeLinecap="square" strokeLinejoin="miter">
      <path
        d="M14 28 L30 12 H370 L386 28 V272 L370 288 H30 L14 272 Z"
        stroke={STROKE}
        strokeWidth="1.8"
        vectorEffect="nonScalingStroke"
      />
      <path
        d="M24 36 L36 22 H364 L376 36 V264 L364 278 H36 L24 264 Z"
        stroke={STROKE_DIM}
        strokeWidth="1.05"
        vectorEffect="nonScalingStroke"
      />
      <path d="M24 36 h18 v18" stroke={STROKE} strokeWidth="1.8" vectorEffect="nonScalingStroke" />
      <path d="M376 36 h-18 v18" stroke={STROKE} strokeWidth="1.8" vectorEffect="nonScalingStroke" />
      <path d="M24 264 h18 v-18" stroke={STROKE} strokeWidth="1.8" vectorEffect="nonScalingStroke" />
      <path d="M376 264 h-18 v-18" stroke={STROKE} strokeWidth="1.8" vectorEffect="nonScalingStroke" />
      <path d="M200 36 v7 M208 36 v4 M192 36 v4" stroke={STROKE_CYAN} strokeWidth="1.1" vectorEffect="nonScalingStroke" />
    </g>
  );
}

function ChipPaths() {
  return (
    <g fill="none" strokeLinecap="square" strokeLinejoin="miter">
      <path
        d="M5 9 L9 5 H23 L27 9 V23 L23 27 H9 L5 23 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        vectorEffect="nonScalingStroke"
      />
      <path
        d="M8 11 L11 8 H21 L24 11 V21 L21 24 H11 L8 21 Z"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="1"
        vectorEffect="nonScalingStroke"
      />
    </g>
  );
}

export function HudFrame({
  children,
  variant = "window",
  className,
  status,
  testId,
}: {
  children: ReactNode;
  variant?: HudVisorVariant;
  className?: string;
  status?: string;
  testId?: string;
}) {
  return (
    <div
      data-testid={testId}
      className={cn(
        "relative",
        variant === "overlay" && "hud-visor-clip-overlay",
        variant === "window" && "hud-visor-clip-window",
        variant === "rail" && "hud-visor-clip-rail",
        variant === "inset" && "hud-visor-clip-inset",
        className,
      )}
    >
      <HudVisor variant={variant} />
      <div className="relative z-[1] min-h-0 flex-1">{children}</div>
      {status ? (
        <p className="hud-bezel-status pointer-events-none absolute bottom-3 end-5 z-[1] font-mono text-[9px] tracking-[0.2em] text-orange">
          [ {status} ]
        </p>
      ) : null}
    </div>
  );
}
