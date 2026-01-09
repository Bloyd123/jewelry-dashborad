// FILE: components/ui/loader/Loader.tsx
// Main Flexible Loader Component
// ============================================================================

import { Loader2 } from 'lucide-react'
import type { LoaderProps } from '@/types/loader.types'

export const Loader = ({
  size = 'md',
  variant = 'spinner',
  text,
  fullScreen = false,
  overlay = false,
  color = 'accent',
}: LoaderProps) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  const colorClasses = {
    primary: 'text-text-primary',
    accent: 'text-accent',
    success: 'text-status-success',
    warning: 'text-status-warning',
    error: 'text-status-error',
  }

  const dotSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5',
  }

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <Loader2
            className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}
          />
        )

      case 'dots':
        return (
          <div className="flex gap-2">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className={`${dotSizes[size]} rounded-full bg-current ${colorClasses[color]}`}
                style={{
                  animation: 'bounce 1.4s ease-in-out infinite',
                  animationDelay: `${i * 0.16}s`,
                }}
              />
            ))}
          </div>
        )

      case 'pulse':
        return (
          <div className="relative">
            <div
              className={`${sizeClasses[size]} rounded-full border-4 border-current ${colorClasses[color]} opacity-25`}
            />
            <div
              className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-4 border-current ${colorClasses[color]} animate-ping`}
            />
          </div>
        )

      case 'bars':
        return (
          <div className="flex items-end gap-1">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className={`w-1 bg-current ${colorClasses[color]}`}
                style={{
                  height:
                    size === 'xs'
                      ? '12px'
                      : size === 'sm'
                        ? '16px'
                        : size === 'md'
                          ? '20px'
                          : size === 'lg'
                            ? '24px'
                            : '32px',
                  animation: 'pulse 1.2s ease-in-out infinite',
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        )

      default:
        return null
    }
  }

  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-3">
      {renderLoader()}
      {text && (
        <p
          className={`text-text-secondary ${size === 'xs' || size === 'sm' ? 'text-xs' : 'text-sm'}`}
        >
          {text}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary">
        {loaderContent}
      </div>
    )
  }

  if (overlay) {
    return (
      <div className="bg-bg-primary/80 absolute inset-0 z-40 flex items-center justify-center backdrop-blur-sm">
        {loaderContent}
      </div>
    )
  }

  return loaderContent
}
