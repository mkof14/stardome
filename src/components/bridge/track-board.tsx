"use client";

import { useHud } from "@/lib/i18n/use-hud";
import { trackCopy } from "@/lib/i18n/track-copy";
import {
  primaryTrack,
  toneColor,
  trackHue,
  trackTint,
  type IdStatus,
  type PictureContact,
} from "@/lib/picture-scenes";

function statusLabel(status: IdStatus | undefined, copy: ReturnType<typeof trackCopy>) {
  if (status === "identified") return copy.identified;
  if (status === "classified") return copy.classified;
  return copy.unidentified;
}

function Cell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div
      className="min-w-0 border border-[#1a3d32] bg-[#06150f]/80 px-2.5 py-2"
      style={accent ? { boxShadow: `inset 3px 0 0 ${accent}` } : undefined}
    >
      <p className="font-mono text-[10px] tracking-[0.18em] text-[#6a9a7c]">{label}</p>
      <p className="truncate font-mono text-[13px] text-[#d7efe0]">{value}</p>
    </div>
  );
}

function BearingDial({ bearing, hue }: { bearing: number; hue: string }) {
  const rad = ((bearing - 90) * Math.PI) / 180;
  const x = 40 + Math.cos(rad) * 26;
  const y = 40 + Math.sin(rad) * 26;
  return (
    <svg viewBox="0 0 80 80" className="h-[4.6rem] w-[4.6rem]" aria-hidden>
      <circle cx="40" cy="40" r="36" fill="#04140c" stroke={hue} strokeWidth="1.4" />
      <circle cx="40" cy="40" r="22" fill="none" stroke="#1a5c3a" strokeWidth="1" />
      <line x1="40" y1="8" x2="40" y2="16" stroke="#7DCF9A" strokeWidth="1.4" />
      <text x="40" y="12" textAnchor="middle" fill="#7DCF9A" fontSize="8" fontFamily="monospace">
        N
      </text>
      <line x1="40" y1="40" x2={x} y2={y} stroke={hue} strokeWidth="2.2" />
      <circle cx="40" cy="40" r="3" fill={hue} />
      <text
        x="40"
        y="72"
        textAnchor="middle"
        fill={hue}
        fontSize="9"
        fontFamily="monospace"
        fontWeight="bold"
      >
        {String(bearing).padStart(3, "0")}°
      </text>
    </svg>
  );
}

function RangeBar({ nm, hue }: { nm?: number; hue: string }) {
  const pct = nm == null ? 0 : Math.min(100, (nm / 6) * 100);
  return (
    <span className="mt-1 block h-1 w-16 overflow-hidden rounded-full bg-[#123326]">
      <span className="block h-full" style={{ width: `${pct}%`, background: hue }} />
    </span>
  );
}

