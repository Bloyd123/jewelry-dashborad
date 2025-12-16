// ============================================================================
// FILE: src/components/ui/filters/PriceRangeFilter/PriceRangeFilter.tsx
// Price/Amount Range Filter with Min-Max Inputs
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface PriceRange {
  min?: number
  max?: number
}

export interface PriceRangeFilterProps {
  value?: PriceRange
  onChange: (range: PriceRange) => void
  currency?: string
  minPlaceholder?: string
  maxPlaceholder?: string
  className?: string
  disabled?: boolean
}

export const PriceRangeFilter = React.forwardRef<HTMLDivElement, PriceRangeFilterProps>(
  (
    {
      value = {},
      onChange,
      currency = '₹',
      minPlaceholder,
      maxPlaceholder,
      className,
      disabled = false,
    },
    ref
  ) => {
    const { t } = useTranslation()

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const min = e.target.value ? Number(e.target.value) : undefined
      onChange({ ...value, min })
    }

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const max = e.target.value ? Number(e.target.value) : undefined
      onChange({ ...value, max })
    }

    return (
      <div ref={ref} className={cn('space-y-2', className)}>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-text-tertiary">
              {t('shop.filters.minPrice')}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
                {currency}
              </span>
              <Input
                type="number"
                value={value.min || ''}
                onChange={handleMinChange}
                placeholder={minPlaceholder || '0'}
                disabled={disabled}
                className="pl-8"
                min={0}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-text-tertiary">
              {t('shop.filters.maxPrice')}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
                {currency}
              </span>
              <Input
                type="number"
                value={value.max || ''}
                onChange={handleMaxChange}
                placeholder={maxPlaceholder || '∞'}
                disabled={disabled}
                className="pl-8"
                min={value.min || 0}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
)

PriceRangeFilter.displayName = 'PriceRangeFilter'