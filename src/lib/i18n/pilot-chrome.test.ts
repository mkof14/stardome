import { describe, expect, it } from "vitest";
import { messagesFor } from "@/lib/i18n/dictionaries";
import { locales } from "@/lib/i18n/locales";
import { pilotChrome, pilotHide } from "@/lib/i18n/pilot-chrome";

describe("pilotChrome", () => {
  it("returns Hide for every locale without falling back to a previous language", () => {
    const hides = locales.map((code) => [code, pilotHide(code)] as const);
    expect(Object.fromEntries(hides)).toEqual({
      en: "Hide",
      es: "Ocultar",
      fr: "Masquer",
      de: "Ausblenden",
      ru: "Скрыть",
      uk: "Сховати",
      ar: "إخفاء",
      zh: "隐藏",
      ja: "隠す",
      he: "הסתרה",
    });
  });

  it("matches dictionary helm chrome and changes Hide when the locale changes", () => {
    let previous = "";
    for (const code of locales) {
      const chrome = pilotChrome(code);
      const surface = messagesFor(code).surface;
      expect(chrome.hide).toBe(surface.helmHide);
      expect(chrome.send).toBe(surface.helmSend);
      expect(chrome.ask).toBe(surface.helmAsk);
      expect(chrome.advisor).toBe(surface.helmAdvisor);
      expect(pilotHide(code)).toBe(surface.helmHide);
      expect(chrome.hide.length).toBeGreaterThan(0);
      expect(chrome.stop.length).toBeGreaterThan(0);
      expect(chrome.speaking.length).toBeGreaterThan(0);
      expect(chrome.listening.length).toBeGreaterThan(0);
      expect(chrome.waiting.length).toBeGreaterThan(0);
      expect(chrome.haltAck.length).toBeGreaterThan(0);
      expect(chrome.emptyWatch.length).toBeGreaterThan(0);
      if (previous) expect(chrome.hide).not.toBe(previous);
      previous = chrome.hide;
    }
  });

  it("labels Stop in every StarWall language", () => {
    expect(Object.fromEntries(locales.map((code) => [code, pilotChrome(code).stop]))).toEqual({
      en: "Stop",
      es: "Parar",
      fr: "Stop",
      de: "Stopp",
      ru: "Стоп",
      uk: "Стоп",
      ar: "توقف",
      zh: "停止",
      ja: "停止",
      he: "עצור",
    });
  });

  it("labels halt ack in every StarWall language", () => {
    expect(pilotChrome("ru").haltAck).toBe("Стоп. Слушаю.");
    expect(pilotChrome("en").haltAck).toBe("Stop. Listening.");
    expect(pilotChrome("en").listening).toBe("Listening");
    expect(pilotChrome("ru").listening).toBe("Слушает");
  });
});
