
// FILE: src/components/product/ProductsFilters/ProductMetalTypeFilter.tsx
// Metal Type Filter

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  TypeFilter,
  type FilterOption,
} from '@/components/ui/filters/TypeFilter'
import { Gem } from 'lucide-react'

interface ProductMetalTypeFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  className?: string
  disabled?: boolean
}

export const ProductMetalTypeFilter = React.forwardRef<
  HTMLButtonElement,
  ProductMetalTypeFilterProps
>(({ value, onChange, className, disabled = false }, ref) => {
  const { t } = useTranslation()

  const metalTypeOptions: FilterOption[] = [
    {
      value: 'gold',
      label: t('product.metal.gold'),
      icon: <Gem className="h-4 w-4 text-status-warning" />,
    },
    {
      value: 'silver',
      label: t('product.metal.silver'),
      icon: <Gem className="h-4 w-4 text-text-tertiary" />,
    },
    {
      value: 'platinum',
      label: t('product.metal.platinum'),
      icon: <Gem className="h-4 w-4 text-text-secondary" />,
    },
    {
      value: 'diamond',
      label: t('product.metal.diamond'),
      icon: <Gem className="h-4 w-4 text-accent" />,
    },
    {
      value: 'gemstone',
      label: t('product.metal.gemstone'),
      icon: <Gem className="h-4 w-4 text-status-info" />,
    },
    {
      value: 'mixed',
      label: t('product.metal.mixed'),
      icon: <Gem className="h-4 w-4 text-text-primary" />,
    },
  ]

  return (
    <TypeFilter
      ref={ref}
      options={metalTypeOptions}
      value={value}
      onChange={onChange}
      placeholder={t('product.filters.metalType')}
      className={className}
      disabled={disabled}
    />
  )
})

ProductMetalTypeFilter.displayName = 'ProductMetalTypeFilter'
