import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface YearRange {
  min?: number
  max?: number
}

export interface YearRangeFilterProps {
  value?: YearRange
  onChange: (range: YearRange) => void
  minPlaceholder?: string
  maxPlaceholder?: string
  className?: string
  disabled?: boolean
}

export const YearRangeFilter = React.forwardRef<
  HTMLDivElement,
  YearRangeFilterProps
>(
  (
    {
      value = {},
      onChange,
      minPlaceholder,
      maxPlaceholder,
      className,
      disabled = false,
    },
    ref
  ) => {
    const { t } = useTranslation()
    const currentYear = new Date().getFullYear()

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const min = e.target.value ? Number(e.target.value) : undefined
      onChange({ ...value, min })
    }

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const max = e.target.value ? Number(e.target.value) : undefined
      onChange({ ...value, max })
    }

    return (
      <div ref={ref} className={cn('space-y-2', className)}>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-text-tertiary">
              {t('common.filters.minYear') || 'Minimum Year'}
            </Label>
            <Input
              type="number"
              value={value.min || ''}
              onChange={handleMinChange}
              placeholder={minPlaceholder || '1900'}
              disabled={disabled}
              min={1900}
              max={currentYear}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-text-tertiary">
              {t('common.filters.maxYear') || 'Maximum Year'}
            </Label>
            <Input
              type="number"
              value={value.max || ''}
              onChange={handleMaxChange}
              placeholder={maxPlaceholder || currentYear.toString()}
              disabled={disabled}
              min={value.min || 1900}
              max={currentYear}
            />
          </div>
        </div>
      </div>
    )
  }
)

YearRangeFilter.displayName = 'YearRangeFilter'
