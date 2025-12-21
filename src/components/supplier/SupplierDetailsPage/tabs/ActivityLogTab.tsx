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
// import { dummySupplier } from '@/data/supplier/supplier.dummy'

// ============================================================================
// ACTIVITY LOG TYPES
// ============================================================================

type ActivityAction =
  | 'Payment'
  | 'Purchase'
  | 'Rating Update'
  | 'Document Add'
  | 'Document Delete'
  | 'Certification Add'
  | 'Certification Update'
  | 'Supplier Created'
  | 'Supplier Updated'
  | 'Status Changed'
  | 'Verification'
  | 'Balance Adjustment'

type ActivityStatus = 'Success' | 'Failed' | 'Pending'

interface ActivityLog {
  _id: string
  dateTime: string
  action: ActivityAction
  details: string
  user: string
  status: ActivityStatus
}

// ============================================================================
// DUMMY ACTIVITY LOG DATA
// ============================================================================

const dummyActivityLogs: ActivityLog[] = [
  {
    _id: 'act_001',
    dateTime: '2024-12-15T10:30:00Z',
    action: 'Payment',
    details: '₹2,00,000 paid',
    user: 'Amit Kumar',
    status: 'Success',
  },
  {
    _id: 'act_002',
    dateTime: '2024-12-10T09:15:00Z',
    action: 'Purchase',
    details: 'Order PO-1234',
    user: 'Rajesh Singh',
    status: 'Success',
  },
  {
    _id: 'act_003',
    dateTime: '2024-12-05T11:45:00Z',
    action: 'Rating Update',
    details: 'Quality: 5/5',
    user: 'Manager',
    status: 'Success',
  },
  {
    _id: 'act_004',
    dateTime: '2024-12-01T02:30:00Z',
    action: 'Document Add',
    details: 'GST Certificate',
    user: 'Admin',
    status: 'Success',
  },
  {
    _id: 'act_005',
    dateTime: '2024-11-28T14:20:00Z',
    action: 'Certification Add',
    details: 'BIS Certificate - BIS-2023-001',
    user: 'Admin',
    status: 'Success',
  },
  {
    _id: 'act_006',
    dateTime: '2024-11-25T16:00:00Z',
    action: 'Supplier Updated',
    details: 'Contact information updated',
    user: 'Manager',
    status: 'Success',
  },
  {
    _id: 'act_007',
    dateTime: '2024-11-20T10:15:00Z',
    action: 'Balance Adjustment',
    details: 'Credit limit increased to ₹50,00,000',
    user: 'Admin',
    status: 'Success',
  },
  {
    _id: 'act_008',
    dateTime: '2024-11-15T13:30:00Z',
    action: 'Purchase',
    details: 'Order PO-1205',
    user: 'Rajesh Singh',
    status: 'Success',
  },
  {
    _id: 'act_009',
    dateTime: '2024-11-10T09:45:00Z',
    action: 'Payment',
    details: '₹5,00,000 paid',
    user: 'Amit Kumar',
    status: 'Success',
  },
  {
    _id: 'act_010',
    dateTime: '2024-11-05T11:00:00Z',
    action: 'Rating Update',
    details: 'Delivery: 4/5',
    user: 'Manager',
    status: 'Success',
  },
  {
    _id: 'act_011',
    dateTime: '2024-11-01T08:30:00Z',
    action: 'Status Changed',
    details: 'Set as Preferred Supplier',
    user: 'Admin',
    status: 'Success',
  },
  {
    _id: 'act_012',
    dateTime: '2024-10-28T15:20:00Z',
    action: 'Verification',
    details: 'Supplier verified',
    user: 'Admin',
    status: 'Success',
  },
  {
    _id: 'act_013',
    dateTime: '2024-10-25T10:00:00Z',
    action: 'Document Add',
    details: 'PAN Card',
    user: 'Admin',
    status: 'Success',
  },
  {
    _id: 'act_014',
    dateTime: '2024-10-20T14:15:00Z',
    action: 'Purchase',
    details: 'Order PO-1156',
    user: 'Rajesh Singh',
    status: 'Failed',
  },
  {
    _id: 'act_015',
    dateTime: '2024-10-15T09:30:00Z',
    action: 'Supplier Updated',
    details: 'Bank details updated',
    user: 'Manager',
    status: 'Success',
  },
]

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const SupplierActivityTab: React.FC = () => {
  const { t } = useTranslation()
  const [activities] = useState<ActivityLog[]>(dummyActivityLogs)
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [timeFilter, setTimeFilter] = useState<string>('30days')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Format date and time
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Get status icon and color
  const getStatusDisplay = (status: ActivityStatus) => {
    const statusConfig = {
      Success: {
        icon: CheckCircle,
        color: 'text-status-success',
        bg: 'bg-status-success/10',
      },
      Failed: {
        icon: XCircle,
        color: 'text-status-error',
        bg: 'bg-status-error/10',
      },
      Pending: {
        icon: AlertCircle,
        color: 'text-status-warning',
        bg: 'bg-status-warning/10',
      },
    }
    return statusConfig[status]
  }

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    // Action filter
    if (actionFilter !== 'all' && activity.action !== actionFilter) {
      return false
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        activity.action.toLowerCase().includes(query) ||
        activity.details.toLowerCase().includes(query) ||
        activity.user.toLowerCase().includes(query)
      )
    }

    return true
  })

  // Activity columns
  const activityColumns: DataTableColumn<ActivityLog>[] = [
    {
      id: 'dateTime',
      header: 'suppliers.activity.table.dateTime',
      accessorKey: 'dateTime',
      cell: ({ value }) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-text-tertiary" />
          <span className="text-sm text-text-primary">
            {formatDateTime(value)}
          </span>
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
        <span className="bg-accent/10 inline-flex rounded-full px-3 py-1 text-xs font-medium text-accent">
          {value}
        </span>
      ),
      sortable: true,
      width: 150,
    },
    {
      id: 'details',
      header: 'suppliers.activity.table.details',
      accessorKey: 'details',
      cell: ({ value }) => (
        <span className="text-sm text-text-secondary">{value}</span>
      ),
    },
    {
      id: 'user',
      header: 'suppliers.activity.table.user',
      accessorKey: 'user',
      cell: ({ value }) => (
        <span className="text-sm font-medium text-text-primary">{value}</span>
      ),
      sortable: true,
      width: 120,
    },
    {
      id: 'status',
      header: 'suppliers.activity.table.status',
      accessorKey: 'status',
      cell: ({ value }) => {
        const config = getStatusDisplay(value as ActivityStatus)
        const Icon = config.icon
        return (
          <div className="flex items-center justify-center">
            <div
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${config.bg}`}
            >
              <Icon className={`h-3 w-3 ${config.color}`} />
              <span className={`text-xs font-medium ${config.color}`}>
                {value}
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

  // Action options for filter
  const actionOptions: { value: string; label: string }[] = [
    { value: 'all', label: t('suppliers.activity.filters.allActions') },
    { value: 'Payment', label: 'Payment' },
    { value: 'Purchase', label: 'Purchase' },
    { value: 'Rating Update', label: 'Rating Update' },
    { value: 'Document Add', label: 'Document Add' },
    { value: 'Certification Add', label: 'Certification Add' },
    { value: 'Supplier Updated', label: 'Supplier Updated' },
    { value: 'Status Changed', label: 'Status Changed' },
    { value: 'Balance Adjustment', label: 'Balance Adjustment' },
  ]

  // Time period options
  const timeOptions: { value: string; label: string }[] = [
    { value: '7days', label: t('suppliers.activity.filters.last7Days') },
    { value: '30days', label: t('suppliers.activity.filters.last30Days') },
    { value: '90days', label: t('suppliers.activity.filters.last90Days') },
    { value: 'all', label: t('suppliers.activity.filters.allTime') },
  ]

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
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-[180px] justify-between"
                  >
                    <span>
                      {actionOptions.find(o => o.value === actionFilter)?.label}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[180px]">
                  {actionOptions.map(option => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setActionFilter(option.value)}
                      className={
                        actionFilter === option.value ? 'bg-bg-tertiary' : ''
                      }
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
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-[150px] justify-between"
                  >
                    <span>
                      {timeOptions.find(o => o.value === timeFilter)?.label}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[150px]">
                  {timeOptions.map(option => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setTimeFilter(option.value)}
                      className={
                        timeFilter === option.value ? 'bg-bg-tertiary' : ''
                      }
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
              {filteredActivities.length} {t('suppliers.activity.activities')}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setActionFilter('all')
                setSearchQuery('')
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
          data={filteredActivities}
          columns={activityColumns}
          pagination={{
            enabled: true,
            pageSize: 10,
            pageSizeOptions: [10, 20, 50],
            showPageInfo: true,
            showFirstLastButtons: true,
          }}
          sorting={{
            enabled: true,
            sortingState: [{ columnId: 'dateTime', direction: 'desc' }],
          }}
          style={{
            hoverEffect: true,
            zebraStripes: false,
          }}
          emptyState={{
            message: t('suppliers.activity.noActivities'),
          }}
        />
      </div>

      {/* API Note */}
      <div className="rounded-lg border border-border-secondary bg-bg-tertiary px-4 py-3">
        <p className="text-xs text-text-tertiary">
          <span className="font-medium">API:</span>{' '}
          {t('suppliers.activity.apiNote')}
        </p>
      </div>
    </div>
  )
}

export default SupplierActivityTab
