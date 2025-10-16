import dynamic from "next/dynamic";
const SupplierCard = dynamic(()=>import("../components/SupplierCard"),{ssr:true});
export default function Home({ data=[] as any[] }:{ data?: any[] }){
  return (
    <div className="container-narrow py-8 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight">ESG Navigator</h1>
        <p className="mt-3 text-gray-600">Real-time ESG monitoring and AI insights.</p>
        <a href="/dashboard" className="inline-block mt-6 rounded-xl bg-gray-900 text-white px-5 py-2.5">View Dashboard</a>
      </header>
      <section>
        <h2 className="text-xl font-semibold">Suppliers</h2>
        {data.length>0 ? (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.map((s:any)=><SupplierCard key={s.name} {...s} />)}
          </div>
        ) : (
          <div className="mt-4 card"><div className="card-body text-sm text-gray-600">No suppliers yet or API offline.</div></div>
        )}
      </section>
    </div>
  );
}
export async function getServerSideProps(){
  try{
    const r = await fetch("http://localhost:3000/api/proxy/api/suppliers",{cache:"no-store"});
    if(!r.ok){ return { props: { data: [] } } }
    const data = await r.json();
    return { props: { data } };
  }catch{ return { props: { data: [] } } }
}