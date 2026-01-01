// ============================================================================
// FILE: src/components/modules/payment/filters/PaymentAmountFilter.tsx
// Payment Amount Range Filter
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { PriceRangeFilter, PriceRange } from '@/components/ui/filters/PriceRangeFilter/PriceRangeFilter'

export interface PaymentAmountFilterProps {
  value?: PriceRange
  onChange: (range: PriceRange) => void
  className?: string
  disabled?: boolean
}

export const PaymentAmountFilter: React.FC<PaymentAmountFilterProps> = ({
  value,
  onChange,
  className,
  disabled = false,
}) => {
  const { t } = useTranslation()

  return (
    <PriceRangeFilter
      value={value}
      onChange={onChange}
      currency="₹"
      minPlaceholder={t('payment.filters.minAmount')}
      maxPlaceholder={t('payment.filters.maxAmount')}
      className={className}
      disabled={disabled}
    />
  )
}

PaymentAmountFilter.displayName = 'PaymentAmountFilter'