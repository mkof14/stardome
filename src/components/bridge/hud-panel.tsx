import { cn } from "@/lib/cn";
import type { ReactNode } from "react";
import { HexFrame, HudGlyph, type HudGlyphName, PilotHex } from "@/components/bridge/hud-icons";
import { HudVisor } from "@/components/bridge/hud-visor";

type HudPanelProps = {
  title: string;
  extra?: ReactNode;
  children: ReactNode;
  className?: string;
  testId?: string;
  id?: string;
  glyph?: HudGlyphName;
  status?: string;
  visor?: "window" | "overlay";
};

export function HudPanel({
  title,
  extra,
  children,
  className,
  testId,
  id,
  glyph,
  status,
  visor = "window",
}: HudPanelProps) {
  return (
    <section
      id={id}
      data-testid={testId}
      className={cn(
        "hud-panel-bezel relative bg-bridge-panel px-5 py-5 pt-7",
        visor === "overlay" && "hud-visor-clip-overlay",
        className,
      )}
    >
      <HudVisor variant={visor} />
      <header className="relative z-[1] mb-3 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-ui text-sm font-semibold tracking-wide text-bridge-text">
          {glyph ? (
            <HexFrame className="h-7 w-7 shrink-0 text-orange">
              <HudGlyph name={glyph} className="h-3.5 w-3.5" />
            </HexFrame>
          ) : (
            <PilotHex className="h-6 w-6 shrink-0" />
          )}
          {title}
        </h2>
        {extra ? <div className="relative z-[1] shrink-0">{extra}</div> : null}
      </header>
      <div className="relative z-[1]">{children}</div>
      {status ? (
        <p className="hud-bezel-status pointer-events-none absolute bottom-2 end-4 z-[1] font-mono text-[9px] tracking-[0.18em] text-orange">
          [ {status} ]
        </p>
      ) : null}
    </section>
  );
}
