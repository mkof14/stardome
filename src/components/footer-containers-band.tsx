"use client";

import Image from "next/image";
import Link from "next/link";
import { CONTAINER_HOME_TEASER } from "@/lib/container-gallery";
import { containerShowCopy } from "@/lib/i18n/container-show-copy";
import { usePreferences } from "@/lib/i18n/context";

export function FooterContainersBand() {
  const { locale } = usePreferences();
  const show = containerShowCopy(locale);

  return (
    <div
      className="border-b border-sand/15 bg-navy"
      data-testid="footer-agron-containers"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-5 px-4 py-6 md:grid-cols-[11rem_minmax(0,1fr)_auto] md:px-6">
        <Link
          href="/containers"
          className="relative hidden overflow-hidden border border-attn/40 md:block"
        >
          <Image
            src={CONTAINER_HOME_TEASER.src}
            alt={CONTAINER_HOME_TEASER.alt}
            width={CONTAINER_HOME_TEASER.width}
            height={CONTAINER_HOME_TEASER.height}
            sizes="11rem"
            className="h-24 w-full object-cover"
          />
        </Link>
        <div className="min-w-0">
          <p className="font-ui text-[12px] tracking-wide text-attn">{show.footerKicker}</p>
          <p className="mt-1 font-heading text-2xl font-bold leading-tight text-sand">
            {show.footerTitle}
          </p>
          <p className="mt-1 text-[13px] text-sand/65">{show.footerLead}</p>
        </div>
        <Link
          href="/containers"
          className="inline-flex items-center justify-center border border-attn px-4 py-2.5 text-sm font-medium text-attn hover:bg-attn hover:text-navy"
        >
          {show.footerCta}
        </Link>
      </div>
    </div>
  );
}
