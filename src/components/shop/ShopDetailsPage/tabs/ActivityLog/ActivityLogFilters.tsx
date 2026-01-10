//
// FILE: src/components/shop/ShopDetailsPages/tabs/ActivityLogFilters.tsx
// Activity Log Filters Component - FIXED with Label import
//

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/data-display/Badge'
import { SearchBar } from '@/components/ui/SearchBar'
import { TypeFilter } from '@/components/ui/filters/TypeFilter'
import { StatusFilter } from '@/components/ui/filters/StatusFilter'
import { DateRangeFilter } from '@/components/ui/filters/DateRangeFilter'
import type { DateRange } from 'react-day-picker'

//
// TYPES
//

export interface ActivityLogFilterValues {
  search: string
  user?: string
  action?: string
  module?: string
  status?: string
  dateRange?: DateRange
}

export interface ActivityLogFiltersProps {
  filters: ActivityLogFilterValues
  onFiltersChange: (filters: ActivityLogFilterValues) => void
  onClearAll: () => void
}

//
// FILTER OPTIONS
//

const USER_ROLE_OPTIONS = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'org_admin', label: 'Org Admin' },
  { value: 'shop_admin', label: 'Shop Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'staff', label: 'Staff' },
  { value: 'system', label: 'System' },
]

const ACTION_OPTIONS = [
  { value: 'CREATE', label: 'Create' },
  { value: 'UPDATE', label: 'Update' },
  { value: 'DELETE', label: 'Delete' },
  { value: 'LOGIN', label: 'Login' },
  { value: 'LOGOUT', label: 'Logout' },
]

const MODULE_OPTIONS = [
  { value: 'Shop Settings', label: 'Shop Settings' },
  { value: 'Metal Rates', label: 'Metal Rates' },
  { value: 'Invoice', label: 'Invoice' },
  { value: 'Inventory', label: 'Inventory' },
  { value: 'Customer', label: 'Customer' },
  { value: 'Product', label: 'Product' },
  { value: 'Payment', label: 'Payment' },
  { value: 'Purchase Order', label: 'Purchase Order' },
  { value: 'User', label: 'User' },
  { value: 'Expense', label: 'Expense' },
  { value: 'Order', label: 'Order' },
  { value: 'Report', label: 'Report' },
]

const STATUS_OPTIONS = [
  {
    value: 'success',
    label: 'Success',
    variant: 'active' as const,
    showDot: true,
  },
  {
    value: 'pending',
    label: 'Pending',
    variant: 'pending' as const,
    showDot: true,
  },
  {
    value: 'failed',
    label: 'Failed',
    variant: 'inactive' as const,
    showDot: true,
  },
]

//
// MAIN COMPONENT
//

