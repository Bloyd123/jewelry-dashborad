
// FILE: src/components/products/ProductFilters/ProductActiveFilters.tsx
// Active Product Filters Display

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  FilterChips,
  type ActiveFilter,
} from '@/components/ui/filters/FilterChips'
import type { ProductFilterValues } from './types.ts'

interface ProductActiveFiltersProps {
  filters: ProductFilterValues
  onRemoveFilter: (filterId: string) => void
  onClearAll: () => void
  className?: string
}

export const ProductActiveFilters: React.FC<ProductActiveFiltersProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
  className,
}) => {
  const { t } = useTranslation()

  const activeFilters: ActiveFilter[] = React.useMemo(() => {
    const active: ActiveFilter[] = []

    if (filters.category) {
      active.push({
        id: 'category',
        label: t('product.filters.category'),
        value: filters.category,
      })
    }

    if (filters.metalType) {
      active.push({
        id: 'metalType',
        label: t('product.filters.metalType'),
        value: t(`product.metal.${filters.metalType}`),
      })
    }

    if (filters.purity) {
      active.push({
        id: 'purity',
        label: t('product.filters.purity'),
        value: filters.purity,
      })
    }

    if (filters.status) {
      active.push({
        id: 'status',
        label: t('product.filters.status'),
        value: t(`product.status.${filters.status}`),
      })
    }

    if (filters.saleStatus) {
      active.push({
        id: 'saleStatus',
        label: t('product.filters.saleStatus'),
        value: t(`product.saleStatus.${filters.saleStatus}`),
      })
    }

    if (filters.gender) {
      active.push({
        id: 'gender',
        label: t('product.filters.gender'),
        value: t(`product.gender.${filters.gender}`),
      })
    }

    if (filters.productType) {
      active.push({
        id: 'productType',
        label: t('product.filters.productType'),
        value: t(`product.type.${filters.productType}`),
      })
    }

    if (filters.minPrice || filters.maxPrice) {
      const priceText = `₹${filters.minPrice || 0} - ₹${filters.maxPrice || '∞'}`
      active.push({
        id: 'price',
        label: t('product.filters.price'),
        value: priceText,
      })
    }

    return active
  }, [filters, t])

  return (
    <FilterChips
      filters={activeFilters}
      onRemove={onRemoveFilter}
      onClearAll={onClearAll}
      className={className}
    />
  )
}
