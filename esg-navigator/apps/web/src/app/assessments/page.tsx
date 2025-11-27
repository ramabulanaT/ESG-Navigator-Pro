'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle,
  Clock,
  PlayCircle,
  FileCheck,
  Shield,
  Zap,
  Mountain,
  AlertTriangle,
  TrendingUp,
  Target,
  Lightbulb,
  ChevronRight,
  X,
  BarChart3,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

// Assessment Frameworks
const assessmentFrameworks = [
  {
    id: 'iso-14001',
    title: 'ISO 14001',
    subtitle: 'Environmental Management',
    description: 'Comprehensive environmental management system assessment aligned with international standards for reducing environmental impact.',
    icon: FileCheck,
    color: 'green',
    status: 'completed',
    score: 92,
    lastUpdated: '2 days ago',
    maturityLevel: 4,
    gaps: 3,
    recommendations: [
      { priority: 'High', text: 'Implement automated emissions monitoring system', impact: 'Reduce manual data entry errors by 85%' },
      { priority: 'Medium', text: 'Enhance supplier environmental screening', impact: 'Improve supply chain ESG score by 15%' },
      { priority: 'Low', text: 'Update environmental policy documentation', impact: 'Streamline audit preparation' },
    ],
  },
  {
    id: 'iso-45001',
    title: 'ISO 45001',
    subtitle: 'Health & Safety',
    description: 'Occupational health and safety management system evaluation covering worker safety, hazard identification, and risk controls.',
    icon: Shield,
    color: 'blue',
    status: 'in-progress',
    progress: 65,
    lastUpdated: '1 day ago',
    maturityLevel: 3,
    gaps: 7,
    recommendations: [
      { priority: 'High', text: 'Complete hazard identification for new facilities', impact: 'Reduce incident risk by 40%' },
      { priority: 'High', text: 'Implement worker consultation framework', impact: 'Meet regulatory requirement' },
      { priority: 'Medium', text: 'Enhance safety training program', impact: 'Improve safety culture score' },
    ],
  },
  {
    id: 'iso-50001',
    title: 'ISO 50001',
    subtitle: 'Energy Management',
    description: 'Energy performance optimization and efficiency management framework for systematic energy reduction and cost savings.',
    icon: Zap,
    color: 'yellow',
    status: 'not-started',
    lastUpdated: 'Never',
    maturityLevel: 0,
    gaps: 12,
    recommendations: [
      { priority: 'High', text: 'Establish energy baseline and EnPIs', impact: 'Foundation for all improvements' },
      { priority: 'High', text: 'Conduct comprehensive energy audit', impact: 'Identify R2.4M savings potential' },
      { priority: 'Medium', text: 'Appoint energy management team', impact: 'Drive implementation success' },
    ],
  },
  {
    id: 'gistm',
    title: 'GISTM',
    subtitle: 'Tailings Storage',
    description: 'Global Industry Standard for Tailings Management - Critical mining sector compliance for safe tailings management.',
    icon: Mountain,
    color: 'purple',
    status: 'not-started',
    lastUpdated: 'Never',
    maturityLevel: 0,
    gaps: 15,
    recommendations: [
      { priority: 'Critical', text: 'Conduct tailings facility integrity assessment', impact: 'Essential for GISTM compliance' },
      { priority: 'High', text: 'Establish Accountable Executive role', impact: 'Meet GISTM governance requirement' },
      { priority: 'High', text: 'Develop emergency response plan', impact: 'Protect communities and environment' },
    ],
  },
];

// Sample Assessment Questions
const sampleAssessmentQuestions = [
  {
    id: 1,
    category: 'Environmental Policy',
    question: 'Does your organization have a documented environmental policy that is communicated to all employees?',
    options: [
      { value: 0, label: 'No environmental policy exists' },
      { value: 1, label: 'Policy exists but is not communicated' },
      { value: 2, label: 'Policy exists and is partially communicated' },
      { value: 3, label: 'Policy is documented and fully communicated' },
      { value: 4, label: 'Policy is communicated and regularly reviewed' },
    ],
  },
  {
    id: 2,
    category: 'Emissions Tracking',
    question: 'How does your organization track and report greenhouse gas emissions?',
    options: [
      { value: 0, label: 'No emissions tracking in place' },
      { value: 1, label: 'Basic Scope 1 tracking only' },
      { value: 2, label: 'Scope 1 and 2 tracking' },
      { value: 3, label: 'Scope 1, 2, and partial Scope 3' },
      { value: 4, label: 'Comprehensive Scope 1, 2, and 3 with third-party verification' },
    ],
  },
  {
    id: 3,
    category: 'Waste Management',
    question: 'What is your organization\'s approach to waste management and circular economy principles?',
    options: [
      { value: 0, label: 'No formal waste management program' },
      { value: 1, label: 'Basic waste disposal compliance' },
      { value: 2, label: 'Recycling program in place' },
      { value: 3, label: 'Comprehensive waste reduction and recycling' },
      { value: 4, label: 'Zero waste to landfill target with circular economy integration' },
    ],
  },
];

export default function AssessmentsPage() {
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  const [demoAnswers, setDemoAnswers] = useState<Record<number, number>>({});
  const [demoScore, setDemoScore] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const totalAssessments = assessmentFrameworks.length;
  const completedCount = assessmentFrameworks.filter(a => a.status === 'completed').length;
  const inProgressCount = assessmentFrameworks.filter(a => a.status === 'in-progress').length;
  const avgScore = assessmentFrameworks.filter(a => a.score).reduce((acc, a) => acc + (a.score || 0), 0) / (completedCount || 1);

  const handleDemoSubmit = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      const totalScore = Object.values(demoAnswers).reduce((acc, val) => acc + val, 0);
      const maxScore = sampleAssessmentQuestions.length * 4;
      const percentage = Math.round((totalScore / maxScore) * 100);
      setDemoScore(percentage);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-500' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-500' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-500' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-500' },
    };
    return colors[color] || colors.green;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <FileCheck className="w-12 h-12" />
                <h1 className="text-5xl font-bold">ESG Assessments</h1>
              </div>
              <p className="text-blue-100 text-xl max-w-2xl">
                Comprehensive compliance assessments powered by Claude AI with actionable recommendations and gap analysis.
              </p>
              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={() => setShowDemo(true)}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
                >
                  <PlayCircle className="w-5 h-5" />
                  Try Demo Assessment
                </button>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-white/30 transition-colors"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </div>

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
                <p className="text-3xl font-bold text-indigo-600 mt-1">{Math.round(avgScore)}%</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {assessmentFrameworks.map((assessment) => {
            const Icon = assessment.icon;
            const colorClasses = getColorClasses(assessment.color);
            const isSelected = selectedAssessment === assessment.id;

            return (
              <div
                key={assessment.id}
                className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-300 ${
                  isSelected ? `${colorClasses.border} ring-2 ring-opacity-50` : 'border-gray-200'
                } hover:shadow-lg cursor-pointer`}
                onClick={() => setSelectedAssessment(isSelected ? null : assessment.id)}
              >
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 ${colorClasses.bg} rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-8 h-8 ${colorClasses.text}`} />
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
                  <p className="text-gray-700 mb-6">{assessment.description}</p>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-gray-900">{assessment.maturityLevel}/5</p>
                      <p className="text-xs text-gray-500">Maturity Level</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-red-600">{assessment.gaps}</p>
                      <p className="text-xs text-gray-500">Gaps Identified</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-green-600">{assessment.recommendations.length}</p>
                      <p className="text-xs text-gray-500">Recommendations</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {assessment.status === 'in-progress' && (
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span className="font-semibold">{assessment.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full"
                          style={{ width: `${assessment.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                      assessment.status === 'completed'
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAssessment(assessment.id);
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    <span>
                      {assessment.status === 'completed' ? 'View Results & Recommendations' :
                       assessment.status === 'in-progress' ? 'Continue Assessment' :
                       'Start Assessment'}
                    </span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Expanded Recommendations */}
                {isSelected && (
                  <div className="border-t border-gray-200 p-6 bg-gradient-to-br from-gray-50 to-indigo-50">
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb className="w-5 h-5 text-amber-500" />
                      <h4 className="font-bold text-gray-900">AI-Powered Recommendations</h4>
                    </div>
                    <div className="space-y-3">
                      {assessment.recommendations.map((rec, idx) => (
                        <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-start gap-3">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              rec.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                              rec.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                              rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {rec.priority}
                            </span>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{rec.text}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                <Target className="w-3 h-3 inline mr-1" />
                                Impact: {rec.impact}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Claude AI Integration Section */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Claude AI Assessment Engine</h2>
              <p className="text-purple-200">Semantic intelligence for comprehensive ESG analysis</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <FileCheck className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold">Document Analysis</h3>
              </div>
              <p className="text-purple-200 text-sm">Claude analyzes your policies, procedures, and documentation to identify gaps and compliance status.</p>
            </div>

            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold">Maturity Scoring</h3>
              </div>
              <p className="text-purple-200 text-sm">AI-powered maturity assessment across 5 levels with detailed gap analysis and improvement roadmaps.</p>
            </div>

            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold">Smart Recommendations</h3>
              </div>
              <p className="text-purple-200 text-sm">Prioritized, actionable recommendations based on your industry, size, and current maturity level.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Assessment Modal */}
      {showDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDemo(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <button
                onClick={() => setShowDemo(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <PlayCircle className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold">Demo: ISO 14001 Assessment</h2>
                  <p className="text-purple-200">Experience our AI-powered assessment process</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {demoScore === null ? (
                <>
                  <div className="space-y-6">
                    {sampleAssessmentQuestions.map((q, qIdx) => (
                      <div key={q.id} className="bg-gray-50 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-medium">
                            {q.category}
                          </span>
                        </div>
                        <p className="font-medium text-gray-900 mb-4">{q.question}</p>
                        <div className="space-y-2">
                          {q.options.map((opt) => (
                            <label
                              key={opt.value}
                              className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                                demoAnswers[q.id] === opt.value
                                  ? 'border-indigo-500 bg-indigo-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${q.id}`}
                                checked={demoAnswers[q.id] === opt.value}
                                onChange={() => setDemoAnswers(prev => ({ ...prev, [q.id]: opt.value }))}
                                className="w-4 h-4 text-indigo-600"
                              />
                              <span className="text-gray-700">{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleDemoSubmit}
                    disabled={Object.keys(demoAnswers).length !== sampleAssessmentQuestions.length || isAnalyzing}
                    className="w-full mt-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Claude AI Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Analyze with Claude AI
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                    demoScore >= 80 ? 'bg-green-100' : demoScore >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    <span className={`text-4xl font-bold ${
                      demoScore >= 80 ? 'text-green-600' : demoScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {demoScore}%
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Assessment Complete!</h3>
                  <p className="text-gray-600 mb-6">
                    {demoScore >= 80 ? 'Excellent! Your organization shows strong environmental management maturity.' :
                     demoScore >= 60 ? 'Good progress! There are opportunities for improvement.' :
                     'Significant gaps identified. Recommend prioritizing environmental management.'}
                  </p>

                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 text-left mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-indigo-600" />
                      <h4 className="font-bold text-gray-900">Claude AI Recommendations</h4>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <span className="text-gray-700">Implement automated emissions monitoring for Scope 1 & 2</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <span className="text-gray-700">Develop comprehensive waste management program with KPIs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <span className="text-gray-700">Enhance environmental policy communication across all levels</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setDemoScore(null);
                        setDemoAnswers({});
                      }}
                      className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => setShowDemo(false)}
                      className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition"
                    >
                      View Full Assessments
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
