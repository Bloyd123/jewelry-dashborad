// FILE: src/components/sales/SalesFilters/ActiveFiltersDisplay.tsx
// Active Filters Display Component

import * as React from 'react'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export interface ActiveFilter {
  id: string
  label: string
  value: string
}

interface ActiveFiltersDisplayProps {
  filters: ActiveFilter[]
  onRemove: (filterId: string) => void
  onClearAll?: () => void
  className?: string
}

export const ActiveFiltersDisplay = React.forwardRef<
  HTMLDivElement,
  ActiveFiltersDisplayProps
>(({ filters, onRemove, onClearAll, className }, ref) => {
  const { t } = useTranslation()

  if (filters.length === 0) return null

  return (
    <div
      ref={ref}
      className={cn('flex flex-wrap items-center gap-2', className)}
    >
      <span className="text-sm text-text-tertiary">
        {t('sales.filters.active')}:
      </span>

      {filters.map(filter => (
        <div
          key={filter.id}
          className="inline-flex items-center gap-1 rounded-full border border-border-primary bg-bg-tertiary px-3 py-1 text-xs text-text-primary"
        >
          <span className="font-medium">{filter.label}:</span>
          <span>{filter.value}</span>
          <button
            onClick={() => onRemove(filter.id)}
            className="ml-1 rounded-full p-0.5 transition-colors hover:bg-bg-primary"
            aria-label={t('sales.filters.remove')}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}

      {filters.length > 1 && onClearAll && (
        <button
          onClick={onClearAll}
          className="text-xs text-accent hover:underline"
        >
          {t('sales.filters.clearAll')}
        </button>
      )}
    </div>
  )
})

ActiveFiltersDisplay.displayName = 'ActiveFiltersDisplay'
