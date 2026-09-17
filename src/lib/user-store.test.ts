import { afterEach, describe, expect, it } from "vitest";
import { authenticateUser, findUserByEmail } from "@/lib/user-store";

const original = process.env.DATABASE_URL;

afterEach(() => {
  if (original === undefined) delete process.env.DATABASE_URL;
  else process.env.DATABASE_URL = original;
});

describe("demo accounts without Postgres", () => {
  it("signs in the Super Admin demo user", async () => {
    delete process.env.DATABASE_URL;
    const user = await authenticateUser("super@starwall.demo", "SuperAdmin!23");
    expect(user?.email).toBe("super@starwall.demo");
    expect(user?.role).toBe("Super Admin");
  });

  it("rejects a wrong password", async () => {
    delete process.env.DATABASE_URL;
    const user = await authenticateUser("super@starwall.demo", "nope");
    expect(user).toBeNull();
  });

  it("still resolves the demo user for JWT refresh", async () => {
    delete process.env.DATABASE_URL;
    const user = await findUserByEmail("operator@starwall.demo");
    expect(user?.role).toBe("Operator");
  });
});
