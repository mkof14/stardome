import { cn } from "@/lib/cn";
import type { ReactNode } from "react";
import { PilotHex } from "@/components/bridge/hud-icons";

type HudPanelProps = {
  title: string;
  extra?: ReactNode;
  children: ReactNode;
  className?: string;
  testId?: string;
  id?: string;
};

export function HudPanel({
  title,
  extra,
  children,
  className,
  testId,
  id,
}: HudPanelProps) {
  return (
    <section
      id={id}
      data-testid={testId}
      className={cn(
        "hud-panel-bezel relative border border-bridge-line bg-bridge-panel p-4",
        className,
      )}
    >
      <span className="hud-panel-tick left-0 top-0 border-b-0 border-r-0" />
      <span className="hud-panel-tick right-0 top-0 border-b-0 border-l-0" />
      <span className="hud-panel-tick bottom-0 left-0 border-r-0 border-t-0" />
      <span className="hud-panel-tick bottom-0 right-0 border-l-0 border-t-0" />
      <span className="pointer-events-none absolute left-5 top-0 h-px w-8 bg-orange/70" />
      <span className="pointer-events-none absolute right-5 top-0 h-px w-8 bg-orange/70" />
      <span className="pointer-events-none absolute bottom-0 left-5 h-px w-8 bg-orange/70" />
      <span className="pointer-events-none absolute bottom-0 right-5 h-px w-8 bg-orange/70" />
      <header className="mb-3 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-ui text-sm font-semibold tracking-wide text-bridge-text">
          <PilotHex className="h-5 w-5" />
          {title}
        </h2>
        {extra ? <div className="shrink-0">{extra}</div> : null}
      </header>
      {children}
    </section>
  );
}
