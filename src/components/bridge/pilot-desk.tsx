"use client";

import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/cn";
import type { BridgeSessionValue } from "@/lib/bridge-session-types";
import { askPilot } from "@/lib/helm-events";
import { fillDesk, type PilotDeskCopy } from "@/lib/i18n/pilot-desk-copy";
import type { Locale } from "@/lib/i18n/locales";
import {
  buildPilotWatch,
  type PilotAdvice,
  type PilotInstrument,
} from "@/lib/pilot-watch";

export type RaisedScreens = {
  instruments: boolean;
  advice: boolean;
  comms: boolean;
};

type Channel = "watch" | "support" | "alarm";

type CommsLine = {
  id: string;
  channel: Channel;
  from: "pilot" | "you" | "net";
  text: string;
  time: string;
};

function instrumentTone(state: PilotInstrument["state"]) {
  if (state === "watching") return "border-ok/70 text-ok";
  if (state === "degraded") return "border-attn text-attn";
  if (state === "dark") return "border-sand/15 text-sand/35";
  return "border-sand/25 text-sand/70";
}

function led(state: PilotInstrument["state"]) {
  if (state === "watching") return "bg-ok";
  if (state === "degraded") return "bg-attn";
  if (state === "dark") return "bg-sand/25";
  return "bg-sand/40";
}

function nowStamp() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function PilotDesk({
  session,
  locale,
  raised,
  onRaised,
  docked,
  highlight,
  roomy,
}: {
  session: BridgeSessionValue;
  locale: Locale;
  raised: RaisedScreens;
  onRaised: (next: RaisedScreens) => void;
  docked: boolean;
  highlight?: "instruments" | "advice" | "comms" | null;
  roomy?: boolean;
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

  if (!raised.instruments && !raised.advice && !raised.comms) {
    return null;
  }

  const windows = (
    <div
      data-testid="pilot-raised-screens"
      className={cn(
        "flex flex-col gap-2",
        roomy
          ? "w-[min(24.5rem,calc(100vw-1.5rem))]"
          : "w-[min(20.5rem,calc(100vw-1.5rem))]",
        docked
          ? "absolute bottom-0 end-[calc(100%+0.75rem)] hidden max-h-[min(42rem,calc(100vh-5.5rem))] overflow-y-auto md:flex"
          : "mb-2 max-h-[min(26rem,46vh)] overflow-y-auto md:mb-0 md:absolute md:bottom-0 md:end-[calc(100%+0.75rem)] md:max-h-[min(44rem,calc(100vh-5.5rem))]",
      )}
    >
      {raised.instruments ? (
        <PilotFrame
          testId="pilot-instruments"
          kicker={copy.instruments}
          title={copy.post}
          hot={highlight === "instruments"}
          onClose={() => onRaised({ ...raised, instruments: false })}
          closeLabel={copy.closeCard}
        >
          <div className="grid grid-cols-3 gap-1.5">
            {watch.instruments.map((item) => (
              <div
                key={item.id}
                data-testid={`pilot-instrument-${item.id}`}
                data-state={item.state}
                className={cn(
                  "border px-2 py-2 font-mono text-[10px] leading-tight",
                  instrumentTone(item.state),
                )}
              >
                <span className={cn("mb-1 block h-1.5 w-1.5 rounded-full", led(item.state))} />
                <p className="truncate text-sand">{item.name}</p>
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
          <p className="mt-2 font-mono text-[10px] text-sand/55">
            {fillDesk(copy.seePicture, { panel: watch.panelLabel })}
          </p>
        </PilotFrame>
      ) : null}

      {raised.advice
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
                  setHiddenKinds((current) => {
                    const next = current.includes(card.kind)
                      ? current
                      : [...current, card.kind];
                    const remaining = watch.advice.filter(
                      (item) => !next.includes(item.kind),
                    );
                    if (remaining.length === 0) {
                      onRaised({ ...raised, advice: false });
                    }
                    return next;
                  });
                }}
              />
            ))
        : null}

      {raised.comms ? (
        <PilotFrame
          testId="pilot-comms"
          kicker={copy.comms}
          title={watch.commsLive ? copy.connected : copy.offline}
          hot={highlight === "comms"}
          onClose={() => onRaised({ ...raised, comms: false })}
          closeLabel={copy.closeCard}
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
                      : "border-orange text-orange"
                    : "border-sand/20 text-sand/60 hover:text-sand",
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
            className="mb-2 max-h-36 space-y-1.5 overflow-y-auto font-ui text-[11px] leading-relaxed text-sand/80"
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
                          : "border-sand/30",
                  )}
                >
                  <span className="me-1.5 font-mono text-[9px] text-sand/40">
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
              className="min-w-0 flex-1 border-b border-sand/25 bg-transparent px-0 py-1 font-ui text-xs text-sand outline-none placeholder:text-sand/35 focus:border-orange"
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
              onRaised({ ...raised, comms: true });
              setChannel("alarm");
              postComms(copy.notify, "alarm");
            }}
            className="mt-2 w-full border border-crit/50 px-2 py-1 font-mono text-[10px] text-crit hover:border-crit"
          >
            {copy.notify}
          </button>
        </PilotFrame>
      ) : null}
    </div>
  );

  return windows;
}

