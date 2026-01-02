// FILE: src/components/customer/CustomerFilters/CustomerSearchBar.tsx
// Customer Search Wrapper - Uses Reusable SearchBar

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { SearchBar } from '@/components/ui/SearchBar'

// TYPES

export interface CustomerSearchBarProps {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  className?: string
  disabled?: boolean
  autoFocus?: boolean
}

// CUSTOMER SEARCH BAR COMPONENT

export const CustomerSearchBar = React.forwardRef<
  HTMLInputElement,
  CustomerSearchBarProps
>(
  (
    {
      value,
      onChange,
      onClear,
      className,
      disabled = false,
      autoFocus = false,
    },
    ref
  ) => {
    const { t } = useTranslation()

    return (
      <SearchBar
        ref={ref}
        value={value}
        onChange={onChange}
        onClear={onClear}
        placeholder={t('customer.search.placeholder')}
        debounceMs={300}
        disabled={disabled}
        autoFocus={autoFocus}
        className={className}
      />
    )
  }
)

CustomerSearchBar.displayName = 'CustomerSearchBar'
