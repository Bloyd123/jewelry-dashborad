// ============================================================================
// FILE: src/components/purchase/PurchaseFilters/PurchaseActiveFilters.tsx
// Active Purchase Filters Display
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  FilterChips,
  type ActiveFilter,
} from '@/components/ui/filters/FilterChips'
import type { PurchaseFilterValues } from './types'
import { format } from 'date-fns'

interface PurchaseActiveFiltersProps {
  filters: PurchaseFilterValues
  onRemoveFilter: (filterId: string) => void
  onClearAll: () => void
  suppliers?: Array<{ _id: string; businessName: string }>
  className?: string
}

export const PurchaseActiveFilters: React.FC<PurchaseActiveFiltersProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
  suppliers = [],
  className,
}) => {
  const { t } = useTranslation()

  const activeFilters: ActiveFilter[] = React.useMemo(() => {
    const active: ActiveFilter[] = []

    if (filters.supplierId) {
      const supplier = suppliers.find(s => s._id === filters.supplierId)
      active.push({
        id: 'supplierId',
        label: t('purchase.filters.supplier'),
        value: supplier?.businessName || filters.supplierId,
      })
    }

    if (filters.status) {
      active.push({
        id: 'status',
        label: t('purchase.filters.status'),
        value: t(`purchase.status.${filters.status}`),
      })
    }

    if (filters.paymentStatus) {
      active.push({
        id: 'paymentStatus',
        label: t('purchase.filters.paymentStatus'),
        value: t(`purchase.paymentStatus.${filters.paymentStatus}`),
      })
    }

    if (filters.purchaseType) {
      active.push({
        id: 'purchaseType',
        label: t('purchase.filters.purchaseType'),
        value: t(`purchase.type.${filters.purchaseType}`),
      })
    }

    if (filters.approvalStatus) {
      active.push({
        id: 'approvalStatus',
        label: t('purchase.filters.approvalStatus'),
        value: t(`purchase.approvalStatus.${filters.approvalStatus}`),
      })
    }

    if (filters.dateRange?.from) {
      const dateText = filters.dateRange.to
        ? `${format(filters.dateRange.from, 'dd MMM')} - ${format(filters.dateRange.to, 'dd MMM yyyy')}`
        : format(filters.dateRange.from, 'dd MMM yyyy')
      active.push({
        id: 'dateRange',
        label: t('purchase.filters.dateRange'),
        value: dateText,
      })
    }

    return active
  }, [filters, suppliers, t])

  return (
    <FilterChips
      filters={activeFilters}
      onRemove={onRemoveFilter}
      onClearAll={onClearAll}
      className={className}
    />
  )
}
