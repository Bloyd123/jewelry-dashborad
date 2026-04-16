// FILE: src/components/girviTransfer/GirviTransferFilters/TransferActiveFilters.tsx

import * as React       from 'react'
import { useTranslation } from 'react-i18next'
import { FilterChips, type ActiveFilter } from '@/components/ui/filters/FilterChips'
import { format }         from 'date-fns'
import type { GirviTransferFilterValues } from './types'

interface TransferActiveFiltersProps {
  filters:        GirviTransferFilterValues
  onRemoveFilter: (filterId: string) => void
  onClearAll:     () => void
  className?:     string
}

export const TransferActiveFilters: React.FC<TransferActiveFiltersProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
  className,
}) => {
  const { t } = useTranslation()

  const activeFilters: ActiveFilter[] = React.useMemo(() => {
    const active: ActiveFilter[] = []

    if (filters.status) {
      active.push({
        id:    'status',
        label: t('girviTransfer.filters.status', 'Status'),
        value: t(`girviTransfer.status.${filters.status}`, filters.status),
      })
    }

    if (filters.transferType) {
      active.push({
        id:    'transferType',
        label: t('girviTransfer.filters.transferType', 'Type'),
        value: t(`girviTransfer.type.${filters.transferType}`, filters.transferType),
      })
    }

    if (filters.dateRange?.from) {
      const dateText = filters.dateRange.to
        ? `${format(filters.dateRange.from, 'dd MMM')} - ${format(filters.dateRange.to, 'dd MMM yyyy')}`
        : format(filters.dateRange.from, 'dd MMM yyyy')
      active.push({
        id:    'dateRange',
        label: t('girviTransfer.filters.dateRange', 'Date Range'),
        value: dateText,
      })
    }

    return active
  }, [filters, t])

  return (
    <FilterChips
      filters={activeFilters}
      onRemove={onRemoveFilter}
      onClearAll={onClearAll}
      className={className}
    />
  )
}