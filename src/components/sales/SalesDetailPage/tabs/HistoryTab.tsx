// FILE: src/components/sales/SalesDetailPage/tabs/HistoryTab.tsx
// Sales Activity History/Audit Log Tab

import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  History,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Truck,
  CreditCard,
  FileText,
  UserCheck,
  Clock,
  Calendar,
  User,
  ArrowRight,
  Package,
  Coins,
  TrendingDown,
} from 'lucide-react'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Avatar } from '@/components/ui/data-display/Avatar/Avatar'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// COMPONENT PROPS

interface HistoryTabProps {
  saleId: string
  createdAt: string
  updatedAt: string
  // In real app, you'll get this from API:
  // activities?: ActivityLog[]
}

// TYPES

interface ActivityLog {
  _id: string
  action: string
  actionType:
    | 'create'
    | 'update'
    | 'delete'
    | 'status_change'
    | 'payment'
    | 'approval'
  performedBy: {
    _id: string
    name: string
    email: string
    avatar?: string
  }
  timestamp: string
  changes?: {
    field: string
    oldValue: any
    newValue: any
  }[]
  metadata?: {
    amount?: number
    status?: string
    reason?: string
    paymentMode?: string
  }
}

//
// DUMMY DATA (Replace with API call)
//

const dummyActivities: ActivityLog[] = [
  {
    _id: '1',
    action: 'Sale created',
    actionType: 'create',
    performedBy: {
      _id: 'user1',
      name: 'Rajesh Kumar',
      email: 'rajesh@shop.com',
    },
    timestamp: '2024-12-20T10:30:00.000Z',
    metadata: {
      amount: 176491,
    },
  },
  {
    _id: '2',
    action: 'Payment added',
    actionType: 'payment',
    performedBy: {
      _id: 'user1',
      name: 'Rajesh Kumar',
      email: 'rajesh@shop.com',
    },
    timestamp: '2024-12-20T10:32:00.000Z',
    metadata: {
      amount: 176491,
      paymentMode: 'card',
    },
  },
  {
    _id: '3',
    action: 'Status changed',
    actionType: 'status_change',
    performedBy: {
      _id: 'user1',
      name: 'Rajesh Kumar',
      email: 'rajesh@shop.com',
    },
    timestamp: '2024-12-20T10:35:00.000Z',
    changes: [
      {
        field: 'status',
        oldValue: 'pending',
        newValue: 'confirmed',
      },
    ],
  },
  {
    _id: '4',
    action: 'Sale delivered',
    actionType: 'status_change',
    performedBy: {
      _id: 'user2',
      name: 'Priya Sharma',
      email: 'priya@shop.com',
    },
    timestamp: '2024-12-20T10:45:00.000Z',
    changes: [
      {
        field: 'status',
        oldValue: 'confirmed',
        newValue: 'delivered',
      },
    ],
  },
  {
    _id: '5',
    action: 'Sale completed',
    actionType: 'status_change',
    performedBy: {
      _id: 'user1',
      name: 'Rajesh Kumar',
      email: 'rajesh@shop.com',
    },
    timestamp: '2024-12-20T11:00:00.000Z',
    changes: [
      {
        field: 'status',
        oldValue: 'delivered',
        newValue: 'completed',
      },
    ],
  },
]

//
// ACTIVITY ICON COMPONENT
//

const getActivityIcon = (actionType: string) => {
  switch (actionType) {
    case 'create':
      return <Plus className="h-5 w-5" />
    case 'update':
      return <Edit className="h-5 w-5" />
    case 'delete':
      return <Trash2 className="h-5 w-5" />
    case 'status_change':
      return <ArrowRight className="h-5 w-5" />
    case 'payment':
      return <CreditCard className="h-5 w-5" />
    case 'approval':
      return <UserCheck className="h-5 w-5" />
    default:
      return <History className="h-5 w-5" />
  }
}

const getActivityColor = (actionType: string) => {
  switch (actionType) {
    case 'create':
      return 'bg-status-success/10 text-status-success'
    case 'update':
      return 'bg-status-info/10 text-status-info'
    case 'delete':
      return 'bg-status-error/10 text-status-error'
    case 'status_change':
      return 'bg-accent/10 text-accent'
    case 'payment':
      return 'bg-status-success/10 text-status-success'
    case 'approval':
      return 'bg-status-info/10 text-status-info'
    default:
      return 'bg-bg-tertiary text-text-secondary'
  }
}

//
// ACTIVITY ITEM COMPONENT
//

