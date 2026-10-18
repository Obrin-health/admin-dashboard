import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/types/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/reset-password");

  // 1. If accessing auth pages while already logged in, redirect to dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. If accessing protected routes without being logged in, redirect to login
  if (!isAuthPage && !token) {
    const loginUrl = new URL("/login", request.url);
    // Optionally preserve the attempted URL for post-login redirect
    if (pathname !== "/") {
      loginUrl.searchParams.set("from", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images with extensions: png, jpg, jpeg, svg, gif, webp, ico)
     * - api routes (if any)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)",
  ],
};
