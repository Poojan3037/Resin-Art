import { NextRequest, NextResponse } from "next/server";
import { clearAuthToken, getAuthToken } from "./actions/cookie";
import jwt from "jsonwebtoken";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getAuthToken();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    // If already authenticated, skip the login page
    if (token) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // All other /admin/* routes require a valid token
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (!decoded) {
      throw new Error("Invalid token");
    }
  } catch {
    await clearAuthToken();
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
