'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Bot, MessageSquare, FileText, Shield, Zap,
  TrendingUp, Users, AlertTriangle, CheckCircle, Send
} from 'lucide-react'

const agents = [
  {
    id: 'compliance-analyst',
    name: 'Compliance Analyst',
    description: 'Analyzes regulatory compliance across ISO 14001, 45001, 50001, and GISTM frameworks',
    icon: Shield,
    color: 'blue',
    capabilities: ['Gap Analysis', 'Regulatory Updates', 'Risk Assessment']
  },
  {
    id: 'esg-reporter',
    name: 'ESG Reporter',
    description: 'Generates comprehensive ESG reports and sustainability disclosures',
    icon: FileText,
    color: 'green',
    capabilities: ['Report Generation', 'Data Visualization', 'Stakeholder Communications']
  },
  {
    id: 'risk-monitor',
    name: 'Risk Monitor',
    description: 'Continuously monitors ESG risks and provides early warning alerts',
    icon: AlertTriangle,
    color: 'red',
    capabilities: ['Real-time Monitoring', 'Predictive Analytics', 'Alert Management']
  },
  {
    id: 'energy-optimizer',
    name: 'Energy Optimizer',
    description: 'Optimizes energy consumption and identifies efficiency opportunities',
    icon: Zap,
    color: 'yellow',
    capabilities: ['Energy Analysis', 'Optimization Recommendations', 'Cost Savings']
  },
  {
    id: 'sustainability-advisor',
    name: 'Sustainability Advisor',
    description: 'Provides strategic sustainability recommendations and best practices',
    icon: TrendingUp,
    color: 'purple',
    capabilities: ['Strategic Planning', 'Best Practices', 'Industry Benchmarking']
  },
  {
    id: 'stakeholder-engagement',
    name: 'Stakeholder Engagement',
    description: 'Manages stakeholder communications and engagement initiatives',
    icon: Users,
    color: 'indigo',
    capabilities: ['Communication Plans', 'Feedback Analysis', 'Engagement Metrics']
  },
  {
    id: 'data-validator',
    name: 'Data Validator',
    description: 'Validates ESG data quality and ensures accuracy across systems',
    icon: CheckCircle,
    color: 'teal',
    capabilities: ['Data Validation', 'Quality Assurance', 'Error Detection']
  },
  {
    id: 'carbon-tracker',
    name: 'Carbon Tracker',
    description: 'Tracks carbon emissions across Scope 1, 2, and 3 categories',
    icon: TrendingUp,
    color: 'emerald',
    capabilities: ['Emissions Tracking', 'Carbon Accounting', 'Reduction Strategies']
  },
  {
    id: 'audit-assistant',
    name: 'Audit Assistant',
    description: 'Assists with ESG audits and compliance verification processes',
    icon: FileText,
    color: 'slate',
    capabilities: ['Audit Preparation', 'Evidence Collection', 'Compliance Verification']
  }
]

export default function AIAgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [chatMessage, setChatMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([])
  const [loading, setLoading] = useState(false)

  const agent = agents.find(a => a.id === selectedAgent)

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !agent) return

    setLoading(true)
    const userMessage = chatMessage
    setChatMessage('')

    // Add user message to history
    setChatHistory([...chatHistory, { role: 'user', content: userMessage }])

    // Simulate AI response
    setTimeout(() => {
      const response = `As the ${agent.name}, I've analyzed your request: "${userMessage}"\n\nBased on my capabilities in ${agent.capabilities.join(', ')}, here are my recommendations:\n\n• Conduct a comprehensive assessment of current practices\n• Implement automated monitoring systems\n• Establish clear KPIs and tracking mechanisms\n• Generate regular reports for stakeholders\n\nWould you like me to provide more specific guidance on any of these areas?`

      setChatHistory(prev => [...prev, { role: 'assistant', content: response }])
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Bot className="w-10 h-10" />
                <h1 className="text-5xl font-bold">AI Agents</h1>
              </div>
              <p className="text-blue-100 text-xl">
                9 specialized AI agents to automate your ESG compliance workflows
              </p>
              <p className="text-blue-200 text-sm mt-2">
                Powered by Advanced AI Technology
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
          {/* Agent Selection Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Agents</h2>
              <div className="space-y-3">
                {agents.map((a) => {
                  const Icon = a.icon
                  const isSelected = selectedAgent === a.id
                  return (
                    <button
                      key={a.id}
                      onClick={() => {
                        setSelectedAgent(a.id)
                        setChatHistory([])
                      }}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${a.color}-100`}>
                          <Icon className={`w-5 h-5 text-${a.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{a.name}</h3>
                          <p className="text-xs text-gray-600 mt-1">{a.description}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            {!selectedAgent ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Select an AI Agent</h3>
                <p className="text-gray-600">
                  Choose an agent from the list to start an interactive conversation
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Agent Header */}
                <div className={`bg-gradient-to-r from-${agent?.color}-500 to-${agent?.color}-600 text-white p-6`}>
                  {agent && (
                    <>
                      <div className="flex items-center gap-3 mb-3">
                        {(() => {
                          const Icon = agent.icon
                          return <Icon className="w-8 h-8" />
                        })()}
                        <h2 className="text-2xl font-bold">{agent.name}</h2>
                      </div>
                      <p className="text-white/90 mb-3">{agent.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {agent.capabilities.map((cap, idx) => (
                          <span key={idx} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                            {cap}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Chat History */}
                <div className="h-96 overflow-y-auto p-6 bg-gray-50">
                  {chatHistory.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p className="mb-4">Start a conversation with {agent?.name}</p>
                      <div className="space-y-2 text-sm">
                        <p>Try asking:</p>
                        <p className="text-gray-700">"What are the key compliance requirements?"</p>
                        <p className="text-gray-700">"How can I improve our ESG score?"</p>
                        <p className="text-gray-700">"Generate a risk assessment report"</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {chatHistory.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-2xl rounded-lg p-4 ${
                            msg.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-gray-200'
                          }`}>
                            <div className="font-semibold mb-1">
                              {msg.role === 'user' ? '👤 You' : `🤖 ${agent?.name}`}
                            </div>
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                          </div>
                        </div>
                      ))}
                      {loading && (
                        <div className="flex justify-start">
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-6 border-t border-gray-200">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !loading && handleSendMessage()}
                      placeholder={`Ask ${agent?.name} anything...`}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={loading || !chatMessage.trim()}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
