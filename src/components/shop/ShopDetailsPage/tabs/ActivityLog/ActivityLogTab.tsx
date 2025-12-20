// ============================================================================
// FILE: src/components/features/ShopDetails/ActivityLogTab.tsx
// Activity Log Table Component - FIXED SORTING
// ============================================================================

import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DataTable } from '@/components/ui/data-display/DataTable'
import { activityLogColumns } from './ActivityLogColumns'
import { MOCK_ACTIVITY_LOGS } from '@/pages/shops/Activitylogdata'
import type { ActivityLog } from '@/pages/shops/Activitylogdata'
import { ActivityLogFilters } from './ActivityLogFilters'
import type { ActivityLogFilterValues } from './ActivityLogFilters'
import { AlertCircle } from 'lucide-react'

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ActivityLogTab: React.FC = () => {
  const { t } = useTranslation()

  // ========================================================================
  // STATE
  // ========================================================================

  const [filters, setFilters] = useState<ActivityLogFilterValues>({
    search: '',
    user: undefined,
    action: undefined,
    module: undefined,
    status: undefined,
    dateRange: undefined,
  })

  // ========================================================================
  // FILTERED DATA
  // ========================================================================

  const filteredData = useMemo(() => {
    let result = [...MOCK_ACTIVITY_LOGS]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        log =>
          log.user.name.toLowerCase().includes(searchLower) ||
          log.description.toLowerCase().includes(searchLower) ||
          log.module.toLowerCase().includes(searchLower) ||
          log.action.toLowerCase().includes(searchLower)
      )
    }

    // User filter
    if (filters.user) {
      result = result.filter(log => log.user.role === filters.user)
    }

    // Action filter
    if (filters.action) {
      result = result.filter(log => log.action === filters.action)
    }

    // Module filter
    if (filters.module) {
      result = result.filter(log => log.module === filters.module)
    }

    // Status filter
    if (filters.status) {
      result = result.filter(log => log.status === filters.status)
    }

    // Date range filter
    if (filters.dateRange?.from) {
      result = result.filter(log => {
        const logDate = new Date(log.timestamp)
        const fromDate = new Date(filters.dateRange!.from!)
        const toDate = filters.dateRange!.to
          ? new Date(filters.dateRange!.to)
          : new Date()

        // Set time to start/end of day for accurate comparison
        fromDate.setHours(0, 0, 0, 0)
        toDate.setHours(23, 59, 59, 999)

        return logDate >= fromDate && logDate <= toDate
      })
    }

    return result
  }, [filters])

  // ========================================================================
  // HANDLERS
  // ========================================================================

  const handleFiltersChange = (newFilters: ActivityLogFilterValues) => {
    setFilters(newFilters)
  }

  const handleClearAllFilters = () => {
    setFilters({
      search: '',
      user: undefined,
      action: undefined,
      module: undefined,
      status: undefined,
      dateRange: undefined,
    })
  }

  const handleViewDetails = (log: ActivityLog) => {
    console.log('View Activity Details:', log)
    // Show metadata in a formatted way
    const metadataStr = JSON.stringify(log.metadata, null, 2)
    alert(
      `Activity Details:\n\nUser: ${log.user.name}\nAction: ${log.action}\nModule: ${log.module}\n\nMetadata:\n${metadataStr}`
    )
  }

  // FIXED: Use proper type signature matching DataTable's onRowClick
  const handleRowClick = (row: ActivityLog, index: number) => {
    handleViewDetails(row)
  }

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <div className="w-full space-y-4">
      {/* Admin Info Banner */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-4">
        <div className="flex items-start gap-3">
          <div className="bg-accent/10 flex-shrink-0 rounded-full p-2">
            <AlertCircle className="h-5 w-5 text-accent" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-text-primary">
              {t('activityLog.adminOnlyTitle')}
            </h3>
            <p className="mt-1 text-sm text-text-secondary">
              {t('activityLog.adminOnlyDescription')}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <ActivityLogFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearAll={handleClearAllFilters}
      />

      {/* Results Summary */}
      {filteredData.length !== MOCK_ACTIVITY_LOGS.length && (
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span>
            Showing {filteredData.length} of {MOCK_ACTIVITY_LOGS.length}{' '}
            activities
          </span>
        </div>
      )}

      {/* DataTable - FIXED: Remove sortingState, let DataTable handle it internally */}
      <DataTable<ActivityLog>
        data={filteredData}
        columns={activityLogColumns}
        // Sorting Configuration - FIXED: Just enable it, don't pass initial state
        sorting={{
          enabled: true,
        }}
        // Pagination Configuration
        pagination={{
          enabled: true,
          pageSize: 20,
          pageSizeOptions: [10, 20, 50, 100],
          showPageSizeSelector: true,
          showPageInfo: true,
          showFirstLastButtons: true,
        }}
        // Empty State Configuration
        emptyState={{
          message: t('activityLog.noActivities'),
          icon: (
            <svg
              className="h-12 w-12 text-text-tertiary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          ),
        }}
        // Style Configuration
        style={{
          variant: 'default',
          size: 'md',
          stickyHeader: true,
          hoverEffect: true,
          zebraStripes: false,
          showBorder: true,
          rounded: true,
          shadow: true,
          fullWidth: true,
        }}
        // Row Click Handler - FIXED TYPE
        onRowClick={handleRowClick}
        // Get Row ID
        getRowId={row => row.id}
        // Test ID
        testId="activity-log-table"
        ariaLabel={t('activityLog.tableAriaLabel')}
      />
    </div>
  )
}

export default ActivityLogTab
