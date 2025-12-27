// ============================================================================
// FILE: src/components/sales/SalesFilters/SalesDateRangeFilter.tsx
// Sales Date Range Filter - Uses Reusable DateRangeFilter
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { DateRangeFilter } from '@/components/ui/filters/DateRangeFilter'
import type { DateRange } from 'react-day-picker'

interface SalesDateRangeFilterProps {
  value?: DateRange
  onChange: (range: DateRange | undefined) => void
  className?: string
  disabled?: boolean
}

export const SalesDateRangeFilter = React.forwardRef<
  HTMLButtonElement,
  SalesDateRangeFilterProps
>(({ value, onChange, className, disabled = false }, ref) => {
  const { t } = useTranslation()

  return (
    <DateRangeFilter
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={t('sales.filters.selectDateRange')}
      className={className}
      disabled={disabled}
    />
  )
})

SalesDateRangeFilter.displayName = 'SalesDateRangeFilter'
