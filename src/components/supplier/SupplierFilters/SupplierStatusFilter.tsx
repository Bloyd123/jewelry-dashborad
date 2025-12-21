// ============================================================================
// FILE: src/components/supplier/SupplierFilters/SupplierStatusFilter.tsx
// Supplier Status Filter - Uses Reusable StatusFilter
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { StatusFilter } from '@/components/ui/filters/StatusFilter'
import type { StatusOption } from '@/components/ui/filters/StatusFilter'

interface SupplierStatusFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  showAllOption?: boolean
  className?: string
}

export const SupplierStatusFilter = React.forwardRef<
  HTMLButtonElement,
  SupplierStatusFilterProps
>(({ value, onChange, showAllOption = true, className }, ref) => {
  const { t } = useTranslation()

  const statusOptions: StatusOption[] = [
    {
      value: 'active',
      label: t('status.active'),
      variant: 'active',
      showDot: true,
    },
    {
      value: 'inactive',
      label: t('status.inactive'),
      variant: 'inactive',
      showDot: true,
    },
  ]

  return (
    <StatusFilter
      ref={ref}
      value={value}
      onChange={onChange}
      options={statusOptions}
      placeholder={t('suppliers.filters.status')}
      showAllOption={showAllOption}
      className={className}
    />
  )
})

SupplierStatusFilter.displayName = 'SupplierStatusFilter'
