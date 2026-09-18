import { describe, expect, it } from "vitest";
import { locales } from "@/lib/i18n/locales";
import { hudFor } from "@/lib/i18n/hud";
import { watchCommsCopy } from "@/lib/i18n/watch-comms-copy";
import { WATCH_CIRCUITS } from "@/lib/watch-comms";
import { CORE, CORE_LOGO_WIDTH, coreLogoWidthPct, MAP_W } from "@/lib/connections";

describe("watch circuits", () => {
  it("covers captain, designated, vessel radio, and Support Live Team", () => {
    const parties = new Set(WATCH_CIRCUITS.map((row) => row.party));
    const bearers = new Set(WATCH_CIRCUITS.map((row) => row.bearer));
    expect(parties.has("captain")).toBe(true);
    expect(parties.has("designated")).toBe(true);
    expect(parties.has("support")).toBe(true);
    expect(bearers.has("shipPhone")).toBe(true);
    expect(bearers.has("mobile")).toBe(true);
    expect(bearers.has("localPhone")).toBe(true);
    expect(bearers.has("personalRadio")).toBe(true);
    expect(bearers.has("vesselRadio")).toBe(true);
    expect(bearers.has("supportDesk")).toBe(true);
    expect(WATCH_CIRCUITS.some((row) => row.id === "support-live-team")).toBe(true);
  });
});

describe("watchCommsCopy", () => {
  it("keeps Support Live Team and Pilot in every locale", () => {
    for (const code of locales) {
      const copy = watchCommsCopy(code);
      expect(copy.party.support).toMatch(/Support Live Team/);
      expect(copy.raise.length).toBeGreaterThan(0);
      expect(copy.ask.captain.toLowerCase()).toMatch(/pilot/);
      expect(copy.lead.toLowerCase()).not.toMatch(/\bcommand\b/);
    }
  });
});

describe("core logo size", () => {
  it("is small enough to sit inside the CORE hex", () => {
    const hexWidth = CORE.r * Math.sqrt(3);
    expect(CORE_LOGO_WIDTH).toBeLessThan(hexWidth);
    expect(coreLogoWidthPct()).toBeLessThan(6);
    expect((CORE_LOGO_WIDTH / MAP_W) * 100).toBe(coreLogoWidthPct());
  });
});

describe("jump labels", () => {
  it("names AI Pilot, Pilot DEMO, and Support Live Team in every locale", () => {
    for (const code of locales) {
      const jump = hudFor(code).jump;
      expect(jump.helm).toMatch(/Pilot/);
      expect(jump.demo).toMatch(/DEMO/);
      expect(jump.supportTeam).toMatch(/Support Live Team/);
      expect(jump.captain.length).toBeGreaterThan(0);
      expect(jump.comms.length).toBeGreaterThan(0);
    }
  });
});
