
// ============================================================================
// FILE: src/components/supplier/SupplierFilters/SupplierSearchBar.tsx
// Supplier Search Wrapper - Uses Reusable SearchBar
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { SearchBar } from '@/components/ui/SearchBar'

export interface SupplierSearchBarProps {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  className?: string
  disabled?: boolean
  autoFocus?: boolean
}

export const SupplierSearchBar = React.forwardRef<
  HTMLInputElement,
  SupplierSearchBarProps
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
        placeholder={t('suppliers.search.placeholder')}
        debounceMs={300}
        disabled={disabled}
        autoFocus={autoFocus}
        className={className}
      />
    )
  }
)

SupplierSearchBar.displayName = 'SupplierSearchBar'