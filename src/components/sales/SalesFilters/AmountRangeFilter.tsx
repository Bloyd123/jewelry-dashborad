// FILE: src/components/sales/SalesFilters/AmountRangeFilter.tsx
// Amount Range Filter - Uses Reusable PriceRangeFilter

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { PriceRangeFilter } from '@/components/ui/filters/PriceRangeFilter'
import type { PriceRange } from '@/components/ui/filters/PriceRangeFilter'

interface AmountRangeFilterProps {
  value?: PriceRange
  onChange: (range: PriceRange) => void
  className?: string
  disabled?: boolean
}

export const AmountRangeFilter = React.forwardRef<
  HTMLDivElement,
  AmountRangeFilterProps
>(({ value, onChange, className, disabled = false }, ref) => {
  const { t } = useTranslation()

  return (
    <PriceRangeFilter
      ref={ref}
      value={value}
      onChange={onChange}
      currency="₹"
      minPlaceholder={t('sales.filters.minAmount')}
      maxPlaceholder={t('sales.filters.maxAmount')}
      className={className}
      disabled={disabled}
    />
  )
})

AmountRangeFilter.displayName = 'AmountRangeFilter'
