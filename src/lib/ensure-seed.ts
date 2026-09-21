import { readFileSync } from "fs";
import { join } from "path";
import type { PrismaClient } from "@prisma/client";
import { hashPassword, verifyPassword } from "@/lib/password";
import { EQUIPMENT_CATALOG } from "@/lib/equipment";
import { INTEGRATION_CATALOG } from "@/lib/integrations";
import { isUserRole, type UserRole } from "@/lib/rbac";
import { ensurePriceBookSeed } from "@/lib/price-book/seed";

/** Shared demonstration password. Printed on /login as demo / demo. */
export const DEMO_PASSWORD = "demo";
export const DEMO_LOGIN = "demo";
export const DEMO_EMAIL = "demo@starwall.demo";

const RETIRED_OWNER_EMAIL = "dnainform@gmail.com";

export function normalizeLogin(value: string) {
  const raw = value.trim().toLowerCase();
  if (raw === DEMO_LOGIN || raw === DEMO_EMAIL) return DEMO_EMAIL;
  return raw;
}

export const DEMO_ACCOUNTS: {
  id: string;
  email: string;
  name: string;
  organization: string;
  role: UserRole;
  password: string;
}[] = [
  {
    id: "usr-demo",
    email: DEMO_EMAIL,
    name: "Demo",
    organization: "AGRON",
    role: "Super Admin",
    password: DEMO_PASSWORD,
  },
  {
    id: "usr-super",
    email: "super@starwall.demo",
    name: "Super Admin",
    organization: "AGRON",
    role: "Super Admin",
    password: DEMO_PASSWORD,
  },
  {
    id: "usr-admin",
    email: "admin@starwall.demo",
    name: "Admin",
    organization: "AGRON",
    role: "Admin",
    password: DEMO_PASSWORD,
  },
  {
    id: "usr-operator",
    email: "operator@starwall.demo",
    name: "Operator",
    organization: "AGRON",
    role: "Operator",
    password: DEMO_PASSWORD,
  },
  {
    id: "usr-viewer",
    email: "viewer@starwall.demo",
    name: "Viewer",
    organization: "AGRON",
    role: "Viewer",
    password: DEMO_PASSWORD,
  },
];

type JsonUser = {
  id?: string;
  email?: string;
  name?: string;
  organization?: string;
  passwordHash?: string;
};

function readLegacyUsers(): JsonUser[] {
  const paths = [
    join(process.cwd(), "data", "users.json"),
    join("/tmp", "starwall-users.json"),
  ];
  for (const path of paths) {
    try {
      const parsed = JSON.parse(readFileSync(path, "utf8")) as unknown;
      if (Array.isArray(parsed)) return parsed as JsonUser[];
    } catch {
      // try the next path
    }
  }
  return [];
}

export const COMMERCIAL_DEMO_ACCOUNTS = [
  {
    id: "usr-sales",
    email: "sales@starwall.demo",
    name: "Sales",
    organization: "AGRON",
    role: "Operator" as const,
    commercialRole: "sales",
    password: DEMO_PASSWORD,
  },
  {
    id: "usr-engineering",
    email: "engineering@starwall.demo",
    name: "Engineering",
    organization: "AGRON",
    role: "Operator" as const,
    commercialRole: "engineering",
    password: DEMO_PASSWORD,
  },
] as const;

export function fallbackAccounts() {
  const owner = ownerAccount();
  return owner
    ? [...DEMO_ACCOUNTS, owner, ...COMMERCIAL_DEMO_ACCOUNTS]
    : [...DEMO_ACCOUNTS, ...COMMERCIAL_DEMO_ACCOUNTS];
}

export function ownerAccount() {
  const email = process.env.STARWALL_OWNER_EMAIL?.trim().toLowerCase() ?? "";
  const password = process.env.STARWALL_OWNER_PASSWORD?.trim() ?? "";
  if (!email || !password) return null;
  return {
    id: "usr-owner",
    email,
    name: "Owner",
    organization: "AGRON",
    role: "Super Admin" as const,
    password,
  };
}

