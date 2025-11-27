'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Shield, Zap, BarChart3, Users, Lock, Lightbulb } from 'lucide-react'
import ConsultationModal from '@/components/ConsultationModal'

export default function Home() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center font-bold">
              TIS
            </div>
            <span className="font-bold text-xl">TIS Holdings</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="hover:text-cyan-400 transition">Features</a>
            <a href="#capabilities" className="hover:text-cyan-400 transition">Capabilities</a>
            <a href="#contact" className="hover:text-cyan-400 transition">Contact</a>
          </div>
          <Link 
            href="/assessments"
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition"
          >
            Launch App →
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
          <div className="inline-block mb-6 px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-full">
            <span className="text-cyan-400 font-semibold">AI-Powered ESG-GRC Automation</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Enterprise Compliance,
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Automated by AI
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            The world's first comprehensive AI-powered ESG-GRC automation platform. Trusted by enterprise organizations across multiple sectors. Powered by advanced AI, enterprise-grade cloud infrastructure, and institutional integrations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link 
              href="/assessments"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition inline-flex items-center gap-2"
            >
              Start Assessment <ArrowRight className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsConsultationOpen(true)}
              className="px-8 py-4 border border-cyan-500 text-cyan-400 rounded-lg font-bold text-lg hover:bg-cyan-500/10 transition"
            >
              Schedule Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-20">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur text-center">
              <div className="text-3xl md:text-4xl font-bold text-cyan-400">R331M+</div>
              <div className="text-xs md:text-sm text-gray-400 mt-2">Supply Chain Value</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur text-center">
              <div className="text-3xl md:text-4xl font-bold text-cyan-400">87.2%</div>
              <div className="text-xs md:text-sm text-gray-400 mt-2">Compliance Rate</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur text-center">
              <div className="text-3xl md:text-4xl font-bold text-cyan-400">142+</div>
              <div className="text-xs md:text-sm text-gray-400 mt-2">Assessment Questions</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur text-center">
              <div className="text-3xl md:text-4xl font-bold text-cyan-400">6</div>
              <div className="text-xs md:text-sm text-gray-400 mt-2">Integrated Frameworks</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-black to-blue-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Why Choose TIS Holdings?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              The first comprehensive compliance automation system with AI-driven capabilities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Lightbulb className="w-8 h-8" />,
                title: "AI-Powered Intelligence",
                description: "Advanced AI provides real-time compliance recommendations, gap analysis, and predictive insights across all ESG frameworks."
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Enterprise Security",
                description: "ISO 27001 compliance, enterprise-grade cloud infrastructure, and bank-grade encryption for all sensitive data."
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Rapid Deployment",
                description: "Go from assessment to actionable insights in days, not months. Automated workflows save 70% of audit time."
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Real-Time Analytics",
                description: "Live compliance dashboards, KPI tracking, and performance metrics across ISO 14001, 45001, 50001, and GISTM."
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Expert Training",
                description: "8-Domain Compliance Stewardship Model (CSM) with structured coaching framework and certification programs."
              },
              {
                icon: <Lock className="w-8 h-8" />,
                title: "Framework Coverage",
                description: "ISO 50001, ISO 14001, ISO 45001, ISO 27001, GISTM, and JSE compliance in one integrated platform."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 transition flex flex-col h-full">
                <div className="text-cyan-400 mb-4 flex justify-start">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 flex-grow">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnerships Section */}
      <section className="py-24 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-16">Trusted by Industry Leaders</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
            {['Advanced AI', 'Cloud Infrastructure', 'Enterprise Integration', 'Compliance Automation'].map((capability) => (
              <div key={capability} className="bg-white/5 border border-white/10 rounded-lg p-8">
                <div className="font-bold text-lg text-cyan-400">{capability}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-y border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your ESG Compliance?</h2>
          <p className="text-xl text-gray-300 mb-12">
            Join organizations worldwide in automating compliance with AI-powered ESG-GRC automation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/assessments"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition"
            >
              Access Platform
            </Link>
            <button
              onClick={() => setIsConsultationOpen(true)}
              className="px-8 py-4 border border-cyan-500 text-cyan-400 rounded-lg font-bold text-lg hover:bg-cyan-500/10 transition"
            >
              Schedule Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">
                TIS
              </div>
              <span className="font-bold">TIS Holdings</span>
            </div>
            <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-right">
              © 2025 TIS Holdings. All rights reserved. | ESG-GRC Automation Platform
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