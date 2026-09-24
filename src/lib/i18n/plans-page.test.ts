import { describe, expect, it } from "vitest";
import { locales } from "@/lib/i18n/locales";
import { plansPage } from "@/lib/i18n/plans-page";

function flatten(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(flatten).join("\n");
  if (value && typeof value === "object") {
    return Object.values(value).map(flatten).join("\n");
  }
  return "";
}

describe("plans page locales", () => {
  it("ships a native Plans page for every locale", () => {
    for (const locale of locales) {
      const copy = plansPage[locale];
      expect(copy.title.length).toBeGreaterThan(3);
      expect(copy.request.sending.length).toBeGreaterThan(1);
      expect(copy.request.error.length).toBeGreaterThan(1);
      expect(copy.request.success.toLowerCase()).not.toMatch(/idea demo|idea preview|idea demonstration/);
      if (locale !== "en") {
        expect(copy).not.toBe(plansPage.en);
        expect(copy.title).not.toBe(plansPage.en.title);
      }
    }
  });

  it("never publishes dollar or monthly figures", () => {
    for (const locale of locales) {
      const text = flatten(plansPage[locale]);
      expect(text).not.toMatch(/\$\d/);
      expect(text).not.toMatch(/\/mo\b/i);
    }
  });
});
