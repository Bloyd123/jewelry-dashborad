
// FILE: src/components/products/ProductFilters/ProductCategoryFilter.tsx
// Product Category Filter with Subcategories

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  CategoryFilter,
  type Category,
} from '@/components/ui/filters/CategoryFilter'

interface ProductCategoryFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  className?: string
  disabled?: boolean
}

export const ProductCategoryFilter = React.forwardRef<
  HTMLButtonElement,
  ProductCategoryFilterProps
>(({ value, onChange, className, disabled = false }, ref) => {
  const { t } = useTranslation()

  // Dummy category data - Replace with actual data from API/Redux
  const categories: Category[] = [
    {
      value: 'rings',
      label: t('product.category.rings'),
      children: [
        { value: 'engagement', label: t('product.category.engagement') },
        { value: 'wedding', label: t('product.category.wedding') },
        { value: 'fashion', label: t('product.category.fashion') },
      ],
    },
    {
      value: 'necklaces',
      label: t('product.category.necklaces'),
      children: [
        { value: 'pendant', label: t('product.category.pendant') },
        { value: 'chain', label: t('product.category.chain') },
      ],
    },
    {
      value: 'earrings',
      label: t('product.category.earrings'),
      children: [
        { value: 'studs', label: t('product.category.studs') },
        { value: 'hoops', label: t('product.category.hoops') },
      ],
    },
    {
      value: 'bracelets',
      label: t('product.category.bracelets'),
    },
    {
      value: 'bangles',
      label: t('product.category.bangles'),
    },
  ]

  return (
    <CategoryFilter
      ref={ref}
      categories={categories}
      value={value}
      onChange={onChange}
      placeholder={t('product.filters.category')}
      className={className}
      disabled={disabled}
    />
  )
})

ProductCategoryFilter.displayName = 'ProductCategoryFilter'
