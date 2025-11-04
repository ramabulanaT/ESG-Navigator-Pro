export async function GET(req: Request) {
  const url = new URL(req.url); const org = url.searchParams.get("org") || "";
  const r = await fetch(`${process.env.BACKEND_URL}/suppliers?org=${encodeURIComponent(org)}`, { cache:"no-store" });
  return new Response(await r.text(), { headers: { "Content-Type": "application/json" }});
}
export async function POST(req: Request) {
  const body = await req.json();
  const r = await fetch(`${process.env.BACKEND_URL}/suppliers`, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(body) });
  return new Response(await r.text(), { status: r.status, headers: { "Content-Type":"application/json" }});
}