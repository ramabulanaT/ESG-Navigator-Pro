export default function MetricsGrid({ metrics }: { metrics: any }) {
  const m = metrics ?? { coverageRate: 0, daysToInventory: 0, auditPrepTimeSaved: 0, activeAlerts: 0 }
  
  const box = (title: string, value: any) => (
    <div className='card'>
      <div style={{ fontSize: '28px', fontWeight: '700' }}>{value}</div>
      <div style={{ color: '#6b7280', marginTop: '6px' }}>{title}</div>
    </div>
  )
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
      {box('Coverage Rate', m.coverageRate + '%')}
      {box('Days to Inventory', m.daysToInventory)}
      {box('Audit Prep Saved', m.auditPrepTimeSaved + '%')}
      {box('Active Alerts', m.activeAlerts)}
    </div>
  )
}