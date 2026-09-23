"use client";

import { cn } from "@/lib/cn";
import { useAgronView } from "@/lib/agron-view";
import { useHud } from "@/lib/i18n/use-hud";
import { HudGlyph } from "@/components/bridge/hud-icons";

export function CompressScreenButton() {
  const { hud } = useHud();
  const { density, toggleDensity } = useAgronView();
  const compact = density === "compact";
  const label = compact ? hud.chrome.expandScreen : hud.chrome.compressScreen;
  const tip = compact ? hud.chrome.expandScreenTip : hud.chrome.compressScreenTip;

  return (
    <button
      type="button"
      data-testid="compress-screen"
      data-mode={compact ? "expand" : "compress"}
      onClick={toggleDensity}
      aria-pressed={compact}
      aria-label={label}
      title={tip}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-xl border px-2.5 font-body text-sm",
        compact
          ? "border-[color:var(--watch-accent)] bg-[color:var(--watch-accent)] text-white"
          : "border-bridge-text/40 text-bridge-text hover:border-[color:var(--watch-accent)] hover:text-[color:var(--watch-accent)]",
      )}
    >
      <HudGlyph name={compact ? "expand" : "compress"} className="h-4 w-4" />
      {label}
    </button>
  );
}
