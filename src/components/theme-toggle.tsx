"use client";

import { usePreferences } from "@/lib/i18n/context";
import { cn } from "@/lib/cn";
import { HudGlyph } from "@/components/bridge/hud-icons";
import {
  headerChromeButtonClass,
  headerChromeIconClass,
} from "@/components/bridge/header-chrome";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme, t } = usePreferences();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(headerChromeButtonClass(), className)}
      aria-label={dark ? t.chrome.themeToLight : t.chrome.themeToDark}
    >
      <HudGlyph name={dark ? "sun" : "moon"} className={headerChromeIconClass} />
    </button>
  );
}
