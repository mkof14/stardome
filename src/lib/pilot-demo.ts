import type { BridgeSessionValue } from "@/lib/bridge-session-types";
import { fillDemo, pilotDemoCopy } from "@/lib/i18n/pilot-demo-copy";
import type { Locale } from "@/lib/i18n/locales";
import { languageLabel, type VoiceNeed } from "@/lib/pilot-voice";
import { watchReply } from "@/lib/pilot-watch";

export type DemoRaise = {
  instruments?: boolean;
  advice?: boolean;
  comms?: boolean;
};

export type DemoBeat = {
  role: "officer" | "pilot";
  text: string;
  raise?: DemoRaise;
  speak: boolean;
};

export function demoBeats(session: BridgeSessionValue, locale: Locale): DemoBeat[] {
  const copy = pilotDemoCopy(locale);
  if (session.live) {
    return [{ role: "pilot", text: copy.liveBlock, speak: true }];
  }
  const picture = watchReply(session, locale).trim();
  const status = session.scenarioId ? picture : copy.quietStatus;
  const advice = session.scenarioId ? picture : copy.quietAdvice;
  return [
    { role: "pilot", text: copy.intro, speak: true, raise: { instruments: true } },
    { role: "officer", text: copy.officerStatus, speak: false },
    {
      role: "pilot",
      text: status,
      speak: true,
      raise: { instruments: true, advice: true },
    },
    { role: "officer", text: copy.officerAdvice, speak: false },
    {
      role: "pilot",
      text: advice,
      speak: true,
      raise: { instruments: true, advice: true, comms: true },
    },
    { role: "officer", text: copy.officerNotify, speak: false },
    { role: "pilot", text: copy.notifyReply, speak: true, raise: { comms: true } },
    { role: "pilot", text: copy.outro, speak: true },
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
      ? fillDemo(copy.voiceNeural, { lang, voice: need.voiceName ?? "" })
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
