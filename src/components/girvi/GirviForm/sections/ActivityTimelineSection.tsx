// FILE: src/components/girvi/GirviForm/sections/ActivityTimelineSection.tsx

import { useTranslation } from 'react-i18next'
import {
  Clock,
  CheckCircle,
  Unlock,
  DollarSign,
  TrendingUp,
  ArrowRightLeft,
  Trash2,
  Edit,
  AlertCircle,
  Plus,
  Tag,
} from 'lucide-react'


export type GirviActivityType =
  | 'girvi_created'
  | 'girvi_updated'
  | 'girvi_released'
  | 'girvi_deleted'
  | 'payment_added'
  | 'payment_deleted'
  | 'interest_calculated'
  | 'transferred'
  | 'transfer_returned'
  | 'status_changed'
  | 'overdue_marked'
  | 'discount_given'

export interface GirviActivity {
  type:       GirviActivityType
  timestamp:  string
  user:       string
  details?:   string
  metadata?:  Record<string, any>
}

interface ActivityTimelineSectionProps {
  activities?:   GirviActivity[]
  isLoading?:    boolean
  emptyMessage?: string
}

const ICON_MAP: Record<GirviActivityType, React.ReactNode> = {
  girvi_created:       <Plus            className="h-4 w-4" />,
  girvi_updated:       <Edit            className="h-4 w-4" />,
  girvi_released:      <Unlock          className="h-4 w-4" />,
  girvi_deleted:       <Trash2          className="h-4 w-4" />,
  payment_added:       <DollarSign      className="h-4 w-4" />,
  payment_deleted:     <Trash2          className="h-4 w-4" />,
  interest_calculated: <TrendingUp      className="h-4 w-4" />,
  transferred:         <ArrowRightLeft  className="h-4 w-4" />,
  transfer_returned:   <ArrowRightLeft  className="h-4 w-4" />,
  status_changed:      <Clock           className="h-4 w-4" />,
  overdue_marked:      <AlertCircle     className="h-4 w-4" />,
  discount_given:      <Tag             className="h-4 w-4" />,
}

const COLOR_MAP: Record<GirviActivityType, string> = {
  girvi_created:       'bg-status-success/10 text-status-success',
  girvi_updated:       'bg-accent/10 text-accent',
  girvi_released:      'bg-status-success/10 text-status-success',
  girvi_deleted:       'bg-status-error/10 text-status-error',
  payment_added:       'bg-status-info/10 text-status-info',
  payment_deleted:     'bg-status-error/10 text-status-error',
  interest_calculated: 'bg-accent/10 text-accent',
  transferred:         'bg-status-warning/10 text-status-warning',
  transfer_returned:   'bg-status-info/10 text-status-info',
  status_changed:      'bg-bg-tertiary text-text-secondary',
  overdue_marked:      'bg-status-error/10 text-status-error',
  discount_given:      'bg-status-warning/10 text-status-warning',
}

const LABEL_KEY_MAP: Record<GirviActivityType, string> = {
  girvi_created:       'girvi.activity.created',
  girvi_updated:       'girvi.activity.updated',
  girvi_released:      'girvi.activity.released',
  girvi_deleted:       'girvi.activity.deleted',
  payment_added:       'girvi.activity.paymentAdded',
  payment_deleted:     'girvi.activity.paymentDeleted',
  interest_calculated: 'girvi.activity.interestCalculated',
  transferred:         'girvi.activity.transferred',
  transfer_returned:   'girvi.activity.transferReturned',
  status_changed:      'girvi.activity.statusChanged',
  overdue_marked:      'girvi.activity.overdueMarked',
  discount_given:      'girvi.activity.discountGiven',
}

const formatDateTime = (timestamp: string): string =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  }).format(new Date(timestamp))

const formatRelativeTime = (timestamp: string): string => {
  const diffMs    = Date.now() - new Date(timestamp).getTime()
  const diffMins  = Math.floor(diffMs / 60_000)
  const diffHours = Math.floor(diffMs / 3_600_000)
  const diffDays  = Math.floor(diffMs / 86_400_000)

  if (diffMins  <  1) return 'Just now'
  if (diffMins  < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays  <  7) return `${diffDays}d ago`
  return formatDateTime(timestamp)
}

const Skeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="flex animate-pulse gap-4">
        <div className="flex flex-col items-center">
          <div className="h-9 w-9 rounded-full bg-bg-tertiary" />
          {i < 3 && <div className="mt-2 h-8 w-0.5 bg-bg-tertiary" />}
        </div>
        <div className="flex-1 space-y-2 pb-4">
          <div className="h-4 w-52 rounded bg-bg-tertiary" />
          <div className="h-3 w-32 rounded bg-bg-tertiary" />
        </div>
      </div>
    ))}
  </div>
)

export const ActivityTimelineSection = ({
  activities   = [],
  isLoading    = false,
  emptyMessage,
}: ActivityTimelineSectionProps) => {
  const { t } = useTranslation()

  if (isLoading) return <Skeleton />

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-bg-tertiary">
          <Clock className="h-6 w-6 text-text-tertiary" />
        </div>
        <p className="text-sm text-text-tertiary">
          {emptyMessage || t('girvi.noActivityYet')}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {activities.map((activity, index) => {
        const isLast   = index === activities.length - 1
        const colorCls = COLOR_MAP[activity.type]
        const labelKey = LABEL_KEY_MAP[activity.type]

        return (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${colorCls}`}>
                {ICON_MAP[activity.type]}
              </div>
              {!isLast && (
                <div className="mt-1 h-full min-h-[20px] w-0.5 bg-border-primary" />
              )}
            </div>

            <div className={`flex-1 ${!isLast ? 'pb-5' : 'pb-1'}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <p className="text-sm font-medium text-text-primary">
                  {t(labelKey)}
                  {activity.user && (
                    <span className="font-normal text-text-secondary">
                      {' '}{t('common.by')}{' '}
                      <span className="font-medium text-text-primary">{activity.user}</span>
                    </span>
                  )}
                </p>
                <time
                  dateTime={activity.timestamp}
                  title={formatDateTime(activity.timestamp)}
                  className="flex-shrink-0 text-xs text-text-tertiary"
                >
                  {formatRelativeTime(activity.timestamp)}
                </time>
              </div>

              {activity.details && (
                <p className="mt-0.5 text-sm text-text-secondary">
                  {activity.details}
                </p>
              )}

              {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {Object.entries(activity.metadata).map(([key, value]) =>
                    value !== undefined && value !== null && value !== '' ? (
                      <span
                        key={key}
                        className="inline-flex items-center rounded-full bg-bg-tertiary px-2.5 py-0.5 text-xs text-text-secondary"
                      >
                        <span className="mr-1 font-medium text-text-tertiary">{key}:</span>
                        {String(value)}
                      </span>
                    ) : null
                  )}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}