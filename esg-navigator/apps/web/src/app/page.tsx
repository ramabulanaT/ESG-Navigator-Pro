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
            TIS-IntelliMat ESG Navigator
          </h1>
          <p className="text-2xl text-white mb-8 drop-shadow-lg">
            Real-time compliance, energy intelligence, and sustainability monitoring unified.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link 
              href="/dashboard"
              className="px-8 py-4 bg-green-600 text-white text-lg font-bold rounded-lg hover:bg-green-700 transition shadow-lg"
            >
              View Dashboard
            </Link>
            <Link 
              href="/dashboard"
              className="px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-lg hover:bg-blue-700 transition shadow-lg"
            >
              API Metrics
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
