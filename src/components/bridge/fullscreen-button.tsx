"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useHud } from "@/lib/i18n/use-hud";
import { ChamferFrame, HudGlyph } from "@/components/bridge/hud-icons";
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
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1 px-1.5 font-ui text-xs",
        active ? "text-orange" : "text-ink hover:text-orange",
      )}
    >
      <ChamferFrame active={active} className="h-8 w-8">
        <HudGlyph name={active ? "fullscreenExit" : "fullscreen"} className="h-3.5 w-3.5" />
      </ChamferFrame>
      {compact ? null : (
        <span className="hidden max-w-[8.5rem] truncate xl:inline">{label}</span>
      )}
    </button>
  );
}
