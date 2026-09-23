export const HELM_OPEN_EVENT = "starwall-open-helm";
export const HELM_STATE_EVENT = "starwall-helm-state";
export const PILOT_ASK_EVENT = "starwall-pilot-ask";
export const PILOT_DEMO_EVENT = "starwall-pilot-demo";
export const PILOT_DEMO_CONTROL_EVENT = "starwall-pilot-demo-control";
export const WATCH_COMMS_FOCUS_EVENT = "starwall-watch-comms-focus";
export const CLEAR_SCREENS_EVENT = "starwall-clear-screens";

export type PilotDemoControl = "play" | "stop" | "back" | "next" | "reset";

export type WatchCommsFocus = {
  party?: string;
};

export type HelmScreen = "chat" | "instruments" | "advice" | "comms";

export type HelmStateDetail = {
  open: boolean;
  unread?: boolean;
  urgent?: boolean;
};

export type HelmOpenDetail = {
  screen?: HelmScreen;
};

export function openHelm(screen?: HelmScreen) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<HelmOpenDetail>(HELM_OPEN_EVENT, { detail: { screen } }));
}

export function askPilot(prompt: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(PILOT_ASK_EVENT, { detail: { prompt } }));
  openHelm();
}

export function publishHelmState(openOrState: boolean | HelmStateDetail) {
  if (typeof window === "undefined") return;
  const detail: HelmStateDetail =
    typeof openOrState === "boolean" ? { open: openOrState } : openOrState;
  window.dispatchEvent(new CustomEvent<HelmStateDetail>(HELM_STATE_EVENT, { detail }));
}

export function startPilotDemo() {
  if (typeof window === "undefined") return;
  openHelm();
  window.dispatchEvent(new Event(PILOT_DEMO_EVENT));
}

export function controlPilotDemo(action: PilotDemoControl) {
  if (typeof window === "undefined") return;
  if (action === "play") {
    startPilotDemo();
    return;
  }
  window.dispatchEvent(
    new CustomEvent<PilotDemoControl>(PILOT_DEMO_CONTROL_EVENT, { detail: action }),
  );
}

export function focusWatchComms(party?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<WatchCommsFocus>(WATCH_COMMS_FOCUS_EVENT, {
      detail: { party },
    }),
  );
}

export function requestClearScreens() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CLEAR_SCREENS_EVENT));
}
