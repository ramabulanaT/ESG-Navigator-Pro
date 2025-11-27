'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  FileCheck,
  Users,
  BarChart3,
  AlertTriangle,
  Play,
  CheckCircle,
  Clock,
  MessageSquare,
  ArrowRight,
  Database,
  Brain,
} from 'lucide-react';

// The 9 ESG AI Agents
const agents = [
  {
    id: 'esg-assessor',
    name: 'ESG Assessor',
    description: 'Comprehensive ESG maturity scoring (0-100), gap analysis, and improvement roadmap generation for organizations.',
    icon: FileCheck,
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    status: 'active',
    metrics: { analyzed: 847, accuracy: '94.2%' },
    capabilities: ['Maturity Assessment', 'Gap Analysis', 'Roadmap Generation', 'Benchmark Comparison'],
  },
  {
    id: 'standards-mapper',
    name: 'Standards Mapper',
    description: 'Maps compliance to GRI, SASB, TCFD, CDP, UN SDGs, and ISO standards with gap identification.',
    icon: BarChart3,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    status: 'active',
    metrics: { mapped: 1245, standards: 12 },
    capabilities: ['GRI Mapping', 'SASB Alignment', 'TCFD Compliance', 'SDG Tracking'],
  },
  {
    id: 'emissions-accountant',
    name: 'Emissions Accountant',
    description: 'Scope 1, 2, and 3 emissions tracking, carbon footprint calculation, and reduction target setting.',
    icon: TrendingUp,
    color: 'from-green-500 to-lime-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    status: 'active',
    metrics: { tracked: '2.4M tCO2e', reduction: '12%' },
    capabilities: ['Scope 1/2/3 Tracking', 'Carbon Footprint', 'Reduction Targets', 'Offset Recommendations'],
  },
  {
    id: 'supplier-screener',
    name: 'Supplier Screener',
    description: 'ESG risk scoring for suppliers, red flag identification, and due diligence recommendations.',
    icon: Users,
    color: 'from-orange-500 to-amber-600',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    status: 'active',
    metrics: { screened: 523, flagged: 47 },
    capabilities: ['Risk Scoring', 'Red Flag Detection', 'Due Diligence', 'Supplier Monitoring'],
  },
  {
    id: 'energy-optimizer',
    name: 'Energy Optimizer',
    description: 'Energy audits, efficiency analysis, ROI calculations, and renewable energy recommendations.',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    status: 'active',
    metrics: { savings: 'R2.3M', efficiency: '+18%' },
    capabilities: ['Energy Audits', 'ROI Analysis', 'Renewable Planning', 'Efficiency Tracking'],
  },
  {
    id: 'iso-50001-coach',
    name: 'ISO 50001 Coach',
    description: 'Energy management system implementation guidance with step-by-step ISO 50001 certification support.',
    icon: Shield,
    color: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    status: 'active',
    metrics: { certified: 34, inProgress: 12 },
    capabilities: ['Implementation Guide', 'Documentation', 'Audit Prep', 'Certification Support'],
  },
  {
    id: 'assurance-copilot',
    name: 'Assurance Copilot',
    description: 'Audit preparation assistance, documentation gap analysis, and evidence compilation for assurance.',
    icon: CheckCircle,
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    status: 'active',
    metrics: { audits: 156, passRate: '98%' },
    capabilities: ['Audit Prep', 'Doc Analysis', 'Evidence Collection', 'Compliance Verification'],
  },
  {
    id: 'board-briefing-bot',
    name: 'Board Briefing Bot',
    description: 'Executive summaries, KPI dashboards, and strategic ESG recommendations for board presentations.',
    icon: BarChart3,
    color: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    status: 'active',
    metrics: { reports: 89, stakeholders: 234 },
    capabilities: ['Executive Summaries', 'KPI Dashboards', 'Strategic Insights', 'Presentation Ready'],
  },
  {
    id: 'tsf-watch',
    name: 'TSF Watch',
    description: 'Tailings storage facility safety monitoring and GISTM (Global Industry Standard for Tailings Management) compliance.',
    icon: AlertTriangle,
    color: 'from-red-500 to-rose-600',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    status: 'active',
    metrics: { facilities: 28, compliant: 26 },
    capabilities: ['Safety Monitoring', 'GISTM Compliance', 'Risk Assessment', 'Incident Prevention'],
  },
];

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAgentChat = async (agentId: string) => {
    if (!chatInput.trim()) return;

    setIsLoading(true);
    const agent = agents.find(a => a.id === agentId);

    setChatMessages(prev => [...prev, { role: 'user', content: chatInput }]);

    // Simulate agent response (in production, this would call the API)
    setTimeout(() => {
      const responses: Record<string, string> = {
        'esg-assessor': `Based on my ESG assessment analysis:\n\n**Overall Score: 78/100**\n\n- Environmental: 82/100 (Strong waste management, room for energy improvement)\n- Social: 75/100 (Good labor practices, enhance community engagement)\n- Governance: 77/100 (Solid policies, improve transparency)\n\n**Key Gaps:**\n1. Scope 3 emissions tracking incomplete\n2. Supplier ESG assessments needed\n3. Board diversity targets not set\n\n**Recommended Actions:**\n- Implement comprehensive Scope 3 tracking\n- Launch supplier ESG screening program\n- Set measurable diversity targets`,
        'standards-mapper': `**Standards Compliance Mapping:**\n\n✅ **GRI Standards:** 87% aligned\n- GRI 305 (Emissions): Full compliance\n- GRI 403 (Health & Safety): 92% compliance\n- GRI 205 (Anti-corruption): Needs improvement\n\n⚠️ **SASB Alignment:** 72%\n- Mining & Metals sector standards applicable\n- Water management disclosure gaps identified\n\n📊 **TCFD Recommendations:**\n- Governance: ✅ Complete\n- Strategy: ⚠️ Partial (scenario analysis needed)\n- Risk Management: ✅ Complete\n- Metrics: ⚠️ Partial`,
        'emissions-accountant': `**Emissions Analysis Report:**\n\n📊 **Total Carbon Footprint: 245,678 tCO2e**\n\n**Scope 1 (Direct):** 42,350 tCO2e (17%)\n- Stationary combustion: 28,200 tCO2e\n- Mobile sources: 14,150 tCO2e\n\n**Scope 2 (Energy):** 89,120 tCO2e (36%)\n- Purchased electricity: 85,400 tCO2e\n- Steam/heating: 3,720 tCO2e\n\n**Scope 3 (Value Chain):** 114,208 tCO2e (47%)\n- Purchased goods: 45,000 tCO2e\n- Transportation: 32,000 tCO2e\n- Employee commuting: 12,208 tCO2e\n\n**Reduction Target:** -30% by 2030\n**Current Trajectory:** -12% YoY`,
        'supplier-screener': `**Supplier ESG Screening Results:**\n\n📋 **Portfolio Overview:**\n- Total Suppliers Assessed: 156\n- High Risk: 12 (8%)\n- Medium Risk: 34 (22%)\n- Low Risk: 110 (70%)\n\n🚨 **Red Flags Detected:**\n1. **Supplier A** - Labor violations reported\n2. **Supplier B** - No environmental permits\n3. **Supplier C** - Governance concerns\n\n✅ **Top Performers:**\n1. Anglo American Platinum (Score: 92)\n2. Multotec Processing (Score: 87)\n3. Sasol Chemicals (Score: 84)\n\n**Recommended Actions:**\n- Conduct deep-dive audits on flagged suppliers\n- Implement quarterly ESG monitoring`,
        'energy-optimizer': `**Energy Optimization Analysis:**\n\n⚡ **Current Energy Profile:**\n- Annual Consumption: 12.4 GWh\n- Cost: R18.6M/year\n- Carbon Intensity: 0.89 kgCO2/kWh\n\n💡 **Optimization Opportunities:**\n\n1. **LED Lighting Upgrade**\n   - Investment: R2.1M\n   - Annual Savings: R890K\n   - Payback: 2.4 years\n   - CO2 Reduction: 1,200 tCO2e/year\n\n2. **Solar PV Installation**\n   - Investment: R15M\n   - Annual Savings: R3.2M\n   - Payback: 4.7 years\n   - CO2 Reduction: 4,500 tCO2e/year\n\n3. **HVAC Optimization**\n   - Investment: R800K\n   - Annual Savings: R420K\n   - Payback: 1.9 years`,
        'iso-50001-coach': `**ISO 50001 Implementation Guide:**\n\n📋 **Current Status: Phase 2 of 4**\n\n✅ **Completed:**\n- Energy policy established\n- Energy review conducted\n- Baseline established\n- EnPIs defined\n\n🔄 **In Progress:**\n- Energy objectives and targets\n- Action plans development\n- Documentation system\n\n⏳ **Pending:**\n- Internal audit\n- Management review\n- Certification audit\n\n**Next Steps:**\n1. Complete energy objectives document\n2. Assign action plan owners\n3. Schedule internal audit (recommended: 6 weeks)\n\n**Certification Timeline:** 4-6 months`,
        'assurance-copilot': `**Assurance Preparation Report:**\n\n📊 **Audit Readiness: 87%**\n\n✅ **Documentation Complete:**\n- Environmental policies (100%)\n- Safety procedures (100%)\n- Governance framework (100%)\n- Financial disclosures (95%)\n\n⚠️ **Gaps Identified:**\n1. Scope 3 evidence incomplete\n2. Supplier audit trails missing\n3. Board meeting minutes from Q2\n\n📁 **Evidence Status:**\n- Total documents: 1,247\n- Verified: 1,089 (87%)\n- Pending review: 158\n\n**Recommended Actions:**\n1. Upload Scope 3 calculations\n2. Request supplier documentation\n3. Complete Q2 minutes archive`,
        'board-briefing-bot': `**Executive ESG Briefing:**\n\n📈 **Performance Highlights Q3 2024:**\n\n**ESG Score: 85/100** (+3 vs Q2)\n- Industry Rank: Top 15%\n- YoY Improvement: +8 points\n\n**Key Achievements:**\n✅ 12% carbon reduction (exceeded 10% target)\n✅ Zero lost-time injuries (LTI-free: 180 days)\n✅ 94% supplier ESG compliance\n\n**Strategic Priorities:**\n1. Net-zero commitment by 2040\n2. Circular economy initiatives\n3. Enhanced stakeholder engagement\n\n**Investor Sentiment:**\n- ESG fund inclusion: 3 new funds\n- Analyst upgrades: 2\n- Rating outlook: Positive\n\n**Board Actions Required:**\n1. Approve 2025 ESG budget\n2. Review net-zero roadmap\n3. Endorse diversity targets`,
        'tsf-watch': `**Tailings Storage Facility Monitoring Report:**\n\n🏭 **Facility Overview:**\n- Active TSFs: 4\n- Inactive/Closed: 2\n- Total Capacity: 45M m³\n\n**GISTM Compliance Status:**\n✅ TSF-1 (Main): Compliant\n✅ TSF-2 (North): Compliant\n⚠️ TSF-3 (South): Minor gaps\n✅ TSF-4 (East): Compliant\n\n**Safety Metrics:**\n- Freeboard Level: All within limits\n- Seepage Monitoring: Active\n- Last Inspection: 14 days ago\n- Next Scheduled: 16 days\n\n**Risk Assessment:**\n- Seismic Risk: Low\n- Hydrological Risk: Medium\n- Structural Integrity: Good\n\n**Action Items:**\n1. Address TSF-3 documentation gaps\n2. Schedule geotechnical review\n3. Update emergency response plan`,
      };

      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: responses[agentId] || 'Agent analysis complete. Please check the detailed report in your dashboard.'
      }]);
      setIsLoading(false);
    }, 1500);

    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Bot className="w-12 h-12" />
                <h1 className="text-5xl font-bold">AI Agents</h1>
              </div>
              <p className="text-purple-100 text-xl max-w-2xl">
                9 specialized AI agents powered by Claude Anthropic and IBM Watson,
                working together to automate your ESG compliance and sustainability journey.
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                  <Brain className="w-5 h-5" />
                  <span className="font-medium">Anthropic Claude</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                  <Database className="w-5 h-5" />
                  <span className="font-medium">IBM Watson</span>
                </div>
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
        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {agents.map((agent) => {
            const Icon = agent.icon;
            const isSelected = selectedAgent === agent.id;

            return (
              <div
                key={agent.id}
                className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                  isSelected ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'
                }`}
                onClick={() => setSelectedAgent(isSelected ? null : agent.id)}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${agent.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-xs text-green-600 font-medium">Active</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{agent.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{agent.description}</p>

                  {/* Metrics */}
                  <div className="flex gap-4 mb-4">
                    {Object.entries(agent.metrics).map(([key, value]) => (
                      <div key={key} className={`${agent.bgColor} px-3 py-1.5 rounded-lg`}>
                        <span className={`text-xs font-medium ${agent.textColor}`}>
                          {key}: <span className="font-bold">{value}</span>
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Capabilities */}
                  <div className="flex flex-wrap gap-2">
                    {agent.capabilities.slice(0, 3).map((cap, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {cap}
                      </span>
                    ))}
                    {agent.capabilities.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        +{agent.capabilities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded Chat Interface */}
                {isSelected && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-medium text-gray-700">Chat with {agent.name}</span>
                    </div>

                    {/* Chat Messages */}
                    <div className="h-40 overflow-y-auto mb-3 space-y-2">
                      {chatMessages.length === 0 ? (
                        <p className="text-xs text-gray-500 text-center py-4">
                          Ask {agent.name} about your ESG data...
                        </p>
                      ) : (
                        chatMessages.map((msg, idx) => (
                          <div key={idx} className={`text-xs p-2 rounded ${
                            msg.role === 'user'
                              ? 'bg-indigo-100 text-indigo-900 ml-4'
                              : 'bg-white border border-gray-200 mr-4'
                          }`}>
                            <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
                          </div>
                        ))
                      )}
                      {isLoading && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                          Analyzing...
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAgentChat(agent.id)}
                        placeholder={`Ask ${agent.name}...`}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={() => handleAgentChat(agent.id)}
                        disabled={isLoading}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Watson Workflow Section */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl shadow-xl p-8 mb-12 text-white">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-4xl">🤖</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold">IBM Watson Workflow Integration</h2>
              <p className="text-blue-200">Automated ESG data processing and analysis pipeline</p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">1</div>
                <h3 className="font-bold">Data Ingestion</h3>
              </div>
              <p className="text-blue-200 text-sm">IBM Envizi connects to your data sources and ingests ESG metrics in real-time.</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold">2</div>
                <h3 className="font-bold">Watson Analysis</h3>
              </div>
              <p className="text-blue-200 text-sm">Watson NLP processes documents and extracts ESG-relevant insights automatically.</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center text-white font-bold">3</div>
                <h3 className="font-bold">Claude Reasoning</h3>
              </div>
              <p className="text-blue-200 text-sm">Claude AI provides deep reasoning and generates actionable recommendations.</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">4</div>
                <h3 className="font-bold">Report Generation</h3>
              </div>
              <p className="text-blue-200 text-sm">Automated reports and dashboards are generated for stakeholders.</p>
            </div>
          </div>
        </div>

        {/* IBM Envizi Data Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                <Database className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">IBM Envizi ESG Data</h2>
                <p className="text-gray-600">Real-time environmental metrics and sustainability KPIs</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="font-medium">Live Connection</span>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">Carbon Emissions</span>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">245,678</p>
              <p className="text-sm text-gray-500">tCO2e (YTD)</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">-12% vs LY</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">Water Usage</span>
                <span className="text-2xl">💧</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">49,432</p>
              <p className="text-sm text-gray-500">kL (YTD)</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">-8% vs LY</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">Energy Consumption</span>
                <Zap className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">12.4</p>
              <p className="text-sm text-gray-500">GWh (YTD)</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">-5% vs LY</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">Waste Diverted</span>
                <span className="text-2xl">♻️</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">87.3%</p>
              <p className="text-sm text-gray-500">Diversion Rate</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">+4% vs LY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
