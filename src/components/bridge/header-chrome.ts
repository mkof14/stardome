import { cn } from "@/lib/cn";

/** Compact top-bar control: small, and it lifts on hover. */
export function headerChromeButtonClass(active = false) {
  return cn(
    "group inline-flex h-8 min-w-8 shrink-0 flex-col items-center justify-center gap-px rounded-lg px-1.5 font-body text-[10px] font-medium leading-none",
    "transition duration-150 ease-out will-change-transform",
    "hover:-translate-y-0.5 hover:bg-orange/12 hover:text-orange hover:shadow-[0_6px_14px_rgb(241_90_0/0.28)]",
    "active:translate-y-0 active:shadow-none",
    active ? "bg-orange/12 text-orange" : "text-ink",
  );
}

export const headerChromeIconClass =
  "h-3.5 w-3.5 transition duration-150 group-hover:scale-110";
