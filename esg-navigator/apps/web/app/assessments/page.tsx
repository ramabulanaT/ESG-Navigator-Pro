
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, Clock, PlayCircle, FileCheck, Shield, Zap, Mountain, ArrowRight } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
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
useEffect(() => {
  // Test connection to Railway backend
  const testConnection = async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();
      console.log('✅ Backend connected:', data);
      
      // Try fetching ESG data
      const esgResponse = await fetch(`${API_URL}/api/v1/esg`);
      console.log('✅ ESG endpoint status:', esgResponse.status);
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
    }
  };
  
  testConnection();
}, []);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">ESG Assessments</h1>
              <p className="text-gray-600 mt-2 text-lg">
                Evaluate your compliance across multiple frameworks and standards
              </p>
            </div>
            <Link 
              href="/"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Assessments</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalAssessments}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
  
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Completed</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{completedCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
  
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">In Progress</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{inProgressCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
  
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Avg. Score</p>
                <p className="text-3xl font-bold text-indigo-600 mt-1">{avgScore}%</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
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
                className={`bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                  isSelected ? 'ring-2 ring-indigo-500' : ''
                }`}
                onClick={() => setSelectedAssessment(assessment.id)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-3xl shadow-lg">
                      {assessment.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{assessment.title}</h3>
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
}// Deployment test - 12/15/2025 16:12:14
