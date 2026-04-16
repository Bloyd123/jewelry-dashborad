// FILE: src/components/girviTransfer/GirviTransferFilters/TransferTypeFilter.tsx

import * as React       from 'react'
import { useTranslation } from 'react-i18next'
import { TypeFilter, type FilterOption } from '@/components/ui/filters/TypeFilter'
import { ArrowUpRight, ArrowDownLeft, RotateCcw } from 'lucide-react'

interface TransferTypeFilterProps {
  value?:    string
  onChange:  (value: string | undefined) => void
  className?: string
}

export const TransferTypeFilter = React.forwardRef<
  HTMLButtonElement,
  TransferTypeFilterProps
>(({ value, onChange, className }, ref) => {
  const { t } = useTranslation()

  const options: FilterOption[] = [
    { value: 'outgoing', label: t('girviTransfer.type.outgoing', 'Outgoing'), icon: <ArrowUpRight   className="h-4 w-4 text-status-error"   /> },
    { value: 'incoming', label: t('girviTransfer.type.incoming', 'Incoming'), icon: <ArrowDownLeft  className="h-4 w-4 text-status-success" /> },
    { value: 'return',   label: t('girviTransfer.type.return',   'Return'),   icon: <RotateCcw      className="h-4 w-4 text-status-info"    /> },
  ]

  return (
    <TypeFilter
      ref={ref}
      options={options}
      value={value}
      onChange={onChange}
      placeholder={t('girviTransfer.filters.transferType', 'Transfer Type')}
      className={className}
    />
  )
})
TransferTypeFilter.displayName = 'TransferTypeFilter'