import { describe, expect, it } from "vitest";
import { localPilotReply, pilotDirectReply } from "@/lib/pilot-knowledge";
import { pilotChrome } from "@/lib/i18n/pilot-chrome";

describe("localPilotReply", () => {
  it("answers Russian plan questions in Russian without a dollar figure", () => {
    const { reply, langCode } = localPilotReply(
      "Какие тарифы у StarWall?",
      "en",
    );
    expect(langCode).toBe("ru");
    expect(reply.toLowerCase()).toMatch(/light|advanced|intelligence|custom/);
    expect(reply).not.toMatch(/\$/);
  });

  it("answers a hear-check instead of a product briefing", () => {
    const { reply, langCode } = localPilotReply("Ты меня слышишь?", "en");
    expect(langCode).toBe("ru");
    expect(reply).toBe("Да. Слышу вас.");
    expect(localPilotReply("Can you hear me?", "en").reply).toBe("Yes. I hear you.");
  });

  it("answers English StarDome 1 questions from the site copy", () => {
    const { reply, langCode } = localPilotReply(
      "What is on StarDome 1?",
      "en",
    );
    expect(langCode).toBe("en");
    expect(reply.toLowerCase()).toMatch(/demo|stardome 1|interface/);
  });

  it("asks what they need when told to talk, instead of a picture dump", () => {
    expect(pilotDirectReply("говори со мной", "ru")).toBe(pilotChrome("ru").converseOffer);
    const { reply, langCode } = localPilotReply("говори со мной", "en", {
      path: "/interface",
      session: {
        scenarioName: "Reconnaissance drone",
        riskLevel: "ATTENTION",
        vessel: "M/Y AURELIA",
        scenarioId: "recon-drone",
        panelType: "radar",
        actionText: "Hold visual track",
        recommended: "Hold visual track",
        logText: "UAV",
        crisis: false,
        faultId: null,
        live: false,
      },
    });
    expect(langCode).toBe("ru");
    expect(reply).toBe(pilotChrome("ru").converseOffer);
    expect(reply).toMatch(/интересует|помочь/);
    expect(reply).not.toMatch(/UAV|200 m|KESTREL/i);
    expect(localPilotReply("Talk to me", "en", { path: "/interface" }).reply).toBe(
      pilotChrome("en").converseOffer,
    );
  });
});
