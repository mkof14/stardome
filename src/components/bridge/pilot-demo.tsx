"use client";

import { cn } from "@/lib/cn";
import { fillDemo, type PilotDemoCopy } from "@/lib/i18n/pilot-demo-copy";
import type { Locale } from "@/lib/i18n/locales";
import { voiceNeedLine } from "@/lib/pilot-demo";
import type { DemoBeat } from "@/lib/pilot-demo";
import type { VoiceNeed } from "@/lib/pilot-voice";
import { StudioVu } from "@/components/bridge/studio-meters";

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
        "relative flex items-center justify-center overflow-hidden font-body text-[#38BDF8]",
        compact
          ? "min-w-[2.6rem] flex-col gap-0.5 rounded-xl px-1.5 py-1 text-[11px] font-medium hover:bg-[#38BDF8]/10"
          : "h-12 w-12 rounded-full border border-[#38BDF8] bg-bridge-bg shadow-[0_8px_20px_rgb(15_25_34/0.18)]",
        running && "demo-fab-pulse",
        compact && running && "bg-[#38BDF8]/15",
      )}
    >
      {compact ? (
        <>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#38BDF8]/15 text-sm font-semibold">
            D
          </span>
          {label}
        </>
      ) : (
        <span className="text-lg font-semibold leading-none">D</span>
      )}
    </button>
  );
}

export function PilotSoundDock({
  voiceOn,
  speaking,
  listening,
  levels,
  peak,
  soundOnLabel,
  soundOffLabel,
  onToggle,
}: {
  voiceOn: boolean;
  speaking: boolean;
  listening?: boolean;
  levels: number[];
  peak?: boolean;
  soundOnLabel: string;
  soundOffLabel: string;
  onToggle: () => void;
}) {
  const live = Boolean((speaking && voiceOn) || listening);
  return (
    <div
      data-testid="pilot-sound-dock"
      className={cn(
        "flex h-11 items-center gap-2 rounded-xl border px-2",
        live
          ? "border-ok/50 bg-ok/5"
          : voiceOn
            ? "border-bridge-line bg-bridge-panel"
            : "border-attn/50 bg-attn/10",
      )}
    >
      <button
        type="button"
        data-testid="assistant-speaker"
        onClick={onToggle}
        aria-pressed={!voiceOn}
        aria-label={voiceOn ? soundOnLabel : soundOffLabel}
        title={voiceOn ? soundOnLabel : soundOffLabel}
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          voiceOn ? "bg-ok/15 text-ok" : "bg-attn/15 text-attn",
        )}
      >
        {voiceOn ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
      </button>
      <StudioVu levels={levels} peak={Boolean(peak)} live={live} />
      <p
        className={cn(
          "hidden shrink-0 font-body text-xs font-medium sm:block",
          voiceOn ? "text-ok" : "text-attn",
        )}
      >
        {voiceOn ? soundOnLabel : soundOffLabel}
      </p>
    </div>
  );
}

export function PilotDemoStage({
  copy,
  beat,
  index,
  total,
  voiceOn,
  speaking,
  listening,
  levels,
  peak,
  onToggleSound,
}: {
  copy: PilotDemoCopy;
  beat: DemoBeat;
  index: number;
  total: number;
  voiceOn: boolean;
  speaking: boolean;
  listening?: boolean;
  levels: number[];
  peak?: boolean;
  onToggleSound: () => void;
}) {
  return (
    <div
      data-testid="pilot-demo-stage"
      data-focus={beat.focus}
      className="space-y-2 border-b border-[#38BDF8]/40 bg-[#38BDF8]/10 px-3 py-2"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-lg bg-[#38BDF8]/15 px-2 py-0.5 font-body text-xs font-semibold text-[#38BDF8]">
          {copy.demo}
        </span>
        <span className="font-body text-xs text-bridge-dim">
          {fillDemo(copy.step, { n: String(index), total: String(total) })}
        </span>
      </div>
      <div className="grid gap-1.5 sm:grid-cols-2">
        <p className="min-w-0">
          <span className="block font-body text-xs font-medium text-[#38BDF8]">
            {copy.now}
          </span>
          <span className="block font-body text-sm font-semibold leading-tight text-bridge-text">
            {beat.action}
          </span>
        </p>
        <p className="min-w-0">
          <span className="block font-body text-xs font-medium text-[#38BDF8]">
            {copy.where}
          </span>
          <span className="block font-body text-sm font-semibold leading-tight text-bridge-text">
            {beat.place}
          </span>
        </p>
      </div>
      <PilotSoundDock
        voiceOn={voiceOn}
        speaking={speaking}
        listening={listening}
        levels={levels}
        peak={peak}
        soundOnLabel={copy.soundOn}
        soundOffLabel={copy.soundOff}
        onToggle={onToggleSound}
      />
      <p className="font-body text-sm leading-relaxed text-bridge-dim">
        {copy.interruptHint}
      </p>
    </div>
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
      <p className="font-body text-xs font-medium text-orange">{copy.calls}</p>
      <div className="flex flex-wrap gap-1">
        {calls.map((call) => (
          <button
            key={call}
            type="button"
            data-testid="pilot-watch-call"
            disabled={disabled}
            onClick={() => onPick(call)}
            className="rounded-lg border border-bridge-line px-2 py-1.5 text-start font-body text-xs leading-tight text-bridge-text/80 hover:border-orange hover:text-bridge-text disabled:opacity-40"
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
    <p
      data-testid="pilot-voice-need"
      data-tts={need.tts}
      data-voice={need.voiceName ?? ""}
      className="font-body text-xs leading-relaxed text-bridge-dim"
    >
      {voiceNeedLine(locale, need)}
    </p>
  );
}

function SpeakerOnIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
      <path
        fill="currentColor"
        d="M2.2 5.6h2.2L7.8 3.2v9.6L4.4 10.4H2.2A.8.8 0 0 1 1.4 9.6V6.4a.8.8 0 0 1 .8-.8Zm8 5.1a3.6 3.6 0 0 0 0-5.4l1.1-1.1a5.2 5.2 0 0 1 0 7.6L10.2 10.7Zm1.9 1.9a6.4 6.4 0 0 0 0-9.2L13.2 2.3a8 8 0 0 1 0 11.4l-1.1-1.1Z"
      />
    </svg>
  );
}

function SpeakerOffIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
      <path
        fill="currentColor"
        d="M2.2 5.6h2.2L7.8 3.2v9.6L4.4 10.4H2.2A.8.8 0 0 1 1.4 9.6V6.4a.8.8 0 0 1 .8-.8ZM3.2 2.3 14.1 13.2l-1.1 1.1-2.1-2.1A6.3 6.3 0 0 1 9.4 14l-1-1.3a4.8 4.8 0 0 0 1.3-1.3L3.2 5l-1.1-1.1L3.2 2.3Zm8.1 2.2 1.1-1.1a8 8 0 0 1 1.8 7.2L12.9 9.3a6.3 6.3 0 0 0-1.6-4.8Z"
      />
    </svg>
  );
}
