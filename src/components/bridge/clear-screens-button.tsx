"use client";

import { cn } from "@/lib/cn";
import { ChamferFrame, HudGlyph } from "@/components/bridge/hud-icons";
import { requestClearScreens } from "@/lib/helm-events";
import { useHud } from "@/lib/i18n/use-hud";

export function ClearScreensButton({
  onClear,
}: {
  onClear?: () => void;
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
        "inline-flex h-9 items-center gap-1.5 border border-bridge-text/40 px-2.5 font-ui text-xs text-bridge-text",
        "hover:border-orange hover:text-orange",
      )}
    >
      <ChamferFrame className="h-7 w-7">
        <HudGlyph name="clear" className="h-3.5 w-3.5" />
      </ChamferFrame>
      <span>{hud.chrome.clearScreens}</span>
    </button>
  );
}
