
// FILE: src/components/products/ProductFilters/ProductFilters.tsx
// Main Product Filters Container - Responsive Desktop & Mobile

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { FilterBar } from '@/components/ui/filters/FilterBar'
import { FilterGroup } from '@/components/ui/filters/FilterGroup'
import { Drawer } from '@/components/ui/overlay/Drawer'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { SlidersHorizontal } from 'lucide-react'

import {
  ProductSearchBar,
  ProductCategoryFilter,
  ProductMetalTypeFilter,
  ProductPurityFilter,
  ProductStatusFilter,
  ProductSaleStatusFilter,
  ProductPriceFilter,
  ProductGenderFilter,
  ProductTypeFilter,
  ProductActiveFilters,
} from './index'

import type { ProductFilterValues, PriceRange } from './types'

// ============================================================================
// PROPS INTERFACE
// ============================================================================

interface ProductFiltersProps {
  filters: ProductFilterValues
  onFiltersChange: (filters: ProductFilterValues) => void
  onClearAll: () => void
}

// ============================================================================
// PRODUCT FILTERS COMPONENT
// ============================================================================

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearAll,
}) => {
  const { t } = useTranslation()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [showAdvancedDrawer, setShowAdvancedDrawer] = React.useState(false)

  // ============================================================================
  // ACTIVE FILTERS COUNT
  // ============================================================================

  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.category) count++
    if (filters.metalType) count++
    if (filters.purity) count++
    if (filters.status) count++
    if (filters.saleStatus) count++
    if (filters.gender) count++
    if (filters.productType) count++
    if (filters.minPrice || filters.maxPrice) count++
    return count
  }, [filters])

  const hasActiveFilters = activeFilterCount > 0 || filters.search.length > 0

  // ============================================================================
  // HANDLER FUNCTIONS
  // ============================================================================

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value })
  }

  const handleCategoryChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, category: value, subCategory: undefined })
  }

  const handleMetalTypeChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, metalType: value, purity: undefined })
  }

  const handlePurityChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, purity: value })
  }

  const handleStatusChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, status: value })
  }

  const handleSaleStatusChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, saleStatus: value })
  }

  const handlePriceChange = (range: PriceRange) => {
    onFiltersChange({
      ...filters,
      minPrice: range.min,
      maxPrice: range.max,
    })
  }

  const handleGenderChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, gender: value })
  }

  const handleProductTypeChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, productType: value })
  }

  const handleRemoveFilter = (filterId: string) => {
    const newFilters = { ...filters }
    if (filterId === 'category') {
      newFilters.category = undefined
      newFilters.subCategory = undefined
    } else if (filterId === 'metalType') {
      newFilters.metalType = undefined
      newFilters.purity = undefined
    } else if (filterId === 'price') {
      newFilters.minPrice = undefined
      newFilters.maxPrice = undefined
    } else {
      newFilters[filterId as keyof ProductFilterValues] = undefined
    }
    onFiltersChange(newFilters)
  }

  const handleApplyAdvanced = () => {
    setShowAdvancedDrawer(false)
  }

  const handleClearAdvanced = () => {
    onFiltersChange({
      ...filters,
      gender: undefined,
      productType: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    })
  }

  const advancedFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.gender) count++
    if (filters.productType) count++
    if (filters.minPrice || filters.maxPrice) count++
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
          <ProductSearchBar
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full md:w-96"
          />

          {/* Main Filters - Visible on Desktop */}
          <ProductCategoryFilter
            value={filters.category}
            onChange={handleCategoryChange}
          />

          <ProductMetalTypeFilter
            value={filters.metalType}
            onChange={handleMetalTypeChange}
          />

          <ProductPurityFilter
            value={filters.purity}
            onChange={handlePurityChange}
            metalType={filters.metalType}
          />

          <ProductStatusFilter
            value={filters.status}
            onChange={handleStatusChange}
          />

          <ProductSaleStatusFilter
            value={filters.saleStatus}
            onChange={handleSaleStatusChange}
          />

          {/* More Filters Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedDrawer(true)}
            className="relative"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            {t('product.filters.moreFilters')}
            {advancedFilterCount > 0 && (
              <span className="ml-2 rounded-full bg-accent px-1.5 py-0.5 text-xs text-white">
                {advancedFilterCount}
              </span>
            )}
          </Button>
        </FilterBar>

        {/* Active Filters */}
        <ProductActiveFilters
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={onClearAll}
        />

        {/* Advanced Filters Drawer */}
        <Drawer
          open={showAdvancedDrawer}
          onOpenChange={setShowAdvancedDrawer}
          title={t('product.filters.advancedFilters')}
          side="right"
          size="md"
        >
          <div className="space-y-6">
            {/* Gender Filter */}
            <FilterGroup label={t('product.filters.gender')}>
              <ProductGenderFilter
                value={filters.gender}
                onChange={handleGenderChange}
                className="w-full"
              />
            </FilterGroup>

            {/* Product Type Filter */}
            <FilterGroup label={t('product.filters.productType')}>
              <ProductTypeFilter
                value={filters.productType}
                onChange={handleProductTypeChange}
                className="w-full"
              />
            </FilterGroup>

            {/* Price Range Filter */}
            <FilterGroup label={t('product.filters.priceRange')}>
              <ProductPriceFilter
                value={{ min: filters.minPrice, max: filters.maxPrice }}
                onChange={handlePriceChange}
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
                {t('product.filters.clearAdvanced')}
              </Button>
              <Button onClick={handleApplyAdvanced} className="flex-1">
                {t('product.common.apply')}
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
        <ProductSearchBar
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

        {/* Active Filters Display */}
        <ProductActiveFilters
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={onClearAll}
        />
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
          {/* Category Filter */}
          <FilterGroup label={t('product.filters.category')}>
            <ProductCategoryFilter
              value={filters.category}
              onChange={handleCategoryChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Metal Type Filter */}
          <FilterGroup label={t('product.filters.metalType')}>
            <ProductMetalTypeFilter
              value={filters.metalType}
              onChange={handleMetalTypeChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Purity Filter */}
          <FilterGroup label={t('product.filters.purity')}>
            <ProductPurityFilter
              value={filters.purity}
              onChange={handlePurityChange}
              metalType={filters.metalType}
              className="w-full"
            />
          </FilterGroup>

          {/* Status Filter */}
          <FilterGroup label={t('product.filters.status')}>
            <ProductStatusFilter
              value={filters.status}
              onChange={handleStatusChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Sale Status Filter */}
          <FilterGroup label={t('product.filters.saleStatus')}>
            <ProductSaleStatusFilter
              value={filters.saleStatus}
              onChange={handleSaleStatusChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Gender Filter */}
          <FilterGroup label={t('product.filters.gender')}>
            <ProductGenderFilter
              value={filters.gender}
              onChange={handleGenderChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Product Type Filter */}
          <FilterGroup label={t('product.filters.productType')}>
            <ProductTypeFilter
              value={filters.productType}
              onChange={handleProductTypeChange}
              className="w-full"
            />
          </FilterGroup>

          {/* Price Range Filter */}
          <FilterGroup label={t('product.filters.priceRange')}>
            <ProductPriceFilter
              value={{ min: filters.minPrice, max: filters.maxPrice }}
              onChange={handlePriceChange}
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
              {t('product.filters.clearAll')}
            </Button>
            <Button onClick={handleApplyAdvanced} className="flex-1">
              {t('product.common.apply')}
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  )
}
