// ============================================================================
// FILE: src/features/customer/components/CustomerFilters/CustomerSearchBar.tsx
// Customer-Specific SearchBar Wrapper
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { SearchBar } from '@/components/ui/form/SearchBar'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setSearchFilter, selectCustomerSearch } from '@/store/slices/customerSlice'

export const CustomerSearchBar: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const searchValue = useAppSelector(selectCustomerSearch)

  const handleSearch = (value: string) => {
    dispatch(setSearchFilter(value))
  }

  const handleClear = () => {
    dispatch(setSearchFilter(''))
  }

  return (
    <SearchBar
      value={searchValue}
      onChange={handleSearch}
      onClear={handleClear}
      placeholder={t('customer.filters.searchPlaceholder')}
      className="w-full md:w-80"
    />
  )
}