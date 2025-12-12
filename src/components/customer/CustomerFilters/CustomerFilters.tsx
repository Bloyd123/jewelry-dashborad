// ============================================================================
// FILE: src/features/customer/components/CustomerFilters/CustomerFilters.tsx
// Main Filter Bar Container
// ============================================================================

import * as React from 'react'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Button } from '@/components/ui/base/button'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearFilters, selectHasActiveFilters } from '@/store/slices/customerSlice'
import { CustomerSearchBar } from './CustomerSearchBar'
import { CustomerTypeFilter } from './CustomerTypeFilter'
import { MembershipTierFilter } from './MembershipTierFilter'
import { StatusFilter } from './StatusFilter'
import { DateRangeFilter } from './DateRangeFilter'
import { AdvancedFiltersSheet } from './AdvancedFiltersSheet'

export const CustomerFilters: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const hasActiveFilters = useAppSelector(selectHasActiveFilters)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const handleClearAll = () => {
    dispatch(clearFilters())
  }

  return (
    <div className="space-y-4">
      {/* Search Bar - Always Visible */}
      <div className="flex flex-col md:flex-row gap-3">
        <CustomerSearchBar />
        
        {/* Mobile: Show Advanced Filters Button */}
        {!isDesktop && <AdvancedFiltersSheet />}
      </div>

      {/* Desktop: Show All Filters in Row */}
      {isDesktop && (
        <div className="flex flex-wrap items-center gap-3">
          <CustomerTypeFilter />
          <MembershipTierFilter />
          <StatusFilter />
          <DateRangeFilter />

          {/* Clear All Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="ml-auto"
            >
              <X className="mr-2 h-4 w-4" />
              {t('customer.filters.clearAll')}
            </Button>
          )}
        </div>
      )}

      {/* Mobile: Show Clear All if filters active */}
      {!isDesktop && hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearAll}
          className="w-full"
        >
          <X className="mr-2 h-4 w-4" />
          {t('customer.filters.clearAll')}
        </Button>
      )}
    </div>
  )
}