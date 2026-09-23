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
      className="mt-3 inline-flex border border-bridge-text/40 font-mono text-[10px] font-semibold tracking-wider"
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
              "px-2.5 py-1.5",
              active ? "bg-orange text-white" : "text-bridge-dim hover:text-bridge-text",
            )}
          >
            {value === "watch" ? copy.watch : copy.plant}
          </button>
        );
      })}
    </div>
  );
}
