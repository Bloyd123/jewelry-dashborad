// FILE: src/components/purchase/PurchaseFilters/PurchaseDateRangeFilter.tsx
// Date Range Filter

import * as React from 'react'
import { DateRangeFilter } from '@/components/ui/filters/DateRangeFilter'
import type { DateRange } from 'react-day-picker'

interface PurchaseDateRangeFilterProps {
  value?: DateRange
  onChange: (range: DateRange | undefined) => void
  className?: string
  disabled?: boolean
}

export const PurchaseDateRangeFilter = React.forwardRef<
  HTMLButtonElement,
  PurchaseDateRangeFilterProps
>(({ value, onChange, className, disabled = false }, ref) => {
  return (
    <DateRangeFilter
      ref={ref}
      value={value}
      onChange={onChange}
      className={className}
      disabled={disabled}
    />
  )
})

PurchaseDateRangeFilter.displayName = 'PurchaseDateRangeFilter'
