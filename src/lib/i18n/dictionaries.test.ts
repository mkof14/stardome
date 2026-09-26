import { describe, expect, it } from "vitest";
import { dictionaries, messagesFor } from "@/lib/i18n/dictionaries";
import { locales, type Locale } from "@/lib/i18n/locales";
import { homeShowCopy } from "@/lib/i18n/home-show-copy";
import { containerShowCopy } from "@/lib/i18n/container-show-copy";
import { pilotChrome } from "@/lib/i18n/pilot-chrome";
import { hudFor } from "@/lib/i18n/hud";

const ABOUT_TITLES: Record<Locale, string> = {
  en: "Who is behind StarDome",
  es: "Quién está detrás de StarDome",
  fr: "Qui est derrière StarDome",
  de: "Wer steht hinter StarDome",
  ru: "Кто за StarDome",
  uk: "Хто за StarDome",
  ar: "من وراء StarDome",
  zh: "谁站在 StarDome 背后",
  ja: "StarDome の背後にいるのは誰か",
  he: "מי מאחורי StarDome",
};

function walkStrings(value: unknown, path: string, visit: (path: string, text: string) => void) {
  if (typeof value === "string") {
    visit(path, value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => walkStrings(item, `${path}[${index}]`, visit));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      walkStrings(child, path ? `${path}.${key}` : key, visit);
    }
  }
}

describe("dictionaries", () => {
  it("covers every locale without empty strings", () => {
    const empty: string[] = [];
    for (const locale of locales) {
      expect(dictionaries[locale]).toBe(messagesFor(locale));
      walkStrings(messagesFor(locale), locale, (path, text) => {
        if (!text.trim()) empty.push(path);
      });
    }
    expect(empty).toEqual([]);
  });

  it("names the company on About, not StarDome 1", () => {
    for (const locale of locales) {
      const about = messagesFor(locale).about;
      expect(about.title).toBe(ABOUT_TITLES[locale]);
      expect(about.title).not.toMatch(/StarDome\s*1/);
      expect(messagesFor(locale).seo.about).toBe(ABOUT_TITLES[locale]);
      expect(about.kicker.length).toBeGreaterThan(0);
    }
  });

  it("brands the connections map as StarDome", () => {
    for (const locale of locales) {
      const surface = messagesFor(locale).surface;
      expect(surface.connectionsKicker).toMatch(/STARDOME/);
      expect(surface.connectionsLead).toMatch(/StarDome/);
      expect(surface.connectionsKicker).not.toMatch(/STARWALL|BRIDGE/i);
    }
  });

  it("keeps overlay copy filled for show pages, HUD, and Pilot", () => {
    for (const locale of locales) {
      expect(homeShowCopy(locale).envelopeTitle.trim().length).toBeGreaterThan(8);
      expect(containerShowCopy(locale).title.trim().length).toBeGreaterThan(8);
      expect(pilotChrome(locale).converseOffer.trim().length).toBeGreaterThan(8);
      expect(hudFor(locale).map.aria).toMatch(/StarDome/);
    }
  });
});
