import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'ESG Navigator API',
    version: '1.0.0',
    platform: 'Vercel Edge',
    environment: process.env.NODE_ENV
  });
}