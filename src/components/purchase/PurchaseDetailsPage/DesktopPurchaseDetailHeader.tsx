// FILE: src/components/purchase/PurchaseDetailPage/DesktopPurchaseDetailHeader.tsx

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChevronLeft,
  ClipboardList,
  Wallet,
  Truck,
  FileText,
  Activity,
  Edit,
  PlusCircle,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Breadcrumb } from '@/components/ui/navigation/Breadcrumb/Breadcrumb'
import { Tabs } from '@/components/ui/navigation/Tabs/Tabs'
import { Separator } from '@/components/ui/layout/Separator/Separator'
import type { IPurchase } from '@/types/purchase.types'

interface DesktopPurchaseDetailHeaderProps {
  purchase: IPurchase
  activeTab?: string
  onTabChange?: (tab: string) => void
  onBackClick?: () => void
}

// Status badge color mapping
const getStatusVariant = (status: string) => {
  const map: Record<string, string> = {
    draft: 'default',
    pending: 'warning',
    ordered: 'info',
    received: 'info',
    partial_received: 'warning',
    completed: 'success',
    cancelled: 'error',
    returned: 'error',
  }
  return map[status] ?? 'default'
}

const getPaymentVariant = (status: string) => {
  const map: Record<string, string> = {
    paid: 'success',
    partial: 'warning',
    unpaid: 'error',
    overdue: 'error',
  }
  return map[status] ?? 'default'
}

export const DesktopPurchaseDetailHeader: React.FC<
  DesktopPurchaseDetailHeaderProps
> = ({
  purchase,
  activeTab = 'overview',
  onTabChange,
  onBackClick,
}) => {
  const { t } = useTranslation()
  const [currentTab, setCurrentTab] = useState(activeTab)

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab)
    onTabChange?.(tab)
  }

  const breadcrumbItems = [
    { label: t('purchase.title', 'Purchases'), onClick: onBackClick },
    { label: purchase.purchaseNumber },
  ]

  const tabItems = [
    {
      value: 'overview',
      label: t('purchase.tabs.overview', 'Overview'),
      icon: <ClipboardList className="h-4 w-4" />,
    },
    {
      value: 'payments',
      label: t('purchase.tabs.payments', 'Payments'),
      icon: <Wallet className="h-4 w-4" />,
    },
    {
      value: 'delivery',
      label: t('purchase.tabs.delivery', 'Delivery'),
      icon: <Truck className="h-4 w-4" />,
    },
    {
      value: 'documents',
      label: t('purchase.tabs.documents', 'Documents'),
      icon: <FileText className="h-4 w-4" />,
    },
    {
      value: 'activity',
      label: t('purchase.tabs.activity', 'Activity'),
      icon: <Activity className="h-4 w-4" />,
    },
  ]

  return (
    <div className="space-y-0">
      <div className="border-b border-border-secondary bg-bg-secondary">
        <div className="space-y-4 px-6 py-4">

          {/* Top Bar — Back + Breadcrumb + Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackClick}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                {t('purchase.common.backToList', 'Back to Purchases')}
              </Button>

              <Separator orientation="vertical" className="h-6" />

              <Breadcrumb items={breadcrumbItems} showHome={true} />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="h-4 w-4" />
                {t('purchase.actions.edit', 'Edit')}
              </Button>
              <Button variant="default" size="sm" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                {t('purchase.actions.addPayment', 'Add Payment')}
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Purchase Info Row */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">

              {/* Purchase Number + Badges */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-text-primary">
                    {purchase.purchaseNumber}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={getStatusVariant(purchase.status) as any} size="sm">
                    {t(`purchase.status.${purchase.status}`, purchase.status)}
                  </Badge>
                  <Badge variant={getPaymentVariant(purchase.payment.paymentStatus) as any} size="sm">
                    {t(`purchase.paymentStatus.${purchase.payment.paymentStatus}`, purchase.payment.paymentStatus)}
                  </Badge>
                  <Badge variant="outline" size="sm">
                    {t(`purchase.type.${purchase.purchaseType}`, purchase.purchaseType)}
                  </Badge>
                  <Badge variant="outline" size="sm">
                    {purchase.items[0]?.metalType ?? ''}
                  </Badge>
                </div>

                {/* Created Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                  <span>
                    {t('purchase.detail.created', 'Created')}:{' '}
                    {new Date(purchase.createdAt).toLocaleString()}
                  </span>
                  <span>
                    {t('purchase.detail.supplier', 'Supplier')}:{' '}
                    <span className="font-medium text-text-primary">
                      {purchase.supplierDetails.supplierName}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-3">
              <div className="rounded-lg border border-border-primary bg-bg-primary p-3 text-center min-w-[110px]">
                <p className="text-xs text-text-tertiary">
                  {t('purchase.detail.grandTotal', 'Grand Total')}
                </p>
                <p className="text-lg font-bold text-text-primary">
                  ₹{purchase.financials.grandTotal.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg border border-border-primary bg-bg-primary p-3 text-center min-w-[110px]">
                <p className="text-xs text-text-tertiary">
                  {t('purchase.detail.due', 'Due Amount')}
                </p>
                <p className="text-lg font-bold text-status-warning">
                  ₹{purchase.payment.dueAmount.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg border border-border-primary bg-bg-primary p-3 text-center min-w-[110px]">
                <p className="text-xs text-text-tertiary">
                  {t('purchase.detail.items', 'Items')}
                </p>
                <p className="text-lg font-bold text-text-primary">
                  {purchase.items.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <Tabs
            tabs={tabItems}
            value={currentTab}
            onValueChange={handleTabChange}
            variant="underline"
            size="md"
          />
        </div>
      </div>
    </div>
  )
}

export default DesktopPurchaseDetailHeader