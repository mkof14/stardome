import Image from "next/image";
import { cn } from "@/lib/cn";

/** Cache-bust so browsers drop the previous wordmark after SW3.png was replaced. */
export const STARWALL_MARK = "/SW3.png?v=oval";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ className, priority = false }: BrandLogoProps) {
  return (
    <Image
      src={STARWALL_MARK}
      alt="StarWall"
      width={1466}
      height={543}
      unoptimized
      priority={priority}
      className={cn(
        "w-auto shrink-0 object-contain object-left",
        className ?? "h-8 sm:h-9",
      )}
    />
  );
}
