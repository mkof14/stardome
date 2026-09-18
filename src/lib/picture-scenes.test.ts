import { describe, expect, it } from "vitest";
import { TONE_ATTN, TONE_CRIT, TONE_OK, toneColor } from "@/lib/picture-scenes";

describe("toneColor", () => {
  it("uses alarm red for critical contacts, not brand orange", () => {
    expect(TONE_CRIT).toBe("#DC2626");
    expect(toneColor("crit")).toBe(TONE_CRIT);
    expect(toneColor("attn")).toBe(TONE_ATTN);
    expect(toneColor("ok")).toBe(TONE_OK);
    expect(toneColor("crit").toLowerCase()).not.toBe("#f15a00");
  });
});
