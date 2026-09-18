export const HELM_OPEN_EVENT = "starwall-open-helm";
export const HELM_STATE_EVENT = "starwall-helm-state";
export const PILOT_ASK_EVENT = "starwall-pilot-ask";
export const PILOT_DEMO_EVENT = "starwall-pilot-demo";
export const WATCH_COMMS_FOCUS_EVENT = "starwall-watch-comms-focus";
export const CLEAR_SCREENS_EVENT = "starwall-clear-screens";

export type WatchCommsFocus = {
  party?: string;
};

export function openHelm() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(HELM_OPEN_EVENT));
}

export function askPilot(prompt: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(PILOT_ASK_EVENT, { detail: { prompt } }));
  openHelm();
}

export function publishHelmState(open: boolean) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(HELM_STATE_EVENT, { detail: { open } }));
}

export function startPilotDemo() {
  if (typeof window === "undefined") return;
  openHelm();
  window.dispatchEvent(new Event(PILOT_DEMO_EVENT));
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
