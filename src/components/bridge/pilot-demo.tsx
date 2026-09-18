"use client";

import { cn } from "@/lib/cn";
import type { PilotDemoCopy } from "@/lib/i18n/pilot-demo-copy";
import type { Locale } from "@/lib/i18n/locales";
import { voiceNeedLine } from "@/lib/pilot-demo";
import type { VoiceNeed } from "@/lib/pilot-voice";

export function PilotDemoIcon({
  label,
  running,
  compact,
  onClick,
}: {
  label: string;
  running: boolean;
  compact?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-testid="pilot-demo"
      aria-pressed={running}
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center overflow-hidden border border-orange bg-navy text-orange",
        compact
          ? "h-8 w-8"
          : "h-12 w-12 rounded-full shadow-[0_8px_20px_rgb(15_25_34/0.35)]",
        running && "helm-fab-pulse",
      )}
    >
      <svg viewBox="0 0 48 48" className={compact ? "h-5 w-5" : "h-7 w-7"} aria-hidden>
        <polygon
          points="24,5 41,14.5 41,33.5 24,43 7,33.5 7,14.5"
          fill="#111820"
          stroke="#F15A00"
          strokeWidth="1.8"
        />
        {running ? (
          <path fill="#F15A00" d="M18 18h4.2v12H18V18Zm7.8 0H30v12h-4.2V18Z" />
        ) : (
          <path fill="#F15A00" d="M20 16.5 33 24 20 31.5V16.5Z" />
        )}
      </svg>
    </button>
  );
}

export function PilotWatchCalls({
  copy,
  disabled,
  onPick,
}: {
  copy: PilotDemoCopy;
  disabled?: boolean;
  onPick: (text: string) => void;
}) {
  const calls = [copy.callStatus, copy.callAdvice, copy.callNotify];
  return (
    <div data-testid="pilot-watch-calls" className="space-y-1.5">
      <p className="font-mono text-[9px] tracking-wider text-orange">{copy.calls}</p>
      <div className="flex flex-wrap gap-1">
        {calls.map((call) => (
          <button
            key={call}
            type="button"
            data-testid="pilot-watch-call"
            disabled={disabled}
            onClick={() => onPick(call)}
            className="border border-sand/20 px-1.5 py-1 text-start font-ui text-[10px] leading-tight text-sand/80 hover:border-orange hover:text-sand disabled:opacity-40"
          >
            {call}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PilotVoiceNeed({
  locale,
  need,
}: {
  locale: Locale;
  need: VoiceNeed;
}) {
  return (
    <p data-testid="pilot-voice-need" className="font-mono text-[9px] leading-relaxed text-sand/50">
      {voiceNeedLine(locale, need)}
    </p>
  );
}
