import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920")',
          filter: 'brightness(0.7)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center px-4">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            ESG Navigator Pro
          </h1>
          <p className="text-2xl text-white mb-8 drop-shadow-lg">
            Real-time compliance, energy intelligence, and sustainability monitoring unified.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              href="/dashboard"
              className="px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-lg hover:bg-indigo-700 transition shadow-lg"
            >
              Enter Dashboard
            </Link>
            <Link 
              href="/training"
              className="px-8 py-4 bg-green-600 text-white text-lg font-bold rounded-lg hover:bg-green-700 transition shadow-lg"
            >
              Training Portal
            </Link>
            <Link 
              href="/assessments"
              className="px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-lg hover:bg-blue-700 transition shadow-lg"
            >
              Assessments
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}