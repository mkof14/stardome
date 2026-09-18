"use client";

import { usePreferences } from "@/lib/i18n/context";
import { cn } from "@/lib/cn";
import { ChamferFrame, HudGlyph } from "@/components/bridge/hud-icons";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme, t } = usePreferences();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center hover:text-orange",
        className ?? "text-ink",
      )}
      aria-label={dark ? t.chrome.themeToLight : t.chrome.themeToDark}
    >
      <ChamferFrame className="h-8 w-8">
        <HudGlyph name={dark ? "sun" : "moon"} className="h-4 w-4" />
      </ChamferFrame>
    </button>
  );
}
