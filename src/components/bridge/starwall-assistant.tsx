"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FlagIcon } from "@/components/flag-icon";
import { HudGlyph } from "@/components/bridge/hud-icons";
import { cn } from "@/lib/cn";
import { useBlackBox } from "@/lib/black-box";
import { useBridgeSession } from "@/lib/bridge-session";
import { syncConversationToCloud } from "@/lib/cloud-sync";
import {
  CLEAR_SCREENS_EVENT,
  HELM_OPEN_EVENT,
  PILOT_ASK_EVENT,
  PILOT_DEMO_CONTROL_EVENT,
  PILOT_DEMO_EVENT,
  publishHelmState,
  publishPilotSpeakFocus,
  type PilotDemoControl,
} from "@/lib/helm-events";
import { speechProsody, speechToneFor, type SpeechTone } from "@/lib/pilot-speech";
import {
  PilotDesk,
  PilotDeskBar,
  PilotUnreadChip,
  type PilotScreen,
} from "@/components/bridge/pilot-desk";
import { pilotDeskCopy } from "@/lib/i18n/pilot-desk-copy";
import { buildPilotWatch, watchReply } from "@/lib/pilot-watch";
import { DEMO_CLEARED_EVENT } from "@/lib/demo-storage";
import { listConversations, putConversation, type StoredConversation } from "@/lib/local-db";
import { isAuthRoute, useAuthSession } from "@/lib/auth-session";
import { canUseHelm } from "@/lib/rbac";
import { usePreferences } from "@/lib/i18n/context";
import { hudFor } from "@/lib/i18n/hud";
import { pilotChrome } from "@/lib/i18n/pilot-chrome";
import { useHud } from "@/lib/i18n/use-hud";
import { localeMeta, locales, type Locale, isLocale } from "@/lib/i18n/locales";
import { useAppMode } from "@/lib/mode";
import { usePathname } from "next/navigation";
import { pilotDemoCopy } from "@/lib/i18n/pilot-demo-copy";
import { demoBeats, type DemoBeat } from "@/lib/pilot-demo";
import {
  isLikelyMaleVoice,
  maleVoiceFor,
  pickVoice,
  SPEAK_BCP47,
  SpeechEngine,
  voiceNeed,
  type NeuralVoiceStatus,
} from "@/lib/pilot-voice";
import {
  PilotDemoDock,
  PilotDemoStage,
  PilotSoundDock,
  PilotVoiceNeed,
  PilotWatchCalls,
} from "@/components/bridge/pilot-demo";
import {
  cueForDemoBeat,
  cuesEnabled,
  playPilotCue,
  writeCuesEnabled,
  type PilotCue,
} from "@/lib/pilot-cues";
import { PilotTalkWindow } from "@/components/bridge/pilot-talk-window";
import {
  BARGE_GRACE_MS,
  shouldCutIn,
  vadHotFrames,
  vadTriggered,
} from "@/lib/barge-in";
import {
  meterFromTimeDomain,
  silenceBars,
  silenceWave,
  STUDIO_BARS,
  type StudioReading,
} from "@/lib/studio-meter";

type MicState = "idle" | "listening" | "processing" | "speaking";

type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "error";
  text: string;
};

