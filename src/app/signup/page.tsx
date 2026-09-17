import type { Metadata } from "next";
import { SignupView } from "@/components/auth/signup-view";
import { googleAuthConfigured } from "@/lib/auth-env";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.signup.title,
  description: pageMeta.signup.description,
};

export default function SignupPage() {
  return <SignupView google={googleAuthConfigured()} />;
}
