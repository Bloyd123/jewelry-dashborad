// FILE: src/components/ui/filters/TypeFilter/TypeFilter.tsx
// Generic Dropdown Filter (Reusable for Any Type)

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export interface FilterOption {
  value: string
  label: string
  icon?: React.ReactNode
  color?: string
}

export interface TypeFilterProps {
  options: FilterOption[]
  value?: string
  onChange: (value: string | undefined) => void
  placeholder?: string
  showAllOption?: boolean
  allOptionLabel?: string
  className?: string
  disabled?: boolean
}

export const TypeFilter = React.forwardRef<HTMLButtonElement, TypeFilterProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder,
      showAllOption = true,
      allOptionLabel,
      className,
      disabled = false,
    },
    ref
  ) => {
    const { t } = useTranslation()

    const handleChange = (newValue: string) => {
      if (newValue === 'all') {
        onChange(undefined)
      } else {
        onChange(newValue)
      }
    }

    return (
      <Select
        value={value || 'all'}
        onValueChange={handleChange}
        disabled={disabled}
      >
        <SelectTrigger
          ref={ref}
          className={cn('w-full md:w-[180px]', className)}
        >
          <SelectValue placeholder={placeholder || t('filters.select')} />
        </SelectTrigger>
        <SelectContent>
          {showAllOption && (
            <SelectItem value="all">
              {allOptionLabel || t('common.all')}
            </SelectItem>
          )}
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                {option.icon}
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }
)

TypeFilter.displayName = 'TypeFilter'
