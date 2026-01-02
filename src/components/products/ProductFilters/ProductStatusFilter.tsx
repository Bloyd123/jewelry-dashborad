
// FILE: src/components/products/ProductFilters/ProductStatusFilter.tsx
// Product Stock Status Filter

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  StatusFilter,
  type StatusOption,
} from '@/components/ui/filters/StatusFilter'

interface ProductStatusFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  className?: string
  disabled?: boolean
}

export const ProductStatusFilter = React.forwardRef<
  HTMLButtonElement,
  ProductStatusFilterProps
>(({ value, onChange, className, disabled = false }, ref) => {
  const { t } = useTranslation()

  const statusOptions: StatusOption[] = [
    {
      value: 'in_stock',
      label: t('product.status.inStock'),
      variant: 'active',
      showDot: true,
    },
    {
      value: 'low_stock',
      label: t('product.status.lowStock'),
      variant: 'pending',
      showDot: true,
    },
    {
      value: 'out_of_stock',
      label: t('product.status.outOfStock'),
      variant: 'inactive',
      showDot: true,
    },
    {
      value: 'on_order',
      label: t('product.status.onOrder'),
      variant: 'pending',
      showDot: true,
    },
    {
      value: 'discontinued',
      label: t('product.status.discontinued'),
      variant: 'cancelled',
      showDot: true,
    },
  ]

  return (
    <StatusFilter
      ref={ref}
      value={value}
      onChange={onChange}
      options={statusOptions}
      placeholder={t('product.filters.status')}
      className={className}
    />
  )
})

ProductStatusFilter.displayName = 'ProductStatusFilter'
