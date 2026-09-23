import { describe, expect, it } from "vitest";
import { locales } from "@/lib/i18n/locales";
import { pilotDeskCopy } from "@/lib/i18n/pilot-desk-copy";

describe("pilotDeskCopy", () => {
  it("returns a full desk for every locale without empty chrome", () => {
    for (const code of locales) {
      const copy = pilotDeskCopy(code);
      expect(copy.post.length).toBeGreaterThan(0);
      expect(copy.chat.length).toBeGreaterThan(0);
      expect(copy.raiseInstruments.length).toBeGreaterThan(0);
      expect(copy.raiseAdvice.length).toBeGreaterThan(0);
      expect(copy.raiseComms.length).toBeGreaterThan(0);
      expect(copy.unread.length).toBeGreaterThan(0);
      expect(copy.unreadGo.length).toBeGreaterThan(0);
      expect(copy.unreadWhere.length).toBeGreaterThan(0);
      expect(copy.unreadHere.length).toBeGreaterThan(0);
      expect(copy.unreadOpen.length).toBeGreaterThan(0);
      expect(copy.liveEmpty.length).toBeGreaterThan(0);
      expect(copy.demoComms.length).toBeGreaterThan(0);
      expect(copy.starlinkServices).toMatch(/Starlink/);
      expect(copy.channelStarlinkMaritime).toMatch(/Maritime/);
      expect(copy.channelStarlinkPriority).toMatch(/Priority/);
      expect(copy.acceptAdvice.length).toBeGreaterThan(0);
      expect(copy.declineAdvice.length).toBeGreaterThan(0);
      expect(copy.acceptedLogged.length).toBeGreaterThan(0);
      expect(copy.designatedAck.length).toBeGreaterThan(0);
      expect(copy.designatedSeen.length).toBeGreaterThan(0);
    }
  });
});
