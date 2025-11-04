"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [metrics, setMetrics] = useState({
    esgScore: 0,
    assessments: 0,
    training: 0,
    certificates: 0
  });

  useEffect(() => {
    setTimeout(() => {
      setMetrics({
        esgScore: 87.5,
        assessments: 12,
        training: 68,
        certificates: 5
      });
    }, 500);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '32px'
    }}>
      {/* Header with Back Button */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', marginBottom: '32px' }}>
        <button
          onClick={() => router.push('/')}
          style={{
            padding: '10px 20px',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            marginBottom: '16px'
          }}
        >
          ← Back to Home
        </button>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 700,
          color: '#1e3c72',
          marginBottom: '8px'
        }}>
          Welcome back, Dr. Ramabulana
        </h1>
        <p style={{ fontSize: '16px', color: '#64748b' }}>
          Here's your ESG performance overview
        </p>
      </div>

      {/* Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* ESG Score */}
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          padding: '24px',
          borderRadius: '16px',
          color: 'white',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
            Overall ESG Score
          </div>
          <div style={{ fontSize: '48px', fontWeight: 700, marginBottom: '8px' }}>
            {metrics.esgScore.toFixed(1)}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>
            🎯 +5.2% from last quarter
          </div>
        </div>

        {/* Assessments */}
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
            Assessments Completed
          </div>
          <div style={{ fontSize: '48px', fontWeight: 700, color: '#10b981', marginBottom: '8px' }}>
            {metrics.assessments}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            ✅ All systems compliant
          </div>
        </div>

        {/* Training */}
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
            Training Progress
          </div>
          <div style={{ fontSize: '48px', fontWeight: 700, color: '#8b5cf6', marginBottom: '8px' }}>
            {metrics.training}%
          </div>
          <div style={{
            height: '6px',
            background: '#e5e7eb',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${metrics.training}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)',
              transition: 'width 1s ease'
            }} />
          </div>
        </div>

        {/* Certificates */}
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
            Certificates Earned
          </div>
          <div style={{ fontSize: '48px', fontWeight: 700, color: '#f59e0b', marginBottom: '8px' }}>
            {metrics.certificates}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            🏆 Latest: ISO 50001
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ maxWidth: '1400px', margin: '32px auto' }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          color: '#1e3c72',
          marginBottom: '16px'
        }}>
          Quick Actions
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px'
        }}>
          <button
            onClick={() => router.push('/analytics')}
            style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}
          >
            📊 View Analytics
          </button>
          <button
            onClick={() => router.push('/assessments')}
            style={{
              padding: '20px',
              background: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              color: '#1e3c72',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            📝 Start Assessment
          </button>
          <button
            onClick={() => router.push('/training')}
            style={{
              padding: '20px',
              background: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              color: '#1e3c72',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            📚 Browse Training
          </button>
          <button
            onClick={() => router.push('/reports')}
            style={{
              padding: '20px',
              background: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              color: '#1e3c72',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            📄 Generate Report
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'white',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#1e3c72',
          marginBottom: '16px'
        }}>
          Recent Activity
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            padding: '16px',
            background: '#f8fafc',
            borderRadius: '8px',
            borderLeft: '4px solid #10b981'
          }}>
            <div style={{ fontWeight: 500, color: '#1e3c72', marginBottom: '4px' }}>
              ✅ Completed ESG Assessment
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              2 hours ago
            </div>
          </div>
          <div style={{
            padding: '16px',
            background: '#f8fafc',
            borderRadius: '8px',
            borderLeft: '4px solid #3b82f6'
          }}>
            <div style={{ fontWeight: 500, color: '#1e3c72', marginBottom: '4px' }}>
              📖 Started AI & ML Course
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              1 day ago
            </div>
          </div>
          <div style={{
            padding: '16px',
            background: '#f8fafc',
            borderRadius: '8px',
            borderLeft: '4px solid #f59e0b'
          }}>
            <div style={{ fontWeight: 500, color: '#1e3c72', marginBottom: '4px' }}>
              🏆 Earned ISO 50001 Certificate
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              3 days ago
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
