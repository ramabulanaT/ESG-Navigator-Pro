import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ESG Navigator – AI-Powered ESG-GRC Automation',
  description: 'Enterprise-grade ESG-GRC platform powered by Anthropic Claude, AWS, IBM, and DRATA.',
}

// Force dynamic rendering and prevent caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
