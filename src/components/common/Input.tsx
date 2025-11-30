// ============================================================================
// Mini-Step 7.2: Input Component (Theme-Aware)
// FILE: src/components/common/Input.tsx
// ============================================================================

import { InputHTMLAttributes, forwardRef, ReactNode } from 'react'

import { useAppSelector } from '../../store/hooks'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      required,
      disabled,
      fullWidth = false,
      className = '',
      ...props
    },
    ref
  ) => {
    // Get theme state from Redux
    const accentColor = useAppSelector(state => state.ui.accentColor)
    const appearance = useAppSelector(state => state.ui.appearance)

    const inputId =
      props.id || `input-${Math.random().toString(36).substr(2, 9)}`

    // Appearance-based spacing
    const spacingClass =
      appearance === 'compact'
        ? 'py-1'
        : appearance === 'comfortable'
          ? 'py-3'
          : 'py-2'
    const textSizeClass =
      appearance === 'compact'
        ? 'text-sm'
        : appearance === 'comfortable'
          ? 'text-base'
          : 'text-base'

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={`mb-1 block font-medium text-gray-700 dark:text-gray-300 ${appearance === 'compact' ? 'text-xs' : 'text-sm'}`}
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-400 dark:text-gray-500">
                {leftIcon}
              </span>
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`block w-full rounded-lg border ${leftIcon ? 'pl-10' : 'pl-3'} ${rightIcon ? 'pr-10' : 'pr-3'} ${spacingClass} ${textSizeClass} bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 ${
              error
                ? `border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600`
                : `border-gray-300 focus:border-${accentColor}-500 focus:ring-${accentColor}-500 dark:border-gray-600 dark:focus:border-${accentColor}-400`
            } transition-colors duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-100 dark:placeholder:text-gray-500 dark:disabled:bg-gray-900 ${className} `}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span
                className={
                  error ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'
                }
              >
                {rightIcon}
              </span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p
            className={`mt-1 text-red-600 dark:text-red-400 ${appearance === 'compact' ? 'text-xs' : 'text-sm'}`}
          >
            {error}
          </p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p
            className={`mt-1 text-gray-500 dark:text-gray-400 ${appearance === 'compact' ? 'text-xs' : 'text-sm'}`}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
