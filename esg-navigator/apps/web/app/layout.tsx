import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ESG Navigator – AI-Powered ESG-GRC Automation',
  description: 'Enterprise-grade ESG-GRC platform powered by advanced AI, cloud infrastructure, and enterprise integrations.',
}

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
