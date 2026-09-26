import { describe, expect, it } from "vitest";
import { locales } from "@/lib/i18n/locales";
import { matchPilotFact, pilotFactReply } from "@/lib/pilot-facts";
import { localPilotReply } from "@/lib/pilot-knowledge";
import { pilotChrome } from "@/lib/i18n/pilot-chrome";

describe("pilot facts", () => {
  it("classifies radar range in English and Russian", () => {
    expect(matchPilotFact("на какое расстояние меряет радар")).toBe("radarRange");
    expect(matchPilotFact("How far does the radar see?")).toBe("radarRange");
    expect(matchPilotFact("какая дальность радара")).toBe("radarRange");
    expect(matchPilotFact("What is the camera range?")).toBe("cameras");
    expect(matchPilotFact("How far is the sonar?")).toBe("sonar");
  });

  it("answers core kit questions in every language without a dollar sign", () => {
    for (const locale of locales) {
      const radar = pilotFactReply("How far does the radar measure?", locale);
      expect(radar).toMatch(/15/);
      expect(radar).not.toMatch(/\$/);
      const sonar = pilotFactReply("sonar range", locale);
      expect(sonar).toMatch(/1/);
    }
  });

  it("does not parrot a watch question into the converse offer", () => {
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
    const { reply } = localPilotReply("на какое расстояние меряет радар", "ru", {
      path: "/interface",
      session,
    });
    expect(reply).toMatch(/15/);
    expect(reply).not.toBe(pilotChrome("ru").converseOffer);
  });
});
