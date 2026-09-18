"use client";

import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/cn";
import type { BridgeSessionValue } from "@/lib/bridge-session-types";
import { askPilot } from "@/lib/helm-events";
import { HexFrame, HudGlyph } from "@/components/bridge/hud-icons";
import { fillDesk, type PilotDeskCopy } from "@/lib/i18n/pilot-desk-copy";
import type { Locale } from "@/lib/i18n/locales";
import {
  buildPilotWatch,
  type PilotAdvice,
  type PilotInstrument,
} from "@/lib/pilot-watch";

export type PilotScreen = "chat" | "instruments" | "advice" | "comms";

function instrumentTone(state: PilotInstrument["state"]) {
  if (state === "watching") return "border-ok/70 text-ok";
  if (state === "degraded") return "border-attn text-attn";
  if (state === "dark") return "border-bridge-line text-bridge-dim/70";
  return "border-bridge-line text-bridge-dim";
}

function led(state: PilotInstrument["state"]) {
  if (state === "watching") return "bg-ok";
  if (state === "degraded") return "bg-attn";
  if (state === "dark") return "bg-bridge-dim/40";
  return "bg-bridge-dim";
}

function nowStamp() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function PilotDesk({
  session,
  locale,
  screen,
  highlight,
}: {
  session: BridgeSessionValue;
  locale: Locale;
  screen: PilotScreen;
  highlight?: PilotScreen | null;
}) {
  const watch = buildPilotWatch(session, locale);
  const { copy } = watch;
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [hiddenKinds, setHiddenKinds] = useState<string[]>([]);
  const [channel, setChannel] = useState<Channel>("watch");
  const [draft, setDraft] = useState("");
  const [lines, setLines] = useState<CommsLine[]>([]);
  const formId = useId();

  useEffect(() => {
    setLines([
      {
        id: "pilot-open",
        channel: "watch",
        from: "pilot",
        text: watch.commsLive ? copy.demoComms : copy.liveComms,
        time: nowStamp(),
      },
    ]);
    setDraft("");
    setHiddenKinds([]);
    setExpanded({});
  }, [watch.noteKey, watch.commsLive, copy.demoComms, copy.liveComms]);

  function postComms(text: string, nextChannel: Channel = channel) {
    const clean = text.trim();
    if (!clean) return;
    const stamp = nowStamp();
    const yours: CommsLine = {
      id: `you-${Date.now()}`,
      channel: nextChannel,
      from: "you",
      text: clean,
      time: stamp,
    };
    const reply: CommsLine = {
      id: `net-${Date.now()}-r`,
      channel: nextChannel,
      from: nextChannel === "support" ? "net" : "pilot",
      text: !watch.commsLive
        ? copy.liveComms
        : nextChannel === "alarm"
          ? copy.alarmSent
          : copy.posted,
      time: stamp,
    };
    setLines((current) => [...current, yours, reply]);
    setDraft("");
  }

  if (screen === "chat") return null;

  return (
    <div
      data-testid="pilot-raised-screens"
      data-screen={screen}
      className="min-h-0 flex-1 overflow-y-auto px-3 py-2"
    >
      {screen === "instruments" ? (
        <PilotRack
          testId="pilot-instruments"
          kicker={copy.instruments}
          title={copy.post}
          hot={highlight === "instruments"}
        >
          <div className="grid grid-cols-3 gap-1.5">
            {watch.instruments.map((item) => (
              <div
                key={item.id}
                data-testid={`pilot-instrument-${item.id}`}
                data-state={item.state}
                className={cn(
                  "border bg-bridge-bg px-2 py-2 font-mono text-[10px] leading-tight",
                  instrumentTone(item.state),
                )}
              >
                <span className={cn("mb-1 block h-1.5 w-1.5 rounded-full", led(item.state))} />
                <p className="truncate text-bridge-text">{item.name}</p>
                <p>
                  {item.state === "watching"
                    ? copy.watching
                    : item.state === "degraded"
                      ? copy.degraded
                      : item.state === "dark"
                        ? copy.dark
                        : copy.quiet}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-2 font-mono text-[10px] text-bridge-dim">
            {fillDesk(copy.seePicture, { panel: watch.panelLabel })}
          </p>
        </PilotRack>
      ) : null}

      {screen === "advice"
        ? watch.advice
            .filter((card) => !hiddenKinds.includes(card.kind))
            .map((card) => (
              <AdviceCard
                key={`${watch.noteKey}-${card.kind}-${card.title}`}
                card={card}
                copy={copy}
                hot={highlight === "advice"}
                expanded={Boolean(expanded[card.kind])}
                onExpand={() =>
                  setExpanded((current) => ({
                    ...current,
                    [card.kind]: !current[card.kind],
                  }))
                }
                onAsk={() => askPilot(card.body)}
                onClose={() => {
                  setHiddenKinds((current) =>
                    current.includes(card.kind) ? current : [...current, card.kind],
                  );
                }}
              />
            ))
        : null}

      {screen === "comms" ? (
        <PilotRack
          testId="pilot-comms"
          kicker={copy.comms}
          title={watch.commsLive ? copy.connected : copy.offline}
          hot={highlight === "comms"}
        >
          <div className="mb-2 flex gap-1">
            {(["watch", "support", "alarm"] as const).map((id) => (
              <button
                key={id}
                type="button"
                data-testid={`pilot-channel-${id}`}
                onClick={() => setChannel(id)}
                className={cn(
                  "flex-1 border px-1 py-1 font-mono text-[9px]",
                  channel === id
                    ? id === "alarm"
                      ? "border-crit bg-crit/15 text-crit"
                      : "border-orange bg-orange/10 text-orange"
                    : "border-bridge-line text-bridge-dim hover:text-bridge-text",
                )}
              >
                {id === "watch"
                  ? copy.channelWatch
                  : id === "support"
                    ? copy.channelSupport
                    : copy.channelAlarm}
              </button>
            ))}
          </div>
          <div
            data-testid="pilot-comms-log"
            className="mb-2 max-h-44 space-y-1.5 overflow-y-auto font-ui text-[11px] leading-relaxed text-bridge-text"
          >
            {lines
              .filter((line) => line.channel === channel)
              .map((line) => (
                <p
                  key={line.id}
                  className={cn(
                    "border-s-2 ps-2",
                    line.from === "you"
                      ? channel === "alarm"
                        ? "border-crit"
                        : "border-orange"
                      : line.from === "net"
                        ? "border-ok"
                        : channel === "alarm"
                          ? "border-crit/70"
                          : "border-bridge-line",
                  )}
                >
                  <span className="me-1.5 font-mono text-[9px] text-bridge-dim">
                    {line.time}
                  </span>
                  {line.text}
                </p>
              ))}
          </div>
          <form
            id={formId}
            className="flex gap-1"
            onSubmit={(event) => {
              event.preventDefault();
              postComms(draft);
            }}
          >
            <input
              data-testid="pilot-comms-input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={copy.typeComms}
              className="min-w-0 flex-1 border-b border-bridge-line bg-transparent px-0 py-1 font-ui text-xs text-bridge-text outline-none placeholder:text-bridge-dim focus:border-orange"
            />
            <button
              type="submit"
              data-testid="pilot-comms-send"
              className="bg-orange px-2 py-1 font-ui text-[10px] font-medium text-white"
            >
              {copy.sendComms}
            </button>
          </form>
          <button
            type="button"
            data-testid="pilot-notify"
            onClick={() => {
              setChannel("alarm");
              postComms(copy.notify, "alarm");
            }}
            className="mt-2 w-full border border-crit/50 px-2 py-1 font-mono text-[10px] text-crit hover:border-crit"
          >
            {copy.notify}
          </button>
        </PilotRack>
      ) : null}
    </div>
  );
}

type Channel = "watch" | "support" | "alarm";

type CommsLine = {
  id: string;
  channel: Channel;
  from: "pilot" | "you" | "net";
  text: string;
  time: string;
};

function PilotRack({
  kicker,
  title,
  children,
  testId,
  hot,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
  testId: string;
  hot?: boolean;
}) {
  return (
    <section
      data-testid={testId}
      data-demo-focus={hot ? "true" : undefined}
      className={cn(
        "border bg-bridge-bg text-bridge-text",
        hot ? "demo-focus-ring border-[#38BDF8]" : "border-bridge-line",
      )}
    >
      <div className={cn("h-[2px]", hot ? "bg-[#38BDF8]" : "bg-orange")} />
      <header className="flex items-center justify-between gap-2 border-b border-bridge-line px-3 py-2">
        <div className="min-w-0">
          <p
            className={cn(
              "font-mono text-[10px] tracking-wider",
              hot ? "text-[#38BDF8]" : "text-orange",
            )}
          >
            {kicker}
          </p>
          <p className="truncate font-heading text-base font-bold">{title}</p>
        </div>
      </header>
      <div className="px-3 py-2.5">{children}</div>
    </section>
  );
}

function AdviceCard({
  card,
  copy,
  expanded,
  hot,
  onExpand,
  onAsk,
  onClose,
}: {
  card: PilotAdvice;
  copy: PilotDeskCopy;
  expanded: boolean;
  hot?: boolean;
  onExpand: () => void;
  onAsk: () => void;
  onClose: () => void;
}) {
  const kicker =
    card.kind === "advice"
      ? copy.advice
      : card.kind === "train"
        ? copy.train
        : card.kind === "remind"
          ? copy.remind
          : copy.picture;
  return (
    <PilotRack
      testId={`pilot-card-${card.kind}`}
      kicker={kicker}
      title={card.title}
      hot={hot}
    >
      <p className={cn("text-xs leading-relaxed text-bridge-text/90", !expanded && "line-clamp-4")}>
        {card.body}
      </p>
      {expanded && card.steps?.length ? (
        <ol className="mt-2 list-decimal space-y-1 ps-4 text-xs text-bridge-dim">
          {card.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      ) : null}
      <div className="mt-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={onExpand}
          className="border border-bridge-line px-2 py-1 font-mono text-[9px] text-bridge-dim hover:text-bridge-text"
        >
          {expanded ? copy.collapse : copy.expand}
        </button>
        <button
          type="button"
          data-testid="pilot-card-ask"
          onClick={onAsk}
          className="border border-orange/40 px-2 py-1 font-mono text-[9px] text-orange hover:border-orange"
        >
          {copy.ask}
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label={copy.closeCard}
          className="border border-bridge-line px-2 py-1 font-mono text-[9px] text-bridge-dim hover:text-bridge-text"
        >
          {copy.closeCard}
        </button>
      </div>
    </PilotRack>
  );
}

export function PilotUnreadChip({
  label,
  onOpen,
}: {
  label: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      data-testid="pilot-unread"
      onClick={onOpen}
      className="pilot-card-in mb-2 max-w-[16rem] border border-orange/60 bg-bridge-panel px-3 py-2 text-start text-bridge-text shadow-lg"
    >
      <p className="flex items-center gap-2 font-mono text-[10px] text-orange">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange" />
        {label}
      </p>
    </button>
  );
}

export function PilotDeskBar({
  copy,
  screen,
  urgent,
  onScreen,
}: {
  copy: PilotDeskCopy;
  screen: PilotScreen;
  urgent: boolean;
  onScreen: (next: PilotScreen) => void;
}) {
  const buttons: Array<{
    id: PilotScreen;
    label: string;
    testId: string;
    hot: boolean;
    glyph: "talk" | "instruments" | "advice" | "comms";
  }> = [
    {
      id: "chat",
      label: copy.chat,
      testId: "pilot-screen-chat",
      hot: false,
      glyph: "talk",
    },
    {
      id: "instruments",
      label: copy.raiseInstruments,
      testId: "pilot-raise-instruments",
      hot: false,
      glyph: "instruments",
    },
    {
      id: "advice",
      label: copy.raiseAdvice,
      testId: "pilot-raise-advice",
      hot: urgent,
      glyph: "advice",
    },
    {
      id: "comms",
      label: copy.raiseComms,
      testId: "pilot-raise-comms",
      hot: urgent,
      glyph: "comms",
    },
  ];
  return (
    <div data-testid="pilot-desk-bar" className="grid grid-cols-4 gap-1">
      {buttons.map((item) => (
        <button
          key={item.id}
          type="button"
          data-testid={item.testId}
          aria-pressed={screen === item.id}
          onClick={() => onScreen(item.id)}
          className={cn(
            "flex items-center justify-center gap-1 border px-1 py-1 font-mono text-[9px] leading-tight",
            screen === item.id
              ? "border-orange bg-orange/10 text-orange"
              : item.hot
                ? "border-crit/50 text-crit"
                : "border-bridge-line text-bridge-dim hover:text-bridge-text",
          )}
        >
          <HexFrame active={screen === item.id} className="h-6 w-6">
            <HudGlyph name={item.glyph} className="h-3 w-3" />
          </HexFrame>
          <span className="hidden min-[22rem]:inline">{item.label}</span>
        </button>
      ))}
    </div>
  );
}

export function formatWatchTime() {
  return nowStamp();
}
