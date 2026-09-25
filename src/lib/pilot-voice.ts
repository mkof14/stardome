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

/** Locale-matched adult male neural voices (Azure / Edge short names). */
export const MALE_NEURAL: Record<Locale, { voice: string; lang: string }> = {
  en: { voice: "en-US-AndrewNeural", lang: "en-US" },
  es: { voice: "es-ES-AlvaroNeural", lang: "es-ES" },
  fr: { voice: "fr-FR-HenriNeural", lang: "fr-FR" },
  de: { voice: "de-DE-ConradNeural", lang: "de-DE" },
  ru: { voice: "ru-RU-DmitryNeural", lang: "ru-RU" },
  uk: { voice: "uk-UA-OstapNeural", lang: "uk-UA" },
  ar: { voice: "ar-SA-HamedNeural", lang: "ar-SA" },
  zh: { voice: "zh-CN-YunxiNeural", lang: "zh-CN" },
  ja: { voice: "ja-JP-KeitaNeural", lang: "ja-JP" },
  he: { voice: "he-IL-AvriNeural", lang: "he-IL" },
};

export function maleVoiceFor(locale: Locale) {
  return MALE_NEURAL[locale];
}

/** Second watch voice so Demo can play officer and Pilot as two people.
 *  Always male — locales with only one native male neural use Brian multilingual. */
export const OFFICER_NEURAL: Record<Locale, { voice: string; lang: string }> = {
  en: { voice: "en-US-BrianNeural", lang: "en-US" },
  es: { voice: "es-ES-ArnauNeural", lang: "es-ES" },
  fr: { voice: "fr-FR-ClaudeNeural", lang: "fr-FR" },
  de: { voice: "de-DE-KillianNeural", lang: "de-DE" },
  ru: { voice: "en-US-BrianMultilingualNeural", lang: "ru-RU" },
  uk: { voice: "en-US-BrianMultilingualNeural", lang: "uk-UA" },
  ar: { voice: "en-US-BrianMultilingualNeural", lang: "ar-SA" },
  zh: { voice: "zh-CN-YunjianNeural", lang: "zh-CN" },
  ja: { voice: "ja-JP-DaichiNeural", lang: "ja-JP" },
  he: { voice: "en-US-BrianMultilingualNeural", lang: "he-IL" },
};

export function officerVoiceFor(locale: Locale) {
  return OFFICER_NEURAL[locale];
}

export function neuralVoiceFor(
  locale: Locale,
  speaker: "pilot" | "officer" = "pilot",
) {
  return speaker === "officer" ? officerVoiceFor(locale) : maleVoiceFor(locale);
}

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

const MALE_NAME =
  /male|\bman\b|\bguy\b|andrew|david|daniel|dmitry|dmitri|ostap|alvaro|arnau|henri|claude|conrad|killian|hamed|yunxi|yunjian|yunyang|keita|daichi|avri|onyx|echo|thomas|george|james|mark|paul|ryan|brian|eric|christopher|davis|jorge|ichiro|ravi|fred|microsoft david|microsoft mark|microsoft george|google uk english male/i;

const FEMALE_NAME =
  /female|woman|girl|zira|samantha|karen|susan|helena|katya|hila|nanami|xiaoxiao|aria|jenny|sonia|elvira|denise|katja|dariya|polina|salma|yael|svetlana|irina|zariyah|masha|google uk english female|microsoft zira|microsoft helena/i;

export function isLikelyMaleVoice(name: string) {
  if (!name.trim()) return false;
  if (FEMALE_NAME.test(name) && !MALE_NAME.test(name)) return false;
  return MALE_NAME.test(name);
}

function scoreVoice(
  voice: Pick<SpeechSynthesisVoice, "lang" | "name" | "localService">,
  locale: string,
) {
  const tag = norm(speakTag(locale));
  const prefix = (isLocale(locale) ? locale : tag.slice(0, 2)).toLowerCase();
  const lang = norm(voice.lang);
  let score = 0;
  if (lang === tag) score += 100;
  else if (lang.startsWith(prefix)) score += 50;
  else return -1;
  if (isLikelyMaleVoice(voice.name)) score += 40;
  else if (FEMALE_NAME.test(voice.name)) score -= 35;
  if (voice.localService) score += 5;
  return score;
}

export function pickVoice(
  voices: ReadonlyArray<Pick<SpeechSynthesisVoice, "lang" | "name" | "localService">>,
  locale: string,
): Pick<SpeechSynthesisVoice, "lang" | "name" | "localService"> | null {
  if (!voices.length) return null;
  let best: Pick<SpeechSynthesisVoice, "lang" | "name" | "localService"> | null =
    null;
  let bestScore = -1;
  for (const voice of voices) {
    const score = scoreVoice(voice, locale);
    if (score > bestScore) {
      bestScore = score;
      best = voice;
    }
  }
  return best;
}

/** Second browser voice so Demo can still contrast officer vs Pilot without a key. */
export function pickOfficerVoice(
  voices: ReadonlyArray<Pick<SpeechSynthesisVoice, "lang" | "name" | "localService">>,
  locale: string,
  skipName?: string | null,
): Pick<SpeechSynthesisVoice, "lang" | "name" | "localService"> | null {
  if (!voices.length) return null;
  let best: Pick<SpeechSynthesisVoice, "lang" | "name" | "localService"> | null =
    null;
  let bestScore = -1;
  for (const voice of voices) {
    if (skipName && voice.name === skipName) continue;
    if (FEMALE_NAME.test(voice.name) && !isLikelyMaleVoice(voice.name)) continue;
    const score = scoreVoice(voice, locale);
    if (score < 0) continue;
    if (score > bestScore) {
      bestScore = score;
      best = voice;
    }
  }
  return best;
}

export type NeuralVoiceStatus = {
  ready: boolean;
  voice: string | null;
  officerVoice?: string | null;
  provider: string | null;
};

export type VoiceNeed = {
  tts: "neural" | "native" | "fallback" | "none";
  stt: "ready" | "engine" | "none";
  voiceName: string | null;
  officerVoiceName?: string | null;
  provider?: string | null;
};

export function voiceNeed(
  locale: Locale,
  voices: ReadonlyArray<Pick<SpeechSynthesisVoice, "lang" | "name" | "localService">>,
  neural?: NeuralVoiceStatus | null,
): VoiceNeed {
  const stt: VoiceNeed["stt"] = SpeechEngine() ? "ready" : "engine";
  if (neural?.ready) {
    return {
      tts: "neural",
      stt,
      voiceName: neural.voice ?? maleVoiceFor(locale).voice,
      officerVoiceName:
        neural.officerVoice ?? officerVoiceFor(locale).voice,
      provider: neural.provider,
    };
  }
  const native = pickVoice(voices, locale);
  const officer = pickOfficerVoice(voices, locale, native?.name);
  const tts: VoiceNeed["tts"] = native
    ? "native"
    : voices.length
      ? "fallback"
      : "none";
  return {
    tts,
    stt,
    voiceName: native?.name ?? null,
    officerVoiceName: officer && officer.name !== native?.name ? officer.name : null,
  };
}

export function languageLabel(locale: Locale) {
  return localeMeta[locale].native;
}
