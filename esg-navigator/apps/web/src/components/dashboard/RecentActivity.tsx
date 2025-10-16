export default function RecentActivity() {
  const items = [
    { time:'2m', text:'New supplier report ingested' },
    { time:'12m', text:'Scope 2 data synced' },
    { time:'1h', text:'IFRS S2 gap analysis run' },
  ]
  return (
    <div className='card'>
      <h3 style={{fontWeight:700,marginBottom:8}}>Recent Activity</h3>
      <ul style={{display:'grid',gap:8}}>
        {items.map((i,idx) => <li key={idx} style={{color:'#4b5563'}}><strong style={{color:'#111827'}}>{i.time}</strong> — {i.text}</li>)}
      </ul>
    </div>
  )
}
