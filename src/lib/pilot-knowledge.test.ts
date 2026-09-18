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

  it("answers English Bridge questions from the site copy", () => {
    const { reply, langCode } = localPilotReply(
      "What is on the Interface?",
      "en",
    );
    expect(langCode).toBe("en");
    expect(reply.toLowerCase()).toMatch(/demo|interface|bridge/);
  });
});
