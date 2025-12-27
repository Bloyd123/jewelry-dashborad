// ============================================================================
// FILE: src/components/sales/SalesFilters/StatusFilter.tsx
// Sales Status Filter - Uses Reusable StatusFilter
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { StatusFilter } from '@/components/ui/filters/StatusFilter'
import type { StatusOption } from '@/components/ui/filters/StatusFilter'

interface SalesStatusFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  showAllOption?: boolean
  className?: string
}

export const SalesStatusFilter = React.forwardRef<
  HTMLButtonElement,
  SalesStatusFilterProps
>(({ value, onChange, showAllOption = true, className }, ref) => {
  const { t } = useTranslation()

  const statusOptions: StatusOption[] = [
    {
      value: 'draft',
      label: t('sales.status.draft'),
      variant: 'inactive',
      showDot: true,
    },
    {
      value: 'pending',
      label: t('sales.status.pending'),
      variant: 'pending',
      showDot: true,
    },
    {
      value: 'confirmed',
      label: t('sales.status.confirmed'),
      variant: 'active',
      showDot: true,
    },
    {
      value: 'delivered',
      label: t('sales.status.delivered'),
      variant: 'completed',
      showDot: true,
    },
    {
      value: 'completed',
      label: t('sales.status.completed'),
      variant: 'completed',
      showDot: true,
    },
    {
      value: 'cancelled',
      label: t('sales.status.cancelled'),
      variant: 'cancelled',
      showDot: true,
    },
    {
      value: 'returned',
      label: t('sales.status.returned'),
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
      placeholder={t('sales.filters.status')}
      showAllOption={showAllOption}
      className={className}
    />
  )
})

SalesStatusFilter.displayName = 'SalesStatusFilter'
