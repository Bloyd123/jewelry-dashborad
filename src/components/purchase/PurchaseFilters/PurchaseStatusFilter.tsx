
// FILE: src/components/purchase/PurchaseFilters/PurchaseStatusFilter.tsx
// Purchase Status Filter

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  StatusFilter,
  type StatusOption,
} from '@/components/ui/filters/StatusFilter'

interface PurchaseStatusFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  className?: string
  disabled?: boolean
}

export const PurchaseStatusFilter = React.forwardRef<
  HTMLButtonElement,
  PurchaseStatusFilterProps
>(({ value, onChange, className, disabled = false }, ref) => {
  const { t } = useTranslation()

  const statusOptions: StatusOption[] = [
    {
      value: 'draft',
      label: t('purchase.status.draft'),
      variant: 'inactive',
      showDot: true,
    },
    {
      value: 'pending',
      label: t('purchase.status.pending'),
      variant: 'pending',
      showDot: true,
    },
    {
      value: 'ordered',
      label: t('purchase.status.ordered'),
      variant: 'pending',
      showDot: true,
    },
    {
      value: 'received',
      label: t('purchase.status.received'),
      variant: 'active',
      showDot: true,
    },
    {
      value: 'partial_received',
      label: t('purchase.status.partialReceived'),
      variant: 'pending',
      showDot: true,
    },
    {
      value: 'completed',
      label: t('purchase.status.completed'),
      variant: 'completed',
      showDot: true,
    },
    {
      value: 'cancelled',
      label: t('purchase.status.cancelled'),
      variant: 'cancelled',
      showDot: true,
    },
    {
      value: 'returned',
      label: t('purchase.status.returned'),
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
      placeholder={t('purchase.filters.status')}
      className={className}
    />
  )
})

PurchaseStatusFilter.displayName = 'PurchaseStatusFilter'
