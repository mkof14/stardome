export function hostedPostgres(url: string) {
  if (!/^postgres(ql)?:\/\//i.test(url)) return false;
  try {
    const host = new URL(url).hostname;
    return host !== "127.0.0.1" && host !== "localhost" && host !== "::1";
  } catch {
    return false;
  }
}

function withSsl(parsed: URL, original: string) {
  if (hostedPostgres(original) && !parsed.searchParams.has("sslmode")) {
    parsed.searchParams.set("sslmode", "require");
  }
  return parsed.toString();
}

export function normalizePostgresUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return "";
  try {
    const parsed = new URL(trimmed);
    const pooled =
      parsed.hostname.includes("-pooler") || parsed.port === "6543";
    if (pooled && !parsed.searchParams.has("pgbouncer")) {
      parsed.searchParams.set("pgbouncer", "true");
    }
    return withSsl(parsed, trimmed);
  } catch {
    return trimmed;
  }
}

export function directPostgresUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return "";
  try {
    const parsed = new URL(trimmed);
    parsed.hostname = parsed.hostname.replace("-pooler.", ".");
    if (parsed.port === "6543") parsed.port = "5432";
    parsed.searchParams.delete("pgbouncer");
    return withSsl(parsed, trimmed);
  } catch {
    return trimmed;
  }
}
