// ============================================================================
// FILE: src/features/customer/components/CustomerFilters/CustomerTypeFilter.tsx
// Customer Type Dropdown Filter
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
import { setCustomerTypeFilter, selectCustomerTypeFilter } from '@/store/slices/customerSlice'
import type { CustomerType } from '@/types'

const customerTypes: { value: CustomerType; label: string }[] = [
  { value: 'retail', label: 'customer.types.retail' },
  { value: 'wholesale', label: 'customer.types.wholesale' },
  { value: 'vip', label: 'customer.types.vip' },
  { value: 'regular', label: 'customer.types.regular' },
]

export const CustomerTypeFilter: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const selectedType = useAppSelector(selectCustomerTypeFilter)

  const handleChange = (value: string) => {
    if (value === 'all') {
      dispatch(setCustomerTypeFilter(undefined))
    } else {
      dispatch(setCustomerTypeFilter(value as CustomerType))
    }
  }

  return (
    <Select value={selectedType || 'all'} onValueChange={handleChange}>
      <SelectTrigger className="w-full md:w-[180px]">
        <SelectValue placeholder={t('customer.filters.type')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t('common.all')}</SelectItem>
        {customerTypes.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            {t(type.label)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
