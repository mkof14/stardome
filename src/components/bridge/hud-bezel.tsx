import { cn } from "@/lib/cn";
import type { ReactNode } from "react";
import { HudGlyph } from "@/components/bridge/hud-icons";

export function HudBezel({
  children,
  className,
  status,
  onClose,
  closeLabel,
  closeTestId,
  testId,
}: {
  children: ReactNode;
  className?: string;
  status?: string;
  onClose?: () => void;
  closeLabel?: string;
  closeTestId?: string;
  testId?: string;
}) {
  return (
    <div data-testid={testId} className={cn("hud-bezel relative", className)}>
      <div className="hud-bezel-glow pointer-events-none" aria-hidden />
      <svg
        viewBox="0 0 1000 620"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      >
        <path
          className="hud-bezel-stroke"
          fill="none"
          stroke="#F15A00"
          strokeWidth="2.2"
          d="M46 28 H188 L214 8 H392 L418 28 H954 L992 66 V554 L954 592 H46 L8 554 V66 Z"
        />
        <path
          className="hud-bezel-stroke"
          fill="none"
          stroke="rgb(241 90 0 / 0.55)"
          strokeWidth="1.2"
          d="M70 52 H210 L228 38 H386 L404 52 H930 L962 84 V536 L930 568 H70 L38 536 V84 Z"
        />
        <path fill="none" stroke="#F15A00" strokeWidth="2.4" d="M70 52 h34 v34" />
        <path fill="none" stroke="#F15A00" strokeWidth="2.4" d="M930 52 h-34 v34" />
        <path fill="none" stroke="#F15A00" strokeWidth="2.4" d="M70 568 h34 v-34" />
        <path fill="none" stroke="#F15A00" strokeWidth="2.4" d="M930 568 h-34 v-34" />
        <path fill="none" stroke="rgb(241 90 0 / 0.7)" strokeWidth="1.4" d="M118 52 h22 M118 60 h14" />
        <path fill="none" stroke="rgb(241 90 0 / 0.7)" strokeWidth="1.4" d="M882 52 h-22 M882 60 h-14" />
        <path fill="none" stroke="rgb(241 90 0 / 0.55)" strokeWidth="1.3" d="M214 8 H392" />
      </svg>
      {onClose ? (
        <button
          type="button"
          data-testid={closeTestId ?? "hud-bezel-close"}
          onClick={onClose}
          aria-label={closeLabel ?? "Close"}
          className="absolute end-5 top-4 z-10 flex h-8 w-8 items-center justify-center text-orange hover:bg-orange/10"
        >
          <HudGlyph name="close" className="h-4 w-4" />
        </button>
      ) : null}
      <div className="relative z-[1] min-h-0 flex-1 p-5 pt-8 sm:p-7 sm:pt-10">{children}</div>
      {status ? (
        <p className="hud-bezel-status pointer-events-none absolute bottom-4 end-7 z-[1] font-mono text-[10px] tracking-[0.22em] text-orange">
          [ {status} ]
        </p>
      ) : null}
    </div>
  );
}
