export async function register() {
  if (process.env.NEXT_RUNTIME === "edge") return;
  const { ensureAuthEnv } = await import("@/lib/auth-env");
  ensureAuthEnv();
}
