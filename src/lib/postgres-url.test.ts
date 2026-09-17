import { describe, expect, it } from "vitest";
import {
  directPostgresUrl,
  hostedPostgres,
  normalizePostgresUrl,
} from "@/lib/postgres-url";

describe("postgres urls", () => {
  it("marks Neon hosts as hosted", () => {
    expect(
      hostedPostgres("postgresql://user:pass@ep-x.aws.neon.tech/neondb"),
    ).toBe(true);
    expect(hostedPostgres("postgresql://starwall:starwall@127.0.0.1:5432/starwall")).toBe(
      false,
    );
  });

  it("adds pgbouncer and sslmode on a pooled Neon URL", () => {
    const next = normalizePostgresUrl(
      "postgresql://user:pass@ep-x-pooler.aws.neon.tech/neondb?sslmode=require",
    );
    expect(next).toContain("pgbouncer=true");
    expect(next).toContain("sslmode=require");
  });

  it("strips the pooler host for prisma migrate", () => {
    const next = directPostgresUrl(
      "postgresql://user:pass@ep-x-pooler.aws.neon.tech:6543/neondb?pgbouncer=true",
    );
    expect(next).not.toContain("-pooler");
    expect(next).not.toContain("6543");
    expect(next).not.toContain("pgbouncer");
    expect(next).toContain("sslmode=require");
  });
});
