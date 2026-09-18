export const HELM_OPEN_EVENT = "starwall-open-helm";
export const HELM_STATE_EVENT = "starwall-helm-state";
export const PILOT_ASK_EVENT = "starwall-pilot-ask";

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
