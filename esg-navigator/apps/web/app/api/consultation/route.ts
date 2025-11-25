import { NextRequest, NextResponse } from 'next/server'

interface ConsultationRequest {
  name: string
  email: string
  company: string
  phone?: string
  preferredDate?: string
  message?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ConsultationRequest = await request.json()
    const { name, email, company, phone, preferredDate, message } = body

    // Validate required fields
    if (!name || !email || !company) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, company' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Log the consultation request (in production, save to database)
    const consultationData = {
      name,
      email,
      company,
      phone: phone || 'Not provided',
      preferredDate: preferredDate || 'Not specified',
      message: message || 'No message',
      submittedAt: new Date().toISOString(),
      status: 'pending'
    }

    console.log('New consultation request:', consultationData)

    // Send confirmation email to the internal team
    try {
      await fetch(new URL('/api/emails/send', request.url).toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'contact@tisholdings.com',
          subject: `New Consultation Request from ${name} - ${company}`,
          template: 'consultation-request',
          data: {
            name,
            email,
            company,
            phone: phone || 'Not provided',
            preferredDate: preferredDate || 'Not specified',
            message: message || 'No message',
            platformUrl: request.headers.get('origin') || 'https://esg-navigator-pro.pages.dev'
          }
        }),
      })
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError)
      // Don't fail the request if email fails
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 300))

    return NextResponse.json({
      success: true,
      message: 'Consultation request received successfully',
      consultation: {
        id: `CONSULT-${Date.now()}`,
        name,
        email,
        company,
        preferredDate: preferredDate || null,
        submittedAt: consultationData.submittedAt,
        status: 'pending'
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Consultation API error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
        details: 'Failed to process consultation request'
      },
      { status: 500 }
    )
  }
}

// GET endpoint to check API status
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'consultation',
    message: 'Consultation API is active'
  })
}
