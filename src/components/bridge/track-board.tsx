"use client";

import { cn } from "@/lib/cn";
import { useHud } from "@/lib/i18n/use-hud";
import { trackCopy } from "@/lib/i18n/track-copy";
import {
  primaryTrack,
  toneColor,
  type IdStatus,
  type PictureContact,
} from "@/lib/picture-scenes";

function statusLabel(status: IdStatus | undefined, copy: ReturnType<typeof trackCopy>) {
  if (status === "identified") return copy.identified;
  if (status === "classified") return copy.classified;
  return copy.unidentified;
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 border border-[#1a3d32] bg-[#06150f]/80 px-2 py-1.5">
      <p className="font-mono text-[8px] tracking-[0.18em] text-[#6a9a7c]">{label}</p>
      <p className="truncate font-mono text-[12px] text-[#d7efe0]">{value}</p>
    </div>
  );
}

export function TrackReadout({
  track,
  kind,
}: {
  track: PictureContact | null;
  kind: "primary" | "selected";
}) {
  const { locale } = useHud();
  const copy = trackCopy(locale);
  if (!track) {
    return (
      <div
        data-testid="track-readout"
        className="flex h-full min-h-[12rem] items-center justify-center border border-[#1a3d32] bg-[#04110c] px-3 text-center font-mono text-[11px] text-[#6a9a7c]"
      >
        {copy.pick}
      </div>
    );
  }
  const color = toneColor(track.tone);
  const dash = copy.noValue;
  return (
    <div
      data-testid="track-readout"
      data-track={track.id}
      className="flex h-full flex-col border border-[#1a3d32] bg-[#04110c]"
    >
      <div className="flex items-center justify-between gap-2 border-b border-[#1a3d32] px-3 py-1.5">
        <p className="font-mono text-[9px] tracking-[0.2em]" style={{ color }}>
          {kind === "primary" ? copy.primary : copy.selected} {track.trackNo}
        </p>
        <p className="font-mono text-[9px] tracking-[0.14em] text-[#9ec9ae]">
          {statusLabel(track.idStatus, copy)}
        </p>
      </div>
      <div className="flex items-end justify-between gap-3 px-3 pt-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] tracking-[0.16em] text-[#6a9a7c]">{copy.found}</p>
          <p className="truncate font-mono text-[15px] font-semibold text-[#e8f7ee]">{track.label}</p>
          <p className="truncate font-mono text-[11px] text-[#9ec9ae]">{track.object ?? track.name}</p>
        </div>
        <div className="text-end">
          <p className="font-mono text-[9px] tracking-[0.16em] text-[#6a9a7c]">{copy.range}</p>
          <p className="font-mono text-[28px] font-semibold leading-none" style={{ color }}>
            {track.rangeText ?? track.dist.split("·")[0]?.trim()}
          </p>
        </div>
      </div>
      <p className="px-3 pt-2 font-mono text-[11px] leading-snug text-[#c5ddce]">
        {track.threat ?? track.type}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-px border-t border-[#1a3d32] bg-[#1a3d32] sm:grid-cols-3">
        <Cell
          label={copy.bearing}
          value={track.bearing != null ? `${String(track.bearing).padStart(3, "0")}°` : dash}
        />
        <Cell
          label={copy.speed}
          value={track.speedKn != null ? `${track.speedKn} kn` : copy.noSpeed}
        />
        <Cell
          label={copy.course}
          value={track.course != null ? `${String(track.course).padStart(3, "0")}°` : dash}
        />
        <Cell label={copy.size} value={track.size ?? dash} />
        <Cell
          label={copy.temp}
          value={track.tempC != null ? `${track.tempC}°C` : copy.noTemp}
        />
        <Cell
          label={track.depthM != null ? copy.depth : copy.altitude}
          value={
            track.depthM != null
              ? `${track.depthM} m`
              : track.altitudeM != null
                ? `${track.altitudeM} m`
                : dash
          }
        />
        <Cell label={copy.ais} value={(track.ais ?? "na").toUpperCase()} />
        <Cell label={copy.cpa} value={track.cpa ?? dash} />
        <Cell label={copy.tcpa} value={track.tcpa ?? dash} />
        {track.freq ? <Cell label={copy.freq} value={track.freq} /> : null}
        {track.power ? <Cell label={copy.power} value={track.power} /> : null}
        <Cell label={copy.object} value={track.object ?? track.name} />
      </div>
    </div>
  );
}

export function TrackTable({
  tracks,
  selectedId,
  onSelect,
}: {
  tracks: PictureContact[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const { locale } = useHud();
  const copy = trackCopy(locale);
  const primary = primaryTrack(tracks);
  if (tracks.length === 0) {
    return (
      <p className="border border-[#1a3d32] bg-[#04110c] px-3 py-4 text-center font-mono text-[11px] text-[#6a9a7c]">
        {copy.empty}
      </p>
    );
  }
  return (
    <div data-testid="track-table" className="overflow-x-auto border border-[#1a3d32] bg-[#04110c]">
      <table className="min-w-[720px] w-full border-collapse text-start font-mono text-[10px]">
        <thead>
          <tr className="border-b border-[#1a3d32] text-[#6a9a7c]">
            <th className="px-2 py-1.5 font-normal tracking-[0.14em]">#</th>
            <th className="px-2 py-1.5 font-normal tracking-[0.14em]">ID</th>
            <th className="px-2 py-1.5 font-normal tracking-[0.14em]">{copy.range}</th>
            <th className="px-2 py-1.5 font-normal tracking-[0.14em]">{copy.bearing}</th>
            <th className="px-2 py-1.5 font-normal tracking-[0.14em]">{copy.speed}</th>
            <th className="px-2 py-1.5 font-normal tracking-[0.14em]">{copy.object}</th>
            <th className="px-2 py-1.5 font-normal tracking-[0.14em]">ID</th>
            <th className="px-2 py-1.5 font-normal tracking-[0.14em]">{copy.threat}</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track) => {
            const active = track.id === selectedId;
            const color = toneColor(track.tone);
            return (
              <tr
                key={track.id}
                data-testid={`track-row-${track.id}`}
                onClick={() => onSelect(track.id)}
                className={cn(
                  "cursor-pointer border-b border-[#12281f] hover:bg-[#0a2418]",
                  active && "bg-[#0d2a1c]",
                )}
              >
                <td className="px-2 py-1.5" style={{ color }}>
                  {track.trackNo}
                  {track.id === primary?.id ? (
                    <span className="ms-1 text-[8px] tracking-wider text-orange">{copy.primary}</span>
                  ) : null}
                </td>
                <td className="px-2 py-1.5 text-[#e8f7ee]">{track.label}</td>
                <td className="px-2 py-1.5 text-[#c5ddce]">{track.rangeText ?? "—"}</td>
                <td className="px-2 py-1.5 text-[#c5ddce]">
                  {track.bearing != null ? `${String(track.bearing).padStart(3, "0")}°` : "—"}
                </td>
                <td className="px-2 py-1.5 text-[#c5ddce]">
                  {track.speedKn != null ? `${track.speedKn}` : "—"}
                </td>
                <td className="max-w-[10rem] truncate px-2 py-1.5 text-[#c5ddce]">
                  {track.object ?? track.name}
                </td>
                <td className="px-2 py-1.5 text-[#9ec9ae]">{statusLabel(track.idStatus, copy)}</td>
                <td className="max-w-[12rem] truncate px-2 py-1.5" style={{ color }}>
                  {track.threat ?? track.type}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
