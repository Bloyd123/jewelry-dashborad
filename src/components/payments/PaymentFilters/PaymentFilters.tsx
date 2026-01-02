
// FILE: src/components/payments/PaymentFilters/PaymentFilters.tsx
// Main Payment Filters Component with Desktop & Mobile Views

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { FilterBar } from '@/components/ui/filters/FilterBar'
import { FilterGroup } from '@/components/ui/filters/FilterGroup'
import { Drawer } from '@/components/ui/overlay/Drawer'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { SlidersHorizontal } from 'lucide-react'
import { PaymentSearchBar } from './PaymentSearchBar'
import { PaymentTypeFilter } from './PaymentTypeFilter'
import { PaymentModeFilter } from './PaymentModeFilter'
import { PaymentStatusFilter } from './PaymentStatusFilter'
import { PaymentAmountFilter } from './PaymentAmountFilter'
import { DateRangeFilter } from '@/components/ui/filters/DateRangeFilter/DateRangeFilter'
import { TransactionTypeFilter } from './TransactionTypeFilter'
import { PartyTypeFilter } from './PartyTypeFilter'
import { ReconciliationFilter } from './ReconciliationFilter'
import type { DateRange } from 'react-day-picker'
import type { PriceRange } from '@/components/ui/filters/PriceRangeFilter/PriceRangeFilter'

// ============================================================================
// TYPES
// ============================================================================

export interface PaymentFilterState {
  search: string
  paymentType?: string
  transactionType?: string
  paymentMode?: string
  status?: string
  partyType?: string
  dateRange?: DateRange
  amountRange?: PriceRange
  isReconciled?: string
}

export interface PaymentFiltersProps {
  filters: PaymentFilterState
  onFiltersChange: (filters: PaymentFilterState) => void
  onClearAll: () => void
}

// ============================================================================
// PAYMENT FILTERS COMPONENT
// ============================================================================

