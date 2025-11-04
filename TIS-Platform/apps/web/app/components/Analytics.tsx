"use client";
export default function Analytics({ org, theme }:{ org:string; theme:any }){
  async function dl(){ const r=await fetch(`/api/analytics/boardpack?org=${encodeURIComponent(org)}`); const b=await r.blob(); const a=document.createElement("a"); a.href=URL.createObjectURL(b); a.download=`${org}-Board-Pack.pdf`; a.click(); }
  return (<section style={{ display:"grid", gap:16 }}>
    <h1 style={{ fontSize:32, fontWeight:900 }}>Analytics — Board Pack</h1>
    <div style={{ ...theme.card }}>
      <div>Generate an executive-ready, branded PDF with KPIs, gaps, risks, and recommendations.</div>
      <div style={{ marginTop:12 }}><button onClick={dl} style={{ background:"#D4AF37", color:"#0b0b0c", border:"none", borderRadius:12, padding:"10px 16px", fontWeight:900, cursor:"pointer" }}>Download Board Pack</button></div>
    </div>
  </section>);
}