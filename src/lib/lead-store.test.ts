import { mkdtempSync, readFileSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { afterEach, describe, expect, it } from "vitest";
import { createLead, listLeads, markLeadDelivered } from "@/lib/lead-store";

const originalUrl = process.env.DATABASE_URL;
const originalDir = process.env.STARWALL_DATA_DIR;
const dirs: string[] = [];

function isolateStore() {
  delete process.env.DATABASE_URL;
  const dir = mkdtempSync(join(tmpdir(), "starwall-leads-"));
  dirs.push(dir);
  process.env.STARWALL_DATA_DIR = dir;
  return dir;
}

afterEach(() => {
  if (originalUrl === undefined) delete process.env.DATABASE_URL;
  else process.env.DATABASE_URL = originalUrl;
  if (originalDir === undefined) delete process.env.STARWALL_DATA_DIR;
  else process.env.STARWALL_DATA_DIR = originalDir;
  for (const dir of dirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

describe("lead file fallback without Postgres", () => {
  it("records a lead and lists it back", async () => {
    const dir = isolateStore();
    const lead = await createLead({
      name: "Ada Lovelace",
      email: "ada@example.com",
      organization: "AGRON Inc.",
      phone: "",
      assetType: "marina",
      source: "contact",
      message: "Need a briefing for the south basin.",
      extra: "",
    });
    expect(lead.id).toMatch(/^lead-/);
    expect(lead.delivered).toBe(false);

    const listed = await listLeads();
    expect(listed).toHaveLength(1);
    expect(listed[0]?.email).toBe("ada@example.com");
    expect(listed[0]?.assetType).toBe("marina");

    const raw = JSON.parse(readFileSync(join(dir, "leads.json"), "utf8")) as {
      email: string;
    }[];
    expect(raw[0]?.email).toBe("ada@example.com");
  });

  it("marks a stored lead as delivered", async () => {
    isolateStore();
    const lead = await createLead({
      name: "Ada",
      email: "ada@example.com",
      organization: "",
      phone: "",
      assetType: "",
      source: "plans",
      message: "Configuration request",
      extra: '{"plan":"LIGHT"}',
    });
    await markLeadDelivered(lead.id);
    const listed = await listLeads();
    expect(listed[0]?.delivered).toBe(true);
  });
});
