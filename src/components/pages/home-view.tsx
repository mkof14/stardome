"use client";

import Link from "next/link";
import { ContainerFigure } from "@/components/container-figure";
import { HeroRadar } from "@/components/hero-radar";
import {
  NumberedGrid,
  NumberedItem,
  PageBody,
  PageHero,
  PageShell,
  RuleList,
  RuleRow,
  SectionKicker,
  SectionTitle,
} from "@/components/page-chrome";
import { RtlAwareLabel } from "@/components/rtl-aware-label";
import { CONTAINER_HOME_TEASER } from "@/lib/container-gallery";
import { containerShowCopy } from "@/lib/i18n/container-show-copy";
import { usePreferences } from "@/lib/i18n/context";

const cardHrefs = ["/how-it-works", "/interface", "/levels", "/technology"] as const;

export function HomeView() {
  const { t, locale } = usePreferences();
  const containers = containerShowCopy(locale);

  return (
    <PageShell>
      <PageHero
        kicker={t.home.kicker}
        title={t.home.title}
        lead={t.home.lead}
        aside={<HeroRadar />}
      >
        <ul className="max-w-xl space-y-3 border-s-2 border-orange ps-4 text-sm leading-relaxed text-muted sm:text-[15px]">
          {t.home.points.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-orange px-4 py-2.5 text-sm font-medium text-white hover:bg-orange/90"
          >
            {t.home.contactCta}
          </Link>
        </div>
      </PageHero>

      <PageBody>
        <NumberedGrid>
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

        <section>
          <SectionKicker>{t.home.interfaceKicker}</SectionKicker>
          <SectionTitle>{t.home.interfaceTitle}</SectionTitle>
          <p className="mt-4 max-w-2xl text-[1.02rem] leading-[1.7] text-muted">
            {t.home.interfaceLead}
          </p>
          <RuleList>
            {t.home.interfacePoints.map((item) => (
              <RuleRow key={item.title} title={item.title} body={item.body} />
            ))}
          </RuleList>
          <Link
            href="/interface"
            className="mt-8 inline-flex text-sm font-medium text-orange underline-offset-4 hover:underline"
          >
            {t.home.interfaceCta}
          </Link>
        </section>

        <section
          aria-labelledby="agron-containers-heading"
          className="border-t border-stroke pt-10"
          data-testid="home-agron-containers"
        >
          <div className="mb-3 flex gap-1.5" aria-hidden>
            <span className="h-1 w-8 bg-attn" />
            <span className="h-1 w-5 bg-teal" />
            <span className="h-1 w-5 bg-sky" />
          </div>
          <SectionKicker>{containers.homeKicker}</SectionKicker>
          <SectionTitle id="agron-containers-heading">{containers.homeTitle}</SectionTitle>
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
                className="mt-6 inline-flex text-sm font-medium text-orange underline-offset-4 hover:underline"
              >
                <RtlAwareLabel text={containers.homeCta} />
              </Link>
            </div>
          </div>
        </section>
      </PageBody>
    </PageShell>
  );
}
