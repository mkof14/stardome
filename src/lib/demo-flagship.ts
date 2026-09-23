import { SCENARIOS, type Scenario } from "@/lib/scenarios";
import type { BridgeSessionValue } from "@/lib/bridge-session-types";

export const FLAGSHIP_SCENARIO_ID = "recon-drone";
export const WATCH_SCENARIO_KEY = "starwall-watch-scenario";

export function flagshipScenario(): Scenario {
  const found = SCENARIOS.find((item) => item.id === FLAGSHIP_SCENARIO_ID);
  if (!found) {
    throw new Error("Flagship DEMO scenario is missing from the catalog.");
  }
  return found;
}

export function readStoredWatchScenario(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(WATCH_SCENARIO_KEY)?.trim() ?? "";
}

export function writeStoredWatchScenario(id: string) {
  if (typeof window === "undefined") return;
  if (!id) {
    window.localStorage.removeItem(WATCH_SCENARIO_KEY);
    return;
  }
  window.localStorage.setItem(WATCH_SCENARIO_KEY, id);
}

export function sessionForDemo(session: BridgeSessionValue): BridgeSessionValue {
  if (session.live || session.scenarioId) return session;
  const flag = flagshipScenario();
  const recommended = flag.options?.find((option) => option.recommended)?.label ?? "";
  return {
    ...session,
    scenarioId: flag.id,
    scenarioName: flag.name,
    riskLevel: flag.riskLevel,
    panelType: flag.panelType,
    actionText: flag.actionText,
    recommended,
    logText: flag.logText,
    crisis: session.crisis,
  };
}
