// FILE: src/components/ui/filters/DateRangeFilter/DateRangeFilter.tsx
// Date Range Picker Filter

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { DateRange } from 'react-day-picker'

// export interface DateRange {
//   from?: Date
//   to?: Date
// }

export interface DateRangeFilterProps {
  value?: DateRange
  onChange: (range: DateRange | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export const DateRangeFilter = React.forwardRef<
  HTMLButtonElement,
  DateRangeFilterProps
>(({ value, onChange, placeholder, className, disabled = false }, ref) => {
  const { t } = useTranslation()

  const displayText = React.useMemo(() => {
    if (value?.from) {
      if (value.to) {
        return `${format(value.from, 'dd MMM')} - ${format(value.to, 'dd MMM yyyy')}`
      }
      return format(value.from, 'dd MMM yyyy')
    }
    return placeholder || t('filters.selectDateRange')
  }, [value, placeholder, t])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal md:w-[280px]',
            !value?.from && 'text-text-tertiary',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          numberOfMonths={2}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
})

DateRangeFilter.displayName = 'DateRangeFilter'
