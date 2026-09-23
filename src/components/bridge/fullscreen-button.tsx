"use client";

import { useEffect, useState } from "react";
import { useHud } from "@/lib/i18n/use-hud";
import { HudGlyph } from "@/components/bridge/hud-icons";
import {
  headerChromeButtonClass,
  headerChromeIconClass,
} from "@/components/bridge/header-chrome";
import { enterFullscreen, exitFullscreen, fullscreenTarget, isFullscreen, onFullscreenChange } from "@/lib/fullscreen";

export function FullscreenButton({
  compact,
}: {
  compact?: boolean;
}) {
  const { hud } = useHud();
  const [active, setActive] = useState(false);

  useEffect(() => {
    function sync() {
      setActive(isFullscreen());
    }
    sync();
    return onFullscreenChange(sync);
  }, []);

  async function toggle() {
    try {
      if (isFullscreen()) {
        await exitFullscreen();
      } else {
        await enterFullscreen(fullscreenTarget());
      }
    } catch {
      setActive(isFullscreen());
    }
  }

  const label = active ? hud.chrome.fullscreenExit : hud.chrome.fullscreenEnter;

  return (
    <button
      type="button"
      data-testid="fullscreen-toggle"
      data-mode={active ? "exit" : "enter"}
      onClick={toggle}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={headerChromeButtonClass(active)}
    >
      <HudGlyph
        name={active ? "fullscreenExit" : "fullscreen"}
        className={headerChromeIconClass}
      />
      {compact ? null : (
        <span className="hidden max-w-[7rem] truncate xl:inline">{label}</span>
      )}
    </button>
  );
}
