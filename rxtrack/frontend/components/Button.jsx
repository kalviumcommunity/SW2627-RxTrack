'use client'

export default function Button({
  label,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
}) {
  const styles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300',
    success: 'bg-green-600 text-white hover:bg-green-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }

  const baseClasses = 'px-4 py-2.5 rounded-md font-medium text-sm transition-colors duration-200'
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${styles[variant]} ${disabledClasses}`}
    >
      {label}
    </button>
  )
}