import { NextRequest, NextResponse } from 'next/server'

interface EmailRequest {
  to: string
  subject: string
  template: string
  data: Record<string, string>
}

// Simple email template renderer
const emailTemplates: Record<string, (data: Record<string, string>) => string> = {
  welcome: (data) => `
    <h1>Welcome to ESG Navigator</h1>
    <p>Hello ${data.userName},</p>
    <p>Welcome to TIS Holdings' ESG Navigator platform - the world's first comprehensive AI-powered ESG-GRC automation system.</p>
    <p><a href="${data.platformUrl}">Access your platform here</a></p>
    <p>Best regards,<br>TIS Holdings Team</p>
  `,
  'assessment-complete': (data) => `
    <h1>Assessment Complete</h1>
    <p>Hello ${data.userName},</p>
    <p>Your ${data.assessmentType} assessment has been completed with a score of ${data.score}.</p>
    <p><a href="${data.platformUrl}/assessments">View your results</a></p>
    <p>Best regards,<br>TIS Holdings Team</p>
  `,
  'default': (data) => `
    <h1>ESG Navigator Notification</h1>
    <p>Hello ${data.userName},</p>
    <p>This is a test notification from ESG Navigator.</p>
    <p><a href="${data.platformUrl}">Visit your platform</a></p>
    <p>Best regards,<br>TIS Holdings Team</p>
  `
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailRequest = await request.json()
    const { to, subject, template, data } = body

    // Validate input
    if (!to || !subject || !template) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, template' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Get template or use default
    const templateFn = emailTemplates[template] || emailTemplates['default']
    const htmlContent = templateFn(data)

    // For now, we'll simulate email sending
    // In production, you'd integrate with SendGrid, AWS SES, etc.
    
    // Log the email (in production, save to database)
    console.log('Email would be sent:', {
      to,
      subject,
      template,
      timestamp: new Date().toISOString()
    })

    // Simulate email service delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: `Email sent successfully to ${to}`,
      email: {
        to,
        subject,
        template,
        htmlContent: htmlContent.substring(0, 100) + '...',
        sentAt: new Date().toISOString()
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Email API error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        details: 'Failed to process email request'
      },
      { status: 500 }
    )
  }
}