'use client'

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <section className="text-center py-24 px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-6 text-indigo-700">
          IntelliMat ESG Navigator
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed mb-8">
          Africa’s first AI-powered ESG–GRC Automation Platform.
          Built in partnership with IBM & Anthropic.
        </p>

        <div className="flex gap-6 justify-center">
          <a href="/dashboard"
            className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition">
            Enter Platform
          </a>
          <a href="/assessments"
            className="bg-gray-200 text-gray-800 px-8 py-4 rounded-lg font-semibold hover:bg-gray-300 transition">
            ESG Assessments
          </a>
        </div>
      </section>

      <section className="py-16 bg-gray-50 border-t">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Powered by Enterprise-grade AI</h2>
          <p className="text-gray-600 text-lg">
            Watsonx + Anthropic + IBM Envizi — delivering real-time ESG, compliance, risk & operational intelligence.
          </p>
        </div>
      </section>
    </div>
  )
}
