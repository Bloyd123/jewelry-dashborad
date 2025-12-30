// ============================================================================
// FILE: src/components/customer/CustomerFilters/CustomerFilters.tsx
// Customer Filters Container - Responsive Desktop & Mobile
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
  CustomerSearchBar,
  CustomerTypeFilter,
  CustomerMembershipFilter,
  CustomerStatusFilter,
  CustomerBalanceFilter,
  CustomerVIPFilter,
  CustomerDateRangeFilter,
} from './index'

// ============================================================================
// TYPES
// ============================================================================

export interface CustomerFilterValues {
  search: string
  customerType?: string
  membershipTier?: string
  status?: string
  balance?: string
  vipOnly?: string
  dateRange?: DateRange
}

interface CustomerFiltersProps {
  filters: CustomerFilterValues
  onFiltersChange: (filters: CustomerFilterValues) => void
  onClearAll: () => void
}

// ============================================================================
// CUSTOMER FILTERS COMPONENT
// ============================================================================

export const CustomerFilters: React.FC<CustomerFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearAll,
}) => {
  const { t } = useTranslation()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [showAdvancedDrawer, setShowAdvancedDrawer] = React.useState(false)

  // Count active filters (excluding search)
  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.customerType) count++
    if (filters.membershipTier) count++
    if (filters.status) count++
    if (filters.balance) count++
    if (filters.vipOnly) count++
    if (filters.dateRange?.from) count++
    return count
  }, [filters])

  // Check if any filter is active
  const hasActiveFilters = activeFilterCount > 0 || filters.search.length > 0

  // Handler functions
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value })
  }

  const handleTypeChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, customerType: value })
  }

  const handleTierChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, membershipTier: value })
  }

  const handleStatusChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, status: value })
  }

  const handleBalanceChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, balance: value })
  }

  const handleVIPChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, vipOnly: value })
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    onFiltersChange({ ...filters, dateRange: range })
  }

  const handleApplyAdvanced = () => {
    setShowAdvancedDrawer(false)
  }

  const handleClearAdvanced = () => {
    onFiltersChange({
      ...filters,
      balance: undefined,
      vipOnly: undefined,
      dateRange: undefined,
    })
  }

  // Count advanced filters only
  const advancedFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.balance) count++
    if (filters.vipOnly) count++
    if (filters.dateRange?.from) count++
    return count
  }, [filters])

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
          {/* Search Bar - Always Visible */}
          <CustomerSearchBar
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full md:w-96"
          />

          {/* Main Filters - Visible on Desktop */}
          <CustomerTypeFilter
            value={filters.customerType}
            onChange={handleTypeChange}
          />

          <CustomerMembershipFilter
            value={filters.membershipTier}
            onChange={handleTierChange}
          />

          <CustomerStatusFilter
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
            {t('filters.moreFilters')}
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
          title={t('filters.advancedFilters')}
          side="right"
          size="md"
        >
          <div className="space-y-6">
            {/* Balance Filter */}
            <FilterGroup label={t('customer.filters.balance')}>
              <CustomerBalanceFilter
                value={filters.balance}
                onChange={handleBalanceChange}
                className="w-full"
              />
            </FilterGroup>

            {/* VIP Status Filter */}
            <FilterGroup label={t('customer.filters.vipStatus')}>
              <CustomerVIPFilter
                value={filters.vipOnly}
                onChange={handleVIPChange}
                className="w-full"
              />
            </FilterGroup>

            {/* Date Range Filter */}
            <FilterGroup label={t('customer.filters.dateRange')}>
              <CustomerDateRangeFilter
                value={filters.dateRange}
                onChange={handleDateRangeChange}
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
                {t('customer.filters.clearAdvanced')}
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
        <CustomerSearchBar
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
          {t('customer.filters.filters')}
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
        title={t('customer.filters.title')}
        side="right"
        size="full"
      >
        <div className="space-y-6">
          {/* Customer Type */}
          <FilterGroup label={t('customer.filters.customerType')}>
            <CustomerTypeFilter
              value={filters.customerType}
              onChange={handleTypeChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Membership Tier */}
          <FilterGroup label={t('customer.filters.membershipTier')}>
            <CustomerMembershipFilter
              value={filters.membershipTier}
              onChange={handleTierChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Status */}
          <FilterGroup label={t('customer.filters.status')}>
            <CustomerStatusFilter
              value={filters.status}
              onChange={handleStatusChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Balance */}
          <FilterGroup label={t('customer.filters.balance')}>
            <CustomerBalanceFilter
              value={filters.balance}
              onChange={handleBalanceChange}
              className="w-full"
            />
          </FilterGroup>

          {/* VIP Status */}
          <FilterGroup label={t('customer.filters.vipStatus')}>
            <CustomerVIPFilter
              value={filters.vipOnly}
              onChange={handleVIPChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Date Range */}
          <FilterGroup label={t('customer.filters.dateRange')}>
            <CustomerDateRangeFilter
              value={filters.dateRange}
              onChange={handleDateRangeChange}
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
              {t('customer.filters.clearAll')}
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
