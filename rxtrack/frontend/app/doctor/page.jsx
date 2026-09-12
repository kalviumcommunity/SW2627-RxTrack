/* eslint-disable react/no-unescaped-entities */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import apiClient from '@/lib/api'
import { logout } from '@/lib/auth'

const SERIF = '"Cormorant Garamond", Georgia, serif'
const SANS = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'

export default function DoctorDashboard() {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activePage, setActivePage] = useState('today')
  const [statusFilter, setStatusFilter] = useState('Everything')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedPrescription, setExpandedPrescription] = useState(null)
  const [stats, setStats] = useState({ totalPrescriptions: 0, filled: 0, fillRate: 0 })
  const router = useRouter()

  useEffect(() => {
    const initDashboard = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null

      if (!token || role !== 'DOCTOR') {
        router.push('/login')
        return
      }

      try {
        const [rxRes, statsRes] = await Promise.all([
          apiClient.get('/api/prescriptions'),
          apiClient.get('/api/analytics/fill-rate'),
        ])

        if (statsRes.data?.data) {
          setStats(statsRes.data.data)
        }

        const apiItems = rxRes.data?.data?.items || []
        if (apiItems.length > 0) {
          const formatted = apiItems.map((rx) => {
            const statusLabel =
              rx.status === 'DISPENSED'
                ? 'Filled'
                : rx.status === 'READY' || rx.status === 'PROCESSING' || rx.status === 'PENDING'
                ? 'In queue'
                : 'Not filled'

            const meds = (rx.medicines || []).map(
              (m) => `${m.medicine?.name || 'Medicine'} ${m.medicine?.strength || ''}`.trim()
            )

            const dateStr = rx.createdAt
              ? new Date(rx.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Recently'

            return {
              id: rx.id,
              patientName: rx.patientName,
              age: 42,
              date: dateStr,
              medicines: meds.length > 0 ? meds : ['General Medicine'],
              pharmacy: 'Partner Pharmacy',
              status: statusLabel,
              pickupTime: rx.status === 'DISPENSED' ? 'Fulfilled' : 'In queue',
            }
          })
          setPrescriptions(formatted)
        } else {
          setPrescriptions([])
        }
      } catch (err) {
        console.error('Failed to fetch doctor dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    initDashboard()
  }, [router])

  const getStatusColor = (status) => {
    if (status === 'Filled') return 'text-teal-600 bg-teal-50'
    if (status === 'In queue') return 'text-amber-600 bg-amber-50'
    return 'text-[#273353] bg-blue-50'
  }

  const getStatusDot = (status) => {
    if (status === 'Filled') return 'bg-teal-600'
    if (status === 'In queue') return 'bg-amber-500'
    return 'bg-[#273353]'
  }

  const navigationItems = [
    { id: 'today', label: 'Today' },
    { id: 'prescriptions', label: 'Prescriptions' },
    { id: 'patients', label: 'Patients' },
    { id: 'medicines', label: 'Medicines' },
    { id: 'settings', label: 'Settings' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" style={{ fontFamily: SANS }}>
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  const filteredPrescriptions = prescriptions.filter((rx) => {
    const matchesFilter = statusFilter === 'Everything' || rx.status === statusFilter
    const matchesSearch =
      !searchQuery ||
      rx.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.medicines.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: SANS }}>
      {/* Sidebar */}
      <div className="w-56 bg-gray-900 text-white flex flex-col border-r border-gray-800">
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-gray-800">
          <div>
            <div className="font-bold text-lg" style={{ fontFamily: SERIF }}>Rx Track</div>
            <div className="text-xs text-gray-400">TATA 1mg</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigationItems.map((item) => {
            const isActive = activePage === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full text-left px-4 py-3 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white text-gray-900'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-6 border-t border-gray-800 flex items-center justify-between">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold text-white">
            Dr
          </div>
          <button
            onClick={() => logout(router)}
            className="text-xs font-medium text-gray-400 hover:text-white transition-colors"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <input
            type="text"
            placeholder="Search a patient, RX number or medicine"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 mr-8 px-4 py-2 bg-gray-100 rounded border-0 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#273353]"
            style={{ color: '#273353' }}
          />
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Clinic Portal</span>
            <button
              onClick={() => router.push('/prescriptions/upload')}
              className="px-4 py-2 bg-gray-900 text-white rounded text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Upload prescription
            </button>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-[#273353]">
              MP
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <p className="text-xs font-semibold text-[#273353] mb-2 tracking-wide">CLINICAL PRACTICE DASHBOARD</p>
              <h1 className="text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: SERIF, fontWeight: 600 }}>Good day, Dr. Maya Patel</h1>
              <p className="text-base text-gray-600 leading-relaxed max-w-2xl">
                Real-time visibility into whether your patients fill their prescriptions across partner pharmacies.
              </p>
            </div>

            {/* Compliance & Stats */}
            <div className="flex gap-8 mb-8">
              <div className="flex-1">
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white rounded p-6 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-2 font-semibold tracking-wide">PRESCRIPTIONS WRITTEN</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: SERIF }}>{stats.totalPrescriptions}</p>
                    <p className="text-xs text-gray-500 mb-1">Total platform volume</p>
                    <p className="text-xs text-green-600 font-medium">Active tracking</p>
                  </div>
                  <div className="bg-white rounded p-6 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-2 font-semibold tracking-wide">FILLED BY PATIENTS</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: SERIF }}>{stats.filled}</p>
                    <p className="text-xs text-gray-500 mb-1">{stats.fillRate}% overall compliance</p>
                    <p className="text-xs text-green-600 font-medium">Verified</p>
                  </div>
                  <div className="bg-white rounded p-6 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-2 font-semibold tracking-wide">SITTING IN QUEUE</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: SERIF }}>
                      {prescriptions.filter((p) => p.status === 'In queue').length}
                    </p>
                    <p className="text-xs text-gray-500">Waiting for fulfillment</p>
                  </div>
                  <div className="bg-white rounded p-6 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-2 font-semibold tracking-wide">NOT FILLED</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: SERIF }}>
                      {prescriptions.filter((p) => p.status === 'Not filled').length}
                    </p>
                    <p className="text-xs text-gray-500">Pending review</p>
                  </div>
                </div>
              </div>

              {/* Compliance Streak */}
              <div className="w-48 bg-white rounded p-6 border border-gray-200">
                <p className="text-xs text-gray-600 font-semibold mb-2 tracking-wide">COMPLIANCE RATE</p>
                <p className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: SERIF }}>{stats.fillRate}%</p>
                <p className="text-xs text-gray-500">Real-time fill score</p>
              </div>
            </div>

            {/* Recent Prescriptions */}
            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-2">
                <div className="bg-white rounded border border-gray-200">
                  <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: SERIF, fontWeight: 600 }}>Recent prescriptions</h2>
                      <p className="text-sm text-gray-600">Live status straight from the pharmacy queue</p>
                    </div>
                    <span className="text-xs bg-blue-50 text-[#273353] px-2.5 py-1 rounded font-medium">
                      {filteredPrescriptions.length} shown
                    </span>
                  </div>

                  {/* Filters */}
                  <div className="px-6 py-4 border-b border-gray-200 flex gap-2">
                    {['Everything', 'In queue', 'Not filled', 'Filled'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setStatusFilter(tab)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          statusFilter === tab
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Prescriptions List */}
                  <div className="divide-y divide-gray-200">
                    {filteredPrescriptions.length === 0 ? (
                      <div className="p-8 text-center text-gray-500 text-sm">
                        No prescriptions matching the selected criteria.
                      </div>
                    ) : (
                      filteredPrescriptions.map((rx) => (
                        <div
                          key={rx.id}
                          className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() =>
                            setExpandedPrescription(
                              expandedPrescription === rx.id ? null : rx.id
                            )
                          }
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3">
                              <div className={`w-3 h-3 rounded-full ${getStatusDot(rx.status)} mt-1`}></div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {rx.patientName}{' '}
                                  <span className="text-gray-500 font-normal">{rx.age} yrs</span>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {rx.id} · {rx.date}
                                </p>
                              </div>
                            </div>
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(rx.status)}`}>
                              {rx.status}
                            </span>
                          </div>

                          {expandedPrescription === rx.id && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="mb-4">
                                <p className="text-xs text-gray-600 font-semibold mb-2 tracking-wide">MEDICINES</p>
                                <div className="flex flex-wrap gap-2">
                                  {rx.medicines.map((med, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700"
                                    >
                                      {med}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">{rx.pharmacy}</span> — {rx.pickupTime || rx.queueTime || rx.overdueTime || 'Pending'}
                              </p>
                            </div>
                          )}
                        </div>
                      )))}
                    </div>

                    <div className="px-6 py-4 text-center text-sm text-[#273353] font-medium hover:underline cursor-pointer">
                      View all prescriptions
                    </div>
                  </div>

                  {/* Medicine Analytics */}
                  <div className="bg-white rounded border border-gray-200 p-6 mt-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: SERIF, fontWeight: 600 }}>Which medicines actually get bought</h3>
                        <p className="text-sm text-gray-600">Fill rate per molecule, last 30 days</p>
                      </div>
                      <a href="#" className="text-[#273353] font-medium text-sm hover:underline">
                        Full report
                      </a>
                    </div>

                    <div className="space-y-4">
                      {[
                        { name: 'Metformin 500mg', rate: 90, count: 46 },
                        { name: 'Telmidartan 40mg', rate: 84, count: 38 },
                        { name: 'Atorvastatin 10mg', rate: 71, count: 33 },
                        { name: 'Insulin Glargine', rate: 54, count: 21 },
                        { name: 'Vitamin D3 60k', rate: 38, count: 27 },
                      ].map((med, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">{med.name}</span>
                            <span className="text-xs text-gray-600">{med.rate}% of {med.count}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-[#273353] h-2 rounded-full"
                              style={{ width: `${med.rate}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                  {/* Worth a Phone Call */}
                  <div className="bg-white rounded border border-gray-200 p-6">
                    <p className="text-sm font-semibold text-gray-900 mb-4 tracking-wide">WORTH A PHONE CALL</p>
                    <div className="space-y-4">
                      {[
                        { name: 'Vikram R.', issue: 'Insulin refill overdue · 3 days', action: 'Call' },
                        { name: 'Arjun Nair', issue: 'Prescription untouched for 48 hrs', action: 'Nudge' },
                        { name: 'Fatima Sheikh', issue: 'BP review due this Friday', action: 'Book' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-[#273353]">
                              {item.name[0]}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.name}</p>
                              <p className="text-xs text-gray-600">{item.issue}</p>
                            </div>
                          </div>
                          <button className="px-3 py-1 bg-gray-900 text-white rounded text-xs font-medium hover:bg-gray-800">
                            {item.action}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pattern Spotted */}
                  <div className="bg-blue-50 rounded border border-blue-200 p-6">
                    <p className="text-sm font-semibold text-gray-900 mb-2 tracking-wide">PATTERN SPOTTED</p>
                    <p className="text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: SERIF, fontWeight: 600 }}>
                      "Vitamin D3 60k drops off after the first strip."
                    </p>
                    <p className="text-xs text-gray-600 mb-4">
                      Only 38% of your Vitamin D3 scripts get filled — the lowest in your panel. Patients on 4+ medicine scripts skip it most often.
                    </p>
                    <button className="w-full px-3 py-2 bg-[#273353] text-white rounded text-xs font-medium hover:bg-[#1a1f2e]">
                      See the 27 patients
                    </button>
                  </div>

                  {/* Pharmacies You Send To */}
                  <div className="bg-white rounded border border-gray-200 p-6">
                    <p className="text-sm font-semibold text-gray-900 mb-4 tracking-wide">PHARMACIES YOU SEND TO</p>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-900">Apollo, Sector 18</span>
                          <span className="text-xs text-gray-600">40%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-[#273353] h-2 rounded-full" style={{ width: '40%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-900">1mg Pharmacy, Noida</span>
                          <span className="text-xs text-gray-600">33%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-[#273353] h-2 rounded-full" style={{ width: '33%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-900">MedPlus, Indirapuram</span>
                          <span className="text-xs text-gray-600">21%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-[#273353] h-2 rounded-full" style={{ width: '21%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}