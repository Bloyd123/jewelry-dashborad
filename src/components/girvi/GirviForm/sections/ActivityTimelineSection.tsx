// FILE: src/components/shared/sections/ActivityTimelineSection.tsx
// Reusable Activity Timeline Section
// Used in: PaymentForm (view/edit), GirviForm (view/edit), and any future module

import { useTranslation } from 'react-i18next'
import {
  Clock,
  CheckCircle,
  FileText,
  Mail,
  RefreshCw,
  UserCheck,
  Trash2,
  Edit,
  AlertCircle,
  DollarSign,
  Unlock,
} from 'lucide-react'

// ─── Activity Type ─────────────────────────────────────────────────────────────

export type ActivityType =
  | 'created'
  | 'updated'
  | 'completed'
  | 'cancelled'
  | 'deleted'
  | 'receipt_generated'
  | 'receipt_sent'
  | 'reconciled'
  | 'approved'
  | 'rejected'
  | 'released'
  | 'payment_received'
  | 'status_changed'

export interface Activity {
  type: ActivityType
  timestamp: string
  user: string
  details?: string
  metadata?: Record<string, any>
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface ActivityTimelineSectionProps {
  activities?: Activity[]
  isLoading?: boolean
  emptyMessage?: string
}

// ─── Icon Map ──────────────────────────────────────────────────────────────────

const ACTIVITY_ICON: Record<ActivityType, React.ReactNode> = {
  created:           <Clock       className="h-4 w-4" />,
  updated:           <Edit        className="h-4 w-4" />,
  completed:         <CheckCircle className="h-4 w-4" />,
  cancelled:         <AlertCircle className="h-4 w-4" />,
  deleted:           <Trash2      className="h-4 w-4" />,
  receipt_generated: <FileText    className="h-4 w-4" />,
  receipt_sent:      <Mail        className="h-4 w-4" />,
  reconciled:        <RefreshCw   className="h-4 w-4" />,
  approved:          <UserCheck   className="h-4 w-4" />,
  rejected:          <AlertCircle className="h-4 w-4" />,
  released:          <Unlock      className="h-4 w-4" />,
  payment_received:  <DollarSign  className="h-4 w-4" />,
  status_changed:    <RefreshCw   className="h-4 w-4" />,
}

// ─── Color Map ─────────────────────────────────────────────────────────────────

const ACTIVITY_COLOR: Record<ActivityType, string> = {
  created:           'bg-status-info/10 text-status-info',
  updated:           'bg-accent/10 text-accent',
  completed:         'bg-status-success/10 text-status-success',
  cancelled:         'bg-status-warning/10 text-status-warning',
  deleted:           'bg-status-error/10 text-status-error',
  receipt_generated: 'bg-status-info/10 text-status-info',
  receipt_sent:      'bg-status-info/10 text-status-info',
  reconciled:        'bg-accent/10 text-accent',
  approved:          'bg-status-success/10 text-status-success',
  rejected:          'bg-status-error/10 text-status-error',
  released:          'bg-status-success/10 text-status-success',
  payment_received:  'bg-status-success/10 text-status-success',
  status_changed:    'bg-bg-tertiary text-text-secondary',
}

// ─── Label Map (i18n key suffix) ───────────────────────────────────────────────

const ACTIVITY_LABEL_KEY: Record<ActivityType, string> = {
  created:           'activity.created',
  updated:           'activity.updated',
  completed:         'activity.completed',
  cancelled:         'activity.cancelled',
  deleted:           'activity.deleted',
  receipt_generated: 'activity.receiptGenerated',
  receipt_sent:      'activity.receiptSent',
  reconciled:        'activity.reconciled',
  approved:          'activity.approved',
  rejected:          'activity.rejected',
  released:          'activity.released',
  payment_received:  'activity.paymentReceived',
  status_changed:    'activity.statusChanged',
}

// ─── Format Helpers ────────────────────────────────────────────────────────────

const formatDateTime = (timestamp: string): string => {
  const date = new Date(timestamp)
  return new Intl.DateTimeFormat('en-IN', {
    day:    '2-digit',
    month:  'short',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

const formatRelativeTime = (timestamp: string): string => {
  const now   = new Date()
  const date  = new Date(timestamp)
  const diffMs = now.getTime() - date.getTime()
  const diffMins  = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays  = Math.floor(diffMs / 86400000)

  if (diffMins  <  1) return 'Just now'
  if (diffMins  < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays  <  7) return `${diffDays}d ago`
  return formatDateTime(timestamp)
}

// ─── Skeleton Loader ───────────────────────────────────────────────────────────

const TimelineSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="flex gap-4 animate-pulse">
        <div className="flex flex-col items-center">
          <div className="h-9 w-9 rounded-full bg-bg-tertiary" />
          {i < 3 && <div className="mt-2 h-8 w-0.5 bg-bg-tertiary" />}
        </div>
        <div className="flex-1 space-y-2 pb-4">
          <div className="h-4 w-48 rounded bg-bg-tertiary" />
          <div className="h-3 w-32 rounded bg-bg-tertiary" />
        </div>
      </div>
    ))}
  </div>
)

// ─── Main Component ────────────────────────────────────────────────────────────

export const ActivityTimelineSection = ({
  activities = [],
  isLoading  = false,
  emptyMessage,
}: ActivityTimelineSectionProps) => {
  const { t } = useTranslation()

  // Loading state
  if (isLoading) {
    return <TimelineSkeleton />
  }

  // Empty state
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-bg-tertiary">
          <Clock className="h-6 w-6 text-text-tertiary" />
        </div>
        <p className="text-sm text-text-tertiary">
          {emptyMessage || t('common.noActivityYet')}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {activities.map((activity, index) => {
        const isLast       = index === activities.length - 1
        const iconColorCls = ACTIVITY_COLOR[activity.type]
        const labelKey     = ACTIVITY_LABEL_KEY[activity.type]

        return (
          <div key={index} className="flex gap-4">
            {/* Icon + Connector line */}
            <div className="flex flex-col items-center">
              <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${iconColorCls}`}>
                {ACTIVITY_ICON[activity.type]}
              </div>
              {!isLast && (
                <div className="mt-1 h-full min-h-[20px] w-0.5 bg-border-primary" />
              )}
            </div>

            {/* Content */}
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

              {/* Details */}
              {activity.details && (
                <p className="mt-0.5 text-sm text-text-secondary">
                  {activity.details}
                </p>
              )}

              {/* Metadata badges */}
              {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {Object.entries(activity.metadata).map(([key, value]) => (
                    value !== undefined && value !== null && value !== '' ? (
                      <span
                        key={key}
                        className="inline-flex items-center rounded-full bg-bg-tertiary px-2.5 py-0.5 text-xs text-text-secondary"
                      >
                        <span className="font-medium text-text-tertiary mr-1">{key}:</span>
                        {String(value)}
                      </span>
                    ) : null
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}