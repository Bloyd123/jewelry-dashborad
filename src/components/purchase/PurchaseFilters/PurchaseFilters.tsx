// ============================================================================
// FILE: src/components/purchase/PurchaseFilters/PurchaseFilters.tsx
// Main Purchase Filters Container
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
  PurchaseSearchBar,
  PurchaseSupplierFilter,
  PurchaseStatusFilter,
  PurchasePaymentStatusFilter,
  PurchaseDateRangeFilter,
  PurchaseTypeFilter,
  PurchaseApprovalStatusFilter,
  PurchaseActiveFilters,
} from './index'

import type { PurchaseFilterValues } from './types'

interface PurchaseFiltersProps {
  filters: PurchaseFilterValues
  onFiltersChange: (filters: PurchaseFilterValues) => void
  onClearAll: () => void
  suppliers?: Array<{ _id: string; businessName: string; supplierCode: string }>
}

export const PurchaseFilters: React.FC<PurchaseFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearAll,
  suppliers = [],
}) => {
  const { t } = useTranslation()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [showAdvancedDrawer, setShowAdvancedDrawer] = React.useState(false)

  // Active filter count
  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.supplierId) count++
    if (filters.status) count++
    if (filters.paymentStatus) count++
    if (filters.purchaseType) count++
    if (filters.approvalStatus) count++
    if (filters.dateRange?.from) count++
    return count
  }, [filters])

  const hasActiveFilters = activeFilterCount > 0 || filters.search.length > 0

  // Handlers
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value })
  }

  const handleSupplierChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, supplierId: value })
  }

  const handleStatusChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, status: value })
  }

  const handlePaymentStatusChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, paymentStatus: value })
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    onFiltersChange({ ...filters, dateRange: range })
  }

  const handlePurchaseTypeChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, purchaseType: value })
  }

  const handleApprovalStatusChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, approvalStatus: value })
  }

  const handleRemoveFilter = (filterId: string) => {
    const newFilters = { ...filters }
    if (filterId === 'dateRange') {
      newFilters.dateRange = undefined
    } else {
      delete newFilters[filterId]
    }
    onFiltersChange(newFilters)
  }

  const handleApplyAdvanced = () => {
    setShowAdvancedDrawer(false)
  }

  const handleClearAdvanced = () => {
    onFiltersChange({
      ...filters,
      purchaseType: undefined,
      approvalStatus: undefined,
      dateRange: undefined,
    })
  }

  const advancedFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.purchaseType) count++
    if (filters.approvalStatus) count++
    if (filters.dateRange?.from) count++
    return count
  }, [filters])

  // DESKTOP VIEW
  if (isDesktop) {
    return (
      <>
        <FilterBar
          hasActiveFilters={hasActiveFilters}
          onClearAll={onClearAll}
          showClearButton={true}
        >
          <PurchaseSearchBar
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full md:w-96"
          />

          <PurchaseSupplierFilter
            value={filters.supplierId}
            onChange={handleSupplierChange}
            suppliers={suppliers}
          />

          <PurchaseStatusFilter
            value={filters.status}
            onChange={handleStatusChange}
          />

          <PurchasePaymentStatusFilter
            value={filters.paymentStatus}
            onChange={handlePaymentStatusChange}
          />

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedDrawer(true)}
            className="relative"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            {t('filters.moreFilters')}
            {advancedFilterCount > 0 && (
              <span className="ml-2 rounded-full bg-accent px-1.5 py-0.5 text-xs text-white">
                {advancedFilterCount}
              </span>
            )}
          </Button>
        </FilterBar>

        <PurchaseActiveFilters
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={onClearAll}
          suppliers={suppliers}
        />

        <Drawer
          open={showAdvancedDrawer}
          onOpenChange={setShowAdvancedDrawer}
          title={t('filters.advancedFilters')}
          side="right"
          size="md"
        >
          <div className="space-y-6">
            <FilterGroup label={t('purchase.filters.purchaseType')}>
              <PurchaseTypeFilter
                value={filters.purchaseType}
                onChange={handlePurchaseTypeChange}
                className="w-full"
              />
            </FilterGroup>

            <FilterGroup label={t('purchase.filters.approvalStatus')}>
              <PurchaseApprovalStatusFilter
                value={filters.approvalStatus}
                onChange={handleApprovalStatusChange}
                className="w-full"
              />
            </FilterGroup>

            <FilterGroup label={t('purchase.filters.dateRange')}>
              <PurchaseDateRangeFilter
                value={filters.dateRange}
                onChange={handleDateRangeChange}
                className="w-full"
              />
            </FilterGroup>

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

  // MOBILE VIEW
  return (
    <>
      <div className="space-y-3">
        <PurchaseSearchBar
          value={filters.search}
          onChange={handleSearchChange}
          className="w-full"
        />

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

        <PurchaseActiveFilters
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={onClearAll}
          suppliers={suppliers}
        />
      </div>

      <Drawer
        open={showAdvancedDrawer}
        onOpenChange={setShowAdvancedDrawer}
        title={t('filters.title')}
        side="right"
        size="full"
      >
        <div className="space-y-6">
          <FilterGroup label={t('purchase.filters.supplier')}>
            <PurchaseSupplierFilter
              value={filters.supplierId}
              onChange={handleSupplierChange}
              suppliers={suppliers}
              className="w-full"
            />
          </FilterGroup>

          <FilterGroup label={t('purchase.filters.status')}>
            <PurchaseStatusFilter
              value={filters.status}
              onChange={handleStatusChange}
              className="w-full"
            />
          </FilterGroup>

          <FilterGroup label={t('purchase.filters.paymentStatus')}>
            <PurchasePaymentStatusFilter
              value={filters.paymentStatus}
              onChange={handlePaymentStatusChange}
              className="w-full"
            />
          </FilterGroup>

          <FilterGroup label={t('purchase.filters.purchaseType')}>
            <PurchaseTypeFilter
              value={filters.purchaseType}
              onChange={handlePurchaseTypeChange}
              className="w-full"
            />
          </FilterGroup>

          <FilterGroup label={t('purchase.filters.approvalStatus')}>
            <PurchaseApprovalStatusFilter
              value={filters.approvalStatus}
              onChange={handleApprovalStatusChange}
              className="w-full"
            />
          </FilterGroup>

          <FilterGroup label={t('purchase.filters.dateRange')}>
            <PurchaseDateRangeFilter
              value={filters.dateRange}
              onChange={handleDateRangeChange}
              className="w-full"
            />
          </FilterGroup>

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
