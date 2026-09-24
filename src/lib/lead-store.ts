import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { randomBytes } from "crypto";
import type { ContactPayload } from "@/lib/contact-request";
import { prismaReady } from "@/lib/prisma";

export type StoredLead = ContactPayload & {
  id: string;
  delivered: boolean;
  createdAt: string;
};

const FILE_CAP = 500;

function newLeadId() {
  return `lead-${Date.now()}-${randomBytes(3).toString("hex")}`;
}

function filePaths() {
  const override = process.env.STARWALL_DATA_DIR?.trim();
  return [
    override ? join(override, "leads.json") : join(process.cwd(), "data", "leads.json"),
    join("/tmp", "starwall-leads.json"),
  ];
}

function readFileLeads(): StoredLead[] {
  for (const path of filePaths()) {
    try {
      const parsed = JSON.parse(readFileSync(path, "utf8")) as unknown;
      if (Array.isArray(parsed)) return parsed as StoredLead[];
    } catch {
      // try the next path
    }
  }
  return [];
}

function writeFileLeads(leads: StoredLead[]) {
  for (const path of filePaths()) {
    try {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, JSON.stringify(leads, null, 2), "utf8");
      return;
    } catch {
      // try the next path
    }
  }
  throw new Error("lead_store_unwritable");
}

function toStored(row: {
  id: string;
  name: string;
  email: string;
  organization: string;
  phone: string;
  assetType: string;
  source: string;
  message: string;
  extra: string;
  delivered: boolean;
  createdAt: Date;
}): StoredLead {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    organization: row.organization,
    phone: row.phone,
    assetType: row.assetType,
    source: row.source,
    message: row.message,
    extra: row.extra,
    delivered: row.delivered,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function createLead(input: ContactPayload): Promise<StoredLead> {
  const lead: StoredLead = {
    ...input,
    id: newLeadId(),
    delivered: false,
    createdAt: new Date().toISOString(),
  };

  const prisma = await prismaReady();
  if (prisma) {
    try {
      const row = await prisma.lead.create({
        data: {
          id: lead.id,
          name: lead.name,
          email: lead.email,
          organization: lead.organization,
          phone: lead.phone,
          assetType: lead.assetType,
          source: lead.source,
          message: lead.message,
          extra: lead.extra,
          delivered: false,
        },
      });
      return toStored(row);
    } catch {
      // Fall through to the local file when Postgres is down or unmigrated.
    }
  }

  const all = [lead, ...readFileLeads()].slice(0, FILE_CAP);
  writeFileLeads(all);
  return lead;
}

export async function markLeadDelivered(id: string) {
  const prisma = await prismaReady();
  if (prisma) {
    try {
      await prisma.lead.update({ where: { id }, data: { delivered: true } });
    } catch {
      // ignore — file fallback still updates when the row lives there
    }
  }
  const all = readFileLeads();
  const index = all.findIndex((item) => item.id === id);
  if (index < 0) return;
  all[index] = { ...all[index], delivered: true };
  writeFileLeads(all);
}

export async function listLeads(limit = 50): Promise<StoredLead[]> {
  const take = Math.min(Math.max(limit, 1), FILE_CAP);
  const prisma = await prismaReady();
  if (prisma) {
    try {
      const rows = await prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        take,
      });
      return rows.map(toStored);
    } catch {
      // Fall through.
    }
  }
  return readFileLeads().slice(0, take);
}
