export default function AgentStatus() {
  const agents = [
    { name:'ESG Assessor', status:'ok' },
    { name:'Standards Mapper', status:'ok' },
    { name:'Emissions Accountant', status:'ok' },
    { name:'Assurance Copilot', status:'degraded' },
  ]
  const pill = (s:string) => {
    const map:any = { ok:'#dcfce7', degraded:'#fef9c3', down:'#fee2e2' }
    const txt:any = { ok:'#166534', degraded:'#854d0e', down:'#991b1b' }
    return <span style={{background:map[s],color:txt[s],padding:'2px 8px',borderRadius:999,fontSize:12,textTransform:'capitalize'}}>{s}</span>
  }
  return (
    <div>
      <ul style={{display:'grid',gap:12}}>
        {agents.map(a => (
          <li key={a.name} className='card' style={{display:'flex',justifyContent:'space-between'}}>
            <span style={{fontWeight:600}}>{a.name}</span>
            {pill(a.status)}
          </li>
        ))}
      </ul>
    </div>
  )
}
