// ============================================================================
// FILE: src/components/sales/SalesFilters/PaymentModeFilter.tsx
// Payment Mode Filter - Uses Reusable TypeFilter
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { TypeFilter } from '@/components/ui/filters/TypeFilter'
import type { FilterOption } from '@/components/ui/filters/TypeFilter'
import {
  Banknote,
  CreditCard,
  Smartphone,
  FileText,
  Building2,
  Wallet,
  Clock,
} from 'lucide-react'

interface PaymentModeFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  showAllOption?: boolean
  className?: string
  disabled?: boolean
}

export const PaymentModeFilter = React.forwardRef<
  HTMLButtonElement,
  PaymentModeFilterProps
>(
  (
    { value, onChange, showAllOption = true, className, disabled = false },
    ref
  ) => {
    const { t } = useTranslation()

    const paymentModeOptions: FilterOption[] = [
      {
        value: 'cash',
        label: t('sales.paymentMode.cash'),
        icon: <Banknote className="h-4 w-4 text-status-success" />,
      },
      {
        value: 'card',
        label: t('sales.paymentMode.card'),
        icon: <CreditCard className="h-4 w-4 text-status-info" />,
      },
      {
        value: 'upi',
        label: t('sales.paymentMode.upi'),
        icon: <Smartphone className="h-4 w-4 text-accent" />,
      },
      {
        value: 'cheque',
        label: t('sales.paymentMode.cheque'),
        icon: <FileText className="h-4 w-4 text-text-secondary" />,
      },
      {
        value: 'bank_transfer',
        label: t('sales.paymentMode.bankTransfer'),
        icon: <Building2 className="h-4 w-4 text-status-warning" />,
      },
      {
        value: 'mixed',
        label: t('sales.paymentMode.mixed'),
        icon: <Wallet className="h-4 w-4 text-text-tertiary" />,
      },
      {
        value: 'credit',
        label: t('sales.paymentMode.credit'),
        icon: <Clock className="h-4 w-4 text-status-error" />,
      },
    ]

    return (
      <TypeFilter
        ref={ref}
        options={paymentModeOptions}
        value={value}
        onChange={onChange}
        placeholder={t('sales.filters.paymentMode')}
        showAllOption={showAllOption}
        allOptionLabel={t('sales.filters.allModes')}
        className={className}
        disabled={disabled}
      />
    )
  }
)

PaymentModeFilter.displayName = 'PaymentModeFilter'
