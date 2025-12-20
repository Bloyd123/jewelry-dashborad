// ============================================================================
// FILE: src/features/customer/components/CustomerFilters/StatusFilter.tsx
// Active/Inactive Status Filter
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
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  setActiveFilter,
  selectCustomerFilters,
} from '@/store/slices/customerSlice'
import { Badge } from '@/components/ui/data-display/Badge'

export const StatusFilter: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const filters = useAppSelector(selectCustomerFilters)

  const handleChange = (value: string) => {
    if (value === 'all') {
      dispatch(setActiveFilter(undefined))
    } else {
      dispatch(setActiveFilter(value === 'active'))
    }
  }

  const currentValue =
    filters.isActive === undefined
      ? 'all'
      : filters.isActive
        ? 'active'
        : 'inactive'

  return (
    <Select value={currentValue} onValueChange={handleChange}>
      <SelectTrigger className="w-full md:w-[160px]">
        <SelectValue placeholder={t('filters.status')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t('all')}</SelectItem>
        <SelectItem value="active">
          <div className="flex items-center gap-2">
            <Badge variant="active" dot size="sm">
              {t('status.active')}
            </Badge>
          </div>
        </SelectItem>
        <SelectItem value="inactive">
          <div className="flex items-center gap-2">
            <Badge variant="inactive" dot size="sm">
              {t('status.inactive')}
            </Badge>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
