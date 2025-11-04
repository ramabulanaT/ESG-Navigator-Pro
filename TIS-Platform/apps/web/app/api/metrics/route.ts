export const runtime = "edge";
export async function GET() {
  const data = { esgScore: 87.5, suppliers: 342, riskAlerts: 8, complianceRate: 94.2 };
  return new Response(JSON.stringify(data), { headers: { "Content-Type":"application/json" }});
}