// apps/web/app/api/app-suppliers/route.ts
import { NextRequest } from "next/server";

const ORIGIN = process.env.API_BASE || process.env.NEXT_PUBLIC_API_BASE || "";

export async function GET(_req: NextRequest) {
  if (ORIGIN) {
    try {
      const res = await fetch(`${ORIGIN}/api/suppliers`, { cache: "no-store" });
      if (res.ok) return Response.json(await res.json());
    } catch {}
  }
  // Return empty array - suppliers should be configured via database/API
  return Response.json([]);
}
