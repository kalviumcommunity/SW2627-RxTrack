'use client'

export default function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm p-6 ${className}`}>
      {title && (
        <div className="mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
      )}
      {children}
    </div>
  )
}