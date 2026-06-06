import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req: any) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");
  const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard");
  const isRootPage = req.nextUrl.pathname === "/";

  let response = NextResponse.next();

  if (isRootPage && isLoggedIn) {
    response = NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  } else if (isAuthPage) {
    if (isLoggedIn) {
      response = NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
  } else if (isDashboardPage && !isLoggedIn) {
    response = NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Basic CSP (can be expanded based on external resources)
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  );

  return response;
});

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/register"],
};
