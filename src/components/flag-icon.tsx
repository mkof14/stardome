import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/locales";

export function FlagIcon({ locale }: { locale: Locale }) {
  return (
    <svg
      viewBox="0 0 24 16"
      className="h-3.5 w-[21px] shrink-0 overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]"
      aria-hidden
    >
      {flagArt[locale]}
    </svg>
  );
}

const flagArt: Record<Locale, ReactNode> = {
  en: (
    <>
      <rect width="24" height="16" fill="#B22234" />
      <rect y="1.23" width="24" height="1.23" fill="#fff" />
      <rect y="3.69" width="24" height="1.23" fill="#fff" />
      <rect y="6.15" width="24" height="1.23" fill="#fff" />
      <rect y="8.62" width="24" height="1.23" fill="#fff" />
      <rect y="11.08" width="24" height="1.23" fill="#fff" />
      <rect y="13.54" width="24" height="1.23" fill="#fff" />
      <rect width="9.6" height="8.62" fill="#3C3B6E" />
      <g fill="#fff">
        <circle cx="1.5" cy="1.15" r="0.38" />
        <circle cx="3.3" cy="1.15" r="0.38" />
        <circle cx="5.1" cy="1.15" r="0.38" />
        <circle cx="6.9" cy="1.15" r="0.38" />
        <circle cx="8.5" cy="1.15" r="0.38" />
        <circle cx="2.4" cy="2.5" r="0.38" />
        <circle cx="4.2" cy="2.5" r="0.38" />
        <circle cx="6.0" cy="2.5" r="0.38" />
        <circle cx="7.8" cy="2.5" r="0.38" />
        <circle cx="1.5" cy="3.85" r="0.38" />
        <circle cx="3.3" cy="3.85" r="0.38" />
        <circle cx="5.1" cy="3.85" r="0.38" />
        <circle cx="6.9" cy="3.85" r="0.38" />
        <circle cx="8.5" cy="3.85" r="0.38" />
        <circle cx="2.4" cy="5.2" r="0.38" />
        <circle cx="4.2" cy="5.2" r="0.38" />
        <circle cx="6.0" cy="5.2" r="0.38" />
        <circle cx="7.8" cy="5.2" r="0.38" />
        <circle cx="1.5" cy="6.55" r="0.38" />
        <circle cx="3.3" cy="6.55" r="0.38" />
        <circle cx="5.1" cy="6.55" r="0.38" />
        <circle cx="6.9" cy="6.55" r="0.38" />
        <circle cx="8.5" cy="6.55" r="0.38" />
        <circle cx="2.4" cy="7.85" r="0.38" />
        <circle cx="4.2" cy="7.85" r="0.38" />
        <circle cx="6.0" cy="7.85" r="0.38" />
        <circle cx="7.8" cy="7.85" r="0.38" />
      </g>
    </>
  ),
  es: (
    <>
      <rect width="24" height="16" fill="#C60B1E" />
      <rect y="4" width="24" height="8" fill="#FFC400" />
    </>
  ),
  fr: (
    <>
      <rect width="8" height="16" fill="#002395" />
      <rect x="8" width="8" height="16" fill="#fff" />
      <rect x="16" width="8" height="16" fill="#ED2939" />
    </>
  ),
  de: (
    <>
      <rect width="24" height="16" fill="#000" />
      <rect y="5.33" width="24" height="5.34" fill="#D00" />
      <rect y="10.67" width="24" height="5.33" fill="#FFCE00" />
    </>
  ),
  ru: (
    <>
      <rect width="24" height="16" fill="#fff" />
      <rect y="5.33" width="24" height="5.34" fill="#0039A6" />
      <rect y="10.67" width="24" height="5.33" fill="#D52B1E" />
    </>
  ),
  uk: (
    <>
      <rect width="24" height="8" fill="#0057B7" />
      <rect y="8" width="24" height="8" fill="#FFD700" />
    </>
  ),
  ar: (
    <>
      <rect width="24" height="16" fill="#006C35" />
      <path d="M7 8h10M9 6.2h6M9 9.8h6" stroke="#fff" strokeWidth="1.1" />
    </>
  ),
  zh: (
    <>
      <rect width="24" height="16" fill="#DE2910" />
      <path fill="#FFDE00" d="M5.2 3.1l.62 1.9h2l-1.62 1.18.62 1.9-1.62-1.18-1.62 1.18.62-1.9L2.58 5h2z" />
    </>
  ),
  ja: (
    <>
      <rect width="24" height="16" fill="#fff" />
      <circle cx="12" cy="8" r="4.2" fill="#BC002D" />
    </>
  ),
  he: (
    <>
      <rect width="24" height="16" fill="#fff" />
      <rect y="1.4" width="24" height="2" fill="#0038B8" />
      <rect y="12.6" width="24" height="2" fill="#0038B8" />
      <path
        d="M12 4.6l2.3 4H9.7zm0 6.8l-2.3-4h4.6z"
        fill="none"
        stroke="#0038B8"
        strokeWidth="0.85"
      />
    </>
  ),
};
