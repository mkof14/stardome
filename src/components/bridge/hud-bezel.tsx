import { cn } from "@/lib/cn";
import type { ReactNode } from "react";
import { ChamferFrame, HudGlyph } from "@/components/bridge/hud-icons";
import { HudVisor } from "@/components/bridge/hud-visor";

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
    <div
      data-testid={testId}
      className={cn("hud-bezel relative", className)}
    >
      <div className="hud-bezel-glow pointer-events-none" aria-hidden />
      <HudVisor variant="overlay" />
      {onClose ? (
        <button
          type="button"
          data-testid={closeTestId ?? "hud-bezel-close"}
          onClick={onClose}
          aria-label={closeLabel ?? "Close"}
          className="absolute end-5 top-4 z-10 text-orange hover:text-cyan-300"
        >
          <ChamferFrame className="h-8 w-8 text-orange">
            <HudGlyph name="close" className="h-3.5 w-3.5" />
          </ChamferFrame>
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
