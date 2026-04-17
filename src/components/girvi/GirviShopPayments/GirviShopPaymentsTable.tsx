// FILE: src/components/girvi/GirviShopPayments/GirviShopPaymentsTable.tsx
 
import React, { useState }   from 'react'
import { useTranslation as useTranslationTable } from 'react-i18next'
import { DataTable }         from '@/components/ui/data-display/DataTable'
import { useShopGirviPayments } from '@/hooks/girvi/useGirviPayments'
import { GirviPaymentSummaryCard } from '../GirviPayment/GirviPaymentSummaryCard'
import type { GirviPaymentType, GirviPaymentMode } from '@/types/girvi.types'
 import {girviShopPaymentsColumns } from './GirviShopPaymentsColumns'
 
interface ShopPaymentFilters {
  paymentType?: string
  paymentMode?: string
  customerId?:  string
  startDate?:   string
  endDate?:     string
}
 
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
 
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border-primary bg-bg-secondary p-3">
      <select
        value={filters.paymentType || ''}
        onChange={(e) => onChange({ ...filters, paymentType: e.target.value || undefined })}
        className="h-9 rounded-lg border border-border-primary bg-bg-primary px-3 text-sm text-text-primary focus:border-accent focus:outline-none"
      >
        <option value="">{t('girviPayment.allTypes')}</option>
        <option value="interest_only">Interest Only</option>
        <option value="principal_partial">Partial Principal</option>
        <option value="principal_full">Full Principal</option>
        <option value="interest_principal">Interest + Principal</option>
        <option value="release_payment">Release Payment</option>
      </select>
 
      <select
        value={filters.paymentMode || ''}
        onChange={(e) => onChange({ ...filters, paymentMode: e.target.value || undefined })}
        className="h-9 rounded-lg border border-border-primary bg-bg-primary px-3 text-sm text-text-primary focus:border-accent focus:outline-none"
      >
        <option value="">{t('girviPayment.allModes')}</option>
        <option value="cash">Cash</option>
        <option value="upi">UPI</option>
        <option value="bank_transfer">Bank Transfer</option>
        <option value="cheque">Cheque</option>
      </select>
 
      <input
        type="date"
        value={filters.startDate || ''}
        onChange={(e) => onChange({ ...filters, startDate: e.target.value || undefined })}
        className="h-9 rounded-lg border border-border-primary bg-bg-primary px-3 text-sm text-text-primary focus:border-accent focus:outline-none"
      />
 
      <input
        type="date"
        value={filters.endDate || ''}
        onChange={(e) => onChange({ ...filters, endDate: e.target.value || undefined })}
        className="h-9 rounded-lg border border-border-primary bg-bg-primary px-3 text-sm text-text-primary focus:border-accent focus:outline-none"
      />
 
      {(filters.paymentType || filters.paymentMode || filters.startDate || filters.endDate) && (
        <button onClick={onClear} className="text-sm text-text-tertiary hover:text-text-primary">
          {t('common.clearAll')}
        </button>
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