'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setHealthData(data);
    } catch (error) {
      setHealthData({ error: 'Failed to fetch health data' });
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '1rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxWidth: '800px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333' }}>
          🚀 ESG Navigator
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '2rem' }}>
          AI-Powered ESG Governance & Supplier Risk Assessment Platform
        </p>

        {/* Interactive Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '2rem'
        }}>
          <button 
            onClick={checkHealth}
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              background: loading ? '#ccc' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              transition: 'all 0.3s'
            }}
          >
            {loading ? 'Checking...' : '🏥 Check API Health'}
          </button>
          
          <a 
            href="/api/health" 
            target="_blank"
            style={{
              padding: '0.75rem 1.5rem',
              background: '#764ba2',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              display: 'inline-block'
            }}
          >
            📡 View Raw API
          </a>
        </div>

        {/* Health Data Display */}
        {healthData && (
          <div style={{
            background: healthData.error ? '#fee' : '#efe',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            textAlign: 'left'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>
              {healthData.error ? '❌ Error' : '✅ System Status'}
            </h3>
            <pre style={{ 
              margin: 0, 
              fontSize: '0.875rem',
              overflow: 'auto',
              color: '#333'
            }}>
              {JSON.stringify(healthData, null, 2)}
            </pre>
          </div>
        )}

        {/* Feature List */}
        <div style={{ marginTop: '2rem', color: '#666', fontSize: '0.875rem' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
            Platform Features:
          </p>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            textAlign: 'left'
          }}>
            <div>✅ 7 AI Agents Active</div>
            <div>✅ Multi-Domain Architecture</div>
            <div>✅ Enterprise Security</div>
            <div>✅ Real-time Analytics</div>
            <div>✅ Supplier Risk Assessment</div>
            <div>✅ ESG Compliance Scoring</div>
          </div>
        </div>

        {/* Deployment Info */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#f8f9fa',
          borderRadius: '0.5rem',
          fontSize: '0.75rem',
          color: '#666'
        }}>
          <strong>🌐 Multi-Domain Setup:</strong><br/>
          <a href="https://www.esgnavigator.ai" style={{ color: '#667eea' }}>www.esgnavigator.ai</a> • 
          <a href="https://app.esgnavigator.ai" style={{ color: '#667eea' }}> app.esgnavigator.ai</a> • 
          <a href="https://api.esgnavigator.ai" style={{ color: '#667eea' }}> api.esgnavigator.ai</a>
        </div>
      </div>
    </div>
  );
}