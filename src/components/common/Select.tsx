// Mini-Step 7.3: Select Component (Theme-Aware)
// FILE: src/components/common/Select.tsx

import { SelectHTMLAttributes, forwardRef } from 'react'

import { useAppSelector } from '../../store/hooks'

interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: SelectOption[]
  error?: string
  helperText?: string
  placeholder?: string
  fullWidth?: boolean
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      helperText,
      placeholder,
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

    const selectId =
      props.id || `select-${Math.random().toString(36).substr(2, 9)}`

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
            htmlFor={selectId}
            className={`mb-1 block font-medium text-gray-700 dark:text-gray-300 ${appearance === 'compact' ? 'text-xs' : 'text-sm'}`}
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        {/* Select Container */}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={`block w-full rounded-lg border pl-3 pr-10 ${spacingClass} ${textSizeClass} bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 ${
              error
                ? `border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600`
                : `border-gray-300 focus:border-${accentColor}-500 focus:ring-${accentColor}-500 dark:border-gray-600 dark:focus:border-${accentColor}-400`
            } appearance-none transition-colors duration-200 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-900 ${className} `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map(option => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Dropdown Arrow Icon */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
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

Select.displayName = 'Select'

export default Select
