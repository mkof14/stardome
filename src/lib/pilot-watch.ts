import type { BridgeSessionValue } from "@/lib/bridge-session-types";
import { CRISIS_PROTOCOLS, FALLBACK_CRISIS_STEPS } from "@/lib/crisis-protocols";
import { EQUIPMENT, type EquipmentId } from "@/lib/equipment";
import { hudFor } from "@/lib/i18n/hud";
import { fillDesk, pilotDeskCopy, type PilotDeskCopy } from "@/lib/i18n/pilot-desk-copy";
import { localizeCrisisSteps, localizeScenario } from "@/lib/i18n/hud-scenarios";
import type { Locale } from "@/lib/i18n/locales";
import {
  perimeterScene,
  sceneTracks,
  sonarScene,
  spectrumScene,
  type PictureContact,
} from "@/lib/picture-scenes";
import { SCENARIOS, type PanelType } from "@/lib/scenarios";
import { starlinkLinks, type StarlinkLink } from "@/lib/starlink";
import { briefWatch } from "@/lib/watch-brief";

export type InstrumentState = "watching" | "quiet" | "degraded" | "dark";

export type PilotInstrument = {
  id: EquipmentId;
  name: string;
  state: InstrumentState;
  active: boolean;
};

export type PilotContact = {
  id: string;
  name: string;
  dist: string;
  tone: PictureContact["tone"];
};

export type PilotAdvice = {
  kind: "situation" | "advice" | "remind" | "train";
  title: string;
  body: string;
  steps?: string[];
};

export type PilotWatch = {
  noteKey: string;
  urgent: boolean;
  copy: PilotDeskCopy;
  instruments: PilotInstrument[];
  contacts: PilotContact[];
  callout: string | null;
  panelLabel: string;
  situation: string;
  advice: PilotAdvice[];
  commsLive: boolean;
  starlink: StarlinkLink[];
};

const EQUIPMENT_IDS: EquipmentId[] = EQUIPMENT.map((item) => item.id);

export function sessionFromAssistantContext(context: {
  scenarioName?: unknown;
  riskLevel?: unknown;
  vessel?: unknown;
  mode?: unknown;
  scenarioId?: unknown;
  panelType?: unknown;
  actionText?: unknown;
  recommended?: unknown;
  logText?: unknown;
  crisis?: unknown;
  faultId?: unknown;
}): BridgeSessionValue {
  const text = (value: unknown, fallback: string) =>
    typeof value === "string" && value.trim() ? value.trim() : fallback;
  const fault =
    typeof context.faultId === "string" &&
    EQUIPMENT_IDS.includes(context.faultId as EquipmentId)
      ? (context.faultId as EquipmentId)
      : null;
  return {
    scenarioName: text(context.scenarioName, "Normal watch"),
    riskLevel: text(context.riskLevel, "NORMAL"),
    vessel: text(context.vessel, "M/Y AURELIA"),
    scenarioId: text(context.scenarioId, ""),
    panelType: text(context.panelType, "radar"),
    actionText: text(context.actionText, ""),
    recommended: text(context.recommended, ""),
    logText: text(context.logText, ""),
    crisis: context.crisis === true,
    faultId: fault,
    live: context.mode === "live",
  };
}

function isPanel(value: string): value is PanelType {
  return value === "radar" || value === "sonar" || value === "spectrum" || value === "perimeter";
}

function contactsFrom(session: BridgeSessionValue): {
  contacts: PilotContact[];
  callout: string | null;
} {
  if (session.live || !session.scenarioId) {
    return { contacts: [], callout: null };
  }
  const panel = isPanel(session.panelType) ? session.panelType : "radar";
  const contacts = sceneTracks(panel, session.scenarioId).map((item) => ({
    id: item.id,
    name: item.name,
    dist: [item.rangeText ?? item.dist, item.object, item.threat].filter(Boolean).join(" · "),
    tone: item.tone,
  }));
  if (panel === "sonar") {
    return { contacts, callout: sonarScene(session.scenarioId).note || null };
  }
  if (panel === "spectrum") {
    return { contacts, callout: spectrumScene(session.scenarioId).callout };
  }
  if (panel === "perimeter") {
    return { contacts, callout: perimeterScene(session.scenarioId).callout };
  }
  return { contacts, callout: null };
}

