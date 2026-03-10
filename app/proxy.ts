import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const protectedRoutes = ["/workspace", "/events"];
const authRoutes = ["/login"];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/workspace", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/workspace/:path*", "/events/:path*", "/login"],
};
