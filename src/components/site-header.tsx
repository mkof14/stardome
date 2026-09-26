"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ModeToggle } from "@/components/mode-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { AccountMenu } from "@/components/auth/account-menu";
import { FullscreenButton } from "@/components/bridge/fullscreen-button";
import { CompressScreenButton } from "@/components/bridge/compress-screen-button";
import { ClearScreensButton } from "@/components/bridge/clear-screens-button";
import { isAuthRoute, isInternalDesk, useAuthSession } from "@/lib/auth-session";
import { sessionHasDeskAccess } from "@/lib/commercial-rbac";
import { usePreferences } from "@/lib/i18n/context";
import { headerNavItems, headerWorkItems } from "@/lib/nav";
import { deskPaths } from "@/lib/price-book/paths";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t } = usePreferences();
  const { session } = useAuthSession();
  const showMode =
    pathname.startsWith("/interface") ||
    pathname.startsWith("/backend") ||
    pathname.startsWith("/tasks");
  const workItems = session ? [] : [...headerWorkItems];
  const hasDesk = sessionHasDeskAccess(session);

  if (isAuthRoute(pathname) || isInternalDesk(pathname)) return null;

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-bridge-line bg-bridge-bg/92 shadow-[inset_0_2px_0_0_#F15A00] backdrop-blur-md print:hidden">
      <div className="flex h-full items-center justify-between gap-2 px-4 md:gap-3 md:px-6">
        <Link
          href="/"
          className="flex h-full shrink-0 items-center"
          onClick={() => setOpen(false)}
        >
          <BrandLogo priority className="h-[2.6rem] sm:h-12" />
        </Link>

        <nav
          className="hidden min-w-0 items-center gap-3 overflow-hidden lg:flex xl:gap-5"
          aria-label={t.nav.primary}
        >
          {headerNavItems.map((item) => {
            const href = navHref(item, hasDesk);
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={href}
                className={`relative font-ui text-[13px] ${
                  active
                    ? "text-bridge-text after:absolute after:-bottom-1 after:start-0 after:h-px after:w-full after:bg-orange"
                    : "text-bridge-dim hover:text-bridge-text"
                }`}
              >
                {t.nav[item.key]}
              </Link>
            );
          })}
          {workItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center rounded-2xl border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                  active
                    ? "border-orange text-orange"
                    : "border-bridge-line text-bridge-dim hover:text-bridge-text"
                }`}
              >
                {t.nav[item.key]}
              </Link>
            );
          })}
        </nav>

        <div className="flex min-w-0 shrink-0 items-center gap-1">
          <AccountMenu />
          {showMode ? <ModeToggle /> : null}
          {pathname.startsWith("/interface") ? (
            <div
              data-testid="bridge-header-chrome"
              className="relative flex shrink-0 items-center gap-0.5 rounded-xl px-0.5 py-0.5"
            >
              <FullscreenButton />
              <CompressScreenButton />
              <ClearScreensButton />
            </div>
          ) : null}
          <div className="hidden lg:flex lg:items-center">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
          <button
            type="button"
            data-testid="mobile-nav-toggle"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-bridge-line text-bridge-text transition duration-150 hover:-translate-y-0.5 hover:border-orange hover:text-orange hover:shadow-[0_6px_14px_rgb(241_90_0/0.28)] lg:hidden"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
                <path
                  fill="currentColor"
                  d="M3.2 2.3 8 7.1l4.8-4.8 1.1 1.1L9.1 8.2l4.8 4.8-1.1 1.1L8 9.3l-4.8 4.8-1.1-1.1 4.8-4.8-4.8-4.8 1.1-1.1Z"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
                <path
                  fill="currentColor"
                  d="M2 3.2h12v1.5H2V3.2Zm0 4.05h12v1.5H2V7.25Zm0 4.05h12V12.8H2v-1.5Z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="w-full border-t border-bridge-line bg-bridge-bg lg:hidden"
          aria-label={t.nav.mobile}
        >
          <ul>
            {headerNavItems.map((item) => (
              <li key={item.href} className="border-b border-bridge-line last:border-b-0">
                <Link
                  href={navHref(item, hasDesk)}
                  className="block px-4 py-3 text-sm text-bridge-text"
                  onClick={() => setOpen(false)}
                >
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
            {workItems.map((item) => (
              <li key={item.href} className="border-b border-bridge-line last:border-b-0">
                <Link
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-3 font-mono text-xs uppercase tracking-wider text-bridge-text"
                  onClick={() => setOpen(false)}
                >
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
            <AccountMenu />
            {showMode ? <ModeToggle /> : null}
            {pathname.startsWith("/interface") ? (
              <div data-testid="bridge-header-chrome-mobile" className="flex items-center gap-1">
                <FullscreenButton compact />
                <CompressScreenButton compact />
                <ClearScreensButton compact />
              </div>
            ) : null}
            <ThemeToggle />
            <LanguageSwitcher align="end" />
          </div>
        </nav>
      ) : null}
    </header>
  );
}

function navHref(
  item: (typeof headerNavItems)[number],
  hasDesk: boolean,
) {
  if (item.key === "pricing" && hasDesk) return deskPaths.root;
  return item.href;
}
