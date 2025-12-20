// ============================================================================
// FILE: src/components/ui/filters/StatusFilter/StatusFilter.tsx
// Generic Status Filter with Active/Inactive
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/data-display/Badge'
import { cn } from '@/lib/utils'

export interface StatusOption {
  value: string
  label: string
  variant?: 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled'
  showDot?: boolean
}

export interface StatusFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  options?: StatusOption[]
  placeholder?: string
  showAllOption?: boolean
  className?: string
}

export const StatusFilter = React.forwardRef<
  HTMLButtonElement,
  StatusFilterProps
>(
  (
    { value, onChange, options, placeholder, showAllOption = true, className },
    ref
  ) => {
    const { t } = useTranslation()

    const defaultOptions: StatusOption[] = [
      {
        value: 'active',
        label: t('status.active'),
        variant: 'active',
        showDot: true,
      },
      {
        value: 'inactive',
        label: t('status.inactive'),
        variant: 'inactive',
        showDot: true,
      },
    ]

    const statusOptions = options || defaultOptions

    const handleChange = (newValue: string) => {
      if (newValue === 'all') {
        onChange(undefined)
      } else {
        onChange(newValue)
      }
    }

    return (
      <Select value={value || 'all'} onValueChange={handleChange}>
        <SelectTrigger
          ref={ref}
          className={cn('w-full md:w-[160px]', className)}
        >
          <SelectValue placeholder={placeholder || t('filters.status')} />
        </SelectTrigger>
        <SelectContent>
          {showAllOption && (
            <SelectItem value="all">{t('common.all')}</SelectItem>
          )}
          {statusOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <Badge variant={option.variant} dot={option.showDot} size="sm">
                  {option.label}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }
)

StatusFilter.displayName = 'StatusFilter'
