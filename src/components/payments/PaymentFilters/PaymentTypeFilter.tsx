// FILE: src/components/payments/paymentFilters/PaymentTypeFilter.tsx
// Payment Type Filter Component

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  ShoppingCart,
  ShoppingBag,
  Award,
  DollarSign,
  RotateCcw,
  MoreHorizontal,
} from 'lucide-react'
import {
  TypeFilter,
  FilterOption,
} from '@/components/ui/filters/TypeFilter/TypeFilter'

export interface PaymentTypeFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  className?: string
  disabled?: boolean
}

export const PaymentTypeFilter: React.FC<PaymentTypeFilterProps> = ({
  value,
  onChange,
  className,
  disabled = false,
}) => {
  const { t } = useTranslation()

  const paymentTypeOptions: FilterOption[] = [
    {
      value: 'sale_payment',
      label: t('payment.types.salePayment'),
      icon: <ShoppingCart className="h-4 w-4" />,
    },
    {
      value: 'purchase_payment',
      label: t('payment.types.purchasePayment'),
      icon: <ShoppingBag className="h-4 w-4" />,
    },
    {
      value: 'scheme_payment',
      label: t('payment.types.schemePayment'),
      icon: <Award className="h-4 w-4" />,
    },
    {
      value: 'advance_payment',
      label: t('payment.types.advancePayment'),
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      value: 'refund',
      label: t('payment.types.refund'),
      icon: <RotateCcw className="h-4 w-4" />,
    },
    {
      value: 'other',
      label: t('payment.types.other'),
      icon: <MoreHorizontal className="h-4 w-4" />,
    },
  ]

  return (
    <TypeFilter
      options={paymentTypeOptions}
      value={value}
      onChange={onChange}
      placeholder={t('payment.filters.selectPaymentType')}
      className={className}
      disabled={disabled}
    />
  )
}

PaymentTypeFilter.displayName = 'PaymentTypeFilter'
