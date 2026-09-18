"use client";

import Image from "next/image";
import eventLogNew from "../../../public/bridge/event-log-new.png";
import radarNormal from "../../../public/bridge/radar-normal.png";
import recommendedAction from "../../../public/bridge/recommended-action.png";
import riskElevated from "../../../public/bridge/risk-elevated.png";
import { HudFrame } from "@/components/bridge/hud-visor";

const stills = {
  "radar-normal.png": radarNormal,
  "risk-elevated.png": riskElevated,
  "recommended-action.png": recommendedAction,
  "event-log-new.png": eventLogNew,
} as const;

type ScenarioStillProps = {
  file: keyof typeof stills | string;
};

export function ScenarioStill({ file }: ScenarioStillProps) {
  const src = stills[file as keyof typeof stills];

  if (!src) {
    return (
      <HudFrame variant="window" className="bg-bridge-panel">
        <div className="flex aspect-video w-full items-center justify-center font-mono text-sm text-bridge-dim">
          {file}
        </div>
      </HudFrame>
    );
  }

  return (
    <HudFrame variant="window" className="bg-bridge-panel p-2">
      <Image
        src={src}
        alt=""
        unoptimized
        className="relative z-[1] h-auto w-full object-cover object-top"
      />
    </HudFrame>
  );
}
