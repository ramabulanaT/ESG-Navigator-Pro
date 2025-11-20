'use client'

import Link from 'next/link'
import { CheckCircle, Clock, FileCheck, Shield, Zap, Mountain } from 'lucide-react'

const assessments = [
  { id: 'iso-14001', title: 'ISO 14001', subtitle: 'Environmental Management', icon: '🌍', status: 'completed', score: 95, lastUpdated: '2 days ago', IconComponent: FileCheck },
  { id: 'iso-45001', title: 'ISO 45001', subtitle: 'Health & Safety', icon: '🏥', status: 'in-progress', progress: 65, lastUpdated: '1 day ago', IconComponent: Shield },
  { id: 'iso-50001', title: 'ISO 50001', subtitle: 'Energy Management', icon: '⚡', status: 'not-started', lastUpdated: 'Never', IconComponent: Zap },
  { id: 'gistm', title: 'GISTM', subtitle: 'Tailings Storage', icon: '⛏️', status: 'not-started', lastUpdated: 'Never', IconComponent: Mountain }
]

export default function AssessmentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">ESG Assessments</h1>
            <p className="text-gray-600 mt-2">Evaluate compliance across multiple ESG & ISO frameworks</p>
          </div>
          <Link href="/dashboard" className="px-5 py-3 bg-gray-200 rounded-lg">← Back</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {assessments.map(a => {
          const Icon = a.IconComponent
          return (
            <div key={a.id} className="bg-white p-8 shadow rounded-xl border">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-indigo-500 text-white rounded-xl text-3xl flex items-center justify-center">
                    {a.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{a.title}</h3>
                    <p className="text-gray-600">{a.subtitle}</p>
                  </div>
                </div>

                {a.status === 'completed' && (
                  <div className="px-4 py-2 bg-green-100 text-green-600 rounded-full font-semibold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    {a.score}%
                  </div>
                )}

                {a.status === 'in-progress' && (
                  <div className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full font-semibold flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {a.progress}%
                  </div>
                )}

                {a.status === 'not-started' && (
                  <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full font-semibold">
                    Not Started
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
