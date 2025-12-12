
// ============================================================================
// FILE: src/features/customer/components/CustomerFilters/DateRangeFilter.tsx
// Date Range Picker Filter
// ============================================================================

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/base/button'
import { Calendar } from '@/components/ui/base/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/base/popover'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setDateRangeFilter, selectCustomerFilters } from '@/store/slices/customerSlice'

export const DateRangeFilter: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const filters = useAppSelector(selectCustomerFilters)
  const [dateRange, setDateRange] = React.useState<{
    from?: Date
    to?: Date
  }>({
    from: filters.startDate ? new Date(filters.startDate) : undefined,
    to: filters.endDate ? new Date(filters.endDate) : undefined,
  })

  const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (!range) {
      setDateRange({})
      dispatch(setDateRangeFilter({ startDate: undefined, endDate: undefined }))
      return
    }

    setDateRange(range)

    if (range.from && range.to) {
      dispatch(
        setDateRangeFilter({
          startDate: range.from.toISOString(),
          endDate: range.to.toISOString(),
        })
      )
    }
  }

  const displayText = React.useMemo(() => {
    if (dateRange.from) {
      if (dateRange.to) {
        return `${format(dateRange.from, 'dd MMM')} - ${format(dateRange.to, 'dd MMM yyyy')}`
      }
      return format(dateRange.from, 'dd MMM yyyy')
    }
    return t('customer.filters.selectDateRange')
  }, [dateRange, t])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full md:w-[280px] justify-start text-left font-normal',
            !dateRange.from && 'text-text-tertiary'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={handleSelect}
          numberOfMonths={2}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}