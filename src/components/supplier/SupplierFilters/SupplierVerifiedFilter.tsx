//
// FILE: src/components/supplier/SupplierFilters/SupplierVerifiedFilter.tsx
// Supplier Verified Filter - Uses Reusable StatusFilter
//

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { StatusFilter } from '@/components/ui/filters/StatusFilter'
import type { StatusOption } from '@/components/ui/filters/StatusFilter'

interface SupplierVerifiedFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  showAllOption?: boolean
  className?: string
}

export const SupplierVerifiedFilter = React.forwardRef<
  HTMLButtonElement,
  SupplierVerifiedFilterProps
>(({ value, onChange, showAllOption = true, className }, ref) => {
  const { t } = useTranslation()

  const verifiedOptions: StatusOption[] = [
    {
      value: 'verified',
      label: t('suppliers.filters.verifiedOnly'),
      variant: 'active',
      showDot: true,
    },
    {
      value: 'not_verified',
      label: t('suppliers.filters.notVerified'),
      variant: 'inactive',
      showDot: true,
    },
  ]

  return (
    <StatusFilter
      ref={ref}
      value={value}
      onChange={onChange}
      options={verifiedOptions}
      placeholder={t('suppliers.filters.verifiedStatus')}
      showAllOption={showAllOption}
      className={className}
    />
  )
})

SupplierVerifiedFilter.displayName = 'SupplierVerifiedFilter'
