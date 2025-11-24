export default function TISHoldingsHome() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <header className="container mx-auto px-6 py-8">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-white">
            TIS Holdings
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#about" className="text-gray-300 hover:text-white transition">About</a>
            <a href="#services" className="text-gray-300 hover:text-white transition">Services</a>
            <a href="#portfolio" className="text-gray-300 hover:text-white transition">Portfolio</a>
            <a href="#contact" className="text-gray-300 hover:text-white transition">Contact</a>
          </div>
        </nav>
      </header>

      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Technology Innovation Services
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
          Empowering businesses with innovative technology solutions for sustainable growth and digital transformation.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <a
            href="#services"
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Our Services
          </a>
          <a
            href="https://tis-intellimat.net"
            className="px-8 py-4 border border-white text-white rounded-lg hover:bg-white hover:text-slate-900 transition font-semibold"
          >
            ESG Navigator Platform
          </a>
        </div>
      </section>

      <section id="services" className="bg-white/5 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 rounded-xl p-8">
              <div className="w-12 h-12 bg-blue-600 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">ESG & Sustainability</h3>
              <p className="text-gray-300">Comprehensive ESG reporting, carbon accounting, and sustainability solutions.</p>
            </div>
            <div className="bg-white/10 rounded-xl p-8">
              <div className="w-12 h-12 bg-green-600 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Digital Transformation</h3>
              <p className="text-gray-300">Cloud solutions, AI integration, and modern application development.</p>
            </div>
            <div className="bg-white/10 rounded-xl p-8">
              <div className="w-12 h-12 bg-purple-600 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Consulting & Advisory</h3>
              <p className="text-gray-300">Strategic technology consulting and business process optimization.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Portfolio</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <a
              href="https://tis-intellimat.net"
              className="group bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl p-8 hover:scale-105 transition-transform"
            >
              <h3 className="text-2xl font-bold text-white mb-3">TIS IntelliMat</h3>
              <p className="text-emerald-100 mb-4">ESG Navigator platform for comprehensive sustainability management and reporting.</p>
              <span className="text-white font-semibold group-hover:underline">Visit Platform &rarr;</span>
            </a>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-3">Enterprise Solutions</h3>
              <p className="text-blue-100 mb-4">Custom enterprise software development and integration services.</p>
              <span className="text-white font-semibold">Coming Soon</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 py-12 border-t border-white/10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} TIS Holdings. All rights reserved.</p>
          <p className="text-gray-500 mt-2">tisholdings.co.za</p>
        </div>
      </footer>
    </main>
  );
}
