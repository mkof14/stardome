"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { usePreferences } from "@/lib/i18n/context";

export function ForgotPasswordView() {
  const { t } = usePreferences();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function submit() {
    setSent(true);
  }

  return (
    <AuthShell title={t.auth.forgotTitle}>
      <p className="mt-4 text-sm leading-relaxed text-[#55687A]">{t.auth.forgotLead}</p>
      {sent ? (
        <p data-testid="reset-sent" className="mt-6 text-center text-sm text-[#55687A]">
          {t.auth.forgotSent}
        </p>
      ) : (
        <form
          data-testid="forgot-form"
          className="mt-6"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <label className="block text-sm" htmlFor="forgot-email">
            <span className="text-[#55687A]">{t.auth.emailLabel}</span>
            <input
              id="forgot-email"
              data-testid="forgot-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-bridge-line bg-bridge-panel px-4 py-2.5 text-bridge-text outline-none focus:border-orange"
            />
          </label>
          <button
            type="submit"
            data-testid="forgot-submit"
            className="mt-5 w-full rounded-2xl border border-orange/40 bg-orange/10 px-3 py-2.5 font-body text-sm font-semibold text-orange hover:bg-orange/15"
          >
            {t.auth.forgotSubmit}
          </button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-[#55687A]">
        <Link href="/login" className="text-orange hover:underline">
          {t.auth.backToSignIn}
        </Link>
      </p>
    </AuthShell>
  );
}
