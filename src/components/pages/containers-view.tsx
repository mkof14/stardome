"use client";

import Image from "next/image";
import Link from "next/link";
import { ContainerConnectionDiagram } from "@/components/container-connection-diagram";
import { ContainerFigure } from "@/components/container-figure";
import {
  NumberedGrid,
  NumberedItem,
  PageBody,
  PageShell,
  SectionKicker,
  SectionTitle,
} from "@/components/page-chrome";
import { RtlAwareLabel } from "@/components/rtl-aware-label";
import { cn } from "@/lib/cn";
import {
  ACCENT_BAR,
  ACCENT_BORDER,
  ACCENT_TEXT,
  ACCENT_WASH,
  SYSTEM_ACCENTS,
  UNIT_ACCENTS,
} from "@/lib/container-accents";
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
      <section
        className="relative isolate overflow-hidden bg-navy"
        data-testid="agron-brand-hero"
      >
        <Image
          src={CONTAINER_BRAND.src}
          alt={CONTAINER_BRAND.alt}
          width={CONTAINER_BRAND.width}
          height={CONTAINER_BRAND.height}
          priority
          sizes="100vw"
          className="h-[min(44rem,92vw)] w-full object-cover object-[center_12%]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy from-30% via-navy/75 to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-6xl px-4 pb-10 pt-28 md:px-6">
            <p className="font-ui text-[12px] tracking-wide text-attn">{show.kicker}</p>
            <div className="mt-3 flex gap-1.5" aria-hidden data-testid="agron-hero-accents">
              <span className="h-1.5 w-12 bg-attn shadow-[0_0_0_1px_rgba(0,0,0,0.35)]" />
              <span className="h-1.5 w-8 bg-teal shadow-[0_0_0_1px_rgba(0,0,0,0.35)]" />
              <span className="h-1.5 w-8 bg-sky shadow-[0_0_0_1px_rgba(0,0,0,0.35)]" />
              <span className="h-1.5 w-6 bg-orange shadow-[0_0_0_1px_rgba(0,0,0,0.35)]" />
            </div>
            <h1 className="mt-4 max-w-[16ch] font-heading text-[3.4rem] font-bold leading-[0.95] text-sand sm:text-[5.4rem]">
              {show.title}
            </h1>
            <p className="mt-5 max-w-xl text-[1.05rem] leading-[1.7] text-sand/80">
              {show.lead}
            </p>
            <p className="mt-4 max-w-xl text-sm text-sand/55">{show.brandCaption}</p>
          </div>
        </div>
      </section>

      <nav
        aria-label={show.unitsTitle}
        className="border-b border-stroke bg-panel"
        data-testid="agron-unit-jump"
      >
        <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 py-3 md:px-6">
          {show.units.map((unit, index) => {
            const accent = UNIT_ACCENTS[index];
            return (
              <a
                key={unit.name}
                href={`#agron-unit-${index}`}
                className={cn(
                  "inline-flex items-center gap-2 border px-3 py-1.5 text-sm hover:bg-page",
                  ACCENT_BORDER[accent],
                  ACCENT_TEXT[accent],
                )}
              >
                <span className={cn("h-2 w-2", ACCENT_BAR[accent])} />
                {unit.name}
              </a>
            );
          })}
        </div>
      </nav>

      <PageBody>
        <section aria-labelledby="agron-units-heading" data-testid="agron-container-units">
          <SectionKicker>{show.kicker}</SectionKicker>
          <SectionTitle id="agron-units-heading">{show.unitsTitle}</SectionTitle>
          <p className="mt-4 max-w-2xl text-[1.02rem] leading-[1.7] text-muted">
            {show.unitsLead}
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {CONTAINER_UNITS.map((image, index) => {
              const accent = UNIT_ACCENTS[index];
              return (
                <div key={image.src} id={`agron-unit-${index}`}>
                  <ContainerFigure
                    image={image}
                    accent={accent}
                    caption={
                      <>
                        <p className={cn("font-mono text-[11px]", ACCENT_TEXT[accent])}>
                          {String(index + 1).padStart(2, "0")}
                        </p>
                        <p className="mt-1 font-heading text-lg font-semibold text-ink">
                          {show.units[index].name}
                        </p>
                        <p className="mt-1">{show.units[index].body}</p>
                      </>
                    }
                  />
                </div>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="stardome-systems-heading">
          <SectionTitle id="stardome-systems-heading">{show.systemsTitle}</SectionTitle>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {show.systems.map((item, index) => {
              const accent = SYSTEM_ACCENTS[index];
              return (
                <article
                  key={item.title}
                  className={cn("border border-stroke p-5", ACCENT_WASH[accent])}
                >
                  <div className={cn("h-1 w-12", ACCENT_BAR[accent])} />
                  <p className={cn("mt-4 font-mono text-[11px]", ACCENT_TEXT[accent])}>
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 font-heading text-2xl font-bold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="agron-sites-heading" data-testid="agron-container-sites">
          <div className="flex items-center gap-3">
            <span className="h-8 w-1 bg-attn" aria-hidden />
            <div>
              <SectionTitle id="agron-sites-heading">{show.sitesTitle}</SectionTitle>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-[1.02rem] leading-[1.7] text-muted">
            {show.sitesLead}
          </p>
          <div className="mt-8 space-y-6">
            <ContainerFigure
              image={CONTAINER_SITES_THREE}
              accent="teal"
              sizes="(min-width: 1024px) 72rem, 100vw"
              caption={show.sitesThreeCaption}
            />
            <ContainerFigure
              image={CONTAINER_SITES_FOUR}
              accent="sky"
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
