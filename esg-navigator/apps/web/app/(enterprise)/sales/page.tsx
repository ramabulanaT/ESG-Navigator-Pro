'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    monthlyGrowth: 0,
    activeDeals: 0,
  });

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const response = await fetch('/api/sales');
      const data = await response.json();
      setSales(data.sales || []);
      setMetrics(data.metrics || metrics);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Sales Pipeline</h1>
          <p className="text-gray-400">Track deals, revenue, and sales performance</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6">
            <div className="text-green-100 text-sm mb-1">Total Revenue</div>
            <div className="text-3xl font-bold text-white">
              R{metrics.totalRevenue.toLocaleString()}
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6">
            <div className="text-blue-100 text-sm mb-1">Monthly Growth</div>
            <div className="text-3xl font-bold text-white">
              +{metrics.monthlyGrowth}%
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6">
            <div className="text-purple-100 text-sm mb-1">Active Deals</div>
            <div className="text-3xl font-bold text-white">
              {metrics.activeDeals}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mb-6">
          <Link
            href="/enterprise/sales/new"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition inline-block"
          >
            + New Deal
          </Link>
        </div>

        {/* Sales List */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Deal</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Client</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Value</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                    No sales data available
                  </td>
                </tr>
              ) : (
                sales.map((sale: any) => (
                  <tr key={sale.id} className="hover:bg-gray-750 cursor-pointer">
                    <td className="px-6 py-4 text-white">{sale.name}</td>
                    <td className="px-6 py-4 text-gray-300">{sale.client}</td>
                    <td className="px-6 py-4 text-green-400 font-semibold">R{sale.value?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        sale.status === 'won' ? 'bg-green-900 text-green-300' :
                        sale.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* TIS-Intellimat Integration Note */}
        <div className="mt-8 bg-indigo-900/30 border border-indigo-500/50 rounded-lg p-6">
          <h3 className="text-indigo-300 font-semibold mb-2">🔗 TIS-Intellimat Sales Module</h3>
          <p className="text-gray-300 text-sm">
            Integrated with TIS-Intellimat for advanced sales pipeline management,
            forecasting, and revenue analytics.
          </p>
        </div>
      </div>
    </div>
  );
}
