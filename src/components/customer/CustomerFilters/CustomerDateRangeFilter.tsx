// FILE: src/components/customer/CustomerFilters/CustomerDateRangeFilter.tsx

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { DateRangeFilter } from '@/components/ui/filters/DateRangeFilter'
import type { DateRange } from 'react-day-picker'

// TYPES

interface CustomerDateRangeFilterProps {
  value?: DateRange
  onChange: (range: DateRange | undefined) => void
  className?: string
  disabled?: boolean
}

export const CustomerDateRangeFilter = React.forwardRef<
  HTMLButtonElement,
  CustomerDateRangeFilterProps
>(({ value, onChange, className, disabled = false }, ref) => {
  const { t } = useTranslation()

  return (
    <DateRangeFilter
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={t('filters.selectDateRange')}
      className={className}
      disabled={disabled}
    />
  )
})

CustomerDateRangeFilter.displayName = 'CustomerDateRangeFilter'
