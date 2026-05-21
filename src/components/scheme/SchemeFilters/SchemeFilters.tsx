// FILE: src/components/scheme/SchemeFilters/SchemeFilters.tsx

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { FilterBar } from '@/components/ui/filters/FilterBar'
import { FilterGroup } from '@/components/ui/filters/FilterGroup'
import { Drawer } from '@/components/ui/overlay/Drawer'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { SlidersHorizontal } from 'lucide-react'
import {
  SchemeSearchBar,
  SchemeTypeFilter,
  SchemeStatusFilter,
  SchemeApprovalFilter,
  SchemeFeaturedFilter,
} from './index'
import type { SchemeFilterValues } from '../SchemeTable/SchemeTable.types'

interface SchemeFiltersProps {
  filters:          SchemeFilterValues
  onFiltersChange:  (filters: SchemeFilterValues) => void
  onClearAll:       () => void
}

export const SchemeFilters: React.FC<SchemeFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearAll,
}) => {
  const { t }        = useTranslation()
  const isDesktop    = useMediaQuery('(min-width: 768px)')
  const [showDrawer, setShowDrawer] = React.useState(false)

  // ─────────────────────────────────────────────
  // COUNTS
  // ─────────────────────────────────────────────
  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.status)      count++
    if (filters.schemeType)  count++
    if (filters.isActive)    count++
    if (filters.isFeatured)  count++
    return count
  }, [filters])

  const advancedFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.isActive)   count++
    if (filters.isFeatured) count++
    return count
  }, [filters])

  const hasActiveFilters =
    activeFilterCount > 0 || filters.search.length > 0

  // ─────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────
  const handleSearchChange = (value: string) =>
    onFiltersChange({ ...filters, search: value })

  const handleTypeChange = (value: string | undefined) =>
    onFiltersChange({ ...filters, schemeType: value as any })

  const handleStatusChange = (value: string | undefined) =>
    onFiltersChange({ ...filters, status: value as any })

  const handleApprovalChange = (value: string | undefined) =>
    onFiltersChange({ ...filters, approvalStatus: value as any })

  const handleFeaturedChange = (value: string | undefined) =>
    onFiltersChange({ ...filters, isFeatured: value })

  const handleActiveChange = (value: string | undefined) =>
    onFiltersChange({ ...filters, isActive: value })

  const handleClearAdvanced = () =>
    onFiltersChange({
      ...filters,
      isActive:       undefined,
      isFeatured:     undefined,
      approvalStatus: undefined,
    })

  const handleApplyAdvanced = () => setShowDrawer(false)

  // ─────────────────────────────────────────────
  // DESKTOP
  // ─────────────────────────────────────────────
  if (isDesktop) {
    return (
      <>
        <FilterBar
          hasActiveFilters={hasActiveFilters}
          onClearAll={onClearAll}
          showClearButton={true}
        >
          <SchemeSearchBar
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full md:w-96"
          />

          <SchemeTypeFilter
            value={filters.schemeType}
            onChange={handleTypeChange}
          />

          <SchemeStatusFilter
            value={filters.status}
            onChange={handleStatusChange}
          />

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDrawer(true)}
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

        {/* Advanced Drawer — Desktop */}
        <Drawer
          open={showDrawer}
          onOpenChange={setShowDrawer}
          title={t('filters.advancedFilters')}
          side="right"
          size="md"
        >
          <div className="space-y-6">
            <FilterGroup label={t('scheme.filters.approvalStatus')}>
              <SchemeApprovalFilter
                value={(filters as any).approvalStatus}
                onChange={handleApprovalChange}
                className="w-full"
              />
            </FilterGroup>

            <FilterGroup label={t('scheme.filters.featured')}>
              <SchemeFeaturedFilter
                value={filters.isFeatured}
                onChange={handleFeaturedChange}
                className="w-full"
              />
            </FilterGroup>

            <FilterGroup label={t('scheme.filters.activeStatus')}>
              <SchemeStatusFilter
                value={filters.isActive}
                onChange={handleActiveChange}
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
                {t('scheme.filters.clearAdvanced')}
              </Button>
              <Button
                onClick={handleApplyAdvanced}
                className="flex-1"
              >
                {t('common.apply')}
              </Button>
            </div>
          </div>
        </Drawer>
      </>
    )
  }

  // ─────────────────────────────────────────────
  // MOBILE
  // ─────────────────────────────────────────────
  return (
    <>
      <div className="space-y-3">
        <SchemeSearchBar
          value={filters.search}
          onChange={handleSearchChange}
          className="w-full"
        />

        <Button
          variant="outline"
          onClick={() => setShowDrawer(true)}
          className="relative w-full"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          {t('scheme.filters.filters')}
          {activeFilterCount > 0 && (
            <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs text-white">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* All Filters Drawer — Mobile */}
      <Drawer
        open={showDrawer}
        onOpenChange={setShowDrawer}
        title={t('scheme.filters.title')}
        side="right"
        size="full"
      >
        <div className="space-y-6">
          <FilterGroup label={t('scheme.filters.schemeType')}>
            <SchemeTypeFilter
              value={filters.schemeType}
              onChange={handleTypeChange}
              className="w-full"
            />
          </FilterGroup>

          <FilterGroup label={t('scheme.filters.status')}>
            <SchemeStatusFilter
              value={filters.status}
              onChange={handleStatusChange}
              className="w-full"
            />
          </FilterGroup>

          <FilterGroup label={t('scheme.filters.approvalStatus')}>
            <SchemeApprovalFilter
              value={(filters as any).approvalStatus}
              onChange={handleApprovalChange}
              className="w-full"
            />
          </FilterGroup>

          <FilterGroup label={t('scheme.filters.featured')}>
            <SchemeFeaturedFilter
              value={filters.isFeatured}
              onChange={handleFeaturedChange}
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
              {t('scheme.filters.clearAll')}
            </Button>
            <Button
              onClick={handleApplyAdvanced}
              className="flex-1"
            >
              {t('common.apply')}
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  )
}