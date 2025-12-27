// ============================================================================
// FILE: src/components/sales/SalesFilters/SalesFilters.tsx
// Sales Filters Container - Responsive Desktop & Mobile
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { FilterBar } from '@/components/ui/filters/FilterBar'
import { FilterGroup } from '@/components/ui/filters/FilterGroup'
import { Drawer } from '@/components/ui/overlay/Drawer'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { SlidersHorizontal } from 'lucide-react'
import type { DateRange } from 'react-day-picker'

import {
  SalesSearchBar,
  SalesStatusFilter,
  PaymentStatusFilter,
  SaleTypeFilter,
  PaymentModeFilter,
  SalesDateRangeFilter,
  AmountRangeFilter,
  CustomerFilter,
  SalesPersonFilter,
  ActiveFiltersDisplay,
} from './index'

// ============================================================================
// TYPES
// ============================================================================

export interface PriceRange {
  min?: number
  max?: number
}

export interface SalesFilterValues {
  search: string
  status?: string
  paymentStatus?: string
  saleType?: string
  paymentMode?: string
  customerId?: string
  salesPerson?: string
  dateRange?: DateRange
  amountRange?: PriceRange
}

interface SalesFiltersProps {
  filters: SalesFilterValues
  onFiltersChange: (filters: SalesFilterValues) => void
  onClearAll: () => void
  customers?: any[]
  salesPersons?: any[]
}

// ============================================================================
// SALES FILTERS COMPONENT
// ============================================================================

