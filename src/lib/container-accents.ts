export type AccentName = "teal" | "attn" | "sky" | "orange";

export const UNIT_ACCENTS: AccentName[] = ["teal", "attn", "sky", "orange"];
export const SYSTEM_ACCENTS: AccentName[] = ["teal", "sky", "attn"];

export const ACCENT_BAR: Record<AccentName, string> = {
  teal: "bg-teal",
  attn: "bg-attn",
  sky: "bg-sky",
  orange: "bg-orange",
};

export const ACCENT_TEXT: Record<AccentName, string> = {
  teal: "text-teal",
  attn: "text-attn",
  sky: "text-sky",
  orange: "text-orange",
};

export const ACCENT_BORDER: Record<AccentName, string> = {
  teal: "border-teal",
  attn: "border-attn",
  sky: "border-sky",
  orange: "border-orange",
};

export const ACCENT_WASH: Record<AccentName, string> = {
  teal: "bg-teal/10",
  attn: "bg-attn/10",
  sky: "bg-sky/10",
  orange: "bg-orange/10",
};
