"use client";

import { AdaptiveLearningPanel } from "@/components/bridge/adaptive-learning-panel";
import { BlackBoxPanel } from "@/components/bridge/black-box-panel";
import { BridgeConsole } from "@/components/bridge/bridge-console";
import { JumpNav } from "@/components/bridge/jump-nav";
import { WatchCommsPanel } from "@/components/bridge/watch-comms-panel";
import { LiveModeBanner } from "@/components/live-mode-banner";
import { useAgronView } from "@/lib/agron-view";
import { CrisisModeProvider } from "@/lib/crisis-mode";
import { useAppMode } from "@/lib/mode";
import { cn } from "@/lib/cn";

function InterfaceBody() {
  const { live } = useAppMode();
  const { view, density } = useAgronView();
  return (
    <div
      id="bridge-root"
      data-view={view}
      data-density={density}
      className={cn(
        "min-h-screen bg-bridge-bg ps-[4.85rem]",
        density === "compact" ? "agron-compact" : "agron-roomy",
      )}
      dir="ltr"
    >
      <JumpNav />
      {live ? <LiveModeBanner /> : null}
      <BridgeConsole />
      <BlackBoxPanel />
      <WatchCommsPanel />
      <AdaptiveLearningPanel />
    </div>
  );
}

export default function InterfacePage() {
  return (
    <CrisisModeProvider>
      <InterfaceBody />
    </CrisisModeProvider>
  );
}
