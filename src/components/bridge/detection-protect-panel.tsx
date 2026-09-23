"use client";

import { useEffect, useState } from "react";
import { HudPanel } from "@/components/bridge/hud-panel";
import { HudGlyph, type HudGlyphName } from "@/components/bridge/hud-icons";
import { cn } from "@/lib/cn";
import { focusWatchLayer, LAYER_FOCUS_EVENT, type LayerFocusDetail } from "@/lib/helm-events";
import { watchLayersCopy } from "@/lib/i18n/watch-layers-copy";
import { useHud } from "@/lib/i18n/use-hud";
import { SCOPE, sceneTracks, type PictureContact } from "@/lib/picture-scenes";
import type { PanelType } from "@/lib/scenarios";
import {
  LAYER_IDS,
  layerStatus,
  tracksForLayer,
  type LayerId,
  type LayerStatus,
} from "@/lib/watch-layers";

function LayerMini({ tracks }: { tracks: PictureContact[] }) {
  if (!tracks.length) return null;
  return (
    <svg
      viewBox="0 0 160 72"
      className="mt-2 h-16 w-full overflow-visible rounded-xl"
      aria-hidden
    >
      <rect width="160" height="72" fill="#052014" />
      <circle cx="80" cy="36" r="26" fill="none" stroke="#164E32" strokeWidth="1" />
      <circle cx="80" cy="36" r="13" fill="none" stroke="#164E32" strokeWidth="0.7" strokeDasharray="2 3" />
      <circle cx="80" cy="36" r="2.5" fill="#E7ECEF" />
      {tracks.slice(0, 4).map((track) => {
        const sx = 80 + ((track.x - SCOPE.cx) / SCOPE.ring) * 24;
        const sy = 36 + ((track.y - SCOPE.cy) / SCOPE.ring) * 24;
        return (
          <g key={track.id}>
            <path
              className="geo-trail"
              d={`M80 36 L${sx} ${sy}`}
              fill="none"
              stroke="#F15A00"
              strokeWidth="1.4"
            />
            <circle cx={sx} cy={sy} r="3.4" fill="#F15A00" />
          </g>
        );
      })}
    </svg>
  );
}

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
  panelType,
}: {
  live: boolean;
  scenarioId: string;
  panelType: PanelType;
}) {
  const { locale } = useHud();
  const copy = watchLayersCopy(locale);
  const tracks = sceneTracks(live ? "radar" : panelType, live ? "" : scenarioId, live);
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    function onFocus(event: Event) {
      setFocused((event as CustomEvent<LayerFocusDetail>).detail?.layer ?? null);
    }
    window.addEventListener(LAYER_FOCUS_EVENT, onFocus);
    return () => window.removeEventListener(LAYER_FOCUS_EVENT, onFocus);
  }, []);

  useEffect(() => {
    setFocused(null);
  }, [scenarioId, panelType, live]);

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
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {LAYER_IDS.map((id) => {
          const status = layerStatus(id, live, scenarioId, panelType);
          const layer = copy.layers[id];
          const bound = tracksForLayer(tracks, id);
          const first = bound[0];
          const hot = status === "attention";
          const active = focused === id;
          return (
            <button
              key={id}
              type="button"
              data-testid={`defense-layer-${id}`}
              data-status={status}
              data-focused={active ? "true" : undefined}
              onClick={() => focusWatchLayer(id, first?.id)}
              className={cn(
                "rounded-2xl border bg-bridge-bg px-3 py-3 text-start",
                hot
                  ? "layer-card-hot border-orange/50"
                  : status === "ready"
                    ? "border-ok/35 shadow-[inset_3px_0_0_rgb(51_211_166)]"
                    : "border-bridge-line",
                active && "ring-1 ring-orange/70",
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                    hot ? "bg-orange/15 text-orange" : "bg-bridge-panel text-bridge-text",
                  )}
                >
                  <HudGlyph name={GLYPH[id]} className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <p className="font-body text-base font-semibold text-bridge-text">{layer.name}</p>
                  <p className="mt-0.5 font-body text-sm text-bridge-dim">{layer.role}</p>
                </div>
              </div>
              <p className="mt-2 font-body text-sm leading-relaxed text-bridge-text/90">{layer.action}</p>
              {bound.length ? <LayerMini tracks={bound} /> : null}
              <p className="mt-2 font-body text-xs font-semibold uppercase tracking-wide text-orange">
                {first
                  ? `${copy.onPicture} · ${first.trackNo ?? first.id} · ${first.rangeText ?? first.dist}`
                  : copy.boundNone}
              </p>
              <p className={cn("mt-2 inline-flex items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-wide", statusClass(status))}>
                <span className={cn("h-1.5 w-1.5 rounded-full", statusDot(status))} />
                {copy.status[status]}
              </p>
            </button>
          );
        })}
      </div>
    </HudPanel>
  );
}
