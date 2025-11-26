'use client'
import { useState } from 'react'
import { Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react'

export default function EmailTestPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const sendTestEmail = async () => {
    if (!email) {
      setMessage('Please enter an email address')
      setStatus('error')
      return
    }

    setStatus('loading')
    setMessage('Sending test email...')

    try {
      const response = await fetch('/api/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: 'ESG Navigator - Test Email',
          template: 'welcome',
          data: {
            userName: 'Test User',
            platformUrl: 'https://esg-navigator-pro-2nyf.vercel.app'
          }
        })
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(`✅ Email sent successfully to ${email}`)
        setEmail('')
      } else {
        setStatus('error')
        setMessage(`❌ Error: ${data.error || 'Failed to send email'}`)
      }
    } catch (error) {
      setStatus('error')
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl font-bold text-white">Email System Test</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Test your ESG Navigator email delivery system
          </p>
        </div>

        {/* Test Card */}
        <div className="bg-white/10 border border-white/20 rounded-xl p-8 backdrop-blur-md">
          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-white font-semibold mb-3">
                Recipient Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-email@example.com"
                disabled={status === 'loading'}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition disabled:opacity-50"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={sendTestEmail}
              disabled={status === 'loading'}
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Send Test Email
                </>
              )}
            </button>

            {/* Status Message */}
            {message && (
              <div className={`p-4 rounded-lg flex items-start gap-3 ${
                status === 'success' 
                  ? 'bg-green-500/20 border border-green-500/50' 
                  : 'bg-red-500/20 border border-red-500/50'
              }`}>
                {status === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <p className={status === 'success' ? 'text-green-200' : 'text-red-200'}>
                  {message}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-3">What This Tests:</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">✓</span>
              <span>Database connection and email record creation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">✓</span>
              <span>Email template rendering (welcome template)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">✓</span>
              <span>API route functionality</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">✓</span>
              <span>Email service integration</span>
            </li>
          </ul>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-3">Next Steps:</h3>
          <ol className="space-y-2 text-gray-300">
            <li><span className="text-purple-400 font-semibold">1.</span> Enter your email address</li>
            <li><span className="text-purple-400 font-semibold">2.</span> Click &quot;Send Test Email&quot;</li>
            <li><span className="text-purple-400 font-semibold">3.</span> Check your inbox for the test email</li>
            <li><span className="text-purple-400 font-semibold">4.</span> Once working, integrate into dashboard</li>
          </ol>
        </div>
      </div>
    </div>
  )
}