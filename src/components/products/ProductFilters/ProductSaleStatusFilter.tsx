
// FILE: src/components/products/ProductFilters/ProductSaleStatusFilter.tsx
// Product Sale Status Filter

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  StatusFilter,
  type StatusOption,
} from '@/components/ui/filters/StatusFilter'

interface ProductSaleStatusFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  className?: string
  disabled?: boolean
}

export const ProductSaleStatusFilter = React.forwardRef<
  HTMLButtonElement,
  ProductSaleStatusFilterProps
>(({ value, onChange, className, disabled = false }, ref) => {
  const { t } = useTranslation()

  const saleStatusOptions: StatusOption[] = [
    {
      value: 'available',
      label: t('product.saleStatus.available'),
      variant: 'active',
      showDot: true,
    },
    {
      value: 'reserved',
      label: t('product.saleStatus.reserved'),
      variant: 'pending',
      showDot: true,
    },
    {
      value: 'sold',
      label: t('product.saleStatus.sold'),
      variant: 'completed',
      showDot: true,
    },
    {
      value: 'on_hold',
      label: t('product.saleStatus.onHold'),
      variant: 'pending',
      showDot: true,
    },
    {
      value: 'returned',
      label: t('product.saleStatus.returned'),
      variant: 'cancelled',
      showDot: true,
    },
  ]

  return (
    <StatusFilter
      ref={ref}
      value={value}
      onChange={onChange}
      options={saleStatusOptions}
      placeholder={t('product.filters.saleStatus')}
      className={className}
    />
  )
})

ProductSaleStatusFilter.displayName = 'ProductSaleStatusFilter'
