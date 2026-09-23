import { describe, expect, it } from "vitest";
import type { BridgeSessionValue } from "@/lib/bridge-session-types";
import { localPilotReply } from "@/lib/pilot-knowledge";
import {
  claudeMessages,
  clipChatHistory,
  isAdviceAccept,
  isAdviceDecline,
  isNotifyAsk,
  localWatchAnswer,
  watchAskKind,
} from "@/lib/pilot-sim";

function session(partial: Partial<BridgeSessionValue> = {}): BridgeSessionValue {
  return {
    scenarioName: "Reconnaissance drone",
    riskLevel: "ATTENTION",
    vessel: "M/Y AURELIA",
    scenarioId: "recon-drone",
    panelType: "radar",
    actionText: "Hold visual track. Keep it in sight.",
    recommended: "Hold visual track",
    logText: "Unidentified UAV holding position.",
    crisis: false,
    faultId: null,
    live: false,
    ...partial,
  };
}

describe("clipChatHistory", () => {
  it("keeps the last eight user and assistant turns", () => {
    const turns = Array.from({ length: 12 }, (_, index) => ({
      role: index % 2 === 0 ? "user" : "assistant",
      text: `turn ${index}`,
    }));
    const clipped = clipChatHistory(turns);
    expect(clipped).toHaveLength(8);
    expect(clipped[0]?.text).toBe("turn 4");
    expect(clipChatHistory([{ role: "error", text: "no" }])).toEqual([]);
  });
});

describe("claudeMessages", () => {
  it("alternates roles and appends the current message", () => {
    const messages = claudeMessages(
      [
        { role: "user", text: "Radar?" },
        { role: "assistant", text: "UAV at 200 m." },
      ],
      "What should I do?",
    );
    expect(messages.map((item) => item.role)).toEqual(["user", "assistant", "user"]);
    expect(messages.at(-1)?.content).toBe("What should I do?");
  });
});

describe("watch ask kinds", () => {
  it("detects accept, decline, notify, and picture asks", () => {
    expect(isAdviceAccept("Accept")).toBe(true);
    expect(isAdviceAccept("Принять")).toBe(true);
    expect(isAdviceDecline("Decline the advice")).toBe(true);
    expect(isNotifyAsk("Notify designated person")).toBe(true);
    expect(watchAskKind("What does Starlink show?")).toBe("starlink");
    expect(watchAskKind("What should I do?")).toBe("advice");
  });
});

describe("localWatchAnswer", () => {
  it("answers contacts and the recommended action from the DEMO picture", () => {
    expect(localWatchAnswer(session(), "en", "Who is on the picture?")).toMatch(
      /UAV|200 m|Surveillance/i,
    );
    expect(localWatchAnswer(session(), "en", "What should I do?")).toMatch(
      /Hold visual track/i,
    );
    expect(localWatchAnswer(session(), "en", "Accept")).toMatch(/Accepted|Black Box/i);
    expect(localWatchAnswer(session({ live: true }), "en", "Radar?")).toMatch(/no sensors/i);
  });

  it("keeps /interface crisis asks on the picture, not a product pitch", () => {
    const { reply } = localPilotReply("What is this?", "en", {
      path: "/interface",
      session: session({ crisis: true, riskLevel: "CRITICAL" }),
    });
    expect(reply).toMatch(/reconnaissance|UAV|200 m|Hold visual/i);
    expect(reply.toLowerCase()).not.toMatch(/light|advanced|intelligence|custom/);
  });

  it("still answers plan questions from the site briefing during a drill", () => {
    const { reply } = localPilotReply("What are the plans?", "en", {
      path: "/interface",
      session: session(),
    });
    expect(reply.toLowerCase()).toMatch(/light|advanced|intelligence|custom/);
  });
});
