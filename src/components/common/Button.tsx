// ============================================================================
// Mini-Step 7.1: Button Component (Theme-Aware)
// FILE: src/components/common/Button.tsx
// ============================================================================

import React, { ButtonHTMLAttributes, ReactNode } from 'react'

import { useAppSelector } from '../../store/hooks'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  children: ReactNode
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  className = '',
  children,
  ...props
}) => {
  // Get theme state from Redux
  const accentColor = useAppSelector(state => state.ui.accentColor)
  const appearance = useAppSelector(state => state.ui.appearance)

  // Base styles - theme aware
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-900'

  // Variant styles - theme and accent aware
  const variantStyles = {
    primary: `bg-${accentColor}-600 text-white hover:bg-${accentColor}-700 focus:ring-${accentColor}-500 dark:bg-${accentColor}-500 dark:hover:bg-${accentColor}-600`,
    secondary:
      'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600',
    ghost:
      'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800',
    outline: `bg-transparent border-2 border-${accentColor}-600 text-${accentColor}-600 hover:bg-${accentColor}-50 focus:ring-${accentColor}-500 dark:border-${accentColor}-500 dark:text-${accentColor}-400 dark:hover:bg-${accentColor}-950`,
  }

  // Size styles - appearance aware
  const sizeStyles = {
    sm:
      appearance === 'compact'
        ? 'px-2 py-1 text-xs'
        : appearance === 'comfortable'
          ? 'px-4 py-2 text-sm'
          : 'px-3 py-1.5 text-sm',
    md:
      appearance === 'compact'
        ? 'px-3 py-1.5 text-sm'
        : appearance === 'comfortable'
          ? 'px-6 py-3 text-base'
          : 'px-4 py-2 text-base',
    lg:
      appearance === 'compact'
        ? 'px-4 py-2 text-base'
        : appearance === 'comfortable'
          ? 'px-8 py-4 text-lg'
          : 'px-6 py-3 text-lg',
  }

  // Loading spinner
  const Spinner = () => (
    <svg
      className="h-5 w-5 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )

  return (
    <button
      className={` ${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className} `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="mr-2">
          <Spinner />
        </span>
      )}
      {!loading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  )
}

export default Button
