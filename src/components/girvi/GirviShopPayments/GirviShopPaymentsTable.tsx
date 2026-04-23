// FILE: src/components/girvi/GirviShopPayments/GirviShopPaymentsTable.tsx

import React, { useState, useMemo } from 'react'
import { useTranslation as useTranslationTable } from 'react-i18next'
import { DataTable }         from '@/components/ui/data-display/DataTable'
import { useShopGirviPayments } from '@/hooks/girvi/useGirviPayments'
import { GirviPaymentSummaryCard } from '../GirviPayment/GirviPaymentSummaryCard'
import type { GirviPaymentType, GirviPaymentMode } from '@/types/girvi.types'
import { girviShopPaymentsColumns } from './GirviShopPaymentsColumns'

import { Input }       from '@/components/ui/input'
import { FilterBar }   from '@/components/ui/filters/FilterBar'
import { FilterChips } from '@/components/ui/filters/FilterChips'
import { TypeFilter }  from '@/components/ui/filters/TypeFilter'
import type { ActiveFilter } from '@/components/ui/filters/FilterChips'
import type { FilterOption } from '@/components/ui/filters/TypeFilter'


interface ShopPaymentFilters {
  paymentType?: string
  paymentMode?: string
  customerId?:  string
  startDate?:   string
  endDate?:     string
}


const PAYMENT_TYPE_OPTIONS: FilterOption[] = [
  { value: 'interest_only',      label: 'Interest Only'        },
  { value: 'principal_partial',  label: 'Partial Principal'    },
  { value: 'principal_full',     label: 'Full Principal'       },
  { value: 'interest_principal', label: 'Interest + Principal' },
  { value: 'release_payment',    label: 'Release Payment'      },
]

const PAYMENT_MODE_OPTIONS: FilterOption[] = [
  { value: 'cash',          label: 'Cash'          },
  { value: 'upi',           label: 'UPI'           },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cheque',        label: 'Cheque'        },
]


const ShopPaymentFilterBar = ({
  filters,
  onChange,
  onClear,
}: {
  filters:  ShopPaymentFilters
  onChange: (f: ShopPaymentFilters) => void
  onClear:  () => void
}) => {
  const { t } = useTranslationTable()

  const activeFilters: ActiveFilter[] = useMemo(() => {
    const chips: ActiveFilter[] = []
    if (filters.paymentType) chips.push({ id: 'paymentType', label: t('girviPayment.type'), value: filters.paymentType })
    if (filters.paymentMode) chips.push({ id: 'paymentMode', label: t('girviPayment.mode'), value: filters.paymentMode })
    if (filters.startDate)   chips.push({ id: 'startDate',   label: t('common.from'),        value: filters.startDate   })
    if (filters.endDate)     chips.push({ id: 'endDate',     label: t('common.to'),          value: filters.endDate     })
    return chips
  }, [filters, t])

  const handleRemoveChip = (id: string) => {
    const updated = { ...filters }
    if (id === 'paymentType') delete updated.paymentType
    if (id === 'paymentMode') delete updated.paymentMode
    if (id === 'startDate')   delete updated.startDate
    if (id === 'endDate')     delete updated.endDate
    onChange(updated)
  }

  const hasActiveFilters = activeFilters.length > 0

  return (
    <div className="space-y-3">
      <FilterBar
        hasActiveFilters={hasActiveFilters}
        onClearAll={onClear}
        showClearButton={hasActiveFilters}
      >
        <TypeFilter
          options={PAYMENT_TYPE_OPTIONS}
          value={filters.paymentType}
          onChange={val => onChange({ ...filters, paymentType: val })}
          placeholder={t('girviPayment.allTypes')}
          showAllOption
          allOptionLabel={t('girviPayment.allTypes')}
        />

        <TypeFilter
          options={PAYMENT_MODE_OPTIONS}
          value={filters.paymentMode}
          onChange={val => onChange({ ...filters, paymentMode: val })}
          placeholder={t('girviPayment.allModes')}
          showAllOption
          allOptionLabel={t('girviPayment.allModes')}
        />

        <Input
          type="date"
          value={filters.startDate || ''}
          onChange={e => onChange({ ...filters, startDate: e.target.value || undefined })}
          className="h-9 w-40"
        />

        <Input
          type="date"
          value={filters.endDate || ''}
          onChange={e => onChange({ ...filters, endDate: e.target.value || undefined })}
          className="h-9 w-40"
        />
      </FilterBar>

      {hasActiveFilters && (
        <FilterChips
          filters={activeFilters}
          onRemove={handleRemoveChip}
          onClearAll={onClear}
        />
      )}
    </div>
  )
}


interface GirviShopPaymentsTableProps {
  shopId: string
}

export const GirviShopPaymentsTable: React.FC<GirviShopPaymentsTableProps> = ({ shopId }) => {
  const { t } = useTranslationTable()
  const [filterState, setFilterState] = useState<ShopPaymentFilters>({})

  const {
    payments, summary, pagination,
    isLoading, updateFilters, resetFilters, goToPage,
  } = useShopGirviPayments(shopId, {})

  const handleFilterChange = (newFilters: ShopPaymentFilters) => {
    setFilterState(newFilters)
    updateFilters({
      paymentType: newFilters.paymentType as GirviPaymentType | undefined,
      paymentMode: newFilters.paymentMode as GirviPaymentMode | undefined,
      customerId:  newFilters.customerId,
      startDate:   newFilters.startDate,
      endDate:     newFilters.endDate,
    })
  }

  return (
    <div className="space-y-4">
      {summary && (
        <GirviPaymentSummaryCard
          summary={{
            totalInterestReceived:  summary.totalInterestReceived,
            totalPrincipalReceived: summary.totalPrincipalReceived,
            totalDiscountGiven:     summary.totalDiscountGiven,
            totalNetReceived:       summary.totalNetReceived,
            paymentCount:           summary.totalPayments,
          }}
        />
      )}

      <ShopPaymentFilterBar
        filters={filterState}
        onChange={handleFilterChange}
        onClear={() => { setFilterState({}); resetFilters() }}
      />

      <DataTable
        data={payments}
        loading={{ isLoading }}
        columns={girviShopPaymentsColumns}
        sorting={{ enabled: true }}
        pagination={{
          enabled: true,
          pageSize: 20,
          pageSizeOptions: [10, 20, 50],
          showPageSizeSelector: true,
          showPageInfo: true,
          showFirstLastButtons: true,
        }}
        emptyState={{ message: t('girviPayment.table.noPayments') }}
        style={{
          variant:      'default',
          size:         'md',
          stickyHeader: true,
          hoverEffect:  true,
          zebraStripes: false,
          showBorder:   true,
          rounded:      true,
          shadow:       true,
          fullWidth:    true,
        }}
        getRowId={(row) => row._id}
        testId="girvi-shop-payments-table"
        ariaLabel={t('girviPayment.table.ariaLabel')}
      />
    </div>
  )
}

GirviShopPaymentsTable.displayName = 'GirviShopPaymentsTable'