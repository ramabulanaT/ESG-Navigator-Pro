// apps/web/app/demo/components/DemoESGCard.tsx
import Link from "next/link";
import DemoScoreRing from "./DemoScoreRing";
import { toSlug } from "../../../lib/slug";

export type Risk = "LOW" | "MEDIUM" | "HIGH";
export interface Supplier { name: string; value: string; risk: Risk; score: number; tags?: string[] }

const tone: Record<Risk, string> = {
  LOW: "bg-green-100 text-green-800 dark:bg-green-200/20 dark:text-green-300",
  MEDIUM: "bg-amber-100 text-amber-800 dark:bg-amber-200/20 dark:text-amber-300",
  HIGH: "bg-red-100 text-red-800 dark:bg-red-200/20 dark:text-red-300",
};

export default function DemoESGCard(s: Supplier) {
  const href = `/suppliers/${toSlug(s.name)}`;
  return (
    <Link href={href} className="card hover:shadow-lg transition-shadow block">
      <div className="card-body">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold leading-tight">{s.name}</h3>
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Contract Value <span className="font-medium text-gray-900 dark:text-gray-100">{s.value}</span>
            </div>
          </div>
          <div className="text-right">
            <span className={`px-2 py-0.5 text-xs rounded-full ${tone[s.risk]}`}>{s.risk}</span>
            <div className="mt-2"><DemoScoreRing score={s.score} /></div>
          </div>
        </header>

        {s.tags?.length ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {s.tags.map(t => (
              <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {t}
              </span>
            ))}
          </div>
        ) : null}

        <ul className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
          <li className="text-gray-500 dark:text-gray-400">ESG Score</li><li className="text-right font-medium">{s.score}/100</li>
          <li className="text-gray-500 dark:text-gray-400">Risk Level</li><li className="text-right font-medium">{s.risk}</li>
        </ul>

        <div className="mt-5 flex justify-end">
          <span className="rounded-xl border px-3 py-2 text-sm">View details</span>
        </div>
      </div>
    </Link>
  );
}