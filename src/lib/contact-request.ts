export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  organization: string;
  phone: string;
  assetType: string;
  source: string;
  extra: string;
};

export type ContactParseResult =
  | { ok: true; value: ContactPayload }
  | { ok: false; error: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clip(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function extraText(value: unknown) {
  if (value == null) return "";
  if (typeof value === "string") return value.trim().slice(0, 8000);
  try {
    return JSON.stringify(value).slice(0, 8000);
  } catch {
    return "";
  }
}

export function parseContactBody(body: unknown): ContactParseResult {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request." };
  }
  const rec = body as Record<string, unknown>;
  const name = clip(rec.name, 120);
  const email = clip(rec.email, 254).toLowerCase();
  const message = clip(rec.message, 8000);
  if (!name || !email || !message) {
    return { ok: false, error: "Name, email, and message are required." };
  }
  if (!EMAIL.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  return {
    ok: true,
    value: {
      name,
      email,
      message,
      organization: clip(rec.organization, 200),
      phone: clip(rec.phone, 40),
      assetType: clip(rec.assetType, 80),
      source: clip(rec.source, 40) || "contact",
      extra: extraText(rec.extra),
    },
  };
}
