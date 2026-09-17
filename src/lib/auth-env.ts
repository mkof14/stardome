/** Shared NextAuth env for Node routes and Edge middleware. Keep this file Edge-safe. */

const LOOPBACK = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/i;

export function isLoopbackOrigin(value: string | undefined | null) {
  return Boolean(value && LOOPBACK.test(value.trim()));
}

export function authSecret() {
  return (
    process.env.NEXTAUTH_SECRET?.trim() ||
    process.env.AUTH_SECRET?.trim() ||
    "starwall-dev-secret-not-for-production"
  );
}

export function googleAuthConfigured() {
  const id = process.env.GOOGLE_CLIENT_ID?.trim() ?? "";
  const secret = process.env.GOOGLE_CLIENT_SECRET?.trim() ?? "";
  return Boolean(id && secret && id !== "missing-google-client-id");
}

/**
 * NextAuth reads NEXTAUTH_URL / NEXTAUTH_SECRET from process.env.
 * On Vercel, a leftover localhost URL or a secret only set in authOptions
 * makes /interface hit the NextAuth "Server error" page.
 */
export function ensureAuthEnv() {
  const current = process.env.NEXTAUTH_URL?.trim() ?? "";
  if (!current || isLoopbackOrigin(current)) {
    const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";
    const vercel = process.env.VERCEL_URL?.replace(/\/$/, "") ?? "";
    const next = site || (vercel ? `https://${vercel}` : "");
    if (next && !isLoopbackOrigin(next)) {
      process.env.NEXTAUTH_URL = next;
    }
  }
  if (!process.env.NEXTAUTH_SECRET?.trim()) {
    process.env.NEXTAUTH_SECRET = authSecret();
  }
}
