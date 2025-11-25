'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
        <div className="max-w-7xl mx-auto text-white text-center">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Enterprise Analytics</h1>
          <p className="text-gray-400">Business intelligence and performance metrics</p>
        </div>

        {/* Analytics Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/enterprise/analytics/esg" className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 hover:shadow-xl transition">
            <div className="text-green-100 text-sm mb-1">ESG Performance</div>
            <div className="text-3xl font-bold text-white mb-2">
              {analyticsData?.esg?.score || 'N/A'}
            </div>
            <div className="text-green-100 text-xs">View detailed metrics →</div>
          </Link>

          <Link href="/enterprise/analytics/supplier" className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 hover:shadow-xl transition">
            <div className="text-blue-100 text-sm mb-1">Supplier Risk</div>
            <div className="text-3xl font-bold text-white mb-2">
              {analyticsData?.suppliers?.riskScore || 'N/A'}
            </div>
            <div className="text-blue-100 text-xs">View risk analysis →</div>
          </Link>

          <Link href="/enterprise/analytics/financial" className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 hover:shadow-xl transition">
            <div className="text-purple-100 text-sm mb-1">Revenue</div>
            <div className="text-3xl font-bold text-white mb-2">
              R{analyticsData?.financial?.revenue?.toLocaleString() || '0'}
            </div>
            <div className="text-purple-100 text-xs">View financials →</div>
          </Link>

          <Link href="/enterprise/analytics/agents" className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg p-6 hover:shadow-xl transition">
            <div className="text-orange-100 text-sm mb-1">AI Agent Usage</div>
            <div className="text-3xl font-bold text-white mb-2">
              {analyticsData?.agents?.totalCalls || '0'}
            </div>
            <div className="text-orange-100 text-xs">View agent stats →</div>
          </Link>
        </div>

        {/* IBM Integration Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">🤖 WatsonX Analytics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Orchestrations</span>
                <span className="text-white font-semibold">{analyticsData?.watsonx?.orchestrations || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Skills Invoked</span>
                <span className="text-white font-semibold">{analyticsData?.watsonx?.skills || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg Response Time</span>
                <span className="text-green-400 font-semibold">{analyticsData?.watsonx?.avgTime || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">📊 Envizi Analytics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Data Syncs</span>
                <span className="text-white font-semibold">{analyticsData?.envizi?.syncs || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Metrics Tracked</span>
                <span className="text-white font-semibold">{analyticsData?.envizi?.metrics || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Sync</span>
                <span className="text-blue-400 font-semibold">{analyticsData?.envizi?.lastSync || 'Never'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* TIS-Intellimat Integration Note */}
        <div className="bg-indigo-900/30 border border-indigo-500/50 rounded-lg p-6">
          <h3 className="text-indigo-300 font-semibold mb-2">🔗 TIS-Intellimat Analytics Engine</h3>
          <p className="text-gray-300 text-sm mb-4">
            Powered by TIS-Intellimat's advanced analytics platform, providing real-time business intelligence,
            predictive insights, and comprehensive reporting across ESG, financial, and operational metrics.
          </p>
          <div className="flex gap-3">
            <Link href="/enterprise/analytics/reports" className="text-indigo-400 hover:text-indigo-300 text-sm">
              View Reports →
            </Link>
            <Link href="/enterprise/analytics/export" className="text-indigo-400 hover:text-indigo-300 text-sm">
              Export Data →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
