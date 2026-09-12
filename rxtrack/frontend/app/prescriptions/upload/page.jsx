/* eslint-disable react/no-unescaped-entities, @next/next/no-img-element */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import apiClient from '@/lib/api'

export default function UploadPrescription() {
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    patientPhone: '',
    pharmacy: 'Green Valley Pharmacy',
    medicines: [{ medicineId: '', name: '', strength: '', quantity: '1', frequency: 'Twice a day', duration: '10 days' }],
    notes: '',
    notifyAfter: false,
  })
  const [availableMedicines, setAvailableMedicines] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await apiClient.get('/api/medicines')
        if (res.data?.data) {
          setAvailableMedicines(res.data.data)
          // Default first medicine row to first available medicine if empty
          if (res.data.data.length > 0) {
            setFormData((prev) => {
              if (prev.medicines[0] && !prev.medicines[0].medicineId) {
                const first = res.data.data[0]
                return {
                  ...prev,
                  medicines: [
                    {
                      ...prev.medicines[0],
                      medicineId: first.id,
                      name: first.name,
                      strength: first.strength || '',
                    },
                  ],
                }
              }
              return prev
            })
          }
        }
      } catch (err) {
        console.error('Failed to load medicines catalog:', err)
      }
    }
    fetchCatalog()
  }, [])

  const pharmacyOptions = [
    'Green Valley Pharmacy',
    'Apollo, Sector 18',
    '1mg Pharmacy, Noida',
    'MedPlus, Indirapuram',
    'Wellness Forever',
  ]

  const frequencyOptions = ['Once a day', 'Twice a day', 'Thrice a day', 'As needed']

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...formData.medicines]
    newMedicines[index][field] = value

    // If user picks from medicineId selector, auto-sync name and strength
    if (field === 'medicineId') {
      const selectedMed = availableMedicines.find((m) => m.id === value)
      if (selectedMed) {
        newMedicines[index].name = selectedMed.name
        newMedicines[index].strength = selectedMed.strength || ''
      }
    }

    setFormData((prev) => ({
      ...prev,
      medicines: newMedicines,
    }))
  }

  const addMedicineLine = () => {
    const fallbackMed = availableMedicines[0]
    setFormData((prev) => ({
      ...prev,
      medicines: [
        ...prev.medicines,
        {
          medicineId: fallbackMed ? fallbackMed.id : '',
          name: fallbackMed ? fallbackMed.name : '',
          strength: fallbackMed ? fallbackMed.strength || '' : '',
          quantity: '1',
          frequency: 'Twice a day',
          duration: '10 days',
        },
      ],
    }))
  }

  const removeMedicineLine = (index) => {
    setFormData((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index),
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target.result)
      }
      reader.readAsDataURL(file)
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.patientName.trim()) {
      setError('Patient name is required')
      setLoading(false)
      return
    }

    // Resolve medicines ensuring each has a valid medicineId
    const formattedMedicines = []
    const usedIds = new Set()

    for (const item of formData.medicines) {
      let medId = item.medicineId
      if (!medId && item.name) {
        const found = availableMedicines.find(
          (m) => m.name.toLowerCase().includes(item.name.toLowerCase()) ||
                 item.name.toLowerCase().includes(m.name.toLowerCase())
        )
        if (found) medId = found.id
      }

      if (!medId) {
        setError(`Please select a valid medicine from the catalog for "${item.name || 'unnamed medicine'}"`)
        setLoading(false)
        return
      }

      if (usedIds.has(medId)) {
        setError('The same medicine cannot be listed twice on one prescription. Please adjust the quantity.')
        setLoading(false)
        return
      }

      usedIds.add(medId)
      formattedMedicines.push({
        medicineId: medId,
        quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
        dosage: item.strength || item.frequency || undefined,
        instructions: item.duration ? `${item.frequency || 'Take'} for ${item.duration}` : item.frequency,
      })
    }

    if (formattedMedicines.length === 0) {
      setError('At least one medicine is required')
      setLoading(false)
      return
    }

    try {
      await apiClient.post('/api/prescriptions/upload', {
        patientName: formData.patientName.trim(),
        medicines: formattedMedicines,
      })

      router.push('/doctor')
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          'Failed to upload prescription'
      )
    } finally {
      setLoading(false)
    }
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
            { id: 'today', label: 'Today' },
            { id: 'new', label: 'New prescription', highlight: true },
            { id: 'prescriptions', label: 'Prescriptions', badge: 5 },
            { id: 'compliance', label: 'Compliance' },
            { id: 'patients', label: 'Patients', badge: 4 },
            { id: 'medicines', label: 'Medicines' },
            { id: 'settings', label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              className={`w-full text-left px-4 py-3 rounded text-sm font-medium transition-colors flex items-center justify-between ${
                item.highlight
                  ? 'bg-white text-gray-900'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
            >
              {item.label}
              {item.badge && <span className="text-xs bg-red-600 rounded px-2 py-1">{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="px-4 py-6 border-t border-gray-800">
          <div className="mb-4">
            <p className="text-xs text-gray-500 font-semibold mb-2">YOUR FILL RATE</p>
            <p className="text-2xl font-bold text-white mb-1">78%</p>
            <p className="text-xs text-gray-400">5 points above city average</p>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-[#273353] h-2 rounded-full" style={{ width: '78%' }}></div>
          </div>
        </div>

        <div className="px-4 py-4 border-t border-gray-800">
          <button className="w-full text-left px-4 py-2 rounded text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            Help & support
          </button>
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
            ← Back to today
          </button>
          <p className="text-sm text-gray-600">
            Draft saved locally · nothing leaves the screen until you send it
          </p>
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-[#273353]">
            AS
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-sm font-medium">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="col-span-2 space-y-8">
                {/* Header */}
                <div>
                  <p className="text-xs font-semibold text-[#273353] mb-2">NEW PRESCRIPTION</p>
                  <h1
                    className="text-5xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    Write it once. We'll watch the rest.
                  </h1>
                  <p className="text-gray-600 max-w-lg">
                    Once you send this, it lands in the pharmacy's digital queue and RxTrack starts following the fill status — so you find out if the medicine never reached the patient.
                  </p>
                </div>

                {/* Who is it for */}
                <div className="bg-white rounded border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Who is it for</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        PATIENT NAME
                      </label>
                      <input
                        type="text"
                        name="patientName"
                        value={formData.patientName}
                        onChange={handleInputChange}
                        placeholder="e.g. Rahul Verma"
                        required
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-[#273353] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#273353]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          AGE
                        </label>
                        <input
                          type="number"
                          name="patientAge"
                          value={formData.patientAge}
                          onChange={handleInputChange}
                          placeholder="46"
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-[#273353] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#273353]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          PHONE (OPTIONAL)
                        </label>
                        <input
                          type="tel"
                          name="patientPhone"
                          value={formData.patientPhone}
                          onChange={handleInputChange}
                          placeholder="98xxxxxxxx"
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-[#273353] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#273353]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* The medicines */}
                <div className="bg-white rounded border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">The medicines</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Select from catalog or search molecule
                      </p>
                    </div>
                    <span className="text-sm text-gray-600">{formData.medicines.length} added</span>
                  </div>

                  <div className="space-y-4">
                    {formData.medicines.map((medicine, index) => (
                      <div key={index} className="border border-gray-200 rounded p-4 space-y-3">
                        <div className="flex gap-3">
                          <div className="flex-1">
                            {availableMedicines.length > 0 ? (
                              <select
                                value={medicine.medicineId}
                                onChange={(e) =>
                                  handleMedicineChange(index, 'medicineId', e.target.value)
                                }
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm text-[#273353] focus:outline-none focus:ring-2 focus:ring-[#273353]"
                              >
                                <option value="">-- Select medicine from catalog --</option>
                                {availableMedicines.map((med) => (
                                  <option key={med.id} value={med.id}>
                                    {med.name} {med.strength ? `(${med.strength})` : ''} - {med.form || 'Medicine'}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                placeholder="Medicine name and strength"
                                value={medicine.name}
                                onChange={(e) =>
                                  handleMedicineChange(index, 'name', e.target.value)
                                }
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm text-[#273353] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#273353]"
                              />
                            )}
                          </div>
                          {formData.medicines.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMedicineLine(index)}
                              className="text-red-600 hover:text-red-700 font-medium px-2"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Quantity</label>
                            <input
                              type="number"
                              placeholder="1"
                              value={medicine.quantity}
                              onChange={(e) =>
                                handleMedicineChange(index, 'quantity', e.target.value)
                              }
                              min="1"
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm text-[#273353] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#273353]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Frequency</label>
                            <select
                              value={medicine.frequency}
                              onChange={(e) =>
                                handleMedicineChange(index, 'frequency', e.target.value)
                              }
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm text-[#273353] focus:outline-none focus:ring-2 focus:ring-[#273353]"
                            >
                              {frequencyOptions.map((freq) => (
                                <option key={freq} value={freq}>
                                  {freq}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Duration</label>
                            <input
                              type="text"
                              placeholder="10 days"
                              value={medicine.duration}
                              onChange={(e) =>
                                handleMedicineChange(index, 'duration', e.target.value)
                              }
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm text-[#273353] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#273353]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={addMedicineLine}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-900 rounded text-sm font-medium hover:bg-gray-200"
                    >
                      + Add another medicine
                    </button>
                    {availableMedicines.length > 0 && (
                      <p className="text-xs text-gray-500">
                        {availableMedicines.length} medicines available in catalog
                      </p>
                    )}
                  </div>
                </div>

                {/* Scan or photo */}
                <div className="bg-white rounded border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Scan or photo (optional)</h2>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-[#273353] transition-colors">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-input"
                    />
                    <label htmlFor="file-input" className="cursor-pointer block">
                      {preview ? (
                        <div>
                          <img
                            src={preview}
                            alt="Preview"
                            className="max-h-40 mx-auto mb-4 rounded"
                          />
                          <p className="text-sm font-medium text-gray-900">{selectedFile?.name}</p>
                          <p className="text-xs text-gray-500 mt-1">Click to change</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-2xl mb-2">📄</p>
                          <p className="text-base font-medium text-gray-900 mb-1">
                            Drop the handwritten slip here
                          </p>
                          <p className="text-sm text-gray-600">
                            JPG or PDF, up to 10 MB — the pharmacist sees it alongside the typed lines
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Where it goes */}
                <div className="bg-white rounded border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Where it goes</h2>
                  <select
                    name="pharmacy"
                    value={formData.pharmacy}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-[#273353] focus:outline-none focus:ring-2 focus:ring-[#273353]"
                  >
                    {pharmacyOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div className="bg-white rounded border border-gray-200 p-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-3">NOTE FOR THE PHARMACIST</h2>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    placeholder="Substitute the generic if the brand is out of stock."
                    rows="4"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm text-[#273353] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#273353] resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-right">0/280</p>

                  <div className="mt-4 flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.notifyAfter}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            notifyAfter: e.target.checked,
                          }))
                        }
                        className="w-5 h-5 rounded bg-gray-50 border-gray-300 focus:ring-[#273353]"
                      />
                      <span className="text-xs text-gray-700">
                        Notify me if it's unfilled after 48 hours
                      </span>
                    </label>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    This is how most missed refills get caught
                  </p>
                </div>

                {/* Preview */}
                <div className="bg-white rounded border border-gray-200 p-6">
                  <p className="text-xs font-semibold text-gray-600 mb-4">PREVIEW</p>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {formData.patientName || 'Patient name'}
                  </h3>
                  <p className="text-xs text-gray-600 mb-4">
                    Medicines will appear here as you type.
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Dr. Aditi Sharma</span> · General Physician · Thu, 17 Aug
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gray-900 text-white rounded font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  ✈️ Send to pharmacy queue
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}