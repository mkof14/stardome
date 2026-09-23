"use client";

import { cn } from "@/lib/cn";
import type { EquipmentId } from "@/lib/equipment";
import { useHud } from "@/lib/i18n/use-hud";
import { plantCopy } from "@/lib/i18n/plant-copy";
import type { PanelType } from "@/lib/scenarios";
import {
  KIT_KINDS,
  WATCH_KIT,
  kitReading,
  kitStatus,
  type KitStatus,
} from "@/lib/watch-kit";

function statusClass(status: KitStatus) {
  if (status === "watching") return "text-ok";
  if (status === "degraded") return "text-attn";
  if (status === "offline") return "text-crit";
  return "text-bridge-dim";
}

function statusDot(status: KitStatus) {
  if (status === "watching") return "bg-ok";
  if (status === "degraded") return "bg-attn";
  if (status === "offline") return "bg-crit";
  return "bg-bridge-dim";
}

export function WatchKitPanel({
  live,
  faultId,
  panelType,
  scenarioId,
}: {
  live: boolean;
  faultId: EquipmentId | null;
  panelType: PanelType;
  scenarioId: string;
}) {
  const { locale } = useHud();
  const copy = plantCopy(locale);
  const ctx = { live, faultId, panelType, scenarioId };

  return (
    <div data-testid="watch-kit" className="space-y-4">
      <p className="font-body text-xs leading-relaxed text-bridge-dim">{copy.kitLead}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {KIT_KINDS.map((kind) => (
          <div key={kind} className="border border-bridge-line bg-bridge-bg/40">
            <p className="border-b border-bridge-line px-2.5 py-1.5 font-mono text-[9px] tracking-[0.18em] text-orange">
              {copy.kinds[kind]}
            </p>
            <ul className="divide-y divide-bridge-line/70">
              {WATCH_KIT.filter((item) => item.kind === kind).map((item) => {
                const status = kitStatus(item, ctx);
                return (
                  <li
                    key={item.id}
                    data-testid={`kit-row-${item.id}`}
                    className="flex items-start justify-between gap-2 px-2.5 py-1.5"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-[11px] text-bridge-text">{item.name}</p>
                      <p className="truncate font-mono text-[10px] text-bridge-dim">
                        {kitReading(item, ctx)}
                      </p>
                    </div>
                    <span className={cn("inline-flex shrink-0 items-center gap-1.5 font-mono text-[9px] tracking-wider", statusClass(status))}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", statusDot(status))} />
                      {copy.status[status]}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
