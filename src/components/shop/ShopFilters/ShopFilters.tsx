import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { FilterBar } from '@/components/ui/filters/FilterBar'
import { FilterGroup } from '@/components/ui/filters/FilterGroup'
import { Drawer } from '@/components/ui/overlay/Drawer'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { SlidersHorizontal } from 'lucide-react'

import {
  ShopSearchBar,
  ShopStatusFilter,
  ShopVerificationFilter,
  ShopTypeFilter,
  ShopCategoryFilter,
  ShopLocationFilter,
  ShopEstablishedYearFilter,
  ShopSortFilter,
} from './index'

// ============================================================================
// TYPES
// ============================================================================

export interface ShopFilterValues {
  search: string
  isActive?: string
  isVerified?: string
  shopType?: string
  category?: string
  state?: string
  city?: string
  establishedYear?: { min?: number; max?: number }
  sort?: string
}

interface ShopFiltersProps {
  filters: ShopFilterValues
  onFiltersChange: (filters: ShopFilterValues) => void
  onClearAll: () => void
}

// ============================================================================
// SHOP FILTERS COMPONENT
// ============================================================================

export const ShopFilters: React.FC<ShopFiltersProps> = ({
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
    if (filters.isActive) count++
    if (filters.isVerified) count++
    if (filters.shopType) count++
    if (filters.category) count++
    if (filters.state) count++
    if (filters.city) count++
    if (filters.establishedYear?.min || filters.establishedYear?.max) count++
    return count
  }, [filters])

  const hasActiveFilters = activeFilterCount > 0 || filters.search.length > 0

  // Handler functions
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value })
  }

  const handleStatusChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, isActive: value })
  }

  const handleVerificationChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, isVerified: value })
  }

  const handleTypeChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, shopType: value })
  }

  const handleCategoryChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, category: value })
  }

  const handleStateChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, state: value, city: undefined })
  }

  const handleCityChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, city: value })
  }

  const handleYearChange = (range: { min?: number; max?: number }) => {
    onFiltersChange({ ...filters, establishedYear: range })
  }

  const handleSortChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, sort: value })
  }

  const handleApplyAdvanced = () => {
    setShowAdvancedDrawer(false)
  }

  const handleClearAdvanced = () => {
    onFiltersChange({
      ...filters,
      state: undefined,
      city: undefined,
      establishedYear: undefined,
    })
  }

  // Count advanced filters only
  const advancedFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.state) count++
    if (filters.city) count++
    if (filters.establishedYear?.min || filters.establishedYear?.max) count++
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
          {/* Search Bar */}
          <ShopSearchBar
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full md:w-96"
          />

          {/* Status Filter */}
          <ShopStatusFilter
            value={filters.isActive}
            onChange={handleStatusChange}
          />

          {/* Verification Filter */}
          <ShopVerificationFilter
            value={filters.isVerified}
            onChange={handleVerificationChange}
          />

          {/* Shop Type Filter */}
          <ShopTypeFilter
            value={filters.shopType}
            onChange={handleTypeChange}
          />

          {/* Category Filter */}
          <ShopCategoryFilter
            value={filters.category}
            onChange={handleCategoryChange}
          />

          {/* Sort Filter */}
          <ShopSortFilter
            value={filters.sort}
            onChange={handleSortChange}
          />

          {/* More Filters Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedDrawer(true)}
            className="relative"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            {t('filters.moreFilters')}
            {advancedFilterCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-accent text-white">
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
            {/* Location Filter */}
            <FilterGroup label={t('shop.filters.location')}>
              <ShopLocationFilter
                state={filters.state}
                city={filters.city}
                onStateChange={handleStateChange}
                onCityChange={handleCityChange}
                className="flex-col"
              />
            </FilterGroup>

            {/* Established Year Filter */}
            <FilterGroup label={t('shop.filters.establishedYear')}>
              <ShopEstablishedYearFilter
                value={filters.establishedYear}
                onChange={handleYearChange}
              />
            </FilterGroup>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border-primary">
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
        <ShopSearchBar
          value={filters.search}
          onChange={handleSearchChange}
          className="w-full"
        />

        {/* Filter Button */}
        <Button
          variant="outline"
          onClick={() => setShowAdvancedDrawer(true)}
          className="w-full relative"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          {t('filters.filters')}
          {activeFilterCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-accent text-white">
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
          {/* Status */}
          <FilterGroup label={t('filters.status')}>
            <ShopStatusFilter
              value={filters.isActive}
              onChange={handleStatusChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Verification */}
          <FilterGroup label={t('shop.filters.verification')}>
            <ShopVerificationFilter
              value={filters.isVerified}
              onChange={handleVerificationChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Shop Type */}
          <FilterGroup label={t('shop.filters.shopType')}>
            <ShopTypeFilter
              value={filters.shopType}
              onChange={handleTypeChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Category */}
          <FilterGroup label={t('shop.filters.category')}>
            <ShopCategoryFilter
              value={filters.category}
              onChange={handleCategoryChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Location */}
          <FilterGroup label={t('shop.filters.location')}>
            <ShopLocationFilter
              state={filters.state}
              city={filters.city}
              onStateChange={handleStateChange}
              onCityChange={handleCityChange}
              className="flex-col"
            />
          </FilterGroup>

          {/* Established Year */}
          <FilterGroup label={t('shop.filters.establishedYear')}>
            <ShopEstablishedYearFilter
              value={filters.establishedYear}
              onChange={handleYearChange}
            />
          </FilterGroup>

          {/* Sort */}
          <FilterGroup label={t('shop.sort.sortBy')}>
            <ShopSortFilter
              value={filters.sort}
              onChange={handleSortChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Actions - WITH CLEAR ALL */}
          <div className="flex gap-3 pt-4 border-t border-border-primary sticky bottom-0 bg-bg-secondary pb-4">
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