"use client";

import { useRouter } from "next/navigation";
import { TaskList } from "@/components/auth/task-list";
import { LiveModeBanner } from "@/components/live-mode-banner";
import { PageBody, PageHero, PageShell, WatchButton } from "@/components/page-chrome";
import { useAuthSession } from "@/lib/auth-session";
import { usePreferences } from "@/lib/i18n/context";
import { useAppMode } from "@/lib/mode";

export function TasksView() {
  const router = useRouter();
  const { live } = useAppMode();
  const { t } = usePreferences();
  const { session, signOut } = useAuthSession();
  const copy = t.auth;

  return (
    <PageShell>
      {live ? <LiveModeBanner /> : null}
      <PageHero
        kicker={copy.tasksKicker}
        title={copy.tasksTitle}
        lead={live ? copy.tasksLeadLive : copy.tasksLead}
      >
        {session ? (
          <p className="font-mono text-[11px] text-bridge-dim">
            {copy.signedInAs} {session.name} · {session.role}
          </p>
        ) : null}
        <div>
          <WatchButton
            tone="ghost"
            testId="tasks-sign-out"
            onClick={() => {
              signOut();
              router.push("/login");
            }}
          >
            {copy.signOut}
          </WatchButton>
        </div>
      </PageHero>
      <PageBody>
        <TaskList signedIn onLocked={() => router.push("/login")} />
      </PageBody>
    </PageShell>
  );
}
