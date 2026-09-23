"use client";

import { useEffect, useState } from "react";
import { HudPanel } from "@/components/bridge/hud-panel";
import { cn } from "@/lib/cn";
import { focusWatchLayer, LAYER_FOCUS_EVENT, type LayerFocusDetail } from "@/lib/helm-events";
import { watchLayersCopy } from "@/lib/i18n/watch-layers-copy";
import { useHud } from "@/lib/i18n/use-hud";
import { SCOPE, primaryTrack, sceneTracks, type PictureContact } from "@/lib/picture-scenes";
import type { PanelType } from "@/lib/scenarios";

function GeoMini({ track }: { track: PictureContact }) {
  const sx = 80 + ((track.x - SCOPE.cx) / SCOPE.ring) * 62;
  const sy = 56 + ((track.y - SCOPE.cy) / SCOPE.ring) * 40;
  return (
    <svg
      viewBox="0 0 160 104"
      className="mt-3 h-24 w-full overflow-visible rounded-xl"
      aria-hidden
    >
      <rect width="160" height="104" fill="#052014" />
      <circle cx="80" cy="56" r="38" fill="none" stroke="#164E32" strokeWidth="1" />
      <circle cx="80" cy="56" r="20" fill="none" stroke="#164E32" strokeWidth="0.7" strokeDasharray="2 3" />
      <circle cx="80" cy="56" r="3.5" fill="#E7ECEF" />
      <path d="M80 48 L83 60 L80 57 L77 60 Z" fill="#E7ECEF" />
      <path
        className="geo-trail"
        d={`M80 56 L${sx} ${sy}`}
        fill="none"
        stroke="#F15A00"
        strokeWidth="1.6"
      />
      <circle cx={sx} cy={sy} r="4.5" fill="#F15A00" />
    </svg>
  );
}

export function GeoCenterPanel({
  live,
  panelType,
  scenarioId,
}: {
  live: boolean;
  panelType: PanelType;
  scenarioId: string;
}) {
  const { locale } = useHud();
  const copy = watchLayersCopy(locale);
  const tracks = sceneTracks(live ? "radar" : panelType, live ? "" : scenarioId, live);
  const track = primaryTrack(tracks);
  const [bound, setBound] = useState(false);

  useEffect(() => {
    function onFocus(event: Event) {
      const detail = (event as CustomEvent<LayerFocusDetail>).detail;
      setBound(!detail?.layer && Boolean(detail?.trackId));
    }
    window.addEventListener(LAYER_FOCUS_EVENT, onFocus);
    return () => window.removeEventListener(LAYER_FOCUS_EVENT, onFocus);
  }, []);

  useEffect(() => {
    setBound(false);
  }, [scenarioId, panelType, live]);

  function bindPicture() {
    focusWatchLayer(null, track?.id);
  }

  return (
    <HudPanel
      id="geo-center-panel"
      testId="geo-center-panel"
      className="scroll-mt-20"
      title={copy.geoTitle}
      glyph="compass"
    >
      <p className="font-body text-sm leading-relaxed text-bridge-dim">{copy.geoLead}</p>
      {live ? (
        <p
          data-testid="geo-center-live-empty"
          className="mt-3 border border-bridge-line bg-bridge-bg px-3 py-2 font-body text-sm text-bridge-dim"
        >
          {copy.liveEmpty}
        </p>
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <button
            type="button"
            data-testid="geo-route-card"
            onClick={bindPicture}
            className={cn(
              "rounded-2xl border bg-bridge-bg px-3 py-3 text-start",
              track ? "border-orange/40 shadow-[inset_3px_0_0_#F15A00]" : "border-bridge-line",
              bound && "ring-1 ring-orange/70",
            )}
          >
            <p className="font-body text-base font-semibold text-bridge-text">{copy.routeTitle}</p>
            <p className="mt-1 font-body text-sm text-bridge-dim">{copy.routeLead}</p>
            {track ? <GeoMini track={track} /> : null}
            {track ? (
              <dl className="mt-3 space-y-1.5 font-body text-sm text-bridge-text">
                <div className="flex justify-between gap-3">
                  <dt className="text-bridge-dim">{track.trackNo ?? track.id}</dt>
                  <dd className="font-semibold">{track.name}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-bridge-dim">{track.bearing != null ? `${track.bearing}°` : "—"}</dt>
                  <dd>{track.rangeText ?? track.dist}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-bridge-dim">{track.course != null ? `${track.course}°` : "—"}</dt>
                  <dd>{track.speedKn != null ? `${track.speedKn} kn` : "—"}</dd>
                </div>
              </dl>
            ) : (
              <p className="mt-3 font-body text-sm text-bridge-dim">{copy.noTrack}</p>
            )}
            <p className="mt-3 font-body text-sm leading-relaxed text-bridge-text/90">{copy.routeAction}</p>
          </button>
          <button
            type="button"
            data-testid="geo-analytics-card"
            onClick={bindPicture}
            className={cn(
              "rounded-2xl border bg-bridge-bg px-3 py-3 text-start",
              track ? "border-orange/40 shadow-[inset_3px_0_0_#F15A00]" : "border-bridge-line",
              bound && "ring-1 ring-orange/70",
            )}
          >
            <p className="font-body text-base font-semibold text-bridge-text">{copy.analyticsTitle}</p>
            <p className="mt-1 font-body text-sm text-bridge-dim">{copy.analyticsLead}</p>
            {track ? (
              <dl className="mt-3 space-y-1.5 font-body text-sm text-bridge-text">
                <div className="flex justify-between gap-3">
                  <dt className="text-bridge-dim">CPA</dt>
                  <dd className="font-semibold">{track.cpa ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-bridge-dim">TCPA</dt>
                  <dd>{track.tcpa ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-bridge-dim">{track.motion ?? "—"}</dt>
                  <dd>{track.threat ?? track.object ?? "—"}</dd>
                </div>
              </dl>
            ) : (
              <p className="mt-3 font-body text-sm text-bridge-dim">{copy.noTrack}</p>
            )}
            <p className="mt-3 font-body text-sm leading-relaxed text-bridge-text/90">{copy.analyticsAction}</p>
          </button>
        </div>
      )}
    </HudPanel>
  );
}
