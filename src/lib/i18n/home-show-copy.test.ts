import { describe, expect, it } from "vitest";
import { locales } from "@/lib/i18n/locales";
import { homeShowCopy } from "@/lib/i18n/home-show-copy";

describe("homeShowCopy", () => {
  it("covers every locale", () => {
    for (const locale of locales) {
      const copy = homeShowCopy(locale);
      expect(copy.envelopeTitle.length).toBeGreaterThan(8);
      expect(copy.envelopeCta.length).toBeGreaterThan(4);
      expect(copy.watchPick).toHaveLength(4);
    }
  });
});
