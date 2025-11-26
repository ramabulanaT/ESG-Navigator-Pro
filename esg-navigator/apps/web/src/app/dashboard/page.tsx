'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const [suppliers, setSuppliers] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await api.getSuppliers();
      setSuppliers(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading suppliers:', error);
      setLoading(false);
    }
  };

  const handleChat = async () => {
    if (!chatMessage.trim()) return;
    
    setChatLoading(true);
    try {
      const result = await api.chat(chatMessage, chatHistory);
      
      setChatHistory([
        ...chatHistory,
        { role: 'user', content: chatMessage },
        { role: 'assistant', content: result.response }
      ]);
      setChatMessage('');
    } catch (error) {
      console.error('Chat error:', error);
      alert('Error connecting to AI. Check backend.');
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">ESG Dashboard</h1>
          <p className="text-gray-600">Real-time supplier intelligence & compliance monitoring</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon="✅"
            value={suppliers?.portfolio.overallCompliance}
            label="ESG Compliance"
            trend="+2.4%"
            color="green"
          />
          <MetricCard
            icon="🏢"
            value={suppliers?.portfolio.activeSuppliers}
            label="Active Suppliers"
            trend="Stable"
            color="blue"
          />
          <MetricCard
            icon="💰"
            value={suppliers?.portfolio.totalValue}
            label="Portfolio Value"
            trend="+5.2%"
            color="purple"
          />
          <MetricCard
            icon="⚠️"
            value="1"
            label="High Risk"
            trend="-1"
            color="red"
          />
        </div>

        {/* Suppliers List */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Supplier Portfolio</h2>
          <div className="space-y-4">
            {suppliers?.suppliers.map((supplier: any) => (
              <SupplierCard key={supplier.id} supplier={supplier} />
            ))}
          </div>
        </div>

        {/* AI Chat Interface */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">💬 AI Assistant</h2>
          
          <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
            {chatHistory.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <p className="mb-4">Ask me anything about your ESG portfolio!</p>
                <div className="space-y-2 text-sm">
                  <p>Try: &quot;Which supplier has the highest ESG risk?&quot;</p>
                  <p>Try: &quot;Generate an executive report&quot;</p>
                  <p>Try: &quot;Calculate our financial risk exposure&quot;</p>
                </div>
              </div>
            ) : (
              chatHistory.map((msg, idx) => (
                <div key={idx} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-3 rounded-lg max-w-2xl ${
                    msg.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-900'
                  }`}>
                    <strong>{msg.role === 'user' ? '👤 You' : '🤖 Claude'}:</strong>
                    <p className="mt-1">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !chatLoading && handleChat()}
              placeholder="Ask about ESG risks, compliance, or suppliers..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={chatLoading}
            />
            <button
              onClick={handleChat}
              disabled={chatLoading || !chatMessage.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {chatLoading ? '⏳' : '🚀'} Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, value, label, trend, color }: any) {
  const colors: any = {
    green: 'bg-green-50 text-green-700',
    blue: 'bg-blue-50 text-blue-700',
    purple: 'bg-purple-50 text-purple-700',
    red: 'bg-red-50 text-red-700'
  };

  return (
    <div className={`${colors[color]} rounded-lg p-6`}>
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm font-medium mb-2">{label}</div>
      <div className="text-xs font-semibold">{trend}</div>
    </div>
  );
}

function SupplierCard({ supplier }: any) {
  const riskColors: any = {
    HIGH: 'bg-red-100 text-red-800 border-red-300',
    MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    LOW: 'bg-green-100 text-green-800 border-green-300'
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold">{supplier.name}</h3>
          <p className="text-gray-600">Contract Value: {supplier.contractValue}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${riskColors[supplier.riskLevel]}`}>
          {supplier.riskLevel} RISK
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-3">
        <div>
          <div className="text-sm text-gray-600">ESG Score</div>
          <div className="text-2xl font-bold">{supplier.esgScore}/100</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Compliance Issues</div>
          <div className="text-2xl font-bold">{supplier.complianceIssues}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Carbon Intensity</div>
          <div className="text-sm font-semibold uppercase">{supplier.carbonIntensity}</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Last Audit: {supplier.lastAudit}
        </div>
        <button className="text-blue-600 text-sm font-semibold hover:underline">
          View Details →
        </button>
      </div>
    </div>
  );
}
