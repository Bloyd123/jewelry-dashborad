// FILE: src/components/purchase/PurchaseFilters/PurchasePaymentStatusFilter.tsx
// Payment Status Filter

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  StatusFilter,
  type StatusOption,
} from '@/components/ui/filters/StatusFilter'

interface PurchasePaymentStatusFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  className?: string
  disabled?: boolean
}

export const PurchasePaymentStatusFilter = React.forwardRef<
  HTMLButtonElement,
  PurchasePaymentStatusFilterProps
>(({ value, onChange, className, disabled = false }, ref) => {
  const { t } = useTranslation()

  const paymentStatusOptions: StatusOption[] = [
    {
      value: 'paid',
      label: t('purchase.paymentStatus.paid'),
      variant: 'completed',
      showDot: true,
    },
    {
      value: 'partial',
      label: t('purchase.paymentStatus.partial'),
      variant: 'pending',
      showDot: true,
    },
    {
      value: 'unpaid',
      label: t('purchase.paymentStatus.unpaid'),
      variant: 'inactive',
      showDot: true,
    },
    {
      value: 'overdue',
      label: t('purchase.paymentStatus.overdue'),
      variant: 'cancelled',
      showDot: true,
    },
  ]

  return (
    <StatusFilter
      ref={ref}
      value={value}
      onChange={onChange}
      options={paymentStatusOptions}
      placeholder={t('purchase.filters.paymentStatus')}
      className={className}
    />
  )
})

PurchasePaymentStatusFilter.displayName = 'PurchasePaymentStatusFilter'
