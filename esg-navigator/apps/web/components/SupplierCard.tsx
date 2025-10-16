export type Risk = "LOW" | "MEDIUM" | "HIGH";
export interface Supplier { name: string; value: string; risk: Risk; score: number; }
const riskColor: Record<Risk, string> = {
  LOW: "bg-green-100 text-green-800 dark:bg-green-200/20 dark:text-green-300",
  MEDIUM: "bg-amber-100 text-amber-800 dark:bg-amber-200/20 dark:text-amber-300",
  HIGH: "bg-red-100 text-red-800 dark:bg-red-200/20 dark:text-red-300",
};
export default function SupplierCard(s: Supplier) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold">{s.name}</h3>
          <span className={`px-2 py-0.5 text-xs rounded-full ${riskColor[s.risk]}`}>{s.risk}</span>
        </div>
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">Contract Value</div>
        <div className="text-lg font-medium">{s.value}</div>
        <div className="mt-3">
          <div className="text-xs text-gray-500 dark:text-gray-400">ESG Score</div>
          <div className="mt-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800">
            <div className="h-2 rounded-full bg-gray-900 dark:bg-white" style={{ width: `${s.score}%` }} />
          </div>
          <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">{s.score}/100</div>
        </div>
      </div>
    </div>
  );
}