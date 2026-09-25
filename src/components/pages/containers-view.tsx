"use client";

import Link from "next/link";
import { ContainerConnectionDiagram } from "@/components/container-connection-diagram";
import { ContainerFigure } from "@/components/container-figure";
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
import {
  CONTAINER_BRAND,
  CONTAINER_SITES_FOUR,
  CONTAINER_SITES_THREE,
  CONTAINER_UNITS,
} from "@/lib/container-gallery";
import { containerShowCopy } from "@/lib/i18n/container-show-copy";
import { usePreferences } from "@/lib/i18n/context";

const zoneHrefs = [
  "/containers/detection",
  "/containers/countermeasures",
  null,
  null,
] as const;

const subHrefs = [
  "/containers/tiers",
  "/containers/specs",
  "/containers/countermeasures",
  "/containers/deployment",
] as const;

export function ContainersView() {
  const { t, locale } = usePreferences();
  const show = containerShowCopy(locale);

  return (
    <PageShell>
      <PageHero kicker={show.kicker} title={show.title} lead={show.lead} />

      <div data-testid="agron-brand-hero">
        <ContainerFigure
          image={CONTAINER_BRAND}
          priority
          bleed
          caption={show.brandCaption}
        />
      </div>

      <PageBody>
        <section aria-labelledby="agron-units-heading" data-testid="agron-container-units">
          <SectionKicker>{show.kicker}</SectionKicker>
          <SectionTitle id="agron-units-heading">{show.unitsTitle}</SectionTitle>
          <p className="mt-4 max-w-2xl text-[1.02rem] leading-[1.7] text-muted">
            {show.unitsLead}
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {CONTAINER_UNITS.map((image, index) => (
              <ContainerFigure
                key={image.src}
                image={image}
                caption={
                  <>
                    <p className="font-heading text-lg font-semibold text-ink">
                      {show.units[index].name}
                    </p>
                    <p className="mt-1">{show.units[index].body}</p>
                  </>
                }
              />
            ))}
          </div>
        </section>

        <section aria-labelledby="stardome-systems-heading">
          <SectionTitle id="stardome-systems-heading">{show.systemsTitle}</SectionTitle>
          <div className="mt-6">
            <RuleList>
              {show.systems.map((item) => (
                <RuleRow key={item.title} title={item.title} body={item.body} />
              ))}
            </RuleList>
          </div>
        </section>

        <section aria-labelledby="agron-sites-heading" data-testid="agron-container-sites">
          <SectionTitle id="agron-sites-heading">{show.sitesTitle}</SectionTitle>
          <p className="mt-4 max-w-2xl text-[1.02rem] leading-[1.7] text-muted">
            {show.sitesLead}
          </p>
          <div className="mt-8 space-y-6">
            <ContainerFigure
              image={CONTAINER_SITES_THREE}
              sizes="(min-width: 1024px) 72rem, 100vw"
              caption={show.sitesThreeCaption}
            />
            <ContainerFigure
              image={CONTAINER_SITES_FOUR}
              sizes="(min-width: 1024px) 72rem, 100vw"
              caption={show.sitesFourCaption}
            />
          </div>
        </section>

        <NumberedGrid>
          {t.containers.zones.map((zone, index) => (
            <NumberedItem
              key={zone.title}
              index={index + 1}
              title={zone.title}
              body={zone.body}
              href={zoneHrefs[index] ?? undefined}
            />
          ))}
        </NumberedGrid>

        <NumberedGrid>
          {t.containers.subpages.map((title, index) => (
            <NumberedItem
              key={subHrefs[index]}
              index={index + 1}
              title={title}
              href={subHrefs[index]}
            />
          ))}
        </NumberedGrid>

        <section className="space-y-5" data-testid="container-connection">
          <p className="text-sm text-muted">
            {t.containers.detectionLink}{" "}
            <Link href="/how-it-works" className="text-orange hover:underline">
              <RtlAwareLabel text={t.containers.howLink} />
            </Link>
          </p>
          <ContainerConnectionDiagram />
        </section>

        <Link
          href="/contact"
          className="inline-flex bg-orange px-4 py-2.5 text-sm font-medium text-white hover:bg-orange/90"
        >
          {t.containers.contact}
        </Link>
      </PageBody>
    </PageShell>
  );
}
