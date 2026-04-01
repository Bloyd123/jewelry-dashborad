import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Clock,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
} from 'lucide-react'
import { DataTable } from '@/components/ui/data-display/DataTable/DataTable'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/ui/SearchBar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { DataTableColumn } from '@/components/ui/data-display/DataTable/DataTable.types'
import { useSupplierActivity } from '@/hooks/supplier/useSupplierActivity'
import { useAuth } from '@/hooks/auth'
import type { Supplier } from '@/types/supplier.types'

// ─── TYPES ───────────────────────────────────────────────────────────────────

type ActivityStatus = 'success' | 'failed' | 'pending' | 'cancelled'
type ActivityDisplayStatus = 'Success' | 'Failed' | 'Pending'

interface ActivityLogItem {
  _id: string
  createdAt: string
  action: string
  description: string
  status: ActivityStatus
  userId?: {
    firstName: string
    lastName?: string
    email?: string
  }
}

interface SupplierActivityTabProps {
  supplier: Supplier
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const getDisplayStatus = (status: ActivityStatus): ActivityDisplayStatus => {
  switch (status) {
    case 'success':   return 'Success'
    case 'failed':    return 'Failed'
    case 'pending':   return 'Pending'
    case 'cancelled': return 'Failed'
    default:          return 'Success'
  }
}

const getDateRange = (timeFilter: string): { startDate?: string; endDate?: string } => {
  const now = new Date()
  const endDate = now.toISOString()

  switch (timeFilter) {
    case '7days': {
      const start = new Date()
      start.setDate(start.getDate() - 7)
      return { startDate: start.toISOString(), endDate }
    }
    case '30days': {
      const start = new Date()
      start.setDate(start.getDate() - 30)
      return { startDate: start.toISOString(), endDate }
    }
    case '90days': {
      const start = new Date()
      start.setDate(start.getDate() - 90)
      return { startDate: start.toISOString(), endDate }
    }
    case 'all':
    default:
      return {}
  }
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

const SupplierActivityTab: React.FC<SupplierActivityTabProps> = ({ supplier }) => {
  const { t } = useTranslation()
  const { currentShopId } = useAuth()
  const shopId = currentShopId!

  // ── Filters State ────────────────────────────────────────────────────────
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [timeFilter, setTimeFilter]     = useState<string>('30days')
  const [searchQuery, setSearchQuery]   = useState<string>('')
  const [page, setPage]                 = useState(1)
  const limit = 20

  // ── Date Range from Time Filter ──────────────────────────────────────────
  const { startDate, endDate } = getDateRange(timeFilter)

  // ── Real API ─────────────────────────────────────────────────────────────
  const { logs, pagination, isLoading } = useSupplierActivity(
    shopId,
    supplier._id,
    { page, limit, startDate, endDate }
  )

  // ── Formatters ───────────────────────────────────────────────────────────
  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getUserName = (userId?: ActivityLogItem['userId']): string => {
    if (!userId) return 'System'
    return `${userId.firstName} ${userId.lastName || ''}`.trim()
  }

  // ── Status Display ───────────────────────────────────────────────────────
  const getStatusDisplay = (status: ActivityDisplayStatus) => {
    const statusConfig = {
      Success: {
        icon: CheckCircle,
        color: 'text-status-success',
        bg:    'bg-status-success/10',
      },
      Failed: {
        icon: XCircle,
        color: 'text-status-error',
        bg:    'bg-status-error/10',
      },
      Pending: {
        icon: AlertCircle,
        color: 'text-status-warning',
        bg:    'bg-status-warning/10',
      },
    }
    return statusConfig[status]
  }

  // ── Client-side Filter (search + action) ────────────────────────────────
  const filteredLogs = (logs as ActivityLogItem[]).filter(log => {
    if (actionFilter !== 'all' && log.action !== actionFilter) return false

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        log.action.toLowerCase().includes(query) ||
        log.description.toLowerCase().includes(query) ||
        getUserName(log.userId).toLowerCase().includes(query)
      )
    }
    return true
  })

  // ── Options ──────────────────────────────────────────────────────────────
  const actionOptions = [
    { value: 'all',            label: t('suppliers.activity.filters.allActions') },
    { value: 'create',         label: 'Create' },
    { value: 'update',         label: 'Update' },
    { value: 'delete',         label: 'Delete' },
    { value: 'blacklist',      label: 'Blacklist' },
    { value: 'update-rating',  label: 'Rating Update' },
    { value: 'update-balance', label: 'Balance Adjustment' },
  ]

  const timeOptions = [
    { value: '7days',  label: t('suppliers.activity.filters.last7Days') },
    { value: '30days', label: t('suppliers.activity.filters.last30Days') },
    { value: '90days', label: t('suppliers.activity.filters.last90Days') },
    { value: 'all',    label: t('suppliers.activity.filters.allTime') },
  ]

