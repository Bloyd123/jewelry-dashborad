// ============================================================================
// FILE: src/components/supplier/SupplierFilters/SupplierPreferredFilter.tsx
// Supplier Preferred Filter - Uses Reusable StatusFilter
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { StatusFilter } from '@/components/ui/filters/StatusFilter'
import type { StatusOption } from '@/components/ui/filters/StatusFilter'

interface SupplierPreferredFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  showAllOption?: boolean
  className?: string
}

export const SupplierPreferredFilter = React.forwardRef<
  HTMLButtonElement,
  SupplierPreferredFilterProps
>(({ value, onChange, showAllOption = true, className }, ref) => {
  const { t } = useTranslation()

  const preferredOptions: StatusOption[] = [
    {
      value: 'preferred',
      label: t('suppliers.filters.preferredOnly'),
      variant: 'active',
      showDot: true,
    },
    {
      value: 'not_preferred',
      label: t('suppliers.filters.notPreferred'),
      variant: 'inactive',
      showDot: true,
    },
  ]

  return (
    <StatusFilter
      ref={ref}
      value={value}
      onChange={onChange}
      options={preferredOptions}
      placeholder={t('suppliers.filters.preferredStatus')}
      showAllOption={showAllOption}
      className={className}
    />
  )
})

SupplierPreferredFilter.displayName = 'SupplierPreferredFilter'
