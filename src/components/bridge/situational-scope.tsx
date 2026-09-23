"use client";

import { useEffect, useMemo, useState } from "react";
import { BridgeRadar } from "@/components/bridge/bridge-radar";
import { ExpandablePicture } from "@/components/bridge/expandable-picture";
import { PerimeterView } from "@/components/bridge/perimeter-panel";
import { SonarView } from "@/components/bridge/sonar-panel";
import { SpectrumView } from "@/components/bridge/spectrum-panel";
import { TrackReadout, TrackSwitch, TrackTable } from "@/components/bridge/track-board";
import { LAYER_FOCUS_EVENT, type LayerFocusDetail } from "@/lib/helm-events";
import {
  primaryTrack,
  sceneTracks,
} from "@/lib/picture-scenes";
import type { PanelType } from "@/lib/scenarios";
import {
  isLayerId,
  layerMatchesTrack,
  type LayerId,
} from "@/lib/watch-layers";

type SituationalScopeProps = {
  panelType: PanelType;
  scenarioId: string;
  empty?: boolean;
  degraded?: "radar" | "ais" | null;
};

export function SituationalScope({
  panelType,
  scenarioId,
  empty,
  degraded,
}: SituationalScopeProps) {
  const tracks = useMemo(
    () => sceneTracks(empty ? "radar" : panelType, empty ? "" : scenarioId, empty),
    [panelType, scenarioId, empty],
  );
  const primary = primaryTrack(tracks);
  const [selectedId, setSelectedId] = useState<string | null>(primary?.id ?? null);
  const [focusedLayer, setFocusedLayer] = useState<LayerId | null>(null);

  useEffect(() => {
    setSelectedId(primaryTrack(tracks)?.id ?? null);
    setFocusedLayer(null);
  }, [tracks]);

  useEffect(() => {
    function onFocus(event: Event) {
      const detail = (event as CustomEvent<LayerFocusDetail>).detail;
      const layer = isLayerId(detail?.layer) ? detail.layer : null;
      setFocusedLayer(layer);
      if (detail?.trackId && tracks.some((contact) => contact.id === detail.trackId)) {
        setSelectedId(detail.trackId);
        return;
      }
      if (layer) {
        const hit = tracks.find((contact) => layerMatchesTrack(layer, contact));
        if (hit) setSelectedId(hit.id);
      }
    }
    window.addEventListener(LAYER_FOCUS_EVENT, onFocus);
    return () => window.removeEventListener(LAYER_FOCUS_EVENT, onFocus);
  }, [tracks]);

  const focusIds = focusedLayer
    ? tracks.filter((contact) => layerMatchesTrack(focusedLayer, contact)).map((contact) => contact.id)
    : [];

  function handleSelect(id: string) {
    setSelectedId(id);
    if (focusedLayer) {
      const contact = tracks.find((item) => item.id === id);
      if (!contact || !layerMatchesTrack(focusedLayer, contact)) {
        setFocusedLayer(null);
      }
    }
  }

  const selected = tracks.find((item) => item.id === selectedId) ?? primary;

  const view =
    empty || panelType === "radar" ? (
      <BridgeRadar
        scenarioId={empty ? "" : scenarioId}
        degraded={empty ? null : degraded}
        empty={empty}
        selectedId={selectedId}
        focusIds={focusIds}
        onSelect={handleSelect}
      />
    ) : panelType === "sonar" ? (
      <SonarView
        scenarioId={scenarioId}
        selectedId={selectedId}
        focusIds={focusIds}
        onSelect={handleSelect}
      />
    ) : panelType === "spectrum" ? (
      <SpectrumView scenarioId={scenarioId} />
    ) : (
      <PerimeterView scenarioId={scenarioId} />
    );

  return (
    <div data-testid="situational-scope" className="space-y-3">
      {empty ? null : (
        <TrackSwitch tracks={tracks} selectedId={selectedId} onSelect={handleSelect} />
      )}
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.75fr)]">
        <ExpandablePicture>{view}</ExpandablePicture>
        <TrackReadout track={empty ? null : selected} kind={selected?.id === primary?.id ? "primary" : "selected"} />
      </div>
      {empty ? null : (
        <TrackTable tracks={tracks} selectedId={selectedId} onSelect={handleSelect} />
      )}
    </div>
  );
}
