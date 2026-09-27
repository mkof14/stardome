import { describe, expect, it } from "vitest";
import {
  localPilotReply,
  pilotDirectReply,
  preferGroundedReply,
} from "@/lib/pilot-knowledge";
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
    expect(reply.toLowerCase()).toMatch(/demo|stardome 1|interface|agron 1/);
  });

  it("answers radar range instead of asking how to help", () => {
    const { reply, langCode } = localPilotReply(
      "на какое расстояние меряет радар",
      "en",
      { path: "/interface" },
    );
    expect(langCode).toBe("ru");
    expect(reply).toMatch(/15\s*км/);
    expect(reply).not.toMatch(/чем помочь|интересует/);
    expect(
      localPilotReply("How far does the radar measure?", "en", {
        path: "/interface",
      }).reply,
    ).toMatch(/15\s*km/i);
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

  it("answers leftover and station questions instead of the converse offer", () => {
    const session = {
      scenarioName: "Reconnaissance drone",
      riskLevel: "ATTENTION" as const,
      vessel: "M/Y AURELIA",
      scenarioId: "recon-drone",
      panelType: "radar" as const,
      actionText: "Hold visual track",
      recommended: "Hold visual track",
      logText: "UAV",
      crisis: false,
      faultId: null,
      live: false,
    };
    const radar = localPilotReply("расскажи про радар", "ru", {
      path: "/interface",
      session,
    });
    expect(radar.reply).toMatch(/15/);
    expect(radar.reply).not.toMatch(/чем помочь|интересует/);
    const leftover = localPilotReply("говори со мной какая дальность радара", "ru", {
      path: "/interface",
      session,
    });
    expect(leftover.reply).toMatch(/15/);
    expect(leftover.reply).not.toBe(pilotChrome("ru").converseOffer);
    const laser = localPilotReply("что такое лазер", "ru", {
      path: "/interface",
      session,
    });
    expect(laser.reply.toLowerCase()).toMatch(/лазер|луч/);
    expect(laser.reply).not.toMatch(/чем помочь|интересует/);
    const mutter = localPilotReply("ну расскажи что-нибудь про вахту", "ru", {
      path: "/interface",
      session,
    });
    expect(mutter.reply).not.toBe(pilotChrome("ru").converseOffer);
  });

  it("replaces a generic yacht dump when a station answer exists", () => {
    const dump =
      "На яхте, в марине, в порту или на острове радар, камеры и AIS чаще всего уже есть. Беда в том, что у них разные часы.";
    const { reply } = preferGroundedReply("что такое лазер", "ru", { path: "/interface" }, dump);
    expect(reply.toLowerCase()).toMatch(/лазер|луч/);
    expect(reply).not.toMatch(/разные часы/);
  });
});
