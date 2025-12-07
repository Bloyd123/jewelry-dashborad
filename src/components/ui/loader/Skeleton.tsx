// ============================================================================
// FILE: components/ui/loader/Skeleton.tsx
// Skeleton Loader for Content Loading States
// ============================================================================

import type { SkeletonProps } from '@/types/loader.types'

export const Skeleton = ({
  variant = 'text',
  width = '100%',
  height = variant === 'text' ? '1rem' : '100%',
  className = '',
  count = 1,
  animate = true,
}: SkeletonProps) => {
  const baseClasses = `bg-bg-tertiary ${animate ? 'animate-pulse' : ''}`

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg',
  }

  const skeletonElement = (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  )

  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i}>{skeletonElement}</div>
        ))}
      </div>
    )
  }

  return skeletonElement
}
