// ============================================================================
// FILE: src/components/modules/payment/filters/ReconciliationFilter.tsx
// Reconciliation Status Filter
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { TypeFilter, FilterOption } from '@/components/ui/filters/TypeFilter/TypeFilter'

export interface ReconciliationFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  className?: string
  disabled?: boolean
}

export const ReconciliationFilter: React.FC<ReconciliationFilterProps> = ({
  value,
  onChange,
  className,
  disabled = false,
}) => {
  const { t } = useTranslation()

  const reconciliationOptions: FilterOption[] = [
    {
      value: 'true',
      label: t('payment.reconciled'),
      icon: <CheckCircle2 className="h-4 w-4 text-status-success" />,
    },
    {
      value: 'false',
      label: t('payment.unreconciled'),
      icon: <AlertCircle className="h-4 w-4 text-status-warning" />,
    },
  ]

  return (
    <TypeFilter
      options={reconciliationOptions}
      value={value}
      onChange={onChange}
      placeholder={t('payment.filters.selectReconciliation')}
      className={className}
      disabled={disabled}
    />
  )
}

ReconciliationFilter.displayName = 'ReconciliationFilter'