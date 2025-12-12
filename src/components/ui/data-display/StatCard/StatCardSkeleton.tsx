// ============================================================================
// FILE: src/components/ui/data-display/StatCard/StatCardSkeleton.tsx
// Loading Skeleton for StatCard
// ============================================================================

import * as React from 'react'
import { cn } from '@/lib/utils'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface StatCardSkeletonProps {
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  showTrend?: boolean
  showFooter?: boolean
  className?: string
}

// ============================================================================
// SIZE STYLES
// ============================================================================

const sizeStyles: Record<string, { container: string; icon: string; value: string }> = {
  sm: {
    container: 'p-4',
    icon: 'h-8 w-8',
    value: 'h-6 w-20',
  },
  md: {
    container: 'p-5',
    icon: 'h-10 w-10',
    value: 'h-7 w-24',
  },
  lg: {
    container: 'p-6',
    icon: 'h-12 w-12',
    value: 'h-8 w-28',
  },
}

// ============================================================================
// STATCARDSKELETON COMPONENT
// ============================================================================

export const StatCardSkeleton: React.FC<StatCardSkeletonProps> = ({
  size = 'md',
  showIcon = true,
  showTrend = true,
  showFooter = false,
  className,
}) => {
  const styles = sizeStyles[size]
  
  return (
    <div
      className={cn(
        'rounded-lg border bg-bg-secondary border-border-primary',
        styles.container,
        className
      )}
    >
      {/* Header with Icon */}
      <div className="flex items-start gap-3 mb-3">
        {showIcon && (
          <div
            className={cn(
              'rounded-lg bg-bg-tertiary animate-pulse',
              styles.icon
            )}
          />
        )}
        
        <div className="flex-1 space-y-2">
          {/* Title */}
          <div className="h-3 w-24 bg-bg-tertiary rounded animate-pulse" />
          {/* Subtitle */}
          <div className="h-2 w-16 bg-bg-tertiary rounded animate-pulse" />
        </div>
      </div>
      
      {/* Value and Trend */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          {/* Value */}
          <div
            className={cn(
              'bg-bg-tertiary rounded animate-pulse',
              styles.value
            )}
          />
          
          {/* Trend */}
          {showTrend && (
            <div className="h-4 w-16 bg-bg-tertiary rounded animate-pulse" />
          )}
        </div>
        
        {/* Description */}
        <div className="h-3 w-full bg-bg-tertiary rounded animate-pulse" />
      </div>
      
      {/* Footer */}
      {showFooter && (
        <div className="mt-4 pt-4 border-t border-border-secondary">
          <div className="h-3 w-32 bg-bg-tertiary rounded animate-pulse" />
        </div>
      )}
    </div>
  )
}

StatCardSkeleton.displayName = 'StatCardSkeleton'