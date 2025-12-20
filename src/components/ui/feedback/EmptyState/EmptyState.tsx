// ============================================================================
// FILE: src/components/ui/feedback/EmptyState/EmptyState.tsx
// Reusable Empty State Component - Fully Flexible & Responsive
// ============================================================================

import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  FileX,
  Search,
  Package,
  Users,
  ShoppingCart,
  FileText,
  BarChart3,
  Database,
  Inbox,
  AlertCircle,
  Image as ImageIcon,
  Filter,
  Calendar,
  LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

// ============================================================================
// TYPES
// ============================================================================

export type EmptyStateVariant =
  | 'default'
  | 'search'
  | 'filter'
  | 'error'
  | 'success'
  | 'info'

export type EmptyStateSize = 'sm' | 'md' | 'lg'

export interface EmptyStateAction {
  label: string
  onClick: () => void
  variant?: 'default' | 'outline' | 'ghost'
  icon?: React.ReactNode
  disabled?: boolean
  loading?: boolean
}

export interface EmptyStateProps {
  // Content
  title?: string
  description?: string
  icon?: React.ReactNode | LucideIcon

  // Variant & Style
  variant?: EmptyStateVariant
  size?: EmptyStateSize

  // Actions
  action?: EmptyStateAction
  secondaryAction?: EmptyStateAction

  // Custom Content
  children?: React.ReactNode
  customContent?: React.ReactNode

  // Image/Illustration
  image?: string
  imageAlt?: string

  // Styling
  className?: string
  iconClassName?: string
  titleClassName?: string
  descriptionClassName?: string

  // Responsive
  fullHeight?: boolean
  compact?: boolean

  // Additional
  testId?: string
}

// ============================================================================
// PRESET ICONS (For Common Use Cases)
// ============================================================================

export const EmptyStateIcons = {
  default: FileX,
  search: Search,
  filter: Filter,
  customers: Users,
  products: Package,
  orders: ShoppingCart,
  invoices: FileText,
  analytics: BarChart3,
  database: Database,
  inbox: Inbox,
  error: AlertCircle,
  calendar: Calendar,
  image: ImageIcon,
} as const

// ============================================================================
// EMPTY STATE COMPONENT
// ============================================================================

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  variant = 'default',
  size = 'md',
  action,
  secondaryAction,
  children,
  customContent,
  image,
  imageAlt,
  className,
  iconClassName,
  titleClassName,
  descriptionClassName,
  fullHeight = false,
  compact = false,
  testId = 'empty-state',
}) => {
  const { t } = useTranslation()

  // ========================================================================
  // SIZE CONFIGURATION
  // ========================================================================

  const sizeConfig = {
    sm: {
      container: 'py-8 px-4',
      icon: 'h-12 w-12 mb-3',
      image: 'h-32 w-32 mb-4',
      title: 'text-base font-semibold',
      description: 'text-sm',
      gap: 'gap-2',
      actionSize: 'sm' as const,
    },
    md: {
      container: 'py-12 px-6',
      icon: 'h-16 w-16 mb-4',
      image: 'h-40 w-40 mb-6',
      title: 'text-lg font-semibold',
      description: 'text-sm',
      gap: 'gap-3',
      actionSize: 'default' as const,
    },
    lg: {
      container: 'py-16 px-8',
      icon: 'h-20 w-20 mb-6',
      image: 'h-48 w-48 mb-8',
      title: 'text-xl font-semibold',
      description: 'text-base',
      gap: 'gap-4',
      actionSize: 'lg' as const,
    },
  }

  const config = sizeConfig[size]

  // ========================================================================
  // VARIANT CONFIGURATION
  // ========================================================================

  const variantConfig = {
    default: {
      iconColor: 'text-text-tertiary',
      titleColor: 'text-text-primary',
      descriptionColor: 'text-text-secondary',
      bgColor: '',
    },
    search: {
      iconColor: 'text-accent',
      titleColor: 'text-text-primary',
      descriptionColor: 'text-text-secondary',
      bgColor: '',
    },
    filter: {
      iconColor: 'text-accent',
      titleColor: 'text-text-primary',
      descriptionColor: 'text-text-secondary',
      bgColor: '',
    },
    error: {
      iconColor: 'text-status-error',
      titleColor: 'text-text-primary',
      descriptionColor: 'text-text-secondary',
      bgColor: 'bg-status-error/5',
    },
    success: {
      iconColor: 'text-status-success',
      titleColor: 'text-text-primary',
      descriptionColor: 'text-text-secondary',
      bgColor: 'bg-status-success/5',
    },
    info: {
      iconColor: 'text-status-info',
      titleColor: 'text-text-primary',
      descriptionColor: 'text-text-secondary',
      bgColor: 'bg-status-info/5',
    },
  }

  const variantStyles = variantConfig[variant]

  // ========================================================================
  // RENDER ICON
  // ========================================================================

  const renderIcon = () => {
    if (!icon && !image) return null

    if (image) {
      return (
        <img
          src={image}
          alt={imageAlt || t('ui.emptyState.illustration')}
          className={cn(config.image, 'object-contain')}
        />
      )
    }

    // If icon is a component (LucideIcon)
    if (typeof icon === 'function') {
      const IconComponent = icon as LucideIcon
      return (
        <IconComponent
          className={cn(config.icon, variantStyles.iconColor, iconClassName)}
          strokeWidth={1.5}
        />
      )
    }

    // If icon is JSX element
    return (
      <div
        className={cn(
          config.icon,
          'flex items-center justify-center',
          variantStyles.iconColor,
          iconClassName
        )}
      >
        {icon}
      </div>
    )
  }

  // ========================================================================
  // RENDER ACTIONS
  // ========================================================================

  const renderActions = () => {
    if (!action && !secondaryAction) return null

    return (
      <div className={cn('mt-6 flex flex-col items-center gap-3 sm:flex-row')}>
        {action && (
          <Button
            onClick={action.onClick}
            variant={action.variant || 'default'}
            size={config.actionSize}
            disabled={action.disabled}
            className={cn('w-full sm:w-auto', action.icon && 'gap-2')}
          >
            {action.icon}
            {t(action.label)}
          </Button>
        )}

        {secondaryAction && (
          <Button
            onClick={secondaryAction.onClick}
            variant={secondaryAction.variant || 'outline'}
            size={config.actionSize}
            disabled={secondaryAction.disabled}
            className={cn('w-full sm:w-auto', secondaryAction.icon && 'gap-2')}
          >
            {secondaryAction.icon}
            {t(secondaryAction.label)}
          </Button>
        )}
      </div>
    )
  }

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        config.container,
        variantStyles.bgColor,
        fullHeight && 'min-h-[400px]',
        compact && 'py-8',
        'rounded-lg',
        className
      )}
      data-testid={testId}
      role="status"
      aria-live="polite"
    >
      {/* Icon or Image */}
      {renderIcon()}

      {/* Title */}
      {title && (
        <h3
          className={cn(
            config.title,
            variantStyles.titleColor,
            'mb-2',
            titleClassName
          )}
        >
          {t(title)}
        </h3>
      )}

      {/* Description */}
      {description && (
        <p
          className={cn(
            config.description,
            variantStyles.descriptionColor,
            'mx-auto max-w-md',
            descriptionClassName
          )}
        >
          {t(description)}
        </p>
      )}

      {/* Custom Content */}
      {customContent && (
        <div className="mx-auto mt-4 w-full max-w-md">{customContent}</div>
      )}

      {/* Actions */}
      {renderActions()}

      {/* Children (for complete custom content) */}
      {children && (
        <div className="mx-auto mt-6 w-full max-w-lg">{children}</div>
      )}
    </div>
  )
}

