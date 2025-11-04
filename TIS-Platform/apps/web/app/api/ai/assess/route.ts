import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { question = "ESG insights?" } = await req.json().catch(()=>({}));
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

  const system = `You are an ESG & GRC assistant for IntelliMat. Provide concise, auditable recommendations aligned to ISSB/IFRS S1/S2, GRI, SASB and mining context.`;
  const msg = await anthropic.messages.create({
    model: process.env.CLAUDE_MODEL || "claude-3-5-sonnet-latest",
    max_tokens: 800,
    temperature: 0.2,
    system,
    messages: [{ role:"user", content: [{ type:"text", text: question }] }]
  });

  const text = (msg.content?.[0]?.type === "text") ? msg.content[0].text : "";
  return new Response(JSON.stringify({ answer: text }), { headers: { "Content-Type":"application/json" }});
}