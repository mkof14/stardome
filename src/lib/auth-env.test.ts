import { afterEach, describe, expect, it } from "vitest";
import {
  authSecret,
  ensureAuthEnv,
  googleAuthConfigured,
  isLoopbackOrigin,
} from "@/lib/auth-env";

const KEYS = [
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "AUTH_SECRET",
  "NEXT_PUBLIC_SITE_URL",
  "VERCEL_URL",
  "VERCEL_PROJECT_PRODUCTION_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
] as const;

const snapshot = Object.fromEntries(
  KEYS.map((key) => [key, process.env[key]]),
);

afterEach(() => {
  for (const key of KEYS) {
    const value = snapshot[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

describe("auth env", () => {
  it("treats localhost NEXTAUTH_URL as loopback", () => {
    expect(isLoopbackOrigin("http://127.0.0.1:3000")).toBe(true);
    expect(isLoopbackOrigin("http://localhost:3000")).toBe(true);
    expect(isLoopbackOrigin("https://starwall.vercel.app")).toBe(false);
  });

  it("prefers the Vercel production host over a leftover localhost URL", () => {
    process.env.NEXTAUTH_URL = "http://127.0.0.1:3000";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "starwall.vercel.app";
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.VERCEL_URL;
    ensureAuthEnv();
    expect(process.env.NEXTAUTH_URL).toBe("https://starwall.vercel.app");
  });

  it("fills NEXTAUTH_SECRET so sessions can be decoded without a dashboard secret", () => {
    delete process.env.NEXTAUTH_SECRET;
    delete process.env.AUTH_SECRET;
    ensureAuthEnv();
    expect(process.env.NEXTAUTH_SECRET).toBe(authSecret());
  });

  it("does not register Google with placeholder credentials", () => {
    process.env.GOOGLE_CLIENT_ID = "missing-google-client-id";
    process.env.GOOGLE_CLIENT_SECRET = "missing-google-client-secret";
    expect(googleAuthConfigured()).toBe(false);
  });
});
