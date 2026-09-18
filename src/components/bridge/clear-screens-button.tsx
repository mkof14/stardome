"use client";

import { cn } from "@/lib/cn";
import { HexFrame } from "@/components/bridge/hud-icons";
import { requestClearScreens } from "@/lib/helm-events";
import { useHud } from "@/lib/i18n/use-hud";

function ClearIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="square"
        d="M4 19h16M7 16.5 16.2 7.3l2.1 2.1L9.1 18.6H7v-2.1Z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        d="M14.6 5.7l2.1 2.1 1.4-1.4a1.5 1.5 0 0 0 0-2.1L16.8 3a1.5 1.5 0 0 0-2.1 0l-1.4 1.4Z"
      />
    </svg>
  );
}

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
      <HexFrame className="h-7 w-7">
        <ClearIcon />
      </HexFrame>
      <span>{hud.chrome.clearScreens}</span>
    </button>
  );
}
