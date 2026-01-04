// FILE: src/components/forms/FormError/FormError.tsx
// Theme-based Form Error Component

import { AlertCircle, AlertTriangle, XCircle } from 'lucide-react'

interface FormErrorProps {
  error?: string
  type?: 'error' | 'warning' | 'info'
  className?: string
}

export const FormError = ({
  error,
  type = 'error',
  className = '',
}: FormErrorProps) => {
  if (!error) return null

  const config = {
    error: {
      icon: XCircle,
      color: 'text-status-error',
      bg: 'bg-status-error/10',
      border: 'border-status-error/20',
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-status-warning',
      bg: 'bg-status-warning/10',
      border: 'border-status-warning/20',
    },
    info: {
      icon: AlertCircle,
      color: 'text-status-info',
      bg: 'bg-status-info/10',
      border: 'border-status-info/20',
    },
  }

  const { icon: Icon, color, bg, border } = config[type]

  return (
    <div
      className={`flex items-center gap-2 rounded-md border p-3 ${bg} ${border} ${color} ${className} `}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className="text-sm">{error}</span>
    </div>
  )
}
