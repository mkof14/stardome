"use client";

import { cn } from "@/lib/cn";
import { fillDemo, type PilotDemoCopy } from "@/lib/i18n/pilot-demo-copy";
import type { Locale } from "@/lib/i18n/locales";
import { voiceNeedLine } from "@/lib/pilot-demo";
import type { DemoBeat } from "@/lib/pilot-demo";
import type { VoiceNeed } from "@/lib/pilot-voice";
import { StudioVu } from "@/components/bridge/studio-meters";

const DEMO_CYAN = "#38BDF8";

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
        "relative flex items-center justify-center overflow-hidden border text-[#38BDF8]",
        compact
          ? "h-9 w-9 shrink-0 border-[#38BDF8] bg-[#06202c]"
          : "h-12 w-12 rounded-full border-[#38BDF8] bg-[#06202c] shadow-[0_8px_20px_rgb(6_32_44/0.45)]",
        running && "demo-fab-pulse",
      )}
    >
      <svg viewBox="0 0 48 48" className={compact ? "h-5 w-5" : "h-7 w-7"} aria-hidden>
        <polygon
          points="24,5 41,14.5 41,33.5 24,43 7,33.5 7,14.5"
          fill="#06202c"
          stroke={DEMO_CYAN}
          strokeWidth="1.8"
        />
        <text
          x="24"
          y="30"
          textAnchor="middle"
          fill={DEMO_CYAN}
          fontSize={compact ? "18" : "20"}
          fontFamily="var(--font-space-grotesk), system-ui, sans-serif"
          fontWeight="700"
        >
          D
        </text>
      </svg>
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
        "flex items-end gap-2 rounded-sm border px-2 py-1.5",
        live
          ? "border-ok/50 bg-ok/5"
          : voiceOn
            ? "border-sand/20 bg-[#061018]"
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
          "flex h-9 w-9 shrink-0 items-center justify-center border",
          voiceOn ? "border-ok text-ok" : "border-attn text-attn",
        )}
      >
        {voiceOn ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
      </button>
      <StudioVu levels={levels} peak={Boolean(peak)} live={live} />
      <p
        className={cn(
          "hidden shrink-0 font-mono text-[9px] tracking-wider sm:block",
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
      className="space-y-2 border-b border-[#38BDF8]/40 bg-[#06202c] px-3 py-2"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="border border-[#38BDF8] px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-wider text-[#38BDF8]">
          {copy.demo}
        </span>
        <span className="font-mono text-[9px] text-sand/55">
          {fillDemo(copy.step, { n: String(index), total: String(total) })}
        </span>
      </div>
      <div className="grid gap-1.5 sm:grid-cols-2">
        <p className="min-w-0">
          <span className="block font-mono text-[8px] tracking-wider text-[#38BDF8]">
            {copy.now}
          </span>
          <span className="block font-ui text-sm font-semibold leading-tight text-sand">
            {beat.action}
          </span>
        </p>
        <p className="min-w-0">
          <span className="block font-mono text-[8px] tracking-wider text-[#38BDF8]">
            {copy.where}
          </span>
          <span className="block font-ui text-sm font-semibold leading-tight text-sand">
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
      <p className="font-mono text-[9px] leading-relaxed text-sand/55">
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
    <p
      data-testid="pilot-voice-need"
      data-tts={need.tts}
      data-voice={need.voiceName ?? ""}
      className="font-mono text-[9px] leading-relaxed text-sand/50"
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
