"use client";
import { useEffect, useState } from "react";
export default function Suppliers({ org, theme }:{ org:string; theme:any }){
  const [items,setItems]=useState<any[]>([]); const [name,setName]=useState(""); const [email,setEmail]=useState("");
  async function load(){ if(!org) return; const r=await fetch(`/api/suppliers?org=${encodeURIComponent(org)}`); const d=await r.json(); setItems(d.items||[]); }
  async function invite(){ if(!org||!name) return alert("Enter name"); await fetch("/api/suppliers",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ org, name, email }) }); setName(""); setEmail(""); load(); }
  useEffect(()=>{ load(); },[org]);
  return (<section style={{ display:"grid", gap:16 }}>
    <h1 style={{ fontSize:32, fontWeight:900 }}>Suppliers</h1>
    <div style={{ ...theme.card }}>
      <div style={{ display:"grid", gridTemplateColumns:"2fr 2fr auto", gap:12 }}>
        <input placeholder="Supplier name" value={name} onChange={e=>setName(e.target.value)} style={{ padding:10, borderRadius:10, border:"1px solid rgba(212,175,55,.22)", background:"rgba(255,255,255,.06)", color:"#fff" }}/>
        <input placeholder="Email (optional)" value={email} onChange={e=>setEmail(e.target.value)} style={{ padding:10, borderRadius:10, border:"1px solid rgba(212,175,55,.22)", background:"rgba(255,255,255,.06)", color:"#fff" }}/>
        <button onClick={invite} style={{ background:"#D4AF37", color:"#0b0b0c", border:"none", borderRadius:12, padding:"10px 16px", fontWeight:900, cursor:"pointer" }}>Invite</button>
      </div>
    </div>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
      {items.map((s:any)=>(
        <div key={s.id} style={{ ...theme.card }}>
          <div style={{ fontWeight:900 }}>{s.name}</div>
          <div style={{ opacity:.8, fontSize:12 }}>{s.email||"—"}</div>
          <div style={{ marginTop:8 }}>Avg Score: <strong>{s.avg_score}</strong> · Risk: <strong>{s.risk_level}</strong></div>
        </div>
      ))}
    </div>
  </section>);
}