"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { askPilot, WATCH_COMMS_FOCUS_EVENT, type WatchCommsFocus } from "@/lib/helm-events";
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
    window.addEventListener(WATCH_COMMS_FOCUS_EVENT, onFocus);
    return () => window.removeEventListener(WATCH_COMMS_FOCUS_EVENT, onFocus);
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

        <ul className="mt-4 divide-y divide-bridge-line border border-bridge-line bg-bridge-panel">
          {rows.map((row) => {
            const hot = raised === row.id;
            return (
              <li
                key={row.id}
                data-testid={`watch-circuit-${row.id}`}
                data-party={row.party}
                className={cn(
                  "flex flex-col gap-2 px-3 py-3 sm:flex-row sm:items-center sm:justify-between",
                  hot && "bg-orange/5",
                )}
              >
                <div className="min-w-0">
                  <p className="font-ui text-sm font-semibold text-bridge-text">
                    {copy.party[row.party]}
                  </p>
                  <p className="font-mono text-[11px] text-bridge-dim">
                    {copy.bearer[row.bearer]}
                    <span className="ms-2 text-[10px] tracking-wider">
                      {live ? copy.liveEmpty : copy.demoPath}
                    </span>
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
                  className="shrink-0 border border-orange bg-orange px-3 py-1.5 font-ui text-xs font-medium text-white hover:bg-orange/90 disabled:border-bridge-line disabled:bg-transparent disabled:text-bridge-dim"
                >
                  {live ? copy.liveEmpty : hot ? copy.raised : copy.raise}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
