import { NextResponse } from "next/server";
import { requireActor } from "@/lib/authz";
import { parseContactBody } from "@/lib/contact-request";
import { tryDeliverLead } from "@/lib/lead-deliver";
import { createLead, listLeads, markLeadDelivered } from "@/lib/lead-store";
import { clientKey, rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function GET() {
  const ready = await requireActor();
  if (!ready.ok) {
    return NextResponse.json({ error: ready.error }, { status: ready.status });
  }
  const leads = await listLeads(80);
  return NextResponse.json({ ok: true, leads });
}

export async function POST(request: Request) {
  const limited = rateLimit(clientKey(request, "contact"), 8, 60_000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfterMs);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = parseContactBody(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  let lead;
  try {
    lead = await createLead(parsed.value);
  } catch {
    return NextResponse.json(
      { error: "The request could not be recorded." },
      { status: 500 },
    );
  }

  const delivered = await tryDeliverLead(lead);
  if (delivered) {
    try {
      await markLeadDelivered(lead.id);
    } catch {
      // The lead is already stored.
    }
  }

  return NextResponse.json({
    ok: true,
    stored: true,
    delivered,
    id: lead.id,
  });
}
