import Image from "next/image";
import { cn } from "@/lib/cn";

/** Official StarDome wordmark. PNG stays for PDF and fallback. */
export const STARDOME_MARK = "/SD_Logo1.webp";
export const STARDOME_MARK_PNG = "/SD_Logo1.png";
export const STARWALL_MARK = STARDOME_MARK;
export const STARWALL_MARK_PNG = STARDOME_MARK_PNG;
export const STARWALL_MARK_W = 1600;
export const STARWALL_MARK_H = 533;

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ className, priority = false }: BrandLogoProps) {
  return (
    <Image
      src={STARDOME_MARK}
      alt="StarDome"
      width={STARWALL_MARK_W}
      height={STARWALL_MARK_H}
      unoptimized
      priority={priority}
      className={cn(
        "w-auto shrink-0 object-contain object-left [filter:drop-shadow(0_0_0.7px_#041018)_drop-shadow(0_1px_2px_rgb(4_16_24/0.4))]",
        className ?? "h-8 sm:h-9",
      )}
    />
  );
}
