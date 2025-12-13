// ============================================================================
// FILE: src/components/ui/data-display/Badge/Badge.tsx
// Reusable Badge Component for Status/Tags
// ============================================================================

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export  const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-bg-tertiary text-text-primary border border-border-primary',
        success: 'bg-status-success/10 text-status-success border border-status-success/20',
        warning: 'bg-status-warning/10 text-status-warning border border-status-warning/20',
        error: 'bg-status-error/10 text-status-error border border-status-error/20',
        info: 'bg-status-info/10 text-status-info border border-status-info/20',
        accent: 'bg-accent/10 text-accent border border-accent/20',
        outline: 'border border-border-primary text-text-primary bg-transparent',
        
        // Customer specific
        vip: 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20',
        retail: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
        wholesale: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
        
        // Status specific
        active: 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20',
        inactive: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20',
        pending: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20',
        completed: 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20',
        cancelled: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Icon to display before text */
  icon?: React.ReactNode
  /** Make badge clickable */
  onClick?: () => void
  /** Show dot indicator */
  dot?: boolean
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, icon, onClick, dot, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          badgeVariants({ variant, size }),
          onClick && 'cursor-pointer hover:opacity-80',
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'mr-1.5 h-1.5 w-1.5 rounded-full',
              variant === 'success' && 'bg-status-success',
              variant === 'warning' && 'bg-status-warning',
              variant === 'error' && 'bg-status-error',
              variant === 'info' && 'bg-status-info',
              variant === 'active' && 'bg-green-500',
              variant === 'inactive' && 'bg-gray-500',
              !variant && 'bg-current'
            )}
          />
        )}
        {icon && <span className="mr-1">{icon}</span>}
        {children}
      </div>
    )
  }
)

Badge.displayName = 'Badge'