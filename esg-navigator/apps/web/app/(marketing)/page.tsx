import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              ESG Navigator
            </h1>
            <p className="text-2xl text-gray-300 mb-8">
              AI-Powered ESG-GRC Automation Platform
            </p>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12">
              Enterprise-grade ESG governance powered by <span className="text-indigo-400">Anthropic Claude</span>,
              {' '}<span className="text-blue-400">IBM WatsonX</span>, <span className="text-green-400">Envizi</span>,
              {' '}and <span className="text-purple-400">TIS-Intellimat</span>
            </p>
          </div>
        </div>
      </header>

      {/* Two Business Divisions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Education Division */}
          <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 hover:shadow-2xl hover:shadow-blue-500/20 transition duration-300">
            <div className="flex items-center mb-6">
              <span className="text-5xl mr-4">🎓</span>
              <div>
                <h2 className="text-3xl font-bold text-white">Education</h2>
                <p className="text-blue-300">SMB • Training • Compliance</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6">
              Learn and implement ESG best practices with guided assessments, comprehensive training modules,
              and certification programs.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">ISO Framework Assessments (14001, 45001, 50001, GISTM)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">9 Training Modules (Beginner to Advanced)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">Self-serve implementation guides</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">Compliance tracking & certification</span>
              </li>
            </ul>

            <div className="flex gap-4">
              <Link
                href="/education/assessments"
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-center transition"
              >
                Start Assessment
              </Link>
              <Link
                href="/education/training"
                className="flex-1 px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500 rounded-lg font-semibold text-center transition"
              >
                View Training
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-blue-500/30">
              <p className="text-blue-200 text-sm font-semibold">Target: SMBs, Mid-market</p>
              <p className="text-gray-400 text-sm">$1K-10K ARR</p>
            </div>
          </div>

          {/* Enterprise Division */}
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 hover:shadow-2xl hover:shadow-purple-500/20 transition duration-300">
            <div className="flex items-center mb-6">
              <span className="text-5xl mr-4">🏢</span>
              <div>
                <h2 className="text-3xl font-bold text-white">Enterprise</h2>
                <p className="text-purple-300">AI Intelligence • IBM Integration • TIS-Intellimat</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6">
              AI-powered ESG intelligence platform with real-time monitoring, predictive analytics,
              and enterprise-grade integrations.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">9 Specialized AI Agents (Claude-powered)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">IBM WatsonX Orchestrate Integration</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">Envizi ESG Suite Data Sync</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">TIS-Intellimat CRM & Business Intelligence</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">Supplier Risk Automation (R331M+ portfolio)</span>
              </li>
            </ul>

            <div className="flex gap-4">
              <Link
                href="/enterprise/dashboard"
                className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-center transition"
              >
                Enter Platform
              </Link>
              <Link
                href="/enterprise/ai-insights"
                className="flex-1 px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500 rounded-lg font-semibold text-center transition"
              >
                AI Insights
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-purple-500/30">
              <p className="text-purple-200 text-sm font-semibold">Target: Fortune 500, Enterprises</p>
              <p className="text-gray-400 text-sm">$50K-500K ARR</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Powered By</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🤖</div>
            <h4 className="text-white font-semibold mb-1">Anthropic Claude</h4>
            <p className="text-gray-400 text-sm">9 AI Agents</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">💼</div>
            <h4 className="text-white font-semibold mb-1">IBM WatsonX</h4>
            <p className="text-gray-400 text-sm">Orchestration</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">📊</div>
            <h4 className="text-white font-semibold mb-1">IBM Envizi</h4>
            <p className="text-gray-400 text-sm">ESG Data</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h4 className="text-white font-semibold mb-1">TIS-Intellimat</h4>
            <p className="text-gray-400 text-sm">Business Intel</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Transform Your ESG Operations?</h3>
          <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
            Choose the solution that fits your organization's needs and scale.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/marketing/demo"
              className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Schedule Demo
            </Link>
            <Link
              href="/marketing/login"
              className="px-8 py-4 bg-indigo-500/20 text-white border border-white/30 rounded-lg font-semibold hover:bg-indigo-500/30 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-500">
            <p className="mb-2">© 2024 ESG Navigator. All rights reserved.</p>
            <p className="text-sm">Powered by TIS-Intellimat • IBM WatsonX • IBM Envizi • Anthropic Claude</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
