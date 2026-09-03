'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { useRouter } from 'next/navigation'

export default function DoctorDashboard() {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initDashboard = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null

      if (!token || role !== 'DOCTOR') {
        router.push('/login')
        return
      }

      const mockPrescriptions = [
        {
          id: '1',
          patientName: 'John Smith',
          status: 'READY',
          createdAt: new Date().toLocaleDateString(),
          medicineCount: 3,
        },
        {
          id: '2',
          patientName: 'Sarah Johnson',
          status: 'PENDING',
          createdAt: new Date().toLocaleDateString(),
          medicineCount: 2,
        },
        {
          id: '3',
          patientName: 'Michael Brown',
          status: 'DISPENSED',
          createdAt: new Date().toLocaleDateString(),
          medicineCount: 4,
        },
      ]

      setPrescriptions(mockPrescriptions)
      setLoading(false)
    }

    initDashboard()
  }, [router])

  const getStatusStyles = (status) => {
    const styles = {
      PENDING: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      PROCESSING: 'bg-blue-50 text-blue-700 border border-blue-200',
      READY: 'bg-green-50 text-green-700 border border-green-200',
      DISPENSED: 'bg-green-100 text-green-800 border border-green-300',
      REJECTED: 'bg-red-50 text-red-700 border border-red-200',
    }
    return styles[status] || styles.PENDING
  }

  const getStatusDot = (status) => {
    const colors = {
      PENDING: 'bg-yellow-500',
      PROCESSING: 'bg-blue-500',
      READY: 'bg-green-500',
      DISPENSED: 'bg-green-600',
      REJECTED: 'bg-red-500',
    }
    return colors[status] || colors.PENDING
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your prescriptions</p>
            </div>
            <Button
              label="Upload Prescription"
              variant="primary"
              onClick={() => router.push('/doctor/upload')}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Card title="Recent Prescriptions">
          {prescriptions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No prescriptions yet</p>
              <Button
                label="Create First Prescription"
                variant="primary"
                onClick={() => router.push('/doctor/upload')}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                      Patient Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                      Medicines
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((prescription) => (
                    <tr
                      key={prescription.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-900">{prescription.patientName}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-600 text-sm">{prescription.medicineCount} items</p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${getStatusDot(
                              prescription.status
                            )}`}
                          ></div>
                          <span
                            className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusStyles(
                              prescription.status
                            )}`}
                          >
                            {prescription.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-600 text-sm">{prescription.createdAt}</p>
                      </td>
                      <td className="py-4 px-4">
                        <Button
                          label="View"
                          variant="secondary"
                          onClick={() =>
                            router.push(`/doctor/prescriptions/${prescription.id}`)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}