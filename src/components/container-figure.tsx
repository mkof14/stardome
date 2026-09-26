import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { ContainerFigure as ContainerFigureImage } from "@/lib/container-gallery";

export function ContainerFigure({
  image,
  caption,
  priority = false,
  bleed = false,
  className,
  sizes,
}: {
  image: ContainerFigureImage;
  caption?: ReactNode;
  priority?: boolean;
  bleed?: boolean;
  className?: string;
  sizes?: string;
}) {
  return (
    <figure
      className={cn(
        "overflow-hidden border-bridge-line bg-bridge-panel shadow-[0_10px_28px_rgb(15_25_34/0.08)]",
        bleed ? "border-y" : "rounded-2xl border",
        className,
      )}
    >
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
            "border-t border-bridge-line bg-bridge-panel font-body text-sm leading-relaxed text-bridge-dim",
            bleed ? "mx-auto max-w-6xl px-4 py-3 md:px-6" : "px-5 py-4",
          )}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
