import type { BridgeSessionValue } from "@/lib/bridge-session-types";
import { fillDemo, pilotDemoCopy } from "@/lib/i18n/pilot-demo-copy";
import type { Locale } from "@/lib/i18n/locales";
import type { SpeechTone } from "@/lib/pilot-speech";
import {
  languageLabel,
  maleVoiceFor,
  officerVoiceFor,
  type VoiceNeed,
} from "@/lib/pilot-voice";
import { watchReply } from "@/lib/pilot-watch";

export type DemoRaise = {
  instruments?: boolean;
  advice?: boolean;
  comms?: boolean;
};

export type DemoFocus = "instruments" | "advice" | "comms" | "voice" | "calls";

export type DemoBeat = {
  role: "officer" | "pilot";
  text: string;
  raise?: DemoRaise;
  speak: boolean;
  focus: DemoFocus;
  action: string;
  place: string;
  tone: SpeechTone;
};

export function demoBeats(session: BridgeSessionValue, locale: Locale): DemoBeat[] {
  const copy = pilotDemoCopy(locale);
  if (session.live) {
    return [
      {
        role: "pilot",
        text: copy.liveBlock,
        speak: true,
        focus: "voice",
        action: copy.actionLive,
        place: copy.whereOutro,
        tone: "brief",
      },
    ];
  }
  const picture = watchReply(session, locale).trim();
  const status = session.scenarioId ? picture : copy.quietStatus;
  const advice = session.scenarioId ? picture : copy.quietAdvice;
  const watchTone: SpeechTone = session.crisis ? "warn" : "brief";
  return [
    {
      role: "pilot",
      text: copy.intro,
      speak: true,
      raise: { instruments: true },
      focus: "instruments",
      action: copy.actionIntro,
      place: copy.whereIntro,
      tone: "brief",
    },
    {
      role: "officer",
      text: copy.officerStatus,
      speak: true,
      focus: "calls",
      action: copy.actionOfficer,
      place: copy.whereOfficer,
      tone: "brief",
    },
    {
      role: "pilot",
      text: status,
      speak: true,
      raise: { instruments: true, advice: true },
      focus: "instruments",
      action: copy.actionInstruments,
      place: copy.whereInstruments,
      tone: watchTone,
    },
    {
      role: "officer",
      text: copy.officerAdvice,
      speak: true,
      focus: "calls",
      action: copy.actionOfficer,
      place: copy.whereOfficer,
      tone: "brief",
    },
    {
      role: "pilot",
      text: advice,
      speak: true,
      raise: { instruments: true, advice: true, comms: true },
      focus: "advice",
      action: copy.actionAdvice,
      place: copy.whereAdvice,
      tone: watchTone,
    },
    {
      role: "officer",
      text: copy.officerNotify,
      speak: true,
      focus: "calls",
      action: copy.actionOfficer,
      place: copy.whereOfficer,
      tone: "brief",
    },
    {
      role: "pilot",
      text: copy.notifyReply,
      speak: true,
      raise: { comms: true },
      focus: "comms",
      action: copy.actionComms,
      place: copy.whereComms,
      tone: "warn",
    },
    {
      role: "pilot",
      text: copy.outro,
      speak: true,
      focus: "voice",
      action: copy.actionOutro,
      place: copy.whereOutro,
      tone: "brief",
    },
  ];
}

export function demoCalls(locale: Locale) {
  const copy = pilotDemoCopy(locale);
  return [
    { id: "status" as const, label: copy.callStatus },
    { id: "advice" as const, label: copy.callAdvice },
    { id: "notify" as const, label: copy.callNotify },
  ];
}

export function voiceNeedLine(locale: Locale, need: VoiceNeed) {
  const copy = pilotDemoCopy(locale);
  const lang = languageLabel(locale);
  const tts =
    need.tts === "neural"
      ? (() => {
          const voice = need.voiceName || maleVoiceFor(locale).voice;
          const officer =
            need.officerVoiceName || officerVoiceFor(locale).voice;
          const vars = { lang, voice, officer };
          if (need.provider === "elevenlabs") {
            return fillDemo(copy.voiceEleven, vars);
          }
          if (need.provider === "edge" || !need.provider) {
            return fillDemo(copy.voiceEdge, vars);
          }
          return officer !== voice
            ? fillDemo(copy.voicePair, vars)
            : fillDemo(copy.voiceNeural, { lang, voice });
        })()
      : need.tts === "native"
        ? fillDemo(copy.voiceReady, { lang })
        : need.tts === "fallback"
          ? fillDemo(copy.voiceFallback, { lang })
          : copy.voiceNone;
  const stt =
    need.stt === "ready"
      ? fillDemo(copy.sttReady, { lang })
      : copy.sttEngine;
  return `${tts} ${stt}`;
}
