"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import type { PilotDemoCopy } from "@/lib/i18n/pilot-demo-copy";
import { VU_RED } from "@/lib/studio-meter";
import { PilotSoundDock } from "@/components/bridge/pilot-demo";
import { StudioVu, StudioWave } from "@/components/bridge/studio-meters";

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
  onDraft,
  onSend,
  onClose,
  onMic,
  onToggleSound,
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
  onDraft: (value: string) => void;
  onSend: (text: string) => void;
  onClose: () => void;
  onMic: () => void;
  onToggleSound: () => void;
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
      className="fixed inset-0 z-[90] flex items-center justify-center bg-bridge-bg/70 p-3 sm:p-6"
    >
      <div className="pilot-talk-hud relative w-full max-w-5xl overflow-hidden">
        <div className="pilot-talk-hud-frame pointer-events-none" aria-hidden />
        <button
          type="button"
          data-testid="pilot-talk-close"
          onClick={onClose}
          aria-label={title}
          className="absolute end-3 top-3 z-10 flex h-8 w-8 items-center justify-center border border-orange/50 text-orange hover:bg-orange/10"
        >
          ×
        </button>
        <div className="relative grid gap-3 p-4 pt-10 sm:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] sm:p-6 sm:pt-12">
          <section className="flex min-h-[22rem] flex-col overflow-hidden border border-bridge-line bg-bridge-panel/95 shadow-[0_16px_40px_rgb(0_0_0/0.18)]">
            <header className="flex items-center justify-between border-b border-bridge-line bg-bridge-bg px-3 py-2">
              <p className="flex items-center gap-2 font-heading text-lg font-bold tracking-wide text-bridge-text">
                <span className="inline-flex h-6 w-6 items-center justify-center">
                  <svg viewBox="0 0 48 48" className="h-6 w-6" aria-hidden>
                    <polygon
                      points="24,5 41,14.5 41,33.5 24,43 7,33.5 7,14.5"
                      fill="var(--bridge-bg)"
                      stroke="#F15A00"
                      strokeWidth="2"
                    />
                    <circle cx="24" cy="24" r="3.2" fill="#F15A00" />
                  </svg>
                </span>
                {title}
              </p>
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  mic === "listening"
                    ? "bg-ok assistant-mic-listen"
                    : mic === "speaking"
                      ? "bg-orange assistant-mic-speak"
                      : "bg-orange",
                )}
              />
            </header>
            <div
              data-testid="pilot-talk-chat"
              className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3"
            >
              {recent.length === 0 ? (
                <p className="border-s-2 border-orange ps-3 text-xs text-bridge-dim">
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
                      <span className="mb-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center">
                        <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
                          <polygon
                            points="24,5 41,14.5 41,33.5 24,43 7,33.5 7,14.5"
                            fill="var(--bridge-bg)"
                            stroke="#F15A00"
                            strokeWidth="2"
                          />
                        </svg>
                      </span>
                    ) : null}
                    <p
                      className={cn(
                        "max-w-[85%] px-2.5 py-2 text-sm leading-relaxed",
                        item.role === "user"
                          ? "bg-orange text-white"
                          : item.role === "error"
                            ? "border border-attn text-attn"
                            : "bg-bridge-bg text-bridge-text",
                      )}
                    >
                      {showing}
                    </p>
                    {item.role === "user" ? (
                      <span className="mb-0.5 h-6 w-6 shrink-0 rounded-full border border-bridge-line bg-bridge-bg" />
                    ) : null}
                  </div>
                );
              })}
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                onSend(draft);
              }}
              className="flex items-center gap-2 border-t border-bridge-line bg-bridge-bg px-3 py-2"
            >
              <input
                data-testid="pilot-talk-input"
                value={draft}
                onChange={(event) => onDraft(event.target.value)}
                placeholder={ask}
                className="min-w-0 flex-1 bg-transparent py-1.5 font-ui text-sm text-bridge-text outline-none placeholder:text-bridge-dim"
              />
              <button
                type="button"
                data-testid="pilot-talk-mic"
                onClick={onMic}
                aria-label={copy.talkListening}
                className={cn(
                  "flex h-8 w-8 items-center justify-center border",
                  mic === "listening" && "assistant-mic-listen border-ok text-ok",
                  mic === "speaking" && "border-orange text-orange",
                  mic === "processing" && "border-attn text-attn",
                  mic === "idle" && "border-bridge-line text-bridge-dim",
                )}
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M8 1.5A2.2 2.2 0 0 0 5.8 3.7v3.1a2.2 2.2 0 1 0 4.4 0V3.7A2.2 2.2 0 0 0 8 1.5Zm-4 5.4a.7.7 0 0 0-1.4 0 5.4 5.4 0 0 0 4.7 5.3v1.6H6.1a.7.7 0 0 0 0 1.4h3.8a.7.7 0 0 0 0-1.4H8.7v-1.6A5.4 5.4 0 0 0 13.4 6.9a.7.7 0 0 0-1.4 0 4 4 0 0 1-8 0Z"
                  />
                </svg>
              </button>
              <button
                type="submit"
                className="bg-orange px-2.5 py-1 font-ui text-[11px] font-medium text-white"
              >
                {send}
              </button>
            </form>
          </section>

          <section className="relative flex min-h-[14rem] flex-col border border-orange/25 bg-bridge-bg">
            <div className="flex items-center justify-between px-3 pt-2">
              <p className="font-mono text-[9px] tracking-[0.2em] text-orange">
                {copy.talkListening}
              </p>
              <span
                data-testid="studio-peak"
                className="font-mono text-[9px] tracking-[0.18em]"
                style={{ color: peak && live ? VU_RED : "rgb(51 211 166 / 0.45)" }}
              >
                {copy.peakHold}
              </span>
            </div>
            <div className="grid min-h-0 flex-1 grid-cols-[1fr_1.1rem] gap-2 px-2 pb-2 pt-1">
              <StudioWave samples={wave} peak={peak} live={live && voiceOn} />
              <StudioVu
                levels={levels}
                peak={peak}
                live={live && voiceOn}
                vertical
              />
            </div>
            <div className="px-3 pb-3">
              <PilotSoundDock
                voiceOn={voiceOn}
                speaking={mic === "speaking"}
                listening={mic === "listening"}
                levels={levels}
                peak={peak}
                soundOnLabel={copy.soundOn}
                soundOffLabel={copy.soundOff}
                onToggle={onToggleSound}
              />
            </div>
            <p className="px-3 pb-3 text-end font-mono text-[10px] tracking-[0.22em] text-orange/80">
              [ {status} ]
            </p>
            <p className="px-3 pb-4 font-mono text-[10px] leading-relaxed text-bridge-dim">
              {copy.bargeHint}
            </p>
          </section>
        </div>
      </div>
    </div>,
    document.body,
  );
}
