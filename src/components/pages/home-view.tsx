"use client";

import Image from "next/image";
import Link from "next/link";
import { ContainerFigure } from "@/components/container-figure";
import { HeroRadar } from "@/components/hero-radar";
import {
  NumberedGrid,
  NumberedItem,
  OrangeRail,
  PageBody,
  PageHero,
  PageShell,
  SectionKicker,
  SectionLead,
  SectionTitle,
  WatchButton,
  WatchChip,
  WatchLink,
  WatchPanel,
} from "@/components/page-chrome";
import { RtlAwareLabel } from "@/components/rtl-aware-label";
import { CONTAINER_HOME_TEASER } from "@/lib/container-gallery";
import { AGRON_ENVELOPES } from "@/lib/home-art";
import { containerShowCopy } from "@/lib/i18n/container-show-copy";
import { homeShowCopy } from "@/lib/i18n/home-show-copy";
import { usePreferences } from "@/lib/i18n/context";

const cardHrefs = ["/how-it-works", "/interface", "/levels", "/technology"] as const;

export function HomeView() {
  const { t, locale } = usePreferences();
  const containers = containerShowCopy(locale);
  const show = homeShowCopy(locale);
  const watchItems = show.watchPick.map((index) => t.home.interfacePoints[index]);

  return (
    <PageShell>
      <PageHero
        kicker={t.home.kicker}
        title={t.home.title}
        lead={t.home.lead}
        aside={<HeroRadar />}
      >
        <OrangeRail>
          {t.home.points.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </OrangeRail>
        <WatchButton href="/contact" className="mt-6">
          {t.home.contactCta}
        </WatchButton>
      </PageHero>

      <PageBody>
        <section aria-labelledby="home-doors-heading">
          <SectionKicker>{show.doorsKicker}</SectionKicker>
          <h2 id="home-doors-heading" className="sr-only">
            {show.doorsKicker}
          </h2>
          <NumberedGrid className="mt-5">
            {t.home.cards.map((card, index) => (
              <NumberedItem
                key={cardHrefs[index]}
                index={index + 1}
                title={card.title}
                body={card.body}
                href={cardHrefs[index]}
              />
            ))}
          </NumberedGrid>
        </section>

        <section aria-labelledby="home-watch-heading">
          <SectionKicker>{t.home.interfaceKicker}</SectionKicker>
          <SectionTitle id="home-watch-heading">{t.home.interfaceTitle}</SectionTitle>
          <SectionLead>{t.home.interfaceLead}</SectionLead>
          <NumberedGrid className="mt-6">
            {watchItems.map((item, index) => (
              <NumberedItem
                key={item.title}
                index={index + 1}
                title={item.title}
                body={item.body}
              />
            ))}
          </NumberedGrid>
          <WatchLink href="/interface" className="mt-6">
            {t.home.interfaceCta}
          </WatchLink>
        </section>

        <section aria-labelledby="agron-containers-heading" data-testid="home-agron-containers">
          <SectionKicker>{containers.homeKicker}</SectionKicker>
          <SectionTitle id="agron-containers-heading">{containers.homeTitle}</SectionTitle>
          <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <Link href="/containers" className="group block">
              <ContainerFigure
                image={CONTAINER_HOME_TEASER}
                sizes="(min-width: 1024px) 40rem, 100vw"
              />
            </Link>
            <div>
              <SectionLead className="mt-0">{containers.homeLead}</SectionLead>
              <WatchLink href="/containers" className="mt-6">
                <RtlAwareLabel text={containers.homeCta} />
              </WatchLink>
            </div>
          </div>
        </section>

        <section aria-labelledby="agron-envelopes-heading" data-testid="home-agron-envelopes">
          <SectionKicker>{show.envelopeKicker}</SectionKicker>
          <SectionTitle id="agron-envelopes-heading">{show.envelopeTitle}</SectionTitle>
          <SectionLead>{show.envelopeLead}</SectionLead>
          <div className="mt-5 flex flex-wrap gap-3">
            <WatchChip>{show.envelopeDetect}</WatchChip>
            <WatchChip>{show.envelopeRespond}</WatchChip>
          </div>
          <WatchPanel className="mt-6 overflow-hidden p-0">
            <figure>
              <Image
                src={AGRON_ENVELOPES.src}
                alt={AGRON_ENVELOPES.alt}
                width={AGRON_ENVELOPES.width}
                height={AGRON_ENVELOPES.height}
                sizes="(min-width: 1024px) 72rem, 100vw"
                className="h-auto w-full"
              />
              <figcaption className="flex flex-col gap-4 border-t border-bridge-line px-5 py-4 font-body text-sm leading-relaxed text-bridge-dim md:flex-row md:items-center md:justify-between">
                <p className="max-w-2xl">{show.envelopeNote}</p>
                <WatchLink href="/interface">{show.envelopeCta}</WatchLink>
              </figcaption>
            </figure>
          </WatchPanel>
        </section>
      </PageBody>
    </PageShell>
  );
}
