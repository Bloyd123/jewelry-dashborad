
// FILE: src/components/sales/SalesFilters/PaymentStatusFilter.tsx
// Payment Status Filter - Uses Reusable StatusFilter

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { StatusFilter } from '@/components/ui/filters/StatusFilter'
import type { StatusOption } from '@/components/ui/filters/StatusFilter'

interface PaymentStatusFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  showAllOption?: boolean
  className?: string
}

export const PaymentStatusFilter = React.forwardRef<
  HTMLButtonElement,
  PaymentStatusFilterProps
>(({ value, onChange, showAllOption = true, className }, ref) => {
  const { t } = useTranslation()

  const statusOptions: StatusOption[] = [
    {
      value: 'paid',
      label: t('sales.payment.paid'),
      variant: 'active',
      showDot: true,
    },
    {
      value: 'partial',
      label: t('sales.payment.partial'),
      variant: 'pending',
      showDot: true,
    },
    {
      value: 'unpaid',
      label: t('sales.payment.unpaid'),
      variant: 'inactive',
      showDot: true,
    },
    {
      value: 'overdue',
      label: t('sales.payment.overdue'),
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
      placeholder={t('sales.filters.paymentStatus')}
      showAllOption={showAllOption}
      className={className}
    />
  )
})

PaymentStatusFilter.displayName = 'PaymentStatusFilter'
