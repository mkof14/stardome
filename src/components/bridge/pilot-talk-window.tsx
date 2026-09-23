"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import type { PilotDemoCopy } from "@/lib/i18n/pilot-demo-copy";
import { HudGlyph } from "@/components/bridge/hud-icons";
import { PilotSoundDock } from "@/components/bridge/pilot-demo";
import { StudioWave } from "@/components/bridge/studio-meters";

type TalkMessage = {
  id: string;
  role: "user" | "assistant" | "error";
  text: string;
};

export function PilotTalkWindow({
  copy,
  title,
  ask,
  send,
  messages,
  typed,
  typingId,
  draft,
  mic,
  levels,
  wave,
  peak,
  voiceOn,
  cuesOn,
  onDraft,
  onSend,
  onClose,
  onMic,
  onStop,
  stopLabel,
  onToggleSound,
  onToggleCues,
}: {
  copy: PilotDemoCopy;
  title: string;
  ask: string;
  send: string;
  messages: TalkMessage[];
  typed: string;
  typingId: string | null;
  draft: string;
  mic: "idle" | "listening" | "processing" | "speaking";
  levels: number[];
  wave: number[];
  peak: boolean;
  voiceOn: boolean;
  cuesOn: boolean;
  onDraft: (value: string) => void;
  onSend: (text: string) => void;
  onClose: () => void;
  onMic: () => void;
  onStop?: () => void;
  stopLabel?: string;
  onToggleSound: () => void;
  onToggleCues: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const recent = messages.slice(-8);
  const live = mic === "speaking" || mic === "listening";
  const status =
    mic === "listening"
      ? copy.talkListening
      : mic === "processing"
        ? "…"
        : copy.linkLive;

  return createPortal(
    <div
      data-testid="pilot-talk-window"
      dir="ltr"
      className="pointer-events-none fixed inset-x-3 bottom-[6.5rem] z-[200] flex justify-end sm:inset-x-4"
    >
      <section
        data-testid="pilot-talk-hud"
        className="pointer-events-auto flex h-[min(28rem,calc(100vh-8.5rem))] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-bridge-line bg-bridge-panel text-bridge-text shadow-[0_20px_56px_rgb(15_25_34/0.18)]"
      >
        <header className="flex items-center justify-between gap-2 border-b border-bridge-line bg-bridge-bg px-3 py-2.5">
          <div className="min-w-0">
            <p className="truncate font-body text-base font-semibold tracking-tight">
              {title}
            </p>
            <p className="truncate font-body text-xs text-bridge-dim">{status}</p>
          </div>
          <button
            type="button"
            data-testid="pilot-talk-close"
            onClick={onClose}
            aria-label={title}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-bridge-dim hover:bg-bridge-panel hover:text-bridge-text"
          >
            <HudGlyph name="close" className="h-4 w-4" />
          </button>
        </header>
        <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto]">
          <div
            data-testid="pilot-talk-chat"
            className="min-h-0 space-y-2 overflow-y-auto px-3 py-3"
          >
            {recent.length === 0 ? (
              <p className="border-s-2 border-bridge-line ps-3 font-body text-sm text-bridge-dim">
                {copy.bargeHint}
              </p>
            ) : null}
            {recent.map((item) => {
              const showing =
                item.role === "assistant" && typingId === item.id
                  ? typed
                  : item.text;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-end gap-2",
                    item.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  {item.role !== "user" ? (
                    <span className="mb-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-bridge-bg text-bridge-dim">
                      <HudGlyph name="talk" className="h-4 w-4" />
                    </span>
                  ) : null}
                  <p
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3 py-2 font-body text-[15px] leading-relaxed",
                      item.role === "user"
                        ? "bg-bridge-text text-bridge-bg"
                        : item.role === "error"
                          ? "border border-attn text-attn"
                          : "bg-bridge-bg text-bridge-text",
                    )}
                  >
                    {showing}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="border-t border-bridge-line bg-bridge-bg px-3 py-2">
            <div className="mb-2 h-16 overflow-hidden rounded-xl border border-bridge-line bg-bridge-panel">
              <StudioWave samples={wave} peak={peak} live={live && voiceOn} />
            </div>
            <PilotSoundDock
              voiceOn={voiceOn}
              speaking={mic === "speaking"}
              listening={mic === "listening"}
              levels={levels}
              peak={peak}
              soundOnLabel={copy.soundOn}
              soundOffLabel={copy.soundOff}
              onToggle={onToggleSound}
              cuesOn={cuesOn}
              cuesOnLabel={copy.signalsOn}
              cuesOffLabel={copy.signalsOff}
              onToggleCues={onToggleCues}
            />
            <form
              onSubmit={(event) => {
                event.preventDefault();
                onSend(draft);
              }}
              className="mt-2 flex items-center gap-2"
            >
              {mic === "speaking" && onStop && stopLabel ? (
                <button
                  type="button"
                  data-testid="pilot-talk-stop"
                  onClick={onStop}
                  className="flex h-9 shrink-0 items-center justify-center rounded-xl bg-attn px-3 font-body text-sm font-semibold text-white"
                >
                  {stopLabel}
                </button>
              ) : null}
              <input
                data-testid="pilot-talk-input"
                value={draft}
                onChange={(event) => onDraft(event.target.value)}
                placeholder={ask}
                className="min-w-0 flex-1 rounded-xl border border-bridge-line bg-bridge-panel px-3 py-2 font-body text-sm text-bridge-text outline-none placeholder:text-bridge-dim"
              />
              <button
                type="button"
                data-testid="pilot-talk-mic"
                onClick={onMic}
                aria-label={copy.talkListening}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl border",
                  mic === "listening" && "assistant-mic-listen border-ok text-ok",
                  mic === "speaking" && "border-bridge-text text-bridge-text",
                  mic === "processing" && "border-attn text-attn",
                  mic === "idle" && "border-bridge-line text-bridge-dim",
                )}
              >
                <HudGlyph name="mic" className="h-4 w-4" />
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-xl bg-bridge-text px-3 py-2 font-body text-sm font-medium text-bridge-bg"
              >
                <HudGlyph name="send" className="h-4 w-4" />
                {send}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>,
    document.body,
  );
}
