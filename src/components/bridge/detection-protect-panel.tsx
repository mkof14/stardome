"use client";

import { HudPanel } from "@/components/bridge/hud-panel";
import { HudGlyph, type HudGlyphName } from "@/components/bridge/hud-icons";
import { cn } from "@/lib/cn";
import { watchLayersCopy } from "@/lib/i18n/watch-layers-copy";
import { useHud } from "@/lib/i18n/use-hud";
import { LAYER_IDS, layerStatus, type LayerId, type LayerStatus } from "@/lib/watch-layers";

const GLYPH: Record<LayerId, HudGlyphName> = {
  droneIntercept: "drone",
  pulseCannon: "pulse",
  laser: "laser",
  antiAir: "antiAir",
  antiSub: "sonar",
  elint: "spectrum",
};

function statusClass(status: LayerStatus) {
  if (status === "attention") return "text-attn";
  if (status === "ready") return "text-ok";
  if (status === "dark") return "text-bridge-dim";
  return "text-bridge-text";
}

function statusDot(status: LayerStatus) {
  if (status === "attention") return "bg-attn";
  if (status === "ready") return "bg-ok";
  if (status === "dark") return "bg-bridge-dim/50";
  return "bg-bridge-text/40";
}

export function DetectionProtectPanel({
  live,
  scenarioId,
}: {
  live: boolean;
  scenarioId: string;
}) {
  const { locale } = useHud();
  const copy = watchLayersCopy(locale);

  return (
    <HudPanel
      id="detection-protect-panel"
      testId="detection-protect-panel"
      className="scroll-mt-20"
      title={copy.detectTitle}
      glyph="shield"
    >
      <p className="font-body text-sm leading-relaxed text-bridge-dim">{copy.detectLead}</p>
      {live ? (
        <p className="mt-3 border border-bridge-line bg-bridge-bg px-3 py-2 font-body text-sm text-bridge-dim">
          {copy.liveEmpty}
        </p>
      ) : null}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {LAYER_IDS.map((id) => {
          const status = layerStatus(id, live, scenarioId);
          const layer = copy.layers[id];
          return (
            <article
              key={id}
              data-testid={`defense-layer-${id}`}
              data-status={status}
              className="rounded-2xl border border-bridge-line bg-bridge-bg px-3 py-3"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-bridge-panel text-bridge-text">
                  <HudGlyph name={GLYPH[id]} className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <p className="font-body text-base font-semibold text-bridge-text">{layer.name}</p>
                  <p className="mt-0.5 font-body text-sm text-bridge-dim">{layer.role}</p>
                </div>
              </div>
              <p className="mt-2 font-body text-sm leading-relaxed text-bridge-text/80">
                {copy.functionsLater}
              </p>
              <p className={cn("mt-2 inline-flex items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-wide", statusClass(status))}>
                <span className={cn("h-1.5 w-1.5 rounded-full", statusDot(status))} />
                {copy.status[status]}
              </p>
            </article>
          );
        })}
      </div>
    </HudPanel>
  );
}
