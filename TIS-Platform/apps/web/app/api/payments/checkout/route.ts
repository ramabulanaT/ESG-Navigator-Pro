import { NextRequest } from "next/server";
import { createCheckoutLink } from "@/lib/payments";

export const runtime = "nodejs";

const PRICE_MAP: Record<string, { amount:number; currency:string }> = {
  starter:      { amount:  99900, currency: "ZAR" },
  professional: { amount: 249900, currency: "ZAR" },
  enterprise:   { amount:      0, currency: "ZAR" } // will be quoted by sales
};

export async function POST(req: NextRequest) {
  const { plan = "starter" } = await req.json();
  const price = PRICE_MAP[plan] || PRICE_MAP.starter;

  if (plan === "enterprise") {
    return new Response(JSON.stringify({ url: null, note: "Enterprise - contact sales" }), { headers: { "Content-Type":"application/json" }});
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL || (typeof req.nextUrl?.origin === "string" ? req.nextUrl.origin : "");
  const result = await createCheckoutLink({
    plan,
    amount: price.amount,
    currency: price.currency,
    reference: `IM-${plan}-${Date.now()}`,
    returnUrl: `${origin}/?paid=1`,
    notifyUrl: `${origin}/api/payments/webhook`
  });

  return new Response(JSON.stringify({ url: result.url, error: result.error }), { headers: { "Content-Type":"application/json" }});
}