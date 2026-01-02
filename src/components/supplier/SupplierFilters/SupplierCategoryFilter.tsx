// 
// FILE: src/components/supplier/SupplierFilters/SupplierCategoryFilter.tsx
// Supplier Category Filter - Uses Reusable TypeFilter
// 

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { TypeFilter } from '@/components/ui/filters/TypeFilter'
import type { FilterOption } from '@/components/ui/filters/TypeFilter'
import {
  Coins,
  Gem,
  Diamond,
  Sparkles,
  Circle,
  Hammer as HammerIcon,
  Package as PackageIcon,
  Grid3x3,
} from 'lucide-react'

interface SupplierCategoryFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  showAllOption?: boolean
  className?: string
  disabled?: boolean
}

export const SupplierCategoryFilter = React.forwardRef<
  HTMLButtonElement,
  SupplierCategoryFilterProps
>(
  (
    { value, onChange, showAllOption = true, className, disabled = false },
    ref
  ) => {
    const { t } = useTranslation()

    const supplierCategoryOptions: FilterOption[] = [
      {
        value: 'gold',
        label: t('suppliers.category.gold'),
        icon: <Coins className="h-4 w-4 text-status-warning" />,
      },
      {
        value: 'silver',
        label: t('suppliers.category.silver'),
        icon: <Circle className="h-4 w-4 text-text-tertiary" />,
      },
      {
        value: 'diamond',
        label: t('suppliers.category.diamond'),
        icon: <Diamond className="h-4 w-4 text-status-info" />,
      },
      {
        value: 'platinum',
        label: t('suppliers.category.platinum'),
        icon: <Sparkles className="h-4 w-4 text-text-secondary" />,
      },
      {
        value: 'gemstone',
        label: t('suppliers.category.gemstone'),
        icon: <Gem className="h-4 w-4 text-accent" />,
      },
      {
        value: 'pearls',
        label: t('suppliers.category.pearls'),
        icon: <Circle className="h-4 w-4 text-text-primary" />,
      },
      {
        value: 'making',
        label: t('suppliers.category.making'),
        icon: <HammerIcon className="h-4 w-4 text-status-success" />,
      },
      {
        value: 'packaging',
        label: t('suppliers.category.packaging'),
        icon: <PackageIcon className="h-4 w-4 text-text-secondary" />,
      },
      {
        value: 'mixed',
        label: t('suppliers.category.mixed'),
        icon: <Grid3x3 className="h-4 w-4 text-text-tertiary" />,
      },
    ]

    return (
      <TypeFilter
        ref={ref}
        options={supplierCategoryOptions}
        value={value}
        onChange={onChange}
        placeholder={t('suppliers.filters.category')}
        showAllOption={showAllOption}
        allOptionLabel={t('suppliers.filters.allCategories')}
        className={className}
        disabled={disabled}
      />
    )
  }
)

SupplierCategoryFilter.displayName = 'SupplierCategoryFilter'