export function TrackSwitch({
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
  if (tracks.length === 0) return null;
  return (
    <div data-testid="track-switcher" className="flex flex-wrap items-center gap-1.5">
      <p className="me-1 font-mono text-[11px] tracking-[0.16em] text-[#6a9a7c]">{copy.tracks}</p>
      {tracks.map((track, index) => {
        const hue = trackHue(track, index);
        const active = track.id === selectedId;
        return (
          <button
            key={track.id}
            type="button"
            data-testid={`track-switch-${track.trackNo ?? track.id}`}
            aria-pressed={active}
            onClick={() => onSelect(track.id)}
            className="rounded-md border px-2 py-1 font-mono text-[12px] font-semibold tracking-wider"
            style={{
              color: hue,
              borderColor: hue,
              background: active ? trackTint(hue, 0.22) : trackTint(hue, 0.06),
              boxShadow: active ? `0 0 0 1px ${hue}` : undefined,
            }}
          >
            {track.trackNo ?? `T${String(index + 1).padStart(2, "0")}`}
          </button>
        );
      })}
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
        className="flex h-full min-h-[16rem] items-center justify-center border border-[#1a3d32] bg-[#04110c] px-3 text-center font-mono text-[13px] text-[#6a9a7c]"
      >
        {copy.pick}
      </div>
    );
  }
  const hue = trackHue(track);
  const alarm = toneColor(track.tone);
  const dash = copy.noValue;
  return (
    <div
      data-testid="track-readout"
      data-track={track.id}
      className="flex h-full flex-col border bg-[#04110c]"
      style={{ borderColor: hue, boxShadow: `inset 0 0 48px ${trackTint(hue, 0.16)}` }}
    >
      <div
        className="flex items-center justify-between gap-2 border-b px-3 py-2"
        style={{ borderColor: hue, background: trackTint(hue, 0.18) }}
      >
        <p className="font-mono text-[11px] tracking-[0.2em]" style={{ color: hue }}>
          {kind === "primary" ? copy.primary : copy.selected} {track.trackNo}
        </p>
        <p
          className="rounded-md border px-2 py-0.5 font-mono text-[11px] tracking-[0.14em]"
          style={{ color: alarm, borderColor: alarm, background: trackTint(alarm, 0.16) }}
        >
          {statusLabel(track.idStatus, copy)}
        </p>
      </div>
      <div className="flex items-center justify-between gap-3 px-3 pt-3">
        <div className="min-w-0">
          <p className="font-mono text-[11px] tracking-[0.16em] text-[#6a9a7c]">{copy.found}</p>
          <p className="truncate font-mono text-[18px] font-semibold text-[#e8f7ee]">{track.label}</p>
          <p className="truncate font-mono text-[12px] text-[#9ec9ae]">{track.object ?? track.name}</p>
        </div>
        {track.bearing != null ? <BearingDial bearing={track.bearing} hue={hue} /> : null}
        <div className="text-end">
          <p className="font-mono text-[10px] tracking-[0.16em] text-[#6a9a7c]">{copy.range}</p>
          <p className="font-mono text-[36px] font-semibold leading-none" style={{ color: hue }}>
            {track.rangeText ?? track.dist.split("·")[0]?.trim()}
          </p>
        </div>
      </div>
      <p
        className="mx-3 mt-2 rounded-md border px-2 py-1.5 font-mono text-[12px] leading-snug"
        style={{ color: hue, borderColor: hue, background: trackTint(hue, 0.12) }}
      >
        {track.threat ?? track.type}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-px border-t border-[#1a3d32] bg-[#1a3d32] sm:grid-cols-3">
        <Cell
          label={copy.bearing}
          value={track.bearing != null ? `${String(track.bearing).padStart(3, "0")}°` : dash}
          accent={hue}
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
      <p className="border border-[#1a3d32] bg-[#04110c] px-3 py-4 text-center font-mono text-[13px] text-[#6a9a7c]">
        {copy.empty}
      </p>
    );
  }
  return (
    <div data-testid="track-table" className="overflow-x-auto border border-[#1a3d32] bg-[#04110c]">
      <table className="min-w-[720px] w-full border-collapse text-start font-mono text-[12px]">
        <thead>
          <tr className="border-b border-[#1a3d32] text-[#6a9a7c]">
            <th className="px-2.5 py-2 font-normal tracking-[0.14em]">#</th>
            <th className="px-2.5 py-2 font-normal tracking-[0.14em]">ID</th>
            <th className="px-2.5 py-2 font-normal tracking-[0.14em]">{copy.range}</th>
            <th className="px-2.5 py-2 font-normal tracking-[0.14em]">{copy.bearing}</th>
            <th className="px-2.5 py-2 font-normal tracking-[0.14em]">{copy.speed}</th>
            <th className="px-2.5 py-2 font-normal tracking-[0.14em]">{copy.object}</th>
            <th className="px-2.5 py-2 font-normal tracking-[0.14em]">ID</th>
            <th className="px-2.5 py-2 font-normal tracking-[0.14em]">{copy.threat}</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track, index) => {
            const active = track.id === selectedId;
            const hue = trackHue(track, index);
            return (
              <tr
                key={track.id}
                data-testid={`track-row-${track.id}`}
                onClick={() => onSelect(track.id)}
                className="cursor-pointer border-b border-[#12281f] hover:brightness-110"
                style={{
                  background: active ? trackTint(hue, 0.2) : trackTint(hue, 0.05),
                  boxShadow: `inset 3px 0 0 ${hue}`,
                }}
              >
                <td className="px-2.5 py-2 font-semibold" style={{ color: hue }}>
                  <span
                    className="me-1.5 inline-block h-2 w-2 rounded-full"
                    style={{ background: hue, boxShadow: `0 0 8px ${hue}` }}
                  />
                  {track.trackNo}
                  {track.id === primary?.id ? (
                    <span className="ms-1 text-[9px] tracking-wider text-orange">{copy.primary}</span>
                  ) : null}
                </td>
                <td className="px-2.5 py-2 text-[#e8f7ee]">{track.label}</td>
                <td className="px-2.5 py-2 text-[#c5ddce]">
                  {track.rangeText ?? "—"}
                  <RangeBar nm={track.rangeNm} hue={hue} />
                </td>
                <td className="px-2.5 py-2 text-[#c5ddce]">
                  {track.bearing != null ? `${String(track.bearing).padStart(3, "0")}°` : "—"}
                </td>
                <td className="px-2.5 py-2 text-[#c5ddce]">
                  {track.speedKn != null ? `${track.speedKn}` : "—"}
                </td>
                <td className="max-w-[10rem] truncate px-2.5 py-2 text-[#c5ddce]">
                  {track.object ?? track.name}
                </td>
                <td className="px-2.5 py-2 text-[#9ec9ae]">{statusLabel(track.idStatus, copy)}</td>
                <td className="max-w-[12rem] truncate px-2.5 py-2" style={{ color: hue }}>
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
