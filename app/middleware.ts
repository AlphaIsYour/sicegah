/* eslint-disable @typescript-eslint/no-unused-vars */
// middleware.ts (di root project)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes yang memerlukan authentication
  const protectedRoutes = ["/dashboard"];

  // Public routes yang tidak memerlukan authentication
  const publicRoutes = ["/", "/api/auth/login", "/api/auth/register"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isPublicRoute = publicRoutes.some((route) => pathname === route);

  // Jika mengakses protected route
  if (isProtectedRoute) {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      // Redirect ke login jika tidak ada token
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      // Verify token
      jwt.verify(token, process.env.JWT_SECRET || "fallback-secret-key");
      // Token valid, lanjutkan ke halaman
      return NextResponse.next();
    } catch (error) {
      // Token invalid, redirect ke login
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("auth-token");
      return response;
    }
  }

  // Jika sudah login dan mengakses halaman login
  if (pathname === "/" && !isPublicRoute) {
    const token = request.cookies.get("auth-token")?.value;

    if (token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET || "fallback-secret-key");
        // Sudah login, redirect ke dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } catch (error) {
        // Token invalid, hapus cookie dan lanjutkan ke login
        const response = NextResponse.next();
        response.cookies.delete("auth-token");
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
