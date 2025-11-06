import express from "express";
import cors from "cors";

const PORT = process.env.PORT || 5050;
const ORIGINS = (process.env.CORS_ORIGINS || "http://127.0.0.1:5500,http://localhost:5500,http://localhost:3000,http://localhost:5173,https://*.vercel.app,https://www.esgnavigator.ai").split(",");
const PUBLIC_API_KEY = process.env.PUBLIC_API_KEY || "change-me-please";

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || origin === "null") return cb(null, true);
    const ok = ORIGINS.some(o => origin.includes(o.replace("*.", "")));
    return ok ? cb(null, true) : cb(new Error("CORS blocked"));
  }
}));

// small bank of 10 questions
const BANK = [
  { id: "gov_risk",        text: "Formally documented risk register?",       weight: 10 },
  { id: "board_esg",       text: "ESG discussed at board quarterly?",        weight: 10 },
  { id: "scope_data",      text: "Scope 1/2 energy & emissions captured?",   weight: 10 },
  { id: "supplier_screen", text: "Suppliers screened for ESG pre-onboard?",  weight: 10 },
  { id: "infosec",         text: "ISO 27001-aligned ISMS?",                  weight: 10 },
  { id: "hse",             text: "LTIFR/TRIFR tracked with targets?",        weight: 10 },
  { id: "audit_trail",     text: "Audit trail for ESG metrics?",             weight: 10 },
  { id: "training",        text: "ESG/GRC training in past 12 months?",      weight: 10 },
  { id: "reporting",       text: "ISSB/GRI/King IV aligned disclosures?",    weight: 10 },
  { id: "improvement",     text: "Quarterly improvement plans & owners?",    weight: 10 }
];

function requireKey(req, res, next) {
  const k = req.headers["x-esgnav-key"] || req.query.key;
  if (!PUBLIC_API_KEY) return res.status(500).json({ error: "server_not_configured" });
  if (k === PUBLIC_API_KEY) return next();
  return res.status(401).json({ error: "unauthorized" });
}

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "tis-esg-api-lite", time: new Date().toISOString() });
});

app.get("/public/10q/questions", requireKey, (req, res) => {
  const industry = String(req.query.industry || "default");
  res.json({ industry, questions: BANK });
});

app.post("/public/10q/submit", requireKey, (req, res) => {
  try {
    const { company = "Unknown Co", email = "", industry = "default", answers = [] } = req.body || {};
    let total = 0, max = 0, detail = [];
    for (const q of BANK) {
      const a = answers.find(x => x.id === q.id);
      const v = a ? Number(a.value ? 1 : 0) : 0;
      total += v * q.weight; max += q.weight;
      detail.push({ id: q.id, weight: q.weight, value: v });
    }
    const score = max ? Math.round(100 * total / max) : 0;
    const maturity = Number((score / 20).toFixed(2));
    const reference = `PS-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`;
    return res.json({ ok: true, reference, company, industry, assessment: { score, maturity, detail } });
  } catch (e) {
    return res.status(500).json({ error: "submit_failed" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API listening on :${PORT}`);
});
