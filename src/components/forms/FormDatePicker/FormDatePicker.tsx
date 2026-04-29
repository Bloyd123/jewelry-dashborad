// FILE: src/components/forms/FormDatePicker/FormDatePicker.tsx
// Theme-based Form DatePicker Component

import { useTranslation } from 'react-i18next'
import { Label } from '@/components/ui/label'
import { useState, useEffect } from 'react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'

interface FormDatePickerProps {
  name: string
  label?: string
  value: string
  onChange: (name: string, value: string) => void
  onBlur?: (name: string) => void
  error?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  minDate?: Date
  maxDate?: Date
}

export const FormDatePicker = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  minDate,
  maxDate,
}: FormDatePickerProps) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value ? format(new Date(value), 'dd/MM/yyyy') : '')
  const [month, setMonth] = useState<Date>(value ? new Date(value) : new Date())
  const dateValue = value ? new Date(value) : undefined

  useEffect(() => {
    if (value) {
      const d = new Date(value)
      setInputValue(format(d, 'dd/MM/yyyy'))
      setMonth(d)
    } else {
      setInputValue('')
    }
  }, [value])

const handleInputClick = () => {
  if (!disabled) setOpen(false) // click on input = close calendar
}

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  let raw = e.target.value.replace(/[^0-9]/g, '') // sirf numbers

  // auto slash lagao
  if (raw.length > 2 && raw.length <= 4) {
    raw = raw.slice(0, 2) + '/' + raw.slice(2)
  } else if (raw.length > 4) {
    raw = raw.slice(0, 2) + '/' + raw.slice(2, 4) + '/' + raw.slice(4, 8)
  }

  setInputValue(raw)

  // parse when complete dd/MM/yyyy
  const parts = raw.split('/')
  if (parts.length === 3) {
    const [dd, mm, yyyy] = parts
    if (dd.length === 2 && mm.length === 2 && yyyy.length === 4) {
      const parsed = new Date(`${yyyy}-${mm}-${dd}`)
      if (!isNaN(parsed.getTime())) {
        if (minDate && parsed < minDate) return
        if (maxDate && parsed > maxDate) return
        onChange(name, parsed.toISOString())
      }
    }
  }
}

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor={name} className="text-text-primary">
          {label}
          {required && <span className="ml-1 text-status-error">*</span>}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <CalendarIcon
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary cursor-pointer"
              onClick={() => !disabled && setOpen(v => !v)}
            />
            <input
              id={name}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={() => onBlur?.(name)}
              onClick={handleInputClick}
              disabled={disabled}
              placeholder="dd/mm/yyyy"
              maxLength={10}
              className={`w-full rounded-md border bg-bg-secondary pl-10 pr-4 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent disabled:bg-bg-tertiary disabled:text-text-tertiary ${error ? 'border-status-error' : 'border-border-primary'}`}
            />
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto border-border-primary bg-bg-secondary p-0"
          align="center"
        >
          <Calendar
            mode="single"
            selected={dateValue}
            month={month}
            onMonthChange={setMonth}
            onSelect={date => {
              if (date) {
                onChange(name, date.toISOString())
                setMonth(date)
                setOpen(false)
              }
            }}
            disabled={date => {
              if (minDate && date < minDate) return true
              if (maxDate && date > maxDate) return true
              return false
            }}
            initialFocus
            className="bg-bg-secondary text-text-primary"
          />
        </PopoverContent>
      </Popover>

      {error && (
        <div className="flex items-center gap-2 text-sm text-status-error">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}