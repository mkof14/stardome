"use client";

import { useAgronView } from "@/lib/agron-view";
import { useHud } from "@/lib/i18n/use-hud";
import { HudGlyph } from "@/components/bridge/hud-icons";
import {
  headerChromeButtonClass,
  headerChromeIconClass,
} from "@/components/bridge/header-chrome";

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
      className={headerChromeButtonClass(squeezed)}
    >
      <HudGlyph name={squeezed ? "expand" : "compress"} className={headerChromeIconClass} />
      {compact ? null : (
        <span className="hidden max-w-[7rem] truncate xl:inline">{label}</span>
      )}
    </button>
  );
}
