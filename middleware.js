import { NextResponse } from "next/server";

const CANONICAL_HOST = "code-destiny.com";
const REDIRECT_HOSTS = new Set(["www.code-destiny.com", "code-destiny-web.pages.dev"]);

function isLocalHost(host) {
  return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
}

function shouldRedirectToCanonical(host) {
  if (!host || isLocalHost(host) || host === CANONICAL_HOST) {
    return false;
  }

  if (REDIRECT_HOSTS.has(host)) {
    return true;
  }

  return host.endsWith(".pages.dev");
}

export function middleware(request) {
  const rawHost = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const host = rawHost.toLowerCase().split(":")[0];

  if (shouldRedirectToCanonical(host)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.protocol = "https";
    redirectUrl.host = CANONICAL_HOST;
    return NextResponse.redirect(redirectUrl, 308);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/:path*"],
};
