// ============================================================================
// FILE: src/components/ui/data-display/StatCard/StatCard.tsx
// Flexible Analytics Card Component for All Modules
// ============================================================================

import * as React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
// import { useTranslation } from 'react-i18next'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type StatCardVariant = 'default' | 'success' | 'warning' | 'error' | 'info'
export type StatCardSize = 'sm' | 'md' | 'lg'
export type TrendDirection = 'up' | 'down' | 'neutral'

export interface StatCardProps {
  // Content
  title: string
  value: string | number
  subtitle?: string
  description?: string
  
  // Trend/Change
  trend?: {
    value: number
    direction?: TrendDirection
    label?: string
    showIcon?: boolean
  }
  
  // Visual
  icon?: LucideIcon
  variant?: StatCardVariant
  size?: StatCardSize
  
  // Behavior
  onClick?: () => void
  loading?: boolean
  className?: string
  
  // Custom content
  footer?: React.ReactNode
  badge?: React.ReactNode
}

// ============================================================================
// VARIANT STYLES
// ============================================================================

const variantStyles: Record<StatCardVariant, string> = {
  default: 'bg-bg-secondary border-border-primary',
  success: 'bg-bg-secondary border-status-success/30',
  warning: 'bg-bg-secondary border-status-warning/30',
  error: 'bg-bg-secondary border-status-error/30',
  info: 'bg-bg-secondary border-status-info/30',
}

const iconVariantStyles: Record<StatCardVariant, string> = {
  default: 'bg-accent/10 text-accent',
  success: 'bg-status-success/10 text-status-success',
  warning: 'bg-status-warning/10 text-status-warning',
  error: 'bg-status-error/10 text-status-error',
  info: 'bg-status-info/10 text-status-info',
}

const sizeStyles: Record<StatCardSize, { container: string; icon: string; value: string; title: string }> = {
  sm: {
    container: 'p-4',
    icon: 'h-8 w-8',
    value: 'text-xl',
    title: 'text-xs',
  },
  md: {
    container: 'p-5',
    icon: 'h-10 w-10',
    value: 'text-2xl',
    title: 'text-sm',
  },
  lg: {
    container: 'p-6',
    icon: 'h-12 w-12',
    value: 'text-3xl',
    title: 'text-base',
  },
}

// ============================================================================
// TREND COMPONENT
// ============================================================================

interface TrendIndicatorProps {
  trend: NonNullable<StatCardProps['trend']>
}

const TrendIndicator: React.FC<TrendIndicatorProps> = ({ trend }) => {
  // const { t } = useTranslation()
  
  const getTrendColor = () => {
    if (trend.direction === 'up') return 'text-status-success'
    if (trend.direction === 'down') return 'text-status-error'
    return 'text-text-tertiary'
  }
  
  const getTrendIcon = () => {
    if (!trend.showIcon) return null
    if (trend.direction === 'up') return '↑'
    if (trend.direction === 'down') return '↓'
    return '→'
  }
  
  return (
    <div className={cn('flex items-center gap-1 text-sm font-medium', getTrendColor())}>
      {trend.showIcon && <span className="text-base">{getTrendIcon()}</span>}
      <span>{trend.value > 0 ? '+' : ''}{trend.value}%</span>
      {trend.label && (
        <span className="text-text-tertiary font-normal ml-1">{trend.label}</span>
      )}
    </div>
  )
}

// ============================================================================
// STATCARD COMPONENT
// ============================================================================

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      title,
      value,
      subtitle,
      description,
      trend,
      icon: Icon,
      variant = 'default',
      size = 'md',
      onClick,
      loading = false,
      className,
      footer,
      badge,
    },
    ref
  ) => {
    // const { t } = useTranslation()
    
    const isClickable = !!onClick
    const styles = sizeStyles[size]
    
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          'rounded-lg border transition-all duration-200',
          variantStyles[variant],
          styles.container,
          isClickable && 'cursor-pointer hover:shadow-md hover:border-accent/50',
          loading && 'animate-pulse',
          className
        )}
      >
        {/* Header with Icon and Badge */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {Icon && (
              <div
                className={cn(
                  'rounded-lg p-2 flex items-center justify-center transition-colors',
                  iconVariantStyles[variant],
                  styles.icon
                )}
              >
                <Icon className="h-full w-full" />
              </div>
            )}
            
            <div className="flex flex-col">
              <h3
                className={cn(
                  'font-medium text-text-secondary uppercase tracking-wide',
                  styles.title
                )}
              >
                {title}
              </h3>
              {subtitle && (
                <span className="text-xs text-text-tertiary mt-0.5">{subtitle}</span>
              )}
            </div>
          </div>
          
          {badge && <div className="flex-shrink-0">{badge}</div>}
        </div>
        
        {/* Value and Trend */}
        <div className="space-y-2">
          <div className="flex items-end justify-between gap-2">
            <p
              className={cn(
                'font-bold text-text-primary leading-none',
                styles.value
              )}
            >
              {loading ? '---' : value}
            </p>
            
            {trend && !loading && <TrendIndicator trend={trend} />}
          </div>
          
          {description && (
            <p className="text-sm text-text-tertiary">{description}</p>
          )}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="mt-4 pt-4 border-t border-border-secondary">
            {footer}
          </div>
        )}
      </div>
    )
  }
)

StatCard.displayName = 'StatCard'