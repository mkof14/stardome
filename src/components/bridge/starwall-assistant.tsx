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
  focusWatchComms,
  publishAdviceDecision,
  publishHelmState,
  publishPilotSpeakFocus,
  requestFlagshipScenario,
  requestPilotNotify,
  type AdviceDecision,
  type PilotDemoControl,
} from "@/lib/helm-events";
import {
  speechProsody,
  speechToneFor,
  type SpeechSpeaker,
  type SpeechTone,
} from "@/lib/pilot-speech";
import {
  PilotDesk,
  PilotDeskBar,
  PilotUnreadChip,
  type PilotScreen,
} from "@/components/bridge/pilot-desk";
import { pilotDeskCopy } from "@/lib/i18n/pilot-desk-copy";
import { buildPilotWatch, type PilotAdvice } from "@/lib/pilot-watch";
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
  isLikelyFemaleVoice,
  isLikelyMaleVoice,
  maleVoiceFor,
  officerVoiceFor,
  SPEAK_BCP47,
  SpeechEngine,
  spokenBrowserVoice,
  voiceNeed,
  type NeuralVoiceStatus,
} from "@/lib/pilot-voice";
import {
  PilotDemoDock,
  PilotDemoStage,
  PilotSoundDock,
  PilotVoiceStudio,
  PilotWatchCalls,
} from "@/components/bridge/pilot-demo";
import {
  cueForDemoBeat,
  cuesEnabled,
  voiceEnabled,
  writeVoiceEnabled,
  playPilotCue,
  writeCuesEnabled,
  type PilotCue,
} from "@/lib/pilot-cues";
import { PilotTalkWindow } from "@/components/bridge/pilot-talk-window";
import { PilotPresence } from "@/components/bridge/pilot-presence";
import { pilotMood, voiceLevelFromBars } from "@/lib/pilot-presence";
import {
  BARGE_GRACE_MS,
  heardWhilePilotTalks,
  isEchoOfSpoken,
  maySpeak,
  vadHotFrames,
  vadTriggered,
} from "@/lib/barge-in";
import { isHaltOrder, isListenOrder, isOfficerAsk, isTalkOpen } from "@/lib/pilot-orders";
import { pilotDirectReply } from "@/lib/pilot-knowledge";
import {
  clipChatHistory,
  isAdviceAccept,
  isAdviceDecline,
  isNotifyAsk,
} from "@/lib/pilot-sim";
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

const TYPE_MS = 34;

