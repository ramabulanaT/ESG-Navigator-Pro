// apps/web/app/demo/components/DemoScoreRing.tsx
export default function DemoScoreRing({ score, size = 56 }: { score: number; size?: number }) {
  const pct = Math.max(0, Math.min(100, score));
  const color = pct >= 85 ? "#16a34a" : pct >= 70 ? "#f59e0b" : "#dc2626";
  const style: React.CSSProperties = {
    width: size, height: size, borderRadius: "50%",
    background: `conic-gradient(${color} ${pct * 3.6}deg, rgba(0,0,0,.08) 0deg)`,
    display: "grid", placeItems: "center",
  };
  return <div style={style}><div className="text-xs font-semibold">{pct}/100</div></div>;
}