// ============================================================================
// Mini-Step 7.4: Loader Component (Theme-Aware)
// FILE: src/components/common/Loader.tsx
// ============================================================================

import React from 'react'

import { useAppSelector } from '../../store/hooks'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fullscreen?: boolean
  text?: string
  color?: 'primary' | 'secondary' | 'white'
}

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  fullscreen = false,
  text,
  color = 'primary',
}) => {
  // Get theme state from Redux
  const accentColor = useAppSelector(state => state.ui.accentColor)
  const appearance = useAppSelector(state => state.ui.appearance)

  // Size styles - appearance aware
  const sizeStyles = {
    sm:
      appearance === 'compact'
        ? 'h-4 w-4'
        : appearance === 'comfortable'
          ? 'h-8 w-8'
          : 'h-6 w-6',
    md:
      appearance === 'compact'
        ? 'h-8 w-8'
        : appearance === 'comfortable'
          ? 'h-12 w-12'
          : 'h-10 w-10',
    lg:
      appearance === 'compact'
        ? 'h-12 w-12'
        : appearance === 'comfortable'
          ? 'h-20 w-20'
          : 'h-16 w-16',
    xl:
      appearance === 'compact'
        ? 'h-16 w-16'
        : appearance === 'comfortable'
          ? 'h-32 w-32'
          : 'h-24 w-24',
  }

  // Color styles - theme and accent aware
  const colorStyles = {
    primary: `text-${accentColor}-600 dark:text-${accentColor}-400`,
    secondary: 'text-gray-600 dark:text-gray-400',
    white: 'text-white',
  }

  // Text size - appearance aware
  const textSizeClass =
    appearance === 'compact'
      ? 'text-sm'
      : appearance === 'comfortable'
        ? 'text-xl'
        : 'text-lg'

  // Spinner Component
  const Spinner = () => (
    <svg
      className={`animate-spin ${sizeStyles[size]} ${colorStyles[color]}`}
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

  // Fullscreen Loader
  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90 dark:bg-gray-900 dark:bg-opacity-90">
        <div className="flex flex-col items-center gap-4">
          <Spinner />
          {text && (
            <p
              className={`${textSizeClass} font-medium text-gray-700 dark:text-gray-300`}
            >
              {text}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Inline Loader
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Spinner />
      {text && (
        <p
          className={`${appearance === 'compact' ? 'text-xs' : 'text-sm'} font-medium text-gray-600 dark:text-gray-400`}
        >
          {text}
        </p>
      )}
    </div>
  )
}

export default Loader
