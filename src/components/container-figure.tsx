import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ACCENT_BAR, type AccentName } from "@/lib/container-accents";
import type { ContainerFigure as ContainerFigureImage } from "@/lib/container-gallery";

export function ContainerFigure({
  image,
  caption,
  priority = false,
  bleed = false,
  accent,
  className,
  sizes,
}: {
  image: ContainerFigureImage;
  caption?: ReactNode;
  priority?: boolean;
  bleed?: boolean;
  accent?: AccentName;
  className?: string;
  sizes?: string;
}) {
  return (
    <figure
      className={cn(
        "overflow-hidden border-stroke bg-navy",
        bleed ? "border-y" : "border",
        className,
      )}
    >
      {accent ? <div className={cn("h-1 w-full", ACCENT_BAR[accent])} /> : null}
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        priority={priority}
        sizes={sizes ?? (bleed ? "100vw" : "(min-width: 1024px) 36rem, 100vw")}
        className="h-auto w-full"
      />
      {caption ? (
        <figcaption
          className={cn(
            "border-t border-stroke bg-page text-sm leading-relaxed text-muted",
            bleed ? "mx-auto max-w-6xl px-4 py-3 md:px-6" : "px-4 py-3",
          )}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
