"use client";

import { cn } from "@/lib/cn";
import { useAgronView, type AgronView } from "@/lib/agron-view";
import { useHud } from "@/lib/i18n/use-hud";
import { plantCopy } from "@/lib/i18n/plant-copy";

export function ViewSwitcher() {
  const { view, setView } = useAgronView();
  const { locale } = useHud();
  const copy = plantCopy(locale);

  return (
    <div
      role="group"
      aria-label={copy.viewGroup}
      data-testid="agron-view-switcher"
      className="mt-3 inline-flex border border-bridge-text/40 font-mono text-[11px] font-semibold tracking-wider"
    >
      {(["watch", "plant"] as const).map((value: AgronView) => {
        const active = view === value;
        return (
          <button
            key={value}
            type="button"
            data-testid={`agron-view-${value}`}
            aria-pressed={active}
            onClick={() => setView(value)}
            className={cn(
              "px-3 py-1.5",
              active && value === "watch" && "bg-[color:var(--watch-accent)] text-white",
              active && value === "plant" && "bg-[color:var(--plant-accent)] text-white",
              !active && "text-bridge-dim hover:text-bridge-text",
            )}
          >
            {value === "watch" ? copy.watch : copy.plant}
          </button>
        );
      })}
    </div>
  );
}
