"use client";

import { HudGlyph } from "@/components/bridge/hud-icons";
import {
  headerChromeButtonClass,
  headerChromeIconClass,
} from "@/components/bridge/header-chrome";
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
      className={headerChromeButtonClass()}
    >
      <HudGlyph name="clear" className={headerChromeIconClass} />
      {compact ? null : <span className="hidden sm:inline">{hud.chrome.clearScreens}</span>}
    </button>
  );
}
