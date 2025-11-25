// apps/web/app/demo/page.tsx
import DemoFilters from "./components/DemoFilters";

export const dynamic = "force-dynamic";

export default function DemoLanding() {
  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-white">
        <div className="relative px-6 py-16 md:px-12">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">ESG Navigator - Live Demo</h1>
          <p className="mt-4 text-white/80 max-w-2xl">
            Real-time ESG monitoring, AI insights, and proactive supplier risk management.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/dashboard" className="rounded-xl bg-white text-gray-900 px-5 py-2.5">View Dashboard</a>
            <a href="/login" className="rounded-xl border border-white/30 px-5 py-2.5">Login</a>
          </div>
        </div>
      </section>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Suppliers</h2>
          <a href="/dashboard" className="text-sm underline underline-offset-2">Open dashboard</a>
        </div>
        <div className="mt-4">
          <DemoFilters />
        </div>
      </div>
    </div>
  );
}