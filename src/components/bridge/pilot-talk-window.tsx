"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import type { PilotDemoCopy } from "@/lib/i18n/pilot-demo-copy";
import { HudBezel } from "@/components/bridge/hud-bezel";
import { ChamferFrame, HudGlyph, PilotHex } from "@/components/bridge/hud-icons";
import { HudVisor } from "@/components/bridge/hud-visor";
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
          <section className="relative flex min-h-[18rem] flex-col overflow-hidden bg-[#111820] shadow-[0_16px_40px_rgb(0_0_0/0.35)]">
            <HudVisor variant="inset" />
            <header className="relative z-[1] flex items-center justify-between px-3 py-2">
              <p className="flex items-center gap-2 font-heading text-lg font-bold tracking-wide text-[#E7ECEF]">
                <PilotHex glow />
                {title}
              </p>
              <span className="flex items-center gap-1 text-orange">
                <ChamferFrame className="h-7 w-7">
                  <HudGlyph name="minus" className="h-3 w-3" />
                </ChamferFrame>
                <ChamferFrame className="h-7 w-7">
                  <HudGlyph name="close" className="h-3 w-3" />
                </ChamferFrame>
              </span>
            </header>
            <div
              data-testid="pilot-talk-chat"
              className="relative z-[1] min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3"
            >
              {recent.length === 0 ? (
                <p className="border-s-2 border-orange ps-3 text-xs text-[#7c8894]">
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
                        <PilotHex className="h-5 w-5" />
                      </span>
                    ) : null}
                    <p
                      className={cn(
                        "max-w-[85%] px-2.5 py-2 text-sm leading-relaxed",
                        item.role === "user"
                          ? "bg-orange text-white"
                          : item.role === "error"
                            ? "border border-attn text-attn"
                            : "bg-[#0a0f14] text-[#E7ECEF]",
                      )}
                    >
                      {showing}
                    </p>
                    {item.role === "user" ? (
                      <span className="mb-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center border border-[#1c2830] bg-[#0a0f14] text-[#7c8894]">
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
              className="relative z-[1] flex items-center gap-2 bg-[#0a0f14] px-3 py-2"
            >
              <input
                data-testid="pilot-talk-input"
                value={draft}
                onChange={(event) => onDraft(event.target.value)}
                placeholder={ask}
                className="min-w-0 flex-1 bg-transparent py-1.5 font-ui text-sm text-[#E7ECEF] outline-none placeholder:text-[#7c8894]"
              />
              <button
                type="button"
                data-testid="pilot-talk-mic"
                onClick={onMic}
                aria-label={copy.talkListening}
                className={cn(
                  "flex h-8 w-8 items-center justify-center",
                  mic === "listening" && "assistant-mic-listen text-ok",
                  mic === "speaking" && "text-orange",
                  mic === "processing" && "text-attn",
                  mic === "idle" && "text-[#7c8894]",
                )}
              >
                <ChamferFrame
                  active={mic === "listening" || mic === "speaking"}
                  className="h-8 w-8"
                >
                  <HudGlyph name="mic" className="h-3.5 w-3.5" />
                </ChamferFrame>
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1 bg-orange px-2.5 py-1 font-ui text-[11px] font-medium text-white"
              >
                <HudGlyph name="send" className="h-3 w-3" />
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
