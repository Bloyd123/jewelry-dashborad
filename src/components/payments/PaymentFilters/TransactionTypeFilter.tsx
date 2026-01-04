// FILE: src/components/payments/PaymentFilters/TransactionTypeFilter.tsx
// Transaction Type Filter (Receipt/Payment)

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import {
  TypeFilter,
  FilterOption,
} from '@/components/ui/filters/TypeFilter/TypeFilter'

export interface TransactionTypeFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  className?: string
  disabled?: boolean
}

export const TransactionTypeFilter: React.FC<TransactionTypeFilterProps> = ({
  value,
  onChange,
  className,
  disabled = false,
}) => {
  const { t } = useTranslation()

  const transactionTypeOptions: FilterOption[] = [
    {
      value: 'receipt',
      label: t('payment.transactionTypes.receipt'),
      icon: <ArrowDownCircle className="h-4 w-4 text-status-success" />,
    },
    {
      value: 'payment',
      label: t('payment.transactionTypes.payment'),
      icon: <ArrowUpCircle className="h-4 w-4 text-status-error" />,
    },
  ]

  return (
    <TypeFilter
      options={transactionTypeOptions}
      value={value}
      onChange={onChange}
      placeholder={t('payment.filters.selectTransactionType')}
      className={className}
      disabled={disabled}
    />
  )
}

TransactionTypeFilter.displayName = 'TransactionTypeFilter'
