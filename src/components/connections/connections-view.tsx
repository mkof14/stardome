"use client";

import Link from "next/link";
import { ConnectionsMap } from "@/components/connections/connections-map";
import { LiveModeBanner } from "@/components/live-mode-banner";
import { HudGlyph, IconWell } from "@/components/bridge/hud-icons";
import { HudFrame } from "@/components/bridge/hud-visor";
import { usePreferences } from "@/lib/i18n/context";
import { useAppMode } from "@/lib/mode";

export function ConnectionsView() {
  const { live } = useAppMode();
  const { t } = usePreferences();
  const copy = t.surface;

  return (
    <div
      className="min-h-screen bg-bridge-bg text-bridge-text"
      dir="ltr"
      data-testid="connections-view"
    >
      {live ? <LiveModeBanner /> : null}

      <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-8">
        <HudFrame variant="window" className="bg-bridge-panel px-5 py-6" status="STARWALL">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-body text-xs font-medium text-bridge-dim">
              {copy.connectionsKicker}
            </p>
            <h1 className="mt-1 font-body text-2xl font-semibold tracking-tight md:text-3xl">
              {copy.connectionsTitle}
            </h1>
            <p className="mt-2 max-w-2xl font-body text-sm text-bridge-dim">
              {live ? copy.connectionsLeadLive : copy.connectionsLead}
            </p>
          </div>
          <Link
            href="/interface"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-2 py-1.5 font-body text-sm text-bridge-text hover:bg-bridge-bg hover:text-orange"
          >
            <IconWell className="h-7 w-7">
              <HudGlyph name="hide" className="h-3.5 w-3.5" />
            </IconWell>
            {copy.connectionsBack}
          </Link>
        </div>

        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-body text-sm text-bridge-dim">
          <li className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-ok/15">
              <span className="h-2 w-2 rounded-full bg-ok" />
            </span>
            {copy.connectionsIn}
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-orange/15">
              <span className="h-2 w-2 rounded-full bg-orange" />
            </span>
            {copy.connectionsOut}
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-bridge-bg">
              <span className="h-2 w-2 rounded-full bg-[#4B5760]" />
            </span>
            {copy.connectionsOff}
          </li>
        </ul>
        </HudFrame>
      </div>

      <p
        className="mb-3 text-center font-ui text-4xl font-semibold tracking-[0.22em] text-orange md:text-5xl"
        data-testid="connections-brand"
      >
        StarWall
      </p>
      <ConnectionsMap />
    </div>
  );
}
