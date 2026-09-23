"use client";

import { cn } from "@/lib/cn";
import { fillDemo, type PilotDemoCopy } from "@/lib/i18n/pilot-demo-copy";
import type { Locale } from "@/lib/i18n/locales";
import { voiceNeedLine } from "@/lib/pilot-demo";
import type { DemoBeat } from "@/lib/pilot-demo";
import type { VoiceNeed } from "@/lib/pilot-voice";
import { StudioVu } from "@/components/bridge/studio-meters";
import { HudGlyph, type HudGlyphName } from "@/components/bridge/hud-icons";

export function PilotDemoIcon({
  label,
  running,
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
      className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#38BDF8] bg-bridge-bg font-body text-[#38BDF8]"
    >
      {running ? (
        <span className="demo-fab-ring pointer-events-none absolute inset-0 rounded-full" aria-hidden />
      ) : null}
      <span className="relative text-2xl font-semibold leading-none">D</span>
    </button>
  );
}

function DockBtn({
  testId,
  label,
  icon,
  onClick,
}: {
  testId: string;
  label: string;
  icon: HudGlyphName;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#38BDF8] hover:bg-[#38BDF8]/12"
    >
      <HudGlyph name={icon} className="h-4 w-4" />
    </button>
  );
}

export function PilotDemoDock({
  running,
  copy,
  cuesOn,
  onToggleCues,
  onPlay,
  onStop,
  onBack,
  onNext,
  onReset,
}: {
  running: boolean;
  copy: PilotDemoCopy;
  cuesOn: boolean;
  onToggleCues: () => void;
  onPlay: () => void;
  onStop: () => void;
  onBack: () => void;
  onNext: () => void;
  onReset: () => void;
}) {
  return (
    <div data-testid="pilot-demo-dock" className="flex h-20 items-end gap-1">
      {running ? (
        <div
          data-testid="pilot-demo-transport"
          className="flex h-12 items-center gap-0.5 rounded-2xl border border-[#38BDF8]/50 bg-bridge-panel px-1"
        >
          <DockBtn testId="pilot-demo-back" label={copy.back} icon="back" onClick={onBack} />
          <DockBtn testId="pilot-demo-reset" label={copy.reset} icon="reset" onClick={onReset} />
          <DockBtn testId="pilot-demo-stop" label={copy.stop} icon="stop" onClick={onStop} />
          <DockBtn testId="pilot-demo-next" label={copy.next} icon="next" onClick={onNext} />
        </div>
      ) : null}
      <PilotCueToggle
        compact
        on={cuesOn}
        onLabel={copy.signalsOn}
        offLabel={copy.signalsOff}
        onToggle={onToggleCues}
      />
      <PilotDemoIcon
        running={running}
        label={running ? copy.stop : copy.play}
        onClick={onPlay}
      />
    </div>
  );
}

export function PilotCueToggle({
  on,
  onLabel,
  offLabel,
  onToggle,
  compact,
}: {
  on: boolean;
  onLabel: string;
  offLabel: string;
  onToggle: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      data-testid={compact ? "pilot-cues-dock" : "pilot-cues-toggle"}
      data-on={on ? "true" : "false"}
      onClick={onToggle}
      aria-pressed={!on}
      aria-label={on ? onLabel : offLabel}
      title={on ? onLabel : offLabel}
      className={cn(
        "relative flex shrink-0 items-center justify-center",
        compact
          ? "h-12 w-12 overflow-hidden rounded-full border bg-bridge-bg"
          : "h-8 w-8 rounded-lg",
        on
          ? compact
            ? "border-[#38BDF8] text-[#38BDF8]"
            : "text-[#38BDF8]"
          : compact
            ? "border-attn text-attn"
            : "text-attn",
      )}
    >
      <HudGlyph name="bell" className="h-4 w-4" />
      {on ? null : (
        <span
          className="pointer-events-none absolute inset-x-3 top-1/2 h-px -rotate-45 bg-current"
          aria-hidden
        />
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
  cuesOn,
  cuesOnLabel,
  cuesOffLabel,
  onToggleCues,
}: {
  voiceOn: boolean;
  speaking: boolean;
  listening?: boolean;
  levels: number[];
  peak?: boolean;
  soundOnLabel: string;
  soundOffLabel: string;
  onToggle: () => void;
  cuesOn?: boolean;
  cuesOnLabel?: string;
  cuesOffLabel?: string;
  onToggleCues?: () => void;
}) {
  const live = Boolean((speaking && voiceOn) || listening);
  return (
    <div
      data-testid="pilot-sound-dock"
      className={cn(
        "flex h-8 w-[7.5rem] shrink-0 items-center gap-1 rounded-lg border px-1.5",
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
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
          voiceOn ? "bg-ok/15 text-ok" : "bg-attn/15 text-attn",
        )}
      >
        {voiceOn ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
      </button>
      {cuesOnLabel && cuesOffLabel && onToggleCues ? (
        <PilotCueToggle
          on={Boolean(cuesOn)}
          onLabel={cuesOnLabel}
          offLabel={cuesOffLabel}
          onToggle={onToggleCues}
        />
      ) : null}
      <StudioVu levels={levels} peak={Boolean(peak)} live={live} compact />
    </div>
  );
}

export function PilotDemoStage({
  copy,
  beat,
  index,
  total,
  speaking,
  warn,
}: {
  copy: PilotDemoCopy;
  beat: DemoBeat;
  index: number;
  total: number;
  speaking: boolean;
  warn?: boolean;
}) {
  return (
    <div
      data-testid="pilot-demo-stage"
      data-focus={beat.focus}
      data-speaking={speaking ? "true" : undefined}
      data-tone={beat.tone}
      className={cn(
        "shrink-0 border-b px-3 py-2",
        speaking && warn
          ? "pilot-speak-focus-warn border-attn/50 bg-attn/10"
          : speaking
            ? "pilot-speak-focus border-[#38BDF8]/50 bg-[#38BDF8]/12"
            : "border-[#38BDF8]/40 bg-[#38BDF8]/10",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-lg bg-[#38BDF8]/15 px-2 py-0.5 font-body text-xs font-semibold text-[#38BDF8]">
          {copy.demo}
        </span>
        <span className="font-body text-xs text-bridge-dim">
          {fillDemo(copy.step, { n: String(index), total: String(total) })}
        </span>
        <span
          data-testid="pilot-demo-speaker"
          className={cn(
            "inline-flex rounded-md px-1.5 py-0.5 font-body text-[11px] font-semibold",
            beat.role === "officer"
              ? "bg-orange/15 text-orange"
              : "bg-[#38BDF8]/15 text-[#38BDF8]",
          )}
        >
          {beat.role === "officer" ? copy.whoOfficer : copy.whoPilot}
        </span>
      </div>
      <p
        data-testid="pilot-demo-turn"
        data-speaker={beat.role}
        className="sr-only"
      >
        {beat.role}
      </p>
      <p
        data-testid="pilot-demo-line"
        className="mt-1.5 font-body text-sm font-medium leading-snug text-bridge-text"
      >
        {beat.text}
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
      data-officer-voice={need.officerVoiceName ?? ""}
      data-provider={need.provider ?? ""}
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
