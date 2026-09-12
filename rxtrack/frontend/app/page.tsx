'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null

    if (token && role === 'DOCTOR') {
      router.replace('/doctor')
    } else if (token && role === 'PHARMACY') {
      router.replace('/pharmacy/queue')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-lg text-white">
            Rx
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight">RxTrack</span>
            <span className="text-xs text-orange-400 ml-2 font-semibold">TATA 1mg</span>
          </div>
        </div>
        <Link
          href="/login"
          className="px-5 py-2.5 bg-[#273353] hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Sign In
        </Link>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-20 text-center flex-1 flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300 mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Prescription-to-Order Real-Time Tracking Platform
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6">
          Every prescription, filled once.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">
            Verified every time.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          RxTrack bridges clinic consultations and pharmacy queues on a unified digital ledger. Doctors monitor patient compliance in real-time, while pharmacies prevent double-filling.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
          <Link
            href="/login"
            className="flex-1 px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-center transition-all shadow-lg shadow-orange-500/20"
          >
            Doctor Portal
          </Link>
          <Link
            href="/login"
            className="flex-1 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-center transition-all shadow-lg shadow-emerald-600/20"
          >
            Pharmacy Queue
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-6 border-t border-slate-900 text-center text-xs text-slate-500">
        © 2026 RxTrack · Tata 1mg Health Platform
      </footer>
    </div>
  )
}
