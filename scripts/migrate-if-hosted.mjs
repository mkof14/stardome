import { spawnSync } from "node:child_process";

function hostedPostgres(url) {
  if (!/^postgres(ql)?:\/\//i.test(url)) return false;
  try {
    const host = new URL(url).hostname;
    return host !== "127.0.0.1" && host !== "localhost" && host !== "::1";
  } catch {
    return false;
  }
}

function directUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.hostname = parsed.hostname.replace("-pooler.", ".");
    if (parsed.port === "6543") parsed.port = "5432";
    parsed.searchParams.delete("pgbouncer");
    if (!parsed.searchParams.has("sslmode")) {
      parsed.searchParams.set("sslmode", "require");
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

const url = process.env.DATABASE_URL?.trim() ?? "";
if (!hostedPostgres(url)) {
  console.log(
    "Skipping prisma migrate deploy — DATABASE_URL is not a hosted Postgres URL.",
  );
  process.exit(0);
}

const result = spawnSync("npx", ["prisma", "migrate", "deploy"], {
  stdio: "inherit",
  env: {
    ...process.env,
    DATABASE_URL: directUrl(url),
  },
});

process.exit(result.status ?? 1);