function instrumentState(
  id: EquipmentId,
  session: BridgeSessionValue,
): { state: InstrumentState; active: boolean } {
  if (session.live) return { state: "dark", active: false };
  if (session.faultId === id) return { state: "degraded", active: false };
  if (id === "satcom" && session.scenarioId === "support-center-lost") {
    return { state: "degraded", active: true };
  }
  const panel = session.panelType;
  const active =
    (id === "radar" && (panel === "radar" || !panel)) ||
    (id === "ais" && (panel === "radar" || !panel)) ||
    (id === "sonar" && panel === "sonar") ||
    (id === "cctv" && panel === "perimeter") ||
    (id === "perimeter" && panel === "perimeter") ||
    (id === "satcom" && (panel === "spectrum" || session.crisis));
  if (active) return { state: "watching", active: true };
  return { state: "quiet", active: false };
}

export function buildPilotWatch(session: BridgeSessionValue, locale: Locale): PilotWatch {
  const copy = pilotDeskCopy(locale);
  const hud = hudFor(locale);
  const { contacts, callout } = contactsFrom(session);
  const panel = isPanel(session.panelType) ? session.panelType : "radar";
  const panelLabel = copy.panels[panel];
  const instruments: PilotInstrument[] = EQUIPMENT.map((item) => {
    const next = instrumentState(item.id, session);
    return {
      id: item.id,
      name: hud.equipment[item.id],
      state: next.state,
      active: next.active,
    };
  });

  const advice: PilotAdvice[] = [];
  if (session.live) {
    advice.push({
      kind: "situation",
      title: copy.picture,
      body: copy.liveEmpty,
    });
  } else if (!session.scenarioId) {
    advice.push({
      kind: "situation",
      title: copy.standBy,
      body: copy.normal,
    });
  } else {
    const catalog = SCENARIOS.find((item) => item.id === session.scenarioId);
    const view = catalog ? localizeScenario(locale, catalog) : undefined;
    advice.push({
      kind: "situation",
      title: view?.name ?? session.scenarioName,
      body: briefWatch(session, locale),
    });
    const recommended =
      session.recommended ||
      view?.options?.find((option) => option.recommended)?.label ||
      "";
    const action = session.actionText || view?.actionText || "";
    if (action || recommended) {
      advice.push({
        kind: "advice",
        title: copy.recommended,
        body: [recommended, action, copy.youDecide].filter(Boolean).join(" — "),
      });
    }
    if (session.crisis) {
      const steps = localizeCrisisSteps(
        locale,
        session.scenarioId,
        CRISIS_PROTOCOLS[session.scenarioId] ?? FALLBACK_CRISIS_STEPS,
      );
      advice.push({
        kind: "train",
        title: copy.protocol,
        body: copy.crisis,
        steps: steps.slice(0, 4),
      });
    } else {
      advice.push({
        kind: "remind",
        title: copy.remind,
        body: copy.youDecide,
      });
    }
  }

  if (session.faultId) {
    const name = hud.equipment[session.faultId];
    advice.unshift({
      kind: "remind",
      title: copy.degraded,
      body: fillDesk(copy.fault, { name }),
    });
  }

  const urgent =
    session.crisis ||
    session.riskLevel === "CRITICAL" ||
    session.riskLevel === "ELEVATED" ||
    session.riskLevel === "ATTENTION" ||
    Boolean(session.faultId);

  return {
    noteKey: `${session.live ? "live" : "demo"}:${session.scenarioId}:${session.riskLevel}:${session.faultId ?? ""}`,
    urgent,
    copy,
    instruments,
    contacts,
    callout,
    panelLabel,
    situation: advice[0]?.body ?? copy.normal,
    advice,
    commsLive: !session.live && session.scenarioId !== "support-center-lost" && session.faultId !== "satcom",
    starlink: starlinkLinks({
      live: session.live,
      scenarioId: session.scenarioId,
      faultId: session.faultId,
    }),
  };
}

export function watchReply(session: BridgeSessionValue, locale: Locale): string {
  if (session.live) return pilotDeskCopy(locale).liveEmpty;
  return briefWatch(session, locale);
}
