"use client";

import { useEffect, useState } from "react";
import { ChamferFrame, HudGlyph, PilotHex, type HudGlyphName } from "@/components/bridge/hud-icons";
import { HudFrame } from "@/components/bridge/hud-visor";
import { cn } from "@/lib/cn";
import { askPilot, CLEAR_SCREENS_EVENT, WATCH_COMMS_FOCUS_EVENT, type WatchCommsFocus } from "@/lib/helm-events";
import { watchCommsCopy } from "@/lib/i18n/watch-comms-copy";
import { useHud } from "@/lib/i18n/use-hud";
import { useAppMode } from "@/lib/mode";
import { WATCH_CIRCUITS, type WatchBearer, type WatchParty } from "@/lib/watch-comms";

const BEARER_GLYPH: Record<WatchBearer, HudGlyphName> = {
  shipPhone: "phone",
  mobile: "mobile",
  localPhone: "phone",
  personalRadio: "radio",
  vesselRadio: "radio",
  vhf: "antenna",
  satcomVoice: "satellite",
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
  const copy = watchCommsCopy(locale);
  const [focus, setFocus] = useState<WatchParty | "all">("all");
  const [raised, setRaised] = useState<string | null>(null);

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
    }
    window.addEventListener(WATCH_COMMS_FOCUS_EVENT, onFocus);
    window.addEventListener(CLEAR_SCREENS_EVENT, onClear);
    return () => {
      window.removeEventListener(WATCH_COMMS_FOCUS_EVENT, onFocus);
      window.removeEventListener(CLEAR_SCREENS_EVENT, onClear);
    };
  }, []);

  const rows = WATCH_CIRCUITS.filter((row) => focus === "all" || row.party === focus);

  return (
    <section
      id="watch-comms-panel"
      data-testid="watch-comms-panel"
      className="border-t border-bridge-line bg-bridge-bg px-4 py-8 md:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[10px] tracking-[0.22em] text-bridge-dim">{copy.kicker}</p>
        <h2 className="mt-1 flex items-center gap-2 font-ui text-xl font-bold tracking-wide text-bridge-text">
          <PilotHex glow />
          {copy.title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-bridge-dim">
          {live ? copy.leadLive : copy.lead}
        </p>

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
                  "inline-flex items-center gap-1.5 px-2 py-1 font-ui text-[11px]",
                  focus === item.id
                    ? "text-orange"
                    : "text-bridge-dim hover:text-orange",
                )}
              >
                <ChamferFrame active={focus === item.id} className="h-7 w-7">
                  <HudGlyph name={item.glyph} className="h-3 w-3" />
                </ChamferFrame>
                {label}
              </button>
            );
          })}
        </div>

        <HudFrame variant="window" className="mt-4 bg-bridge-panel" status={live ? "STBY" : "CIRCUITS"}>
          <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-2 bg-bridge-bg px-4 py-2 font-mono text-[9px] tracking-[0.16em] text-bridge-dim">
            <span>CH</span>
            <span>CIRCUIT</span>
            <span>PTT</span>
          </div>
          <ul className="divide-y divide-bridge-line pb-6">
            {rows.map((row, index) => {
              const hot = raised === row.id;
              const alarm = row.bearer === "alarmNet";
              return (
                <li
                  key={row.id}
                  data-testid={`watch-circuit-${row.id}`}
                  data-party={row.party}
                  className={cn(
                    "grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-2 px-4 py-2.5",
                    hot && "bg-orange/5",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <ChamferFrame
                      active={hot}
                      className={cn("h-7 w-7", alarm ? "text-crit" : "text-orange")}
                    >
                      <HudGlyph name={BEARER_GLYPH[row.bearer]} className="h-3 w-3" />
                    </ChamferFrame>
                    <span className="font-mono text-[11px] tabular-nums text-bridge-dim">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-ui text-sm font-semibold text-bridge-text">
                      {copy.party[row.party]}
                      <span className="ms-2 font-mono text-[10px] font-normal tracking-wider text-bridge-dim">
                        {copy.bearer[row.bearer]}
                      </span>
                    </p>
                    <p className="font-mono text-[10px] tracking-wider text-bridge-dim">
                      {live ? "STBY" : hot ? "TX" : "RX"}
                      <span className="ms-2">{live ? copy.liveEmpty : copy.demoPath}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    data-testid={`watch-circuit-raise-${row.id}`}
                    disabled={live}
                    onClick={() => {
                      setRaised(row.id);
                      askPilot(copy.ask[row.party]);
                    }}
                    className={cn(
                      "shrink-0 border px-3 py-1.5 font-mono text-[11px] font-medium tracking-wider",
                      live
                        ? "border-bridge-line text-bridge-dim"
                        : alarm
                          ? "border-crit bg-crit text-white hover:bg-crit/90"
                          : "border-orange bg-orange text-white hover:bg-orange/90",
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
