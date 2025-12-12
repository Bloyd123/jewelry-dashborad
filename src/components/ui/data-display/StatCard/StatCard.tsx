// ============================================================================
// FILE: src/components/ui/data-display/StatCard/StatCard.tsx
// Reusable Statistics Card Component
// ============================================================================

import * as React from 'react'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

export interface StatCardProps {
  title: string
  value: string | number
  icon?: LucideIcon
  trend?: {
    value: number
    direction: 'up' | 'down'
    label?: string
  }
  description?: string
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  onClick?: () => void
  loading?: boolean
  className?: string
}

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      title,
      value,
      icon: Icon,
      trend,
      description,
      variant = 'default',
      onClick,
      loading = false,
      className,
    },
    ref
  ) => {
    const { t } = useTranslation()

    const variantClasses = {
      default: 'border-border-primary',
      success: 'border-status-success/20 bg-status-success/5',
      warning: 'border-status-warning/20 bg-status-warning/5',
      error: 'border-status-error/20 bg-status-error/5',
      info: 'border-status-info/20 bg-status-info/5',
    }

    const iconColorClasses = {
      default: 'text-text-tertiary',
      success: 'text-status-success',
      warning: 'text-status-warning',
      error: 'text-status-error',
      info: 'text-status-info',
    }

    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(
            'rounded-lg border p-6 bg-bg-secondary',
            variantClasses.default,
            className
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 w-24 bg-bg-tertiary rounded animate-pulse" />
            {Icon && <div className="h-5 w-5 bg-bg-tertiary rounded animate-pulse" />}
          </div>
          <div className="h-8 w-32 bg-bg-tertiary rounded animate-pulse mb-2" />
          <div className="h-3 w-20 bg-bg-tertiary rounded animate-pulse" />
        </div>
      )
    }

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          'rounded-lg border p-6 transition-all duration-200 bg-bg-secondary',
          variantClasses[variant],
          onClick && 'cursor-pointer hover:shadow-md hover:scale-[1.02]',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
          {Icon && (
            <Icon
              className={cn('h-5 w-5', iconColorClasses[variant])}
              aria-hidden="true"
            />
          )}
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-text-primary">{value}</p>
          
          {/* Trend */}
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-medium',
                trend.direction === 'up' ? 'text-status-success' : 'text-status-error'
              )}
            >
              {trend.direction === 'up' ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{trend.value}%</span>
            </div>
          )}
        </div>

        {/* Description or Trend Label */}
        {(description || trend?.label) && (
          <p className="mt-2 text-xs text-text-tertiary">
            {trend?.label || description}
          </p>
        )}
      </div>
    )
  }
)

StatCard.displayName = 'StatCard'