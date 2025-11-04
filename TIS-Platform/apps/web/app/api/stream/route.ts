import { NextRequest } from "next/server";
export const runtime = "edge";
export async function GET(req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const enc = new TextEncoder();
      const id = setInterval(() => {
        const payload = JSON.stringify({
          esgScore: (86 + Math.random()*4),
          suppliers: 340 + Math.floor(Math.random()*10),
          riskAlerts: 5 + Math.floor(Math.random()*6),
          complianceRate: 92 + Math.random()*3,
          performancePoints: {
            env: [82,83,85,86,88, 88+Math.round(Math.random()*3)],
            soc: [78,79,81,82,84, 86+Math.round(Math.random()*2)],
            gov: [90,91,92,94,95, 95]
          }
        });
        controller.enqueue(enc.encode(`data: ${payload}\n\n`));
      }, 5000);
      const close = () => { clearInterval(id); controller.close(); };
      // @ts-ignore
      req.signal?.addEventListener("abort", close);
    }
  });
  return new Response(stream, { headers:{ "Content-Type":"text/event-stream","Cache-Control":"no-cache","Connection":"keep-alive" }});
}