export const PaymentFilters: React.FC<PaymentFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearAll,
}) => {
  const { t } = useTranslation()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [showAdvancedDrawer, setShowAdvancedDrawer] = React.useState(false)

  // ============================================================================
  // COUNT ACTIVE FILTERS
  // ============================================================================

  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.paymentType) count++
    if (filters.transactionType) count++
    if (filters.paymentMode) count++
    if (filters.status) count++
    if (filters.partyType) count++
    if (filters.dateRange?.from) count++
    if (filters.amountRange?.min || filters.amountRange?.max) count++
    if (filters.isReconciled) count++
    return count
  }, [filters])

  const hasActiveFilters =
    activeFilterCount > 0 || (filters.search?.length ?? 0) > 0

  // Count advanced filters only (for "More Filters" badge)
  const advancedFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.partyType) count++
    if (filters.dateRange?.from) count++
    if (filters.amountRange?.min || filters.amountRange?.max) count++
    if (filters.isReconciled) count++
    return count
  }, [filters])

  // ============================================================================
  // FILTER HANDLERS
  // ============================================================================

  const handleSearchChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, search: value || '' })
  }

  const handlePaymentTypeChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, paymentType: value })
  }

  const handleTransactionTypeChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, transactionType: value })
  }

  const handlePaymentModeChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, paymentMode: value })
  }

  const handleStatusChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, status: value })
  }

  const handlePartyTypeChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, partyType: value })
  }

  const handleDateRangeChange = (value: DateRange | undefined) => {
    onFiltersChange({ ...filters, dateRange: value })
  }

  const handleAmountRangeChange = (value: PriceRange) => {
    onFiltersChange({ ...filters, amountRange: value })
  }

  const handleReconciliationChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, isReconciled: value })
  }

  const handleApplyAdvanced = () => {
    setShowAdvancedDrawer(false)
  }

  const handleClearAdvanced = () => {
    onFiltersChange({
      ...filters,
      partyType: undefined,
      dateRange: undefined,
      amountRange: undefined,
      isReconciled: undefined,
    })
  }

  // ============================================================================
  // DESKTOP VIEW
  // ============================================================================

  if (isDesktop) {
    return (
      <>
        <FilterBar
          hasActiveFilters={hasActiveFilters}
          onClearAll={onClearAll}
          showClearButton={true}
        >
          {/* Search Bar */}
          <PaymentSearchBar
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full md:w-96"
          />

          {/* Payment Type Filter */}
          <PaymentTypeFilter
            value={filters.paymentType}
            onChange={handlePaymentTypeChange}
          />

          {/* Transaction Type Filter */}
          <TransactionTypeFilter
            value={filters.transactionType}
            onChange={handleTransactionTypeChange}
          />

          {/* Payment Mode Filter */}
          <PaymentModeFilter
            value={filters.paymentMode}
            onChange={handlePaymentModeChange}
          />

          {/* Status Filter */}
          <PaymentStatusFilter
            value={filters.status}
            onChange={handleStatusChange}
          />

          {/* More Filters Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedDrawer(true)}
            className="relative"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            {t('payment.filters.moreFilters')}
            {advancedFilterCount > 0 && (
              <span className="ml-2 rounded-full bg-accent px-1.5 py-0.5 text-xs text-white">
                {advancedFilterCount}
              </span>
            )}
          </Button>
        </FilterBar>

        {/* Advanced Filters Drawer */}
        <Drawer
          open={showAdvancedDrawer}
          onOpenChange={setShowAdvancedDrawer}
          title={t('payment.filters.advancedFilters')}
          side="right"
          size="md"
        >
          <div className="space-y-6">
            {/* Party Type Filter */}
            <FilterGroup label={t('payment.filters.partyType')}>
              <PartyTypeFilter
                value={filters.partyType}
                onChange={handlePartyTypeChange}
              />
            </FilterGroup>

            {/* Date Range Filter */}
            <FilterGroup label={t('payment.filters.dateRange')}>
              <DateRangeFilter
                value={filters.dateRange}
                onChange={handleDateRangeChange}
              />
            </FilterGroup>

            {/* Amount Range Filter */}
            <FilterGroup label={t('payment.filters.amountRange')}>
              <PaymentAmountFilter
                value={filters.amountRange}
                onChange={handleAmountRangeChange}
              />
            </FilterGroup>

            {/* Reconciliation Filter */}
            <FilterGroup label={t('payment.filters.reconciliation')}>
              <ReconciliationFilter
                value={filters.isReconciled}
                onChange={handleReconciliationChange}
              />
            </FilterGroup>

            {/* Actions */}
            <div className="flex gap-3 border-t border-border-primary pt-4">
              <Button
                variant="outline"
                onClick={handleClearAdvanced}
                className="flex-1"
                disabled={advancedFilterCount === 0}
              >
                {t('filters.clearAdvanced')}
              </Button>
              <Button onClick={handleApplyAdvanced} className="flex-1">
                {t('common.apply')}
              </Button>
            </div>
          </div>
        </Drawer>
      </>
    )
  }

  // ============================================================================
  // MOBILE VIEW
  // ============================================================================

  return (
    <>
      <div className="space-y-3">
        {/* Search Bar */}
        <PaymentSearchBar
          value={filters.search}
          onChange={handleSearchChange}
          className="w-full"
        />

        {/* Filter Button */}
        <Button
          variant="outline"
          onClick={() => setShowAdvancedDrawer(true)}
          className="relative w-full"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          {t('filters.filters')}
          {activeFilterCount > 0 && (
            <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs text-white">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Mobile Drawer - Full Width */}
      <Drawer
        open={showAdvancedDrawer}
        onOpenChange={setShowAdvancedDrawer}
        title={t('payment.filters.title')}
        side="right"
        size="full"
      >
        <div className="space-y-6">
          {/* Payment Type */}
          <FilterGroup label={t('payment.filters.paymentType')}>
            <PaymentTypeFilter
              value={filters.paymentType}
              onChange={handlePaymentTypeChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Transaction Type */}
          <FilterGroup label={t('payment.filters.transactionType')}>
            <TransactionTypeFilter
              value={filters.transactionType}
              onChange={handleTransactionTypeChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Payment Mode */}
          <FilterGroup label={t('payment.filters.paymentMode')}>
            <PaymentModeFilter
              value={filters.paymentMode}
              onChange={handlePaymentModeChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Status */}
          <FilterGroup label={t('payment.common.status')}>
            <PaymentStatusFilter
              value={filters.status}
              onChange={handleStatusChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Party Type */}
          <FilterGroup label={t('payment.filters.partyType')}>
            <PartyTypeFilter
              value={filters.partyType}
              onChange={handlePartyTypeChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Date Range */}
          <FilterGroup label={t('payment.filters.dateRange')}>
            <DateRangeFilter
              value={filters.dateRange}
              onChange={handleDateRangeChange}
            />
          </FilterGroup>

          {/* Amount Range */}
          <FilterGroup label={t('payment.filters.amountRange')}>
            <PaymentAmountFilter
              value={filters.amountRange}
              onChange={handleAmountRangeChange}
            />
          </FilterGroup>

          {/* Reconciliation */}
          <FilterGroup label={t('payment.filters.reconciliation')}>
            <ReconciliationFilter
              value={filters.isReconciled}
              onChange={handleReconciliationChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Actions - WITH CLEAR ALL */}
          <div className="sticky bottom-0 flex gap-3 border-t border-border-primary bg-bg-secondary pb-4 pt-4">
            <Button
              variant="outline"
              onClick={onClearAll}
              className="flex-1"
              disabled={activeFilterCount === 0}
            >
              {t('filters.clearAll')}
            </Button>
            <Button onClick={handleApplyAdvanced} className="flex-1">
              {t('common.apply')}
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  )
}
