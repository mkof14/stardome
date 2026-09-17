import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { authSecret, ensureAuthEnv } from "@/lib/auth-env";

ensureAuthEnv();

export async function middleware(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: authSecret(),
      secureCookie: req.nextUrl.protocol === "https:",
    });
    if (token) return NextResponse.next();
  } catch {
    // Missing secret or a bad cookie must not render NextAuth's
    // "Server error / server configuration" page on /interface.
  }

  const login = new URL("/login", req.url);
  const next = `${req.nextUrl.pathname}${req.nextUrl.search}`;
  login.searchParams.set("next", next);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: [
    "/interface",
    "/interface/:path*",
    "/backend",
    "/backend/:path*",
    "/admin/:path*",
    "/pricing/desk",
    "/pricing/desk/:path*",
  ],
};
