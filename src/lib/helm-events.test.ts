import { describe, expect, it } from "vitest";
import {
  HELM_OPEN_EVENT,
  PILOT_ADVICE_DECISION_EVENT,
  PILOT_DEMO_CONTROL_EVENT,
  PILOT_DEMO_EVENT,
  LOAD_FLAGSHIP_EVENT,
  PILOT_NOTIFY_EVENT,
  PILOT_SPEAK_FOCUS_EVENT,
  controlPilotDemo,
  openHelm,
  speakFocusTargets,
  startPilotDemo,
} from "@/lib/helm-events";

describe("pilot demo transport", () => {
  it("keeps play and transport on separate channels", () => {
    expect(PILOT_DEMO_EVENT).toBe("starwall-pilot-demo");
    expect(PILOT_DEMO_CONTROL_EVENT).toBe("starwall-pilot-demo-control");
    expect(PILOT_DEMO_EVENT).not.toBe(PILOT_DEMO_CONTROL_EVENT);
    expect(typeof startPilotDemo).toBe("function");
    expect(typeof controlPilotDemo).toBe("function");
    expect(typeof openHelm).toBe("function");
    expect(HELM_OPEN_EVENT).toBe("starwall-open-helm");
    expect(PILOT_SPEAK_FOCUS_EVENT).toBe("starwall-pilot-speak-focus");
    expect(speakFocusTargets("instruments")).toContain("situational-picture");
    expect(speakFocusTargets("advice")).toEqual(["recommended-action-panel"]);
    expect(speakFocusTargets("comms")).toEqual(["watch-comms-panel"]);
    expect(speakFocusTargets(null)).toEqual([]);
    expect(PILOT_NOTIFY_EVENT).toBe("starwall-pilot-notify");
    expect(PILOT_ADVICE_DECISION_EVENT).toBe("starwall-pilot-advice-decision");
    expect(LOAD_FLAGSHIP_EVENT).toBe("starwall-load-flagship");
  });
});