async function retireDefaultOwner(prisma: PrismaClient) {
  const existing = await prisma.user.findUnique({
    where: { email: RETIRED_OWNER_EMAIL },
  });
  if (!existing) return;
  await prisma.user.update({
    where: { email: RETIRED_OWNER_EMAIL },
    data: { pending: true, passwordHash: "" },
  });
}

async function upsertSeedAccount(
  prisma: PrismaClient,
  account: {
    id: string;
    email: string;
    name: string;
    organization: string;
    role: UserRole;
    password: string;
    commercialRole?: string;
  },
) {
  const existing = await prisma.user.findUnique({ where: { email: account.email } });
  const passwordOk = Boolean(
    existing?.passwordHash && verifyPassword(account.password, existing.passwordHash),
  );
  const data = {
    name: existing?.name || account.name,
    organization: existing?.organization || account.organization,
    role: account.role,
    commercialRole: account.commercialRole ?? existing?.commercialRole ?? "none",
    passwordHash:
      passwordOk && existing?.passwordHash
        ? existing.passwordHash
        : hashPassword(account.password),
    pending: false,
  };
  if (existing) {
    const roleChanged = existing.role !== account.role;
    const commercialChanged =
      Boolean(account.commercialRole) &&
      existing.commercialRole !== account.commercialRole;
    if (!passwordOk || roleChanged || commercialChanged || existing.pending) {
      await prisma.user.update({ where: { email: account.email }, data });
    }
    return;
  }
  await prisma.user.create({
    data: {
      id: account.id,
      email: account.email,
      ...data,
    },
  });
}

async function ensureOwnerAccount(prisma: PrismaClient) {
  const account = ownerAccount();
  if (!account) {
    await retireDefaultOwner(prisma);
    return;
  }
  await upsertSeedAccount(prisma, account);
}

export async function ensureBackendSeed(prisma: PrismaClient) {
  await ensureOwnerAccount(prisma);

  for (const account of DEMO_ACCOUNTS) {
    await upsertSeedAccount(prisma, account);
  }

  for (const legacy of readLegacyUsers()) {
    const email = legacy.email?.trim().toLowerCase() ?? "";
    if (!email || !legacy.passwordHash) continue;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) continue;
    await prisma.user.create({
      data: {
        id: legacy.id?.trim() || `usr-legacy-${email}`,
        email,
        name: legacy.name?.trim() || email.split("@")[0] || "Officer",
        organization: legacy.organization?.trim() || "",
        passwordHash: legacy.passwordHash,
        role: "Operator",
        pending: false,
      },
    });
  }

  for (const item of EQUIPMENT_CATALOG) {
    await prisma.equipment.upsert({
      where: { id: item.id },
      update: { name: item.name, category: item.category },
      create: {
        id: item.id,
        name: item.name,
        category: item.category,
        status: "ok",
      },
    });
  }

  for (const item of INTEGRATION_CATALOG) {
    await prisma.integration.upsert({
      where: { id: item.id },
      update: { name: item.name, vendor: item.vendor },
      create: {
        id: item.id,
        name: item.name,
        vendor: item.vendor,
        lastPingAt: new Date(),
      },
    });
  }

  const routeCount = await prisma.notificationRoute.count();
  if (routeCount === 0) {
    const defaults: { riskLevel: string; method: string; enabled: boolean }[] = [
      { riskLevel: "attention", method: "email", enabled: true },
      { riskLevel: "elevated", method: "email", enabled: true },
      { riskLevel: "elevated", method: "sms", enabled: true },
      { riskLevel: "critical", method: "email", enabled: true },
      { riskLevel: "critical", method: "sms", enabled: true },
      { riskLevel: "critical", method: "call", enabled: true },
      { riskLevel: "critical", method: "messenger", enabled: true },
    ];
    await prisma.notificationRoute.createMany({
      data: defaults.map((row, index) => ({
        id: `route-${row.riskLevel}-${row.method}-${index}`,
        riskLevel: row.riskLevel,
        method: row.method,
        contact: "",
        enabled: row.enabled,
      })),
    });
  }

  for (const account of COMMERCIAL_DEMO_ACCOUNTS) {
    await upsertSeedAccount(prisma, account);
  }

  await ensurePriceBookSeed(prisma, "system");
}

export function parseStoredRole(value: string | null | undefined): UserRole {
  return isUserRole(value) ? value : "Operator";
}
