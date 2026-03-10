import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const protectedRoutes = ["/workspace", "/events"];
const authRoutes = ["/login"];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const isProtected = protectedRoutes.some((route) =>
      pathname.startsWith(route),
    );
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
    const isLanding = pathname === "/";

    if (isProtected && !session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAuthRoute && session) {
      return NextResponse.redirect(new URL("/workspace", request.url));
    }

    if (isLanding && session) {
      return NextResponse.redirect(new URL("/workspace", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("middleware error:", error);
    const isProtected = protectedRoutes.some((route) =>
      pathname.startsWith(route),
    );
    if (isProtected) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/", "/login", "/workspace/:path*", "/events/:path*"],
};
