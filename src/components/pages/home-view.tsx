"use client";

import Image from "next/image";
import Link from "next/link";
import { ContainerFigure } from "@/components/container-figure";
import { HeroRadar } from "@/components/hero-radar";
import { RtlAwareLabel } from "@/components/rtl-aware-label";
import { cn } from "@/lib/cn";
import {
  ACCENT_BAR,
  ACCENT_BORDER,
  ACCENT_TEXT,
  type AccentName,
} from "@/lib/container-accents";
import { CONTAINER_HOME_TEASER } from "@/lib/container-gallery";
import { AGRON_ENVELOPES } from "@/lib/home-art";
import { containerShowCopy } from "@/lib/i18n/container-show-copy";
import { homeShowCopy } from "@/lib/i18n/home-show-copy";
import { usePreferences } from "@/lib/i18n/context";

const cardHrefs = ["/how-it-works", "/interface", "/levels", "/technology"] as const;
const doorAccents: AccentName[] = ["teal", "attn", "sky", "orange"];
const watchAccents: AccentName[] = ["teal", "sky", "attn", "orange"];
const pointAccents: AccentName[] = ["teal", "attn", "sky"];

export function HomeView() {
  const { t, locale } = usePreferences();
  const containers = containerShowCopy(locale);
  const show = homeShowCopy(locale);
  const watchItems = show.watchPick.map((index) => t.home.interfacePoints[index]);

  return (
    <div className="bg-page text-ink">
      <section className="relative overflow-hidden bg-navy text-sand">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-attn via-teal to-sky" />
        <div className="mx-auto grid max-w-6xl items-start gap-12 px-4 py-16 md:px-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:py-20">
          <div>
            <p className="font-ui text-[12px] tracking-wide text-attn">{t.home.kicker}</p>
            <div className="mt-3 flex gap-1.5" aria-hidden>
              <span className="h-1.5 w-12 bg-attn" />
              <span className="h-1.5 w-8 bg-teal" />
              <span className="h-1.5 w-8 bg-sky" />
              <span className="h-1.5 w-6 bg-orange" />
            </div>
            <h1 className="mt-5 max-w-[16ch] font-heading text-[3.5rem] font-bold leading-[0.95] text-sand sm:text-[5.4rem]">
              {t.home.title}
            </h1>
            <p className="mt-6 max-w-xl text-[1.05rem] leading-[1.7] text-sand/75">
              {t.home.lead}
            </p>
            <ul className="mt-8 max-w-xl space-y-4">
              {t.home.points.map((line, index) => (
                <li
                  key={line}
                  className={cn(
                    "border-s-2 ps-4 text-sm leading-relaxed text-sand/70 sm:text-[15px]",
                    ACCENT_BORDER[pointAccents[index]],
                  )}
                >
                  {line}
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center justify-center bg-orange px-4 py-2.5 text-sm font-medium text-white hover:bg-orange/90"
            >
              {t.home.contactCta}
            </Link>
          </div>
          <div className="relative lg:pt-6">
            <HeroRadar />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-16 md:px-6">
        <section aria-labelledby="home-doors-heading">
          <p className="font-ui text-[12px] tracking-wide text-teal">{show.doorsKicker}</p>
          <h2 id="home-doors-heading" className="sr-only">
            {show.doorsKicker}
          </h2>
          <div className="mt-6 divide-y divide-stroke border-y border-stroke">
            {t.home.cards.map((card, index) => {
              const accent = doorAccents[index];
              return (
                <Link
                  key={cardHrefs[index]}
                  href={cardHrefs[index]}
                  className="group grid gap-2 py-6 sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-8"
                >
                  <span className={cn("font-mono text-[12px]", ACCENT_TEXT[accent])}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="font-heading text-3xl font-bold text-ink group-hover:text-orange">
                      {card.title}
                    </span>
                    <span className="mt-2 block max-w-xl text-sm leading-relaxed text-muted">
                      {card.body}
                    </span>
                  </span>
                  <span className={cn("hidden font-mono text-sm sm:block", ACCENT_TEXT[accent])}>
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="home-watch-heading">
          <p className="font-ui text-[12px] tracking-wide text-sky">{t.home.interfaceKicker}</p>
          <h2
            id="home-watch-heading"
            className="mt-2 max-w-[20ch] font-heading text-3xl font-bold text-ink sm:text-4xl"
          >
            {t.home.interfaceTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-[1.02rem] leading-[1.7] text-muted">
            {t.home.interfaceLead}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {watchItems.map((item, index) => {
              const accent = watchAccents[index];
              return (
                <article key={item.title} className="border border-stroke bg-panel p-5">
                  <div className={cn("h-1 w-10", ACCENT_BAR[accent])} />
                  <h3 className="mt-4 font-heading text-xl font-bold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
                </article>
              );
            })}
          </div>
          <Link
            href="/interface"
            className="mt-8 inline-flex text-sm font-medium text-sky underline-offset-4 hover:underline"
          >
            {t.home.interfaceCta}
          </Link>
        </section>

        <section aria-labelledby="agron-containers-heading" data-testid="home-agron-containers">
          <p className="font-ui text-[12px] tracking-wide text-attn">{containers.homeKicker}</p>
          <h2
            id="agron-containers-heading"
            className="mt-2 max-w-[20ch] font-heading text-3xl font-bold text-ink sm:text-4xl"
          >
            {containers.homeTitle}
          </h2>
          <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <Link href="/containers" className="group block">
              <ContainerFigure
                image={CONTAINER_HOME_TEASER}
                accent="attn"
                sizes="(min-width: 1024px) 40rem, 100vw"
              />
            </Link>
            <div>
              <p className="max-w-xl text-[1.02rem] leading-[1.7] text-muted">
                {containers.homeLead}
              </p>
              <Link
                href="/containers"
                className="mt-6 inline-flex text-sm font-medium text-attn underline-offset-4 hover:underline"
              >
                <RtlAwareLabel text={containers.homeCta} />
              </Link>
            </div>
          </div>
        </section>
      </div>

      <section
        className="bg-navy text-sand"
        aria-labelledby="agron-envelopes-heading"
        data-testid="home-agron-envelopes"
      >
        <div className="mx-auto max-w-6xl px-4 pt-14 md:px-6">
          <p className="font-ui text-[12px] tracking-wide text-attn">{show.envelopeKicker}</p>
          <div className="mt-3 flex gap-1.5" aria-hidden>
            <span className="h-1.5 w-10 bg-teal" />
            <span className="h-1.5 w-8 bg-sky" />
            <span className="h-1.5 w-8 bg-attn" />
            <span className="h-1.5 w-6 bg-orange" />
          </div>
          <h2
            id="agron-envelopes-heading"
            className="mt-4 max-w-[18ch] font-heading text-3xl font-bold text-sand sm:text-5xl"
          >
            {show.envelopeTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-[1.02rem] leading-[1.7] text-sand/70">
            {show.envelopeLead}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 border border-teal/50 px-3 py-1 text-sm text-teal">
              <span className="h-2 w-2 bg-teal" />
              {show.envelopeDetect}
            </span>
            <span className="inline-flex items-center gap-2 border border-orange/50 px-3 py-1 text-sm text-orange">
              <span className="h-2 w-2 bg-orange" />
              {show.envelopeRespond}
            </span>
          </div>
        </div>
        <figure className="mt-8">
          <Image
            src={AGRON_ENVELOPES.src}
            alt={AGRON_ENVELOPES.alt}
            width={AGRON_ENVELOPES.width}
            height={AGRON_ENVELOPES.height}
            sizes="100vw"
            className="h-auto w-full"
          />
          <figcaption className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm leading-relaxed text-sand/55 md:flex-row md:items-center md:justify-between md:px-6">
            <p className="max-w-2xl">{show.envelopeNote}</p>
            <Link
              href="/interface"
              className="inline-flex shrink-0 text-sm font-medium text-attn underline-offset-4 hover:underline"
            >
              {show.envelopeCta}
            </Link>
          </figcaption>
        </figure>
      </section>
    </div>
  );
}
