"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FlagIcon } from "@/components/flag-icon";
import { HudGlyph } from "@/components/bridge/hud-icons";
import { usePreferences } from "@/lib/i18n/context";
import { localeMeta, siteLocales, type Locale } from "@/lib/i18n/locales";
import { cn } from "@/lib/cn";

export function LanguageSwitcher({
  align = "end",
  tone = "on-light",
}: {
  align?: "start" | "end";
  tone?: "on-light" | "on-dark";
}) {
  const { locale, setLocale, t } = usePreferences();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (
        event.target instanceof Element &&
        !rootRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function choose(next: Locale) {
    setLocale(next);
    setOpen(false);
  }

  const onDark = tone === "on-dark";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className={cn(
          "group inline-flex h-8 items-center gap-1.5 rounded-lg px-1.5 font-body text-xs transition duration-150 ease-out hover:-translate-y-0.5",
          onDark
            ? "text-sand/80 hover:bg-white/10 hover:text-sand hover:shadow-[0_6px_14px_rgb(241_90_0/0.2)]"
            : "text-ink hover:bg-orange/12 hover:text-orange hover:shadow-[0_6px_14px_rgb(241_90_0/0.28)]",
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={t.chrome.language}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-page text-current transition duration-150 group-hover:scale-110">
          <HudGlyph name="globe" className="h-3.5 w-3.5" />
        </span>
        <FlagIcon locale={locale} />
        <span className="hidden sm:inline">{localeMeta[locale].native}</span>
        <span aria-hidden className="text-[10px]">
          ▾
        </span>
      </button>
      {open ? (
        <ul
          id={menuId}
          role="listbox"
          className={cn(
            "absolute z-50 mt-1 min-w-[13.5rem] rounded-xl border py-1 shadow-lg",
            align === "end" ? "end-0" : "start-0",
            onDark
              ? "border-white/10 bg-navy text-sand"
              : "border-stroke bg-page text-ink",
          )}
        >
          {siteLocales.map((code) => (
            <li key={code}>
              <button
                type="button"
                role="option"
                aria-selected={code === locale}
                className={cn(
                  "flex w-full items-center gap-3 px-3 py-2 text-start text-sm",
                  code === locale
                    ? "text-orange"
                    : onDark
                      ? "hover:bg-white/5"
                      : "hover:bg-panel",
                )}
                onClick={() => choose(code)}
              >
                <FlagIcon locale={code} />
                <span>{localeMeta[code].native}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
