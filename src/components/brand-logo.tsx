import Image from "next/image";
import { cn } from "@/lib/cn";

/** Optimized chrome hex badge. PNG stays for PDF and fallback. */
export const STARWALL_MARK = "/starwall-logo.webp";
export const STARWALL_MARK_PNG = "/SW3.png";
export const STARWALL_MARK_W = 800;
export const STARWALL_MARK_H = 297;

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ className, priority = false }: BrandLogoProps) {
  return (
    <Image
      src={STARWALL_MARK}
      alt="StarWall"
      width={STARWALL_MARK_W}
      height={STARWALL_MARK_H}
      priority={priority}
      sizes="180px"
      className={cn(
        "w-auto shrink-0 object-contain object-left",
        className ?? "h-8 sm:h-9",
      )}
    />
  );
}
