import { describe, expect, it } from "vitest";
import type { BridgeSessionValue } from "@/lib/bridge-session-types";
import { localPilotReply } from "@/lib/pilot-knowledge";
import {
  buildPilotWatch,
  sessionFromAssistantContext,
  watchReply,
} from "@/lib/pilot-watch";

function session(partial: Partial<BridgeSessionValue> = {}): BridgeSessionValue {
  return {
    scenarioName: "Normal watch",
    riskLevel: "NORMAL",
    vessel: "M/Y AURELIA",
    scenarioId: "",
    panelType: "radar",
    actionText: "",
    recommended: "",
    logText: "",
    crisis: false,
    faultId: null,
    live: false,
    ...partial,
  };
}

describe("buildPilotWatch", () => {
  it("keeps LIVE instruments dark and does not invent contacts", () => {
    const watch = buildPilotWatch(
      session({ live: true, scenarioName: "No picture", riskLevel: "NO DATA" }),
      "en",
    );
    expect(watch.contacts).toEqual([]);
    expect(watch.commsLive).toBe(false);
    expect(watch.starlink).toHaveLength(2);
    expect(watch.starlink.every((link) => link.state === "dark")).toBe(true);
    expect(watch.instruments.every((item) => item.state === "dark")).toBe(true);
    expect(watch.advice[0]?.body).toMatch(/no sensors/i);
    expect(watchReply(session({ live: true }), "en")).toMatch(/no sensors/i);
  });

  it("reads DEMO radar contacts and a recommended action", () => {
    const watch = buildPilotWatch(
      session({
        scenarioId: "recon-drone",
        scenarioName: "Reconnaissance drone",
        riskLevel: "ATTENTION",
        panelType: "radar",
        recommended: "Hold visual track",
        actionText: "Hold visual track. Keep it in sight.",
        logText: "Unidentified UAV holding position.",
      }),
      "en",
    );
    expect(watch.urgent).toBe(true);
    expect(watch.instruments.find((item) => item.id === "radar")?.state).toBe(
      "watching",
    );
    expect(watch.contacts.length).toBeGreaterThan(0);
    expect(watch.advice.some((card) => card.kind === "advice")).toBe(true);
    expect(watch.commsLive).toBe(true);
    expect(watch.starlink.map((link) => link.id)).toEqual(["maritime", "priority"]);
    expect(watch.starlink.every((link) => link.state === "lock")).toBe(true);
    expect(
      watchReply(
        session({
          scenarioId: "recon-drone",
          scenarioName: "Reconnaissance drone",
          riskLevel: "ATTENTION",
          panelType: "radar",
        }),
        "en",
      ),
    ).toMatch(/reconnaissance|200 m|UAV|captain|watch/i);
  });

  it("raises a standing-order card on a CRITICAL DEMO scenario", () => {
    const watch = buildPilotWatch(
      session({
        scenarioId: "payload-drone",
        scenarioName: "Payload-carrying drone",
        riskLevel: "CRITICAL",
        panelType: "radar",
        crisis: true,
      }),
      "en",
    );
    expect(watch.urgent).toBe(true);
    const train = watch.advice.find((card) => card.kind === "train");
    expect(train?.steps?.length).toBeGreaterThan(0);
  });

  it("marks a faulted sensor degraded and satcom loss as comms dark", () => {
    const faulted = buildPilotWatch(session({ faultId: "radar" }), "en");
    expect(faulted.instruments.find((item) => item.id === "radar")?.state).toBe(
      "degraded",
    );
    const lost = buildPilotWatch(
      session({ scenarioId: "support-center-lost", panelType: "spectrum" }),
      "en",
    );
    expect(lost.commsLive).toBe(false);
    expect(lost.instruments.find((item) => item.id === "satcom")?.state).toBe(
      "degraded",
    );
    expect(lost.starlink.find((link) => link.id === "priority")?.state).toBe("lock");
    const jammed = buildPilotWatch(session({ scenarioId: "comms-jamming" }), "en");
    expect(jammed.starlink.find((link) => link.id === "maritime")?.state).toBe("obstructed");
    expect(jammed.starlink.find((link) => link.id === "priority")?.state).toBe("search");
  });
});

describe("sessionFromAssistantContext", () => {
  it("accepts a fault id and ignores unknown kit", () => {
    const next = sessionFromAssistantContext({
      scenarioId: "recon-drone",
      crisis: true,
      faultId: "radar",
      mode: "demo",
    });
    expect(next.scenarioId).toBe("recon-drone");
    expect(next.crisis).toBe(true);
    expect(next.faultId).toBe("radar");
    expect(next.live).toBe(false);
    expect(sessionFromAssistantContext({ faultId: "hull" }).faultId).toBeNull();
  });
});

describe("localPilotReply watch", () => {
  it("answers a radar question from the current DEMO picture", () => {
    const { reply, langCode } = localPilotReply("What does the radar show?", "en", {
      session: session({
        scenarioId: "recon-drone",
        scenarioName: "Reconnaissance drone",
        riskLevel: "ATTENTION",
        panelType: "radar",
        logText: "Unidentified UAV holding position.",
      }),
    });
    expect(langCode).toBe("en");
    expect(reply).toMatch(/UAV|200 m|captain|reconnaissance/i);
    expect(reply).not.toMatch(/\$/);
  });

  it("still answers plan questions from the site briefing", () => {
    const { reply } = localPilotReply("What are the plans?", "en", {
      session: session({ scenarioId: "recon-drone" }),
    });
    expect(reply.toLowerCase()).toMatch(/light|advanced|intelligence|custom/);
  });
});
