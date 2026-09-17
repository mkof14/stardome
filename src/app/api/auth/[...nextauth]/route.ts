import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { applyAuthUrlFromRequest } from "@/lib/auth-env";

const handler = NextAuth(authOptions);

type RouteContext = { params: { nextauth: string[] } };

async function auth(req: NextRequest, context: RouteContext) {
  applyAuthUrlFromRequest(req);
  return handler(req, context);
}

export { auth as GET, auth as POST };
