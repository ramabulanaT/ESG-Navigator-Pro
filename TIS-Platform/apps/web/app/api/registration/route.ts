import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    packages: [
      {
        id: 1,
        name: 'Starter',
        price: 'R2,500/month',
        features: ['Up to 50 suppliers', 'Basic ESG scoring', 'Monthly reports', 'Email support']
      },
      {
        id: 2,
        name: 'Professional',
        price: 'R8,500/month',
        features: ['Up to 500 suppliers', 'Advanced AI analytics', 'Priority support'],
        popular: true
      },
      {
        id: 3,
        name: 'Enterprise',
        price: 'Custom pricing',
        features: ['Unlimited suppliers', 'Full AI capabilities', '24/7 support']
      }
    ]
  };
  return NextResponse.json(data);
}