// ============================================================================
// PRESET COMPONENTS (Common Use Cases)
// ============================================================================

/**
 * No Search Results
 */
export const EmptySearchResults: React.FC<{
  query?: string
  onClear?: () => void
  className?: string
}> = ({ query, onClear, className }) => {
  const { t } = useTranslation()

  return (
    <EmptyState
      variant="search"
      icon={Search}
      title="ui.emptyState.noSearchResults"
      description={
        query
          ? t('ui.emptyState.noResultsFor', { query })
          : 'ui.emptyState.tryDifferentKeywords'
      }
      action={
        onClear
          ? {
              label: 'ui.emptyState.clearSearch',
              onClick: onClear,
              variant: 'outline',
            }
          : undefined
      }
      className={className}
    />
  )
}

/**
 * No Filter Results
 */
export const EmptyFilterResults: React.FC<{
  onClearFilters?: () => void
  className?: string
}> = ({ onClearFilters, className }) => {
  return (
    <EmptyState
      variant="filter"
      icon={Filter}
      title="ui.emptyState.noFilterResults"
      description="ui.emptyState.tryAdjustingFilters"
      action={
        onClearFilters
          ? {
              label: 'ui.emptyState.clearFilters',
              onClick: onClearFilters,
              variant: 'outline',
            }
          : undefined
      }
      className={className}
    />
  )
}

/**
 * No Data Available
 */
export const EmptyDataState: React.FC<{
  entityName?: string
  onAdd?: () => void
  addLabel?: string
  className?: string
}> = ({ entityName = 'items', onAdd, addLabel, className }) => {
  const { t } = useTranslation()

  return (
    <EmptyState
      icon={Database}
      title={t('ui.emptyState.noDataAvailable')}
      description={t('ui.emptyState.noItemsYet', { entity: entityName })}
      action={
        onAdd
          ? {
              label:
                addLabel || t('ui.emptyState.addFirst', { entity: entityName }),
              onClick: onAdd,
            }
          : undefined
      }
      className={className}
    />
  )
}

/**
 * Error State
 */
export const EmptyErrorState: React.FC<{
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}> = ({ title, description, onRetry, className }) => {
  return (
    <EmptyState
      variant="error"
      icon={AlertCircle}
      title={title || 'ui.emptyState.errorOccurred'}
      description={description || 'ui.emptyState.tryAgainLater'}
      action={
        onRetry
          ? {
              label: 'ui.emptyState.retry',
              onClick: onRetry,
            }
          : undefined
      }
      className={className}
    />
  )
}

// ============================================================================
// DISPLAY NAMES
// ============================================================================

EmptyState.displayName = 'EmptyState'
EmptySearchResults.displayName = 'EmptySearchResults'
EmptyFilterResults.displayName = 'EmptyFilterResults'
EmptyDataState.displayName = 'EmptyDataState'
EmptyErrorState.displayName = 'EmptyErrorState'

// ============================================================================
// EXPORT
// ============================================================================

export default EmptyState
