import { describe, expect, it } from "vitest";
import {
  HELM_OPEN_EVENT,
  PILOT_DEMO_CONTROL_EVENT,
  PILOT_DEMO_EVENT,
  controlPilotDemo,
  openHelm,
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
  });
});
