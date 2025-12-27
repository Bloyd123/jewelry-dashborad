// ============================================================================
// FILE: src/components/products/ProductFilters/ProductGenderFilter.tsx
// Product Gender Filter
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  TypeFilter,
  type FilterOption,
} from '@/components/ui/filters/TypeFilter'
import { User, Users } from 'lucide-react'

interface ProductGenderFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  className?: string
  disabled?: boolean
}

export const ProductGenderFilter = React.forwardRef<
  HTMLButtonElement,
  ProductGenderFilterProps
>(({ value, onChange, className, disabled = false }, ref) => {
  const { t } = useTranslation()

  const genderOptions: FilterOption[] = [
    {
      value: 'male',
      label: t('product.gender.male'),
      icon: <User className="h-4 w-4 text-accent" />,
    },
    {
      value: 'female',
      label: t('product.gender.female'),
      icon: <User className="h-4 w-4 text-status-error" />,
    },
    {
      value: 'unisex',
      label: t('product.gender.unisex'),
      icon: <Users className="h-4 w-4 text-text-secondary" />,
    },
    {
      value: 'kids',
      label: t('product.gender.kids'),
      icon: <User className="h-4 w-4 text-status-info" />,
    },
  ]

  return (
    <TypeFilter
      ref={ref}
      options={genderOptions}
      value={value}
      onChange={onChange}
      placeholder={t('product.filters.gender')}
      className={className}
      disabled={disabled}
    />
  )
})

ProductGenderFilter.displayName = 'ProductGenderFilter'
