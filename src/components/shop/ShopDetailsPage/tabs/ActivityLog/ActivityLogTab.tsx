//
// FILE: src/components/shop/ShopDetailsPages/tabs/ActivityLogTab.tsx
//

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DataTable } from '@/components/ui/data-display/DataTable'
import { useShopActivityLogs } from '@/hooks/shop/useShopActivityLogs'
import type { ActivityLog } from '@/types/shop.types'
import { activityLogColumns } from './ActivityLogColumns'
import { ActivityLogFilters } from './ActivityLogFilters'
import type { ActivityLogFilterValues } from './ActivityLogFilters'
import { AlertCircle } from 'lucide-react'

interface ActivityLogTabProps {
  shopId?: string
}

const ActivityLogTab: React.FC<ActivityLogTabProps> = ({ shopId }) => {
  const { t } = useTranslation()

  const [filters, setFilters] = useState<ActivityLogFilterValues>({
    search: '',
    user: undefined,
    action: undefined,
    module: undefined,
    status: undefined,
    dateRange: undefined,
  })

  const {
    logs,
    pagination,
    isLoading,
    updateFilters,
    setPage,
    resetFilters,
  } = useShopActivityLogs(shopId ?? '')

  const handleFiltersChange = (newFilters: ActivityLogFilterValues) => {
    setFilters(newFilters)
    updateFilters({
      search: newFilters.search || undefined,
      action: newFilters.action,
      module: newFilters.module,
      status: newFilters.status,
      startDate: newFilters.dateRange?.from?.toISOString(),
      endDate: newFilters.dateRange?.to?.toISOString(),
    })
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
    resetFilters()
  }

  const handleRowClick = (row: ActivityLog) => {
    const metadataStr = JSON.stringify(row.metadata, null, 2)
    const user = row.userId
    const name = user ? `${user.firstName} ${user.lastName}` : 'System'
    alert(
      `Activity Details:\n\nUser: ${name}\nAction: ${row.action}\nModule: ${row.module}\n\nMetadata:\n${metadataStr}`
    )
  }

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
              {t('shops.activityLog.adminOnlyTitle')}
            </h3>
            <p className="mt-1 text-sm text-text-secondary">
              {t('shops.activityLog.adminOnlyDescription')}
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
      {pagination && (
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span>
            {t('shops.activityLog.showing', {
              count: logs.length,
              total: pagination.totalDocs,
            })}
          </span>
        </div>
      )}

      {/* DataTable */}
      <DataTable<ActivityLog>
        data={logs}
        columns={activityLogColumns}
        sorting={{ enabled: true }}
        pagination={{
  enabled: true,
  pageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
  showPageSizeSelector: true,
  showPageInfo: true,
  showFirstLastButtons: true,
  totalItems: pagination?.totalDocs,
}}

        loading={{
          isLoading,
          loadingRows: 10,
        }}
        emptyState={{
          message: t('shops.activityLog.noActivities'),
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
        onRowClick={handleRowClick}
        getRowId={row => row._id}
        testId="activity-log-table"
        ariaLabel={t('shops.activityLog.tableAriaLabel')}
      />
    </div>
  )
}

export default ActivityLogTab