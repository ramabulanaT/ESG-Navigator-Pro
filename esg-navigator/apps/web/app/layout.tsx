import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ESG Navigator Pro – Global Leader in AI-Powered ESG-GRC SaaS',
  description: 'The world\'s most advanced AI-powered ESG-GRC automation platform. Trusted by Fortune 500 companies and tier-1 enterprises globally. ISO 27001 certified, powered by Anthropic Claude, AWS, and enterprise-grade infrastructure.',
  keywords: 'ESG compliance, GRC automation, AI compliance, ISO 14001, ISO 45001, ISO 50001, GISTM, enterprise compliance, sustainability software, ESG SaaS',
  authors: [{ name: 'ESG Navigator Pro' }],
  openGraph: {
    title: 'ESG Navigator Pro – Global Leader in AI-Powered ESG-GRC',
    description: 'Transform your enterprise compliance with AI. Trusted globally.',
    type: 'website',
  },
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
