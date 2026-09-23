import type { BridgeSessionValue } from "@/lib/bridge-session-types";
import { fillDesk, pilotDeskCopy } from "@/lib/i18n/pilot-desk-copy";
import { fillTrack, trackCopy } from "@/lib/i18n/track-copy";
import type { Locale } from "@/lib/i18n/locales";
import { localizeScenario } from "@/lib/i18n/hud-scenarios";
import {
  primaryTrack,
  sceneTracks,
  type IdStatus,
  type PictureContact,
} from "@/lib/picture-scenes";
import { SCENARIOS, type PanelType, type RiskLevel } from "@/lib/scenarios";

function isPanel(value: string): value is PanelType {
  return value === "radar" || value === "sonar" || value === "spectrum" || value === "perimeter";
}

function isRisk(value: string): value is RiskLevel {
  return value === "NORMAL" || value === "ATTENTION" || value === "ELEVATED" || value === "CRITICAL";
}

function idLabel(status: IdStatus | undefined, copy: ReturnType<typeof trackCopy>) {
  if (status === "identified") return copy.identified;
  if (status === "classified") return copy.classified;
  return copy.unidentified;
}

function speedText(contact: PictureContact, copy: ReturnType<typeof trackCopy>) {
  if (contact.speedKn == null) return copy.noSpeed;
  return `${contact.speedKn} kn`;
}

function tempText(contact: PictureContact, copy: ReturnType<typeof trackCopy>) {
  if (contact.tempC == null) return copy.noTemp;
  return `${contact.tempC} C`;
}

export function speakContact(contact: PictureContact, copy: ReturnType<typeof trackCopy>): string {
  return fillTrack(copy.primaryLine, {
    trackNo: contact.trackNo ?? "",
    label: contact.label,
    object: contact.object ?? contact.name,
    idStatus: idLabel(contact.idStatus, copy).toLowerCase(),
    range: contact.rangeText ?? contact.dist,
    bearing: contact.bearing != null ? String(contact.bearing).padStart(3, "0") : copy.noValue,
    speed: speedText(contact, copy),
    size: contact.size ?? copy.noValue,
    temp: tempText(contact, copy),
    threat: contact.threat ?? contact.type,
  });
}

export function briefWatch(session: BridgeSessionValue, locale: Locale): string {
  const copy = trackCopy(locale);
  const desk = pilotDeskCopy(locale);
  if (session.live) return desk.liveEmpty;
  const panel = isPanel(session.panelType) ? session.panelType : "radar";
  const catalog = SCENARIOS.find((item) => item.id === session.scenarioId);
  const view = catalog ? localizeScenario(locale, catalog) : undefined;
  const name = view?.name ?? session.scenarioName;
  const risk = session.riskLevel || "NORMAL";
  const tracks = sceneTracks(panel, session.scenarioId, false);
  const primary = primaryTrack(tracks);
  const others = tracks.filter((item) => item.id !== primary?.id).slice(0, 4);
  const riskKey = isRisk(risk) ? risk : "NORMAL";
  const action = session.actionText || view?.actionText || "";
  const recommended =
    session.recommended || view?.options?.find((option) => option.recommended)?.label || "";

  if (!session.scenarioId) {
    return [desk.normal, copy.officer.NORMAL, copy.captain.NORMAL, desk.youDecide].join(" ");
  }

  const lines = [
    fillTrack(copy.caseLine, { name, risk }),
    fillDesk(copy.panelLine, { panel: desk.panels[panel] }),
    session.logText || view?.logText || "",
    primary ? speakContact(primary, copy) : desk.noContacts,
    others.length
      ? fillTrack(copy.alsoLine, {
          list: others
            .map((item) => `${item.label} ${item.rangeText ?? item.dist}`)
            .join("; "),
        })
      : "",
    fillTrack(copy.watchLine, { text: [recommended, action].filter(Boolean).join(" — ") || desk.normal }),
    fillTrack(copy.officerLine, { text: copy.officer[riskKey] }),
    fillTrack(copy.captainLine, { text: copy.captain[riskKey] }),
    desk.youDecide,
  ];
  return lines.filter(Boolean).join(" ");
}
