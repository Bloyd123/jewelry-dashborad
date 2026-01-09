// FILE: components/ui/loader/Spinner.tsx
// Simple Inline Spinner Component

import type { SpinnerProps } from '@/types/loader.types'

export const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => {
  const sizeClasses = {
    xs: 'w-3 h-3 border-2',
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  }

  return (
    <div
      className={`inline-block ${sizeClasses[size]} animate-spin rounded-full border-current border-t-transparent ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}