function PilotFrame({
  kicker,
  title,
  children,
  onClose,
  closeLabel,
  testId,
  hot,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  closeLabel: string;
  testId: string;
  hot?: boolean;
}) {
  return (
    <section
      data-testid={testId}
      data-demo-focus={hot ? "true" : undefined}
      className={cn(
        "pilot-card-in border bg-[#0b141c] text-sand shadow-[0_16px_40px_rgb(15_25_34/0.42)]",
        hot ? "demo-focus-ring border-[#38BDF8]" : "border-stroke",
      )}
    >
      <div className={cn("h-[2px]", hot ? "bg-[#38BDF8]" : "bg-orange")} />
      <header className="flex items-center justify-between gap-2 border-b border-sand/15 px-3 py-2">
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
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="px-1 font-mono text-xs text-sand/50 hover:text-sand"
        >
          ×
        </button>
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
    <PilotFrame
      testId={`pilot-card-${card.kind}`}
      kicker={kicker}
      title={card.title}
      hot={hot}
      onClose={onClose}
      closeLabel={copy.closeCard}
    >
      <p className={cn("text-xs leading-relaxed text-sand/80", !expanded && "line-clamp-4")}>
        {card.body}
      </p>
      {expanded && card.steps?.length ? (
        <ol className="mt-2 list-decimal space-y-1 ps-4 text-xs text-sand/75">
          {card.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      ) : null}
      <div className="mt-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={onExpand}
          className="border border-sand/20 px-2 py-1 font-mono text-[9px] text-sand/70 hover:text-sand"
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
      </div>
    </PilotFrame>
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
      className="pilot-card-in mb-2 max-w-[16rem] border border-orange/60 bg-[#0b141c] px-3 py-2 text-start shadow-lg"
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
  raised,
  urgent,
  onRaised,
}: {
  copy: PilotDeskCopy;
  raised: RaisedScreens;
  urgent: boolean;
  onRaised: (next: RaisedScreens) => void;
}) {
  const buttons: Array<{
    id: keyof RaisedScreens;
    label: string;
    testId: string;
    hot: boolean;
  }> = [
    {
      id: "instruments",
      label: copy.raiseInstruments,
      testId: "pilot-raise-instruments",
      hot: false,
    },
    {
      id: "advice",
      label: copy.raiseAdvice,
      testId: "pilot-raise-advice",
      hot: urgent,
    },
    {
      id: "comms",
      label: copy.raiseComms,
      testId: "pilot-raise-comms",
      hot: urgent,
    },
  ];
  return (
    <div data-testid="pilot-desk-bar" className="flex flex-wrap gap-1">
      {buttons.map((item) => (
        <button
          key={item.id}
          type="button"
          data-testid={item.testId}
          aria-pressed={raised[item.id]}
          onClick={() => onRaised({ ...raised, [item.id]: !raised[item.id] })}
          className={cn(
            "border px-1.5 py-0.5 font-mono text-[9px]",
            raised[item.id]
              ? "border-orange text-orange"
              : item.hot
                ? "border-crit/50 text-crit"
                : "border-sand/20 text-sand/60 hover:text-sand",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function formatWatchTime() {
  return nowStamp();
}
