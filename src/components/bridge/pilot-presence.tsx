"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import {
  PILOT_LOOP_FRAMES,
  PILOT_VIDEOS,
  loopMs,
  loopStep,
  type PilotMood,
} from "@/lib/pilot-presence";

export type PilotPresenceSize = "rail" | "talk" | "dock" | "watch";

const SIZE: Record<PilotPresenceSize, string> = {
  rail: "h-11 w-11 rounded-full",
  talk: "h-10 w-10 rounded-full",
  dock: "h-[10rem] w-[7.15rem] rounded-2xl",
  watch: "h-[10.5rem] w-[7.5rem] rounded-2xl sm:h-[13.25rem] sm:w-[9.4rem]",
};

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return reduce;
}

export function PilotPresence({
  mood,
  size,
  level = 0,
  speaking,
  listening,
  className,
}: {
  mood: PilotMood;
  size: PilotPresenceSize;
  level?: number;
  speaking?: boolean;
  listening?: boolean;
  className?: string;
}) {
  const drive = Math.max(0, Math.min(1, level));
  const reduce = usePrefersReducedMotion();
  const frames = PILOT_LOOP_FRAMES[mood];
  const large = size === "dock" || size === "watch";
  const [frame, setFrame] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const dirRef = useRef<1 | -1>(1);
  const frameRef = useRef(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    dirRef.current = 1;
    frameRef.current = 0;
    setFrame(0);
    setVideoReady(false);
  }, [mood]);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      const step = loopStep(frameRef.current, frames.length, dirRef.current);
      dirRef.current = step.dir;
      frameRef.current = step.index;
      setFrame(step.index);
    }, loopMs(mood, Boolean(speaking), drive));
    return () => window.clearInterval(id);
  }, [mood, speaking, drive, frames.length, reduce]);

  useEffect(() => {
    const node = videoRef.current;
    if (!node || reduce) return;
    node.playbackRate = speaking || mood === "speak" ? 1.05 + drive * 0.45 : 0.88;
    void node.play().then(
      () => setVideoReady(true),
      () => setVideoReady(false),
    );
  }, [mood, speaking, drive, reduce, large]);

  const liveFrame = frames[Math.min(frame, frames.length - 1)] ?? frames[0];
  const useVideo = large && videoReady && !reduce;
  const video = PILOT_VIDEOS[mood];

  return (
    <span
      data-testid="pilot-presence"
      data-mood={mood}
      data-size={size}
      data-frame={frame}
      data-anim={useVideo ? "video" : "flip"}
      data-speaking={speaking ? "true" : "false"}
      data-listening={listening ? "true" : "false"}
      className={cn("pilot-presence relative inline-flex shrink-0 overflow-hidden", SIZE[size], className)}
      style={{ "--pilot-level": String(drive) } as CSSProperties}
    >
      <span className="pilot-presence-well" aria-hidden />
      {large ? (
        <video
          key={mood}
          ref={videoRef}
          className={cn("pilot-presence-video", useVideo && "is-live")}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          poster={frames[0]}
          aria-hidden
        >
          <source src={video.webm} type="video/webm" />
          <source src={video.mp4} type="video/mp4" />
        </video>
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={liveFrame}
        alt=""
        draggable={false}
        className={cn("pilot-presence-plate is-live", useVideo && "is-under")}
      />
      <span className="pilot-presence-scan" aria-hidden />
      <span className="pilot-presence-rim" aria-hidden />
    </span>
  );
}
