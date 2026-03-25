// FILE: src/components/purchase/PurchaseDetailPage/tabs/ActivityTab.tsx

import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Activity,
  User,
  CreditCard,
  Edit,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import type { IPurchase } from '@/types/purchase.types'

interface ActivityTabProps {
  purchase: IPurchase
}
const getPersonName = (person: any): string => {
  if (!person) return 'System'
  if (typeof person === 'string') return person
  if (typeof person === 'object') {
    return `${person.firstName ?? ''} ${person.lastName ?? ''}`.trim() || 'System'
  }
  return 'System'
}
// Build activity logs from purchase data
const buildActivityLogs = (purchase: IPurchase) => {
  const logs = []

  logs.push({
    id: 'created',
    type: 'created' as const,
    action: 'Purchase Created',
    description: `Purchase ${purchase.purchaseNumber} was created`,
    timestamp: new Date(purchase.createdAt).toISOString(),
    performedBy: getPersonName(purchase.createdBy),
    // performedBy: purchase.createdBy ?? 'System',
  })

  if (purchase.approvedAt) {
    logs.push({
      id: 'approved',
      type: 'approved' as const,
      action: 'Purchase Approved',
      description: `Purchase ${purchase.purchaseNumber} was approved`,
      timestamp: new Date(purchase.approvedAt).toISOString(),
      performedBy: getPersonName(purchase.approvedBy),
      // performedBy: purchase.approvedBy ?? 'Manager',
    })
  }

  if (purchase.rejectedAt) {
    logs.push({
      id: 'rejected',
      type: 'rejected' as const,
      action: 'Purchase Rejected',
      description: purchase.rejectionReason ?? 'Purchase was rejected',
      timestamp: new Date(purchase.rejectedAt).toISOString(),
      performedBy: purchase.rejectedBy ?? 'Manager',
    })
  }
(purchase.payment.payments ?? []).forEach((pay, idx) => {
    logs.push({
      id: `payment-${idx}`,
      type: 'payment' as const,
      action: 'Payment Added',
      description: `₹${pay.amount.toLocaleString()} via ${pay.paymentMode.replace('_', ' ')}`,
      timestamp: new Date(pay.paymentDate).toISOString(),
      performedBy: pay.receivedBy ?? 'Staff',
    })
  })
purchase.documents?.forEach((doc, idx) => {
    logs.push({
      id: `doc-${idx}`,
      type: 'document' as const,
      action: 'Document Uploaded',
      description: `${doc.documentType} ${doc.documentNumber ? `(${doc.documentNumber})` : ''} was uploaded`,
      timestamp: doc.uploadedAt ? new Date(doc.uploadedAt).toISOString() : new Date(purchase.createdAt).toISOString(),
      performedBy: 'Staff',
    })
  })

  if (purchase.delivery?.receivedDate) {
    logs.push({
      id: 'received',
      type: 'received' as const,
      action: 'Purchase Received',
      description: `All items received. Inventory updated.`,
      timestamp: new Date(purchase.delivery.receivedDate).toISOString(),
      performedBy: getPersonName(purchase.delivery?.receivedBy),
      // performedBy: purchase.delivery.receivedBy ?? 'Staff',
    })
  }

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

const activityConfig: Record<string, { icon: React.ReactNode; variant: string }> = {
  created:  { icon: <Edit className="h-4 w-4 text-status-info" />,    variant: 'info' },
  approved: { icon: <CheckCircle className="h-4 w-4 text-status-success" />, variant: 'success' },
  rejected: { icon: <XCircle className="h-4 w-4 text-status-error" />, variant: 'error' },
  payment:  { icon: <CreditCard className="h-4 w-4 text-status-success" />, variant: 'success' },
  document: { icon: <FileText className="h-4 w-4 text-accent" />,     variant: 'default' },
  received: { icon: <CheckCircle className="h-4 w-4 text-status-success" />, variant: 'success' },
}

export const ActivityTab: React.FC<ActivityTabProps> = ({ purchase }) => {
  const { t } = useTranslation()
  const logs = buildActivityLogs(purchase)

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">

      {/* ── Summary ── */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-tertiary">
            <Activity className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              {t('purchase.activity.title', 'Activity Log')}
            </h3>
            <p className="text-xs text-text-secondary">
              {t('purchase.activity.total', 'Total activities')}: {logs.length}
            </p>
          </div>
        </div>
      </div>

      {/* ── Activity Timeline ── */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-5 space-y-4">
        <h3 className="text-sm font-semibold text-text-primary">
          {t('purchase.activity.timeline', 'Activity Timeline')}
        </h3>

        <div className="space-y-4">
          {logs.map((log, index) => {
            const config = activityConfig[log.type] ?? activityConfig.created
            const date = new Date(log.timestamp)

            return (
              <div
                key={log.id}
                className="relative flex gap-4 rounded-lg border border-border-secondary bg-bg-primary p-4"
              >
                {/* Connector Line */}
                {index !== logs.length - 1 && (
                  <div className="absolute left-[30px] top-[60px] h-[calc(100%+16px)] w-px bg-border-secondary" />
                )}

                {/* Icon */}
                <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-bg-secondary">
                  {config.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-text-primary">
                          {log.action}
                        </h4>
                        <Badge variant={config.variant as any} size="sm">
                          {t(`purchase.activity.type_${log.type}`, log.type)}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-text-secondary">
                        {log.description}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-text-tertiary">
                        <Clock className="h-3 w-3" />
                        <span>
                          {date.toLocaleDateString()} {t('common.at', 'at')}{' '}
                          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
    </div>
  )
}

export default ActivityTab