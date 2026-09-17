import { NextResponse, type NextRequest } from "next/server";

/** NextAuth's default error page is the "Server error / server configuration" HTML. Never show it. */
export function GET(req: NextRequest) {
  const login = new URL("/login", req.url);
  const err = req.nextUrl.searchParams.get("error");
  if (err) login.searchParams.set("error", err);
  return NextResponse.redirect(login);
}

export function POST(req: NextRequest) {
  return GET(req);
}
