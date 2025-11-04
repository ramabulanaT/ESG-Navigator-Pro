"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Chart from "chart.js/auto";

type Metrics = { esgScore:number; suppliers:number; riskAlerts:number; complianceRate:number; }
type Tab = "dashboard" | "registration" | "training" | "csm" | "pricing" | "gap";

export default function Page() {
  const [active, setActive] = useState<Tab>("dashboard");
  const [metrics, setMetrics] = useState<Metrics>({ esgScore:87.5, suppliers:342, riskAlerts:8, complianceRate:94.2 });

  // chart refs
  const perfRef = useRef<HTMLCanvasElement>(null);
  const compRef = useRef<HTMLCanvasElement>(null);
  const riskRef = useRef<HTMLCanvasElement>(null);
  const gapRef  = useRef<HTMLCanvasElement>(null);
  const matRef  = useRef<HTMLCanvasElement>(null);
  const charts  = useRef<Record<string, Chart|undefined>>({});

  // styles/theme
  const theme = useMemo(()=>({
    page: {
      background: "linear-gradient(135deg,#0f172a 0%,#1e3c72 50%,#2a5298 100%)",
      minHeight: "100vh",
      color: "#fff",
    } as React.CSSProperties,
    container: {
      maxWidth: 1200, margin: "0 auto", padding: "24px 20px",
    } as React.CSSProperties,
    glass: {
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 16,
      backdropFilter: "blur(10px)",
    } as React.CSSProperties,
    card: {
      padding: 16, borderRadius: 14, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)",
    } as React.CSSProperties,
    h1: { fontSize: 32, fontWeight: 800, letterSpacing: 0.2, marginBottom: 8 } as React.CSSProperties,
    h2: { fontSize: 20, fontWeight: 700, opacity: 0.95, marginBottom: 12 } as React.CSSProperties,
    sub: { opacity: 0.8, fontSize: 14 } as React.CSSProperties,
    btn:(bg:string)=>({
      background: bg, border:"none", color:"#fff", borderRadius:12, padding:"10px 16px",
      cursor:"pointer", fontWeight:700, transition:"transform .15s ease", boxShadow:"0 6px 24px rgba(0,0,0,.25)"
    } as React.CSSProperties),
    navBtn:(active:boolean)=>({
      border:"1px solid rgba(255,255,255,0.12)",
      background: active ? "linear-gradient(135deg,#7e22ce,#2a5298)" : "rgba(255,255,255,0.06)",
      color:"#fff", padding:"8px 14px", borderRadius:12, cursor:"pointer",
      fontWeight:700, transition:"all .2s ease", whiteSpace:"nowrap"
    } as React.CSSProperties),
    grid:(cols:string, gap=16)=>({ display:"grid", gridTemplateColumns: cols, gap } as React.CSSProperties),
  }),[]);

  // hydrate metrics once
  useEffect(()=>{ fetch("/api/metrics").then(r=>r.json()).then(setMetrics).catch(()=>{}); },[]);

  // live SSE
  useEffect(()=>{
    const es = new EventSource("/api/stream");
    es.onmessage = (e) => {
      const update = JSON.parse(e.data);
      setMetrics(m => ({ ...m, ...update }));
      // chart live update demo
      if (update.performancePoints && charts.current.performance) {
        const c = charts.current.performance;
        // @ts-ignore
        c.data.datasets[0].data = update.performancePoints.env;
        // @ts-ignore
        c.data.datasets[1].data = update.performancePoints.soc;
        // @ts-ignore
        c.data.datasets[2].data = update.performancePoints.gov;
        c.update();
      }
    };
    es.onerror = () => es.close();
    return () => es.close();
  },[]);

  // chart init when sections mount/activate
  useEffect(()=>{
    const initDashboardCharts = () => {
      if (perfRef.current && !charts.current.performance) {
        charts.current.performance = new Chart(perfRef.current, {
          type:"line",
          data:{ labels:["Jan","Feb","Mar","Apr","May","Jun"],
            datasets:[
              {label:"Environmental", data:[82,84,85,87,88,90], borderColor:"#10b981", backgroundColor:"rgba(16,185,129,.12)", tension:.4},
              {label:"Social",        data:[78,80,82,83,85,87], borderColor:"#3b82f6", backgroundColor:"rgba(59,130,246,.12)", tension:.4},
              {label:"Governance",    data:[90,91,92,93,94,95], borderColor:"#7e22ce", backgroundColor:"rgba(126,34,206,.12)", tension:.4}
            ]},
          options:{ responsive:true, maintainAspectRatio:false }
        });
      }
      if (compRef.current && !charts.current.compliance) {
        charts.current.compliance = new Chart(compRef.current, {
          type:"bar",
          data:{ labels:["Q1","Q2","Q3","Q4"], datasets:[{ label:"Compliance Rate", data:[88,91,93,94]}]},
          options:{ responsive:true, maintainAspectRatio:false }
        });
      }
      if (riskRef.current && !charts.current.risk) {
        charts.current.risk = new Chart(riskRef.current, {
          type:"doughnut",
          data:{ labels:["Low","Medium","High","Critical"], datasets:[{ data:[45,30,20,5] }]},
          options:{ responsive:true, maintainAspectRatio:false }
        });
      }
    };
    const initGapCharts = () => {
      if (gapRef.current && !charts.current.gap) {
        charts.current.gap = new Chart(gapRef.current, {
          type:"line",
          data:{ labels:["Jan","Feb","Mar","Apr","May","Jun"], datasets:[{ label:"Gap Closure %", data:[20,35,48,62,75,85], fill:true, borderColor:"#7e22ce", backgroundColor:"rgba(126,34,206,.12)"}]},
          options:{ responsive:true, maintainAspectRatio:false }
        });
      }
      if (matRef.current && !charts.current.maturity) {
        charts.current.maturity = new Chart(matRef.current, {
          type:"radar",
          data:{ labels:["Compliance","Risk","Governance","Process","Technology","Culture"],
            datasets:[{ label:"Current", data:[65,70,80,60,75,55], borderColor:"#ef4444", backgroundColor:"rgba(239,68,68,.1)"},
                      { label:"Target",  data:[90,90,95,85,90,85], borderColor:"#10b981", backgroundColor:"rgba(16,185,129,.1)"}]},
          options:{ responsive:true, maintainAspectRatio:false }
        });
      }
    };

    if (active === "dashboard") initDashboardCharts();
    if (active === "gap")       initGapCharts();
  },[active]);

  async function pay(plan:string) {
    const res = await fetch("/api/payments/checkout", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ plan })
    });
    const { url, error } = await res.json();
    if (url) window.location.href = url; else alert(error || "Payment not available");
  }

  async function askAI(q?:string) {
    const res = await fetch("/api/ai/assess", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ question: q || "Where are my largest Scope 1 risks in platinum suppliers?" })
    });
    const { answer } = await res.json();
    alert(answer || "No answer");
  }

  return (
    <div style={theme.page}>
      {/* NAVBAR */}
      <header style={{ position:"sticky", top:0, zIndex:50, padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,.12)",
        background:"rgba(15,23,42,.4)", backdropFilter:"blur(8px)" }}>
        <div style={{...theme.container, display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ fontSize:20 }}>🚀</div>
            <div style={{ fontWeight:900, letterSpacing:.3 }}>IntelliMat ESG Navigator</div>
          </div>
          <nav style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {[
              ["dashboard","Dashboard","📊"],
              ["registration","Registration","📝"],
              ["training","Training","🎓"],
              ["csm","CSM","🤝"],
              ["pricing","Pricing","💳"],
              ["gap","Gap Analysis","📐"],
            ].map(([id,label,emoji])=>(
              <button
                key={id}
                onClick={()=>setActive(id as Tab)}
                style={theme.navBtn(active===id)}
                aria-pressed={active===id}
              >
                <span style={{ marginRight:6 }}>{emoji}</span>{label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* BODY */}
      <main style={theme.container}>
        {/* DASHBOARD */}
        {active==="dashboard" && (
          <section style={{ display:"grid", gap:16 }}>
            <div>
              <h1 style={theme.h1}>ESG Performance Dashboard</h1>
              <div style={theme.sub}>Live updates via SSE · Anthropic insights on demand</div>
            </div>

            <div style={{...theme.grid("repeat(4,1fr)"), gap:12}}>
              <MetricCard label="ESG Score" value={metrics.esgScore.toFixed(1)} />
              <MetricCard label="Suppliers" value={metrics.suppliers} />
              <MetricCard label="Risk Alerts" value={metrics.riskAlerts} />
              <MetricCard label="Compliance Rate" value={`${metrics.complianceRate.toFixed(1)}%`} />
            </div>

            <div style={theme.grid("2fr 1fr")}>
              <div style={{...theme.card, minHeight:320}}>
                <div style={{ fontWeight:800, marginBottom:8 }}>Performance Metrics</div>
                <div style={{ height:300 }}><canvas ref={perfRef} height={300}/></div>
              </div>
              <div style={{...theme.card, minHeight:320}}>
                <div style={{ fontWeight:800, marginBottom:8 }}>Risk Distribution</div>
                <div style={{ height:300 }}><canvas ref={riskRef} height={300}/></div>
              </div>
            </div>

            <div style={theme.grid("1fr 1fr")}>
              <div style={{...theme.card}}>
                <div style={{ fontWeight:800, marginBottom:8 }}>Compliance Trends</div>
                <div style={{ height:220 }}><canvas ref={compRef} height={200}/></div>
              </div>
              <div style={{...theme.card}}>
                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={()=>askAI()} style={theme.btn("#38bdf8")}>Ask Anthropic</button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* REGISTRATION */}
        {active==="registration" && (
          <section style={{ display:"grid", gap:16 }}>
            <h1 style={theme.h1}>Client Registration</h1>
            <RegistrationCard />
          </section>
        )}

        {/* TRAINING (general) */}
        {active==="training" && (
          <section style={{ display:"grid", gap:16 }}>
            <h1 style={theme.h1}>ESG Training Academy</h1>
            <div style={theme.grid("repeat(3,1fr)")}>
              <ModuleCard title="ESG Fundamentals" icon="📚" duration="2h" progress={0.65} blurb="Intro to E, S & G principles." />
              <ModuleCard title="Compliance Management" icon="⚖️" duration="3h" progress={0.3} blurb="Frameworks & regulatory mapping." />
              <ModuleCard title="Risk Assessment" icon="🛡️" duration="2.5h" progress={0.0} blurb="Identify & mitigate ESG risks." />
              <ModuleCard title="Gap Analysis Methodology" icon="📊" duration="4h" progress={0.45} blurb="Systematic gap identification & closure." />
              <ModuleCard title="ESG Reporting" icon="📈" duration="3h" progress={0.8} blurb="GRI / SASB / TCFD / ISSB reporting." />
              <ModuleCard title="Certification Prep" icon="🏆" duration="5h" progress={0.2} blurb="Get ready for certification." />
            </div>
          </section>
        )}

        {/* CSM (dedicated main tab) */}
        {active==="csm" && (
          <section style={{ display:"grid", gap:16 }}>
            <h1 style={theme.h1}>Training — Customer Success Management (CSM)</h1>
            <div style={theme.sub}>Purpose-built tracks to drive adoption, ROI, and retention.</div>
            <div style={theme.grid("repeat(3,1fr)")}>
              <ModuleCard title="Onboarding Excellence" icon="🚀" duration="2h" progress={0.6} blurb="90-day success plans, kickoff best practices." />
              <ModuleCard title="Health Scoring" icon="❤️" duration="1.5h" progress={0.35} blurb="Signals, telemetry, risk flags & playbooks." />
              <ModuleCard title="QBRs & Exec Storytelling" icon="📣" duration="2h" progress={0.15} blurb="Value narratives, outcomes, roadmaps." />
              <ModuleCard title="NPS/CSAT & Feedback" icon="🗳️" duration="1h" progress={0.2} blurb="Survey design, bias, action loops." />
              <ModuleCard title="Escalations & Churn Rescue" icon="🧯" duration="1.5h" progress={0.1} blurb="SEV response, red-account recovery." />
              <ModuleCard title="Expansion & Advocacy" icon="🌱" duration="1.5h" progress={0.05} blurb="Land-and-expand, references, community." />
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>askAI("Draft a 60-day CSM success plan for a platinum-belt supplier, aligned to ISSB S2 risk themes.")} style={theme.btn("#7e22ce")}>
                Generate CSM Plan with Anthropic
              </button>
            </div>
          </section>
        )}

        {/* PRICING */}
        {active==="pricing" && (
          <section style={{ display:"grid", gap:16 }}>
            <h1 style={theme.h1}>Pricing & Payment</h1>
            <div style={theme.grid("repeat(3,1fr)")}>
              <PriceCard title="Starter" price="R 999 / mo" features={["Basic ESG Dashboard","Up to 50 Suppliers","Monthly Reports","Email Support","1 User"]} action={()=>pay("starter")} tone="#7e22ce" />
              <PriceCard title="Professional" highlight price="R 2,499 / mo" features={["Advanced Dashboard","Up to 500 Suppliers","Realtime Analytics","Priority Support","10 Users","Custom Reports","API Access"]} action={()=>pay("professional")} tone="#10b981" />
              <PriceCard title="Enterprise" price="Custom" features={["Full Platform","Unlimited Suppliers","Integrations","Dedicated Support","Unlimited Users","On-prem Option","Training Included"]} action={()=>alert("Sales will contact you")} tone="#f59e0b" />
            </div>
          </section>
        )}

        {/* GAP ANALYSIS */}
        {active==="gap" && (
          <section style={{ display:"grid", gap:16 }}>
            <h1 style={theme.h1}>Gap Analysis</h1>
            <div style={theme.grid("1fr 1fr")}>
              <div style={{...theme.card}}>
                <div style={{ fontWeight:800, marginBottom:8 }}>Gap Closure Progress</div>
                <div style={{ height:220 }}><canvas ref={gapRef} height={200}/></div>
              </div>
              <div style={{...theme.card}}>
                <div style={{ fontWeight:800, marginBottom:8 }}>Maturity Assessment</div>
                <div style={{ height:220 }}><canvas ref={matRef} height={200}/></div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

/* ==== UI PARTIALS ==== */
function MetricCard({label, value}:{label:string; value:string|number}) {
  return (
    <div style={{ background:"rgba(255,255,255,.06)", padding:16, borderRadius:14, border:"1px solid rgba(255,255,255,.12)", textAlign:"center" }}>
      <div style={{ fontSize:28, fontWeight:800 }}>{value}</div>
      <div style={{ opacity:.85 }}>{label}</div>
    </div>
  );
}

function ModuleCard({ title, icon, duration, progress, blurb }:{
  title:string; icon:string; duration:string; progress:number; blurb:string;
}) {
  return (
    <div style={{ background:"rgba(255,255,255,.06)", padding:16, borderRadius:14, border:"1px solid rgba(255,255,255,.12)" }}>
      <div style={{ fontSize:24, marginBottom:6 }}>{icon} <strong>{title}</strong></div>
      <div style={{ opacity:.8, fontSize:13, marginBottom:10 }}>⏱ {duration}</div>
      <div style={{ fontSize:14, opacity:.95, marginBottom:12 }}>{blurb}</div>
      <div style={{ height:6, background:"rgba(255,255,255,.18)", borderRadius:6, overflow:"hidden" }}>
        <div style={{ width:`${Math.round(progress*100)}%`, height:"100%", background:"linear-gradient(90deg,#7e22ce,#2a5298)" }}/>
      </div>
    </div>
  );
}

function PriceCard({ title, price, features, action, highlight, tone }:{
  title:string; price:string; features:string[]; action:()=>void; highlight?:boolean; tone:string;
}) {
  return (
    <div style={{
      background: highlight ? "rgba(126,34,206,.12)" : "rgba(255,255,255,.06)",
      padding:20, borderRadius:16, border:`2px solid ${highlight?"#7e22ce":"rgba(255,255,255,.12)"}`
    }}>
      <div style={{ fontSize:18, fontWeight:800 }}>{title}</div>
      <div style={{ fontSize:28, fontWeight:900, margin:"10px 0" }}>{price}</div>
      <ul style={{ listStyle:"none", padding:0, margin:0 }}>
        {features.map((f,i)=>(
          <li key={i} style={{ padding:"6px 0", borderTop:i? "1px solid rgba(255,255,255,.12)":"none" }}>✓ {f}</li>
        ))}
      </ul>
      <div style={{ marginTop:14 }}>
        <button onClick={action} style={{
          background: tone, color:"#fff", border:"none", borderRadius:12, padding:"10px 16px", fontWeight:800, cursor:"pointer"
        }}>Select</button>
      </div>
    </div>
  );
}

function RegistrationCard() {
  async function submit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form as HTMLFormElement) as any);
    const res = await fetch("/api/clients",{
      method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(data)
    });
    if (res.ok) { alert("Registration submitted!"); (form as any).reset(); } else { alert("Failed to submit"); }
  }

  const row = { display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12 };
  const input = { padding:"10px 12px", borderRadius:10, border:"1px solid rgba(255,255,255,.18)", background:"rgba(255,255,255,.06)", color:"#fff" };

  return (
    <div style={{ background:"rgba(255,255,255,.06)", padding:20, borderRadius:16, border:"1px solid rgba(255,255,255,.12)" }}>
      <form onSubmit={submit} style={{ display:"grid", gap:12 }}>
        <div style={row as any}>
          <input required name="org" placeholder="Organization Name" style={input as any}/>
          <select required name="industry" style={input as any}>
            <option value="">Select Industry</option>
            <option>Manufacturing</option><option>Technology</option><option>Financial Services</option>
            <option>Healthcare</option><option>Energy</option><option>Retail</option>
          </select>
        </div>
        <div style={row as any}>
          <input required name="contact" placeholder="Contact Name" style={input as any}/>
          <input required name="email" type="email" placeholder="Email" style={input as any}/>
        </div>
        <div style={row as any}>
          <input required name="phone" placeholder="Phone" style={input as any}/>
          <input required name="country" placeholder="Country" style={input as any}/>
        </div>
        <div style={row as any}>
          <select required name="employees" style={input as any}>
            <option value="">Employees</option>
            <option>1-50</option><option>51-200</option><option>201-500</option><option>501-1000</option><option>1000+</option>
          </select>
          <select required name="revenue" style={input as any}>
            <option value="">Annual Revenue</option>
            <option>&lt; $1M</option><option>$1M-$10M</option><option>$10M-$50M</option>
            <option>$50M-$100M</option><option>$100M+</option>
          </select>
        </div>
        <textarea name="requirements" placeholder="Describe your ESG and compliance needs..." rows={4}
          style={{...input as any, resize:"vertical"}} />
        <div>
          <button type="submit" style={{
            background:"linear-gradient(135deg,#7e22ce,#2a5298)", border:"none", color:"#fff",
            borderRadius:12, padding:"10px 18px", fontWeight:800, cursor:"pointer"
          }}>Register Organization</button>
        </div>
      </form>
    </div>
  );
}/* PATCH START: inject Suppliers/Analytics/Invoices usage */
import dynamic from "next/dynamic";
const Suppliers = dynamic(()=>import("./components/Suppliers"),{ ssr:false });
const Analytics = dynamic(()=>import("./components/Analytics"),{ ssr:false });
const Invoices  = dynamic(()=>import("./components/Invoices"),{ ssr:false });
/* PATCH END */
