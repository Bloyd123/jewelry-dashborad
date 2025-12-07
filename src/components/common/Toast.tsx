import React, { useEffect, useState } from 'react'

import { Notification } from '../../context/NotificationContext'

interface ToastProps extends Notification {
  onClose: (id: string) => void
}

const Toast: React.FC<ToastProps> = ({
  id,
  message,
  variant,
  title,
  duration,
  onClose,
}) => {
  const [isExiting, setIsExiting] = useState(false)

  // Variant styles
  const variantStyles = {
    success: 'bg-green-50 border-green-500 text-green-800',
    error: 'bg-red-50 border-red-500 text-red-800',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
    info: 'bg-blue-50 border-blue-500 text-blue-800',
  }

  // Icons
  const icons = {
    success: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
    warning: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
    info: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
  }

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose(id)
    }, 300) // Match animation duration
  }

  // Auto-close animation trigger before removal
  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true)
      }, duration - 300) // Start exit animation 300ms before removal

      return () => clearTimeout(timer)
    }
  }, [duration])

  return (
    <div
      className={`mb-3 flex transform items-start gap-3 rounded-lg border-l-4 p-4 shadow-lg transition-all duration-300 ease-in-out ${variantStyles[variant]} ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'} min-w-[320px] max-w-md`}
    >
      {/* Icon */}
      <div className="mt-0.5 flex-shrink-0">{icons[variant]}</div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {title && (
          <h4 className="mb-1 text-sm font-semibold text-gray-900">{title}</h4>
        )}
        <p className="text-sm text-gray-900">{message}</p>
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="ml-2 flex-shrink-0 text-current opacity-60 transition-opacity hover:opacity-100"
        aria-label="Close notification"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  )
}

export default Toast
