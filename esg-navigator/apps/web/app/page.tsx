import SupplierCard from "../components/SupplierCard";
export const dynamic = "force-dynamic";
async function getSuppliers(){
  try{ const r = await fetch("/api/proxy/api/suppliers",{ cache:"no-store" }); if(!r.ok) return []; return await r.json(); }
  catch{ return []; }
}
export default async function Home(){
  const data = await getSuppliers();
  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight">ESG Navigator</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400">Real-time ESG monitoring and AI insights.</p>
        <a href="/dashboard" className="inline-block mt-6 rounded-xl bg-gray-900 text-white px-5 py-2.5 dark:bg-white dark:text-gray-900">View Dashboard</a>
      </header>
      <section>
        <h2 className="text-xl font-semibold">Suppliers</h2>
        {data.length>0 ? (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.map((s:any)=><SupplierCard key={s.name} {...s} />)}
          </div>
        ) : (
          <div className="mt-4 card"><div className="card-body text-sm text-gray-600 dark:text-gray-400">No suppliers yet or API offline.</div></div>
        )}
      </section>
    </div>
  );
}