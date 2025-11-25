'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      const data = await response.json();
      setClients(data.clients || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-white text-center">Loading clients...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Client Management</h1>
          <p className="text-gray-400">Manage your enterprise clients and relationships</p>
        </div>

        {/* Action Bar */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex gap-4">
            <Link
              href="/enterprise/clients/new"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
            >
              + Add New Client
            </Link>
            <Link
              href="/enterprise/registration"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
            >
              View Registrations
            </Link>
          </div>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-gray-800 rounded-lg">
              <p className="text-gray-400 text-lg mb-4">No clients found</p>
              <Link
                href="/enterprise/registration"
                className="text-indigo-400 hover:text-indigo-300"
              >
                Start with client registration →
              </Link>
            </div>
          ) : (
            clients.map((client: any) => (
              <div
                key={client.id}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition cursor-pointer"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{client.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{client.industry}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">ESG Score</span>
                  <span className="text-green-400 font-semibold">{client.esgScore || 'N/A'}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* TIS-Intellimat Integration Note */}
        <div className="mt-8 bg-indigo-900/30 border border-indigo-500/50 rounded-lg p-6">
          <h3 className="text-indigo-300 font-semibold mb-2">🔗 TIS-Intellimat Integration</h3>
          <p className="text-gray-300 text-sm">
            This module integrates with TIS-Intellimat for comprehensive client lifecycle management,
            CRM capabilities, and business intelligence.
          </p>
        </div>
      </div>
    </div>
  );
}
