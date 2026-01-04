// FILE: src/components/payments/PaymentFilters/PaymentModeFilter.tsx
// Payment Mode Filter Component

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Banknote,
  CreditCard,
  Smartphone,
  FileText,
  Building2,
  Wallet,
  MoreHorizontal,
} from 'lucide-react'
import {
  TypeFilter,
  FilterOption,
} from '@/components/ui/filters/TypeFilter/TypeFilter'

export interface PaymentModeFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  className?: string
  disabled?: boolean
}

export const PaymentModeFilter: React.FC<PaymentModeFilterProps> = ({
  value,
  onChange,
  className,
  disabled = false,
}) => {
  const { t } = useTranslation()

  const paymentModeOptions: FilterOption[] = [
    {
      value: 'cash',
      label: t('payment.modes.cash'),
      icon: <Banknote className="h-4 w-4" />,
    },
    {
      value: 'card',
      label: t('payment.modes.card'),
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      value: 'upi',
      label: t('payment.modes.upi'),
      icon: <Smartphone className="h-4 w-4" />,
    },
    {
      value: 'cheque',
      label: t('payment.modes.cheque'),
      icon: <FileText className="h-4 w-4" />,
    },
    {
      value: 'bank_transfer',
      label: t('payment.modes.bankTransfer'),
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      value: 'wallet',
      label: t('payment.modes.wallet'),
      icon: <Wallet className="h-4 w-4" />,
    },
    {
      value: 'other',
      label: t('payment.modes.other'),
      icon: <MoreHorizontal className="h-4 w-4" />,
    },
  ]

  return (
    <TypeFilter
      options={paymentModeOptions}
      value={value}
      onChange={onChange}
      placeholder={t('payment.filters.selectPaymentMode')}
      className={className}
      disabled={disabled}
    />
  )
}

PaymentModeFilter.displayName = 'PaymentModeFilter'