function messageId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `helm-${crypto.randomUUID()}`;
  }
  return `helm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const TYPE_MS = 28;

export function Helm() {
  const pathname = usePathname();
  const session = useBridgeSession();
  const { session: auth } = useAuthSession();
  const helmAllowed = !auth || canUseHelm(auth.role);
  const { live } = useAppMode();
  const { locale } = useHud();
  const { setLocale } = usePreferences();
  const { recordConversation } = useBlackBox();
  const [open, setOpen] = useState(false);
  const [langsOpen, setLangsOpen] = useState(false);
  const [mic, setMic] = useState<MicState>("idle");
  const [voiceOn, setVoiceOn] = useState(true);
  const [cuesOn, setCuesOn] = useState(() => cuesEnabled());
  const [levels, setLevels] = useState<number[]>(() => silenceBars());
  const [wave, setWave] = useState<number[]>(() => silenceWave());
  const [peak, setPeak] = useState(false);
  const [talkHud, setTalkHud] = useState(false);
  const [recogLang, setRecogLang] = useState<Locale>(locale);
  const surface = pilotChrome(recogLang);
  const helmHud = hudFor(recogLang).helm;
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typed, setTyped] = useState("");
  const [typingId, setTypingId] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [screen, setScreen] = useState<PilotScreen>("chat");
  const [unread, setUnread] = useState(false);
  const [notePulse, setNotePulse] = useState(false);
  const [drilling, setDrilling] = useState(false);
  const [demoBeat, setDemoBeat] = useState<DemoBeat | null>(null);
  const [demoStep, setDemoStep] = useState(0);
  const [demoTotal, setDemoTotal] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [neural, setNeural] = useState<NeuralVoiceStatus>(() => ({
    ready: true,
    voice: maleVoiceFor(locale).voice,
    provider: "edge",
  }));
  const listRef = useRef<HTMLDivElement | null>(null);
  const langRef = useRef<HTMLDivElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const sendRef = useRef<(text: string) => Promise<void>>(async () => {});
  const runDemoRef = useRef<(from?: number) => Promise<void>>(async () => {});
  const controlDemoRef = useRef<(action: PilotDemoControl) => void>(() => {});
  const lastNote = useRef<string | null>(null);
  const openRef = useRef(open);
  const voiceOnRef = useRef(voiceOn);
  const cuesOnRef = useRef(cuesOn);
  const demoCancel = useRef(false);
  const drillingRef = useRef(false);
  const demoIndexRef = useRef(0);
  const runToken = useRef(0);
  const speakGen = useRef(0);
  const neuralRef = useRef<HTMLAudioElement | null>(null);
  const speakAbort = useRef<AbortController | null>(null);
  const playRaf = useRef<number | null>(null);
  const playCtx = useRef<AudioContext | null>(null);
  const playWait = useRef<(() => void) | null>(null);
  const bargeArmed = useRef(false);
  const listenMode = useRef<"off" | "push" | "barge">("off");
  const spokenText = useRef("");
  const speakStartedAt = useRef(0);
  const cutLock = useRef(false);
  const keepListen = useRef(false);
  const vadRaf = useRef<number | null>(null);
  const vadCtx = useRef<AudioContext | null>(null);
  const vadHot = useRef(0);
  const peakHoldUntil = useRef(0);
  const micRef = useRef<MicState>(mic);
  const menuId = useId();
  const desk = pilotDeskCopy(recogLang);
  const demoCopy = pilotDemoCopy(recogLang);
  const watch = buildPilotWatch(session, recogLang);
  const need = voiceNeed(recogLang, voices, neural);
  openRef.current = open;
  voiceOnRef.current = voiceOn;
  cuesOnRef.current = cuesOn;
  micRef.current = mic;

  useEffect(() => {
    setCuesOn(cuesEnabled());
  }, []);

  function cue(kind: PilotCue) {
    playPilotCue(kind, cuesOnRef.current);
  }

  function toggleCues() {
    setCuesOn((current) => {
      const next = !current;
      writeCuesEnabled(next);
      cuesOnRef.current = next;
      if (next) playPilotCue("open", true);
      return next;
    });
  }

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    const load = () => setVoices(synth.getVoices());
    load();
    synth.addEventListener("voiceschanged", load);
    return () => synth.removeEventListener("voiceschanged", load);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const mapped = maleVoiceFor(recogLang);
    setNeural((current) => ({
      ready: current.ready,
      voice: mapped.voice,
      provider: current.provider,
    }));
    fetch(`/api/tts?locale=${encodeURIComponent(recogLang)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("tts"))))
      .then((data: { ready?: unknown; voice?: unknown; provider?: unknown }) => {
        if (cancelled) return;
        setNeural({
          ready: data.ready !== false,
          voice: typeof data.voice === "string" ? data.voice : mapped.voice,
          provider: typeof data.provider === "string" ? data.provider : "edge",
        });
      })
      .catch(() => {
        if (!cancelled) {
          setNeural({ ready: false, voice: mapped.voice, provider: null });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [recogLang]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, typed, open]);

  useEffect(() => {
    function onOpen(event: Event) {
      const screen = (event as CustomEvent<{ screen?: PilotScreen }>).detail?.screen;
      setOpen(true);
      setUnread(false);
      if (screen) setScreen(screen);
    }
    window.addEventListener(HELM_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(HELM_OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    function onAsk(event: Event) {
      const prompt =
        event instanceof CustomEvent
          ? String((event.detail as { prompt?: unknown } | undefined)?.prompt ?? "").trim()
          : "";
      if (!prompt) return;
      setOpen(true);
      setUnread(false);
      void sendRef.current(prompt);
    }
    window.addEventListener(PILOT_ASK_EVENT, onAsk);
    return () => window.removeEventListener(PILOT_ASK_EVENT, onAsk);
  }, []);

  useEffect(() => {
    function onDemo() {
      setOpen(true);
      setUnread(false);
      if (drillingRef.current) return;
      void runDemoRef.current();
    }
    function onControl(event: Event) {
      const action = (event as CustomEvent<PilotDemoControl>).detail;
      if (!action) return;
      controlDemoRef.current(action);
    }
    window.addEventListener(PILOT_DEMO_EVENT, onDemo);
    window.addEventListener(PILOT_DEMO_CONTROL_EVENT, onControl);
    return () => {
      window.removeEventListener(PILOT_DEMO_EVENT, onDemo);
      window.removeEventListener(PILOT_DEMO_CONTROL_EVENT, onControl);
    };
  }, []);

  useEffect(() => {
    setRecogLang(locale);
  }, [locale]);

  function selectPilotLang(code: Locale) {
    setRecogLang(code);
    setLocale(code);
    setLangsOpen(false);
  }

  useEffect(() => {
    publishHelmState({ open, unread, urgent: watch.urgent });
  }, [open, unread, watch.urgent]);

  useEffect(() => {
    return () => publishPilotSpeakFocus({ focus: null, speaking: false });
  }, []);

  useEffect(() => {
    let cancelled = false;
    void listConversations()
      .then((rows) => {
        if (cancelled || !rows.length) return;
        setMessages(
          rows.map((row) => ({
            id: row.id,
            role: row.role,
            text: row.content,
          })),
        );
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (live) {
      demoCancel.current = true;
      drillingRef.current = false;
      setDrilling(false);
      setMessages([]);
      setTyped("");
      setTypingId(null);
    }
  }, [live]);

  useEffect(() => {
    if (!pathname.startsWith("/interface")) {
      lastNote.current = null;
      return;
    }
    if (lastNote.current === watch.noteKey) return;
    const first = lastNote.current === null;
    lastNote.current = watch.noteKey;
    const hasPicture =
      Boolean(session.scenarioId) || session.live || Boolean(session.faultId);
    setScreen(hasPicture ? "advice" : "chat");
    if (!openRef.current && hasPicture && !first) {
      setUnread(true);
      setNotePulse(true);
      cue(watch.urgent ? "urgent" : "note");
    }
    if (!hasPicture || first) return;
    const brief = watchReply(session, recogLang);
    const assistantId = messageId();
    setMessages((current) => {
      const last = current[current.length - 1];
      if (last?.role === "assistant" && last.text === brief) return current;
      return [...current, { id: assistantId, role: "assistant", text: brief }];
    });
    setTypingId(assistantId);
  }, [pathname, watch.noteKey, watch.urgent, session, recogLang]);

  useEffect(() => {
    function onCleared() {
      setMessages([]);
      setTyped("");
      setTypingId(null);
      setScreen("chat");
      setUnread(false);
      setNotePulse(false);
      setTalkHud(false);
      stopDemo();
      stopListening();
      stopSpeech();
    }
    window.addEventListener(DEMO_CLEARED_EVENT, onCleared);
    window.addEventListener(CLEAR_SCREENS_EVENT, onCleared);
    return () => {
      window.removeEventListener(DEMO_CLEARED_EVENT, onCleared);
      window.removeEventListener(CLEAR_SCREENS_EVENT, onCleared);
    };
  }, []);

  function persistChat(row: StoredConversation) {
    void putConversation(row).catch(() => undefined);
    if (row.role !== "error") {
      void syncConversationToCloud(row, session.vessel).catch(() => undefined);
    }
  }

  useEffect(() => {
    if (typingId === null) return;
    const target = messages.find((item) => item.id === typingId);
    if (!target) return;
    setTyped("");
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTyped(target.text.slice(0, index));
      if (index >= target.text.length) {
        window.clearInterval(timer);
        setTypingId(null);
      }
    }, TYPE_MS);
    return () => window.clearInterval(timer);
  }, [typingId, messages]);

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (
        event.target instanceof Element &&
        !langRef.current?.contains(event.target)
      ) {
        setLangsOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (audioRef.current) void audioRef.current.close();
      if (vadRaf.current !== null) window.cancelAnimationFrame(vadRaf.current);
      if (vadCtx.current) void vadCtx.current.close();
    };
  }, []);

  function applyReading(reading: StudioReading) {
    setLevels(reading.bars);
    setWave(reading.wave);
    if (reading.peak) peakHoldUntil.current = performance.now() + 450;
    setPeak(performance.now() < peakHoldUntil.current);
  }

  function clearMeter() {
    setLevels(silenceBars());
    setWave(silenceWave());
    setPeak(false);
    peakHoldUntil.current = 0;
  }

  function stopVad() {
    if (vadRaf.current !== null) {
      window.cancelAnimationFrame(vadRaf.current);
      vadRaf.current = null;
    }
    vadHot.current = 0;
    if (vadCtx.current) {
      void vadCtx.current.close();
      vadCtx.current = null;
    }
  }

  function stopMeter() {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    clearMeter();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (audioRef.current) {
      void audioRef.current.close();
      audioRef.current = null;
    }
  }

  function stopListening(silent = false) {
    bargeArmed.current = false;
    listenMode.current = "off";
    keepListen.current = false;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    stopVad();
    stopMeter();
    if (!silent) setMic((current) => (current === "listening" ? "idle" : current));
  }

  function startMeter(stream: MediaStream) {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (audioRef.current) {
      void audioRef.current.close();
      audioRef.current = null;
    }
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);
    audioRef.current = context;
    const samples = new Uint8Array(analyser.fftSize);

    const tick = () => {
      analyser.getByteTimeDomainData(samples);
      applyReading(meterFromTimeDomain(samples, STUDIO_BARS));
      rafRef.current = window.requestAnimationFrame(tick);
    };
    rafRef.current = window.requestAnimationFrame(tick);
    void context.resume();
  }

  function startVad(stream: MediaStream) {
    stopVad();
    const Ctor =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    vadCtx.current = ctx;
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    source.connect(analyser);
    const samples = new Uint8Array(analyser.fftSize);
    const tick = () => {
      analyser.getByteTimeDomainData(samples);
      const reading = meterFromTimeDomain(samples, STUDIO_BARS);
      vadHot.current = vadHotFrames(reading.rms, vadHot.current);
      if (
        bargeArmed.current &&
        !cutLock.current &&
        vadTriggered(vadHot.current) &&
        performance.now() - speakStartedAt.current >= BARGE_GRACE_MS
      ) {
        void yieldToOfficer();
        return;
      }
      vadRaf.current = window.requestAnimationFrame(tick);
    };
    vadRaf.current = window.requestAnimationFrame(tick);
    void ctx.resume();
  }

  function releaseBarge() {
    bargeArmed.current = false;
    stopVad();
    if (listenMode.current !== "barge") return;
    listenMode.current = "off";
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  function takeOfficerFirst(said: string) {
    if (!said.trim()) return;
    cutLock.current = true;
    demoCancel.current = true;
    drillingRef.current = false;
    setDrilling(false);
    setDemoBeat(null);
    speakGen.current += 1;
    haltAudio();
    bargeArmed.current = false;
    listenMode.current = "off";
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    stopVad();
    setTalkHud(false);
    setOpen(true);
    void sendRef.current(said);
  }

  function yieldToOfficer() {
    if (cutLock.current) return;
    cutLock.current = true;
    bargeArmed.current = false;
    haltAudio();
    speakGen.current += 1;
    setMic("listening");
    listenMode.current = "push";
    keepListen.current = true;
    stopVad();
    if (streamRef.current) startMeter(streamRef.current);
  }

  function handleHeard(said: string, isFinal: boolean) {
    const text = said.trim();
    if (!text) return;
    if (listenMode.current === "barge" || micRef.current === "speaking") {
      if (!isFinal && text.length < 4) return;
      if (
        !shouldCutIn(
          text,
          spokenText.current,
          speakStartedAt.current,
          Date.now(),
        )
      ) {
        return;
      }
      takeOfficerFirst(text);
      return;
    }
    if (!isFinal) return;
    void sendRef.current(text);
  }

  async function startListen(mode: "push" | "barge") {
    const Engine = SpeechEngine();
    if (!Engine) {
      if (mode === "push") setMicError(helmHud.noSpeech);
      return false;
    }
    if (
      mode === "barge" &&
      bargeArmed.current &&
      recognitionRef.current &&
      streamRef.current
    ) {
      return true;
    }
    try {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      if (mode === "push") {
        stopVad();
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;
      listenMode.current = mode;
      if (mode === "push") {
        bargeArmed.current = false;
        startMeter(stream);
        setMic("listening");
        cue("listen");
      } else {
        bargeArmed.current = true;
        startVad(stream);
      }
      setMicError(null);

      const recognition = new Engine();
      recognition.lang = SPEAK_BCP47[recogLang];
      recognition.interimResults = true;
      recognition.continuous = mode === "barge";
      recognitionRef.current = recognition;

      recognition.onresult = (event) => {
        const last = event.results[event.results.length - 1];
        const said = last?.[0]?.transcript?.trim() ?? "";
        handleHeard(said, Boolean(last?.isFinal));
      };
      recognition.onerror = (event) => {
        const error = (event as Event & { error?: string }).error;
        if (error === "no-speech" || error === "aborted") return;
        if (listenMode.current === "barge") return;
        stopListening();
        setMicError(helmHud.micStopped);
      };
      recognition.onend = () => {
        if (
          (listenMode.current === "barge" && bargeArmed.current) ||
          (keepListen.current && micRef.current === "listening")
        ) {
          try {
            recognition.start();
          } catch {
            // already started
          }
          return;
        }
        if (listenMode.current === "push" && micRef.current === "listening") {
          stopMeter();
          listenMode.current = "off";
          setMic("idle");
        }
      };
      recognition.start();
      return true;
    } catch {
      if (mode === "push") {
        setMicError(helmHud.micDenied);
        stopListening(true);
        setMic("idle");
      }
      return false;
    }
  }

  async function toggleMic() {
    if (mic === "listening") {
      stopListening();
      setTalkHud(false);
      return;
    }
    if (mic === "processing") return;
    const keepHud = drillingRef.current || mic === "speaking";
    if (keepHud) {
      stopDemo();
      setTalkHud(false);
      keepListen.current = true;
    }
    await startListen("push");
  }

  function haltAudio() {
    speakAbort.current?.abort();
    speakAbort.current = null;
    playWait.current?.();
    playWait.current = null;
    if (playRaf.current !== null) {
      window.cancelAnimationFrame(playRaf.current);
      playRaf.current = null;
    }
    if (playCtx.current) {
      void playCtx.current.close();
      playCtx.current = null;
    }
    const clip = neuralRef.current;
    if (clip) {
      clip.onended = null;
      clip.onerror = null;
      clip.pause();
      clip.removeAttribute("src");
      clip.load();
      neuralRef.current = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  function stopSpeech() {
    speakGen.current += 1;
    haltAudio();
    releaseBarge();
    clearMeter();
    setMic((current) => (current === "speaking" ? "idle" : current));
  }

  function startPlayMeter(audio: HTMLAudioElement) {
    if (playRaf.current !== null) {
      window.cancelAnimationFrame(playRaf.current);
      playRaf.current = null;
    }
    if (playCtx.current) {
      void playCtx.current.close();
      playCtx.current = null;
    }
    const Ctor =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    playCtx.current = ctx;
    const source = ctx.createMediaElementSource(audio);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);
    analyser.connect(ctx.destination);
    const samples = new Uint8Array(analyser.fftSize);
    const tick = () => {
      analyser.getByteTimeDomainData(samples);
      applyReading(meterFromTimeDomain(samples, STUDIO_BARS));
      playRaf.current = window.requestAnimationFrame(tick);
    };
    playRaf.current = window.requestAnimationFrame(tick);
    void ctx.resume();
  }

  function toggleSpeaker() {
    setVoiceOn((current) => {
      if (current) stopSpeech();
      return !current;
    });
  }

  function speakBrowser(
    text: string,
    locale: typeof recogLang,
    gen: number,
    tone: SpeechTone,
  ) {
    return new Promise<void>((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        if (gen === speakGen.current) {
          setMic((current) => (current === "speaking" ? "idle" : current));
        }
        resolve();
      };
      if (typeof window === "undefined" || !window.speechSynthesis) {
        finish();
        return;
      }
      window.speechSynthesis.cancel();
      const voice = speechProsody(tone);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = SPEAK_BCP47[locale];
      utterance.rate = voice.browserRate;
      const installed = window.speechSynthesis.getVoices();
      const match = pickVoice(installed.length ? installed : voices, locale);
      if (match) {
        const full = installed.find(
          (voice) => voice.name === match.name && voice.lang === match.lang,
        );
        if (full) utterance.voice = full;
        utterance.pitch = isLikelyMaleVoice(match.name)
          ? voice.browserPitch
          : Math.max(0.62, voice.browserPitch - 0.08);
      } else {
        utterance.pitch = voice.browserPitch;
      }
      utterance.onend = finish;
      utterance.onerror = finish;
      window.speechSynthesis.speak(utterance);
      window.setTimeout(finish, Math.min(18000, 700 + text.length * 52));
    });
  }

  async function speakReply(
    text: string,
    langCode: string,
    force = false,
    tone: SpeechTone = "brief",
  ) {
    if ((!voiceOnRef.current && !force) || typeof window === "undefined") {
      return;
    }
    const spoken = text.trim();
    if (!spoken) return;
    const gen = ++speakGen.current;
    haltAudio();
    const locale = isLocale(langCode) ? langCode : recogLang;
    spokenText.current = spoken;
    speakStartedAt.current = performance.now();
    cutLock.current = false;
    if (!drillingRef.current && !openRef.current) {
      setTalkHud(true);
    } else {
      setTalkHud(false);
    }
    setMic("speaking");
    if (!drillingRef.current) cue(tone === "warn" ? "warn" : "speak");
    void startListen("barge");
    try {
      const controller = new AbortController();
      speakAbort.current = controller;
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: spoken, locale, tone }),
        signal: controller.signal,
      });
      if (gen !== speakGen.current) return;
      if (res.ok) {
        const blob = await res.blob();
        if (gen !== speakGen.current) return;
        const url = URL.createObjectURL(blob);
        const clip = new Audio(url);
        neuralRef.current = clip;
        startPlayMeter(clip);
        await new Promise<void>((resolve) => {
          const finish = () => {
            if (playWait.current === finish) playWait.current = null;
            URL.revokeObjectURL(url);
            resolve();
          };
          playWait.current = finish;
          clip.onended = finish;
          clip.onerror = finish;
          void clip.play().catch(finish);
          window.setTimeout(finish, Math.min(90_000, 2500 + spoken.length * 80));
        });
        if (gen === speakGen.current) {
          setNeural({
            ready: true,
            voice: res.headers.get("X-Pilot-Voice") ?? maleVoiceFor(locale).voice,
            provider: res.headers.get("X-Pilot-Provider") ?? "edge",
          });
          if (!drillingRef.current) releaseBarge();
          setMic((current) => (current === "speaking" ? "idle" : current));
          if (!drillingRef.current) setTalkHud(false);
          clearMeter();
        }
        return;
      }
    } catch {
      // Aborted or neural path down — browser male voice next.
    }
    if (gen !== speakGen.current) return;
    setNeural((current) => ({ ...current, ready: false }));
    await speakBrowser(spoken, locale, gen, tone);
    if (gen === speakGen.current) {
      if (!drillingRef.current) releaseBarge();
      if (!drillingRef.current) setTalkHud(false);
      clearMeter();
    }
  }

  function stopDemo() {
    const was = drillingRef.current;
    runToken.current += 1;
    demoCancel.current = true;
    drillingRef.current = false;
    setDrilling(false);
    setDemoBeat(null);
    setTalkHud(false);
    publishPilotSpeakFocus({ focus: null, speaking: false });
    stopSpeech();
    if (was) cue("stop");
  }

  function controlDemo(action: PilotDemoControl) {
    if (action === "stop") {
      stopDemo();
      return;
    }
    if (action === "play") {
      void runDemo();
      return;
    }
    if (action === "reset") {
      void runDemo(0);
      return;
    }
    const beats = demoBeats(session, recogLang);
    if (action === "back") {
      void runDemo(Math.max(0, demoIndexRef.current - 1));
      return;
    }
    if (action === "next") {
      void runDemo(Math.min(Math.max(beats.length - 1, 0), demoIndexRef.current + 1));
    }
  }

  async function runDemo(from?: number) {
    if (from === undefined && drillingRef.current) {
      stopDemo();
      return;
    }
    const token = ++runToken.current;
    stopSpeech();
    demoCancel.current = false;
    drillingRef.current = true;
    setDrilling(true);
    setTalkHud(false);
    setOpen(true);
    setUnread(false);
    setVoiceOn(true);
    voiceOnRef.current = true;
    cue("demo");
    const beats = demoBeats(session, recogLang);
    const start = Math.max(0, from ?? 0);
    setDemoTotal(beats.length);
    for (let i = start; i < beats.length; i += 1) {
      if (token !== runToken.current || demoCancel.current) return;
      const beat = beats[i];
      if (!beat) break;
      demoIndexRef.current = i;
      setDemoStep(i + 1);
      setDemoBeat(beat);
      if (beat.focus === "instruments" || beat.focus === "advice" || beat.focus === "comms") {
        setScreen(beat.focus);
      } else {
        setScreen("chat");
      }
      const id = messageId();
      setMessages((current) => [
        ...current,
        {
          id,
          role: beat.role === "officer" ? "user" : "assistant",
          text: beat.text,
        },
      ]);
      cue(cueForDemoBeat(beat));
      if (beat.speak) {
        publishPilotSpeakFocus({
          focus: beat.focus,
          speaking: true,
          tone: beat.tone,
        });
        await speakReply(beat.text, recogLang, false, beat.tone);
        if (token === runToken.current) {
          publishPilotSpeakFocus({ focus: beat.focus, speaking: false });
        }
      } else {
        await new Promise((resolve) => window.setTimeout(resolve, 520));
      }
    }
    if (token !== runToken.current) return;
    drillingRef.current = false;
    setDrilling(false);
    setDemoBeat(null);
    setTalkHud(false);
    publishPilotSpeakFocus({ focus: null, speaking: false });
    releaseBarge();
    setMic("idle");
    cue("stop");
  }

  async function sendMessage(text: string) {
    const clean = text.trim();
    if (!clean) return;
    stopDemo();
    stopListening(true);
    const userId = messageId();
    const userAt = new Date().toISOString();
    setMessages((current) => [
      ...current,
      { id: userId, role: "user", text: clean },
    ]);
    persistChat({
      id: userId,
      timestamp: userAt,
      role: "user",
      content: clean,
      langCode: recogLang,
    });
    setDraft("");
    setMic("processing");
    cue("ack");

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: clean,
          context: {
            scenarioName: session.scenarioName,
            riskLevel: session.riskLevel,
            vessel: session.vessel,
            mode: live ? "live" : "demo",
            locale: recogLang,
            path: pathname,
            scenarioId: session.scenarioId,
            panelType: session.panelType,
            actionText: session.actionText,
            recommended: session.recommended,
            logText: session.logText,
            crisis: session.crisis,
            faultId: session.faultId,
          },
        }),
      });
      const data = (await response.json()) as {
        reply?: string;
        langCode?: string;
        error?: string;
      };
      if (!response.ok || !data.reply) {
        const errorText = data.error ?? helmHud.noReply;
        const errorId = messageId();
        setMessages((current) => [
          ...current,
          { id: errorId, role: "error", text: errorText },
        ]);
        persistChat({
          id: errorId,
          timestamp: new Date().toISOString(),
          role: "error",
          content: errorText,
          langCode: recogLang,
        });
        recordConversation({
          summary: `Pilot exchange — ${clean.slice(0, 72)}`,
          fullContent: `Officer: ${clean}\n\nPilot: ${errorText}`,
        });
        setMic("idle");
        setTalkHud(false);
        cue("error");
        return;
      }
      const assistantId = messageId();
      setMessages((current) => [
        ...current,
        { id: assistantId, role: "assistant", text: data.reply ?? "" },
      ]);
      persistChat({
        id: assistantId,
        timestamp: new Date().toISOString(),
        role: "assistant",
        content: data.reply ?? "",
        langCode: data.langCode ?? recogLang,
      });
      recordConversation({
        summary: `Pilot exchange — ${clean.slice(0, 72)}`,
        fullContent: `Officer: ${clean}\n\nPilot: ${data.reply}`,
      });
      setTypingId(assistantId);
      speakReply(
        data.reply,
        data.langCode ?? "en",
        false,
        speechToneFor(data.reply, session.crisis),
      );
    } catch {
      const errorId = messageId();
      setMessages((current) => [
        ...current,
          { id: errorId, role: "error", text: helmHud.network },
      ]);
      persistChat({
        id: errorId,
        timestamp: new Date().toISOString(),
        role: "error",
        content: helmHud.network,
        langCode: recogLang,
      });
      recordConversation({
        summary: `Pilot exchange — ${clean.slice(0, 72)}`,
        fullContent: `Officer: ${clean}\n\nPilot: Network error — try again.`,
      });
      setMic("idle");
      setTalkHud(false);
      cue("error");
    }
  }

  sendRef.current = sendMessage;
  runDemoRef.current = runDemo;
  controlDemoRef.current = controlDemo;

  if (isAuthRoute(pathname) || !helmAllowed) return null;

  const showTalk = talkHud && !drilling && !open;
  const spokenScreen =
    drilling &&
    (demoBeat?.focus === "instruments" ||
      demoBeat?.focus === "advice" ||
      demoBeat?.focus === "comms")
      ? demoBeat.focus
      : null;

  return (
    <div
      data-testid="starwall-assistant"
      className="fixed bottom-4 end-4 z-[210] flex flex-col items-end font-body"
    >
      {showTalk ? (
        <PilotTalkWindow
          copy={demoCopy}
          title={surface.title}
          ask={surface.ask}
          send={surface.send}
          messages={messages}
          typed={typed}
          typingId={typingId}
          draft={draft}
          mic={mic}
          levels={levels}
          wave={wave}
          peak={peak}
          voiceOn={voiceOn}
          cuesOn={cuesOn}
          onDraft={setDraft}
          onSend={(text) => void sendMessage(text)}
          onClose={() => {
            stopDemo();
            stopListening();
            setTalkHud(false);
          }}
          onMic={() => void toggleMic()}
          onToggleSound={toggleSpeaker}
          onToggleCues={toggleCues}
        />
      ) : null}
      {open ? (
        <div className="relative flex max-h-[calc(100vh-5.5rem)] flex-col items-end">
        <section className={cn(
          "helm-scope relative flex h-[min(40rem,calc(100vh-5.5rem))] flex-col overflow-hidden rounded-2xl border border-bridge-line bg-bridge-panel text-bridge-text shadow-[0_20px_56px_rgb(15_25_34/0.18)]",
          "w-[min(24rem,calc(100vw-1.5rem))]",
        )}>
          <header className="relative z-[1] flex items-center justify-between gap-2 border-b border-bridge-line bg-bridge-bg px-3 py-3">
            <span
              className="helm-fab-sweep pointer-events-none absolute -end-6 -top-10 h-28 w-28 rounded-full opacity-40"
              style={{
                background:
                  "conic-gradient(from 200deg, transparent 0deg, transparent 300deg, rgb(241 90 0 / 0.45) 360deg)",
              }}
              aria-hidden
            />
            <div className="relative min-w-0">
              <p className="flex items-center gap-2 font-body text-lg font-semibold tracking-tight text-bridge-text">
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    mic === "listening"
                      ? "bg-ok assistant-mic-listen"
                      : mic === "speaking"
                        ? "bg-orange assistant-mic-speak"
                        : "bg-orange helm-idle-led",
                  )}
                />
                {surface.title}
              </p>
              <p className="truncate font-body text-sm text-bridge-dim">
                {live
                  ? surface.live
                  : `${desk.post} · ${session.vessel} · ${session.riskLevel}`}
              </p>
            </div>
            <div className="relative flex shrink-0 items-start gap-1">
              <div ref={langRef} className="relative">
                <button
                  type="button"
                  data-testid="helm-lang-toggle"
                  aria-expanded={langsOpen}
                  aria-controls={menuId}
                  aria-label={helmHud.language}
                  title={helmHud.language}
                  onClick={() => setLangsOpen((value) => !value)}
                  className="inline-flex min-w-[2.6rem] flex-col items-center gap-0.5 rounded-xl px-1.5 py-1 font-body text-[11px] font-medium text-bridge-text hover:bg-bridge-panel"
                >
                  <HudGlyph name="globe" className="h-4 w-4" />
                  {recogLang.toUpperCase()}
                </button>
                {langsOpen ? (
                  <ul
                    id={menuId}
                    className="absolute end-0 z-20 mt-1 max-h-64 min-w-[11rem] overflow-auto rounded-xl border border-stroke bg-panel py-1 text-ink shadow-lg"
                  >
                    {locales.map((code) => (
                      <li key={code}>
                        <button
                          type="button"
                          className={cn(
                            "flex w-full items-center gap-2 px-2.5 py-1.5 text-start font-body text-sm",
                            code === recogLang
                              ? "text-orange"
                              : "text-ink hover:bg-page",
                          )}
                          onClick={() => selectPilotLang(code)}
                        >
                          <FlagIcon locale={code} />
                          {localeMeta[code].native}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <button
                type="button"
                data-testid="helm-hide"
                data-pilot-lang={recogLang}
                onClick={() => {
                  stopDemo();
                  stopListening();
                  setTalkHud(false);
                  setOpen(false);
                }}
                className="inline-flex min-w-[2.6rem] flex-col items-center gap-0.5 rounded-xl px-1.5 py-1 font-body text-[11px] font-medium text-bridge-dim hover:bg-bridge-panel hover:text-bridge-text"
              >
                <HudGlyph name="hide" className="h-4 w-4" />
                {surface.hide}
              </button>
            </div>
          </header>
          <div className="relative z-[1] border-b border-bridge-line bg-bridge-bg px-3 py-1.5">
            <PilotDeskBar
              copy={desk}
              screen={screen}
              urgent={watch.urgent}
              notePulse={notePulse}
              spoken={spokenScreen}
              speaking={mic === "speaking"}
              onScreen={(next) => {
                setScreen(next);
                if (next === "advice") setNotePulse(false);
              }}
            />
            <div className="mt-1.5">
              <PilotVoiceNeed locale={recogLang} need={need} />
            </div>
          </div>
          {drilling && demoBeat ? (
            <PilotDemoStage
              copy={demoCopy}
              beat={demoBeat}
              index={demoStep}
              total={demoTotal}
              voiceOn={voiceOn}
              speaking={mic === "speaking"}
              listening={mic === "listening"}
              levels={levels}
              peak={peak}
              warn={demoBeat.tone === "warn"}
              onToggleSound={toggleSpeaker}
              cuesOn={cuesOn}
              onToggleCues={toggleCues}
            />
          ) : null}

          {screen === "chat" ? (
          <div
            ref={listRef}
            data-testid="assistant-chat"
            className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3"
          >
            {messages.length === 0 ? (
              <p className="border-s-2 border-orange ps-3 font-body text-sm leading-relaxed text-bridge-dim">
                {surface.empty}
              </p>
            ) : null}
            {messages.map((item) => {
              const showing =
                item.role === "assistant" && typingId === item.id
                  ? typed
                  : item.text;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "max-w-[92%] rounded-2xl px-3 py-2 font-body text-[15px] leading-relaxed",
                    item.role === "user"
                      ? "ms-auto bg-orange text-white"
                      : item.role === "error"
                        ? "border border-attn text-attn"
                        : drilling && demoBeat?.text === item.text
                          ? "border-s-2 border-[#38BDF8] bg-[#38BDF8]/10 text-bridge-text"
                          : "border-s-2 border-ok bg-bridge-bg text-bridge-text",
                    notePulse &&
                      item.role === "assistant" &&
                      item.id === messages[messages.length - 1]?.id &&
                      "pilot-note-blink",
                  )}
                >
                  {showing}
                </div>
              );
            })}
          </div>
          ) : (
            <PilotDesk
              session={session}
              locale={recogLang}
              screen={screen}
              notePulse={notePulse}
              onSeenNote={() => setNotePulse(false)}
              highlight={spokenScreen}
              speaking={mic === "speaking"}
            />
          )}

          <div className="border-t border-bridge-line bg-bridge-bg px-3 py-3">
            <div className="mb-3 flex items-center gap-2">
              <button
                type="button"
                data-testid="assistant-mic"
                onClick={() => void toggleMic()}
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border",
                  mic === "listening" && "assistant-mic-listen border-ok text-ok",
                  mic === "processing" && "border-attn text-attn",
                  mic === "speaking" && "assistant-mic-speak border-orange text-orange",
                  mic === "idle" && "border-bridge-line text-bridge-dim hover:text-bridge-text",
                )}
                aria-label={
                  mic === "listening" ? helmHud.listenStop : helmHud.listenStart
                }
              >
                {mic === "processing" ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-attn border-t-transparent" />
                ) : (
                  <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
                    <path
                      fill="currentColor"
                      d="M8 1.5A2.2 2.2 0 0 0 5.8 3.7v3.1a2.2 2.2 0 1 0 4.4 0V3.7A2.2 2.2 0 0 0 8 1.5Zm-4 5.4a.7.7 0 0 0-1.4 0 5.4 5.4 0 0 0 4.7 5.3v1.6H6.1a.7.7 0 0 0 0 1.4h3.8a.7.7 0 0 0 0-1.4H8.7v-1.6A5.4 5.4 0 0 0 13.4 6.9a.7.7 0 0 0-1.4 0 4 4 0 0 1-8 0Z"
                    />
                  </svg>
                )}
              </button>
              {drilling ? (
                <p className="min-w-0 flex-1 font-body text-sm leading-snug text-[#38BDF8]">
                  {demoCopy.interruptHint}
                </p>
              ) : (
                <div className="min-w-0 flex-1">
                  <PilotSoundDock
                    voiceOn={voiceOn}
                    speaking={mic === "speaking"}
                    listening={mic === "listening"}
                    levels={levels}
                    peak={peak}
                    soundOnLabel={surface.speakerOn}
                    soundOffLabel={surface.speakerOff}
                    onToggle={toggleSpeaker}
                    cuesOn={cuesOn}
                    cuesOnLabel={demoCopy.signalsOn}
                    cuesOffLabel={demoCopy.signalsOff}
                    onToggleCues={toggleCues}
                  />
                </div>
              )}
            </div>
            {micError ? (
              <p className="mb-2 font-body text-sm text-attn">{micError}</p>
            ) : null}
            <div className="mb-2">
              <PilotWatchCalls
                copy={demoCopy}
                disabled={mic === "processing"}
                onPick={(text) => void sendMessage(text)}
              />
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void sendMessage(draft);
              }}
              className="flex gap-2"
            >
              <input
                data-testid="assistant-input"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={surface.ask}
                className="min-w-0 flex-1 rounded-xl border border-bridge-line bg-bridge-panel px-3 py-2 font-body text-sm text-bridge-text outline-none placeholder:text-bridge-dim focus:border-orange"
              />
              <button
                type="submit"
                data-testid="assistant-send"
                className="rounded-xl bg-orange px-3 py-2 font-body text-sm font-medium text-white hover:bg-orange/90"
              >
                {surface.send}
              </button>
            </form>
          </div>
        </section>
        </div>
      ) : unread ? (
        <PilotUnreadChip
          title={desk.unread}
          go={desk.unreadGo}
          where={desk.unreadWhere}
          openLabel={desk.unreadOpen}
          preview={watch.advice[0]?.body}
          urgent={watch.urgent}
          onOpen={() => {
            setOpen(true);
            setUnread(false);
            setScreen("advice");
            cue(watch.urgent ? "urgent" : "note");
          }}
        />
      ) : null}
      <div className="mt-2 flex items-end gap-2">
        <PilotDemoDock
          running={drilling}
          copy={demoCopy}
          cuesOn={cuesOn}
          onToggleCues={toggleCues}
          onPlay={() => void runDemo()}
          onStop={stopDemo}
          onBack={() => controlDemo("back")}
          onNext={() => controlDemo("next")}
          onReset={() => controlDemo("reset")}
        />
        <button
          type="button"
          data-testid="assistant-toggle"
          onClick={() => {
            if (open) {
              stopListening();
              setTalkHud(false);
              setOpen(false);
              return;
            }
            setOpen(true);
            setUnread(false);
            if (unread || watch.urgent) {
              setScreen("advice");
              cue(watch.urgent ? "urgent" : "note");
            } else {
              cue("open");
            }
          }}
          aria-pressed={open}
          aria-label={open ? surface.hide : surface.open}
          className={cn(
            "relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-orange bg-bridge-panel text-orange",
            (unread || (!open && watch.urgent)) && (watch.urgent ? "helm-fab-pulse-urgent" : "helm-fab-pulse"),
            open && "bg-orange/10",
          )}
        >
          <span
            className="helm-fab-sweep pointer-events-none absolute inset-1 rounded-full"
            style={{
              background:
                "conic-gradient(from 200deg, transparent 0deg, transparent 300deg, rgb(241 90 0 / 0.5) 360deg)",
            }}
            aria-hidden
          />
          <svg viewBox="0 0 48 48" className="relative h-8 w-8" aria-hidden>
            <circle
              cx="24"
              cy="24"
              r="16"
              fill="var(--bridge-bg)"
              stroke="#F15A00"
              strokeWidth="1.8"
            />
            <path
              d="M24 16v8.4l4.6 2.7"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle cx="24" cy="24" r="2.2" fill="#F15A00" className="helm-idle-led" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export const StarWallAssistant = Helm;
