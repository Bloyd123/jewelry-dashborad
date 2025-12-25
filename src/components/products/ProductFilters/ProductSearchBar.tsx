// ============================================================================
// FILE: src/components/product/ProductFilters/ProductSearchBar.tsx
// Product Search Bar Component
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { SearchBar } from '@/components/ui/SearchBar'

interface ProductSearchBarProps {
  value: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
}

export const ProductSearchBar = React.forwardRef<
  HTMLInputElement,
  ProductSearchBarProps
>(({ value, onChange, className, disabled = false }, ref) => {
  const { t } = useTranslation()

  return (
    <SearchBar
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={t('product.filters.searchPlaceholder')}
      className={className}
      disabled={disabled}
      debounceMs={300}
    />
  )
})

ProductSearchBar.displayName = 'ProductSearchBar'