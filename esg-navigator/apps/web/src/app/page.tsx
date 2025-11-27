'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Bot,
  Calendar,
  CheckCircle,
  FileCheck,
  Play,
  Rocket,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import ConsultationModal from '@/components/ConsultationModal';

export default function Home() {
  const [showConsultation, setShowConsultation] = useState(false);

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920")',
          filter: 'brightness(0.4)'
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/60 to-transparent z-0" />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-5xl">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <span className="text-white font-bold text-2xl">EN</span>
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
              TIS-IntelliMat
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                ESG Navigator
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Real-time compliance, energy intelligence, and sustainability monitoring unified.
              Powered by <span className="text-cyan-400 font-semibold">Claude AI</span> and <span className="text-blue-400 font-semibold">IBM Watson</span>.
            </p>

            {/* Main CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/dashboard"
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-lg font-bold rounded-xl hover:shadow-xl hover:shadow-cyan-500/30 transition-all transform hover:-translate-y-1"
              >
                <Rocket className="w-6 h-6" />
                Launch App
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={() => setShowConsultation(true)}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white text-lg font-bold rounded-xl hover:bg-white/20 transition-all"
              >
                <Calendar className="w-6 h-6" />
                Schedule Consultation
              </button>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <Link
                href="/dashboard"
                className="group bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all border border-white/10"
              >
                <BarChart3 className="w-8 h-8 text-cyan-400 mb-2 mx-auto" />
                <p className="text-white font-medium">Dashboard</p>
                <p className="text-gray-400 text-sm">Real-time metrics</p>
              </Link>

              <Link
                href="/training"
                className="group bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all border border-white/10"
              >
                <BookOpen className="w-8 h-8 text-green-400 mb-2 mx-auto" />
                <p className="text-white font-medium">Training</p>
                <p className="text-gray-400 text-sm">9 Expert courses</p>
              </Link>

              <Link
                href="/assessments"
                className="group bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all border border-white/10"
              >
                <FileCheck className="w-8 h-8 text-blue-400 mb-2 mx-auto" />
                <p className="text-white font-medium">Assessments</p>
                <p className="text-gray-400 text-sm">ISO compliance</p>
              </Link>

              <Link
                href="/agents"
                className="group bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all border border-white/10"
              >
                <Bot className="w-8 h-8 text-purple-400 mb-2 mx-auto" />
                <p className="text-white font-medium">AI Agents</p>
                <p className="text-gray-400 text-sm">9 Specialized bots</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-900/90 backdrop-blur-lg py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Comprehensive ESG Platform</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Everything you need to manage ESG compliance, sustainability, and reporting in one unified platform.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Bot className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">9 AI Agents</h3>
                <p className="text-gray-400 mb-6">
                  Specialized AI agents powered by Claude Anthropic for ESG assessment, emissions tracking, supplier screening, and more.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    ESG Assessor & Standards Mapper
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Emissions Accountant
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Supplier Screener & TSF Watch
                  </li>
                </ul>
              </div>

              {/* Feature 2 */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">IBM Envizi Integration</h3>
                <p className="text-gray-400 mb-6">
                  Real-time ESG data ingestion from IBM Envizi for carbon emissions, water usage, energy consumption, and waste metrics.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Real-time data sync
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Scope 1, 2, 3 tracking
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Watson workflow automation
                  </li>
                </ul>
              </div>

              {/* Feature 3 */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Claude AI Analytics</h3>
                <p className="text-gray-400 mb-6">
                  Advanced semantic intelligence for document analysis, gap identification, and actionable recommendations.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Natural language queries
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Automated report generation
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Compliance gap analysis
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Standards Section */}
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Compliance Standards Covered</h2>
              <p className="text-xl text-indigo-200">
                Comprehensive coverage across all major ESG frameworks and standards
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {['ISO 14001', 'ISO 45001', 'ISO 50001', 'GISTM', 'GRI', 'SASB', 'TCFD', 'CDP', 'UN SDGs', 'IFRS S1', 'IFRS S2', 'GHG Protocol'].map((standard) => (
                <div key={standard} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                  <p className="text-white font-bold">{standard}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Training Preview */}
        <div className="bg-gray-900/90 backdrop-blur-lg py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h2 className="text-4xl font-bold text-white mb-4">Expert-Led Training</h2>
                <p className="text-xl text-gray-400 mb-6">
                  9 comprehensive courses covering ESG fundamentals to advanced analytics.
                  Earn certificates and track your progress.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    ESG Fundamentals & Emissions Accounting
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-blue-400" />
                    </div>
                    Standards Mapping & Compliance
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-purple-400" />
                    </div>
                    Advanced Analytics & AI Agent Management
                  </li>
                </ul>
                <Link
                  href="/training"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                >
                  <BookOpen className="w-5 h-5" />
                  Start Learning
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
                  <p className="text-4xl font-bold text-white mb-2">9</p>
                  <p className="text-gray-400">Courses</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-500/30">
                  <p className="text-4xl font-bold text-white mb-2">27+</p>
                  <p className="text-gray-400">Hours</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
                  <p className="text-4xl font-bold text-white mb-2">100+</p>
                  <p className="text-gray-400">Lessons</p>
                </div>
                <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl p-6 border border-amber-500/30">
                  <p className="text-4xl font-bold text-white mb-2">9</p>
                  <p className="text-gray-400">Certificates</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-700 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your ESG Management?</h2>
            <p className="text-xl text-cyan-100 mb-8">
              Get started with a free consultation or launch the app to explore all features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 text-lg font-bold rounded-xl hover:shadow-xl transition-all"
              >
                <Rocket className="w-6 h-6" />
                Launch App Now
              </Link>
              <button
                onClick={() => setShowConsultation(true)}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-bold rounded-xl hover:bg-white/10 transition-all"
              >
                <Calendar className="w-6 h-6" />
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">EN</span>
                </div>
                <div>
                  <p className="text-white font-bold">ESG Navigator</p>
                  <p className="text-gray-400 text-sm">by TIS Holdings</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-gray-400">
                <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
                <Link href="/training" className="hover:text-white transition">Training</Link>
                <Link href="/assessments" className="hover:text-white transition">Assessments</Link>
                <Link href="/agents" className="hover:text-white transition">AI Agents</Link>
                <Link href="/ai-insights" className="hover:text-white transition">Analytics</Link>
              </div>
              <p className="text-gray-500 text-sm">© 2024 TIS Holdings. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Consultation Modal */}
      <ConsultationModal isOpen={showConsultation} onClose={() => setShowConsultation(false)} />
    </main>
  );
}
