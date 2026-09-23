import type { BridgeSessionValue } from "@/lib/bridge-session-types";
import { fillDesk, pilotDeskCopy } from "@/lib/i18n/pilot-desk-copy";
import type { Locale } from "@/lib/i18n/locales";
import { buildPilotWatch, watchReply } from "@/lib/pilot-watch";
import { speakContact } from "@/lib/watch-brief";
import { trackCopy } from "@/lib/i18n/track-copy";
import {
  primaryTrack,
  sceneTracks,
  type PictureContact,
} from "@/lib/picture-scenes";
import { SCENARIOS, type PanelType } from "@/lib/scenarios";

export type PilotChatTurn = {
  role: "user" | "assistant";
  text: string;
};

export type WatchAskKind =
  | "picture"
  | "contacts"
  | "advice"
  | "starlink"
  | "instruments"
  | "comms"
  | "notify"
  | "accept"
  | "decline";

const HISTORY_LIMIT = 8;

function isPanel(value: string): value is PanelType {
  return value === "radar" || value === "sonar" || value === "spectrum" || value === "perimeter";
}

export function clipChatHistory(turns: unknown, limit = HISTORY_LIMIT): PilotChatTurn[] {
  if (!Array.isArray(turns)) return [];
  const out: PilotChatTurn[] = [];
  for (const item of turns) {
    if (!item || typeof item !== "object") continue;
    const row = item as { role?: unknown; text?: unknown; content?: unknown };
    const role = row.role;
    const raw = typeof row.text === "string" ? row.text : row.content;
    if ((role !== "user" && role !== "assistant") || typeof raw !== "string") continue;
    const text = raw.trim();
    if (!text) continue;
    out.push({ role, text });
  }
  return out.slice(-Math.max(1, limit));
}

export function claudeMessages(history: PilotChatTurn[], message: string) {
  const turns = clipChatHistory(history);
  const out: Array<{ role: "user" | "assistant"; content: string }> = [];
  for (const turn of turns) {
    const next = { role: turn.role, content: turn.text };
    const last = out[out.length - 1];
    if (last?.role === next.role) {
      last.content = `${last.content}\n${next.content}`;
      continue;
    }
    out.push(next);
  }
  if (out[0]?.role === "assistant") out.shift();
  const last = out[out.length - 1];
  if (last?.role === "user" && last.content === message) return out;
  if (last?.role === "user") {
    last.content = `${last.content}\n${message}`;
    return out;
  }
  out.push({ role: "user", content: message });
  return out;
}

export function isAdviceAccept(message: string) {
  const q = message.trim().toLowerCase();
  return /^(yes|ok|okay|accept|принят[оа]?|принимаю|принять|так|добре|acepto|aceptar|d'accord|akzeptiere|同意|はい|מאשר)(\s|[!.?…]|$)/.test(
    q,
  ) || /(accept (the )?advice|принять (совет|рекомендац)|принимаю совет)/.test(q);
}

export function isAdviceDecline(message: string) {
  const q = message.trim().toLowerCase();
  return /(decline|reject|отклон|не принимаю|отказать|rechaz|refus|ablehnen|拒绝|いいえ|דוחה)/.test(
    q,
  );
}

export function isNotifyAsk(message: string) {
  return /notify|извест|повідом|avisar|prévenir|benachricht|إخطار|通知|להודיע|designated|назначен/.test(
    message.toLowerCase(),
  );
}

