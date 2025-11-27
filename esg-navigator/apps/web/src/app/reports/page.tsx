'use client';

import { useState } from 'react';
import {
  FileText, Download, Calendar, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, Activity, BarChart3, Target
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('esg-overview');
  const [dateRange, setDateRange] = useState('last-quarter');

  // Sample data for visualizations
  const esgScoreData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Environmental Score',
        data: [65, 72, 78, 81, 85, 88],
        borderColor: 'rgb(34, 211, 238)',
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Social Score',
        data: [70, 74, 76, 79, 82, 84],
        borderColor: 'rgb(250, 204, 21)',
        backgroundColor: 'rgba(250, 204, 21, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Governance Score',
        data: [80, 82, 83, 85, 87, 90],
        borderColor: 'rgb(167, 139, 250)',
        backgroundColor: 'rgba(167, 139, 250, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const emissionsData = {
    labels: ['Scope 1', 'Scope 2', 'Scope 3'],
    datasets: [{
      label: 'CO₂ Emissions (tonnes)',
      data: [1240, 3580, 8920],
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(250, 204, 21, 0.8)',
      ],
      borderColor: [
        'rgb(239, 68, 68)',
        'rgb(251, 146, 60)',
        'rgb(250, 204, 21)',
      ],
      borderWidth: 2,
    }],
  };

  const supplierRiskData = {
    labels: ['High Risk', 'Medium Risk', 'Low Risk', 'Excellent'],
    datasets: [{
      data: [2, 8, 15, 25],
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(250, 204, 21, 0.8)',
        'rgba(34, 197, 94, 0.8)',
      ],
      borderColor: ['#ef4444', '#fb923c', '#facc15', '#22c55e'],
      borderWidth: 2,
    }],
  };

  const radarData = {
    labels: [
      'Carbon Management',
      'Water Usage',
      'Waste Management',
      'Labor Practices',
      'Community Impact',
      'Board Diversity',
    ],
    datasets: [
      {
        label: 'Current Performance',
        data: [88, 75, 82, 90, 78, 85],
        backgroundColor: 'rgba(34, 211, 238, 0.2)',
        borderColor: 'rgb(34, 211, 238)',
        borderWidth: 2,
      },
      {
        label: 'Industry Average',
        data: [70, 65, 68, 72, 70, 75],
        backgroundColor: 'rgba(156, 163, 175, 0.2)',
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
        ticks: {
          color: '#9ca3af',
          backdropColor: 'transparent'
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: '#fff', font: { size: 11 } }
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Header */}
      <div className="relative border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-white to-yellow-400 bg-clip-text text-transparent mb-2">
                ESG Performance Reports
              </h1>
              <p className="text-gray-400">Comprehensive analytics and insights for Q2 2024</p>
            </div>
            <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>

          {/* Report Type Selector */}
          <div className="flex gap-4 mt-6">
            {[
              { id: 'esg-overview', label: 'ESG Overview', icon: BarChart3 },
              { id: 'emissions', label: 'Emissions Report', icon: Activity },
              { id: 'compliance', label: 'Compliance Status', icon: CheckCircle },
              { id: 'risk-analysis', label: 'Risk Analysis', icon: AlertTriangle },
            ].map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedReport === report.id
                    ? 'bg-gradient-to-r from-cyan-400 to-yellow-400 text-black'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <report.icon className="w-4 h-4" />
                {report.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: 'Overall ESG Score',
              value: '87.5',
              change: '+5.2%',
              trend: 'up',
              icon: Target,
              color: 'cyan'
            },
            {
              label: 'Carbon Reduction',
              value: '23%',
              change: '+8.1%',
              trend: 'up',
              icon: TrendingDown,
              color: 'green'
            },
            {
              label: 'Compliance Rate',
              value: '96%',
              change: '+2.5%',
              trend: 'up',
              icon: CheckCircle,
              color: 'yellow'
            },
            {
              label: 'Risk Level',
              value: 'Low',
              change: '-15%',
              trend: 'down',
              icon: AlertTriangle,
              color: 'purple'
            },
          ].map((metric, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="flex items-center justify-between mb-4">
                <metric.icon className={`w-8 h-8 text-${metric.color}-400`} />
                <span className={`flex items-center gap-1 text-sm font-semibold ${
                  metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {metric.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {metric.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{metric.value}</h3>
              <p className="text-sm text-gray-400">{metric.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* ESG Score Trends */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              ESG Score Trends
            </h3>
            <div className="h-80">
              <Line data={esgScoreData} options={chartOptions} />
            </div>
          </div>

          {/* Performance Radar */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-yellow-400" />
              Performance vs Industry
            </h3>
            <div className="h-80">
              <Radar data={radarData} options={radarOptions} />
            </div>
          </div>

          {/* Emissions Breakdown */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-400" />
              Carbon Emissions by Scope
            </h3>
            <div className="h-80">
              <Bar data={emissionsData} options={chartOptions} />
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Emissions:</span>
                <span className="text-white font-semibold">13,740 tonnes CO₂</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Reduction Target 2024:</span>
                <span className="text-green-400 font-semibold">-25%</span>
              </div>
            </div>
          </div>

          {/* Supplier Risk Distribution */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Supplier Risk Distribution
            </h3>
            <div className="h-80 flex items-center justify-center">
              <div className="w-full max-w-sm">
                <Doughnut
                  data={supplierRiskData}
                  options={{
                    ...chartOptions,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: { color: '#fff', padding: 15 }
                      }
                    }
                  }}
                />
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-400">Total Suppliers: <span className="text-white font-semibold">50</span></p>
            </div>
          </div>
        </div>

        {/* Risk Matrix */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            ESG Risk Matrix
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Risk Category</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-semibold">Likelihood</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-semibold">Impact</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-semibold">Risk Score</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-semibold">Status</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Mitigation</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    category: 'Carbon Emissions',
                    likelihood: 'Medium',
                    impact: 'High',
                    score: 'Medium',
                    status: 'Active',
                    mitigation: 'Carbon offset program implemented'
                  },
                  {
                    category: 'Supply Chain Labor',
                    likelihood: 'Low',
                    impact: 'High',
                    score: 'Low',
                    status: 'Monitored',
                    mitigation: 'Regular audits & supplier code of conduct'
                  },
                  {
                    category: 'Water Usage',
                    likelihood: 'Medium',
                    impact: 'Medium',
                    score: 'Low',
                    status: 'Active',
                    mitigation: 'Water recycling systems deployed'
                  },
                  {
                    category: 'Waste Management',
                    likelihood: 'Low',
                    impact: 'Medium',
                    score: 'Low',
                    status: 'Resolved',
                    mitigation: 'Zero-waste initiative in progress'
                  },
                  {
                    category: 'Board Diversity',
                    likelihood: 'Low',
                    impact: 'Low',
                    score: 'Low',
                    status: 'Monitored',
                    mitigation: 'Diversity hiring targets set'
                  },
                ].map((risk, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-4 px-4 text-white font-medium">{risk.category}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        risk.likelihood === 'High' ? 'bg-red-500/20 text-red-400' :
                        risk.likelihood === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {risk.likelihood}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        risk.impact === 'High' ? 'bg-red-500/20 text-red-400' :
                        risk.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {risk.impact}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        risk.score === 'High' ? 'bg-red-500/20 text-red-400' :
                        risk.score === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {risk.score}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        risk.status === 'Active' ? 'bg-blue-500/20 text-blue-400' :
                        risk.status === 'Resolved' ? 'bg-green-500/20 text-green-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {risk.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-300 text-sm">{risk.mitigation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Recommended Actions
          </h3>
          <div className="space-y-3">
            {[
              { priority: 'High', action: 'Complete Scope 3 emissions audit for supplier network', due: '2 weeks' },
              { priority: 'Medium', action: 'Update water usage reporting for Q3', due: '1 month' },
              { priority: 'Medium', action: 'Schedule board diversity training session', due: '3 weeks' },
              { priority: 'Low', action: 'Review and update sustainability policy documentation', due: '2 months' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition">
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                    item.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {item.priority}
                  </span>
                  <span className="text-white">{item.action}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  {item.due}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