const ActivityItem: React.FC<{
  activity: ActivityLog
  isLast: boolean
}> = ({ activity, isLast }) => {
  const { t } = useTranslation()

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return t('time.justNow')
    if (diffMins < 60) return t('time.minutesAgo', { count: diffMins })
    if (diffHours < 24) return t('time.hoursAgo', { count: diffHours })
    if (diffDays < 7) return t('time.daysAgo', { count: diffDays })

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="relative flex gap-4 pb-8">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-6 top-12 h-full w-0.5 bg-border-secondary" />
      )}

      {/* Icon */}
      <div
        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${getActivityColor(activity.actionType)}`}
      >
        {getActivityIcon(activity.actionType)}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-4">
          {/* Activity Details */}
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-text-primary">
              {activity.action}
            </h4>

            {/* User Info */}
            <div className="mt-1 flex items-center gap-2">
              <Avatar
                name={activity.performedBy.name}
                src={activity.performedBy.avatar}
                size="xs"
              />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-text-secondary">
                  {activity.performedBy.name}
                </span>
                <span className="text-xs text-text-tertiary">
                  {activity.performedBy.email}
                </span>
              </div>
            </div>
          </div>

          {/* Timestamp */}
          <div className="flex flex-col items-end">
            <span className="flex items-center gap-1 text-xs text-text-tertiary">
              <Clock className="h-3 w-3" />
              {formatDate(activity.timestamp)}
            </span>
            <Badge variant="outline" size="sm" className="mt-1">
              {t(`sales.activityType.${activity.actionType}`)}
            </Badge>
          </div>
        </div>

        {/* Changes */}
        {activity.changes && activity.changes.length > 0 && (
          <div className="mt-3 rounded-md border border-border-secondary bg-bg-tertiary p-3">
            <Label className="mb-2 text-xs text-text-tertiary">
              {t('sales.history.changes')}
            </Label>
            <div className="space-y-2">
              {activity.changes.map((change, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="capitalize text-text-secondary">
                    {change.field}:
                  </span>
                  <Badge variant="outline" size="sm">
                    {String(change.oldValue)}
                  </Badge>
                  <ArrowRight className="h-3 w-3 text-text-tertiary" />
                  <Badge variant="default" size="sm">
                    {String(change.newValue)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        {activity.metadata && (
          <div className="mt-3 flex flex-wrap gap-4 text-xs">
            {activity.metadata.amount && (
              <div className="flex items-center gap-1 text-text-secondary">
                <span className="text-text-tertiary">
                  {t('sales.history.amount')}:
                </span>
                <span className="font-semibold text-accent">
                  {formatCurrency(activity.metadata.amount)}
                </span>
              </div>
            )}
            {activity.metadata.paymentMode && (
              <div className="flex items-center gap-1 text-text-secondary">
                <span className="text-text-tertiary">
                  {t('sales.history.paymentMode')}:
                </span>
                <span className="font-medium">
                  {t(`sales.paymentMode.${activity.metadata.paymentMode}`)}
                </span>
              </div>
            )}
            {activity.metadata.reason && (
              <div className="flex items-center gap-1 text-text-secondary">
                <span className="text-text-tertiary">
                  {t('sales.history.reason')}:
                </span>
                <span className="italic">{activity.metadata.reason}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

//
// MAIN COMPONENT
//

const HistoryTab: React.FC<HistoryTabProps> = ({
  saleId,
  createdAt,
  updatedAt,
}) => {
  const { t } = useTranslation()
  const [filterType, setFilterType] = React.useState<string>('all')

  // In real app, fetch from API:
  // const { data: activities, isLoading } = useGetSaleActivitiesQuery(saleId)

  // For now, use dummy data
  const activities = dummyActivities

  // Filter activities
  const filteredActivities = useMemo(() => {
    if (filterType === 'all') return activities

    return activities.filter(activity => activity.actionType === filterType)
  }, [activities, filterType])

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            {t('sales.history.activityLog')}
          </h3>
          <p className="text-sm text-text-tertiary">
            {t('sales.history.trackAllChanges')}
          </p>
        </div>

        {/* Filter */}
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t('sales.history.allActivities')}
            </SelectItem>
            <SelectItem value="create">
              {t('sales.activityType.create')}
            </SelectItem>
            <SelectItem value="update">
              {t('sales.activityType.update')}
            </SelectItem>
            <SelectItem value="status_change">
              {t('sales.activityType.status_change')}
            </SelectItem>
            <SelectItem value="payment">
              {t('sales.activityType.payment')}
            </SelectItem>
            <SelectItem value="approval">
              {t('sales.activityType.approval')}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sale Info Card */}
      <div className="rounded-lg border border-border-secondary bg-bg-secondary p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <Label className="flex items-center gap-2 text-xs text-text-tertiary">
              <Calendar className="h-3 w-3" />
              {t('sales.history.createdAt')}
            </Label>
            <p className="mt-1 text-sm font-medium text-text-primary">
              {formatDate(createdAt)}
            </p>
          </div>

          <div>
            <Label className="flex items-center gap-2 text-xs text-text-tertiary">
              <Clock className="h-3 w-3" />
              {t('sales.history.lastUpdated')}
            </Label>
            <p className="mt-1 text-sm font-medium text-text-primary">
              {formatDate(updatedAt)}
            </p>
          </div>

          <div>
            <Label className="flex items-center gap-2 text-xs text-text-tertiary">
              <History className="h-3 w-3" />
              {t('sales.history.totalActivities')}
            </Label>
            <p className="mt-1 text-sm font-medium text-text-primary">
              {filteredActivities.length} {t('sales.history.activities')}
            </p>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="rounded-lg border border-border-secondary bg-bg-secondary p-6">
        {filteredActivities.length > 0 ? (
          <div className="space-y-0">
            {filteredActivities.map((activity, index) => (
              <ActivityItem
                key={activity._id}
                activity={activity}
                isLast={index === filteredActivities.length - 1}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <History className="mb-3 h-12 w-12 text-text-tertiary" />
            <p className="text-sm text-text-secondary">
              {t('sales.history.noActivities')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryTab
