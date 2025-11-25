// src/app/ai-insights/page.tsx
// AI-Powered ESG Insights using Anthropic Claude

'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Send, TrendingUp, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react'

const sampleInsights = [
  {
    type: 'opportunity',
    title: 'Energy Efficiency Improvement',
    description: 'Based on your ISO 50001 data, implementing LED lighting across facilities could reduce energy consumption by 18% annually.',
    impact: 'High',
    effort: 'Medium',
    icon: TrendingUp,
    color: 'green',
  },
  {
    type: 'risk',
    title: 'Supply Chain Compliance Gap',
    description: 'Three suppliers in your network have not completed ESG assessments. This could pose regulatory risks.',
    impact: 'High',
    effort: 'Low',
    icon: AlertTriangle,
    color: 'red',
  },
  {
    type: 'achievement',
    title: 'Carbon Reduction Milestone',
    description: 'You have successfully reduced carbon emissions by 12% year-over-year, exceeding your target by 3%.',
    impact: 'High',
    effort: 'Completed',
    icon: CheckCircle,
    color: 'blue',
  },
]

const quickQuestions = [
  'How can we improve our ESG score?',
  'What are our biggest compliance risks?',
  'Analyze our energy efficiency trends',
  'Compare our performance to industry benchmarks',
  'Generate sustainability recommendations',
]

export default function AIInsightsPage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState('')

  const handleSubmit = async (question: string) => {
    setLoading(true)
    setQuery(question)
    
    // Simulate AI response (replace with actual Anthropic API call)
    setTimeout(() => {
      setResponse(`AI Analysis for: "${question}"\n\nBased on your current ESG performance data:\n\n• Your overall ESG score of 87.5 is above industry average\n• Environmental metrics show strong improvement (+5.2% this quarter)\n• Social compliance is robust with 94.2% adherence\n• Governance frameworks align with best practices\n\nKey Recommendations:\n1. Focus on water usage optimization (currently at 49.4K)\n2. Enhance diversity initiatives (current index: 0.74)\n3. Continue strong safety performance (1 incident is excellent)\n\nWould you like detailed action plans for any of these areas?`)
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-10 h-10" />
                <h1 className="text-5xl font-bold">AI Insights</h1>
              </div>
              <p className="text-purple-100 text-xl">
                AI-powered analysis and recommendations for your ESG performance
              </p>
              <p className="text-purple-200 text-sm mt-2">
                Powered by Anthropic Claude & IBM Watsonx
              </p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chat Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Chat Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                Ask AI About Your ESG Performance
              </h2>

              {/* Quick Questions */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Quick Questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSubmit(q)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="mb-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit(query)}
                    placeholder="Ask anything about your ESG data..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => handleSubmit(query)}
                    disabled={loading || !query.trim()}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    Analyze
                  </button>
                </div>
              </div>

              {/* Response Area */}
              {response && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-100">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">AI Analysis</h3>
                      <p className="text-sm text-gray-600">Anthropic Claude</p>
                    </div>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                      {response}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Automated Insights */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Automated Insights</h2>
              <div className="space-y-4">
                {sampleInsights.map((insight, idx) => {
                  const Icon = insight.icon
                  return (
                    <div 
                      key={idx}
                      className={`border-l-4 ${
                        insight.color === 'green' ? 'border-green-500 bg-green-50' :
                        insight.color === 'red' ? 'border-red-500 bg-red-50' :
                        'border-blue-500 bg-blue-50'
                      } p-6 rounded-r-lg`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 ${
                          insight.color === 'green' ? 'bg-green-100' :
                          insight.color === 'red' ? 'bg-red-100' :
                          'bg-blue-100'
                        } rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 ${
                            insight.color === 'green' ? 'text-green-600' :
                            insight.color === 'red' ? 'text-red-600' :
                            'text-blue-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2">{insight.title}</h3>
                          <p className="text-gray-700 mb-3">{insight.description}</p>
                          <div className="flex gap-4 text-sm">
                            <span className="font-medium text-gray-600">
                              Impact: <span className={`${
                                insight.impact === 'High' ? 'text-red-600' : 'text-gray-900'
                              }`}>{insight.impact}</span>
                            </span>
                            <span className="font-medium text-gray-600">
                              Effort: <span className="text-gray-900">{insight.effort}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Capabilities */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">AI Capabilities</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Real-time ESG performance analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Compliance gap identification</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Industry benchmarking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Actionable recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Risk prediction & mitigation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Automated report generation</span>
                </li>
              </ul>
            </div>

            {/* Integration Info */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-3">Powered By</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Anthropic Claude</p>
                    <p className="text-sm text-purple-200">Advanced Language Model</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🤖</span>
                  </div>
                  <div>
                    <p className="font-semibold">IBM Watsonx</p>
                    <p className="text-sm text-purple-200">Enterprise AI Platform</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gray-100 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-2">Need More Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Schedule a consultation with our ESG experts
              </p>
              <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}