  // ── Table Columns ────────────────────────────────────────────────────────
  const activityColumns: DataTableColumn<ActivityLogItem>[] = [
    {
      id: 'dateTime',
      header: 'suppliers.activity.table.dateTime',
      accessorKey: 'createdAt',
      cell: ({ value }) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-text-tertiary" />
          <span className="text-sm text-text-primary">{formatDateTime(value)}</span>
        </div>
      ),
      sortable: true,
      width: 180,
    },
    {
      id: 'action',
      header: 'suppliers.activity.table.action',
      accessorKey: 'action',
      cell: ({ value }) => (
        <span className="bg-accent/10 inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize text-accent">
          {value}
        </span>
      ),
      sortable: true,
      width: 150,
    },
    {
      id: 'details',
      header: 'suppliers.activity.table.details',
      accessorKey: 'description',
      cell: ({ value }) => (
        <span className="text-sm text-text-secondary">{value || '-'}</span>
      ),
    },
    {
      id: 'user',
      header: 'suppliers.activity.table.user',
      accessorKey: 'userId',
      cell: ({ value }) => (
        <span className="text-sm font-medium text-text-primary">
          {getUserName(value)}
        </span>
      ),
      sortable: false,
      width: 140,
    },
    {
      id: 'status',
      header: 'suppliers.activity.table.status',
      accessorKey: 'status',
      cell: ({ value }) => {
        const displayStatus = getDisplayStatus(value as ActivityStatus)
        const config = getStatusDisplay(displayStatus)
        const Icon = config.icon
        return (
          <div className="flex items-center justify-center">
            <div className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${config.bg}`}>
              <Icon className={`h-3 w-3 ${config.color}`} />
              <span className={`text-xs font-medium ${config.color}`}>
                {displayStatus}
              </span>
            </div>
          </div>
        )
      },
      sortable: true,
      align: 'center',
      width: 120,
    },
  ]

  // ── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Filters Section */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

            {/* Action Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-text-tertiary" />
              <span className="text-sm text-text-secondary">
                {t('suppliers.activity.filters.label')}:
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-[180px] justify-between">
                    <span>{actionOptions.find(o => o.value === actionFilter)?.label}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[180px]">
                  {actionOptions.map(option => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => {
                        setActionFilter(option.value)
                        setPage(1)
                      }}
                      className={actionFilter === option.value ? 'bg-bg-tertiary' : ''}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Time Period Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-text-tertiary" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-[150px] justify-between">
                    <span>{timeOptions.find(o => o.value === timeFilter)?.label}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[150px]">
                  {timeOptions.map(option => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => {
                        setTimeFilter(option.value)
                        setPage(1)
                      }}
                      className={timeFilter === option.value ? 'bg-bg-tertiary' : ''}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Search */}
          <div className="w-full sm:w-64">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t('suppliers.activity.searchPlaceholder')}
              debounceMs={300}
            />
          </div>
        </div>

        {/* Active Filters Info */}
        {(actionFilter !== 'all' || searchQuery) && (
          <div className="mt-3 flex items-center gap-2 text-xs text-text-secondary">
            <span>{t('suppliers.activity.showingResults')}:</span>
            <span className="font-medium text-text-primary">
              {filteredLogs.length} {t('suppliers.activity.activities')}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setActionFilter('all')
                setSearchQuery('')
                setPage(1)
              }}
              className="h-6 px-2 text-xs"
            >
              {t('suppliers.activity.clearFilters')}
            </Button>
          </div>
        )}
      </div>

      {/* Activity Table */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary">
        <div className="border-b border-border-primary px-6 py-4">
          <h3 className="text-lg font-semibold text-text-primary">
            {t('suppliers.activity.activityTable')}
          </h3>
        </div>

        <DataTable
          data={filteredLogs}
          columns={activityColumns}
          loading={{ isLoading }}
          pagination={{
  enabled: true,
  pageIndex: page - 1, // DataTable uses 0-based index
  pageSize: limit,
  totalItems: pagination?.total ?? 0,
  pageSizeOptions: [10, 20, 50],
  showPageInfo: true,
  showFirstLastButtons: true,
  onPaginationChange: ({ pageIndex }) => {
    setPage(pageIndex + 1) // convert back to 1-based
  },
}}
          sorting={{
            enabled: true,
            sortingState: [{ columnId: 'dateTime', direction: 'desc' }],
          }}
          style={{ hoverEffect: true, zebraStripes: false }}
          emptyState={{ message: t('suppliers.activity.noActivities') }}
        />
      </div>
    </div>
  )
}

export default SupplierActivityTab