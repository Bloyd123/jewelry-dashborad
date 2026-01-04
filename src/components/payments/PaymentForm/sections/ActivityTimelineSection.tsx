// FILE: src/components/payments/PaymentForm/sections/ActivityTimelineSection.tsx
// Activity Timeline Section (View/Edit Mode Only)

import { useTranslation } from 'react-i18next'
import {
  Clock,
  CheckCircle,
  FileText,
  Mail,
  RefreshCw,
  UserCheck,
} from 'lucide-react'

interface ActivityTimelineProps {
  activities?: Array<{
    type:
      | 'created'
      | 'completed'
      | 'receipt_generated'
      | 'receipt_sent'
      | 'reconciled'
      | 'approved'
    timestamp: string
    user: string
    details?: string
  }>
}

export const ActivityTimelineSection = ({
  activities = [],
}: ActivityTimelineProps) => {
  const { t } = useTranslation()

  if (activities.length === 0) {
    return null
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'created':
        return <Clock className="h-5 w-5" />
      case 'completed':
        return <CheckCircle className="h-5 w-5" />
      case 'receipt_generated':
        return <FileText className="h-5 w-5" />
      case 'receipt_sent':
        return <Mail className="h-5 w-5" />
      case 'reconciled':
        return <RefreshCw className="h-5 w-5" />
      case 'approved':
        return <UserCheck className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'completed':
      case 'approved':
        return 'text-status-success'
      case 'receipt_generated':
      case 'receipt_sent':
        return 'text-status-info'
      case 'reconciled':
        return 'text-accent'
      default:
        return 'text-text-secondary'
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-text-primary">
        {t('payment.activityTimeline')}
      </h3>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex gap-4">
            {/* Icon */}
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${getActivityColor(activity.type)} bg-current/10`}
            >
              {getActivityIcon(activity.type)}
            </div>

            {/* Content */}
            <div className="flex-1">
              <p className="font-medium text-text-primary">
                {t(`payment.activity.${activity.type}`)} {t('common.by')}{' '}
                {activity.user}
              </p>
              <p className="text-sm text-text-tertiary">
                {new Date(activity.timestamp).toLocaleString()}
              </p>
              {activity.details && (
                <p className="mt-1 text-sm text-text-secondary">
                  └─ {activity.details}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
