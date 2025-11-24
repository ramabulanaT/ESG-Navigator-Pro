export default function TISIntelliMatHome() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900">
      <header className="container mx-auto px-6 py-8">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-white">
            TIS IntelliMat
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
            <a href="#solutions" className="text-gray-300 hover:text-white transition">Solutions</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition">Pricing</a>
            <a href="https://tisholdings.co.za" className="text-gray-300 hover:text-white transition">TIS Holdings</a>
          </div>
          <a
            href="/login"
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Sign In
          </a>
        </nav>
      </header>

      <section className="container mx-auto px-6 py-20 text-center">
        <div className="inline-block px-4 py-2 bg-emerald-600/20 text-emerald-300 rounded-full text-sm mb-6">
          ESG Navigator Platform
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Navigate Your Sustainability Journey
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
          AI-powered ESG management platform for comprehensive sustainability reporting,
          carbon accounting, and regulatory compliance.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <a
            href="/demo"
            className="px-8 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold"
          >
            Request Demo
          </a>
          <a
            href="/assessments"
            className="px-8 py-4 border border-white text-white rounded-lg hover:bg-white hover:text-slate-900 transition font-semibold"
          >
            Start Assessment
          </a>
        </div>
      </section>

      <section id="features" className="bg-white/5 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Platform Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 rounded-xl p-8">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">ESG Assessments</h3>
              <p className="text-gray-300">Comprehensive environmental, social, and governance assessments with AI-powered insights.</p>
            </div>
            <div className="bg-white/10 rounded-xl p-8">
              <div className="w-12 h-12 bg-teal-600 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Carbon Accounting</h3>
              <p className="text-gray-300">Track Scope 1, 2, and 3 emissions with automated data collection and reporting.</p>
            </div>
            <div className="bg-white/10 rounded-xl p-8">
              <div className="w-12 h-12 bg-cyan-600 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Compliance Reporting</h3>
              <p className="text-gray-300">Generate reports aligned with GRI, SASB, TCFD, and local regulatory requirements.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="solutions" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-12">AI-Powered Agents</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">🔍</div>
              <h4 className="font-semibold text-white mb-2">ESG Assessor</h4>
              <p className="text-sm text-gray-400">Automated ESG scoring</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">📊</div>
              <h4 className="font-semibold text-white mb-2">Emissions Accountant</h4>
              <p className="text-sm text-gray-400">Carbon tracking</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">🏢</div>
              <h4 className="font-semibold text-white mb-2">Supplier Screener</h4>
              <p className="text-sm text-gray-400">Supply chain ESG</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">📋</div>
              <h4 className="font-semibold text-white mb-2">Board Briefing Bot</h4>
              <p className="text-sm text-gray-400">Executive summaries</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 py-12 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400">&copy; {new Date().getFullYear()} TIS IntelliMat. All rights reserved.</p>
              <p className="text-gray-500 mt-1">A TIS Holdings Company</p>
            </div>
            <div className="flex space-x-6">
              <a href="https://tisholdings.co.za" className="text-gray-400 hover:text-white transition">TIS Holdings</a>
              <a href="/privacy" className="text-gray-400 hover:text-white transition">Privacy</a>
              <a href="/terms" className="text-gray-400 hover:text-white transition">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
