// ============================================================================
// FILE: src/components/supplier/SupplierFilters/SupplierFilters.tsx
// Supplier Filters Container - Responsive Desktop & Mobile
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { FilterBar } from '@/components/ui/filters/FilterBar'
import { FilterGroup } from '@/components/ui/filters/FilterGroup'
import { Drawer } from '@/components/ui/overlay/Drawer'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { SlidersHorizontal } from 'lucide-react'

import {
  SupplierSearchBar,
  SupplierTypeFilter,
  SupplierCategoryFilter,
  SupplierStatusFilter,
  SupplierPreferredFilter,
  SupplierVerifiedFilter,
} from './index'
// ============================================================================
// TYPES
// ============================================================================

export interface SupplierFilterValues {
  search: string
  supplierType?: string
  supplierCategory?: string
  isActive?: string
  isPreferred?: string
  isVerified?: string
}

interface SupplierFiltersProps {
  filters: SupplierFilterValues
  onFiltersChange: (filters: SupplierFilterValues) => void
  onClearAll: () => void
}

// ============================================================================
// SUPPLIER FILTERS COMPONENT
// ============================================================================

export const SupplierFilters: React.FC<SupplierFiltersProps> = ({
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
    if (filters.supplierType) count++
    if (filters.supplierCategory) count++
    if (filters.isActive) count++
    if (filters.isPreferred) count++
    if (filters.isVerified) count++
    return count
  }, [filters])

  // Check if any filter is active
  const hasActiveFilters = activeFilterCount > 0 || filters.search.length > 0

  // Handler functions
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value })
  }

  const handleTypeChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, supplierType: value })
  }

  const handleCategoryChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, supplierCategory: value })
  }

  const handleStatusChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, isActive: value })
  }

  const handlePreferredChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, isPreferred: value })
  }

  const handleVerifiedChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, isVerified: value })
  }

  const handleApplyAdvanced = () => {
    setShowAdvancedDrawer(false)
  }

  const handleClearAdvanced = () => {
    onFiltersChange({
      ...filters,
      isPreferred: undefined,
      isVerified: undefined,
    })
  }

  // Count advanced filters only
  const advancedFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.isPreferred) count++
    if (filters.isVerified) count++
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
          <SupplierSearchBar
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full md:w-96"
          />

          {/* Main Filters - Visible on Desktop */}
          <SupplierTypeFilter
            value={filters.supplierType}
            onChange={handleTypeChange}
          />

          <SupplierCategoryFilter
            value={filters.supplierCategory}
            onChange={handleCategoryChange}
          />

          <SupplierStatusFilter
            value={filters.isActive}
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
            {/* Preferred Filter */}
            <FilterGroup label={t('suppliers.filters.preferredStatus')}>
              <SupplierPreferredFilter
                value={filters.isPreferred}
                onChange={handlePreferredChange}
                className="w-full"
              />
            </FilterGroup>

            {/* Verified Filter */}
            <FilterGroup label={t('suppliers.filters.verifiedStatus')}>
              <SupplierVerifiedFilter
                value={filters.isVerified}
                onChange={handleVerifiedChange}
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
  // MOBILE VIEW WITH DRAWER
  // ============================================================================
  return (
    <>
      <div className="space-y-3">
        {/* Search Bar - Always Visible on Mobile */}
        <SupplierSearchBar
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
        title={t('filters.title')}
        side="right"
        size="full"
      >
        <div className="space-y-6">
          {/* Supplier Type */}
          <FilterGroup label={t('suppliers.filters.type')}>
            <SupplierTypeFilter
              value={filters.supplierType}
              onChange={handleTypeChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Supplier Category */}
          <FilterGroup label={t('suppliers.filters.category')}>
            <SupplierCategoryFilter
              value={filters.supplierCategory}
              onChange={handleCategoryChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Status */}
          <FilterGroup label={t('suppliers.filters.status')}>
            <SupplierStatusFilter
              value={filters.isActive}
              onChange={handleStatusChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Preferred Status */}
          <FilterGroup label={t('suppliers.filters.preferredStatus')}>
            <SupplierPreferredFilter
              value={filters.isPreferred}
              onChange={handlePreferredChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Verified Status */}
          <FilterGroup label={t('suppliers.filters.verifiedStatus')}>
            <SupplierVerifiedFilter
              value={filters.isVerified}
              onChange={handleVerifiedChange}
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
