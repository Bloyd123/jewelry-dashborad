// ============================================================================
// FILE: src/components/features/RateHistoryTable/RateHistoryFilters.tsx
// Rate History Filters - Responsive Desktop & Mobile with Drawer
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { TypeFilter } from '@/components/ui/filters/TypeFilter/TypeFilter'
import type { FilterOption } from '@/components/ui/filters/TypeFilter/TypeFilter'
import { FilterBar } from '@/components/ui/filters/FilterBar'
import { FilterGroup } from '@/components/ui/filters/FilterGroup'
import { Drawer } from '@/components/ui/overlay/Drawer'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Calendar, SlidersHorizontal } from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

export interface RateHistoryFilterValues {
  metalType?: string
  dateRange?: string
}

interface RateHistoryFiltersProps {
  filters: RateHistoryFilterValues
  onFiltersChange: (filters: RateHistoryFilterValues) => void
  onClearAll: () => void
}

// ============================================================================
// FILTER OPTIONS
// ============================================================================

const dateRangeOptions: FilterOption[] = [
  {
    value: 'last7days',
    label: 'Last 7 Days',
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    value: 'last30days',
    label: 'Last 30 Days',
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    value: 'last90days',
    label: 'Last 90 Days',
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    value: 'lastYear',
    label: 'Last Year',
    icon: <Calendar className="h-4 w-4" />,
  },
]

const metalTypeOptions: FilterOption[] = [
  { value: 'gold', label: 'Gold', icon: '🥇' },
  { value: 'silver', label: 'Silver', icon: '🥈' },
  { value: 'platinum', label: 'Platinum', icon: '💎' },
  { value: 'palladium', label: 'Palladium', icon: '⚪' },
]

// ============================================================================
// RATE HISTORY FILTERS COMPONENT
// ============================================================================

export const RateHistoryFilters: React.FC<RateHistoryFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearAll,
}) => {
  const { t } = useTranslation()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [showFiltersDrawer, setShowFiltersDrawer] = React.useState(false)

  // Count active filters
  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.metalType) count++
    if (filters.dateRange && filters.dateRange !== 'last7days') count++
    return count
  }, [filters])

  // Check if any filter is active
  const hasActiveFilters = activeFilterCount > 0

  // Handler functions
  const handleDateRangeChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, dateRange: value || 'last7days' })
  }

  const handleMetalTypeChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, metalType: value })
  }

  const handleApplyFilters = () => {
    setShowFiltersDrawer(false)
  }

  // ============================================================================
  // DESKTOP VIEW
  // ============================================================================
  if (isDesktop) {
    return (
      <FilterBar
        hasActiveFilters={hasActiveFilters}
        onClearAll={onClearAll}
        showClearButton={true}
      >
        {/* Filters Label */}
        <span className="whitespace-nowrap text-sm text-text-secondary">
          {t('metalRates.filters.filters')}:
        </span>

        {/* Date Range Filter */}
        <TypeFilter
          options={dateRangeOptions}
          value={filters.dateRange || 'last7days'}
          onChange={handleDateRangeChange}
          placeholder={t('metalRates.filters.selectDateRange')}
          showAllOption={false}
          className="w-40"
        />

        {/* Metal Type Filter */}
        <TypeFilter
          options={metalTypeOptions}
          value={filters.metalType}
          onChange={handleMetalTypeChange}
          placeholder={t('metalRates.filters.selectMetalType')}
          showAllOption={true}
          allOptionLabel={t('metalRates.filters.allMetals')}
          className="w-40"
        />
      </FilterBar>
    )
  }

  // ============================================================================
  // MOBILE VIEW WITH DRAWER
  // ============================================================================
  return (
    <>
      {/* Filter Button - Mobile */}
      <Button
        variant="outline"
        onClick={() => setShowFiltersDrawer(true)}
        className="relative w-full"
      >
        <SlidersHorizontal className="mr-2 h-4 w-4" />
        {t('metalRates.filters.filters')}
        {activeFilterCount > 0 && (
          <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs text-white">
            {activeFilterCount}
          </span>
        )}
      </Button>

      {/* Mobile Filters Drawer */}
      <Drawer
        open={showFiltersDrawer}
        onOpenChange={setShowFiltersDrawer}
        title={t('metalRates.filters.rateFilters')}
        side="right"
        size="full"
      >
        <div className="space-y-6">
          {/* Date Range */}
          <FilterGroup label={t('metalRates.filters.dateRange')}>
            <TypeFilter
              options={dateRangeOptions}
              value={filters.dateRange || 'last7days'}
              onChange={handleDateRangeChange}
              placeholder={t('metalRates.filters.selectDateRange')}
              showAllOption={false}
              className="w-full"
            />
          </FilterGroup>

          {/* Metal Type */}
          <FilterGroup label={t('metalRates.filters.metalType')}>
            <TypeFilter
              options={metalTypeOptions}
              value={filters.metalType}
              onChange={handleMetalTypeChange}
              placeholder={t('metalRates.filters.selectMetalType')}
              showAllOption={true}
              allOptionLabel={t('metalRates.filters.allMetals')}
              className="w-full"
            />
          </FilterGroup>

          {/* Actions */}
          <div className="sticky bottom-0 flex gap-3 border-t border-border-primary bg-bg-secondary pb-4 pt-4">
            <Button
              variant="outline"
              onClick={onClearAll}
              className="flex-1"
              disabled={activeFilterCount === 0}
            >
              {t('metalRates.filters.clearAll')}
            </Button>
            <Button onClick={handleApplyFilters} className="flex-1">
              {t('metalRates.common.apply')}
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  )
}

RateHistoryFilters.displayName = 'RateHistoryFilters'
