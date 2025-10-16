import type { NextApiRequest, NextApiResponse } from "next";
const ORIGIN = process.env.API_BASE || process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5050";
const KEY = process.env.API_PROXY_KEY || process.env.PROXY_SHARED_SECRET;
const HOP = new Set(["connection","keep-alive","proxy-authenticate","proxy-authorization","te","trailer","transfer-encoding","upgrade"]);
export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const path = (req.query.path ?? []) as string[];
  if(!path.length){ res.status(400).send("Missing target path"); return; }
  const url = `${ORIGIN}/${path.join("/")}${req.url?.includes("?") ? req.url?.substring(req.url.indexOf("?")) : ""}`;
  const headers: Record<string,string> = {};
  for(const [k,v] of Object.entries(req.headers)){ const key=k.toLowerCase(); if(HOP.has(key) || key==="host") continue; if(Array.isArray(v)) headers[k]=v.join(", "); else if(v) headers[k]=v as string; }
  if(KEY) headers["x-proxy-key"]=KEY;
  const init: RequestInit = { method: req.method, headers, redirect:"manual" };
  if(req.method !== "GET" && req.method !== "HEAD"){
    const chunks: Buffer[] = [];
    await new Promise<void>((resolve)=>{ req.on("data",(c)=>chunks.push(Buffer.from(c))); req.on("end",()=>resolve()); });
    const buf = Buffer.concat(chunks); if(buf.length) init.body = buf as any;
  }
  const upstream = await fetch(url, init);
  upstream.headers.forEach((v,k)=>{ if(!HOP.has(k.toLowerCase())) res.setHeader(k,v); });
  res.status(upstream.status);
  const ab = await upstream.arrayBuffer();
  res.send(Buffer.from(ab));
}