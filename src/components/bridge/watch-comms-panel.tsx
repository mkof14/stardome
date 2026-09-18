"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { askPilot, CLEAR_SCREENS_EVENT, WATCH_COMMS_FOCUS_EVENT, type WatchCommsFocus } from "@/lib/helm-events";
import { watchCommsCopy } from "@/lib/i18n/watch-comms-copy";
import { useHud } from "@/lib/i18n/use-hud";
import { useAppMode } from "@/lib/mode";
import { WATCH_CIRCUITS, type WatchParty } from "@/lib/watch-comms";

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
        <h2 className="mt-1 font-ui text-xl font-bold tracking-wide text-bridge-text">
          {copy.title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-bridge-dim">
          {live ? copy.leadLive : copy.lead}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {(
            [
              ["all", copy.title],
              ["captain", copy.party.captain],
              ["designated", copy.party.designated],
              ["watch", copy.party.watch],
              ["support", copy.party.support],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              data-testid={`watch-comms-filter-${id}`}
              aria-pressed={focus === id}
              onClick={() => setFocus(id)}
              className={cn(
                "border px-2 py-1 font-ui text-[11px]",
                focus === id
                  ? "border-orange bg-orange/10 text-orange"
                  : "border-bridge-line text-bridge-dim hover:border-orange hover:text-orange",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4 overflow-hidden border border-bridge-line bg-bridge-panel">
          <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-2 border-b border-bridge-line bg-bridge-bg px-3 py-1.5 font-mono text-[9px] tracking-[0.16em] text-bridge-dim">
            <span>CH</span>
            <span>CIRCUIT</span>
            <span>PTT</span>
          </div>
          <ul className="divide-y divide-bridge-line">
            {rows.map((row, index) => {
              const hot = raised === row.id;
              const alarm = row.bearer === "alarmNet";
              return (
                <li
                  key={row.id}
                  data-testid={`watch-circuit-${row.id}`}
                  data-party={row.party}
                  className={cn(
                    "grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-2 px-3 py-2.5",
                    hot && "bg-orange/5",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        live
                          ? "bg-bridge-dim/50"
                          : hot
                            ? alarm
                              ? "bg-crit"
                              : "bg-ok"
                            : "bg-attn/80",
                      )}
                      aria-hidden
                    />
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
        </div>
      </div>
    </section>
  );
}
