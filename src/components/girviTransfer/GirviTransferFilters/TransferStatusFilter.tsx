// FILE: src/components/girviTransfer/GirviTransferFilters/TransferStatusFilter.tsx

import * as React       from 'react'
import { useTranslation } from 'react-i18next'
import { StatusFilter, type StatusOption } from '@/components/ui/filters/StatusFilter'

interface TransferStatusFilterProps {
  value?:    string
  onChange:  (value: string | undefined) => void
  className?: string
}

export const TransferStatusFilter = React.forwardRef<
  HTMLButtonElement,
  TransferStatusFilterProps
>(({ value, onChange, className }, ref) => {
  const { t } = useTranslation()

  const options: StatusOption[] = [
    { value: 'pending',   label: t('girviTransfer.status.pending',   'Pending'),   variant: 'pending',   showDot: true },
    { value: 'completed', label: t('girviTransfer.status.completed', 'Completed'), variant: 'completed', showDot: true },
    { value: 'returned',  label: t('girviTransfer.status.returned',  'Returned'),  variant: 'active',    showDot: true },
    { value: 'cancelled', label: t('girviTransfer.status.cancelled', 'Cancelled'), variant: 'cancelled', showDot: true },
  ]

  return (
    <StatusFilter
      ref={ref}
      value={value}
      onChange={onChange}
      options={options}
      placeholder={t('girviTransfer.filters.status', 'Status')}
      className={className}
    />
  )
})
TransferStatusFilter.displayName = 'TransferStatusFilter'