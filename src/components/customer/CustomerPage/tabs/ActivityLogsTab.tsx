// FILE: src/components/customer/CustomerPage/tabs/ActivityLogsTab.tsx

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
import type { Customer } from '@/types/customer.types'
import { useCustomerActivity } from '@/hooks/customer'
import { useAuth } from '@/hooks/auth'

interface ActivityLogsTabProps {
  customer: Customer
}

export const ActivityLogsTab: React.FC<ActivityLogsTabProps> = ({ customer }) => {
  const { t } = useTranslation()
  const { currentShopId } = useAuth()

  const { logs, isLoading } = useCustomerActivity(
    currentShopId!,
    customer._id
  )

  const getActivityIcon = (action: string) => {
    if (action.includes('purchase') || action.includes('sale')) {
      return <ShoppingBag className="h-5 w-5 text-status-success" />
    }
    if (action.includes('update') || action.includes('edit')) {
      return <Edit className="h-5 w-5 text-status-info" />
    }
    if (action.includes('document')) {
      return <FileText className="h-5 w-5 text-accent" />
    }
    if (action.includes('loyalty')) {
      return <Activity className="h-5 w-5 text-status-warning" />
    }
    return <Clock className="h-5 w-5 text-text-tertiary" />
  }

  const getActivityBadgeVariant = (module: string) => {
    switch (module) {
      case 'sale':     return 'success'
      case 'customer': return 'info'
      case 'product':  return 'accent'
      case 'purchase': return 'warning'
      default:         return 'default'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-text-tertiary">Loading...</p>
      </div>
    )
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
              {t('customerActivity.totalActivities')}: {logs.length}
            </p>
          </div>
        </div>
      </div>

      {/* Activity Timeline - REAL DATA */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
        <h3 className="mb-4 text-lg font-semibold text-text-primary">
          {t('customerActivity.recentActivity')}
        </h3>

        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Activity className="mb-3 h-10 w-10 text-text-tertiary" />
            <p className="text-sm text-text-tertiary">
              {t('customerActivity.noActivity')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log: any, index: number) => {
              const date = new Date(log.createdAt)
              return (
                <div
                  key={log._id}
                  className="relative flex gap-4 rounded-lg border border-border-secondary bg-bg-primary p-4"
                >
                  {/* Timeline Line */}
                  {index !== logs.length - 1 && (
                    <div className="absolute left-[30px] top-[60px] h-[calc(100%+16px)] w-px bg-border-secondary" />
                  )}

                  {/* Icon */}
                  <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-bg-secondary">
                    {getActivityIcon(log.action)}
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
                            variant={getActivityBadgeVariant(log.module) as any}
                            size="sm"
                          >
                            {log.module}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-text-secondary">
                          {log.description}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-text-tertiary">
                          <Clock className="h-3 w-3" />
                          <span>
                            {date.toLocaleDateString()} at{' '}
                            {date.toLocaleTimeString([], {
                              hour:   '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
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
              {logs.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivityLogsTab