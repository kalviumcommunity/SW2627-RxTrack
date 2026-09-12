/* eslint-disable react/no-unescaped-entities */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import apiClient from '@/lib/api'
import { logout } from '@/lib/auth'

export default function PharmacyQueue() {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('waiting')
  const [expandedId, setExpandedId] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const initQueue = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null

      if (!token || role !== 'PHARMACY') {
        router.push('/login')
        return
      }

      try {
        const res = await apiClient.get('/api/fulfillments/pharmacy-queue')
        const items = res.data?.data?.items || []
        const formatted = items.map((rx) => {
          const isFilled = rx.status === 'DISPENSED'
          const medList = (rx.medicines || []).map((m) => ({
            name: `${m.medicine?.name || 'Medicine'} ${m.medicine?.strength || ''}`.trim(),
            dosage: `${m.quantity} unit(s)`,
            frequency: m.dosage || 'As directed',
            duration: m.instructions || 'Standard course',
          }))

          return {
            id: rx.id,
            doctorName: rx.doctor?.name || 'Dr. Maya Patel',
            doctorSpecialty: 'General Practice',
            patientName: rx.patientName,
            patientAge: 46,
            medicines:
              medList.length > 0
                ? medList
                : [{ name: 'Prescribed Medication', dosage: '1 unit', frequency: 'As directed', duration: 'Standard' }],
            status: isFilled ? 'filled' : 'waiting',
            rawStatus: rx.status,
            receivedAt: rx.createdAt
              ? new Date(rx.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Recently',
            notes: '',
          }
        })
        setPrescriptions(formatted)
      } catch (err) {
        console.error('Failed to load pharmacy queue:', err)
      } finally {
        setLoading(false)
      }
    }

    initQueue()
  }, [router])

  const handleMarkAsFilled = async (id) => {
    try {
      await apiClient.post('/api/fulfillments/mark-filled', {
        prescriptionId: id,
        notes: 'Fulfilled by pharmacy',
      })
      setPrescriptions((prev) =>
        prev.map((rx) =>
          rx.id === id ? { ...rx, status: 'filled', rawStatus: 'DISPENSED' } : rx
        )
      )
    } catch (err) {
      alert(err.response?.data?.error || err.message || 'Failed to mark prescription as filled')
    }
  }

  const filteredPrescriptions = prescriptions.filter(
    (rx) => rx.status === activeTab
  )

  const navigationItems = [
    { id: 'queue', label: 'Queue' },
    { id: 'history', label: 'History' },
    { id: 'patients', label: 'Patients' },
    { id: 'settings', label: 'Settings' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-gray-50 flex"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
    >
      {/* Sidebar */}
      <div className="w-56 bg-gray-900 text-white flex flex-col border-r border-gray-800">
        <div className="h-20 flex items-center px-6 border-b border-gray-800">
          <div>
            <div className="font-bold text-lg">Rx Track</div>
            <div className="text-xs text-gray-400">TATA 1mg</div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className="w-full text-left px-4 py-3 rounded text-sm font-medium transition-colors text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-6 border-t border-gray-800">
          <div className="mb-4">
            <p className="text-xs text-gray-500 font-semibold mb-2">TODAY'S STATS</p>
            <p className="text-2xl font-bold text-white mb-1">
              {prescriptions.filter((rx) => rx.status === 'waiting').length}
            </p>
            <p className="text-xs text-gray-400">waiting to fill</p>
          </div>
        </div>

        <div className="px-4 py-4 border-t border-gray-800 space-y-2">
          <button className="w-full text-left px-4 py-2 rounded text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            Help & support
          </button>
          <button
            onClick={() => logout(router)}
            className="w-full text-left px-4 py-2 rounded text-sm text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors"
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
            placeholder="Search patient name or RX number"
            className="flex-1 px-4 py-2 bg-gray-100 rounded border-0 text-sm text-[#273353] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#273353]"
          />
          <div className="flex items-center gap-4 ml-4">
            <span className="text-sm text-gray-600">Apollo Pharmacy</span>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-700">
              AP
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <p className="text-xs font-semibold text-[#273353] mb-2">PRESCRIPTION QUEUE</p>
              <h1
                className="text-5xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Process prescriptions as they arrive.
              </h1>
              <p className="text-gray-600 max-w-2xl">
                Doctors send prescriptions directly to your queue. Process them, mark as filled, and patients get notified instantly.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded p-6 border border-gray-200">
                <p className="text-xs text-gray-600 mb-2 font-semibold">WAITING TO FILL</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {prescriptions.filter((rx) => rx.status === 'waiting').length}
                </p>
                <p className="text-xs text-amber-600 font-medium">📋 Action required</p>
              </div>
              <div className="bg-white rounded p-6 border border-gray-200">
                <p className="text-xs text-gray-600 mb-2 font-semibold">FILLED TODAY</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {prescriptions.filter((rx) => rx.status === 'filled').length}
                </p>
                <p className="text-xs text-green-600 font-medium">✓ Completed</p>
              </div>
              <div className="bg-white rounded p-6 border border-gray-200">
                <p className="text-xs text-gray-600 mb-2 font-semibold">FILL RATE</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {prescriptions.length > 0
                    ? Math.round(
                        (prescriptions.filter((rx) => rx.status === 'filled').length /
                          prescriptions.length) *
                          100
                      )
                    : 0}
                  %
                </p>
                <p className="text-xs text-gray-500">Today's average</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex gap-4 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('waiting')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'waiting'
                    ? 'text-[#273353] border-b-2 border-[#273353]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Waiting ({prescriptions.filter((rx) => rx.status === 'waiting').length})
              </button>
              <button
                onClick={() => setActiveTab('filled')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'filled'
                    ? 'text-[#273353] border-b-2 border-[#273353]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Filled ({prescriptions.filter((rx) => rx.status === 'filled').length})
              </button>
            </div>

            {/* Prescriptions List */}
            <div className="space-y-4">
              {filteredPrescriptions.length === 0 ? (
                <div className="bg-white rounded border border-gray-200 p-12 text-center">
                  <p className="text-gray-600 text-lg mb-2">All caught up!</p>
                  <p className="text-gray-500 text-sm">
                    {activeTab === 'waiting'
                      ? 'No prescriptions waiting to be filled'
                      : 'No filled prescriptions to show'}
                  </p>
                </div>
              ) : (
                filteredPrescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className="bg-white rounded border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Header */}
                    <div
                      className="p-6 cursor-pointer hover:bg-gray-50 border-b border-gray-100"
                      onClick={() =>
                        setExpandedId(
                          expandedId === prescription.id ? null : prescription.id
                        )
                      }
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 rounded-full bg-[#273353]"></div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {prescription.patientName}
                            </h3>
                            <span className="text-sm text-gray-600">
                              {prescription.patientAge} yrs
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">{prescription.doctorName}</span>
                            {' · '}
                            {prescription.doctorSpecialty}
                            {' · '}
                            {prescription.receivedAt}
                          </p>
                          <p className="text-xs text-gray-500">{prescription.id}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              prescription.status === 'waiting'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-green-50 text-green-700'
                            }`}
                          >
                            {prescription.status === 'waiting' ? '⏳ Waiting' : '✓ Filled'}
                          </span>
                          <span className="text-gray-400">
                            {expandedId === prescription.id ? '▼' : '▶'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedId === prescription.id && (
                      <div className="px-6 py-6 bg-gray-50 space-y-6">
                        {/* Medicines */}
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-4 tracking-wide">
                            MEDICINES TO FILL
                          </p>
                          <div className="space-y-3">
                            {prescription.medicines.map((medicine, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-4 p-4 bg-white rounded border border-gray-200"
                              >
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">
                                    {medicine.name}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {medicine.dosage} · {medicine.frequency} · {medicine.duration}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded border-gray-300 text-[#273353] focus:ring-[#273353]"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Notes */}
                        {prescription.notes && (
                          <div>
                            <p className="text-xs font-semibold text-gray-700 mb-2 tracking-wide">
                              DOCTOR'S INSTRUCTIONS
                            </p>
                            <p className="text-sm text-gray-700 p-4 bg-white rounded border border-gray-200">
                              {prescription.notes}
                            </p>
                          </div>
                        )}

                        {/* Action Button */}
                        <div className="flex gap-3">
                          {prescription.status === 'waiting' && (
                            <>
                              <button
                                onClick={() => handleMarkAsFilled(prescription.id)}
                                className="flex-1 px-6 py-3 bg-[#273353] text-white rounded font-medium hover:bg-[#1a1f2e] transition-colors"
                              >
                                ✓ Mark as Filled
                              </button>
                              <button className="px-6 py-3 bg-gray-100 text-gray-900 rounded font-medium hover:bg-gray-200 transition-colors">
                                ⏸ Hold
                              </button>
                            </>
                          )}

                          {prescription.status === 'filled' && (
                            <div className="w-full p-4 bg-green-50 border border-green-200 rounded">
                              <p className="text-sm text-green-700 font-medium text-center">
                                ✓ Filled and ready for pickup
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}