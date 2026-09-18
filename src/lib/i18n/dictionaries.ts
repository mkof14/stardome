import type { Locale } from "@/lib/i18n/locales";
import type { Messages } from "@/lib/i18n/messages";
import { en } from "@/lib/i18n/messages";
import { ar } from "@/lib/i18n/ar";
import { de } from "@/lib/i18n/de";
import { es } from "@/lib/i18n/es";
import { fr } from "@/lib/i18n/fr";
import { he } from "@/lib/i18n/he";
import { ja } from "@/lib/i18n/ja";
import { ru } from "@/lib/i18n/ru";
import { uk } from "@/lib/i18n/uk";
import { zh } from "@/lib/i18n/zh";

export const dictionaries: Record<Locale, Messages> = {
  en,
  es,
  fr,
  de,
  ru,
  uk,
  ar,
  zh,
  ja,
  he,
};

/** Static per-locale returns so a language key cannot resolve to a missing chunk. */
export function messagesFor(locale: Locale): Messages {
  switch (locale) {
    case "es":
      return es;
    case "fr":
      return fr;
    case "de":
      return de;
    case "ru":
      return ru;
    case "uk":
      return uk;
    case "ar":
      return ar;
    case "zh":
      return zh;
    case "ja":
      return ja;
    case "he":
      return he;
    case "en":
    default:
      return en;
  }
}
