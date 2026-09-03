/* eslint-disable react/no-unescaped-entities */
'use client'

import { useState } from 'react'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { useRouter } from 'next/navigation'
import apiClient from '@/lib/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [userType, setUserType] = useState('DOCTOR')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await apiClient.post('/api/auth/login', {
        email,
        password,
        role: userType,
      })

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('role', response.data.role)

      if (response.data.role === 'DOCTOR') {
        router.push('/doctor')
      } else {
        router.push('/pharmacy')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-900">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex-col justify-between p-12">
        <div>
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-white">Rx</span>
              </div>
              <h1 className="text-4xl font-bold">RxTrack</h1>
            </div>
            <p className="text-orange-500 text-sm font-semibold mt-3 tracking-widest">
              PRESCRIPTION → ORDER TRACKING
            </p>
          </div>

          <div className="mb-16">
            <h2 className="text-5xl font-bold leading-tight mb-8">
              Every prescription, filled once. Verified every time.
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              RxTrack connects doctors and partner pharmacies on one shared record — so a
              prescription can be tracked from the moment it's written to the moment it's
              fulfilled, without ever being filled twice.
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex gap-2">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < 5 ? 'bg-teal-400' : 'bg-slate-600'
                }`}
              ></div>
            ))}
          </div>
        </div>

        <div className="text-slate-400 text-sm">
          A Tata 1mg feature • Trusted doctor & pharmacy network
        </div>
      </div>

      {/* Right Side - Login Form - WHITE BACKGROUND */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 bg-white">
        <div className="w-full max-w-md">
          {/* User Type Toggle */}
          <div className="mb-12">
            <p className="text-gray-600 text-sm font-semibold mb-4 uppercase tracking-wide">
              Login as
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setUserType('DOCTOR')}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold text-base transition-all duration-300 ${
                  userType === 'DOCTOR'
                    ? 'bg-[#273353] text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                 Doctor
              </button>
              <button
                onClick={() => setUserType('PHARMACY')}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold text-base transition-all duration-300 ${
                  userType === 'PHARMACY'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                 Pharmacy
              </button>
            </div>
          </div>

          {/* Login Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to your account to continue</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Login Button - NO SHADOW */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
                  userType === 'DOCTOR'
                    ? 'bg-[#273353] hover:bg-[#1a1f2e] text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                } ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {loading ? 'Logging in...' : `Log in as ${userType === 'DOCTOR' ? 'Doctor' : 'Pharmacy'}`}
              </button>
            </div>
          </form>

          {/* Footer Info */}
          <div className="mt-8 space-y-4">
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
              <p className="text-teal-700 text-xs text-center font-medium">
                ✓ Every account is manually verified before activation
              </p>
            </div>

            <p className="text-gray-600 text-sm text-center">
              Don't have an account?{' '}
              <a href="#" className="text-blue-600 font-semibold hover:text-blue-700">
                Sign up Now!
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}