export const ActivityLogFilters: React.FC<ActivityLogFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearAll,
}) => {
  const { t } = useTranslation()
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // HANDLERS

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value })
  }

  const handleUserChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, user: value })
  }

  const handleActionChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, action: value })
  }

  const handleModuleChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, module: value })
  }

  const handleStatusChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, status: value })
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    onFiltersChange({ ...filters, dateRange: range })
  }

  const handleRemoveFilter = (filterKey: keyof ActivityLogFilterValues) => {
    onFiltersChange({ ...filters, [filterKey]: undefined })
  }

  // ACTIVE FILTERS COUNT

  const activeFiltersCount = [
    filters.search,
    filters.user,
    filters.action,
    filters.module,
    filters.status,
    filters.dateRange,
  ].filter(Boolean).length

  // GET LABEL FOR ACTIVE FILTER

  const getFilterLabel = (key: string, value: string) => {
    switch (key) {
      case 'user':
        return (
          USER_ROLE_OPTIONS.find(opt => opt.value === value)?.label || value
        )
      case 'action':
        return value
      case 'module':
        return value
      case 'status':
        return STATUS_OPTIONS.find(opt => opt.value === value)?.label || value
      default:
        return value
    }
  }

  // RENDER

  return (
    <div className="space-y-4">
      {/* Search Bar & Toggle Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Search Input */}
        <SearchBar
          value={filters.search}
          onChange={handleSearchChange}
          placeholder={t('shops.activityLog.searchPlaceholder')}
          className="flex-1"
        />

        {/* Filter Toggle Button */}
        <Button
          variant="outline"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="gap-2 whitespace-nowrap"
        >
          <Filter className="h-4 w-4" />
          {t('shops.activityLog.filters')}
          {activeFiltersCount > 0 && (
            <Badge variant="accent" size="sm">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {/* Clear All Button */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            onClick={onClearAll}
            className="gap-2 whitespace-nowrap"
          >
            <X className="h-4 w-4" />
            {t('shops.activityLog.clearAll')}
          </Button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="grid grid-cols-1 gap-4 rounded-lg border border-border-primary bg-bg-secondary p-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* User Role Filter */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-text-secondary">
              {t('shops.activityLog.filterByUser')}
            </Label>
            <TypeFilter
              options={USER_ROLE_OPTIONS}
              value={filters.user}
              onChange={handleUserChange}
              placeholder={t('shops.activityLog.allUsers')}
              allOptionLabel={t('shops.activityLog.allUsers')}
              className="w-full"
            />
          </div>

          {/* Action Filter */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-text-secondary">
              {t('shops.activityLog.filterByAction')}
            </Label>
            <TypeFilter
              options={ACTION_OPTIONS}
              value={filters.action}
              onChange={handleActionChange}
              placeholder={t('shops.activityLog.allActions')}
              allOptionLabel={t('shops.activityLog.allActions')}
              className="w-full"
            />
          </div>

          {/* Module Filter */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-text-secondary">
              {t('shops.activityLog.filterByModule')}
            </Label>
            <TypeFilter
              options={MODULE_OPTIONS}
              value={filters.module}
              onChange={handleModuleChange}
              placeholder={t('shops.activityLog.allModules')}
              allOptionLabel={t('shops.activityLog.allModules')}
              className="w-full"
            />
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-text-secondary">
              {t('shops.activityLog.filterByStatus')}
            </Label>
            <StatusFilter
              options={STATUS_OPTIONS}
              value={filters.status}
              onChange={handleStatusChange}
              placeholder={t('shops.activityLog.allStatuses')}
              className="w-full"
            />
          </div>

          {/* Date Range Filter */}
          <div className="space-y-2 sm:col-span-2 lg:col-span-4">
            <Label className="text-xs font-medium text-text-secondary">
              {t('shops.activityLog.filterByDate')}
            </Label>
            <DateRangeFilter
              value={filters.dateRange}
              onChange={handleDateRangeChange}
              placeholder={t('shops.activityLog.selectDateRange')}
              className="w-full md:w-auto"
            />
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-text-secondary">
            {t('shops.activityLog.activeFilters')}:
          </span>

          {/* User Filter Badge */}
          {filters.user && (
            <Badge variant="outline" className="gap-1.5">
              <span className="text-text-tertiary">User:</span>
              {getFilterLabel('user', filters.user)}
              <button
                onClick={() => handleRemoveFilter('user')}
                className="ml-1 transition-colors hover:text-status-error"
                aria-label="Remove user filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {/* Action Filter Badge */}
          {filters.action && (
            <Badge variant="outline" className="gap-1.5">
              <span className="text-text-tertiary">Action:</span>
              {filters.action}
              <button
                onClick={() => handleRemoveFilter('action')}
                className="ml-1 transition-colors hover:text-status-error"
                aria-label="Remove action filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {/* Module Filter Badge */}
          {filters.module && (
            <Badge variant="outline" className="gap-1.5">
              <span className="text-text-tertiary">Module:</span>
              {filters.module}
              <button
                onClick={() => handleRemoveFilter('module')}
                className="ml-1 transition-colors hover:text-status-error"
                aria-label="Remove module filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {/* Status Filter Badge */}
          {filters.status && (
            <Badge variant="outline" className="gap-1.5">
              <span className="text-text-tertiary">Status:</span>
              {getFilterLabel('status', filters.status)}
              <button
                onClick={() => handleRemoveFilter('status')}
                className="ml-1 transition-colors hover:text-status-error"
                aria-label="Remove status filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {/* Date Range Filter Badge */}
          {filters.dateRange?.from && (
            <Badge variant="outline" className="gap-1.5">
              <span className="text-text-tertiary">Date:</span>
              {filters.dateRange.from.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
              })}
              {filters.dateRange.to &&
                ` - ${filters.dateRange.to.toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                })}`}
              <button
                onClick={() => handleRemoveFilter('dateRange')}
                className="ml-1 transition-colors hover:text-status-error"
                aria-label="Remove date range filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

ActivityLogFilters.displayName = 'ActivityLogFilters'
