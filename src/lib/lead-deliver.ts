import type { StoredLead } from "@/lib/lead-store";

function timeoutSignal(ms: number) {
  return AbortSignal.timeout(ms);
}

function leadText(lead: StoredLead) {
  return [
    `StarWall ${lead.source} request`,
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    lead.organization ? `Organization: ${lead.organization}` : "",
    lead.phone ? `Phone: ${lead.phone}` : "",
    lead.assetType ? `Asset: ${lead.assetType}` : "",
    "",
    lead.message,
    lead.extra ? `\nExtra:\n${lead.extra}` : "",
    `\nLead ${lead.id} at ${lead.createdAt}`,
  ]
    .filter((line) => line !== "")
    .join("\n");
}

async function postWebhook(url: string, lead: StoredLead) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
    signal: timeoutSignal(8000),
  });
  return response.ok;
}

async function sendResend(apiKey: string, inbox: string, lead: StoredLead) {
  const from =
    process.env.CONTACT_FROM?.trim() || "StarWall <beth.t@example.com>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [inbox],
      reply_to: lead.email,
      subject: `StarWall ${lead.source} — ${lead.name}`,
      text: leadText(lead),
    }),
    signal: timeoutSignal(8000),
  });
  return response.ok;
}

export async function tryDeliverLead(lead: StoredLead): Promise<boolean> {
  const webhook = process.env.CONTACT_WEBHOOK_URL?.trim();
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const inbox = process.env.CONTACT_INBOX?.trim();
  let delivered = false;

  if (webhook) {
    try {
      delivered = (await postWebhook(webhook, lead)) || delivered;
    } catch {
      // Persist already succeeded; delivery is optional.
    }
  }

  if (apiKey && inbox) {
    try {
      delivered = (await sendResend(apiKey, inbox, lead)) || delivered;
    } catch {
      // same
    }
  }

  return delivered;
}
