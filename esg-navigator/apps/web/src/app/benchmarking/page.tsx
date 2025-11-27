'use client';

import { useState } from 'react';
import {
  TrendingUp, Award, Target, BarChart3, ArrowUp, ArrowDown,
  Building2, Globe, Users, Shield, Zap, CheckCircle
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
} from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

export default function BenchmarkingPage() {
  const [selectedIndustry, setSelectedIndustry] = useState('manufacturing');
  const [selectedRegion, setSelectedRegion] = useState('africa');

  // Benchmark data
  const yourScores = {
    environmental: 88,
    social: 84,
    governance: 90,
    overall: 87.5
  };

  const industryAverages = {
    manufacturing: { environmental: 72, social: 68, governance: 75, overall: 71.7 },
    technology: { environmental: 78, social: 82, governance: 80, overall: 80 },
    finance: { environmental: 70, social: 76, governance: 85, overall: 77 },
    retail: { environmental: 68, social: 70, governance: 72, overall: 70 }
  };

  const topPerformers = {
    manufacturing: { environmental: 92, social: 88, governance: 94, overall: 91.3 },
    technology: { environmental: 95, social: 93, governance: 92, overall: 93.3 },
    finance: { environmental: 88, social: 90, governance: 96, overall: 91.3 },
    retail: { environmental: 85, social: 87, governance: 89, overall: 87 }
  };

  const current = industryAverages[selectedIndustry as keyof typeof industryAverages];
  const topPerf = topPerformers[selectedIndustry as keyof typeof topPerformers];

  const comparisonData = {
    labels: ['Environmental', 'Social', 'Governance', 'Overall ESG'],
    datasets: [
      {
        label: 'Your Company',
        data: [yourScores.environmental, yourScores.social, yourScores.governance, yourScores.overall],
        backgroundColor: 'rgba(34, 211, 238, 0.8)',
        borderColor: 'rgb(34, 211, 238)',
        borderWidth: 2,
      },
      {
        label: 'Industry Average',
        data: [current.environmental, current.social, current.governance, current.overall],
        backgroundColor: 'rgba(156, 163, 175, 0.6)',
        borderColor: 'rgb(156, 163, 175)',
        borderWidth: 2,
      },
      {
        label: 'Top 10% Performers',
        data: [topPerf.environmental, topPerf.social, topPerf.governance, topPerf.overall],
        backgroundColor: 'rgba(250, 204, 21, 0.6)',
        borderColor: 'rgb(250, 204, 21)',
        borderWidth: 2,
      },
    ],
  };

  const radarData = {
    labels: [
      'Carbon Emissions',
      'Energy Efficiency',
      'Water Management',
      'Waste Reduction',
      'Labor Practices',
      'Community Engagement',
      'Diversity & Inclusion',
      'Board Independence',
      'Ethics & Compliance',
      'Risk Management',
    ],
    datasets: [
      {
        label: 'Your Company',
        data: [88, 85, 82, 90, 87, 78, 84, 92, 91, 89],
        backgroundColor: 'rgba(34, 211, 238, 0.2)',
        borderColor: 'rgb(34, 211, 238)',
        borderWidth: 2,
      },
      {
        label: 'Industry Average',
        data: [70, 68, 65, 72, 70, 68, 72, 75, 74, 71],
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        borderColor: 'rgb(156, 163, 175)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#fff',
          font: { size: 12 }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#fff',
          font: { size: 12 }
        }
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: '#9ca3af',
          backdropColor: 'transparent',
          stepSize: 20
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: '#fff', font: { size: 10 } }
      }
    }
  };

  const metrics = [
    {
      category: 'Environmental',
      yourScore: yourScores.environmental,
      industry: current.environmental,
      topPerf: topPerf.environmental,
      icon: Globe,
      color: 'green'
    },
    {
      category: 'Social',
      yourScore: yourScores.social,
      industry: current.social,
      topPerf: topPerf.social,
      icon: Users,
      color: 'blue'
    },
    {
      category: 'Governance',
      yourScore: yourScores.governance,
      industry: current.governance,
      topPerf: topPerf.governance,
      icon: Shield,
      color: 'purple'
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Header */}
      <div className="relative border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-cyan-400 to-white bg-clip-text text-transparent mb-2 flex items-center gap-3">
                <Award className="w-10 h-10 text-yellow-400" />
                Industry Benchmarking
              </h1>
              <p className="text-gray-400">Compare your ESG performance against industry leaders</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Industry Sector</label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-cyan-400"
              >
                <option value="manufacturing" className="bg-gray-900">Manufacturing</option>
                <option value="technology" className="bg-gray-900">Technology</option>
                <option value="finance" className="bg-gray-900">Financial Services</option>
                <option value="retail" className="bg-gray-900">Retail</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-cyan-400"
              >
                <option value="africa" className="bg-gray-900">Africa</option>
                <option value="global" className="bg-gray-900">Global</option>
                <option value="europe" className="bg-gray-900">Europe</option>
                <option value="americas" className="bg-gray-900">Americas</option>
                <option value="asia" className="bg-gray-900">Asia Pacific</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Performance Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const vsIndustry = metric.yourScore - metric.industry;
            const vsTopPerf = metric.yourScore - metric.topPerf;

            return (
              <div key={index} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <metric.icon className={`w-8 h-8 text-${metric.color}-400`} />
                  <span className="text-3xl font-bold text-white">{metric.yourScore}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-4">{metric.category}</h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">vs Industry Avg ({metric.industry})</span>
                    <span className={`flex items-center gap-1 font-semibold ${
                      vsIndustry > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {vsIndustry > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                      {Math.abs(vsIndustry)} pts
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">vs Top 10% ({metric.topPerf})</span>
                    <span className={`flex items-center gap-1 font-semibold ${
                      vsTopPerf > 0 ? 'text-green-400' : 'text-orange-400'
                    }`}>
                      {vsTopPerf > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                      {Math.abs(vsTopPerf)} pts
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart Comparison */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              ESG Score Comparison
            </h3>
            <div className="h-80">
              <Bar data={comparisonData} options={chartOptions} />
            </div>
          </div>

          {/* Radar Chart */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-yellow-400" />
              Detailed Metrics Radar
            </h3>
            <div className="h-80">
              <Radar data={radarData} options={radarOptions} />
            </div>
          </div>
        </div>

        {/* Percentile Ranking */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Your Percentile Ranking
          </h3>

          <div className="space-y-6">
            {[
              { label: 'Environmental Performance', score: 88, percentile: 82, color: 'green' },
              { label: 'Social Responsibility', score: 84, percentile: 76, color: 'blue' },
              { label: 'Governance Standards', score: 90, percentile: 88, color: 'purple' },
              { label: 'Overall ESG Score', score: 87.5, percentile: 85, color: 'cyan' },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{item.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400">Score: {item.score}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${item.color}-500/20 text-${item.color}-400`}>
                      Top {100 - item.percentile}%
                    </span>
                  </div>
                </div>
                <div className="relative w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full bg-gradient-to-r from-${item.color}-600 to-${item.color}-400 rounded-full transition-all duration-1000`}
                    style={{ width: `${item.percentile}%` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-1 h-6 bg-white/50"
                    style={{ left: '50%' }}
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-400">
                      50th
                    </span>
                  </div>
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-1 h-6 bg-white/50"
                    style={{ left: '75%' }}
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-400">
                      75th
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competitive Advantages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <div className="bg-gradient-to-br from-green-500/10 to-cyan-500/10 backdrop-blur-xl border border-green-500/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Competitive Strengths
            </h3>
            <div className="space-y-3">
              {[
                { area: 'Governance Standards', advantage: '+15 pts above industry average' },
                { area: 'Carbon Emissions Tracking', advantage: 'Top 12% globally' },
                { area: 'Board Diversity', advantage: 'Exceeds best practice guidelines' },
                { area: 'Compliance Reporting', advantage: '100% disclosure rate' },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">{item.area}</p>
                    <p className="text-sm text-gray-400">{item.advantage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Improvement Opportunities */}
          <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 backdrop-blur-xl border border-orange-500/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-400" />
              Improvement Opportunities
            </h3>
            <div className="space-y-3">
              {[
                { area: 'Community Engagement', gap: '10 pts gap to top performers' },
                { area: 'Water Usage Efficiency', gap: '7 pts below industry leaders' },
                { area: 'Supply Chain Transparency', gap: 'Opportunity for enhancement' },
                { area: 'Climate Risk Disclosure', gap: 'TCFD alignment needed' },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                  <Zap className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">{item.area}</p>
                    <p className="text-sm text-gray-400">{item.gap}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Industry Leaders Comparison */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            Comparison with Industry Leaders
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Rank</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Company</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-semibold">Environmental</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-semibold">Social</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-semibold">Governance</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-semibold">Overall Score</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { rank: '1', company: 'Industry Leader A', env: 95, soc: 93, gov: 96, overall: 94.7 },
                  { rank: '2', company: 'Industry Leader B', env: 92, soc: 91, gov: 94, overall: 92.3 },
                  { rank: '3', company: 'Industry Leader C', env: 91, soc: 88, gov: 93, overall: 90.7 },
                  { rank: '7', company: 'Your Company', env: 88, soc: 84, gov: 90, overall: 87.5, highlight: true },
                  { rank: '—', company: 'Industry Average', env: 72, soc: 68, gov: 75, overall: 71.7, average: true },
                ].map((row, index) => (
                  <tr
                    key={index}
                    className={`border-b border-white/5 ${
                      row.highlight
                        ? 'bg-cyan-500/20 hover:bg-cyan-500/30'
                        : row.average
                        ? 'bg-gray-500/10'
                        : 'hover:bg-white/5'
                    } transition`}
                  >
                    <td className="py-4 px-4 text-white font-semibold">{row.rank}</td>
                    <td className="py-4 px-4 text-white font-medium">
                      {row.company}
                      {row.highlight && <span className="ml-2 px-2 py-1 bg-cyan-400 text-black text-xs font-bold rounded">YOU</span>}
                    </td>
                    <td className="py-4 px-4 text-center text-white">{row.env}</td>
                    <td className="py-4 px-4 text-center text-white">{row.soc}</td>
                    <td className="py-4 px-4 text-center text-white">{row.gov}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white/10 text-white">
                        {row.overall}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
