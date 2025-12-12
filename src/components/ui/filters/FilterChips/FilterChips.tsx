// ============================================================================
// FILE: src/components/ui/filters/FilterChips/FilterChips.tsx
// Active Filter Tags Display
// ============================================================================

import * as React from 'react'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/data-display/Badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface ActiveFilter {
  id: string
  label: string
  value: string
}

export interface FilterChipsProps {
  filters: ActiveFilter[]
  onRemove: (filterId: string) => void
  onClearAll?: () => void
  className?: string
}

export const FilterChips = React.forwardRef<HTMLDivElement, FilterChipsProps>(
  ({ filters, onRemove, onClearAll, className }, ref) => {
    const { t } = useTranslation()

    if (filters.length === 0) return null

    return (
      <div ref={ref} className={cn('flex flex-wrap items-center gap-2', className)}>
        <span className="text-sm text-text-tertiary">{t('filters.active')}:</span>
        
        {filters.map((filter) => (
          <Badge
            key={filter.id}
            variant="outline"
            className="gap-1 pr-1 cursor-pointer hover:bg-bg-tertiary"
          >
            <span className="text-xs">
              {filter.label}: {filter.value}
            </span>
            <button
              onClick={() => onRemove(filter.id)}
              className="ml-1 rounded-full p-0.5 hover:bg-bg-primary transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        {filters.length > 1 && onClearAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-6 px-2 text-xs"
          >
            {t('filters.clearAll')}
          </Button>
        )}
      </div>
    )
  }
)

FilterChips.displayName = 'FilterChips'