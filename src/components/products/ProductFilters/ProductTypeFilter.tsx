


// ============================================================================
// FILE: src/components/product/ProductFilters/ProductTypeFilter.tsx
// Product Type Filter
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { TypeFilter, type FilterOption } from '@/components/ui/filters/TypeFilter'
import { Package, Wrench, ShoppingCart } from 'lucide-react'

interface ProductTypeFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  className?: string
  disabled?: boolean
}

export const ProductTypeFilter = React.forwardRef<
  HTMLButtonElement,
  ProductTypeFilterProps
>(({ value, onChange, className, disabled = false }, ref) => {
  const { t } = useTranslation()

  const typeOptions: FilterOption[] = [
    {
      value: 'ready_made',
      label: t('product.type.readyMade'),
      icon: <Package className="h-4 w-4 text-status-success" />,
    },
    {
      value: 'custom_made',
      label: t('product.type.customMade'),
      icon: <Wrench className="h-4 w-4 text-accent" />,
    },
    {
      value: 'on_order',
      label: t('product.type.onOrder'),
      icon: <ShoppingCart className="h-4 w-4 text-status-info" />,
    },
    {
      value: 'repair',
      label: t('product.type.repair'),
      icon: <Wrench className="h-4 w-4 text-status-warning" />,
    },
    {
      value: 'exchange',
      label: t('product.type.exchange'),
      icon: <Package className="h-4 w-4 text-text-secondary" />,
    },
  ]

  return (
    <TypeFilter
      ref={ref}
      options={typeOptions}
      value={value}
      onChange={onChange}
      placeholder={t('product.filters.productType')}
      className={className}
      disabled={disabled}
    />
  )
})

ProductTypeFilter.displayName = 'ProductTypeFilter'
