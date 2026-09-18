"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useHud } from "@/lib/i18n/use-hud";
import { HexFrame } from "@/components/bridge/hud-icons";
import { enterFullscreen, exitFullscreen, fullscreenTarget, isFullscreen, onFullscreenChange } from "@/lib/fullscreen";

function EnterScreenIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" aria-hidden>
      <rect
        x="6"
        y="7"
        width="12"
        height="10"
        rx="0.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="square"
        d="M3 9V4h5M21 9V4h-5M21 15v5h-5M3 15v5h5"
      />
    </svg>
  );
}

function ExitScreenIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" aria-hidden>
      <rect
        x="3.5"
        y="4.5"
        width="17"
        height="15"
        rx="0.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.55"
      />
      <rect
        x="7"
        y="8"
        width="10"
        height="8"
        rx="0.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="square"
        d="M9 11.5H7.2M9 11.5V9.7M15 11.5h1.8M15 11.5V9.7M9 12.5H7.2M9 12.5v1.8M15 12.5h1.8M15 12.5v1.8"
      />
    </svg>
  );
}

export function FullscreenButton() {
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
        "inline-flex h-9 items-center gap-1.5 border px-2.5 font-ui text-xs",
        active
          ? "border-orange bg-orange text-white"
          : "border-bridge-text/40 text-bridge-text hover:border-orange hover:text-orange",
      )}
    >
      {active ? (
        <HexFrame active className="h-7 w-7 text-white">
          <ExitScreenIcon />
        </HexFrame>
      ) : (
        <HexFrame className="h-7 w-7">
          <EnterScreenIcon />
        </HexFrame>
      )}
      <span className="hidden max-w-[9.5rem] truncate sm:inline">{label}</span>
    </button>
  );
}
