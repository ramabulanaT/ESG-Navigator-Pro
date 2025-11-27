'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Shield, Zap, BarChart3, Users, Lock, Lightbulb, Globe2, Award, CheckCircle2, Star, TrendingUp, Building2 } from 'lucide-react'
import ConsultationModal from '@/components/ConsultationModal'

export default function Home() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-cyan-500/30">
              ESG
            </div>
            <div>
              <span className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">ESG Navigator Pro</span>
              <div className="text-xs text-gray-400">Global ESG-GRC SaaS Leader</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="hover:text-cyan-400 transition">Platform</a>
            <a href="#trust" className="hover:text-cyan-400 transition">Security</a>
            <a href="#clients" className="hover:text-cyan-400 transition">Clients</a>
            <a href="#contact" className="hover:text-cyan-400 transition">Contact</a>
          </div>
          <Link
            href="/assessments"
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition"
          >
            Launch Platform →
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded-full backdrop-blur-sm">
            <Globe2 className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 font-semibold">Global Leader in AI-Powered ESG-GRC SaaS</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Enterprise ESG-GRC,
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Powered by AI Intelligence
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            The world's most advanced AI-powered ESG-GRC automation platform. Trusted by Fortune 500 companies and tier-1 mining enterprises globally. ISO 27001 certified, powered by Anthropic Claude, AWS infrastructure, and enterprise-grade security.
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-12 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>ISO 27001 Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>SOC 2 Type II</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Enterprise SLA: 99.9%</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/assessments"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition inline-flex items-center gap-2 transform hover:scale-105"
            >
              Access Platform <ArrowRight className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsConsultationOpen(true)}
              className="px-8 py-4 border-2 border-cyan-500 text-cyan-400 rounded-lg font-bold text-lg hover:bg-cyan-500/10 transition transform hover:scale-105"
            >
              Book Enterprise Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur hover:bg-white/10 transition-all group">
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">$500M+</div>
              <div className="text-sm text-gray-400 mt-2">Supply Chain Value Monitored</div>
              <TrendingUp className="w-4 h-4 text-cyan-400 mt-2 opacity-0 group-hover:opacity-100 transition" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur hover:bg-white/10 transition-all group">
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">95.8%</div>
              <div className="text-sm text-gray-400 mt-2">Average Compliance Score</div>
              <Star className="w-4 h-4 text-cyan-400 mt-2 opacity-0 group-hover:opacity-100 transition" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur hover:bg-white/10 transition-all group">
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">50+</div>
              <div className="text-sm text-gray-400 mt-2">Enterprise Clients Globally</div>
              <Building2 className="w-4 h-4 text-cyan-400 mt-2 opacity-0 group-hover:opacity-100 transition" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur hover:bg-white/10 transition-all group">
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">8</div>
              <div className="text-sm text-gray-400 mt-2">Global Frameworks Covered</div>
              <Globe2 className="w-4 h-4 text-cyan-400 mt-2 opacity-0 group-hover:opacity-100 transition" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-black to-blue-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
              <span className="text-cyan-400 font-semibold text-sm">ENTERPRISE PLATFORM</span>
            </div>
            <h2 className="text-5xl font-bold mb-4">Why Global Enterprises Choose Us</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              The world's most comprehensive AI-driven ESG-GRC automation platform, purpose-built for Fortune 500 companies and tier-1 enterprises
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Lightbulb className="w-8 h-8" />,
                title: "Advanced AI Intelligence",
                description: "Powered by Anthropic Claude with real-time compliance recommendations, predictive gap analysis, risk assessment, and automated remediation workflows across all major ESG frameworks."
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Enterprise-Grade Security",
                description: "ISO 27001 & SOC 2 Type II certified, AWS enterprise infrastructure, end-to-end encryption, SSO/SAML integration, and comprehensive audit trails for maximum data protection."
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Rapid Enterprise Deployment",
                description: "White-glove onboarding with dedicated success team. Go from assessment to insights in days. Automated workflows reduce audit preparation time by 70%."
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Real-Time Intelligence Dashboards",
                description: "Executive-level analytics, live compliance scoring, KPI tracking, risk heat maps, and performance metrics with API integration for BI tools and data warehouses."
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Expert Enablement & Training",
                description: "8-Domain Compliance Stewardship Model (CSM) with structured coaching, certification programs, dedicated CSMs, and 24/7 enterprise support across global time zones."
              },
              {
                icon: <Lock className="w-8 h-8" />,
                title: "Complete Framework Coverage",
                description: "ISO 50001, ISO 14001, ISO 45001, ISO 27001, GISTM, JSE Listings Requirements, TCFD, GRI, SASB, and emerging global regulations in a single unified platform."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 hover:border-cyan-500/30 transition-all group">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <div className="text-cyan-400">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section id="trust" className="py-24 border-y border-white/10 bg-gradient-to-b from-blue-950/20 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
              <span className="text-cyan-400 font-semibold text-sm">ENTERPRISE TRUST & SECURITY</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Powered by Global Technology Leaders</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Built on world-class infrastructure with partnerships that ensure enterprise-grade reliability and security
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center mb-12">
            {[
              { name: 'Anthropic', desc: 'AI Technology Partner' },
              { name: 'AWS', desc: 'Cloud Infrastructure' },
              { name: 'IBM', desc: 'Enterprise Integration' },
              { name: 'DRATA', desc: 'Compliance Automation' }
            ].map((partner) => (
              <div key={partner.name} className="bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 hover:border-cyan-500/30 transition-all group">
                <div className="font-bold text-xl text-cyan-400 mb-2 group-hover:scale-110 transition-transform inline-block">{partner.name}</div>
                <div className="text-sm text-gray-500">{partner.desc}</div>
              </div>
            ))}
          </div>

          {/* Security Certifications */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/30 rounded-xl p-6 text-center">
              <Award className="w-10 h-10 text-green-400 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">ISO 27001</h3>
              <p className="text-sm text-gray-400">Information Security Certified</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border border-blue-500/30 rounded-xl p-6 text-center">
              <Shield className="w-10 h-10 text-blue-400 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">SOC 2 Type II</h3>
              <p className="text-sm text-gray-400">Audited Security Controls</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-500/30 rounded-xl p-6 text-center">
              <Lock className="w-10 h-10 text-purple-400 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">GDPR Compliant</h3>
              <p className="text-sm text-gray-400">EU Data Protection</p>
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section id="clients" className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
              <span className="text-cyan-400 font-semibold text-sm">CLIENT SUCCESS STORIES</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Trusted by Leading Global Enterprises</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              See how industry leaders are transforming their ESG-GRC operations with our AI-powered platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                company: "Sibanye-Stillwater",
                industry: "Mining & Resources",
                quote: "ESG Navigator Pro transformed our compliance monitoring across our global operations. The AI-powered insights have reduced our audit preparation time by 68%.",
                author: "Chief Sustainability Officer",
                impact: "68% reduction in audit prep time"
              },
              {
                company: "Anglo American",
                industry: "Mining & Metals",
                quote: "The platform's real-time compliance dashboards and predictive analytics have given us unprecedented visibility into our ESG performance across multiple frameworks.",
                author: "Head of ESG Compliance",
                impact: "R331M+ supply chain monitored"
              },
              {
                company: "Global Mining Enterprise",
                industry: "Tier-1 Mining",
                quote: "White-glove onboarding and dedicated support made deployment seamless. The ROI was evident within the first quarter. This is enterprise SaaS done right.",
                author: "VP of Risk & Compliance",
                impact: "95.8% compliance score achieved"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-8 hover:border-cyan-500/30 transition-all">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} className="w-5 h-5 fill-cyan-400 text-cyan-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                <div className="border-t border-white/10 pt-4">
                  <div className="font-bold text-white mb-1">{testimonial.company}</div>
                  <div className="text-sm text-gray-400 mb-3">{testimonial.author}</div>
                  <div className="inline-block px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-xs text-cyan-400 font-semibold">
                    {testimonial.impact}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-y border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-6">Ready to Lead in ESG-GRC Excellence?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join Fortune 500 companies and tier-1 enterprises transforming compliance with AI
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">24/7</div>
              <div className="text-sm text-gray-400">Global Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">99.9%</div>
              <div className="text-sm text-gray-400">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">30 Days</div>
              <div className="text-sm text-gray-400">Average Deployment</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/assessments"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition transform hover:scale-105"
            >
              Access Platform
            </Link>
            <button
              onClick={() => setIsConsultationOpen(true)}
              className="px-8 py-4 border-2 border-cyan-500 text-cyan-400 rounded-lg font-bold text-lg hover:bg-cyan-500/10 transition transform hover:scale-105"
            >
              Book Enterprise Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-cyan-500/30">
                  ESG
                </div>
                <div>
                  <div className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">ESG Navigator Pro</div>
                  <div className="text-xs text-gray-500">Global ESG-GRC SaaS Leader</div>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                The world's most advanced AI-powered ESG-GRC automation platform for enterprise compliance.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-3">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-cyan-400 transition">Features</a></li>
                <li><a href="#trust" className="hover:text-cyan-400 transition">Security</a></li>
                <li><a href="#clients" className="hover:text-cyan-400 transition">Clients</a></li>
                <li><a href="/assessments" className="hover:text-cyan-400 transition">Launch Platform</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3">Enterprise</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> ISO 27001 Certified</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> SOC 2 Type II</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> GDPR Compliant</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> 99.9% Uptime SLA</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
            <div>
              © 2025 ESG Navigator Pro. All rights reserved. | Powered by TIS Holdings
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <span>Global SaaS • Enterprise ESG-GRC • AI-Powered</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </div>
  )
}