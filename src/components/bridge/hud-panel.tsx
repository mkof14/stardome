import { cn } from "@/lib/cn";
import type { ReactNode } from "react";
import { HudGlyph, IconWell, type HudGlyphName } from "@/components/bridge/hud-icons";

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
}: HudPanelProps) {
  return (
    <section
      id={id}
      data-testid={testId}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-bridge-line bg-bridge-panel px-5 py-5 shadow-[0_10px_28px_rgb(15_25_34/0.08)]",
        className,
      )}
    >
      <header className="relative z-[1] mb-3 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-body text-lg font-semibold tracking-tight text-bridge-text">
          {glyph ? (
            <IconWell className="h-8 w-8 shrink-0 text-[color:var(--hud-accent,#F15A00)]">
              <HudGlyph name={glyph} className="h-4 w-4" />
            </IconWell>
          ) : null}
          {title}
        </h2>
        {extra ? <div className="relative z-[1] shrink-0">{extra}</div> : null}
      </header>
      <div className="relative z-[1]">{children}</div>
      {status ? (
        <p className="mt-3 text-end font-body text-[11px] text-bridge-dim">{status}</p>
      ) : null}
    </section>
  );
}
