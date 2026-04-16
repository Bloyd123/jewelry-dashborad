// FILE: src/components/girviTransfer/GirviTransferFilters/GirviTransferFilters.tsx

import * as React       from 'react'
import { useTranslation } from 'react-i18next'
import { SlidersHorizontal } from 'lucide-react'
import { FilterBar }      from '@/components/ui/filters/FilterBar'
import { FilterGroup }    from '@/components/ui/filters/FilterGroup'
import { Drawer }         from '@/components/ui/overlay/Drawer'
import { Button }         from '@/components/ui/button'
import { DateRangeFilter } from '@/components/ui/filters/DateRangeFilter'
import { useMediaQuery }  from '@/hooks/useMediaQuery'
import { TransferSearchBar }   from './TransferSearchBar'
import { TransferStatusFilter } from './TransferStatusFilter'
import { TransferTypeFilter }   from './TransferTypeFilter'
import { TransferActiveFilters } from './TransferActiveFilters'
import type { GirviTransferFilterValues } from './types'
import type { DateRange } from 'react-day-picker'

interface GirviTransferFiltersProps {
  filters:         GirviTransferFilterValues
  onFiltersChange: (filters: GirviTransferFilterValues) => void
  onClearAll:      () => void
}

export const GirviTransferFilters: React.FC<GirviTransferFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearAll,
}) => {
  const { t }        = useTranslation()
  const isDesktop    = useMediaQuery('(min-width: 768px)')
  const [showDrawer, setShowDrawer] = React.useState(false)

  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.status)       count++
    if (filters.transferType) count++
    if (filters.dateRange?.from) count++
    return count
  }, [filters])

  const hasActiveFilters = activeFilterCount > 0 || filters.search.length > 0

  const handleSearchChange      = (value: string)             => onFiltersChange({ ...filters, search: value })
  const handleStatusChange      = (value: string | undefined) => onFiltersChange({ ...filters, status: value })
  const handleTypeChange        = (value: string | undefined) => onFiltersChange({ ...filters, transferType: value })
  const handleDateRangeChange   = (range: DateRange | undefined) => onFiltersChange({ ...filters, dateRange: range })

  const handleRemoveFilter = (filterId: string) => {
    const newFilters = { ...filters }
    if (filterId === 'dateRange') newFilters.dateRange = undefined
    else delete newFilters[filterId]
    onFiltersChange(newFilters)
  }

  if (isDesktop) {
    return (
      <>
        <FilterBar hasActiveFilters={hasActiveFilters} onClearAll={onClearAll} showClearButton>
          <TransferSearchBar
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full md:w-80"
          />
          <TransferStatusFilter value={filters.status} onChange={handleStatusChange} />
          <TransferTypeFilter   value={filters.transferType} onChange={handleTypeChange} />
          <Button variant="outline" size="sm" onClick={() => setShowDrawer(true)} className="relative">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            {t('filters.moreFilters', 'More Filters')}
            {filters.dateRange?.from && (
              <span className="ml-2 rounded-full bg-accent px-1.5 py-0.5 text-xs text-white">1</span>
            )}
          </Button>
        </FilterBar>

        <TransferActiveFilters
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={onClearAll}
        />

        <Drawer open={showDrawer} onOpenChange={setShowDrawer} title={t('filters.advancedFilters')} side="right" size="md">
          <div className="space-y-6">
            <FilterGroup label={t('girviTransfer.filters.dateRange', 'Date Range')}>
              <DateRangeFilter value={filters.dateRange} onChange={handleDateRangeChange} className="w-full" />
            </FilterGroup>
            <div className="flex gap-3 border-t border-border-primary pt-4">
              <Button variant="outline" onClick={() => { handleDateRangeChange(undefined); }} className="flex-1">
                {t('filters.clearAdvanced')}
              </Button>
              <Button onClick={() => setShowDrawer(false)} className="flex-1">
                {t('common.apply', 'Apply')}
              </Button>
            </div>
          </div>
        </Drawer>
      </>
    )
  }

  // Mobile
  return (
    <>
      <div className="space-y-3">
        <TransferSearchBar value={filters.search} onChange={handleSearchChange} className="w-full" />
        <Button variant="outline" onClick={() => setShowDrawer(true)} className="relative w-full">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          {t('filters.filters', 'Filters')}
          {activeFilterCount > 0 && (
            <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs text-white">
              {activeFilterCount}
            </span>
          )}
        </Button>
        <TransferActiveFilters filters={filters} onRemoveFilter={handleRemoveFilter} onClearAll={onClearAll} />
      </div>

      <Drawer open={showDrawer} onOpenChange={setShowDrawer} title={t('filters.title')} side="right" size="full">
        <div className="space-y-6">
          <FilterGroup label={t('girviTransfer.filters.status')}>
            <TransferStatusFilter value={filters.status} onChange={handleStatusChange} className="w-full" />
          </FilterGroup>
          <FilterGroup label={t('girviTransfer.filters.transferType')}>
            <TransferTypeFilter value={filters.transferType} onChange={handleTypeChange} className="w-full" />
          </FilterGroup>
          <FilterGroup label={t('girviTransfer.filters.dateRange')}>
            <DateRangeFilter value={filters.dateRange} onChange={handleDateRangeChange} className="w-full" />
          </FilterGroup>
          <div className="sticky bottom-0 flex gap-3 border-t border-border-primary bg-bg-secondary pb-4 pt-4">
            <Button variant="outline" onClick={onClearAll} className="flex-1" disabled={activeFilterCount === 0}>
              {t('filters.clearAll')}
            </Button>
            <Button onClick={() => setShowDrawer(false)} className="flex-1">
              {t('common.apply', 'Apply')}
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  )
}