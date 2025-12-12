// ============================================================================
// FILE: src/components/ui/filters/FilterBar/FilterBar.tsx
// Generic Filter Container for All Modules
// ============================================================================

import * as React from 'react'
import {  X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from '@/hooks/useMediaQuery'

export interface FilterBarProps {
  children: React.ReactNode
  onClearAll?: () => void
  hasActiveFilters?: boolean
  showClearButton?: boolean
  className?: string
  mobileSheet?: React.ReactNode
}

export const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(
  (
    {
      children,
      onClearAll,
      hasActiveFilters = false,
      showClearButton = true,
      className,
      mobileSheet,
    },
    ref
  ) => {
    const { t } = useTranslation()
    const isDesktop = useMediaQuery('(min-width: 768px)')

    return (
      <div ref={ref} className={cn('space-y-4', className)}>
        {/* Desktop: Horizontal Filter Bar */}
        {isDesktop ? (
          <div className="flex flex-wrap items-center gap-3">
            {children}
            
            {/* Clear All Button */}
            {showClearButton && hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="ml-auto"
              >
                <X className="mr-2 h-4 w-4" />
                {t('filters.clearAll')}
              </Button>
            )}
          </div>
        ) : (
          /* Mobile: Show Mobile Sheet */
          <div className="flex flex-col gap-3">
            {children}
            {mobileSheet}
          </div>
        )}
      </div>
    )
  }
)

FilterBar.displayName = 'FilterBar'
