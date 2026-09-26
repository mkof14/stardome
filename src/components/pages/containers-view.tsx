"use client";

import { ContainerConnectionDiagram } from "@/components/container-connection-diagram";
import { ContainerFigure } from "@/components/container-figure";
import {
  NumberedGrid,
  NumberedItem,
  PageBody,
  PageHero,
  PageShell,
  SectionKicker,
  SectionLead,
  SectionTitle,
  WatchButton,
  WatchChip,
  WatchLink,
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
      <div data-testid="agron-brand-hero">
        <PageHero
          kicker={show.kicker}
          title={show.title}
          lead={show.lead}
          aside={
            <ContainerFigure
              image={CONTAINER_BRAND}
              priority
              sizes="(min-width: 1024px) 28rem, 100vw"
            />
          }
        >
          <p className="max-w-xl font-body text-sm leading-relaxed text-bridge-dim">
            {show.brandCaption}
          </p>
        </PageHero>
      </div>

      <nav
        aria-label={show.unitsTitle}
        className="border-y border-bridge-line bg-bridge-panel"
        data-testid="agron-unit-jump"
      >
        <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 py-3 md:px-6">
          {show.units.map((unit, index) => (
            <WatchChip key={unit.name} href={`#agron-unit-${index}`}>
              {unit.name}
            </WatchChip>
          ))}
        </div>
      </nav>

      <PageBody>
        <section aria-labelledby="agron-units-heading" data-testid="agron-container-units">
          <SectionKicker>{show.kicker}</SectionKicker>
          <SectionTitle id="agron-units-heading">{show.unitsTitle}</SectionTitle>
          <SectionLead>{show.unitsLead}</SectionLead>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {CONTAINER_UNITS.map((image, index) => (
              <div key={image.src} id={`agron-unit-${index}`}>
                <ContainerFigure
                  image={image}
                  caption={
                    <>
                      <p className="font-mono text-[11px] text-orange">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="mt-1 font-ui text-lg font-bold tracking-tight text-bridge-text">
                        {show.units[index].name}
                      </p>
                      <p className="mt-1">{show.units[index].body}</p>
                    </>
                  }
                />
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="stardome-systems-heading">
          <SectionTitle id="stardome-systems-heading">{show.systemsTitle}</SectionTitle>
          <NumberedGrid className="mt-6 lg:grid-cols-3">
            {show.systems.map((item, index) => (
              <NumberedItem
                key={item.title}
                index={index + 1}
                title={item.title}
                body={item.body}
              />
            ))}
          </NumberedGrid>
        </section>

        <section aria-labelledby="agron-sites-heading" data-testid="agron-container-sites">
          <SectionKicker>{show.kicker}</SectionKicker>
          <SectionTitle id="agron-sites-heading">{show.sitesTitle}</SectionTitle>
          <SectionLead>{show.sitesLead}</SectionLead>
          <div className="mt-6 space-y-3">
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
          <p className="font-body text-sm text-bridge-dim">
            {t.containers.detectionLink}{" "}
            <WatchLink href="/how-it-works">
              <RtlAwareLabel text={t.containers.howLink} />
            </WatchLink>
          </p>
          <ContainerConnectionDiagram />
        </section>

        <WatchButton href="/contact">{t.containers.contact}</WatchButton>
      </PageBody>
    </PageShell>
  );
}
