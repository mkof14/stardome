import { randomBytes } from "crypto";
import {
  fallbackAccounts,
  parseStoredRole,
} from "@/lib/ensure-seed";
import { hashPassword, verifyPassword } from "@/lib/password";
import { prismaReady } from "@/lib/prisma";
import { defaultSignupRole, isUserRole, type UserRole } from "@/lib/rbac";

export type StoredUser = {
  id: string;
  name: string;
  organization: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  commercialRole: string;
  pending: boolean;
  lastSignInAt: string | null;
};

function newUserId() {
  return `usr-${Date.now()}-${randomBytes(3).toString("hex")}`;
}

function toStored(user: {
  id: string;
  name: string;
  organization: string;
  email: string;
  passwordHash: string;
  role: string;
  commercialRole?: string;
  pending: boolean;
  lastSignInAt: Date | null;
}): StoredUser {
  return {
    id: user.id,
    name: user.name,
    organization: user.organization,
    email: user.email,
    passwordHash: user.passwordHash,
    role: parseStoredRole(user.role),
    commercialRole: user.commercialRole ?? "none",
    pending: user.pending,
    lastSignInAt: user.lastSignInAt ? user.lastSignInAt.toISOString() : null,
  };
}

function fromFallback(email: string): StoredUser | null {
  const account = fallbackAccounts().find(
    (item) => item.email === email.trim().toLowerCase(),
  );
  if (!account) return null;
  return {
    id: account.id,
    name: account.name,
    organization: account.organization,
    email: account.email,
    passwordHash: "",
    role: account.role,
    commercialRole:
      "commercialRole" in account ? account.commercialRole : "none",
    pending: false,
    lastSignInAt: null,
  };
}

async function findStoredByEmail(email: string) {
  const prisma = await prismaReady();
  if (!prisma) return null;
  const row = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
  return row ? toStored(row) : null;
}

export async function listUsers() {
  try {
    const prisma = await prismaReady();
    if (!prisma) return [];
    const rows = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
    return rows.map(toStored);
  } catch {
    return [];
  }
}

export async function findUserByEmail(email: string) {
  try {
    const stored = await findStoredByEmail(email);
    if (stored) return stored;
  } catch {
    // Fall through to the built-in demo accounts when Postgres is down.
  }
  return fromFallback(email);
}

export async function findUserById(id: string) {
  try {
    const prisma = await prismaReady();
    if (prisma) {
      const row = await prisma.user.findUnique({ where: { id } });
      if (row) return toStored(row);
    }
  } catch {
    // ignore
  }
  return fallbackAccounts().map((item) => fromFallback(item.email)).find((item) => item?.id === id) ?? null;
}

export async function createUser(input: {
  name: string;
  organization?: string;
  email: string;
  password: string;
  role?: UserRole;
  pending?: boolean;
}) {
  const prisma = await prismaReady();
  if (!prisma) return { ok: false as const, error: "unavailable" };
  const email = input.email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false as const, error: "exists" };
  }
  const user = await prisma.user.create({
    data: {
      id: newUserId(),
      name: input.name.trim(),
      organization: (input.organization ?? "").trim(),
      email,
      passwordHash: input.password ? hashPassword(input.password) : "",
      role: input.role ?? defaultSignupRole(),
      pending: Boolean(input.pending),
    },
  });
  return { ok: true as const, user: toStored(user) };
}

export async function authenticateUser(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  try {
    const user = await findStoredByEmail(normalized);
    if (user && !user.pending && user.passwordHash && verifyPassword(password, user.passwordHash)) {
      return user;
    }
  } catch {
    // Demo accounts still sign in if the database is missing on Vercel.
  }
  const account = fallbackAccounts().find(
    (item) => item.email === normalized && item.password === password,
  );
  return account ? fromFallback(account.email) : null;
}

export async function markSignIn(userId: string) {
  try {
    const prisma = await prismaReady();
    if (!prisma) return;
    await prisma.user.update({
      where: { id: userId },
      data: { lastSignInAt: new Date(), pending: false },
    });
  } catch {
    // Demo JWT sessions do not need a row in Postgres.
  }
}

export async function setUserRole(userId: string, role: UserRole) {
  if (!isUserRole(role)) return null;
  const prisma = await prismaReady();
  if (!prisma) return null;
  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
  return toStored(user);
}

export async function upsertGoogleUser(input: {
  id?: string;
  email: string;
  name?: string | null;
}) {
  const prisma = await prismaReady();
  if (!prisma) return null;
  const email = input.email.trim().toLowerCase();
  const name = input.name?.trim() || email.split("@")[0] || "Officer";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const updated = await prisma.user.update({
      where: { email },
      data: { name, lastSignInAt: new Date(), pending: false },
    });
    return toStored(updated);
  }
  const created = await prisma.user.create({
    data: {
      id: input.id?.trim() || newUserId(),
      email,
      name,
      role: defaultSignupRole(),
      lastSignInAt: new Date(),
      pending: false,
    },
  });
  return toStored(created);
}
