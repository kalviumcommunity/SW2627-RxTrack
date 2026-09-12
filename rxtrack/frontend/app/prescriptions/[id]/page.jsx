/* eslint-disable react/no-unescaped-entities */
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import apiClient from '@/lib/api'

export default function PrescriptionDetail() {
  const [prescription, setPrescription] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const initDetail = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

      if (!token) {
        router.push('/login')
        return
      }

      try {
        if (params?.id) {
          const res = await apiClient.get(`/api/prescriptions/${params.id}`)
          const data = res.data?.data
          if (data) {
            const formatted = {
              id: data.id,
              doctorName: data.doctor?.name || 'Dr. Maya Patel',
              doctorSpecialty: 'General Practice',
              doctorPhone: '+91 98765 43210',
              doctorClinic: 'Apollo Clinic, Sector 18',
              patientName: data.patientName,
              patientAge: 46,
              patientPhone: '+91 98765 43210',
              patientEmail: 'patient@rxtrack.dev',
              patientAddress: '123 Main Street, Sector 18',
              medicines: (data.medicines || []).map((m, i) => ({
                id: m.id || i,
                name: m.medicine?.name || 'Medicine',
                strength: m.medicine?.strength || '',
                dosage: `${m.quantity} unit(s)`,
                frequency: m.dosage || 'As directed',
                duration: m.instructions || '10 days',
                startDate: new Date(data.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                endDate: 'Completed',
                sideEffects: 'None reported',
              })),
              pharmacy: {
                name: 'Green Valley Pharmacy',
                location: 'Sector 18',
                phone: '+91 555-0101',
                address: '123 Wellness Avenue',
              },
              status: data.status === 'DISPENSED' ? 'Filled' : data.status === 'READY' ? 'Ready for Pickup' : 'In Queue',
              createdAt: new Date(data.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
              receivedAt: new Date(data.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
              estimatedPickup: 'Same day',
              notes: 'Patient records tracked on RxTrack.',
              timeline: [
                {
                  status: 'Prescription Sent',
                  time: new Date(data.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
                  description: `Created by ${data.doctor?.name || 'Doctor'}`,
                  icon: '📤',
                },
                {
                  status: 'Received at Pharmacy',
                  time: 'Synchronized',
                  description: 'Green Valley Pharmacy received digital order',
                  icon: '📋',
                },
                {
                  status: data.status === 'DISPENSED' ? 'Dispensed' : 'In Queue',
                  time: data.status === 'DISPENSED' ? 'Dispensed' : 'Processing',
                  description: data.status === 'DISPENSED' ? 'Prescription verified and filled once' : 'Prescription waiting in queue',
                  icon: data.status === 'DISPENSED' ? '✓' : '⏳',
                  current: true,
                },
              ],
            }
            setPrescription(formatted)
            setLoading(false)
            return
          }
        }
      } catch (err) {
        console.warn('Could not fetch prescription from API, falling back to mock:', err)
      }

      // Mock prescription fallback if offline or param not found
      const mockPrescription = {
        id: params?.id || 'RX-2026-1027',
        doctorName: 'Dr. Rahul Verma',
        doctorSpecialty: 'General Physician',
        doctorPhone: '+91 98765 43210',
        doctorClinic: 'Apollo Clinic, Sector 18',
        patientName: 'Rahul Verma',
        patientAge: 46,
        patientPhone: '+91 98765 43210',
        patientEmail: 'rahul@email.com',
        patientAddress: '123 Main Street, Sector 18, Delhi',
        medicines: [
          {
            id: 1,
            name: 'Metformin',
            strength: '500mg',
            dosage: '1 tablet',
            frequency: 'Twice a day',
            duration: '10 days',
            startDate: '17 Aug 2026',
            endDate: '26 Aug 2026',
            sideEffects: 'May cause stomach upset',
          },
        ],
        pharmacy: {
          name: 'Apollo Pharmacy',
          location: 'Sector 18, Delhi',
          phone: '+91 98765 43210',
          address: '123 Medical Plaza, Sector 18',
        },
        status: 'In Queue',
        createdAt: '17 Aug 2026, 18:20',
        receivedAt: '17 Aug 2026, 18:25',
        estimatedPickup: '17 Aug 2026, 19:30',
        notes: 'Patient has allergies to penicillin. Take medicines with food.',
        timeline: [
          {
            status: 'Prescription Sent',
            time: '17 Aug, 18:20',
            description: 'Doctor sent prescription',
            icon: '📤',
          },
        ],
      }

      setPrescription(mockPrescription)
      setLoading(false)
    }

    initDetail()
  }, [params, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!prescription) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Prescription not found</p>
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
          {[
            { label: 'Dashboard' },
            { label: 'Prescriptions' },
            { label: 'Analytics' },
            { label: 'Settings' },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full text-left px-4 py-3 rounded text-sm font-medium transition-colors text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-6 border-t border-gray-800">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold text-white">
            U
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            ← Back
          </button>
          <h1 className="text-xl font-semibold text-gray-900">{prescription.id}</h1>
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-[#273353]">
            RV
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8 max-w-6xl">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-xs font-semibold text-[#273353] mb-2">PRESCRIPTION DETAILS</p>
                  <h1
                    className="text-4xl font-bold text-gray-900 mb-2"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {prescription.patientName}
                  </h1>
                  <p className="text-gray-600">
                    {prescription.patientAge} years old • {prescription.id}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-semibold mb-2">
                    {prescription.status}
                  </span>
                  <p className="text-sm text-gray-600">{prescription.createdAt}</p>
                </div>
              </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-3 gap-8">
              {/* Left Column - Medicines & Details */}
              <div className="col-span-2 space-y-8">
                {/* Medicines */}
                <div className="bg-white rounded border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Medicines</h2>
                  <div className="space-y-4">
                    {prescription.medicines.map((medicine) => (
                      <div
                        key={medicine.id}
                        className="border border-gray-200 rounded p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {medicine.name} {medicine.strength}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {medicine.dosage} • {medicine.frequency} • {medicine.duration}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                          <div>
                            <p className="text-xs text-gray-600 font-semibold mb-1">DURATION</p>
                            <p className="text-sm text-gray-900">
                              {medicine.startDate} to {medicine.endDate}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-semibold mb-1">SIDE EFFECTS</p>
                            <p className="text-sm text-gray-900">{medicine.sideEffects}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Doctor Information */}
                <div className="bg-white rounded border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Doctor Information</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-600 font-semibold mb-1">DOCTOR NAME</p>
                      <p className="text-base font-medium text-gray-900">
                        {prescription.doctorName}
                      </p>
                      <p className="text-sm text-gray-600">{prescription.doctorSpecialty}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 font-semibold mb-1">PHONE</p>
                        <p className="text-sm text-gray-900">{prescription.doctorPhone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-semibold mb-1">CLINIC</p>
                        <p className="text-sm text-gray-900">{prescription.doctorClinic}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patient Information */}
                <div className="bg-white rounded border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Patient Information</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-gray-600 font-semibold mb-1">PHONE</p>
                      <p className="text-sm text-gray-900">{prescription.patientPhone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold mb-1">EMAIL</p>
                      <p className="text-sm text-gray-900">{prescription.patientEmail}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-600 font-semibold mb-1">ADDRESS</p>
                      <p className="text-sm text-gray-900">{prescription.patientAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {prescription.notes && (
                  <div className="bg-blue-50 rounded border border-blue-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Doctor's Notes</h2>
                    <p className="text-gray-700">{prescription.notes}</p>
                  </div>
                )}
              </div>

              {/* Right Column - Timeline & Actions */}
              <div className="space-y-6">
                {/* Pharmacy Info */}
                <div className="bg-white rounded border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Pharmacy</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 font-semibold mb-1">NAME</p>
                      <p className="font-medium text-gray-900">{prescription.pharmacy.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold mb-1">LOCATION</p>
                      <p className="text-sm text-gray-900">{prescription.pharmacy.location}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold mb-1">PHONE</p>
                      <p className="text-sm text-gray-900">{prescription.pharmacy.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold mb-1">ADDRESS</p>
                      <p className="text-sm text-gray-900">{prescription.pharmacy.address}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Status Timeline</h2>
                  <div className="space-y-4">
                    {prescription.timeline.map((event, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                              event.current
                                ? 'bg-[#273353] text-white'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {event.icon}
                          </div>
                          {idx < prescription.timeline.length - 1 && (
                            <div
                              className={`w-0.5 h-8 ${
                                event.current ? 'bg-[#273353]' : 'bg-gray-200'
                              }`}
                            ></div>
                          )}
                        </div>
                        <div className="flex-1 pt-2">
                          <p
                            className={`font-semibold ${
                              event.current
                                ? 'text-[#273353]'
                                : 'text-gray-900'
                            }`}
                          >
                            {event.status}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">{event.time}</p>
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button className="w-full px-6 py-3 bg-[#273353] text-white rounded font-medium hover:bg-[#1a1f2e] transition-colors">
                    🔄 Request Refill
                  </button>
                  <button className="w-full px-6 py-3 bg-gray-100 text-gray-900 rounded font-medium hover:bg-gray-200 transition-colors">
                    📞 Call Pharmacy
                  </button>
                  <button className="w-full px-6 py-3 bg-gray-100 text-gray-900 rounded font-medium hover:bg-gray-200 transition-colors">
                    📧 Contact Doctor
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}