// apps/web/app/suppliers/[slug]/page.tsx
import DemoScoreRing from "../../demo/components/DemoScoreRing";
import { toSlug } from "../../../lib/slug";

export const dynamic = "force-dynamic";

async function getSuppliers() {
  try {
    const r = await fetch("/api/app-suppliers", { cache: "no-store" });
    if (!r.ok) return [];
    return await r.json();
  } catch { return []; }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const all = await getSuppliers();
  const s = all.find((x: any) => toSlug(x.name) === params.slug);
  if (!s) return <div className="card"><div className="card-body">Supplier not found.</div></div>;
  return (
    <div className="space-y-6">
      <a href="/demo" className="text-sm underline underline-offset-2">← Back to demo</a>
      <div className="card"><div className="card-body">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-semibold">{s.name}</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Contract Value: <span className="font-medium">{s.value}</span></p>
            <p className="text-gray-600 dark:text-gray-400">Risk: <span className="font-medium">{s.risk}</span></p>
            <p className="text-gray-600 dark:text-gray-400">ESG Score: <span className="font-medium">{s.score}/100</span></p>
            {s.tags?.length ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.tags.map((t:string)=>(
                  <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">{t}</span>
                ))}
              </div>
            ) : null}
          </div>
          <DemoScoreRing score={s.score} size={80} />
        </div>
      </div></div>
    </div>
  );
}