export function watchAskKind(message: string): WatchAskKind | null {
  const q = message.toLowerCase();
  if (isAdviceAccept(message)) return "accept";
  if (isAdviceDecline(message)) return "decline";
  if (isNotifyAsk(message)) return "notify";
  if (/starlink|satcom|maritime|priority|терминал/.test(q)) return "starlink";
  if (/instrument|прибор|прилад|sensor|датчик|rack/.test(q)) return "instruments";
  if (/comms|radio|радио|связь|зв’яз|канал|channel|vhf/.test(q)) return "comms";
  if (/what should|что делать|що робити|advice|совет|порад|recommend|рекоменд|protocol|протокол/.test(q)) {
    return "advice";
  }
  if (/contact|track|цель|контакт|дрон|uav|ais|кто на|who('s| is) on/.test(q)) {
    return "contacts";
  }
  if (/radar|ais|sonar|cctv|картин|обстанов|picture|watch|вахт|perimeter|спектр/.test(q)) {
    return "picture";
  }
  return null;
}

function panelOf(session: BridgeSessionValue): PanelType {
  return isPanel(session.panelType) ? session.panelType : "radar";
}

function tracksOf(session: BridgeSessionValue): PictureContact[] {
  if (session.live || !session.scenarioId) return [];
  return sceneTracks(panelOf(session), session.scenarioId, false);
}

function namedContact(session: BridgeSessionValue, message: string): PictureContact | undefined {
  const q = message.toLowerCase();
  return tracksOf(session).find((item) => {
    const tokens = [item.name, item.label, item.trackNo, item.object]
      .filter(Boolean)
      .map((value) => String(value).toLowerCase());
    return tokens.some((token) => token.length > 1 && q.includes(token));
  });
}

export function localWatchAnswer(
  session: BridgeSessionValue,
  locale: Locale,
  message: string,
): string {
  const desk = pilotDeskCopy(locale);
  const tracks = trackCopy(locale);
  const watch = buildPilotWatch(session, locale);
  if (session.live) return desk.liveEmpty;

  const named = namedContact(session, message);
  if (named) {
    return [speakContact(named, tracks), desk.youDecide].join(" ");
  }

  const kind = watchAskKind(message);
  if (kind === "accept") {
    const recommended =
      session.recommended ||
      SCENARIOS.find((item) => item.id === session.scenarioId)?.options?.find(
        (option) => option.recommended,
      )?.label ||
      desk.recommended;
    return [desk.acceptedLogged, recommended, desk.youDecide].filter(Boolean).join(" ");
  }
  if (kind === "decline") {
    return [desk.declinedLogged, desk.youDecide].join(" ");
  }
  if (kind === "notify") {
    return watch.commsLive
      ? [desk.alarmSent, desk.designatedAck].join(" ")
      : desk.liveComms;
  }
  if (kind === "starlink") {
    const lines = watch.starlink.map((link) => {
      if (link.state === "dark" || link.state === "offline") {
        return `${link.name}: ${desk.starlinkOffline}`;
      }
      return `${link.name} · ${link.state.toUpperCase()} · ${link.latencyMs} ms · ${link.downMbps}/${link.upMbps} Mbps · SNR ${link.snrDb}`;
    });
    return [desk.starlinkServices, ...lines, desk.youDecide].join(" ");
  }
  if (kind === "instruments") {
    const line = watch.instruments
      .map((item) => {
        const state =
          item.state === "watching"
            ? desk.watching
            : item.state === "degraded"
              ? desk.degraded
              : item.state === "dark"
                ? desk.dark
                : desk.quiet;
        return `${item.name}: ${state}`;
      })
      .join("; ");
    return [fillDesk(desk.seePicture, { panel: watch.panelLabel }), line, desk.youDecide].join(" ");
  }
  if (kind === "comms") {
    return watch.commsLive
      ? [desk.demoComms, desk.youDecide].join(" ")
      : desk.liveComms;
  }
  if (kind === "advice") {
    const action = watch.advice.find((card) => card.kind === "advice")?.body;
    const train = watch.advice.find((card) => card.kind === "train");
    return [action, train?.body, train?.steps?.slice(0, 3).join(" "), desk.youDecide]
      .filter(Boolean)
      .join(" ");
  }
  if (kind === "contacts") {
    const list = tracksOf(session);
    const primary = primaryTrack(list);
    if (!primary) return desk.noContacts;
    const others = list
      .filter((item) => item.id !== primary.id)
      .slice(0, 3)
      .map((item) => `${item.label} ${item.rangeText ?? item.dist}`)
      .join("; ");
    return [speakContact(primary, tracks), others, desk.youDecide].filter(Boolean).join(" ");
  }

  return watchReply(session, locale);
}
