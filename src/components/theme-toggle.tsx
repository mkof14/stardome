"use client";

import { usePreferences } from "@/lib/i18n/context";
import { cn } from "@/lib/cn";
import { HudGlyph } from "@/components/bridge/hud-icons";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme, t } = usePreferences();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-page hover:text-orange",
        className ?? "text-ink",
      )}
      aria-label={dark ? t.chrome.themeToLight : t.chrome.themeToDark}
    >
      <HudGlyph name={dark ? "sun" : "moon"} className="h-4 w-4" />
    </button>
  );
}