export const SalesFilters: React.FC<SalesFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearAll,
  customers = [],
  salesPersons = [],
}) => {
  const { t } = useTranslation()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [showAdvancedDrawer, setShowAdvancedDrawer] = React.useState(false)

  // Count active filters (excluding search)
  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.status) count++
    if (filters.paymentStatus) count++
    if (filters.saleType) count++
    if (filters.paymentMode) count++
    if (filters.customerId) count++
    if (filters.salesPerson) count++
    if (filters.dateRange?.from) count++
    if (filters.amountRange?.min || filters.amountRange?.max) count++
    return count
  }, [filters])

  // Check if any filter is active
  const hasActiveFilters = activeFilterCount > 0 || filters.search.length > 0

  // Count advanced filters only
  const advancedFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.paymentMode) count++
    if (filters.customerId) count++
    if (filters.salesPerson) count++
    if (filters.dateRange?.from) count++
    if (filters.amountRange?.min || filters.amountRange?.max) count++
    return count
  }, [filters])

  // Handler functions
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value })
  }

  const handleStatusChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, status: value })
  }

  const handlePaymentStatusChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, paymentStatus: value })
  }

  const handleSaleTypeChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, saleType: value })
  }

  const handlePaymentModeChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, paymentMode: value })
  }

  const handleCustomerChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, customerId: value })
  }

  const handleSalesPersonChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, salesPerson: value })
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    onFiltersChange({ ...filters, dateRange: range })
  }

  const handleAmountRangeChange = (range: PriceRange) => {
    onFiltersChange({ ...filters, amountRange: range })
  }

  const handleApplyAdvanced = () => {
    setShowAdvancedDrawer(false)
  }

  const handleClearAdvanced = () => {
    onFiltersChange({
      ...filters,
      paymentMode: undefined,
      customerId: undefined,
      salesPerson: undefined,
      dateRange: undefined,
      amountRange: {},
    })
  }

  // Active filters for display
  const activeFilters = React.useMemo(() => {
    const active = []

    if (filters.status) {
      active.push({
        id: 'status',
        label: t('sales.filters.status'),
        value: t(`sales.status.${filters.status}`),
      })
    }

    if (filters.paymentStatus) {
      active.push({
        id: 'paymentStatus',
        label: t('sales.filters.paymentStatus'),
        value: t(`sales.payment.${filters.paymentStatus}`),
      })
    }

    if (filters.saleType) {
      active.push({
        id: 'saleType',
        label: t('sales.filters.saleType'),
        value: t(`sales.type.${filters.saleType}`),
      })
    }

    if (filters.paymentMode) {
      active.push({
        id: 'paymentMode',
        label: t('sales.filters.paymentMode'),
        value: t(`sales.paymentMode.${filters.paymentMode}`),
      })
    }

    if (filters.dateRange?.from) {
      const from = new Date(filters.dateRange.from).toLocaleDateString()
      const to = filters.dateRange.to
        ? new Date(filters.dateRange.to).toLocaleDateString()
        : from
      active.push({
        id: 'dateRange',
        label: t('sales.filters.dateRange'),
        value: `${from} - ${to}`,
      })
    }

    if (filters.amountRange?.min || filters.amountRange?.max) {
      const min = filters.amountRange.min || 0
      const max = filters.amountRange.max || '∞'
      active.push({
        id: 'amountRange',
        label: t('sales.filters.amount'),
        value: `₹${min} - ₹${max}`,
      })
    }

    return active
  }, [filters, t])

  const handleRemoveFilter = (filterId: string) => {
    const newFilters = { ...filters }

    switch (filterId) {
      case 'status':
        newFilters.status = undefined
        break
      case 'paymentStatus':
        newFilters.paymentStatus = undefined
        break
      case 'saleType':
        newFilters.saleType = undefined
        break
      case 'paymentMode':
        newFilters.paymentMode = undefined
        break
      case 'dateRange':
        newFilters.dateRange = undefined
        break
      case 'amountRange':
        newFilters.amountRange = {}
        break
    }

    onFiltersChange(newFilters)
  }

  // ============================================================================
  // DESKTOP VIEW
  // ============================================================================
  if (isDesktop) {
    return (
      <>
        <div className="space-y-4">
          <FilterBar
            hasActiveFilters={hasActiveFilters}
            onClearAll={onClearAll}
            showClearButton={true}
          >
            {/* Search Bar - Always Visible */}
            <SalesSearchBar
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full md:w-96"
            />

            {/* Main Filters - Visible on Desktop */}
            <SalesStatusFilter
              value={filters.status}
              onChange={handleStatusChange}
            />

            <PaymentStatusFilter
              value={filters.paymentStatus}
              onChange={handlePaymentStatusChange}
            />

            <SaleTypeFilter
              value={filters.saleType}
              onChange={handleSaleTypeChange}
            />

            {/* More Filters Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedDrawer(true)}
              className="relative"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              {t('sales.filters.moreFilters')}
              {advancedFilterCount > 0 && (
                <span className="ml-2 rounded-full bg-accent px-1.5 py-0.5 text-xs text-white">
                  {advancedFilterCount}
                </span>
              )}
            </Button>
          </FilterBar>

          {/* Active Filters Display */}
          {activeFilters.length > 0 && (
            <ActiveFiltersDisplay
              filters={activeFilters}
              onRemove={handleRemoveFilter}
              onClearAll={onClearAll}
            />
          )}
        </div>

        {/* Advanced Filters Drawer */}
        <Drawer
          open={showAdvancedDrawer}
          onOpenChange={setShowAdvancedDrawer}
          title={t('sales.filters.advancedFilters')}
          side="right"
          size="md"
        >
          <div className="space-y-6">
            {/* Payment Mode Filter */}
            <FilterGroup label={t('sales.filters.paymentMode')}>
              <PaymentModeFilter
                value={filters.paymentMode}
                onChange={handlePaymentModeChange}
                className="w-full"
              />
            </FilterGroup>

            {/* Customer Filter */}
            <FilterGroup label={t('sales.filters.customer')}>
              <CustomerFilter
                value={filters.customerId}
                onChange={handleCustomerChange}
                customers={customers}
                className="w-full"
              />
            </FilterGroup>

            {/* Sales Person Filter */}
            <FilterGroup label={t('sales.filters.salesPerson')}>
              <SalesPersonFilter
                value={filters.salesPerson}
                onChange={handleSalesPersonChange}
                salesPersons={salesPersons}
                className="w-full"
              />
            </FilterGroup>

            {/* Date Range Filter */}
            <FilterGroup label={t('sales.filters.dateRange')}>
              <SalesDateRangeFilter
                value={filters.dateRange}
                onChange={handleDateRangeChange}
                className="w-full"
              />
            </FilterGroup>

            {/* Amount Range Filter */}
            <FilterGroup label={t('sales.filters.amount')}>
              <AmountRangeFilter
                value={filters.amountRange}
                onChange={handleAmountRangeChange}
                className="w-full"
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
                {t('sales.filters.clearAdvanced')}
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
  // MOBILE VIEW WITH DRAWER
  // ============================================================================
  return (
    <>
      <div className="space-y-3">
        {/* Search Bar - Always Visible on Mobile */}
        <SalesSearchBar
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
          {t('sales.filters.filters')}
          {activeFilterCount > 0 && (
            <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs text-white">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <ActiveFiltersDisplay
            filters={activeFilters}
            onRemove={handleRemoveFilter}
            onClearAll={onClearAll}
          />
        )}
      </div>

      {/* Mobile Drawer - Full Width */}
      <Drawer
        open={showAdvancedDrawer}
        onOpenChange={setShowAdvancedDrawer}
        title={t('sales.filters.title')}
        side="right"
        size="full"
      >
        <div className="space-y-6">
          {/* Status */}
          <FilterGroup label={t('sales.filters.status')}>
            <SalesStatusFilter
              value={filters.status}
              onChange={handleStatusChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Payment Status */}
          <FilterGroup label={t('sales.filters.paymentStatus')}>
            <PaymentStatusFilter
              value={filters.paymentStatus}
              onChange={handlePaymentStatusChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Sale Type */}
          <FilterGroup label={t('sales.filters.saleType')}>
            <SaleTypeFilter
              value={filters.saleType}
              onChange={handleSaleTypeChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Payment Mode */}
          <FilterGroup label={t('sales.filters.paymentMode')}>
            <PaymentModeFilter
              value={filters.paymentMode}
              onChange={handlePaymentModeChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Customer */}
          <FilterGroup label={t('sales.filters.customer')}>
            <CustomerFilter
              value={filters.customerId}
              onChange={handleCustomerChange}
              customers={customers}
              className="w-full"
            />
          </FilterGroup>

          {/* Sales Person */}
          <FilterGroup label={t('sales.filters.salesPerson')}>
            <SalesPersonFilter
              value={filters.salesPerson}
              onChange={handleSalesPersonChange}
              salesPersons={salesPersons}
              className="w-full"
            />
          </FilterGroup>

          {/* Date Range */}
          <FilterGroup label={t('sales.filters.dateRange')}>
            <SalesDateRangeFilter
              value={filters.dateRange}
              onChange={handleDateRangeChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Amount Range */}
          <FilterGroup label={t('sales.filters.amount')}>
            <AmountRangeFilter
              value={filters.amountRange}
              onChange={handleAmountRangeChange}
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
              {t('sales.filters.clearAll')}
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
SalesFilters.displayName = 'SalesFilters'
