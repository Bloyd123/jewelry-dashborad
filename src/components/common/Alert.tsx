// ============================================================================
// FILE: src/components/common/Alert/Alert.tsx
// Flexible Alert Component - TypeScript Issues Fixed
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  X,
  type LucideIcon,
} from 'lucide-react'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type AlertVariant = 'default' | 'success' | 'warning' | 'error' | 'info'
export type AlertSize = 'sm' | 'md' | 'lg'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  // Variant & Size
  variant?: AlertVariant
  size?: AlertSize

  // Content
  title?: string
  description?: string
  children?: React.ReactNode

  // Icon
  icon?: LucideIcon | React.ReactNode
  showIcon?: boolean

  // Dismissible
  dismissible?: boolean
  onDismiss?: () => void

  // Border & Shadow
  bordered?: boolean
  shadow?: boolean

  // Custom styling
  className?: string
}

// ============================================================================
// HELPER: GET VARIANT CLASSES
// ============================================================================

const getVariantClasses = (variant: AlertVariant): string => {
  const variants: Record<AlertVariant, string> = {
    default: 'bg-bg-secondary border-border-primary text-text-primary',
    success: 'bg-status-success/10 border-status-success/30 text-status-success',
    warning: 'bg-status-warning/10 border-status-warning/30 text-status-warning',
    error: 'bg-status-error/10 border-status-error/30 text-status-error',
    info: 'bg-status-info/10 border-status-info/30 text-status-info',
  }
  return variants[variant]
}

const getSizeClasses = (size: AlertSize): string => {
  const sizes: Record<AlertSize, string> = {
    sm: 'p-3 text-sm',
    md: 'p-4 text-base',
    lg: 'p-5 text-lg',
  }
  return sizes[size]
}

// ============================================================================
// HELPER: GET DEFAULT ICON
// ============================================================================

const getDefaultIcon = (variant: AlertVariant): LucideIcon => {
  const icons: Record<AlertVariant, LucideIcon> = {
    default: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    error: AlertCircle,
    info: Info,
  }
  return icons[variant]
}

// ============================================================================
// ALERT COMPONENT
// ============================================================================

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = 'default',
      size = 'md',
      title,
      description,
      children,
      icon,
      showIcon = true,
      dismissible = false,
      onDismiss,
      bordered = false,
      shadow = false,
      className,
      ...props
    },
    ref
  ) => {
    const { t } = useTranslation()
    const [dismissed, setDismissed] = React.useState(false)

    const handleDismiss = () => {
      setDismissed(true)
      onDismiss?.()
    }

    if (dismissed) return null

    // Get icon size based on alert size
    const iconSize = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    }[size]

    // Get icon component
    const IconComponent = React.useMemo(() => {
      if (!showIcon) return null
      if (icon) {
        // If icon is a React element
        if (React.isValidElement(icon)) return icon
        // If icon is a Lucide icon component
        const IconComp = icon as LucideIcon
        return <IconComp className={iconSize} />
      }
      // Default icon based on variant
      const DefaultIcon = getDefaultIcon(variant)
      return <DefaultIcon className={iconSize} />
    }, [icon, showIcon, variant, iconSize])

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'relative w-full rounded-lg border transition-colors duration-200',
          getVariantClasses(variant),
          getSizeClasses(size),
          bordered && 'border-2',
          !bordered && 'border',
          shadow && 'shadow-md',
          className
        )}
        {...props}
      >
        <div className="flex w-full items-start gap-3">
          {/* Icon */}
          {showIcon && IconComponent && (
            <div className={cn('flex-shrink-0', iconSize)}>
              {IconComponent}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 space-y-1">
            {title && <AlertTitle>{title}</AlertTitle>}
            {description && <AlertDescription>{description}</AlertDescription>}
            {children}
          </div>

          {/* Dismiss Button */}
          {dismissible && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="h-6 w-6 flex-shrink-0 hover:bg-bg-tertiary"
              aria-label={t('common.dismiss') || 'Dismiss'}
            >
              <X className={iconSize} />
            </Button>
          )}
        </div>
      </div>
    )
  }
)

Alert.displayName = 'Alert'

// ============================================================================
// ALERT TITLE COMPONENT
// ============================================================================

export interface AlertTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  className?: string
}

export const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  AlertTitleProps
>(({ className, children, ...props }, ref) => {
  return (
    <h5
      ref={ref}
      className={cn(
        'mb-1 font-semibold leading-none tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </h5>
  )
})

AlertTitle.displayName = 'AlertTitle'

// ============================================================================
// ALERT DESCRIPTION COMPONENT
// ============================================================================

export interface AlertDescriptionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export const AlertDescription = React.forwardRef<
  HTMLDivElement,
  AlertDescriptionProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('text-sm leading-relaxed opacity-90', className)}
      {...props}
    >
      {children}
    </div>
  )
})

AlertDescription.displayName = 'AlertDescription'

// ============================================================================
// ALERT ACTION COMPONENT (Optional)
// ============================================================================

export interface AlertActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'default' | 'destructive' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

export const AlertAction = React.forwardRef<
  HTMLButtonElement,
  AlertActionProps
>(
  (
    { className, variant = 'outline', size = 'sm', children, ...props },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn('mt-2', className)}
        {...props}
      >
        {children}
      </Button>
    )
  }
)

AlertAction.displayName = 'AlertAction'