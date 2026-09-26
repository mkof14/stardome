"use client";

import {
  OrangeRail,
  PageBody,
  PageHero,
  PageShell,
  RuleList,
  RuleRow,
  SectionLead,
  SectionTitle,
  WatchButton,
} from "@/components/page-chrome";
import { usePreferences } from "@/lib/i18n/context";

export function AboutView() {
  const { t } = usePreferences();
  const copy = t.about;

  return (
    <PageShell>
      <PageHero kicker={copy.kicker} title={copy.title} lead={copy.lead} />
      <PageBody>
        <section aria-labelledby="beliefs-heading">
          <SectionTitle id="beliefs-heading">{copy.beliefsTitle}</SectionTitle>
          <RuleList>
            {copy.beliefs.map((item) => (
              <RuleRow key={item.title} title={item.title} body={item.body} />
            ))}
          </RuleList>
        </section>

        <section aria-labelledby="team-heading">
          <SectionTitle id="team-heading">{copy.teamTitle}</SectionTitle>
          <SectionLead>{copy.teamBody}</SectionLead>
          <SectionLead className="text-bridge-text">{copy.teamField}</SectionLead>
          <OrangeRail className="mt-6 space-y-4">
            {copy.teamPoints.map((item) => (
              <div key={item.title}>
                <p className="font-ui text-lg font-bold text-bridge-text">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-bridge-dim">{item.body}</p>
              </div>
            ))}
          </OrangeRail>
        </section>

        <section aria-labelledby="agron-heading">
          <SectionTitle id="agron-heading">{copy.agronTitle}</SectionTitle>
          <p className="mt-4 max-w-2xl font-body text-[1.02rem] leading-relaxed text-bridge-dim">
            {copy.agronBefore}
            <a
              href="https://star-wall.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-orange underline-offset-2 hover:underline"
            >
              {copy.agronLink}
            </a>
            {copy.agronAfter}
          </p>
          <p className="mt-4 max-w-2xl font-body text-[1.02rem] leading-relaxed text-bridge-text">
            {copy.agronTeam}
          </p>
        </section>

        <section aria-label={copy.contactCta} className="space-y-5">
          <OrangeRail>
            <p>{copy.todayCta}</p>
          </OrangeRail>
          <WatchButton href="/contact">{copy.contactCta}</WatchButton>
        </section>
      </PageBody>
    </PageShell>
  );
}
