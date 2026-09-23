export const HELM_OPEN_EVENT = "starwall-open-helm";
export const HELM_STATE_EVENT = "starwall-helm-state";
export const PILOT_ASK_EVENT = "starwall-pilot-ask";
export const PILOT_NOTIFY_EVENT = "starwall-pilot-notify";
export const PILOT_ADVICE_DECISION_EVENT = "starwall-pilot-advice-decision";
export const PILOT_DEMO_EVENT = "starwall-pilot-demo";
export const PILOT_DEMO_CONTROL_EVENT = "starwall-pilot-demo-control";
export const WATCH_COMMS_FOCUS_EVENT = "starwall-watch-comms-focus";
export const PILOT_SPEAK_FOCUS_EVENT = "starwall-pilot-speak-focus";
export const CLEAR_SCREENS_EVENT = "starwall-clear-screens";

export type PilotDemoControl = "play" | "stop" | "back" | "next" | "reset";

export type PilotSpeakFocus = {
  focus: "instruments" | "advice" | "comms" | "voice" | "calls" | null;
  speaking: boolean;
  tone?: "brief" | "warn";
};

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

export type AdviceDecision = "accept" | "decline";

export type AdviceDecisionDetail = {
  decision: AdviceDecision;
  title?: string;
  body?: string;
};

export function askPilot(prompt: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(PILOT_ASK_EVENT, { detail: { prompt } }));
  openHelm();
}

export function requestPilotNotify() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(PILOT_NOTIFY_EVENT));
}

export function publishAdviceDecision(detail: AdviceDecisionDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<AdviceDecisionDetail>(PILOT_ADVICE_DECISION_EVENT, { detail }),
  );
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

export function speakFocusTargets(
  focus: PilotSpeakFocus["focus"],
): string[] {
  if (focus === "instruments") return ["situational-picture", "connected-systems-panel"];
  if (focus === "advice") return ["recommended-action-panel"];
  if (focus === "comms") return ["watch-comms-panel"];
  return [];
}

export function publishPilotSpeakFocus(detail: PilotSpeakFocus) {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  if (detail.speaking && detail.focus) {
    root.dataset.pilotSpeak = detail.focus;
    root.dataset.pilotSpeakTone = detail.tone ?? "brief";
  } else {
    delete root.dataset.pilotSpeak;
    delete root.dataset.pilotSpeakTone;
  }
  window.dispatchEvent(new CustomEvent<PilotSpeakFocus>(PILOT_SPEAK_FOCUS_EVENT, { detail }));
  if (detail.speaking && detail.focus) {
    const id = speakFocusTargets(detail.focus)[0];
    if (id) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
}
