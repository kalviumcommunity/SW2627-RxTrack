'use client'

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  error = null,
}) {
  return (
    <div className="mb-6">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-3 py-2.5 border rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
          error
            ? 'border-red-600 focus:ring-red-500'
            : 'border-gray-300 focus:ring-blue-600'
        }`}
      />
      {error && <p className="text-red-600 text-xs mt-1.5">{error}</p>}
    </div>
  )
}