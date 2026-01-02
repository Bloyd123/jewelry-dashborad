// 
// FILE: src/components/supplier/SupplierFilters/SupplierTypeFilter.tsx
// Supplier Type Filter - Uses Reusable TypeFilter
// 

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { TypeFilter } from '@/components/ui/filters/TypeFilter'
import type { FilterOption } from '@/components/ui/filters/TypeFilter'
import {
  Factory,
  Package,
  Truck,
  Hammer,
  Plane,
  MoreHorizontal,
} from 'lucide-react'

interface SupplierTypeFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  showAllOption?: boolean
  className?: string
  disabled?: boolean
}

export const SupplierTypeFilter = React.forwardRef<
  HTMLButtonElement,
  SupplierTypeFilterProps
>(
  (
    { value, onChange, showAllOption = true, className, disabled = false },
    ref
  ) => {
    const { t } = useTranslation()

    const supplierTypeOptions: FilterOption[] = [
      {
        value: 'manufacturer',
        label: t('suppliers.type.manufacturer'),
        icon: <Factory className="h-4 w-4 text-status-info" />,
      },
      {
        value: 'wholesaler',
        label: t('suppliers.type.wholesaler'),
        icon: <Package className="h-4 w-4 text-status-success" />,
      },
      {
        value: 'distributor',
        label: t('suppliers.type.distributor'),
        icon: <Truck className="h-4 w-4 text-status-warning" />,
      },
      {
        value: 'artisan',
        label: t('suppliers.type.artisan'),
        icon: <Hammer className="h-4 w-4 text-accent" />,
      },
      {
        value: 'importer',
        label: t('suppliers.type.importer'),
        icon: <Plane className="h-4 w-4 text-text-secondary" />,
      },
      {
        value: 'other',
        label: t('suppliers.type.other'),
        icon: <MoreHorizontal className="h-4 w-4 text-text-tertiary" />,
      },
    ]

    return (
      <TypeFilter
        ref={ref}
        options={supplierTypeOptions}
        value={value}
        onChange={onChange}
        placeholder={t('suppliers.filters.type')}
        showAllOption={showAllOption}
        allOptionLabel={t('suppliers.filters.allTypes')}
        className={className}
        disabled={disabled}
      />
    )
  }
)

SupplierTypeFilter.displayName = 'SupplierTypeFilter'
