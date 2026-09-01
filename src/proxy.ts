import { NextRequest, NextResponse } from "next/server";
import { clearAuthToken, clearUserToken, getAuthToken, getUserToken } from "./actions/cookie";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_VERIFY_OPTIONS } from "./lib/jwt";
import { safeRedirect as safeRedirectPath } from "./lib/safe-redirect";

async function proxyAdmin(request: NextRequest) {
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
    const decoded = jwt.verify(token, JWT_SECRET, JWT_VERIFY_OPTIONS);
    if (!decoded) {
      throw new Error("Invalid token");
    }
  } catch {
    await clearAuthToken();
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

/**
 * Cheap cookie-presence + signature check for UX only — redirects a signed
 * out visitor to `/login` with the page they were headed to. The actual
 * authorization boundary is server-side: `verifyUserSession()` on each
 * gated page/action, keyed off the session, never a client argument.
 */
async function proxyCustomer(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = await getUserToken();

  if (!token) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", safeRedirectPath(pathname + search));
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET, JWT_VERIFY_OPTIONS);
    if (!decoded) {
      throw new Error("Invalid token");
    }
  } catch {
    await clearUserToken();
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", safeRedirectPath(pathname + search));
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return proxyAdmin(request);
  }

  return proxyCustomer(request);
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/checkout",
    "/checkout/:path*",
    "/my-orders",
    "/my-workshops",
  ],
};
