"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TrainingPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/training')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '32px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Link href="/dashboard" style={{
          display: 'inline-block',
          padding: '10px 20px',
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          textDecoration: 'none',
          color: '#1e3c72',
          marginBottom: '24px'
        }}>
          ← Back to Dashboard
        </Link>

        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#1e3c72', marginBottom: '32px' }}>
          Training Programs
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          {data?.courses?.map((course: any) => (
            <div key={course.id} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <span style={{
                display: 'inline-block',
                padding: '4px 12px',
                background: '#e0f2fe',
                color: '#0369a1',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600,
                marginBottom: '12px'
              }}>
                {course.level}
              </span>

              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                {course.title}
              </h3>

              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
                {course.description}
              </p>

              <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                <div>📅 {course.duration}</div>
                <div>👥 {course.enrolled}</div>
                <div>⭐ {course.rating}</div>
              </div>

              <button style={{
                width: '100%',
                padding: '12px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600
              }}>
                Enroll Now
              </button>
            </div>
          ))}
        </div>

        {data?.userProgress && (
          <div style={{ marginTop: '40px', background: 'white', padding: '24px', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Your Progress</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#3b82f6' }}>
                  {data.userProgress.completedCourses}
                </div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Completed</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#f59e0b' }}>
                  {data.userProgress.inProgress}
                </div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>In Progress</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#10b981' }}>
                  {data.userProgress.totalHours}
                </div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Total Hours</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#8b5cf6' }}>
                  {data.userProgress.certificates}
                </div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Certificates</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}