import { describe, expect, it } from "vitest";
import { parseContactBody } from "@/lib/contact-request";

describe("parseContactBody", () => {
  it("requires name, email, and message", () => {
    expect(parseContactBody({ name: "Ada", email: "ada@example.com" }).ok).toBe(
      false,
    );
    expect(parseContactBody({ email: "ada@example.com", message: "Hi" }).ok).toBe(
      false,
    );
  });

  it("rejects an invalid email", () => {
    const parsed = parseContactBody({
      name: "Ada",
      email: "not-an-email",
      message: "Briefing",
    });
    expect(parsed.ok).toBe(false);
  });

  it("accepts organization, assetType, phone, source, and extra", () => {
    const parsed = parseContactBody({
      name: " Ada Lovelace ",
      email: "Ada@Example.COM",
      organization: "AGRON Inc.",
      phone: "+1 202 555 0100",
      assetType: "yacht",
      source: "plans",
      message: "Need a configuration for a 52 m yacht.",
      extra: { plan: "ADVANCED", systems: ["radar", "cameras"] },
    });
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.value.name).toBe("Ada Lovelace");
    expect(parsed.value.email).toBe("ada@example.com");
    expect(parsed.value.organization).toBe("AGRON Inc.");
    expect(parsed.value.assetType).toBe("yacht");
    expect(parsed.value.source).toBe("plans");
    expect(parsed.value.phone).toContain("202");
    expect(parsed.value.extra).toContain("ADVANCED");
  });

  it("defaults source to contact", () => {
    const parsed = parseContactBody({
      name: "Ada",
      email: "ada@example.com",
      message: "Hello",
    });
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.value.source).toBe("contact");
  });
});
