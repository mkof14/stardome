"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import type { PilotDemoCopy } from "@/lib/i18n/pilot-demo-copy";
import { HudGlyph } from "@/components/bridge/hud-icons";
import { HudBezel } from "@/components/bridge/hud-bezel";
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
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-3 sm:p-6"
    >
      <HudBezel
        testId="pilot-talk-hud"
        className="pilot-talk-hud flex h-[min(38rem,calc(100vh-2.5rem))] w-full max-w-6xl flex-col text-[#E7ECEF]"
        status={status}
        onClose={onClose}
        closeLabel={title}
        closeTestId="pilot-talk-close"
      >
        <div className="relative grid min-h-0 flex-1 gap-4 pb-8 sm:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
          <section className="relative flex min-h-[18rem] flex-col overflow-hidden rounded-2xl bg-[var(--panel)] shadow-[0_16px_40px_rgb(0_0_0/0.35)]">
            <header className="relative z-[1] flex items-center justify-between px-3 py-2">
              <p className="font-body text-lg font-semibold tracking-tight text-[#E7ECEF]">
                {title}
              </p>
              <span className="flex items-center gap-1 text-[#7c8894]">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg">
                  <HudGlyph name="minus" className="h-3.5 w-3.5" />
                </span>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg">
                  <HudGlyph name="close" className="h-3.5 w-3.5" />
                </span>
              </span>
            </header>
            <div
              data-testid="pilot-talk-chat"
              className="relative z-[1] min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3"
            >
              {recent.length === 0 ? (
                <p className="border-s-2 border-orange ps-3 font-body text-sm text-[#7c8894]">
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
                      <span className="mb-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange/15 text-orange">
                        <HudGlyph name="talk" className="h-4 w-4" />
                      </span>
                    ) : null}
                    <p
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3 py-2 font-body text-[15px] leading-relaxed",
                        item.role === "user"
                          ? "bg-orange text-white"
                          : item.role === "error"
                            ? "border border-attn text-attn"
                            : "bg-[var(--page)] text-[#E7ECEF]",
                      )}
                    >
                      {showing}
                    </p>
                    {item.role === "user" ? (
                      <span className="mb-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[var(--stroke)] bg-[var(--page)] text-[#7c8894]">
                        <HudGlyph name="person" className="h-3.5 w-3.5" />
                      </span>
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
              className="relative z-[1] flex items-center gap-2 bg-[var(--page)] px-3 py-2"
            >
              <input
                data-testid="pilot-talk-input"
                value={draft}
                onChange={(event) => onDraft(event.target.value)}
                placeholder={ask}
                className="min-w-0 flex-1 bg-transparent py-1.5 font-body text-sm text-[#E7ECEF] outline-none placeholder:text-[#7c8894]"
              />
              <button
                type="button"
                data-testid="pilot-talk-mic"
                onClick={onMic}
                aria-label={copy.talkListening}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl",
                  mic === "listening" && "assistant-mic-listen bg-ok/15 text-ok",
                  mic === "speaking" && "bg-orange/15 text-orange",
                  mic === "processing" && "text-attn",
                  mic === "idle" && "text-[#7c8894]",
                )}
              >
                <HudGlyph name="mic" className="h-4 w-4" />
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-xl bg-orange px-3 py-2 font-body text-sm font-medium text-white"
              >
                <HudGlyph name="send" className="h-4 w-4" />
                {send}
              </button>
            </form>
          </section>

          <section className="relative flex min-h-[14rem] flex-col">
            <StudioWave samples={wave} peak={peak} live={live && voiceOn} hud />
            <div className="mt-auto px-1 pb-2">
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
          </section>
        </div>
      </HudBezel>
    </div>,
    document.body,
  );
}
