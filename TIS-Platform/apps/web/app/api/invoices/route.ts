export async function GET(req: Request) {
  const url = new URL(req.url); const org = url.searchParams.get("org") || "";
  const r = await fetch(`${process.env.BACKEND_URL}/billing/invoices?org=${encodeURIComponent(org)}`, { cache:"no-store" });
  return new Response(await r.text(), { headers: { "Content-Type":"application/json" }});
}