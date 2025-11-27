'use client';

import { useState } from 'react';
import {
  Sparkles, TrendingUp, AlertCircle, CheckCircle2, Clock,
  Target, Zap, Brain, ArrowRight, ThumbsUp, Download
} from 'lucide-react';

interface Recommendation {
  id: string;
  category: 'Environmental' | 'Social' | 'Governance';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  impact: string;
  effort: string;
  timeline: string;
  roi: string;
  status: 'New' | 'In Progress' | 'Completed';
  aiConfidence: number;
}

export default function RecommendationsPage() {
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('priority');

  const recommendations: Recommendation[] = [
    {
      id: '1',
      category: 'Environmental',
      priority: 'Critical',
      title: 'Implement Renewable Energy Transition Plan',
      description: 'AI analysis indicates your energy consumption patterns show 78% dependency on non-renewable sources. Transitioning to solar and wind energy could reduce carbon footprint by 45% within 18 months.',
      impact: 'Very High',
      effort: 'High',
      timeline: '18 months',
      roi: '3.2x over 5 years',
      status: 'New',
      aiConfidence: 94
    },
    {
      id: '2',
      category: 'Environmental',
      priority: 'High',
      title: 'Optimize Supply Chain Carbon Footprint',
      description: 'Machine learning models identified 12 high-emission suppliers. Switching to alternative suppliers or implementing carbon offset programs could reduce Scope 3 emissions by 28%.',
      impact: 'High',
      effort: 'Medium',
      timeline: '6 months',
      roi: '2.8x over 3 years',
      status: 'In Progress',
      aiConfidence: 89
    },
    {
      id: '3',
      category: 'Social',
      priority: 'High',
      title: 'Enhance Supplier Labor Standards Monitoring',
      description: 'AI risk assessment flagged 3 suppliers with potential labor compliance issues. Implementing automated monitoring and audit protocols will improve compliance scores by an estimated 35%.',
      impact: 'High',
      effort: 'Medium',
      timeline: '4 months',
      roi: '1.9x over 2 years',
      status: 'New',
      aiConfidence: 87
    },
    {
      id: '4',
      category: 'Governance',
      priority: 'Medium',
      title: 'Improve Board Diversity Metrics',
      description: 'Current board diversity scores 15% below industry standards. Targeted recruitment initiatives could improve governance ratings and unlock access to ESG-focused investment funds.',
      impact: 'Medium',
      effort: 'Low',
      timeline: '12 months',
      roi: '2.1x over 4 years',
      status: 'New',
      aiConfidence: 82
    },
    {
      id: '5',
      category: 'Environmental',
      priority: 'Medium',
      title: 'Deploy Water Recycling Infrastructure',
      description: 'Predictive analytics show water consumption 22% above sector average. Installing closed-loop water systems in 3 key facilities will reduce usage by 40% and operational costs by $180K annually.',
      impact: 'Medium',
      effort: 'High',
      timeline: '10 months',
      roi: '2.5x over 5 years',
      status: 'New',
      aiConfidence: 91
    },
    {
      id: '6',
      category: 'Social',
      priority: 'Low',
      title: 'Expand Community Engagement Programs',
      description: 'Sentiment analysis of community feedback suggests opportunities to strengthen local partnerships. Enhanced programs could improve social license to operate and reduce regulatory friction.',
      impact: 'Low',
      effort: 'Low',
      timeline: '6 months',
      roi: '1.4x over 3 years',
      status: 'Completed',
      aiConfidence: 76
    },
    {
      id: '7',
      category: 'Governance',
      priority: 'High',
      title: 'Strengthen Climate Risk Disclosure',
      description: 'Current TCFD reporting gaps identified by NLP analysis. Comprehensive climate risk disclosures will improve investor confidence and ESG ratings by an estimated 12 points.',
      impact: 'High',
      effort: 'Medium',
      timeline: '3 months',
      roi: '3.5x over 2 years',
      status: 'In Progress',
      aiConfidence: 93
    },
    {
      id: '8',
      category: 'Environmental',
      priority: 'Medium',
      title: 'Implement Circular Economy Waste Program',
      description: 'AI-powered waste stream analysis reveals 65% of materials are recyclable but currently landfilled. Circular economy initiatives could generate $220K in recovered material value annually.',
      impact: 'Medium',
      effort: 'Medium',
      timeline: '8 months',
      roi: '2.2x over 4 years',
      status: 'New',
      aiConfidence: 85
    },
  ];

  const filteredRecommendations = recommendations
    .filter(rec => filter === 'all' || rec.category === filter || rec.priority === filter || rec.status === filter)
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sortBy === 'confidence') {
        return b.aiConfidence - a.aiConfidence;
      }
      return 0;
    });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'red';
      case 'High': return 'orange';
      case 'Medium': return 'yellow';
      case 'Low': return 'blue';
      default: return 'gray';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Environmental': return '🌍';
      case 'Social': return '👥';
      case 'Governance': return '⚖️';
      default: return '📊';
    }
  };

  const stats = {
    total: recommendations.length,
    critical: recommendations.filter(r => r.priority === 'Critical').length,
    inProgress: recommendations.filter(r => r.status === 'In Progress').length,
    avgConfidence: Math.round(recommendations.reduce((sum, r) => sum + r.aiConfidence, 0) / recommendations.length)
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Header */}
      <div className="relative border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-yellow-400 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                <Brain className="w-10 h-10 text-cyan-400" />
                AI-Powered Recommendations
              </h1>
              <p className="text-gray-400">Intelligent insights to accelerate your ESG journey</p>
            </div>
            <button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
              <Download className="w-5 h-5" />
              Export All
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                label: 'Total Recommendations',
                value: stats.total,
                icon: Sparkles,
                color: 'cyan',
                gradient: 'from-cyan-500 to-blue-500'
              },
              {
                label: 'Critical Priority',
                value: stats.critical,
                icon: AlertCircle,
                color: 'red',
                gradient: 'from-red-500 to-orange-500'
              },
              {
                label: 'In Progress',
                value: stats.inProgress,
                icon: Clock,
                color: 'yellow',
                gradient: 'from-yellow-500 to-orange-500'
              },
              {
                label: 'AI Confidence',
                value: `${stats.avgConfidence}%`,
                icon: Brain,
                color: 'purple',
                gradient: 'from-purple-500 to-pink-500'
              },
            ].map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="relative max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-400 text-black'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('Critical')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'Critical'
                  ? 'bg-gradient-to-r from-red-400 to-orange-400 text-black'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              Critical
            </button>
            <button
              onClick={() => setFilter('Environmental')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'Environmental'
                  ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-black'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              🌍 Environmental
            </button>
            <button
              onClick={() => setFilter('Social')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'Social'
                  ? 'bg-gradient-to-r from-blue-400 to-cyan-400 text-black'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              👥 Social
            </button>
            <button
              onClick={() => setFilter('Governance')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'Governance'
                  ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-black'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              ⚖️ Governance
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-cyan-400"
          >
            <option value="priority" className="bg-gray-900">Sort by Priority</option>
            <option value="confidence" className="bg-gray-900">Sort by AI Confidence</option>
          </select>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{getCategoryIcon(rec.category)}</div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{rec.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${getPriorityColor(rec.priority)}-500/20 text-${getPriorityColor(rec.priority)}-400`}>
                        {rec.priority} Priority
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        rec.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                        rec.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {rec.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-1">{rec.category}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-lg">
                    <Brain className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-semibold text-purple-400">{rec.aiConfidence}% AI Confidence</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 mb-4 leading-relaxed">{rec.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-gray-400">Impact</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{rec.impact}</p>
                </div>

                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-gray-400">Effort</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{rec.effort}</p>
                </div>

                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-gray-400">Timeline</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{rec.timeline}</p>
                </div>

                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-gray-400">ROI</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{rec.roi}</p>
                </div>
              </div>

              <div className="flex gap-3">
                {rec.status === 'New' && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-black rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                    <CheckCircle2 className="w-4 h-4" />
                    Start Implementation
                  </button>
                )}
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg font-medium hover:bg-white/10 transition-all">
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg font-medium hover:bg-white/10 transition-all">
                  <ThumbsUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* AI Insights Summary */}
        <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">AI Analysis Summary</h3>
              <p className="text-gray-300 leading-relaxed">
                Our AI has analyzed 847 data points across your ESG performance metrics, supplier network, and industry benchmarks.
                The recommendations above represent the highest-impact opportunities based on machine learning models trained on
                successful ESG transformations across 2,500+ organizations. Implementing the critical and high-priority items
                could improve your overall ESG score by an estimated <span className="text-cyan-400 font-semibold">23-31 points</span> within
                the next 12 months, potentially unlocking <span className="text-yellow-400 font-semibold">$2.4M in ESG-linked financing opportunities</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
