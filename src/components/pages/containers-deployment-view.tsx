"use client";

import { ContainerFigure } from "@/components/container-figure";
import { ContainersBackLink } from "@/components/containers-back-link";
import {
  NumberedGrid,
  NumberedItem,
  PageBody,
  PageHero,
  PageShell,
} from "@/components/page-chrome";
import { CONTAINER_SITES_FOUR, CONTAINER_SITES_THREE } from "@/lib/container-gallery";
import { containerShowCopy } from "@/lib/i18n/container-show-copy";
import { usePreferences } from "@/lib/i18n/context";

export function ContainersDeploymentView() {
  const { t, locale } = usePreferences();
  const show = containerShowCopy(locale);

  return (
    <PageShell>
      <PageHero
        kicker={t.containers.eyebrow}
        title={t.containers.deployTitle}
        preface={<ContainersBackLink />}
      />
      <PageBody>
        <div className="space-y-6">
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
        <NumberedGrid className="xl:grid-cols-3">
          {t.containers.cases.map((item, index) => (
            <NumberedItem
              key={item.name}
              index={index + 1}
              title={item.name}
              body={item.body}
            />
          ))}
        </NumberedGrid>
      </PageBody>
    </PageShell>
  );
}
