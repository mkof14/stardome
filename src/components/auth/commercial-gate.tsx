"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { AuthGate } from "@/components/auth/auth-gate";
import { useAuthSession } from "@/lib/auth-session";
import { sessionHasDeskAccess } from "@/lib/commercial-rbac";
import { deskPaths } from "@/lib/price-book/paths";
import { usePreferences } from "@/lib/i18n/context";

export function CommercialGate({
  children,
  next,
}: {
  children: ReactNode;
  next: string;
}) {
  return (
    <AuthGate next={next}>
      <CommercialInner>{children}</CommercialInner>
    </AuthGate>
  );
}

function CommercialInner({ children }: { children: ReactNode }) {
  const { session } = useAuthSession();
  const { t } = usePreferences();

  if (!sessionHasDeskAccess(session)) {
    return (
      <div className="bg-bridge-bg font-ui text-bridge-text" data-testid="desk-forbidden">
        <div className="mx-auto max-w-xl px-4 py-16 md:px-6">
          <p className="font-body text-sm font-semibold uppercase tracking-[0.28em] text-orange">
            {t.nav.pricing}
          </p>
          <h1 className="mt-2 font-ui text-3xl font-bold tracking-tight">
            This Plans desk is closed for your account.
          </h1>
          <p className="mt-3 font-body text-sm text-bridge-dim">
            Super Admin, Admin, or an assigned commercial role is required. The
            public Plans page stays available without list prices.
          </p>
          <Link
            href={deskPaths.catalog}
            className="mt-6 inline-flex rounded-2xl border border-bridge-line bg-bridge-panel px-3 py-2 text-sm text-bridge-text hover:border-orange hover:text-orange"
          >
            {t.nav.pricing}
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
