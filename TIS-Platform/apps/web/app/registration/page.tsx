"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function RegistrationPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/registration')
      .then(res => res.json())
      .then(data => { setData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{padding:'40px',textAlign:'center'}}>Loading...</div>;

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',padding:'32px'}}>
      <div style={{maxWidth:'1200px',margin:'0 auto'}}>
        <Link href="/dashboard" style={{display:'inline-block',padding:'10px 20px',background:'white',border:'1px solid #e5e7eb',borderRadius:'8px',textDecoration:'none',color:'#1e3c72',marginBottom:'24px'}}>
          ← Back
        </Link>
        <h1 style={{fontSize:'32px',fontWeight:700,color:'#1e3c72',marginBottom:'24px'}}>
          Registration
        </h1>
        <div style={{background:'white',borderRadius:'12px',padding:'24px',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
          {data ? (
            <pre>{JSON.stringify(data, null, 2)}</pre>
          ) : (
            <p>No registration data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
