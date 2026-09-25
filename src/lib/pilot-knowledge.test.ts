import { describe, expect, it } from "vitest";
import { localPilotReply } from "@/lib/pilot-knowledge";

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
});
