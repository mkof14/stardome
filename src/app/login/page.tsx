import type { Metadata } from "next";
import { LoginView } from "@/components/auth/login-view";
import { pageMeta } from "@/lib/seo";
import { googleAuthConfigured } from "@/lib/auth-env";

export const metadata: Metadata = {
  title: pageMeta.login.title,
  description: pageMeta.login.description,
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string; callbackUrl?: string; error?: string };
}) {
  return (
    <LoginView
      next={searchParams.next ?? searchParams.callbackUrl ?? null}
      google={googleAuthConfigured()}
      error={searchParams.error ?? null}
    />
  );
}
