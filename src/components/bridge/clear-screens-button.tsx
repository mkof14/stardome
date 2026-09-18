"use client";

import { cn } from "@/lib/cn";
import { ChamferFrame, HudGlyph } from "@/components/bridge/hud-icons";
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
        "inline-flex h-9 shrink-0 items-center gap-1 px-1.5 font-ui text-xs text-ink",
        "hover:text-orange",
      )}
    >
      <ChamferFrame className="h-8 w-8">
        <HudGlyph name="clear" className="h-3.5 w-3.5" />
      </ChamferFrame>
      {compact ? null : <span className="hidden sm:inline">{hud.chrome.clearScreens}</span>}
    </button>
  );
}
