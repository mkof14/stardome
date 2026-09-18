import Image from "next/image";
import { cn } from "@/lib/cn";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ className, priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/SW3.png"
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
