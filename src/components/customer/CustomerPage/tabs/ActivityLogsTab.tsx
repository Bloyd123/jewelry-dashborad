// ============================================================================
// FILE: src/components/features/Customers/tabs/ActivityLogsTab.tsx
// Activity Logs Tab
// ============================================================================

import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Activity,
  User,
  ShoppingBag,
  Edit,
  FileText,
  Clock,
} from 'lucide-react'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { MOCK_CUSTOMERS } from '@/pages/customer/AddCustomer/mockdata'
import type { Customer } from '@/types/customer.types'

// ============================================================================
// MOCK ACTIVITY LOGS
// ============================================================================

interface ActivityLog {
  id: string
  type: 'profile_update' | 'purchase' | 'document_upload' | 'status_change'
  action: string
  description: string
  timestamp: string
  performedBy: string
}

const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: '1',
    type: 'purchase',
    action: 'Purchase Made',
    description: 'Purchased Gold Necklace worth ₹45,000',
    timestamp: '2024-12-15T10:30:00',
    performedBy: 'System',
  },
  {
    id: '2',
    type: 'profile_update',
    action: 'Profile Updated',
    description: 'Updated contact information',
    timestamp: '2024-11-20T14:15:00',
    performedBy: 'Admin User',
  },
  {
    id: '3',
    type: 'document_upload',
    action: 'Document Uploaded',
    description: 'Uploaded Aadhar Card for verification',
    timestamp: '2024-10-10T09:45:00',
    performedBy: 'Customer',
  },
  {
    id: '4',
    type: 'purchase',
    action: 'Purchase Made',
    description: 'Purchased Diamond Ring worth ₹32,000',
    timestamp: '2024-09-05T16:20:00',
    performedBy: 'System',
  },
  {
    id: '5',
    type: 'status_change',
    action: 'Status Changed',
    description: 'Customer status changed to Active',
    timestamp: '2024-08-15T11:00:00',
    performedBy: 'Admin User',
  },
]

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface ActivityLogsTabProps {
  customerId?: string
}

// ============================================================================
// ACTIVITY LOGS TAB COMPONENT
// ============================================================================

export const ActivityLogsTab: React.FC<ActivityLogsTabProps> = ({
  customerId,
}) => {
  const { t } = useTranslation()

  // Get customer data from mock
  const customer: Customer = customerId
    ? MOCK_CUSTOMERS.find(c => c._id === customerId) || MOCK_CUSTOMERS[0]
    : MOCK_CUSTOMERS[0]

  const getActivityIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'purchase':
        return <ShoppingBag className="h-5 w-5 text-status-success" />
      case 'profile_update':
        return <Edit className="h-5 w-5 text-status-info" />
      case 'document_upload':
        return <FileText className="h-5 w-5 text-accent" />
      case 'status_change':
        return <Activity className="h-5 w-5 text-status-warning" />
      default:
        return <Clock className="h-5 w-5 text-text-tertiary" />
    }
  }

  const getActivityBadgeVariant = (type: ActivityLog['type']) => {
    switch (type) {
      case 'purchase':
        return 'success'
      case 'profile_update':
        return 'info'
      case 'document_upload':
        return 'accent'
      case 'status_change':
        return 'warning'
      default:
        return 'default'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4">
      {/* Activity Summary */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
        <div className="flex items-center gap-3">
          <div className="bg-accent/10 flex h-12 w-12 items-center justify-center rounded-full">
            <Activity className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              {t('customerActivity.activityLog')}
            </h3>
            <p className="text-sm text-text-secondary">
              {t('customerActivity.totalActivities')}:{' '}
              {MOCK_ACTIVITY_LOGS.length}
            </p>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
        <h3 className="mb-4 text-lg font-semibold text-text-primary">
          {t('customerActivity.recentActivity')}
        </h3>

        <div className="space-y-4">
          {MOCK_ACTIVITY_LOGS.map((log, index) => {
            const { date, time } = formatTimestamp(log.timestamp)

            return (
              <div
                key={log.id}
                className="relative flex gap-4 rounded-lg border border-border-secondary bg-bg-primary p-4"
              >
                {/* Timeline Line */}
                {index !== MOCK_ACTIVITY_LOGS.length - 1 && (
                  <div className="absolute left-[30px] top-[60px] h-[calc(100%+16px)] w-px bg-border-secondary" />
                )}

                {/* Icon */}
                <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-bg-secondary">
                  {getActivityIcon(log.type)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-text-primary">
                          {log.action}
                        </h4>
                        <Badge
                          variant={getActivityBadgeVariant(log.type) as any}
                          size="sm"
                        >
                          {t(`customerActivity.type_${log.type}`)}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-text-secondary">
                        {log.description}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-text-tertiary">
                        <Clock className="h-3 w-3" />
                        <span>
                          {date} at {time}
                        </span>
                        <span>•</span>
                        <User className="h-3 w-3" />
                        <span>{log.performedBy}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Account Information */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
        <h3 className="mb-4 text-lg font-semibold text-text-primary">
          {t('customerActivity.accountInformation')}
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border-secondary bg-bg-primary p-4">
            <p className="text-xs text-text-tertiary">
              {t('customerActivity.memberSince')}
            </p>
            <p className="mt-1 text-sm font-semibold text-text-primary">
              {new Date(customer.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="rounded-lg border border-border-secondary bg-bg-primary p-4">
            <p className="text-xs text-text-tertiary">
              {t('customerActivity.lastUpdated')}
            </p>
            <p className="mt-1 text-sm font-semibold text-text-primary">
              {new Date(customer.updatedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="rounded-lg border border-border-secondary bg-bg-primary p-4">
            <p className="text-xs text-text-tertiary">
              {t('customerActivity.accountStatus')}
            </p>
            <div className="mt-1">
              <Badge
                variant={customer.isActive ? 'active' : 'inactive'}
                size="sm"
              >
                {customer.isActive
                  ? t('customers.common.active')
                  : t('customers.common.inactive')}
              </Badge>
            </div>
          </div>

          <div className="rounded-lg border border-border-secondary bg-bg-primary p-4">
            <p className="text-xs text-text-tertiary">
              {t('customerActivity.totalActivities')}
            </p>
            <p className="mt-1 text-sm font-semibold text-text-primary">
              {MOCK_ACTIVITY_LOGS.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivityLogsTab
