"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthShell } from "@/components/auth/auth-shell";

export function ForgotPasswordView() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function submit() {
    setSent(true);
  }

  return (
    <AuthShell title="Reset your password">
      <p className="mt-4 text-sm leading-relaxed text-[#55687A]">
        This idea demonstration does not send reset mail. Sign in with demo /
        demo.
      </p>
      {sent ? (
        <p data-testid="reset-sent" className="mt-6 text-center text-sm text-[#55687A]">
          No email was sent. Use demo / demo to open the walkthrough.
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
            <span className="text-[#55687A]">Email</span>
            <input
              id="forgot-email"
              data-testid="forgot-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full border-b border-stroke bg-transparent px-0 py-2 text-ink outline-none focus:border-orange"
            />
          </label>
          <button
            type="submit"
            data-testid="forgot-submit"
            className="mt-5 w-full bg-orange px-3 py-2.5 font-ui text-sm font-medium text-white hover:bg-orange/90"
          >
            Continue
          </button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-[#55687A]">
        <Link href="/login" className="text-orange hover:underline">
          ← Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
