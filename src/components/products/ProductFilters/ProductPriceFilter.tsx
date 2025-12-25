// ============================================================================
// FILE: src/components/product/ProductFilters/ProductPriceFilter.tsx
// Product Price Range Filter
// ============================================================================

import * as React from 'react'
import { PriceRangeFilter, type PriceRange } from '@/components/ui/filters/PriceRangeFilter'

interface ProductPriceFilterProps {
  value?: PriceRange
  onChange: (range: PriceRange) => void
  className?: string
  disabled?: boolean
}

export const ProductPriceFilter = React.forwardRef<
  HTMLDivElement,
  ProductPriceFilterProps
>(({ value, onChange, className, disabled = false }, ref) => {
  return (
    <PriceRangeFilter
      ref={ref}
      value={value}
      onChange={onChange}
      currency="₹"
      className={className}
      disabled={disabled}
    />
  )
})

ProductPriceFilter.displayName = 'ProductPriceFilter'
