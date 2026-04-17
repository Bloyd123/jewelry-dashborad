// FILE: src/components/girviCashbook/GirviCashbookFilters/GirviCashbookFilters.tsx

import * as React       from 'react'
import { useTranslation } from 'react-i18next'
import { SlidersHorizontal } from 'lucide-react'
import { FilterBar }      from '@/components/ui/filters/FilterBar'
import { FilterGroup }    from '@/components/ui/filters/FilterGroup'
import { FilterChips, type ActiveFilter } from '@/components/ui/filters/FilterChips'
import { Drawer }         from '@/components/ui/overlay/Drawer'
import { Button }         from '@/components/ui/button'
import { SearchBar }      from '@/components/ui/SearchBar'
import { DateRangeFilter } from '@/components/ui/filters/DateRangeFilter'
import { useMediaQuery }  from '@/hooks/useMediaQuery'
import { EntryTypeFilter } from './EntryTypeFilter'
import { FlowTypeFilter }  from './FlowTypeFilter'
import { ENTRY_TYPE_LABELS } from '@/validators/girviCashbookValidation'
import { format }         from 'date-fns'
import type { GirviCashbookFilterValues } from './types'
import type { DateRange } from 'react-day-picker'

interface GirviCashbookFiltersProps {
  filters:         GirviCashbookFilterValues
  onFiltersChange: (filters: GirviCashbookFilterValues) => void
  onClearAll:      () => void
}

export const GirviCashbookFilters: React.FC<GirviCashbookFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearAll,
}) => {
  const { t }       = useTranslation()
  const isDesktop   = useMediaQuery('(min-width: 768px)')
  const [showDrawer, setShowDrawer] = React.useState(false)

  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.entryType)      count++
    if (filters.flowType)       count++
    if (filters.paymentMode)    count++
    if (filters.dateRange?.from) count++
    return count
  }, [filters])

  const hasActiveFilters =
    activeFilterCount > 0 || filters.search.length > 0
  const handleSearchChange    = (value: string)             => onFiltersChange({ ...filters, search: value })
  const handleEntryTypeChange = (value: string | undefined) => onFiltersChange({ ...filters, entryType: value as any })
  const handleFlowTypeChange  = (value: string | undefined) => onFiltersChange({ ...filters, flowType:  value as any })
  const handleDateRangeChange = (range: DateRange | undefined) => onFiltersChange({ ...filters, dateRange: range })

  const handleRemoveFilter = (filterId: string) => {
    const newFilters = { ...filters }
    if (filterId === 'dateRange') newFilters.dateRange = undefined
    else delete newFilters[filterId]
    onFiltersChange(newFilters)
  }

  const activeFilters: ActiveFilter[] = React.useMemo(() => {
    const active: ActiveFilter[] = []

    if (filters.entryType) {
      active.push({
        id:    'entryType',
        label: t('girviCashbook.filters.entryType', 'Entry Type'),
        value: ENTRY_TYPE_LABELS[filters.entryType] ?? filters.entryType,
      })
    }
    if (filters.flowType) {
      active.push({
        id:    'flowType',
        label: t('girviCashbook.filters.flowType', 'Flow Type'),
        value: t(`girviCashbook.flowType.${filters.flowType}`, filters.flowType),
      })
    }
    if (filters.dateRange?.from) {
      const dateText = filters.dateRange.to
        ? `${format(filters.dateRange.from, 'dd MMM')} - ${format(filters.dateRange.to, 'dd MMM yyyy')}`
        : format(filters.dateRange.from, 'dd MMM yyyy')
      active.push({
        id:    'dateRange',
        label: t('girviCashbook.filters.dateRange', 'Date Range'),
        value: dateText,
      })
    }
    return active
  }, [filters, t])

  if (isDesktop) {
    return (
      <>
        <FilterBar
          hasActiveFilters={hasActiveFilters}
          onClearAll={onClearAll}
          showClearButton
        >
          <SearchBar
            value={filters.search}
            onChange={handleSearchChange}
            placeholder={t('girviCashbook.filters.searchPlaceholder', 'Search entries...')}
            className="w-full md:w-80"
            debounceMs={300}
          />
          <EntryTypeFilter value={filters.entryType} onChange={handleEntryTypeChange} />
          <FlowTypeFilter  value={filters.flowType}  onChange={handleFlowTypeChange}  />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDrawer(true)}
            className="relative"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            {t('filters.moreFilters', 'More Filters')}
            {filters.dateRange?.from && (
              <span className="ml-2 rounded-full bg-accent px-1.5 py-0.5 text-xs text-white">
                1
              </span>
            )}
          </Button>
        </FilterBar>

        <FilterChips
          filters={activeFilters}
          onRemove={handleRemoveFilter}
          onClearAll={onClearAll}
        />

        <Drawer
          open={showDrawer}
          onOpenChange={setShowDrawer}
          title={t('filters.advancedFilters', 'Advanced Filters')}
          side="right"
          size="md"
        >
          <div className="space-y-6">
            <FilterGroup label={t('girviCashbook.filters.dateRange', 'Date Range')}>
              <DateRangeFilter
                value={filters.dateRange}
                onChange={handleDateRangeChange}
                className="w-full"
              />
            </FilterGroup>
            <div className="flex gap-3 border-t border-border-primary pt-4">
              <Button
                variant="outline"
                onClick={() => handleDateRangeChange(undefined)}
                className="flex-1"
              >
                {t('filters.clearAdvanced', 'Clear')}
              </Button>
              <Button
                onClick={() => setShowDrawer(false)}
                className="flex-1"
              >
                {t('common.apply', 'Apply')}
              </Button>
            </div>
          </div>
        </Drawer>
      </>
    )
  }

  return (
    <>
      <div className="space-y-3">
        <SearchBar
          value={filters.search}
          onChange={handleSearchChange}
          placeholder={t('girviCashbook.filters.searchPlaceholder', 'Search entries...')}
          className="w-full"
          debounceMs={300}
        />
        <Button
          variant="outline"
          onClick={() => setShowDrawer(true)}
          className="relative w-full"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          {t('filters.filters', 'Filters')}
          {activeFilterCount > 0 && (
            <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs text-white">
              {activeFilterCount}
            </span>
          )}
        </Button>
        <FilterChips
          filters={activeFilters}
          onRemove={handleRemoveFilter}
          onClearAll={onClearAll}
        />
      </div>

      <Drawer
        open={showDrawer}
        onOpenChange={setShowDrawer}
        title={t('filters.title', 'Filters')}
        side="right"
        size="full"
      >
        <div className="space-y-6">
          <FilterGroup label={t('girviCashbook.filters.entryType')}>
            <EntryTypeFilter
              value={filters.entryType}
              onChange={handleEntryTypeChange}
              className="w-full"
            />
          </FilterGroup>
          <FilterGroup label={t('girviCashbook.filters.flowType')}>
            <FlowTypeFilter
              value={filters.flowType}
              onChange={handleFlowTypeChange}
              className="w-full"
            />
          </FilterGroup>
          <FilterGroup label={t('girviCashbook.filters.dateRange')}>
            <DateRangeFilter
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
              {t('filters.clearAll', 'Clear All')}
            </Button>
            <Button
              onClick={() => setShowDrawer(false)}
              className="flex-1"
            >
              {t('common.apply', 'Apply')}
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  )
}