// apps/web/app/api/app-suppliers/route.ts
import { NextRequest } from "next/server";
const ORIGIN = process.env.API_BASE || process.env.NEXT_PUBLIC_API_BASE || "";
const DEMO = [
  { name: "Eskom Holdings", value: "R120M", risk: "HIGH", score: 65, tags: ["GRI","SASB","TCFD"] },
  { name: "Multotec Processing", value: "R89M", risk: "MEDIUM", score: 76, tags: ["SASB"] },
  { name: "Anglo American Platinum", value: "R67M", risk: "LOW", score: 82, tags: ["GRI","TCFD"] },
  { name: "Sasol Chemical", value: "R55M", risk: "MEDIUM", score: 71, tags: ["SASB"] },
  { name: "Siemens South Africa", value: "R45M", risk: "LOW", score: 88, tags: ["GRI"] },
];
export async function GET(_req: NextRequest) {
  if (ORIGIN) {
    try {
      const res = await fetch(`${ORIGIN}/api/suppliers`, { cache: "no-store" });
      if (res.ok) return Response.json(await res.json());
    } catch {}
  }
  return Response.json(DEMO);
}