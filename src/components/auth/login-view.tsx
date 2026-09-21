"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { AuthShell } from "@/components/auth/auth-shell";
import { GoogleButton } from "@/components/auth/google-button";
import { PasswordField } from "@/components/auth/password-field";
import { safeNextPath } from "@/lib/auth-session";

export function LoginView({
  next,
  google = false,
  error: initialError = null,
}: {
  next?: string | null;
  google?: boolean;
  error?: string | null;
}) {
  const router = useRouter();
  const nextPath = safeNextPath(next);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(() =>
    initialError ? "Sign-in could not finish on this host. Try email and password." : null,
  );
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError(null);
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
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
      setError("Those credentials were not recognised.");
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
    <AuthShell title="Sign in to StarWall">
      <form
        data-testid="auth-form"
        className="mt-6"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <label className="block text-sm" htmlFor="login-email">
          <span className="text-[#55687A]">Email or demo</span>
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
            className="mt-1 w-full border-b border-stroke bg-transparent px-0 py-2 text-ink outline-none focus:border-orange"
          />
        </label>
        <PasswordField
          id="login-password"
          label="Password"
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
            Forgot password?
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
          className="mt-5 w-full bg-orange px-3 py-2.5 font-ui text-sm font-medium text-white hover:bg-orange/90 disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>

      {google ? (
        <>
          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-[#B7C9D8]" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#55687A]">
              or
            </span>
            <span className="h-px flex-1 bg-[#B7C9D8]" />
          </div>

          <GoogleButton onClick={googleSignIn} disabled={busy} />
        </>
      ) : null}

      <p className="mt-6 text-center text-sm text-[#55687A]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-orange hover:underline">
          Sign up
        </Link>
      </p>

      <div
        data-testid="demo-role-accounts"
        className="mt-6 border border-[#B7C9D8] bg-[#F7FBFD] px-3 py-3 text-start"
      >
        <p className="font-mono text-[10px] tracking-wider text-[#55687A]">
          IDEA DEMONSTRATION
        </p>
        <p className="mt-2 font-mono text-[11px] text-navyText">
          demo · demo
        </p>
        <p className="mt-2 text-xs leading-relaxed text-[#55687A]">
          This is a product idea demo. One shared sign-in opens the Super Admin
          walkthrough. No unique passwords are published here.
        </p>
      </div>
    </AuthShell>
  );
}
