type CheckoutArgs = {
  plan: string;
  amount: number;         // cents or minor units if needed
  currency: string;       // e.g. "ZAR"
  reference: string;      // merchant reference
  returnUrl: string;      // where to send customer after payment
  notifyUrl?: string;     // webhook
};

export async function createCheckoutLink(args: CheckoutArgs): Promise<{url?: string; raw?: any; error?: string}> {
  const provider = (process.env.PAYMENT_PROVIDER || "peach").toLowerCase();
  if (provider === "peach") return peachCheckout(args);
  if (provider === "ozow")  return ozowLink(args);
  if (provider === "payu")  return payuLink(args);
  return { error: "Unsupported provider" };
}

// -------- Peach Payments (Hosted/Embedded Checkout v2) --------
// Docs: Auth via Dashboard -> oauth token, then POST {checkout-base}/v2/checkout to create checkout.
// Sandbox endpoints: auth base https://sandbox-dashboard.peachpayments.com ; checkout base https://testsecure.peachpayments.com
async function peachCheckout({ plan, amount, currency, reference, returnUrl, notifyUrl }: CheckoutArgs) {
  try {
    const authBase = process.env.PEACH_AUTH_BASE || "https://sandbox-dashboard.peachpayments.com";
    const checkoutBase = process.env.PEACH_CHECKOUT_BASE || "https://testsecure.peachpayments.com";
    const clientId     = process.env.PEACH_CLIENT_ID!;
    const clientSecret = process.env.PEACH_CLIENT_SECRET!;
    const merchantId   = process.env.PEACH_MERCHANT_ID!;

    // 1) get access token
    const tokRes = await fetch(`${authBase}/api/oauth/token`, {
      method: "POST",
      headers: { "content-type":"application/json" },
      body: JSON.stringify({ clientId, clientSecret, merchantId })
    });
    if (!tokRes.ok) return { error: `Auth failed (${tokRes.status})` };
    const tok = await tokRes.json();

    // 2) create checkout (hosted)
    // IMPORTANT: PayShap enablement is configured on your Peach account; you can set a defaultPaymentMethod like "PayShap" if required.
    const coRes = await fetch(`${checkoutBase}/v2/checkout`, {
      method: "POST",
      headers: {
        "content-type":"application/json",
        "authorization": `Bearer ${tok.access_token}`
      },
      body: JSON.stringify({
        amount,
        currency,
        merchantReference: reference,
        successUrl: returnUrl,
        cancelUrl: returnUrl,
        notificationUrl: notifyUrl,
        // Uncomment if you want to bias UI:
        // defaultPaymentMethod: "PayShap",
        // paymentMethods: ["PayShap"]
      })
    });
    const body = await coRes.json();
    if (!coRes.ok) return { error: `Checkout failed (${coRes.status})`, raw: body };
    return { url: body.redirectUrl || body.checkoutUrl, raw: body };
  } catch (err:any) {
    return { error: err?.message || "Peach error" };
  }
}

// -------- Ozow Link (simplified URL flow) --------
// Ozow provides an API to generate a payment URL link which the shopper follows.
async function ozowLink({ amount, currency, reference, returnUrl }: CheckoutArgs) {
  try {
    const base = process.env.OZOW_API_BASE || "https://api.ozow.com";
    const site = process.env.OZOW_SITE_CODE!;
    const key  = process.env.OZOW_API_KEY!;
    // NOTE: Refer to Ozow docs to compute hash/signature and required fields; this is a placeholder POST.
    const res = await fetch(`${base}/payments/link`, {
      method: "POST",
      headers: { "content-type":"application/json", "x-api-key": key },
      body: JSON.stringify({ site, amount, currency, reference, successUrl: returnUrl, paymentMethod: "PayShap" })
    });
    const body = await res.json().catch(()=> ({}));
    if (!res.ok) return { error: `Ozow link failed (${res.status})`, raw: body };
    return { url: body?.url || body?.paymentUrl, raw: body };
  } catch (err:any) {
    return { error: err?.message || "Ozow error" };
  }
}

// -------- PayU Link (placeholder) --------
async function payuLink({ amount, currency, reference, returnUrl }: CheckoutArgs) {
  try {
    const base = process.env.PAYU_API_BASE || "https://secure.payu.co.za";
    const key  = process.env.PAYU_MERCHANT_KEY!;
    const salt = process.env.PAYU_SALT!;
    // NOTE: Implement per PayU SA docs; include signature and specify PayShap method if available in your config.
    const res = await fetch(`${base}/api/checkout`, {
      method: "POST",
      headers: { "content-type":"application/json", "authorization": `Key ${key}` },
      body: JSON.stringify({ amount, currency, reference, returnUrl, method: "PayShap" })
    });
    const body = await res.json().catch(()=> ({}));
    if (!res.ok) return { error: `PayU link failed (${res.status})`, raw: body };
    return { url: body?.redirectUrl || body?.url, raw: body };
  } catch (err:any) {
    return { error: err?.message || "PayU error" };
  }
}