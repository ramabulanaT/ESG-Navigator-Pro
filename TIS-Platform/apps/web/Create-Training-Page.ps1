
# Conservative Approach: Create ONE page to test
# Location: C:\Users\user\TIS-Platform\apps\web

$basePath = "C:\Users\user\TIS-Platform\apps\web"

Write-Host "🎯 Creating Training Page (Test Case)" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Gray

# ==============================================================================
# STEP 1: Create API Route for Training
# ==============================================================================

Write-Host "📡 Step 1: Creating API route /api/training..." -ForegroundColor Yellow

$apiTrainingPath = "$basePath\app\api\training"
if (!(Test-Path $apiTrainingPath)) {
    New-Item -ItemType Directory -Path $apiTrainingPath -Force | Out-Null
    Write-Host "   ✅ Created folder: app/api/training" -ForegroundColor Green
}

$apiRoute = @'
// API Route: /api/training
// Returns training courses data
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = {
      courses: [
        {
          id: 1,
          title: 'ESG Fundamentals',
          description: 'Introduction to Environmental, Social, and Governance principles',
          duration: '4 weeks',
          level: 'Beginner',
          enrolled: 234,
          rating: 4.8,
          modules: 12,
          status: 'active'
        },
        {
          id: 2,
          title: 'AI Governance & Ethics',
          description: 'Implementing responsible AI practices in your organization',
          duration: '6 weeks',
          level: 'Intermediate',
          enrolled: 156,
          rating: 4.9,
          modules: 15,
          status: 'active'
        },
        {
          id: 3,
          title: 'Supply Chain Risk Management',
          description: 'Advanced strategies for supplier risk assessment',
          duration: '8 weeks',
          level: 'Advanced',
          enrolled: 89,
          rating: 4.7,
          modules: 18,
          status: 'active'
        }
      ],
      userProgress: {
        completedCourses: 2,
        inProgress: 1,
        totalHours: 45,
        certificates: 2
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch training data' },
      { status: 500 }
    );
  }
}
'@

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText("$apiTrainingPath\route.ts", $apiRoute, $utf8NoBom)
Write-Host "   ✅ Created: app/api/training/route.ts" -ForegroundColor Green

# ==============================================================================
# STEP 2: Create Training Page
# ==============================================================================

Write-Host "`n📄 Step 2: Creating Training page..." -ForegroundColor Yellow

$trainingPagePath = "$basePath\app\training"
if (!(Test-Path $trainingPagePath)) {
    New-Item -ItemType Directory -Path $trainingPagePath -Force | Out-Null
    Write-Host "   ✅ Created folder: app/training" -ForegroundColor Green
}

$trainingPage = @'
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TrainingPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/training')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#64748b' }}>Loading training courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#ef4444' }}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '32px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Back Button */}
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

        {/* Page Header */}
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 700, 
          color: '#1e3c72', 
          marginBottom: '32px' 
        }}>
          Training Programs
        </h1>

        {/* Course Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {data?.courses?.map(course => (
            <div key={course.id} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ 
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
              </div>

              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 600, 
                marginBottom: '8px',
                color: '#1e3c72'
              }}>
                {course.title}
              </h3>

              <p style={{ 
                color: '#64748b', 
                fontSize: '14px',
                marginBottom: '16px'
              }}>
                {course.description}
              </p>

              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                fontSize: '14px', 
                color: '#64748b',
                marginBottom: '16px'
              }}>
                <div>📅 {course.duration}</div>
                <div>👥 {course.enrolled} enrolled</div>
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
                fontWeight: 600,
                fontSize: '14px'
              }}>
                Enroll Now
              </button>
            </div>
          ))}
        </div>

        {/* User Progress */}
        {data?.userProgress && (
          <div style={{ 
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>
              Your Progress
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '16px' 
            }}>
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
'@

[System.IO.File]::WriteAllText("$trainingPagePath\page.tsx", $trainingPage, $utf8NoBom)
Write-Host "   ✅ Created: app/training/page.tsx" -ForegroundColor Green

# ==============================================================================
# STEP 3: Test Instructions
# ==============================================================================

Write-Host @"

╔════════════════════════════════════════════════════════════════╗
║  ✅ TRAINING PAGE CREATED                                      ║
╚════════════════════════════════════════════════════════════════╝

📋 What Was Created:
  ✅ app/api/training/route.ts (API endpoint)
  ✅ app/training/page.tsx (Page component)

🧪 Test It Now:

1. Start your dev server:
   cd C:\Users\user\TIS-Platform\apps\web
   npm run dev

2. Open in browser:
   http://localhost:3000/training

3. Check if it works:
   ✓ Page loads
   ✓ Shows 3 courses
   ✓ Shows user progress stats
   ✓ No errors in console (F12)

4. Test the API directly:
   http://localhost:3000/api/training

📊 If It Works:
Tell me "Training page works!" and we'll create the other 4 pages
using the SAME pattern (one at a time).

❌ If It Doesn't Work:
Tell me the error message and we'll fix it before proceeding.

"@ -ForegroundColor Green