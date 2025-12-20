// ============================================================================
// FILE: src/components/ui/calendar.tsx
// Theme-based Calendar Component with Dropdown Selection
// ============================================================================

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date())

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - 50 + i
  )

  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(parseInt(monthIndex))
    setCurrentMonth(newDate)
  }

  const handleYearChange = (year: string) => {
    const newDate = new Date(currentMonth)
    newDate.setFullYear(parseInt(year))
    setCurrentMonth(newDate)
  }

  const handlePrevMonth = () => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(currentMonth.getMonth() - 1)
    setCurrentMonth(newDate)
  }

  const handleNextMonth = () => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(currentMonth.getMonth() + 1)
    setCurrentMonth(newDate)
  }

  return (
    <DayPicker
      month={currentMonth}
      onMonthChange={setCurrentMonth}
      showOutsideDays={showOutsideDays}
      className={cn('p-4', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center mb-4',
        caption_label: 'hidden',
        nav: 'hidden',
        table: 'w-full border-collapse',
        head_row: 'grid grid-cols-7 gap-1 mb-2',
        head_cell:
          'text-text-tertiary font-normal text-xs text-center w-9 h-7 flex items-center justify-center',
        row: 'grid grid-cols-7 gap-1 mt-1',
        cell: 'relative p-0 text-center',
        day: cn(
          'h-9 w-9 p-0 font-normal text-sm rounded-md transition-colors',
          'text-text-primary hover:bg-bg-tertiary',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent'
        ),
        day_range_end: 'day-range-end',
        day_selected:
          'bg-accent text-white hover:bg-accent hover:text-white focus:bg-accent focus:text-white font-medium',
        day_today: 'bg-bg-tertiary text-text-primary font-medium',
        day_outside: 'text-text-tertiary opacity-50',
        day_disabled:
          'text-text-tertiary opacity-30 cursor-not-allowed hover:bg-transparent',
        day_range_middle:
          'aria-selected:bg-accent/50 aria-selected:text-text-primary',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        CaptionLabel: () => (
          <div className="flex w-full items-center justify-between">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-transparent p-0 text-text-primary transition-colors hover:bg-bg-tertiary"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              <Select
                value={currentMonth.getMonth().toString()}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger className="h-9 w-[75px] border-border-primary bg-bg-secondary text-sm font-normal text-text-primary">
                  <SelectValue>{months[currentMonth.getMonth()]}</SelectValue>
                </SelectTrigger>
                <SelectContent className="border-border-primary bg-bg-secondary">
                  {months.map((monthName, index) => (
                    <SelectItem
                      key={monthName}
                      value={index.toString()}
                      className="text-text-primary hover:bg-bg-tertiary"
                    >
                      {monthName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={currentMonth.getFullYear().toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="h-9 w-[80px] border-border-primary bg-bg-secondary text-sm font-normal text-text-primary">
                  <SelectValue>{currentMonth.getFullYear()}</SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[200px] border-border-primary bg-bg-secondary">
                  {years.map(year => (
                    <SelectItem
                      key={year}
                      value={year.toString()}
                      className="text-text-primary hover:bg-bg-tertiary"
                    >
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-transparent p-0 text-text-primary transition-colors hover:bg-bg-tertiary"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
