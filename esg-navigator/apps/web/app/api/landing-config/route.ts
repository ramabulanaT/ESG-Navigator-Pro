import { NextResponse } from 'next/server'

export interface LandingPageConfig {
  hero: {
    badge: string
    heading: string
    description: string
    ctaButtons: {
      primary: { text: string; href: string }
      secondary: { text: string; action: string }
    }
  }
  stats: Array<{
    value: string
    label: string
  }>
  features: Array<{
    icon: string
    title: string
    description: string
  }>
  partnerships: string[]
  cta: {
    heading: string
    description: string
    buttons: {
      primary: { text: string; href: string }
      secondary: { text: string; action: string }
    }
  }
  footer: {
    brandName: string
    copyright: string
  }
}

const defaultConfig: LandingPageConfig = {
  hero: {
    badge: 'AI-Powered ESG-GRC Automation',
    heading: 'Enterprise Compliance, Automated by AI',
    description: "The world's first comprehensive AI-powered ESG-GRC automation platform. Trusted by enterprise organizations across multiple sectors. Powered by advanced AI, enterprise-grade cloud infrastructure, and institutional integrations.",
    ctaButtons: {
      primary: { text: 'Start Assessment', href: '/assessments' },
      secondary: { text: 'Schedule Demo', action: 'open-consultation' }
    }
  },
  stats: [
    { value: 'R331M+', label: 'Supply Chain Value' },
    { value: '87.2%', label: 'Compliance Rate' },
    { value: '142+', label: 'Assessment Questions' },
    { value: '6', label: 'Integrated Frameworks' }
  ],
  features: [
    {
      icon: 'Lightbulb',
      title: 'AI-Powered Intelligence',
      description: 'Advanced AI provides real-time compliance recommendations, gap analysis, and predictive insights across all ESG frameworks.'
    },
    {
      icon: 'Shield',
      title: 'Enterprise Security',
      description: 'ISO 27001 compliance, enterprise-grade cloud infrastructure, and bank-grade encryption for all sensitive data.'
    },
    {
      icon: 'Zap',
      title: 'Rapid Deployment',
      description: 'Go from assessment to actionable insights in days, not months. Automated workflows save 70% of audit time.'
    },
    {
      icon: 'BarChart3',
      title: 'Real-Time Analytics',
      description: 'Live compliance dashboards, KPI tracking, and performance metrics across ISO 14001, 45001, 50001, and GISTM.'
    },
    {
      icon: 'Users',
      title: 'Expert Training',
      description: '8-Domain Compliance Stewardship Model (CSM) with structured coaching framework and certification programs.'
    },
    {
      icon: 'Lock',
      title: 'Framework Coverage',
      description: 'ISO 50001, ISO 14001, ISO 45001, ISO 27001, GISTM, and JSE compliance in one integrated platform.'
    }
  ],
  partnerships: ['Advanced AI', 'Cloud Infrastructure', 'Enterprise Integration', 'Compliance Automation'],
  cta: {
    heading: 'Ready to Transform Your ESG Compliance?',
    description: 'Join organizations worldwide in automating compliance with AI-powered ESG-GRC automation',
    buttons: {
      primary: { text: 'Access Platform', href: '/assessments' },
      secondary: { text: 'Schedule Consultation', action: 'open-consultation' }
    }
  },
  footer: {
    brandName: 'TIS Holdings',
    copyright: '© 2025 TIS Holdings. All rights reserved. | ESG-GRC Automation Platform'
  }
}

export async function GET() {
  try {
    // In the future, this could fetch from a database or external configuration service
    // For now, return the default configuration
    return NextResponse.json({
      success: true,
      config: defaultConfig,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Landing config API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch landing page configuration' },
      { status: 500 }
    )
  }
}
