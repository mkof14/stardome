"use client";

import { PageBody, PageHero, PageShell, RuleList, RuleRow } from "@/components/page-chrome";
import { usePreferences } from "@/lib/i18n/context";

export function PrivacyView({
  framed = false,
  focus = "privacy",
}: {
  framed?: boolean;
  focus?: "privacy" | "terms";
}) {
  const { t } = usePreferences();
  const legal = t.legal;
  const termsFirst = focus === "terms";

  const privacyBlock = (
    <>
      <p className="font-body text-sm italic text-bridge-dim">{legal.privacyUpdated}</p>
      <p className="mt-4 max-w-3xl font-body text-[1.02rem] leading-relaxed text-bridge-dim">
        {legal.privacyIntro}
      </p>
      <RuleList>
        {legal.privacySections.map((section) => (
          <RuleRow key={section.title} title={section.title} body={section.body} />
        ))}
      </RuleList>
    </>
  );

  const termsBlock = (
    <>
      <p className="font-body text-sm italic text-bridge-dim">{legal.termsUpdated}</p>
      <p className="mt-4 max-w-3xl font-body text-[1.02rem] leading-relaxed text-bridge-dim">
        {legal.termsIntro}
      </p>
      <RuleList>
        {legal.termsSections.map((section) => (
          <RuleRow key={section.title} title={section.title} body={section.body} />
        ))}
      </RuleList>
    </>
  );

  if (framed) {
    return (
      <div className="space-y-10 text-bridge-text">
        <h1 className="font-ui text-3xl font-bold tracking-tight">
          {termsFirst ? legal.termsTitle : legal.privacyTitle}
        </h1>
        {termsFirst ? (
          <>
            <div id="terms">{termsBlock}</div>
            <h2 className="font-ui text-3xl font-bold tracking-tight">{legal.privacyTitle}</h2>
            {privacyBlock}
          </>
        ) : (
          <>
            {privacyBlock}
            <section id="terms" className="space-y-6">
              <h2 className="font-ui text-3xl font-bold tracking-tight">{legal.termsTitle}</h2>
              {termsBlock}
            </section>
          </>
        )}
      </div>
    );
  }

  return (
    <PageShell>
      <PageHero
        kicker={termsFirst ? t.chrome.terms : t.chrome.privacy}
        title={termsFirst ? legal.termsTitle : legal.privacyTitle}
      />
      <PageBody>
        {termsFirst ? (
          <>
            <div id="terms" className="space-y-6">
              {termsBlock}
            </div>
            <section className="space-y-6">
              <h2 className="font-ui text-3xl font-bold tracking-tight text-bridge-text">{legal.privacyTitle}</h2>
              {privacyBlock}
            </section>
          </>
        ) : (
          <>
            <div className="space-y-6">{privacyBlock}</div>
            <section id="terms" className="space-y-6">
              <h2 className="font-ui text-3xl font-bold tracking-tight text-bridge-text">{legal.termsTitle}</h2>
              {termsBlock}
            </section>
          </>
        )}
      </PageBody>
    </PageShell>
  );
}
