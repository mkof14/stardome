"use client";

import { cn } from "@/lib/cn";
import { HudPanel } from "@/components/bridge/hud-panel";
import { useAppMode } from "@/lib/mode";
import { useBridgeSession } from "@/lib/bridge-session";
import { starlinkLinks, type StarlinkLink, type StarlinkState } from "@/lib/starlink";

const HUE: Record<StarlinkLink["id"], string> = {
  maritime: "#38BDF8",
  priority: "#A78BFA",
};

function stateLabel(state: StarlinkState) {
  if (state === "lock") return "LOCK";
  if (state === "search") return "SEARCH";
  if (state === "obstructed") return "OBSTRUCTED";
  if (state === "offline") return "OFFLINE";
  return "NO DATA";
}

function stateClass(state: StarlinkState) {
  if (state === "lock") return "text-ok";
  if (state === "search" || state === "obstructed") return "text-attn";
  if (state === "offline") return "text-crit";
  return "text-bridge-dim";
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 border border-bridge-line/80 bg-bridge-bg/50 px-2.5 py-2">
      <p className="font-mono text-[10px] tracking-[0.16em] text-bridge-dim">{label}</p>
      <p className="truncate font-mono text-[14px] text-bridge-text">{value}</p>
    </div>
  );
}

function ServiceCard({ link }: { link: StarlinkLink }) {
  const hue = HUE[link.id];
  return (
    <article
      data-testid={`starlink-card-${link.id}`}
      className="flex flex-col border bg-bridge-bg/40"
      style={{ borderColor: hue, boxShadow: `inset 3px 0 0 ${hue}` }}
    >
      <header
        className="flex items-start justify-between gap-3 border-b px-3 py-2.5"
        style={{ borderColor: hue, background: `color-mix(in srgb, ${hue} 12%, transparent)` }}
      >
        <div className="min-w-0">
          <p className="font-mono text-[11px] tracking-[0.18em]" style={{ color: hue }}>
            STARLINK · {link.service.toUpperCase()}
          </p>
          <p className="mt-0.5 font-body text-lg font-semibold text-bridge-text">{link.name}</p>
          <p className="font-mono text-[12px] text-bridge-dim">
            {link.terminal} · {link.band}
          </p>
        </div>
        <p className={cn("shrink-0 font-mono text-[13px] font-semibold tracking-wider", stateClass(link.state))}>
          {stateLabel(link.state)}
        </p>
      </header>
      <p className="px-3 pt-2 font-body text-sm text-bridge-dim">{link.role}</p>
      <div className="mt-2 grid grid-cols-2 gap-px border-t border-bridge-line bg-bridge-line sm:grid-cols-3">
        <Metric label="LATENCY" value={link.latencyMs === "—" ? "—" : `${link.latencyMs} ms`} />
        <Metric label="DOWN" value={link.downMbps === "—" ? "—" : `${link.downMbps} Mbps`} />
        <Metric label="UP" value={link.upMbps === "—" ? "—" : `${link.upMbps} Mbps`} />
        <Metric label="SNR" value={link.snrDb === "—" ? "—" : `${link.snrDb} dB`} />
        <Metric label="OBSTRUCT" value={link.obstruction} />
        <Metric label="SATS" value={link.satellites} />
      </div>
      <p className="px-3 py-2 font-mono text-[11px] text-bridge-dim">{link.lastOk}</p>
    </article>
  );
}

export function StarlinkPanel() {
  const { live } = useAppMode();
  const session = useBridgeSession();
  const links = starlinkLinks({
    live,
    scenarioId: session.scenarioId,
    faultId: session.faultId,
  });

  return (
    <HudPanel
      id="starlink-panel"
      testId="starlink-panel"
      className="scroll-mt-20"
      title="STARLINK"
      glyph="satellite"
      extra={
        <span className="font-mono text-[11px] text-bridge-dim">
          {live ? "NO TERMINALS" : "2 SERVICES · MONITOR"}
        </span>
      }
    >
      <p className="mb-3 font-body text-sm leading-relaxed text-bridge-dim">
        {live
          ? "LIVE has no Starlink terminals on this install. Switch to DEMO to read Maritime and Priority."
          : "Two Starlink services on the watch: Maritime as the primary data path, Priority as the second path. Latency, throughput, SNR, obstruction, and satellites stay on this board."}
      </p>
      <div className="grid gap-3 lg:grid-cols-2">
        {links.map((link) => (
          <ServiceCard key={link.id} link={link} />
        ))}
      </div>
    </HudPanel>
  );
}
