// ============================================================================
// FILE: src/components/modules/payment/filters/PaymentStatusFilter.tsx
// Payment Status Filter Component
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  StatusFilter,
  StatusOption,
} from '@/components/ui/filters/StatusFilter/StatusFilter'

export interface PaymentStatusFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  className?: string
  disabled?: boolean
}

export const PaymentStatusFilter: React.FC<PaymentStatusFilterProps> = ({
  value,
  onChange,
  className,
  disabled = false,
}) => {
  const { t } = useTranslation()

  const statusOptions: StatusOption[] = [
    {
      value: 'pending',
      label: t('payment.status.pending'),
      variant: 'pending',
      showDot: true,
    },
    {
      value: 'completed',
      label: t('payment.status.completed'),
      variant: 'completed',
      showDot: true,
    },
    {
      value: 'failed',
      label: t('payment.status.failed'),
      variant: 'cancelled',
      showDot: true,
    },
    {
      value: 'cancelled',
      label: t('payment.status.cancelled'),
      variant: 'inactive',
      showDot: true,
    },
    {
      value: 'refunded',
      label: t('payment.status.refunded'),
      variant: 'inactive',
      showDot: true,
    },
  ]

  return (
    <StatusFilter
      value={value}
      onChange={onChange}
      options={statusOptions}
      placeholder={t('payment.filters.selectStatus')}
      className={className}
    />
  )
}

PaymentStatusFilter.displayName = 'PaymentStatusFilter'
