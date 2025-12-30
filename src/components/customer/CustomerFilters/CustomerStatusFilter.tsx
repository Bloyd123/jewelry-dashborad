// ============================================================================
// FILE: src/components/customer/CustomerFilters/CustomerStatusFilter.tsx
// Customer Status Filter - Uses Reusable StatusFilter
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { StatusFilter } from '@/components/ui/filters/StatusFilter'
import type { StatusOption } from '@/components/ui/filters/StatusFilter'

// ============================================================================
// TYPES
// ============================================================================

interface CustomerStatusFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  showAllOption?: boolean
  className?: string
}

// ============================================================================
// CUSTOMER STATUS FILTER COMPONENT
// ============================================================================

export const CustomerStatusFilter = React.forwardRef<
  HTMLButtonElement,
  CustomerStatusFilterProps
>(({ value, onChange, showAllOption = true, className }, ref) => {
  const { t } = useTranslation()

  const statusOptions: StatusOption[] = [
    {
      value: 'active',
      label: t('customer.status.active'),
      variant: 'active',
      showDot: true,
    },
    {
      value: 'inactive',
      label: t('customer.status.inactive'),
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
      placeholder={t('filters.status')}
      showAllOption={showAllOption}
      className={className}
    />
  )
})

CustomerStatusFilter.displayName = 'CustomerStatusFilter'
