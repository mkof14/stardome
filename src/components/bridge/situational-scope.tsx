"use client";

import { useEffect, useMemo, useState } from "react";
import { BridgeRadar } from "@/components/bridge/bridge-radar";
import { ExpandablePicture } from "@/components/bridge/expandable-picture";
import { PerimeterView } from "@/components/bridge/perimeter-panel";
import { SonarView } from "@/components/bridge/sonar-panel";
import { SpectrumView } from "@/components/bridge/spectrum-panel";
import { TrackReadout, TrackSwitch, TrackTable } from "@/components/bridge/track-board";
import {
  primaryTrack,
  sceneTracks,
} from "@/lib/picture-scenes";
import type { PanelType } from "@/lib/scenarios";

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

  useEffect(() => {
    setSelectedId(primaryTrack(tracks)?.id ?? null);
  }, [tracks]);

  const selected = tracks.find((item) => item.id === selectedId) ?? primary;

  const view =
    empty || panelType === "radar" ? (
      <BridgeRadar
        scenarioId={empty ? "" : scenarioId}
        degraded={empty ? null : degraded}
        empty={empty}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
    ) : panelType === "sonar" ? (
      <SonarView scenarioId={scenarioId} selectedId={selectedId} onSelect={setSelectedId} />
    ) : panelType === "spectrum" ? (
      <SpectrumView scenarioId={scenarioId} />
    ) : (
      <PerimeterView scenarioId={scenarioId} />
    );

  return (
    <div data-testid="situational-scope" className="space-y-3">
      {empty ? null : (
        <TrackSwitch tracks={tracks} selectedId={selectedId} onSelect={setSelectedId} />
      )}
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.75fr)]">
        <ExpandablePicture>{view}</ExpandablePicture>
        <TrackReadout track={empty ? null : selected} kind={selected?.id === primary?.id ? "primary" : "selected"} />
      </div>
      {empty ? null : (
        <TrackTable tracks={tracks} selectedId={selectedId} onSelect={setSelectedId} />
      )}
    </div>
  );
}
