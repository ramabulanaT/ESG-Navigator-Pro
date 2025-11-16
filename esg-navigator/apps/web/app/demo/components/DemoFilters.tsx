// apps/web/app/demo/components/DemoFilters.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

type Risk = "LOW" | "MEDIUM" | "HIGH";
interface Supplier { name: string; value: string; risk: Risk; score: number; tags?: string[] }

function parseValue(input: string): number {
  const s = (input || "").toString().trim().replace(/[, ]/g, "").replace(/^R/i, "").replace(/^\$/,"");
  const m = s.match(/^([0-9]*\.?[0-9]+)([kKmMbB])?$/);
  if (!m) { const n = parseFloat(s); return isNaN(n) ? 0 : n; }
  const num = parseFloat(m[1]); const suf = (m[2] || "").toUpperCase();
  const multi = suf === "K" ? 1e3 : suf === "M" ? 1e6 : suf === "B" ? 1e9 : 1;
  return num * multi;
}

const SORTS = [
  { key: "score-desc", label: "Score (High â†’ Low)" },
  { key: "score-asc",  label: "Score (Low â†’ High)" },
  { key: "value-desc", label: "Value (High â†’ Low)" },
  { key: "value-asc",  label: "Value (Low â†’ High)" }
] as const;
type SortKey = typeof SORTS[number]["key"];

export default function DemoFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

  const [query, setQuery] = useState("");
  const [risks, setRisks] = useState<Risk[]>([]);
  const [sort, setSort] = useState<SortKey>("score-desc");

  const [data, setData] = useState<Supplier[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = params?.get("q") || "";
    const r = (params?.get("risk") || "").split(",").map(x => x.trim().toUpperCase()).filter(x => x==="LOW"||x==="MEDIUM"||x==="HIGH") as Risk[];
    const s = (params?.get("sort") as SortKey) || "score-desc";
    setQuery(q);
    setRisks(r);
    setSort(SORTS.some(x=>x.key===s) ? s : "score-desc");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const sp = new URLSearchParams(params.toString());
    if (query) sp.set("q", query); else sp.delete("q");
    if (risks.length) sp.set("risk", risks.join(",")); else sp.delete("risk");
    if (sort && sort !== "score-desc") sp.set("sort", sort); else sp.delete("sort");
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [query, risks, sort]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/app-suppliers", { cache: "no-store" });
        const json = res.ok ? await res.json() : [];
        if (alive) setData(json);
      } catch { if (alive) setData([]); }
      finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  function toggleRisk(r: Risk) {
    setRisks(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);
  }
  function resetAll() { setQuery(""); setRisks([]); setSort("score-desc"); }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const arr = (data ?? []).filter((s) => {
      const qok = q === "" || s.name.toLowerCase().includes(q);
      const rok = risks.length === 0 || risks.includes(s.risk);
      return qok && rok;
    });
    switch (sort) {
      case "score-asc":  return arr.sort((a,b)=> a.score - b.score);
      case "value-desc": return arr.sort((a,b)=> parseValue(b.value) - parseValue(a.value));
      case "value-asc":  return arr.sort((a,b)=> parseValue(a.value) - parseValue(b.value));
      default:           return arr.sort((a,b)=> b.score - a.score);
    }
  }, [data, query, risks, sort]);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <input
          placeholder="Search suppliers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-64 max-w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2"
        />
        <div className="flex items-center gap-2">
          {(["LOW","MEDIUM","HIGH"] as Risk[]).map((r) => {
            const active = risks.includes(r);
            return (
              <button
                key={r}
                onClick={() => toggleRisk(r)}
                className={`px-3 py-1.5 rounded-full text-sm border ${active ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                type="button"
              >
                {r}
              </button>
            );
          })}
        </div>
        <select
          value={sort}
          onChange={(e)=> setSort(e.target.value as SortKey)}
          className="rounded-xl border px-3 py-1.5 text-sm"
          aria-label="Sort"
        >
          {SORTS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
        <div className="ml-auto flex items-center gap-3 text-sm">
          <span className="text-gray-600 dark:text-gray-400">{filtered.length} shown</span>
          <button onClick={resetAll} className="underline underline-offset-2" type="button">Reset</button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_,i)=>(
            <div key={i} className="card animate-pulse"><div className="card-body space-y-3">
              <div className="h-5 w-2/3 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-3 w-1/3 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded" />
            </div></div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((s) => {
            // @ts-ignore-next-line
            const Card = require("./DemoESGCard").default;
            return <Card key={s.name} {...s} />;
          })}
        </div>
      ) : (
        <div className="card"><div className="card-body text-sm text-gray-600 dark:text-gray-400">No results match your filters.</div></div>
      )}
    </section>
  );
}