export function Helm() {
  const pathname = usePathname();
  const session = useBridgeSession();
  const { session: auth } = useAuthSession();
  const helmAllowed = !auth || canUseHelm(auth.role);
  const { live } = useAppMode();
  const { locale } = useHud();
  const { setLocale } = usePreferences();
  const { recordConversation, recordDecision } = useBlackBox();
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
    officerVoice: officerVoiceFor(locale).voice,
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
  const speakEndedAt = useRef(0);
  const wantListen = useRef(false);
  const sendingRef = useRef(false);
  const askGen = useRef(0);
  const cutLock = useRef(false);
  const holdSpeech = useRef(false);
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
  openRef.current = open;
  voiceOnRef.current = voiceOn;
  cuesOnRef.current = cuesOn;
  micRef.current = mic;

  useEffect(() => {
    setCuesOn(cuesEnabled());
    const voice = voiceEnabled();
    setVoiceOn(voice);
    voiceOnRef.current = voice;
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
    const officer = officerVoiceFor(recogLang);
    setNeural((current) => ({
      ready: current.ready,
      voice: mapped.voice,
      officerVoice: officer.voice,
      provider: current.provider,
    }));
    fetch(`/api/tts?locale=${encodeURIComponent(recogLang)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("tts"))))
      .then(
        (data: {
          ready?: unknown;
          voice?: unknown;
          officerVoice?: unknown;
          voices?: { officer?: unknown };
          provider?: unknown;
        }) => {
          if (cancelled) return;
          const officerName =
            typeof data.officerVoice === "string"
              ? data.officerVoice
              : typeof data.voices?.officer === "string"
                ? data.voices.officer
                : officer.voice;
          setNeural({
            ready: data.ready !== false,
            voice: typeof data.voice === "string" ? data.voice : mapped.voice,
            officerVoice: officerName,
            provider: typeof data.provider === "string" ? data.provider : "edge",
          });
        },
      )
      .catch(() => {
        if (!cancelled) {
          setNeural({
            ready: false,
            voice: mapped.voice,
            officerVoice: officer.voice,
            provider: null,
          });
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
  }, [pathname, watch.noteKey, watch.urgent, session]);

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

  function markSpeechEnded() {
    speakEndedAt.current = performance.now();
  }

  function resumeListen() {
    if (!wantListen.current) return;
    keepListen.current = true;
    if (
      listenMode.current === "push" &&
      recognitionRef.current &&
      streamRef.current
    ) {
      startMeter(streamRef.current);
      setMic("listening");
      return;
    }
    void startListen("push");
  }

  function afterSpeech() {
    markSpeechEnded();
    if (wantListen.current) {
      resumeListen();
      return;
    }
    setMic((current) => (current === "speaking" ? "idle" : current));
  }

  function haltWatch() {
    holdSpeech.current = true;
    askGen.current += 1;
    sendingRef.current = false;
    const clip = neuralRef.current;
    if (clip) {
      clip.volume = 0;
      clip.pause();
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    stopDemo();
    stopSpeech();
    setTalkHud(false);
    publishPilotSpeakFocus({ focus: null, speaking: false });
    cutLock.current = true;
    markSpeechEnded();
    cue("stop");
    wantListen.current = true;
    resumeListen();
    const ack = surface.haltAck;
    const ackId = messageId();
    setMessages((current) => {
      const last = current[current.length - 1];
      if (last?.role === "assistant" && last.text === ack) return current;
      return [...current, { id: ackId, role: "assistant", text: ack }];
    });
    setTypingId(ackId);
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
    if (isEchoOfSpoken(text, spokenText.current)) return;
    if (sendingRef.current) {
      if (isHaltOrder(text)) haltWatch();
      return;
    }
    const talking = heardWhilePilotTalks(
      micRef.current === "speaking",
      speakEndedAt.current,
      performance.now(),
    );
    if (talking) {
      if (isHaltOrder(text)) {
        haltWatch();
        return;
      }
      if (isFinal && (isOfficerAsk(text) || isTalkOpen(text))) {
        stopDemo();
        stopSpeech();
        setTalkHud(false);
        publishPilotSpeakFocus({ focus: null, speaking: false });
        cutLock.current = true;
        markSpeechEnded();
        wantListen.current = true;
        void sendRef.current(text);
      }
      return;
    }
    if (isHaltOrder(text)) {
      haltWatch();
      return;
    }
    if (isListenOrder(text)) {
      wantListen.current = true;
      resumeListen();
      return;
    }
    if (!isFinal) return;
    if (!wantListen.current && listenMode.current !== "push") return;
    void sendRef.current(text);
  }

  async function startListen(mode: "push" | "barge") {
    const Engine = SpeechEngine();
    if (!Engine) {
      if (mode === "push") setMicError(helmHud.noSpeech);
      return false;
    }
    if (
      mode === "push" &&
      wantListen.current &&
      listenMode.current === "push" &&
      recognitionRef.current &&
      streamRef.current &&
      (micRef.current === "listening" ||
        micRef.current === "speaking" ||
        micRef.current === "processing")
    ) {
      return true;
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
        wantListen.current = true;
        keepListen.current = true;
        startMeter(stream);
        if (micRef.current !== "speaking" && micRef.current !== "processing") {
          setMic("listening");
        }
        cue("listen");
      } else {
        bargeArmed.current = true;
        startVad(stream);
      }
      setMicError(null);

      const recognition = new Engine();
      recognition.lang = SPEAK_BCP47[recogLang];
      recognition.interimResults = true;
      recognition.continuous = true;
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
        if (wantListen.current && listenMode.current === "push") {
          try {
            recognition.start();
          } catch {
            // already started
          }
          return;
        }
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
      wantListen.current = false;
      keepListen.current = false;
      stopListening();
      setTalkHud(false);
      return;
    }
    if (mic === "processing") return;
    if (mic === "speaking" || drillingRef.current) {
      stopDemo();
      stopSpeech();
      setTalkHud(false);
    }
    wantListen.current = true;
    keepListen.current = true;
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
    speakAbort.current?.abort();
    speakAbort.current = null;
    const wait = playWait.current;
    playWait.current = null;
    wait?.();
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
    try {
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
    } catch {
      playCtx.current = null;
      void ctx.close();
    }
  }

  function toggleSpeaker() {
    setVoiceOn((current) => {
      const next = !current;
      writeVoiceEnabled(next);
      voiceOnRef.current = next;
      if (current) stopSpeech();
      return next;
    });
  }

  function enableVoice() {
    if (voiceOnRef.current) return;
    writeVoiceEnabled(true);
    voiceOnRef.current = true;
    setVoiceOn(true);
  }

  function speakBrowser(
    text: string,
    locale: typeof recogLang,
    gen: number,
    tone: SpeechTone,
    speaker: SpeechSpeaker = "pilot",
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
      const pool = installed.length ? installed : voices;
      const match = spokenBrowserVoice(pool, locale, speaker);
      const full = match
        ? installed.find(
            (item) => item.name === match.name && item.lang === match.lang,
          ) ?? installed.find((item) => item.name === match.name)
        : null;
      if (
        !full ||
        isLikelyFemaleVoice(full.name) ||
        !isLikelyMaleVoice(full.name)
      ) {
        finish();
        return;
      }
      utterance.voice = full;
      utterance.pitch =
        speaker === "officer"
          ? Math.min(1.15, voice.browserPitch + 0.12)
          : voice.browserPitch;
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
    speaker: SpeechSpeaker = "pilot",
  ) {
    if ((!voiceOnRef.current && !force) || typeof window === "undefined") {
      return;
    }
    if (!maySpeak(holdSpeech.current, force)) return;
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
    try {
      const controller = new AbortController();
      speakAbort.current = controller;
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: spoken, locale, tone, speaker }),
        signal: controller.signal,
      });
      if (gen !== speakGen.current || !maySpeak(holdSpeech.current, force)) return;
      if (res.ok) {
        const blob = await res.blob();
        if (gen !== speakGen.current || !maySpeak(holdSpeech.current, force)) return;
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
          setNeural((current) => {
            const used =
              res.headers.get("X-Pilot-Voice") ??
              (speaker === "officer"
                ? officerVoiceFor(locale).voice
                : maleVoiceFor(locale).voice);
            return {
              ready: true,
              voice: speaker === "officer" ? current.voice ?? used : used,
              officerVoice:
                speaker === "officer"
                  ? used
                  : current.officerVoice ?? officerVoiceFor(locale).voice,
              provider: res.headers.get("X-Pilot-Provider") ?? "edge",
            };
          });
          if (!drillingRef.current) releaseBarge();
          if (!drillingRef.current) setTalkHud(false);
          clearMeter();
          afterSpeech();
        }
        return;
      }
    } catch {
      // Aborted or neural path down — browser male voice next.
    }
    if (gen !== speakGen.current || !maySpeak(holdSpeech.current, force)) return;
    setNeural((current) => ({ ...current, ready: false }));
    await speakBrowser(spoken, locale, gen, tone, speaker);
    if (gen === speakGen.current) {
      if (!drillingRef.current) releaseBarge();
      if (!drillingRef.current) setTalkHud(false);
      clearMeter();
      afterSpeech();
    }
  }

  function stopDemo() {
    const was = drillingRef.current;
    if (was) holdSpeech.current = true;
    runToken.current += 1;
    demoCancel.current = true;
    drillingRef.current = false;
    setDrilling(false);
    setDemoBeat(null);
    setTalkHud(false);
    setScreen("chat");
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
    holdSpeech.current = false;
    stopSpeech();
    demoCancel.current = false;
    drillingRef.current = true;
    setDrilling(true);
    setTalkHud(false);
    setOpen(true);
    setUnread(false);
    wantListen.current = true;
    void startListen("push");
    if (!live && !session.scenarioId) requestFlagshipScenario();
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
      if (beat.focus === "comms" && !live) {
        focusWatchComms("designated");
        requestPilotNotify();
      }
      cue(cueForDemoBeat(beat));
      if (beat.speak) {
        publishPilotSpeakFocus({
          focus: beat.focus,
          speaking: true,
          tone: beat.tone,
        });
        if (voiceOnRef.current) {
          await speakReply(
            beat.text,
            recogLang,
            false,
            beat.tone,
            beat.role === "officer" ? "officer" : "pilot",
          );
        } else {
          await new Promise((resolve) =>
            window.setTimeout(resolve, Math.min(4200, 900 + beat.text.length * 18)),
          );
        }
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
    setScreen("chat");
    publishPilotSpeakFocus({ focus: null, speaking: false });
    releaseBarge();
    cue("stop");
    resumeListen();
  }

  async function sendMessage(text: string) {
    const clean = text.trim();
    if (!clean) return;
    if (isHaltOrder(clean)) {
      haltWatch();
      return;
    }
    if (isListenOrder(clean)) {
      stopSpeech();
      setTalkHud(false);
      wantListen.current = true;
      resumeListen();
      return;
    }
    const direct = pilotDirectReply(clean, recogLang);
    if (direct) {
      enableVoice();
      sendingRef.current = false;
      const ticket = ++askGen.current;
      stopDemo();
      holdSpeech.current = false;
      setOpen(true);
      setScreen("chat");
      setTalkHud(false);
      wantListen.current = true;
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
      const assistantId = messageId();
      setMessages((current) => [
        ...current,
        { id: assistantId, role: "assistant", text: direct },
      ]);
      persistChat({
        id: assistantId,
        timestamp: new Date().toISOString(),
        role: "assistant",
        content: direct,
        langCode: recogLang,
      });
      recordConversation({
        summary: `Pilot exchange — ${clean.slice(0, 72)}`,
        fullContent: `Officer: ${clean}\n\nPilot: ${direct}`,
      });
      if (ticket !== askGen.current) return;
      setTypingId(assistantId);
      void speakReply(direct, recogLang, true, "brief");
      return;
    }
    if (!live && isNotifyAsk(clean)) {
      requestPilotNotify();
      setScreen("comms");
    }
    if (!live && isAdviceAccept(clean)) {
      publishAdviceDecision({ decision: "accept" });
    } else if (!live && isAdviceDecline(clean)) {
      publishAdviceDecision({ decision: "decline" });
    }
    sendingRef.current = true;
    const ticket = ++askGen.current;
    stopDemo();
    holdSpeech.current = false;
    if (!wantListen.current) stopListening(true);
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
          history: clipChatHistory(
            messages
              .filter((item) => item.role === "user" || item.role === "assistant")
              .map((item) => ({ role: item.role, text: item.text })),
          ),
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
      if (ticket !== askGen.current) {
        sendingRef.current = false;
        return;
      }
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
        sendingRef.current = false;
        resumeListen();
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
      if (ticket !== askGen.current) {
        sendingRef.current = false;
        return;
      }
      setTypingId(assistantId);
      sendingRef.current = false;
      speakReply(
        data.reply,
        recogLang,
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
      sendingRef.current = false;
      resumeListen();
    }
  }

  function decideAdvice(decision: AdviceDecision, card: PilotAdvice) {
    publishAdviceDecision({
      decision,
      title: card.title,
      body: card.body,
    });
    recordDecision({
      summary: `Advice ${decision} — ${card.title.slice(0, 72)}`,
      fullContent: `Officer ${decision}ed advice.\nTitle: ${card.title}\n${card.body}`,
    });
    const text = decision === "accept" ? desk.acceptedLogged : desk.declinedLogged;
    const assistantId = messageId();
    setMessages((current) => [
      ...current,
      { id: assistantId, role: "assistant", text },
    ]);
    persistChat({
      id: assistantId,
      timestamp: new Date().toISOString(),
      role: "assistant",
      content: text,
      langCode: recogLang,
    });
    setScreen("advice");
    setTypingId(assistantId);
    void speakReply(text, recogLang, false, "brief");
  }

  sendRef.current = sendMessage;
  runDemoRef.current = runDemo;
  controlDemoRef.current = controlDemo;

  if (isAuthRoute(pathname) || !helmAllowed) return null;

  const showTalk = talkHud && !drilling && !open;
  const presenceMood = pilotMood({
    mic,
    urgent: watch.urgent,
    risk: String(session.riskLevel ?? ""),
  });
  const voiceLevel = voiceLevelFromBars(levels);
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
      data-pilot-provider={neural.provider}
      data-pilot-voice={neural.voice}
      className="fixed bottom-4 end-4 z-[210] flex flex-col items-end font-body"
    >
      {showTalk ? (
        <PilotTalkWindow
          copy={demoCopy}
          title={surface.title}
          ask={surface.ask}
          send={surface.send}
          mood={presenceMood}
          voiceLevel={voiceLevel}
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
          onStop={haltWatch}
          stopLabel={surface.stop}
          onToggleSound={toggleSpeaker}
          onToggleCues={toggleCues}
        />
      ) : null}
      {open ? (
        <div className="relative flex max-h-[calc(100vh-6.25rem)] flex-col items-end">
        <section className={cn(
          "helm-scope relative flex h-[min(56rem,calc(100vh-6.25rem))] flex-col overflow-hidden rounded-2xl border border-bridge-line bg-bridge-panel text-bridge-text shadow-[0_20px_56px_rgb(15_25_34/0.18)]",
          "w-[min(42rem,calc(100vw-1.5rem))]",
        )}>
          <header
            className={cn(
              "relative z-[1] flex shrink-0 items-center justify-between gap-2 border-b bg-bridge-bg px-3 py-2.5",
              mic === "speaking"
                ? "pilot-speak-focus border-orange/60"
                : "border-bridge-line",
            )}
          >
            <div className="relative flex min-w-0 items-center gap-3">
              <PilotPresence
                mood={presenceMood}
                size="watch"
                level={voiceLevel}
                speaking={mic === "speaking"}
                listening={mic === "listening"}
                wave={wave}
              />
              <div className="min-w-0">
              <p
                data-testid="pilot-wordmark"
                className={cn(
                  "flex items-center gap-2 font-body font-bold tracking-tight",
                  mic === "speaking" ? "text-3xl text-orange" : "text-3xl text-bridge-text",
                )}
              >
                {surface.title}
              </p>
              {mic === "speaking" || mic === "listening" || mic === "processing" ? (
                <p
                  data-testid={mic === "speaking" ? "pilot-speaking" : "pilot-status"}
                  data-mic={mic}
                  className={cn(
                    "mt-0.5 font-body text-sm font-semibold uppercase tracking-wider",
                    mic === "speaking"
                      ? "text-orange"
                      : mic === "listening"
                        ? "text-ok"
                        : "text-attn",
                  )}
                >
                  {mic === "speaking"
                    ? surface.speaking
                    : mic === "listening"
                      ? surface.listening
                      : surface.waiting}
                </p>
              ) : (
                <p className="mt-0.5 flex items-center gap-1.5 font-body text-sm text-bridge-dim">
                  <span
                    data-testid="pilot-watch-post"
                    className="pilot-watch-live inline-flex items-center gap-1 rounded-md bg-ok/15 px-1.5 py-0.5 font-semibold uppercase tracking-wide text-ok"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-ok" aria-hidden />
                    {live ? surface.live : desk.post}
                  </span>
                  {live ? null : (
                    <span className="truncate">
                      {session.vessel} · {session.riskLevel}
                    </span>
                  )}
                </p>
              )}
              </div>
            </div>
            <div className="relative flex shrink-0 items-center gap-1">
              {mic === "speaking" || drilling ? (
                <button
                  type="button"
                  data-testid="assistant-stop-header"
                  onClick={haltWatch}
                  aria-label={surface.stop}
                  className="flex h-9 items-center rounded-lg bg-attn px-3 font-body text-sm font-bold text-white hover:bg-attn/90"
                >
                  {surface.stop}
                </button>
              ) : null}
              <div ref={langRef} className="relative">
                <button
                  type="button"
                  data-testid="helm-lang-toggle"
                  aria-expanded={langsOpen}
                  aria-controls={menuId}
                  aria-label={helmHud.language}
                  title={helmHud.language}
                  onClick={() => setLangsOpen((value) => !value)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-orange/50 bg-orange/10 px-2.5 font-body text-sm font-semibold text-orange hover:bg-orange/20"
                >
                  <FlagIcon locale={recogLang} />
                  <span className="max-w-[5.5rem] truncate">{localeMeta[recogLang].native}</span>
                  <span aria-hidden className="text-[10px]">▾</span>
                </button>
                {langsOpen ? (
                  <ul
                    id={menuId}
                    data-testid="helm-lang-menu"
                    className="absolute end-0 z-30 mt-1 max-h-64 min-w-[12rem] overflow-auto rounded-xl border border-stroke bg-panel py-1 text-ink shadow-lg"
                  >
                    {locales.map((code) => (
                      <li key={code}>
                        <button
                          type="button"
                          className={cn(
                            "flex w-full items-center gap-2 px-2.5 py-2 text-start font-body text-sm",
                            code === recogLang
                              ? "bg-orange/10 text-orange"
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
                  wantListen.current = false;
                  keepListen.current = false;
                  stopDemo();
                  stopListening();
                  setTalkHud(false);
                  setOpen(false);
                }}
                className="inline-flex h-9 items-center rounded-lg px-2.5 font-body text-sm font-medium text-bridge-dim hover:bg-bridge-panel hover:text-bridge-text"
              >
                <HudGlyph name="hide" className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only sm:ms-1">{surface.hide}</span>
              </button>
            </div>
          </header>
          <div className="relative z-[1] shrink-0 border-b border-bridge-line bg-bridge-bg px-3 py-1.5">
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
          </div>
          {drilling && demoBeat ? (
            <PilotDemoStage
              copy={demoCopy}
              beat={demoBeat}
              index={demoStep}
              total={demoTotal}
              speaking={mic === "speaking"}
              warn={demoBeat.tone === "warn"}
            />
          ) : null}

          {screen === "chat" && !drilling ? (
          <div
            ref={listRef}
            data-testid="assistant-chat"
            className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3"
          >
            {messages.length === 0 ? (
              <p className="border-s-2 border-orange ps-3 font-body text-base leading-relaxed text-bridge-dim">
                {pathname.startsWith("/interface") && !live && session.scenarioId
                  ? surface.emptyWatch
                  : surface.empty}
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
                    "max-w-[92%] rounded-2xl px-3.5 py-2.5 font-body text-base leading-relaxed",
                    item.role === "user"
                      ? "ms-auto bg-orange text-white"
                      : item.role === "error"
                        ? "border border-attn text-attn"
                        : drilling && demoBeat?.text === item.text
                          ? "border-s-2 border-orange bg-orange/10 text-bridge-text"
                          : "border-s-2 border-bridge-line bg-bridge-bg text-bridge-text",
                    notePulse &&
                      item.role === "assistant" &&
                      item.id === messages[messages.length - 1]?.id &&
                      "pilot-note-blink",
                  )}
                >
                  {showing}
                  {item.role === "assistant" && typingId === item.id ? (
                    <span data-testid="pilot-type-caret" className="pilot-type-caret" aria-hidden>
                      ▌
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
          ) : screen !== "chat" ? (
            <PilotDesk
              session={session}
              locale={recogLang}
              screen={screen}
              notePulse={notePulse}
              onSeenNote={() => setNotePulse(false)}
              highlight={spokenScreen}
              speaking={mic === "speaking"}
              onDecide={decideAdvice}
            />
          ) : (
            <div className="min-h-0 flex-1" />
          )}

          <div className="relative z-20 shrink-0 border-t border-bridge-line bg-bridge-bg px-3 py-2.5">
            <div className="mb-2 flex items-center gap-1.5">
              {mic === "speaking" || drilling ? (
                <button
                  type="button"
                  data-testid="assistant-stop"
                  onClick={haltWatch}
                  aria-label={surface.stop}
                  className="flex h-10 shrink-0 items-center justify-center rounded-lg bg-attn px-3 font-body text-sm font-bold text-white hover:bg-attn/90"
                >
                  {surface.stop}
                </button>
              ) : null}
              <button
                type="button"
                data-testid="assistant-mic"
                data-on={mic === "listening" ? "true" : "false"}
                onClick={() => void toggleMic()}
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border",
                  mic === "listening" && "assistant-mic-listen border-ok text-ok",
                  mic === "processing" && "border-attn text-attn",
                  mic === "speaking" && "assistant-mic-speak border-orange text-orange",
                  mic === "idle" && "border-attn/60 bg-attn/10 text-attn",
                )}
                aria-label={
                  mic === "listening" ? helmHud.listenStop : helmHud.listenStart
                }
              >
                {mic === "processing" ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-attn border-t-transparent" />
                ) : (
                  <span className="relative inline-flex h-4 w-4" aria-hidden>
                    <svg viewBox="0 0 16 16" className="h-4 w-4">
                      <path
                        fill="currentColor"
                        d="M8 1.5A2.2 2.2 0 0 0 5.8 3.7v3.1a2.2 2.2 0 1 0 4.4 0V3.7A2.2 2.2 0 0 0 8 1.5Zm-4 5.4a.7.7 0 0 0-1.4 0 5.4 5.4 0 0 0 4.7 5.3v1.6H6.1a.7.7 0 0 0 0 1.4h3.8a.7.7 0 0 0 0-1.4H8.7v-1.6A5.4 5.4 0 0 0 13.4 6.9a.7.7 0 0 0-1.4 0 4 4 0 0 1-8 0Z"
                      />
                    </svg>
                    {mic === "idle" ? (
                      <span
                        data-testid="assistant-mic-off"
                        className="pointer-events-none absolute inset-x-0 top-1/2 h-0.5 -rotate-45 bg-current"
                      />
                    ) : null}
                  </span>
                )}
              </button>
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
            {micError ? (
              <p className="mb-2 font-body text-base text-attn">{micError}</p>
            ) : null}
            {!drilling && mic !== "speaking" ? (
              <div className="mb-2 space-y-3">
                <PilotWatchCalls
                  copy={demoCopy}
                  disabled={mic === "processing"}
                  onPick={(text) => void sendMessage(text)}
                />
                <details className="group rounded-lg border border-bridge-line/70 bg-bridge-bg px-2.5 py-1.5">
                  <summary className="cursor-pointer font-body text-sm text-bridge-dim marker:text-bridge-dim">
                    {demoCopy.studio}
                  </summary>
                  <div className="mt-2">
                    <PilotVoiceStudio
                      locale={recogLang}
                      need={voiceNeed(recogLang, voices, neural)}
                      copy={demoCopy}
                      hideTitle
                      disabled={mic === "processing"}
                      onHearPilot={() =>
                        void speakReply(demoCopy.previewPilot, recogLang, true, "brief", "pilot")
                      }
                      onHearOfficer={() =>
                        void speakReply(demoCopy.previewOfficer, recogLang, true, "brief", "officer")
                      }
                    />
                  </div>
                </details>
              </div>
            ) : null}
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
                className="min-w-0 flex-1 rounded-xl border border-bridge-line bg-bridge-panel px-3 py-2.5 font-body text-base text-bridge-text outline-none placeholder:text-bridge-dim focus:border-orange"
              />
              <button
                type="submit"
                data-testid="assistant-send"
                className="rounded-xl bg-orange px-3.5 py-2.5 font-body text-base font-medium text-white hover:bg-orange/90"
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
              wantListen.current = false;
              keepListen.current = false;
              stopListening();
              setTalkHud(false);
              setOpen(false);
              return;
            }
            setOpen(true);
            setUnread(false);
            wantListen.current = true;
            void startListen("push");
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
            "relative flex w-[4.6rem] shrink-0 flex-col items-center overflow-hidden rounded-2xl border border-orange/70 bg-bridge-bg px-1 pb-1 pt-1 text-orange",
            (unread || (!open && watch.urgent)) && (watch.urgent ? "helm-fab-pulse-urgent" : "helm-fab-pulse"),
            open && "border-orange bg-orange/10",
          )}
        >
          <PilotPresence
            mood={presenceMood}
            size="dock"
            level={voiceLevel}
            speaking={mic === "speaking"}
            listening={mic === "listening"}
            wave={wave}
          />
          <span className="relative mt-1 font-body text-xs font-bold leading-none">
            {surface.title}
          </span>
        </button>
      </div>
    </div>
  );
}

export const StarWallAssistant = Helm;
