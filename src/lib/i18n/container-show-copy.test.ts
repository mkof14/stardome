import { describe, expect, it } from "vitest";
import { locales } from "@/lib/i18n/locales";
import { containerShowCopy } from "@/lib/i18n/container-show-copy";

describe("containerShowCopy", () => {
  it("covers every locale with four units and three systems", () => {
    for (const locale of locales) {
      const copy = containerShowCopy(locale);
      expect(copy.units).toHaveLength(4);
      expect(copy.systems).toHaveLength(3);
      expect(copy.title.length).toBeGreaterThan(8);
      expect(copy.homeCta.length).toBeGreaterThan(4);
      expect(copy.footerCta.length).toBeGreaterThan(4);
      expect(copy.footerTitle.length).toBeGreaterThan(4);
    }
  });

  it("names AGRON containers and StarDome systems in English and Russian", () => {
    expect(containerShowCopy("en").title).toBe("AGRON containers. StarDome systems.");
    expect(containerShowCopy("ru").title).toBe("Контейнеры AGRON. Системы StarDome.");
  });
});
