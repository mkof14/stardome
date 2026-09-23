import { describe, expect, it } from "vitest";
import {
  PILOT_DEMO_CONTROL_EVENT,
  PILOT_DEMO_EVENT,
  controlPilotDemo,
  startPilotDemo,
} from "@/lib/helm-events";

describe("pilot demo transport", () => {
  it("keeps play and transport on separate channels", () => {
    expect(PILOT_DEMO_EVENT).toBe("starwall-pilot-demo");
    expect(PILOT_DEMO_CONTROL_EVENT).toBe("starwall-pilot-demo-control");
    expect(PILOT_DEMO_EVENT).not.toBe(PILOT_DEMO_CONTROL_EVENT);
    expect(typeof startPilotDemo).toBe("function");
    expect(typeof controlPilotDemo).toBe("function");
  });
});
