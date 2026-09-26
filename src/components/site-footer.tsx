"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { FooterContainersBand } from "@/components/footer-containers-band";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname } from "next/navigation";
import { isAuthRoute, isInternalDesk, useAuthSession } from "@/lib/auth-session";
import { sessionHasDeskAccess } from "@/lib/commercial-rbac";
import { usePreferences } from "@/lib/i18n/context";
import { footerWorkItems, navItems } from "@/lib/nav";
import { deskPaths } from "@/lib/price-book/paths";

const productHrefs = [
  "/",
  "/how-it-works",
  "/interface",
  "/pricing",
  "/technology",
  "/levels",
  "/containers",
] as const;

const companyHrefs = ["/about", "/contact", "/faq"] as const;

export function SiteFooter() {
  const { t } = usePreferences();
  const pathname = usePathname();
  const { session } = useAuthSession();
  const hasDesk = sessionHasDeskAccess(session);
  if (isAuthRoute(pathname) || isInternalDesk(pathname)) return null;

  const product = productHrefs
    .map((href) => navItems.find((item) => item.href === href))
    .filter((item): item is (typeof navItems)[number] => Boolean(item));
  const company = companyHrefs
    .map((href) => navItems.find((item) => item.href === href))
    .filter((item): item is (typeof navItems)[number] => Boolean(item));

  return (
    <footer className="w-full border-t border-bridge-line bg-bridge-bg text-bridge-text print:hidden">
      <FooterContainersBand />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2 md:px-6 lg:grid-cols-4">
        <div className="space-y-4">
          <Link href="/" className="inline-flex shrink-0 items-center">
            <BrandLogo />
          </Link>
          <p className="max-w-xs font-body text-[13px] leading-relaxed text-bridge-dim">
            {t.chrome.footerBlurb}
          </p>
        </div>
        <nav aria-label={t.chrome.footerProduct} className="space-y-3">
          <p className="font-ui text-lg font-bold text-bridge-text">{t.chrome.footerProduct}</p>
          <ul className="space-y-2 font-body text-[13px] text-bridge-dim">
            {product.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href === "/pricing" && hasDesk ? deskPaths.root : item.href}
                  className={
                    item.href === "/containers"
                      ? "text-orange hover:text-bridge-text"
                      : "hover:text-bridge-text"
                  }
                >
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={t.chrome.footerCompany} className="space-y-3">
          <p className="font-ui text-lg font-bold text-bridge-text">{t.chrome.footerCompany}</p>
          <ul className="space-y-2 font-body text-[13px] text-bridge-dim">
            {company.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-bridge-text">
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
            {footerWorkItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-bridge-text">
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
            {hasDesk ? (
              <li>
                <Link href={deskPaths.root} className="hover:text-bridge-text">
                  {t.nav.desk}
                </Link>
              </li>
            ) : null}
          </ul>
        </nav>
        <nav aria-label={t.chrome.footerLegal} className="space-y-3">
          <p className="font-ui text-lg font-bold text-bridge-text">{t.chrome.footerLegal}</p>
          <ul className="space-y-2 font-body text-[13px] text-bridge-dim">
            <li>
              <Link href="/privacy" className="hover:text-bridge-text">
                {t.chrome.privacy}
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-bridge-text">
                {t.chrome.terms}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-bridge-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 font-body text-[12px] text-bridge-dim sm:flex-row sm:items-center sm:justify-between md:px-6">
          <p>{t.chrome.rights}</p>
          <div className="flex items-center gap-1">
            <ThemeToggle className="text-bridge-dim hover:text-orange" />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
