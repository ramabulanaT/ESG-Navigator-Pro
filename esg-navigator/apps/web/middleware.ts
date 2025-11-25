import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
const PRIMARY_HOST = "www.esgnavigator.ai";
const redirect308 = (url: URL) => NextResponse.redirect(url, 308);
const isProd = process.env.VERCEL_ENV === "production";

export function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const host = req.headers.get("host") || "";
  const path = nextUrl.pathname;

  // apex -> www
  if (host === "esgnavigator.ai") {
    const url = nextUrl.clone();
    url.host = PRIMARY_HOST;
    return redirect308(url);
  }

  // /api/*.js -> /api/*
  if (path.startsWith("/api/") && path.endsWith(".js")) {
    const url = nextUrl.clone();
    url.pathname = path.replace(/\.js$/, "");
    return redirect308(url);
  }

  const res = NextResponse.next();
  if (!isProd) { res.headers.set("x-robots-tag", "noindex, nofollow"); } // previews: keep out of search
  return res;
}
export const config = { matcher: ["/:path*"] };