"use client";

import { HudPanel } from "@/components/bridge/hud-panel";
import { watchLayersCopy } from "@/lib/i18n/watch-layers-copy";
import { useHud } from "@/lib/i18n/use-hud";
import { primaryTrack, sceneTracks } from "@/lib/picture-scenes";
import type { PanelType } from "@/lib/scenarios";

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
          <article data-testid="geo-route-card" className="rounded-2xl border border-bridge-line bg-bridge-bg px-3 py-3">
            <p className="font-body text-base font-semibold text-bridge-text">{copy.routeTitle}</p>
            <p className="mt-1 font-body text-sm text-bridge-dim">{copy.routeLead}</p>
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
            <p className="mt-3 font-body text-sm text-bridge-text/80">{copy.functionsLater}</p>
          </article>
          <article data-testid="geo-analytics-card" className="rounded-2xl border border-bridge-line bg-bridge-bg px-3 py-3">
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
            <p className="mt-3 font-body text-sm text-bridge-text/80">{copy.functionsLater}</p>
          </article>
        </div>
      )}
    </HudPanel>
  );
}
