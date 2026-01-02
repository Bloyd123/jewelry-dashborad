
// FILE: src/components/forms/FormDatePicker/FormDatePicker.tsx
// Theme-based Form DatePicker Component

import { useTranslation } from 'react-i18next'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
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
  const dateValue = value ? new Date(value) : undefined

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor={name} className="text-text-primary">
          {label}
          {required && <span className="ml-1 text-status-error">*</span>}
        </Label>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={name}
            variant="outline"
            disabled={disabled}
            onBlur={() => onBlur?.(name)}
            className={`w-full justify-start border-border-primary bg-bg-secondary text-left font-normal text-text-primary hover:bg-bg-tertiary focus:border-accent disabled:bg-bg-tertiary disabled:text-text-tertiary ${!value && 'text-text-tertiary'} ${error ? 'border-status-error' : ''} `}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value
              ? format(dateValue!, 'dd/MM/yyyy')
              : placeholder || t('forms.selectDate')}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto border-border-primary bg-bg-secondary p-0"
          align="start"
        >
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={date => {
              if (date) {
                onChange(name, date.toISOString())
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
