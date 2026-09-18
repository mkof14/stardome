import { isLocale, localeMeta, type Locale } from "@/lib/i18n/locales";

/** BCP-47 tags for speech recognition and speech synthesis. */
export const SPEAK_BCP47: Record<Locale, string> = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  ru: "ru-RU",
  uk: "uk-UA",
  ar: "ar-SA",
  zh: "zh-CN",
  ja: "ja-JP",
  he: "he-IL",
};

export function speakTag(locale: string): string {
  return isLocale(locale) ? SPEAK_BCP47[locale] : locale;
}

export function SpeechEngine() {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function norm(lang: string) {
  return lang.toLowerCase().replaceAll("_", "-");
}

export function pickVoice(
  voices: ReadonlyArray<Pick<SpeechSynthesisVoice, "lang" | "name" | "localService">>,
  locale: string,
): Pick<SpeechSynthesisVoice, "lang" | "name" | "localService"> | null {
  if (!voices.length) return null;
  const tag = norm(speakTag(locale));
  const prefix = (isLocale(locale) ? locale : tag.slice(0, 2)).toLowerCase();
  const exact = voices.find((voice) => norm(voice.lang) === tag);
  if (exact) return exact;
  const starts = voices.filter((voice) => norm(voice.lang).startsWith(prefix));
  if (!starts.length) return null;
  return starts.find((voice) => voice.localService) ?? starts[0];
}

export type VoiceNeed = {
  tts: "native" | "fallback" | "none";
  stt: "ready" | "engine" | "none";
  voiceName: string | null;
};

export function voiceNeed(
  locale: Locale,
  voices: ReadonlyArray<Pick<SpeechSynthesisVoice, "lang" | "name" | "localService">>,
): VoiceNeed {
  const native = pickVoice(voices, locale);
  const tts: VoiceNeed["tts"] = native
    ? "native"
    : voices.length
      ? "fallback"
      : "none";
  const stt: VoiceNeed["stt"] = SpeechEngine() ? "ready" : "engine";
  return {
    tts,
    stt,
    voiceName: native?.name ?? null,
  };
}

export function languageLabel(locale: Locale) {
  return localeMeta[locale].native;
}
