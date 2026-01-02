
// FILE: src/components/purchase/PurchaseFilters/PurchaseSearchBar.tsx
// Purchase Search Bar


import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { SearchBar } from '@/components/ui/SearchBar'

interface PurchaseSearchBarProps {
  value: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
}

export const PurchaseSearchBar = React.forwardRef<
  HTMLInputElement,
  PurchaseSearchBarProps
>(({ value, onChange, className, disabled = false }, ref) => {
  const { t } = useTranslation()

  return (
    <SearchBar
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={t('purchase.filters.searchPlaceholder')}
      className={className}
      disabled={disabled}
      debounceMs={300}
    />
  )
})

PurchaseSearchBar.displayName = 'PurchaseSearchBar'
