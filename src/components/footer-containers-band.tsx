"use client";

import Image from "next/image";
import Link from "next/link";
import { WatchButton, WatchKicker } from "@/components/page-chrome";
import { CONTAINER_HOME_TEASER } from "@/lib/container-gallery";
import { containerShowCopy } from "@/lib/i18n/container-show-copy";
import { usePreferences } from "@/lib/i18n/context";

export function FooterContainersBand() {
  const { locale } = usePreferences();
  const show = containerShowCopy(locale);

  return (
    <div
      className="border-b border-bridge-line bg-bridge-panel"
      data-testid="footer-agron-containers"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-5 px-4 py-6 md:grid-cols-[11rem_minmax(0,1fr)_auto] md:px-6">
        <Link
          href="/containers"
          className="relative hidden overflow-hidden rounded-2xl border border-bridge-line md:block"
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
          <WatchKicker>{show.footerKicker}</WatchKicker>
          <p className="mt-1 font-ui text-2xl font-bold tracking-tight text-bridge-text">
            {show.footerTitle}
          </p>
          <p className="mt-1 font-body text-[13px] text-bridge-dim">{show.footerLead}</p>
        </div>
        <WatchButton href="/containers">{show.footerCta}</WatchButton>
      </div>
    </div>
  );
}
