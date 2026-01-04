// FILE: src/components/products/ProductFilters/ProductPurityFilter.tsx
// Metal Purity Filter

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  TypeFilter,
  type FilterOption,
} from '@/components/ui/filters/TypeFilter'

interface ProductPurityFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  metalType?: string
  className?: string
  disabled?: boolean
}

export const ProductPurityFilter = React.forwardRef<
  HTMLButtonElement,
  ProductPurityFilterProps
>(({ value, onChange, metalType, className, disabled = false }, ref) => {
  const { t } = useTranslation()

  // Dynamic purity options based on metal type
  const getPurityOptions = (): FilterOption[] => {
    if (metalType === 'gold') {
      return [
        { value: '24K', label: '24K' },
        { value: '22K', label: '22K' },
        { value: '18K', label: '18K' },
        { value: '14K', label: '14K' },
        { value: '916', label: '916' },
      ]
    }
    if (metalType === 'silver') {
      return [
        { value: '999', label: '999' },
        { value: '925', label: '925 (Sterling)' },
        { value: '850', label: '850' },
      ]
    }
    if (metalType === 'platinum') {
      return [
        { value: '950', label: '950' },
        { value: '900', label: '900' },
      ]
    }
    // Default all purities
    return [
      { value: '24K', label: '24K' },
      { value: '22K', label: '22K' },
      { value: '18K', label: '18K' },
      { value: '916', label: '916' },
      { value: '999', label: '999' },
      { value: '925', label: '925' },
    ]
  }

  return (
    <TypeFilter
      ref={ref}
      options={getPurityOptions()}
      value={value}
      onChange={onChange}
      placeholder={t('product.filters.purity')}
      className={className}
      disabled={disabled || !metalType}
    />
  )
})

ProductPurityFilter.displayName = 'ProductPurityFilter'
