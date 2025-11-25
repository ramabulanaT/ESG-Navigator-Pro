import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// ============================================================================
// Configuration
// ============================================================================
const PRIMARY_HOST = "www.esgnavigator.ai";
const VALID_HOSTS = [
  "www.esgnavigator.ai",
  "api.esgnavigator.ai",
  "app.esgnavigator.ai",
  "staging.esgnavigator.ai",
  "staging-api.esgnavigator.ai",
];

const isProd = process.env.VERCEL_ENV === "production";
const redirect308 = (url: URL) => NextResponse.redirect(url, 308);
const redirect301 = (url: URL) => NextResponse.redirect(url, 301);
const redirect302 = (url: URL) => NextResponse.redirect(url, 302);

// ============================================================================
// Middleware Handler
// ============================================================================
export function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const host = req.headers.get("host") || "";
  const path = nextUrl.pathname;
  const protocol = req.headers.get("x-forwarded-proto") || nextUrl.protocol.replace(":", "");

  // -------------------------------------------------------------------------
  // 1. Force HTTPS in production
  // -------------------------------------------------------------------------
  if (isProd && protocol !== "https") {
    const url = nextUrl.clone();
    url.protocol = "https:";
    return redirect301(url);
  }

  // -------------------------------------------------------------------------
  // 2. Apex domain to www redirect
  // -------------------------------------------------------------------------
  if (host === "esgnavigator.ai") {
    const url = nextUrl.clone();
    url.host = PRIMARY_HOST;
    url.protocol = "https:";
    return redirect308(url);
  }

  // -------------------------------------------------------------------------
  // 3. Subdomain routing and redirects
  // -------------------------------------------------------------------------

  // app.esgnavigator.ai -> www.esgnavigator.ai/dashboard
  if (host === "app.esgnavigator.ai") {
    const url = nextUrl.clone();
    url.host = PRIMARY_HOST;
    url.pathname = `/dashboard${path === "/" ? "" : path}`;
    url.protocol = "https:";
    return redirect302(url);
  }

  // -------------------------------------------------------------------------
  // 4. API route cleanup
  // -------------------------------------------------------------------------

  // Remove .js extensions from API routes
  if (path.startsWith("/api/") && path.endsWith(".js")) {
    const url = nextUrl.clone();
    url.pathname = path.replace(/\.js$/, "");
    return redirect308(url);
  }

  // Remove trailing slashes (except for root)
  if (path !== "/" && path.endsWith("/")) {
    const url = nextUrl.clone();
    url.pathname = path.slice(0, -1);
    return redirect308(url);
  }

  // -------------------------------------------------------------------------
  // 5. Security: Block access to sensitive files
  // -------------------------------------------------------------------------
  if (
    path.startsWith("/.env") ||
    path.startsWith("/.git") ||
    path.includes("/node_modules/") ||
    path.includes("/.next/") ||
    path.startsWith("/config/")
  ) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // -------------------------------------------------------------------------
  // 6. Response headers
  // -------------------------------------------------------------------------
  const res = NextResponse.next();

  // Security headers
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Staging/preview environments: prevent search engine indexing
  if (!isProd || host.includes("staging")) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  // CORS headers for API routes
  if (path.startsWith("/api/")) {
    const origin = req.headers.get("origin");
    const isValidOrigin =
      origin && VALID_HOSTS.some((validHost) => origin.includes(validHost));

    if (isValidOrigin) {
      res.headers.set("Access-Control-Allow-Origin", origin);
      res.headers.set("Access-Control-Allow-Credentials", "true");
    }

    res.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    res.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, X-API-Key"
    );
    res.headers.set("Access-Control-Max-Age", "86400");
  }

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: res.headers });
  }

  return res;
}

// ============================================================================
// Matcher Configuration
// ============================================================================
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public folder files (public assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};