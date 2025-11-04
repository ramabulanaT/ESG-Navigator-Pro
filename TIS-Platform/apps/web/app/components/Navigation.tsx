"use client";
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navigation() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const navStyle = {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3c72 100%)',
    padding: '16px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 1000
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const logoStyle = {
    fontSize: '20px',
    fontWeight: 700,
    color: 'white',
    cursor: 'pointer'
  };

  const buttonStyle = {
    padding: '10px 20px',
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    marginLeft: '12px'
  };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <div onClick={() => router.push('/')} style={logoStyle}>
          🌿 TIS-IntelliMat ESG Navigator
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => router.push('/dashboard')} style={buttonStyle}>
            Dashboard
          </button>
          <button onClick={() => router.push('/')} style={buttonStyle}>
            API Metrics
          </button>
          <button onClick={() => router.push('/training')} style={buttonStyle}>
            Training
          </button>
        </div>
      </div>
    </nav>
  );
}