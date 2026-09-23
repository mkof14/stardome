import { describe, expect, it } from "vitest";
import { locales } from "@/lib/i18n/locales";
import { hudFor } from "@/lib/i18n/hud";
import { messagesFor } from "@/lib/i18n/dictionaries";
import { watchCommsCopy } from "@/lib/i18n/watch-comms-copy";
import { WATCH_CIRCUITS } from "@/lib/watch-comms";
import { CORE } from "@/lib/connections";

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
    expect(WATCH_CIRCUITS.some((row) => row.bearer === "starlinkMaritime")).toBe(true);
    expect(WATCH_CIRCUITS.some((row) => row.bearer === "starlinkPriority")).toBe(true);
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
      expect(copy.lead).toMatch(/Starlink/);
      expect(copy.starlinkLead).toMatch(/Maritime/);
      expect(copy.starlinkLead).toMatch(/Priority/);
    }
  });
});

describe("connections hub", () => {
  it("keeps a large orange AGRON 1 hub", () => {
    expect(CORE.r).toBeGreaterThan(70);
  });
});

describe("bridge chrome", () => {
  it("names Clear and distinct fullscreen enter/exit in every locale", () => {
    for (const code of locales) {
      const chrome = hudFor(code).chrome;
      expect(chrome.clearScreens.length).toBeGreaterThan(0);
      expect(chrome.clearScreensTip.length).toBeGreaterThan(0);
      expect(chrome.fullscreenEnter.length).toBeGreaterThan(0);
      expect(chrome.fullscreenExit.length).toBeGreaterThan(0);
      expect(chrome.fullscreenEnter).not.toBe(chrome.fullscreenExit);
      expect(chrome.compressScreen.length).toBeGreaterThan(0);
      expect(chrome.expandScreen.length).toBeGreaterThan(0);
      expect(chrome.compressScreen).not.toBe(chrome.expandScreen);
      expect(chrome.fullscreenEnter.length).toBeGreaterThan(2);
    }
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
      expect(jump.starlink).toMatch(/Starlink/);
      expect(messagesFor(code).surface.connectionsKicker).toMatch(/STARWALL/);
      expect(messagesFor(code).surface.connectionsKicker).not.toMatch(/BRIDGE/);
    }
  });
});
