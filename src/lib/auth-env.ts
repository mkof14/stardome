/** Shared NextAuth env for Node routes. Keep this file runtime-safe (no Node-only APIs). */

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

function vercelOrigin() {
  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";
  if (site) return site;
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(/\/$/, "") ?? "";
  if (production) {
    return production.startsWith("http") ? production : `https://${production}`;
  }
  const vercel = process.env.VERCEL_URL?.replace(/\/$/, "") ?? "";
  return vercel ? `https://${vercel}` : "";
}

export function applyAuthUrl(origin: string | undefined | null) {
  const next = origin?.trim() ?? "";
  if (!next) return;
  if (isLoopbackOrigin(next) && process.env.VERCEL) return;
  process.env.NEXTAUTH_URL = next.replace(/\/$/, "");
}

export function applyAuthUrlFromRequest(req: { headers: Headers; url?: string }) {
  const forwarded = req.headers.get("x-forwarded-host");
  const host = (forwarded || req.headers.get("host") || "").split(",")[0].trim();
  const proto =
    req.headers.get("x-forwarded-proto")?.split(",")[0].trim() ||
    (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
  if (host) applyAuthUrl(`${proto}://${host}`);
  ensureAuthEnv();
}

/**
 * NextAuth reads NEXTAUTH_URL / NEXTAUTH_SECRET from process.env.
 * On Vercel, a leftover localhost URL or a missing secret used to make
 * /interface render the "Server error" configuration page.
 */
export function ensureAuthEnv() {
  const current = process.env.NEXTAUTH_URL?.trim() ?? "";
  if (!current || isLoopbackOrigin(current)) {
    const next = vercelOrigin();
    if (next && !isLoopbackOrigin(next)) process.env.NEXTAUTH_URL = next;
  }
  if (!process.env.NEXTAUTH_SECRET?.trim()) {
    process.env.NEXTAUTH_SECRET = authSecret();
  }
}
