'use client'
import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Clock, PlayCircle, FileCheck, Shield, Zap, Mountain, ArrowRight } from 'lucide-react'

interface Assessment {
  id: string
  title: string
  subtitle: string
  description: string
  icon: string
  color: string
  status: 'completed' | 'in-progress' | 'not-started'
  score?: number
  progress?: number
  lastUpdated: string
  IconComponent: React.ComponentType<{ className: string }>
}

const initialAssessments: Assessment[] = [
  {
    id: 'iso-14001',
    title: 'ISO 14001',
    subtitle: 'Environmental Management',
    description: 'Comprehensive environmental management system assessment aligned with international standards',
    icon: '🌍',
    color: 'green',
    status: 'completed',
    score: 95,
    lastUpdated: '2 days ago',
    IconComponent: FileCheck,
  },
  {
    id: 'iso-45001',
    title: 'ISO 45001',
    subtitle: 'Health & Safety',
    description: 'Occupational health and safety management system evaluation and compliance tracking',
    icon: '🏥',
    color: 'blue',
    status: 'in-progress',
    progress: 65,
    lastUpdated: '1 day ago',
    IconComponent: Shield,
  },
  {
    id: 'iso-50001',
    title: 'ISO 50001',
    subtitle: 'Energy Management',
    description: 'Energy performance optimization and efficiency management framework assessment',
    icon: '⚡',
    color: 'yellow',
    status: 'not-started',
    lastUpdated: 'Never',
    IconComponent: Zap,
  },
  {
    id: 'gistm',
    title: 'GISTM',
    subtitle: 'Tailings Storage',
    description: 'Global Industry Standard for Tailings Management - Mining sector compliance',
    icon: '⛏️',
    color: 'purple',
    status: 'not-started',
    lastUpdated: 'Never',
    IconComponent: Mountain,
  },
]

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>(initialAssessments)
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null)

  const handleStartAssessment = (id: string) => {
    setAssessments(prev =>
      prev.map(a =>
        a.id === id
          ? { ...a, status: 'in-progress' as const, progress: 0, lastUpdated: 'Just now' }
          : a
      )
    )
    setSelectedAssessment(id)
  }

  const handleCompleteAssessment = (id: string) => {
    setAssessments(prev =>
      prev.map(a =>
        a.id === id
          ? { ...a, status: 'completed' as const, score: 92, progress: undefined, lastUpdated: 'Just now' }
          : a
      )
    )

    // Send completion email
    const assessment = assessments.find(a => a.id === id)
    if (assessment) {
      fetch('/api/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'terry@tisholdings.co.za',
          subject: `Your ${assessment.title} Assessment is Complete`,
          template: 'assessment-complete',
          data: {
            userName: 'Dr. Ramabulana',
            assessmentType: assessment.title,
            score: '92',
            platformUrl: 'https://esgnavigator.ai',
            gap1: 'Policy documentation',
            gap2: 'Procedure implementation'
          }
        })
      }).catch(console.error)
    }
  }

  const handleProgressAssessment = (id: string) => {
    setAssessments(prev =>
      prev.map(a =>
        a.id === id && a.progress !== undefined
          ? { ...a, progress: Math.min(a.progress + 15, 100) }
          : a
      )
    )
  }

  // Calculate stats
  const totalAssessments = assessments.length
  const completedCount = assessments.filter(a => a.status === 'completed').length
  const inProgressCount = assessments.filter(a => a.status === 'in-progress').length
  const avgScore =
    assessments.length > 0
      ? Math.round(
          assessments.reduce((sum, a) => sum + (a.score || 0), 0) / assessments.length
        )
      : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-cyan-500/30">
                ESG
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">ESG Compliance Assessments</h1>
                <p className="text-gray-600 mt-1 text-sm">
                  AI-powered enterprise compliance evaluation across global frameworks
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 rounded-lg font-medium hover:from-gray-200 hover:to-gray-100 transition-all border border-gray-200"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
  
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-300 transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Assessments</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mt-1">{totalAssessments}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileCheck className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-green-300 transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Completed</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{completedCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">In Progress</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{inProgressCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-purple-300 transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Avg. Score</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mt-1">{avgScore}%</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
        </div>
  
        {/* Assessment Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {assessments.map((assessment) => {
            const Icon = assessment.IconComponent
            const isSelected = selectedAssessment === assessment.id
            return (
              <div
                key={assessment.id}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border p-8 hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  isSelected ? 'ring-2 ring-indigo-500 border-indigo-300' : 'border-gray-200 hover:border-indigo-200'
                }`}
                onClick={() => setSelectedAssessment(assessment.id)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-3xl shadow-lg hover:scale-110 transition-transform">
                      {assessment.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{assessment.title}</h3>
                      <p className="text-gray-600 font-medium">{assessment.subtitle}</p>
                    </div>
                  </div>
        
                  {/* Status Badge */}
                  {assessment.status === 'completed' && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold">
                      <CheckCircle className="w-5 h-5" />
                      <span>{assessment.score}%</span>
                    </div>
                  )}
                  {assessment.status === 'in-progress' && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold">
                      <Clock className="w-5 h-5" />
                      <span>{assessment.progress}%</span>
                    </div>
                  )}
                  {assessment.status === 'not-started' && (
                    <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full font-semibold">
                      Not Started
                    </div>
                  )}
                </div>
        
                {/* Description */}
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  {assessment.description}
                </p>
        
                {/* Progress Bar (for in-progress assessments) */}
                {assessment.status === 'in-progress' && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span className="font-semibold">{assessment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${assessment.progress}%` }}
                      />
                    </div>
                  </div>
                )}
        
                {/* Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Last updated:</span> {assessment.lastUpdated}
                  </div>
                  
                  <div className="flex gap-3">
                    {assessment.status === 'in-progress' && (
                      <button
                        onClick={() => handleProgressAssessment(assessment.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition-all"
                      >
                        <ArrowRight className="w-4 h-4" />
                        Continue
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (assessment.status === 'not-started') {
                          handleStartAssessment(assessment.id)
                        } else if (assessment.status === 'in-progress') {
                          handleCompleteAssessment(assessment.id)
                        }
                      }}
                      className={`
                        inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all
                        ${assessment.status === 'completed' 
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span>
                        {assessment.status === 'completed' ? 'View Results' : 
                         assessment.status === 'in-progress' ? 'Complete' : 'Start Assessment'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}