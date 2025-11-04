export async function POST(req: Request) {
  const body = await req.json();
  const res = await fetch(`${process.env.BACKEND_URL}/clients`, {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(body)
  });
  const out = await res.text();
  return new Response(out, { status: res.status, headers: { "Content-Type": res.headers.get("content-type") || "application/json" }});
}