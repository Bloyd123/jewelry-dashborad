// ============================================================================
// FILE: src/features/customer/components/CustomerFilters/AdvancedFiltersSheet.tsx
// Advanced Filters in Bottom Sheet (Mobile)
// ============================================================================

import * as React from 'react'
import { Filter, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/base/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/overlay/Sheet'
import { Label } from '@/components/ui/base/label'
import { Separator } from '@/components/ui/layout/Separator'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  selectCustomerFilters,
  setBalanceFilter,
  clearFilters,
} from '@/store/slices/customerSlice'
import { CustomerTypeFilter } from './CustomerTypeFilter'
import { MembershipTierFilter } from './MembershipTierFilter'
import { StatusFilter } from './StatusFilter'
import { DateRangeFilter } from './DateRangeFilter'
import { Badge } from '@/components/ui/data-display/Badge'

export const AdvancedFiltersSheet: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const filters = useAppSelector(selectCustomerFilters)
  const [open, setOpen] = React.useState(false)

  const handleClearAll = () => {
    dispatch(clearFilters())
  }

  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.customerType) count++
    if (filters.membershipTier) count++
    if (filters.isActive !== undefined) count++
    if (filters.hasBalance) count++
    if (filters.startDate || filters.endDate) count++
    return count
  }, [filters])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="mr-2 h-4 w-4" />
          {t('customer.filters.moreFilters')}
          {activeFilterCount > 0 && (
            <Badge
              variant="accent"
              size="sm"
              className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>{t('customer.filters.advancedFilters')}</span>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="h-8 px-2 text-xs"
              >
                <X className="mr-1 h-3 w-3" />
                {t('customer.filters.clearAll')}
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6 overflow-y-auto max-h-[calc(80vh-120px)] pb-4">
          {/* Customer Type */}
          <div className="space-y-2">
            <Label>{t('customer.filters.customerType')}</Label>
            <CustomerTypeFilter />
          </div>

          <Separator />

          {/* Membership Tier */}
          <div className="space-y-2">
            <Label>{t('customer.filters.membershipTier')}</Label>
            <MembershipTierFilter />
          </div>

          <Separator />

          {/* Status */}
          <div className="space-y-2">
            <Label>{t('customer.filters.status')}</Label>
            <StatusFilter />
          </div>

          <Separator />

          {/* Date Range */}
          <div className="space-y-2">
            <Label>{t('customer.filters.dateRange')}</Label>
            <DateRangeFilter />
          </div>

          <Separator />

          {/* Has Balance */}
          <div className="space-y-2">
            <Label>{t('customer.filters.outstandingBalance')}</Label>
            <div className="flex items-center gap-2">
              <Button
                variant={filters.hasBalance ? 'default' : 'outline'}
                size="sm"
                onClick={() => dispatch(setBalanceFilter(!filters.hasBalance))}
              >
                {filters.hasBalance
                  ? t('customer.filters.showWithBalance')
                  : t('customer.filters.showAll')}
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-bg-secondary border-t border-border-primary">
          <Button className="w-full" onClick={() => setOpen(false)}>
            {t('common.apply')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
