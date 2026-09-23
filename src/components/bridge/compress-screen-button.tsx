"use client";

import { cn } from "@/lib/cn";
import { useAgronView } from "@/lib/agron-view";
import { useHud } from "@/lib/i18n/use-hud";
import { HudGlyph } from "@/components/bridge/hud-icons";

export function CompressScreenButton({
  compact,
}: {
  compact?: boolean;
}) {
  const { hud } = useHud();
  const { density, toggleDensity } = useAgronView();
  const squeezed = density === "compact";
  const label = squeezed ? hud.chrome.expandScreen : hud.chrome.compressScreen;
  const tip = squeezed ? hud.chrome.expandScreenTip : hud.chrome.compressScreenTip;

  return (
    <button
      type="button"
      data-testid="compress-screen"
      data-mode={squeezed ? "expand" : "compress"}
      onClick={toggleDensity}
      aria-pressed={squeezed}
      aria-label={label}
      title={tip}
      className={cn(
        "inline-flex h-10 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl px-2 font-body text-[11px] font-medium",
        squeezed ? "bg-orange/10 text-orange" : "text-ink hover:bg-page hover:text-orange",
      )}
    >
      <HudGlyph name={squeezed ? "expand" : "compress"} className="h-4 w-4" />
      {compact ? null : (
        <span className="hidden max-w-[8.5rem] truncate xl:inline">{label}</span>
      )}
    </button>
  );
}
