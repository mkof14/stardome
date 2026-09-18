"use client";

import { cn } from "@/lib/cn";
import { HudGlyph } from "@/components/bridge/hud-icons";
import { requestClearScreens } from "@/lib/helm-events";
import { useHud } from "@/lib/i18n/use-hud";

export function ClearScreensButton({
  onClear,
  compact,
}: {
  onClear?: () => void;
  compact?: boolean;
}) {
  const { hud } = useHud();

  return (
    <button
      type="button"
      data-testid="clear-screens"
      onClick={() => {
        onClear?.();
        requestClearScreens();
      }}
      aria-label={hud.chrome.clearScreensTip}
      title={hud.chrome.clearScreensTip}
      className={cn(
        "inline-flex h-10 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl px-2 font-body text-[11px] font-medium text-ink",
        "hover:bg-page hover:text-orange",
      )}
    >
      <HudGlyph name="clear" className="h-4 w-4" />
      {compact ? null : <span className="hidden sm:inline">{hud.chrome.clearScreens}</span>}
    </button>
  );
}
