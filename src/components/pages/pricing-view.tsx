"use client";

import { useState } from "react";
import {
  PageBody,
  PageHero,
  PageShell,
  SectionKicker,
  SectionLead,
  SectionTitle,
  WatchButton,
  WatchLink,
  WatchPanel,
} from "@/components/page-chrome";
import { PlansRequestForm } from "@/components/plans-request-form";
import { cn } from "@/lib/cn";
import { useAuthSession } from "@/lib/auth-session";
import { sessionHasDeskAccess } from "@/lib/commercial-rbac";
import { getPlansDesk } from "@/lib/i18n/plans-desk";
import { getPlansPage } from "@/lib/i18n/plans-page";
import { usePreferences } from "@/lib/i18n/context";
import { deskPaths } from "@/lib/price-book/paths";
import {
  COMPARE_KEYS,
  COMPARE_ROWS,
  ENVIRONMENT_KEYS,
  HARDWARE_KEYS,
  HOW_KEYS,
  PLAN_ORDER,
  POPULAR_PLAN,
  type CompareCell,
  type PlanId,
} from "@/lib/plans";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function PricingView() {
  const { locale } = usePreferences();
  const { session } = useAuthSession();
  const copy = getPlansPage(locale);
  const desk = getPlansDesk(locale);
  const hasDesk = sessionHasDeskAccess(session);
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);

  function goToRequest(plan?: PlanId) {
    if (plan) setSelectedPlan(plan);
    scrollToId("request");
  }

  return (
    <PageShell>
      {hasDesk ? (
        <div
          data-testid="plans-desk-entry"
          className="border-b border-bridge-line bg-bridge-panel px-4 py-4 md:px-6"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-body text-sm font-semibold uppercase tracking-[0.28em] text-orange">
                {desk.kicker}
              </p>
              <p className="mt-1 font-ui text-xl font-bold text-bridge-text">
                {desk.title}
              </p>
              <p className="mt-1 max-w-2xl font-body text-sm text-bridge-dim">{desk.body}</p>
            </div>
            <WatchButton href={deskPaths.root} className="shrink-0">
              {desk.cta}
            </WatchButton>
          </div>
        </div>
      ) : null}
      <PageHero kicker={copy.kicker} title={copy.title}>
        <p className="max-w-2xl font-ui text-2xl font-semibold leading-snug text-bridge-text sm:text-3xl">
          {copy.supporting}
        </p>
        <p className="max-w-2xl font-body text-[1.05rem] leading-relaxed text-bridge-dim">{copy.body}</p>
        <ol className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 font-ui text-xl font-bold text-bridge-text sm:text-2xl">
          {PLAN_ORDER.map((id, index) => (
            <li key={id} className="flex items-center gap-5">
              {index > 0 ? (
                <span className="hidden h-4 w-px bg-bridge-line sm:block" aria-hidden />
              ) : null}
              <a href={`#${id.toLowerCase()}`} className="hover:text-orange">
                {id}
              </a>
            </li>
          ))}
        </ol>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
          <WatchButton href="#compare" testId="compare-plans">
            {copy.compareCta}
          </WatchButton>
          <a
            href="#request"
            data-testid="request-pricing"
            className="inline-flex items-center justify-center px-1 py-2 font-body text-sm text-bridge-text underline decoration-bridge-line underline-offset-4 hover:decoration-orange"
          >
            {copy.requestCta}
          </a>
        </div>
        <p className="max-w-xl font-body text-sm leading-relaxed text-bridge-dim">{copy.heroNote}</p>
      </PageHero>

      <PageBody className="space-y-24">
        <section aria-label={copy.title} className="grid gap-12 md:grid-cols-2 xl:grid-cols-4">
          {PLAN_ORDER.map((id) => {
            const plan = copy.plans[id];
            const popular = id === POPULAR_PLAN;
            return (
              <article
                key={id}
                id={id.toLowerCase()}
                data-testid={`plan-${id}`}
                className="flex scroll-mt-24 flex-col rounded-2xl border border-bridge-line bg-bridge-panel px-5 py-5 shadow-[0_10px_28px_rgb(15_25_34/0.08)]"
              >
                <div className="min-h-[1.15rem]">
                  {popular ? (
                    <p className="font-body text-sm font-semibold uppercase tracking-[0.28em] text-orange">
                      {copy.mostPopular}
                    </p>
                  ) : null}
                </div>
                <h2 className="mt-2 font-ui text-3xl font-bold tracking-tight text-bridge-text">{id}</h2>
                <p className="mt-1 font-body text-sm italic text-bridge-dim">{plan.subtitle}</p>
                <p className="mt-4 font-body text-sm leading-relaxed text-bridge-text">{plan.description}</p>
                <p className="mt-6 font-body text-[11px] uppercase tracking-[0.18em] text-bridge-dim">
                  {copy.includesLabel}
                </p>
                <ul className="mt-2 space-y-2 font-body text-sm leading-relaxed text-bridge-dim">
                  {plan.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="mt-auto pt-8 text-xs leading-relaxed text-bridge-dim">
                  <span className="text-bridge-text">{copy.bestForLabel}</span>
                  <span className="mt-1 block">{plan.bestFor}</span>
                </p>
                <a
                  href="#request"
                  onClick={() => setSelectedPlan(id)}
                  className="mt-5 self-start font-body text-sm font-semibold text-orange underline-offset-4 hover:underline"
                >
                  {plan.cta}
                </a>
              </article>
            );
          })}
        </section>

        <section id="compare" className="scroll-mt-24" aria-labelledby="compare-heading">
          <SectionKicker>{copy.kicker}</SectionKicker>
          <SectionTitle id="compare-heading">{copy.compare.heading}</SectionTitle>
          <SectionLead>{copy.compare.subheading}</SectionLead>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-bridge-line bg-bridge-panel">
            <table className="w-full min-w-[40rem] text-start text-sm">
              <caption className="sr-only">{copy.compare.heading}</caption>
              <thead>
                <tr className="border-b border-bridge-line">
                  <th className="sticky start-0 bg-bridge-panel px-5 py-3 pe-6 text-start font-ui text-base font-bold text-bridge-text">
                    {copy.compare.capability}
                  </th>
                  {PLAN_ORDER.map((id) => (
                    <th
                      key={id}
                      className="px-3 py-3 text-center font-ui text-base font-bold text-bridge-text"
                    >
                      {id}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_KEYS.map((key) => (
                  <tr key={key} className="border-t border-bridge-line">
                    <th className="sticky start-0 bg-bridge-panel px-5 py-3 pe-6 text-start font-medium text-bridge-text">
                      {copy.compare.rows[key]}
                    </th>
                    {COMPARE_ROWS[key].map((cell, index) => (
                      <td key={PLAN_ORDER[index]} className="px-3 py-3 text-center">
                        <CompareMark cell={cell} optionalLabel={copy.optional} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="environments" className="scroll-mt-24" aria-labelledby="environments-heading">
          <SectionKicker>{copy.kicker}</SectionKicker>
          <SectionTitle id="environments-heading">{copy.environments.heading}</SectionTitle>
          <SectionLead>{copy.environments.body}</SectionLead>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ENVIRONMENT_KEYS.map((key) => {
              const item = copy.environments.items[key];
              return (
                <WatchPanel key={key}>
                  <h3 className="font-ui text-2xl font-bold tracking-tight text-bridge-text">{item.title}</h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-bridge-dim">{item.body}</p>
                  <p className="mt-4 font-body text-[11px] uppercase tracking-[0.18em] text-bridge-dim">
                    {copy.recommendedLabel}
                    <span className="ms-2 text-bridge-text">{item.recommended}</span>
                  </p>
                </WatchPanel>
              );
            })}
          </div>
        </section>

        <section id="hardware" className="scroll-mt-24" aria-labelledby="hardware-heading">
          <SectionKicker>{copy.kicker}</SectionKicker>
          <SectionTitle id="hardware-heading">{copy.hardware.heading}</SectionTitle>
          <p className="mt-2 max-w-2xl font-ui text-xl text-bridge-text">{copy.hardware.subheading}</p>
          <SectionLead>{copy.hardware.body}</SectionLead>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {HARDWARE_KEYS.map((key) => {
              const item = copy.hardware.items[key];
              return (
                <WatchPanel key={key}>
                  <h3 className="font-ui text-2xl font-bold tracking-tight text-bridge-text">{item.title}</h3>
                  <p className="mt-2 max-w-md font-body text-sm leading-relaxed text-bridge-dim">{item.body}</p>
                </WatchPanel>
              );
            })}
          </div>
          <WatchLink href="/technology" className="mt-8" testId="explore-hardware">
            {copy.hardware.cta}
          </WatchLink>
        </section>

        <section id="pricing-how" className="scroll-mt-24" aria-labelledby="how-heading">
          <SectionKicker>{copy.kicker}</SectionKicker>
          <SectionTitle id="how-heading">{copy.how.heading}</SectionTitle>
          <WatchPanel className="mt-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              {HOW_KEYS.map((key, index) => {
                const item = copy.how.items[key];
                const last = index === HOW_KEYS.length - 1;
                return (
                  <div key={key} className="flex flex-col gap-6 lg:flex-row lg:items-start">
                    {index > 0 ? (
                      <p
                        className="font-ui text-2xl font-bold text-orange lg:pt-1"
                        aria-hidden
                      >
                        {last ? "=" : "+"}
                      </p>
                    ) : null}
                    <div className={cn("max-w-xs lg:max-w-[10.5rem]", last && "lg:max-w-[12rem]")}>
                      <p className="font-ui text-xl font-bold text-bridge-text">{item.title}</p>
                      <p className="mt-2 font-body text-sm leading-relaxed text-bridge-dim">{item.caption}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </WatchPanel>
          <SectionLead className="mt-6">{copy.how.body}</SectionLead>
          <WatchButton className="mt-8" onClick={() => goToRequest()}>
            {copy.how.cta}
          </WatchButton>
        </section>

        <section id="request" className="scroll-mt-24 pb-8" aria-labelledby="request-heading">
          <SectionKicker>{copy.kicker}</SectionKicker>
          <SectionTitle id="request-heading">{copy.request.heading}</SectionTitle>
          <SectionLead>{copy.request.body}</SectionLead>
          <div className="mt-10">
            <PlansRequestForm copy={copy.request} selectedPlan={selectedPlan} />
          </div>
        </section>
      </PageBody>
    </PageShell>
  );
}

function CompareMark({
  cell,
  optionalLabel,
}: {
  cell: CompareCell;
  optionalLabel: string;
}) {
  if (cell === "yes") {
    return (
      <span className="text-orange" aria-label="yes">
        ✓
      </span>
    );
  }
  if (cell === "optional") {
    return <span className="text-xs text-bridge-dim">{optionalLabel}</span>;
  }
  return (
    <span className="text-bridge-dim" aria-label="not included">
      —
    </span>
  );
}
