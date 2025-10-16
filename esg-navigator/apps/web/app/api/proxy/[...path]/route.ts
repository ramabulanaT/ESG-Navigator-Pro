import { NextRequest } from "next/server";
const ORIGIN = process.env.API_BASE || process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5050";
const PROXY_KEY = process.env.API_PROXY_KEY || process.env.PROXY_SHARED_SECRET;
const HOP = new Set(["connection","keep-alive","proxy-authenticate","proxy-authorization","te","trailer","transfer-encoding","upgrade"]);
function headersFrom(req: NextRequest): Headers {
  const h = new Headers();
  req.headers.forEach((v, k) => { const low = k.toLowerCase(); if (HOP.has(low) || low === "host") return; h.set(k, v); });
  if (PROXY_KEY) h.set("x-proxy-key", PROXY_KEY);
  h.set("x-forwarded-host", req.headers.get("host") || "localhost");
  h.set("x-forwarded-proto", req.nextUrl.protocol.replace(":", ""));
  return h;
}
function target(req: NextRequest, path: string[]) {
  const qs = req.nextUrl.search; return `${ORIGIN}/${path.join("/")}${qs ?? ""}`;
}
async function handle(req: NextRequest, ctx: { params: { path: string[] } }) {
  const p = ctx.params?.path ?? []; if (!p.length) return new Response("Missing target path", { status: 400 });
  const url = target(req, p); const method = req.method;
  let body: BodyInit | undefined;
  if (method !== "GET" && method !== "HEAD") { const buf = await req.arrayBuffer(); body = buf.byteLength ? buf : undefined; }
  const res = await fetch(url, { method, headers: headersFrom(req), body, redirect: "manual" });
  const out = new Headers(); res.headers.forEach((v, k) => { if (!HOP.has(k.toLowerCase())) out.set(k, v); });
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: out });
}
export const GET = handle; export const POST = handle; export const PUT = handle; export const PATCH = handle; export const DELETE = handle; export const OPTIONS = handle;