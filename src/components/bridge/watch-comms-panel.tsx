"use client";

import { useEffect, useState } from "react";
import { HudGlyph, IconWell, type HudGlyphName } from "@/components/bridge/hud-icons";
import { HudFrame } from "@/components/bridge/hud-visor";
import { StarlinkPanel } from "@/components/bridge/starlink-panel";
import { cn } from "@/lib/cn";
import {
  askPilot,
  CLEAR_SCREENS_EVENT,
  PILOT_ADVICE_DECISION_EVENT,
  PILOT_NOTIFY_EVENT,
  WATCH_COMMS_FOCUS_EVENT,
  type AdviceDecisionDetail,
  type WatchCommsFocus,
} from "@/lib/helm-events";
import { pilotDeskCopy } from "@/lib/i18n/pilot-desk-copy";
import { watchCommsCopy } from "@/lib/i18n/watch-comms-copy";
import { useHud } from "@/lib/i18n/use-hud";
import { useAppMode } from "@/lib/mode";
import { useBridgeSession } from "@/lib/bridge-session";
import { STARLINK_HUES, starlinkIdForBearer, starlinkLinks } from "@/lib/starlink";
import { WATCH_CIRCUITS, type WatchBearer, type WatchParty } from "@/lib/watch-comms";

const BEARER_GLYPH: Record<WatchBearer, HudGlyphName> = {
  shipPhone: "phone",
  mobile: "mobile",
  localPhone: "phone",
  personalRadio: "radio",
  vesselRadio: "radio",
  vhf: "antenna",
  satcomVoice: "satellite",
  starlinkMaritime: "satellite",
  starlinkPriority: "satellite",
  supportDesk: "support",
  alarmNet: "alert",
};

const FILTERS: Array<{ id: WatchParty | "all"; glyph: HudGlyphName }> = [
  { id: "all", glyph: "all" },
  { id: "captain", glyph: "captain" },
  { id: "designated", glyph: "person" },
  { id: "watch", glyph: "radio" },
  { id: "support", glyph: "support" },
];

