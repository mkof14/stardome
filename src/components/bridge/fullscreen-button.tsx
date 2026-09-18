"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useHud } from "@/lib/i18n/use-hud";
import { HudGlyph } from "@/components/bridge/hud-icons";
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
        "inline-flex h-10 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl px-2 font-body text-[11px] font-medium",
        active ? "bg-orange/10 text-orange" : "text-ink hover:bg-page hover:text-orange",
      )}
    >
      <HudGlyph name={active ? "fullscreenExit" : "fullscreen"} className="h-4 w-4" />
      {compact ? null : (
        <span className="hidden max-w-[8.5rem] truncate xl:inline">{label}</span>
      )}
    </button>
  );
}
