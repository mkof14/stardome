"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { AuthShell } from "@/components/auth/auth-shell";
import { GoogleButton } from "@/components/auth/google-button";
import { PasswordField } from "@/components/auth/password-field";
import { safeNextPath } from "@/lib/auth-session";
import { usePreferences } from "@/lib/i18n/context";

export function LoginView({
  next,
  google = false,
  error: initialError = null,
}: {
  next?: string | null;
  google?: boolean;
  error?: string | null;
}) {
  const { t } = usePreferences();
  const router = useRouter();
  const nextPath = safeNextPath(next);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(() =>
    initialError ? t.auth.googleHostError : null,
  );
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError(null);
    if (!email.trim() || !password) {
      setError(t.auth.enterCredentials);
      return;
    }
    setBusy(true);
    const result = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });
    setBusy(false);
    if (!result || result.error) {
      setError(t.auth.credentialsError);
      return;
    }
    router.push(nextPath);
    router.refresh();
  }

  function googleSignIn() {
    setBusy(true);
    void signIn("google", { callbackUrl: nextPath });
  }

  return (
    <AuthShell title={t.auth.title}>
      <form
        data-testid="auth-form"
        className="mt-6"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <label className="block text-sm" htmlFor="login-email">
          <span className="text-[#55687A]">{t.auth.emailLabel}</span>
          <input
            id="login-email"
            data-testid="auth-email"
            type="text"
            autoComplete="username"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError(null);
            }}
            className="mt-1 w-full rounded-2xl border border-bridge-line bg-bridge-panel px-4 py-2.5 text-bridge-text outline-none focus:border-orange"
          />
        </label>
        <PasswordField
          id="login-password"
          label={t.auth.passwordLabel}
          value={password}
          onChange={(value) => {
            setPassword(value);
            setError(null);
          }}
        />
        <p className="mt-2 text-end">
          <Link
            href="/forgot-password"
            data-testid="auth-forgot"
            className="text-sm text-orange hover:underline"
          >
            {t.auth.forgotLink}
          </Link>
        </p>
        {error ? (
          <p data-testid="auth-form-error" className="mt-3 text-sm text-crit">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          data-testid="auth-submit"
          disabled={busy}
          className="mt-5 w-full rounded-2xl border border-orange/40 bg-orange/10 px-3 py-2.5 font-body text-sm font-semibold text-orange hover:bg-orange/15 disabled:opacity-60"
        >
          {busy ? t.auth.signingIn : t.auth.signIn}
        </button>
      </form>

      {google ? (
        <>
          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-[#B7C9D8]" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#55687A]">
              {t.auth.orDivider}
            </span>
            <span className="h-px flex-1 bg-[#B7C9D8]" />
          </div>

          <GoogleButton onClick={googleSignIn} disabled={busy} />
        </>
      ) : null}

      <p className="mt-6 text-center text-sm text-[#55687A]">
        {t.auth.noAccount}{" "}
        <Link href="/signup" className="text-orange hover:underline">
          {t.auth.signUpLink}
        </Link>
      </p>

      <div
        data-testid="demo-role-accounts"
        className="mt-6 rounded-2xl border border-bridge-line bg-bridge-panel px-4 py-4 text-start"
      >
        <p className="font-mono text-[10px] tracking-wider text-[#55687A]">
          {t.auth.demoAccounts}
        </p>
        <p className="mt-2 font-mono text-[11px] text-navyText">demo · demo</p>
        <p className="mt-2 text-xs leading-relaxed text-[#55687A]">{t.auth.demoHint}</p>
      </div>
    </AuthShell>
  );
}
