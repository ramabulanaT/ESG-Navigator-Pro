"use client";
import { useEffect, useState } from "react";
export default function Invoices({ org, theme }:{ org:string; theme:any }){
  const [items,setItems]=useState<any[]>([]); const [hours,setHours]=useState(10); const [rate,setRate]=useState(1750);
  async function load(){ if(!org) return; const r=await fetch(`/api/invoices?org=${encodeURIComponent(org)}`); const d=await r.json(); setItems(d.items||[]); }
  useEffect(()=>{ load(); },[org]);
  async function create(type:"subscription"|"consulting"){
    const payload:any = { org, type };
    if (type==="consulting"){ payload.hours=hours; payload.rate=rate; }
    const r=await fetch("/api/invoices/create",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(payload) });
    if(!r.ok){ alert("Invoice failed"); return }
    load(); alert("Invoice created in Zoho Books");
  }
  return (<section style={{ display:"grid", gap:16 }}>
    <h1 style={{ fontSize:32, fontWeight:900 }}>Invoices</h1>
    <div style={{ ...theme.card, display:"grid", gap:12 }}>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <button onClick={()=>create("subscription")} style={{ background:"#D4AF37", color:"#0b0b0c", border:"none", borderRadius:12, padding:"10px 16px", fontWeight:900, cursor:"pointer" }}>Create Subscription Invoice</button>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <input type="number" value={hours} onChange={e=>setHours(parseFloat(e.target.value))} style={{ width:90, padding:8, borderRadius:10, border:"1px solid rgba(212,175,55,.22)", background:"rgba(255,255,255,.06)", color:"#fff" }}/>
          <span>hours ×</span>
          <input type="number" value={rate} onChange={e=>setRate(parseFloat(e.target.value))} style={{ width:120, padding:8, borderRadius:10, border:"1px solid rgba(212,175,55,.22)", background:"rgba(255,255,255,.06)", color:"#fff" }}/>
          <span>rate</span>
          <button onClick={()=>create("consulting")} style={{ background:"#D4AF37", color:"#0b0b0c", border:"none", borderRadius:12, padding:"10px 16px", fontWeight:900, cursor:"pointer" }}>Create Consulting Invoice</button>
        </div>
      </div>
    </div>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16 }}>
      {items.map((i:any,idx:number)=>(
        <div key={idx} style={{ ...theme.card }}>
          <div><strong>{i.type.toUpperCase()}</strong> — {i.status}</div>
          <div style={{ opacity:.85, fontSize:13 }}>Amount: {i.amount} {i.currency}</div>
          {i.zoho_invoice_number ? <div>No: {i.zoho_invoice_number}</div> : null}
          {i.zoho_url ? <a href={i.zoho_url} target="_blank" style={{ color:"#D4AF37" }}>Open in Zoho</a> : null}
        </div>
      ))}
    </div>
  </section>);
}