export function WatchCommsPanel() {
  const { locale } = useHud();
  const { live } = useAppMode();
  const session = useBridgeSession();
  const copy = watchCommsCopy(locale);
  const [focus, setFocus] = useState<WatchParty | "all">("all");
  const [raised, setRaised] = useState<string | null>(null);
  const [ack, setAck] = useState<string | null>(null);
  const desk = pilotDeskCopy(locale);
  const links = starlinkLinks({
    live,
    scenarioId: session.scenarioId,
    faultId: session.faultId,
  });

  useEffect(() => {
    function onFocus(event: Event) {
      const party = (event as CustomEvent<WatchCommsFocus>).detail?.party;
      if (party === "captain" || party === "designated" || party === "watch" || party === "support") {
        setFocus(party);
      } else {
        setFocus("all");
      }
    }
    function onClear() {
      setRaised(null);
      setFocus("all");
      setAck(null);
    }
    function onNotify() {
      if (live) return;
      setFocus("designated");
      setRaised("designated-local-phone");
      setAck(desk.designatedSeen);
    }
    function onDecision(event: Event) {
      if (live) return;
      const detail = (event as CustomEvent<AdviceDecisionDetail>).detail;
      if (detail?.decision !== "accept" && detail?.decision !== "decline") return;
      setFocus("designated");
      setRaised("designated-local-phone");
      setAck(
        detail.decision === "accept" ? desk.designatedSeen : desk.declinedLogged,
      );
    }
    window.addEventListener(WATCH_COMMS_FOCUS_EVENT, onFocus);
    window.addEventListener(CLEAR_SCREENS_EVENT, onClear);
    window.addEventListener(PILOT_NOTIFY_EVENT, onNotify);
    window.addEventListener(PILOT_ADVICE_DECISION_EVENT, onDecision);
    return () => {
      window.removeEventListener(WATCH_COMMS_FOCUS_EVENT, onFocus);
      window.removeEventListener(CLEAR_SCREENS_EVENT, onClear);
      window.removeEventListener(PILOT_NOTIFY_EVENT, onNotify);
      window.removeEventListener(PILOT_ADVICE_DECISION_EVENT, onDecision);
    };
  }, [desk.designatedSeen, desk.declinedLogged, live]);

  const rows = WATCH_CIRCUITS.filter((row) => focus === "all" || row.party === focus);

  return (
    <section
      id="watch-comms-panel"
      data-testid="watch-comms-panel"
      className="border-t border-bridge-line bg-bridge-bg px-4 py-8 md:px-8"
    >
      <div data-speak-surface="comms" className="mx-auto max-w-6xl rounded-2xl p-1">
        <p className="font-body text-xs font-medium text-bridge-dim">{copy.kicker}</p>
        <h2 className="mt-1 font-body text-xl font-semibold tracking-tight text-bridge-text">
          {copy.title}
        </h2>
        <p className="mt-2 max-w-3xl font-body text-sm text-bridge-dim">
          {live ? copy.leadLive : copy.lead}
        </p>

        <div className="mt-5" data-testid="watch-comms-starlink">
          <p className="mb-2 font-body text-sm text-bridge-dim">
            {live ? copy.starlinkLeadLive : copy.starlinkLead}
          </p>
          <StarlinkPanel />
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {FILTERS.map((item) => {
            const label = item.id === "all" ? copy.title : copy.party[item.id];
            return (
              <button
                key={item.id}
                type="button"
                data-testid={`watch-comms-filter-${item.id}`}
                aria-pressed={focus === item.id}
                onClick={() => setFocus(item.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl px-2 py-1.5 font-body text-sm",
                  focus === item.id
                    ? "bg-orange/10 text-orange"
                    : "text-bridge-dim hover:bg-bridge-panel hover:text-orange",
                )}
              >
                <IconWell active={focus === item.id} className="h-7 w-7">
                  <HudGlyph name={item.glyph} className="h-3.5 w-3.5" />
                </IconWell>
                {label}
              </button>
            );
          })}
        </div>

        {ack && !live ? (
          <p
            data-testid="watch-comms-ack"
            className="mt-4 rounded-xl border border-ok/40 bg-ok/10 px-3 py-2 font-body text-sm text-ok"
          >
            {ack}
          </p>
        ) : null}

        <HudFrame variant="window" className="mt-4 bg-bridge-panel px-1 pt-3" status={live ? "STBY" : "CIRCUITS"}>
          <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-2 bg-bridge-bg px-4 py-2 font-body text-xs text-bridge-dim">
            <span>CH</span>
            <span>CIRCUIT</span>
            <span>PTT</span>
          </div>
          <ul className="divide-y divide-bridge-line pb-6">
            {rows.map((row, index) => {
              const hot = raised === row.id;
              const alarm = row.bearer === "alarmNet";
              const slId = starlinkIdForBearer(row.bearer);
              const sl = slId ? links.find((link) => link.id === slId) : undefined;
              const hue = slId ? STARLINK_HUES[slId] : undefined;
              return (
                <li
                  key={row.id}
                  data-testid={`watch-circuit-${row.id}`}
                  data-party={row.party}
                  data-starlink={slId ?? undefined}
                  className={cn(
                    "grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-2 px-4 py-2.5",
                    hot && "bg-orange/5",
                  )}
                  style={hue ? { boxShadow: `inset 3px 0 0 ${hue}` } : undefined}
                >
                  <div className="flex items-center gap-2">
                    <IconWell
                      active={hot}
                      className={cn("h-7 w-7", alarm ? "text-crit" : "text-orange")}
                    >
                      <HudGlyph name={BEARER_GLYPH[row.bearer]} className="h-3.5 w-3.5" />
                    </IconWell>
                    <span className="font-body text-xs tabular-nums text-bridge-dim">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-body text-sm font-semibold text-bridge-text">
                      {copy.party[row.party]}
                      <span
                        className="ms-2 font-body text-xs font-normal"
                        style={hue ? { color: hue } : undefined}
                      >
                        {copy.bearer[row.bearer]}
                      </span>
                    </p>
                    <p className="font-body text-xs text-bridge-dim">
                      {live ? "STBY" : hot ? "TX" : "RX"}
                      <span className="ms-2">{live ? copy.liveEmpty : copy.demoPath}</span>
                      {sl ? (
                        <span className="ms-2 font-mono tracking-wide" style={hue ? { color: hue } : undefined}>
                          {sl.state.toUpperCase()}
                          {sl.latencyMs !== "—" ? ` · ${sl.latencyMs} ms` : ""}
                          {sl.downMbps !== "—" ? ` · ${sl.downMbps}/${sl.upMbps} Mbps` : ""}
                        </span>
                      ) : null}
                    </p>
                  </div>
                  <button
                    type="button"
                    data-testid={`watch-circuit-raise-${row.id}`}
                    disabled={live}
                    onClick={() => {
                      setRaised(row.id);
                      if (row.party === "designated" || row.bearer === "alarmNet") {
                        setAck(desk.designatedSeen);
                      }
                      askPilot(copy.ask[row.party]);
                    }}
                    className={cn(
                      "shrink-0 rounded-xl px-3 py-1.5 font-body text-sm font-medium",
                      live
                        ? "border border-bridge-line text-bridge-dim"
                        : alarm
                          ? "bg-crit text-white hover:bg-crit/90"
                          : "bg-orange text-white hover:bg-orange/90",
                    )}
                  >
                    {live ? copy.liveEmpty : hot ? copy.raised : copy.raise}
                  </button>
                </li>
              );
            })}
          </ul>
        </HudFrame>
      </div>
    </section>
  );
}
