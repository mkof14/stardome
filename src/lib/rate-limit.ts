const buckets = new Map<string, { count: number; resetAt: number }>();

export function clientKey(request: Request, scope: string) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip") || "local";
  return `${scope}:${ip}`;
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true as const, remaining: limit - 1, retryAfterMs: 0 };
  }
  if (current.count >= limit) {
    return {
      ok: false as const,
      remaining: 0,
      retryAfterMs: Math.max(0, current.resetAt - now),
    };
  }
  current.count += 1;
  return {
    ok: true as const,
    remaining: limit - current.count,
    retryAfterMs: 0,
  };
}

export function rateLimitResponse(retryAfterMs: number) {
  const seconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
  return Response.json(
    { error: "rate_limited" },
    {
      status: 429,
      headers: { "Retry-After": String(seconds) },
    },
  );
}
