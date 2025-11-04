export const runtime = "nodejs";
export async function GET(req: Request) {
  const url = new URL(req.url); const org = url.searchParams.get("org") || "";
  const r = await fetch(`${process.env.BACKEND_URL}/analytics/boardpack?org=${encodeURIComponent(org)}`);
  return new Response(r.body, { headers: { "Content-Type":"application/pdf", "Content-Disposition": `attachment; filename="${org}-Board-Pack.pdf"` }});
}