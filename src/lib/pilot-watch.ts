import type { BridgeSessionValue } from "@/lib/bridge-session-types";
import { CRISIS_PROTOCOLS, FALLBACK_CRISIS_STEPS } from "@/lib/crisis-protocols";
import { EQUIPMENT, type EquipmentId } from "@/lib/equipment";
import { hudFor } from "@/lib/i18n/hud";
import { fillDesk, pilotDeskCopy, type PilotDeskCopy } from "@/lib/i18n/pilot-desk-copy";
import { localizeCrisisSteps, localizeScenario } from "@/lib/i18n/hud-scenarios";
import type { Locale } from "@/lib/i18n/locales";
import {
  perimeterScene,
  radarScene,
  sonarScene,
  spectrumScene,
  type PictureContact,
} from "@/lib/picture-scenes";
import { SCENARIOS, type PanelType } from "@/lib/scenarios";

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
  if (panel === "radar") {
    const scene = radarScene(session.scenarioId);
    return {
      contacts: scene.contacts.map((item) => ({
        id: item.id,
        name: item.label,
        dist: item.dist,
        tone: item.tone,
      })),
      callout: null,
    };
  }
  if (panel === "sonar") {
    const scene = sonarScene(session.scenarioId);
    return {
      contacts: scene.contacts.map((item) => ({
        id: item.id,
        name: item.label,
        dist: item.dist,
        tone: item.tone,
      })),
      callout: scene.note || null,
    };
  }
  if (panel === "spectrum") {
    const scene = spectrumScene(session.scenarioId);
    return { contacts: [], callout: scene.callout };
  }
  const scene = perimeterScene(session.scenarioId);
  return { contacts: [], callout: scene.callout };
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
    const priority = contacts.filter((item) => item.tone !== "ok");
    const contactLine =
      priority.length > 0
        ? priority.map((item) => `${item.name} · ${item.dist}`).join("; ")
        : contacts.length > 0
          ? contacts
              .slice(0, 3)
              .map((item) => `${item.name} · ${item.dist}`)
              .join("; ")
          : copy.noContacts;
    advice.push({
      kind: "situation",
      title: view?.name ?? session.scenarioName,
      body: [
        fillDesk(copy.seePicture, { panel: panelLabel }),
        session.logText || view?.logText || "",
        callout,
        contactLine,
      ]
        .filter(Boolean)
        .join(" "),
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
  };
}

export function watchReply(session: BridgeSessionValue, locale: Locale): string {
  const watch = buildPilotWatch(session, locale);
  const copy = watch.copy;
  if (session.live) return copy.liveEmpty;
  const lines = [
    watch.advice.find((item) => item.kind === "situation")?.body,
    watch.advice.find((item) => item.kind === "advice")?.body,
    watch.advice.find((item) => item.kind === "train")?.body,
    copy.youDecide,
  ].filter(Boolean);
  return lines.join(" ");
}
