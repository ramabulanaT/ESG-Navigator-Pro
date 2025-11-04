export const runtime = "nodejs";
export async function POST(req: Request) {
  const b = await req.json();
  const path = b.type === "consulting" ? "/billing/invoice/consulting" : "/billing/invoice/subscription";
  const r = await fetch(`${process.env.BACKEND_URL}${path}`, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(b) });
  return new Response(await r.text(), { status: r.status, headers: { "Content-Type":"application/json" }});
}