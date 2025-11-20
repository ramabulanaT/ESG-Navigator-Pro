import { NextRequest, NextResponse } from 'next/server'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

interface AssessmentRequest {
  framework: string
  assessmentType: 'gap-analysis' | 'compliance-check' | 'recommendations'
  organizationContext?: string
}

const frameworkPrompts: Record<string, string> = {
  'iso-14001': `You are an ISO 14001 Environmental Management System expert. Provide a comprehensive assessment covering:
1. Current environmental management maturity level (1-5 scale)
2. Key compliance gaps identified
3. Specific ISO 14001 requirements not being met
4. Recommended actions (prioritized by impact and effort)
5. Timeline for implementation (in months)
Format as structured JSON with categories.`,
  
  'iso-45001': `You are an ISO 45001 Health & Safety Management System expert. Provide assessment covering:
1. Occupational health and safety maturity (1-5 scale)
2. Hazard identification gaps
3. Worker participation effectiveness
4. Incident prevention capabilities
5. Specific compliance recommendations
Format as structured JSON.`,
  
  'iso-50001': `You are an ISO 50001 Energy Management expert. Assess:
1. Energy management system maturity (1-5 scale)
2. Energy performance improvement opportunities
3. Current energy efficiency gaps
4. Cost savings potential (estimated %)
5. Implementation roadmap
Format as structured JSON with quantified metrics.`,
  
  'gistm': `You are a Global Industry Standard for Tailings Management (GISTM) expert. Provide:
1. Tailings management maturity assessment
2. Critical safety and environmental risks
3. Closure and decommissioning readiness
4. Stakeholder engagement effectiveness
5. Compliance with GISTM pillars (governance, design, construction, operation, closure)
Format as structured JSON.`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as AssessmentRequest
    const { framework, assessmentType, organizationContext } = body

    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    const prompt = frameworkPrompts[framework]
    if (!prompt) {
      return NextResponse.json(
        { error: `Unknown framework: ${framework}` },
        { status: 400 }
      )
    }

    const userPrompt = organizationContext 
      ? `Assess this organization for ${framework} compliance:\n\n${organizationContext}`
      : `Provide a general ${framework} assessment framework and key areas to evaluate.`

    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-1-20250805',
        max_tokens: 2000,
        system: prompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Anthropic API error:', error)
      return NextResponse.json(
        { error: 'Assessment generation failed' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const assessment = data.content?.[0]?.text || ''

    return NextResponse.json({
      success: true,
      framework,
      assessmentType,
      assessment,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Assessment API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}