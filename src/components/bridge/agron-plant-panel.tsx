"use client";

import { HudPanel } from "@/components/bridge/hud-panel";
import { type HudGlyphName } from "@/components/bridge/hud-icons";
import { cn } from "@/lib/cn";
import { useBlackBox } from "@/lib/black-box";
import type { EquipmentId } from "@/lib/equipment";
import { useHud } from "@/lib/i18n/use-hud";
import { plantCopy } from "@/lib/i18n/plant-copy";
import { plantSections, type PlantSectionId, type PlantTone } from "@/lib/plant-metrics";
import type { PanelType } from "@/lib/scenarios";

const GLYPH: Record<PlantSectionId, HudGlyphName> = {
  container: "shield",
  power: "power",
  cooling: "sun",
  sensors: "radar",
  comms: "satellite",
  compute: "settings",
  storage: "drive",
};

const ANCHOR: Record<PlantSectionId, string> = {
  container: "plant-container-panel",
  power: "plant-power-panel",
  cooling: "plant-cooling-panel",
  sensors: "plant-sensors-panel",
  comms: "plant-comms-panel",
  compute: "plant-compute-panel",
  storage: "plant-storage-panel",
};

function toneClass(tone: PlantTone) {
  if (tone === "ok") return "text-ok";
  if (tone === "warn") return "text-attn";
  if (tone === "fail") return "text-crit";
  return "text-bridge-dim";
}

function toneDot(tone: PlantTone) {
  if (tone === "ok") return "bg-ok";
  if (tone === "warn") return "bg-attn";
  if (tone === "fail") return "bg-crit";
  return "bg-bridge-dim";
}

export function AgronPlantPanel({
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
  const { records } = useBlackBox();
  const last = records[0]?.timestamp;
  const sections = plantSections({
    live,
    faultId,
    panelType,
    scenarioId,
    blackBoxCount: records.length,
    lastBlackBox: last ? last.slice(11, 19) : undefined,
  });

  return (
    <div id="plant-root" data-testid="agron-plant" className="space-y-4">
      <p className="max-w-3xl font-body text-sm leading-relaxed text-bridge-dim">
        {live ? copy.liveLead : copy.plantLead}
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        {sections.map((section) => (
          <HudPanel
            key={section.id}
            id={ANCHOR[section.id]}
            testId={ANCHOR[section.id]}
            className="scroll-mt-20"
            title={copy.sections[section.id]}
            glyph={GLYPH[section.id]}
          >
            <ul className="divide-y divide-bridge-line">
              {section.rows.map((row) => (
                <li
                  key={row.id}
                  data-testid={`plant-row-${section.id}-${row.id}`}
                  className="flex items-start justify-between gap-3 py-2 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] text-bridge-text">{row.label}</p>
                    {row.note ? (
                      <p className="font-mono text-[10px] text-bridge-dim">{row.note}</p>
                    ) : null}
                  </div>
                  <div className={cn("shrink-0 text-end font-mono text-[11px]", toneClass(row.tone))}>
                    <p className="inline-flex items-center gap-1.5">
                      <span className={cn("h-1.5 w-1.5 rounded-full", toneDot(row.tone))} />
                      {copy.tones[row.tone]}
                    </p>
                    <p className="mt-0.5 text-bridge-text">{row.value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </HudPanel>
        ))}
      </div>
    </div>
  );
}
