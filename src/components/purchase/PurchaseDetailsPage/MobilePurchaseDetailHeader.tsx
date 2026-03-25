// FILE: src/components/purchase/PurchaseDetailPage/MobilePurchaseDetailHeader.tsx

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChevronLeft,
  ClipboardList,
  Wallet,
  Truck,
  FileText,
  Activity,
  PlusCircle,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Tabs } from '@/components/ui/navigation/Tabs/Tabs'
import type { IPurchase } from '@/types/purchase.types'

interface MobilePurchaseDetailHeaderProps {
  purchase: IPurchase
  activeTab?: string
  onTabChange?: (tab: string) => void
  onBackClick?: () => void
}

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

export const MobilePurchaseDetailHeader: React.FC<
  MobilePurchaseDetailHeaderProps
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
        <div className="space-y-3 px-4 py-3">

          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackClick}
              className="gap-2 px-2"
            >
              <ChevronLeft className="h-4 w-4" />
              {t('purchase.common.back', 'Back')}
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="default" size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                {t('purchase.actions.pay', 'Pay')}
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Purchase Info */}
          <div className="space-y-2">
            <h1 className="text-lg font-bold text-text-primary">
              {purchase.purchaseNumber}
            </h1>
            <p className="text-sm text-text-secondary">
              {purchase.supplierDetails.supplierName}
            </p>

            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant={getStatusVariant(purchase.status) as any} size="sm">
                {t(`purchase.status.${purchase.status}`, purchase.status)}
              </Badge>
              <Badge variant={getPaymentVariant(purchase.payment.paymentStatus) as any} size="sm">
                {t(`purchase.paymentStatus.${purchase.payment.paymentStatus}`, purchase.payment.paymentStatus)}
              </Badge>
              <Badge variant="outline" size="sm">
                {t(`purchase.type.${purchase.purchaseType}`, purchase.purchaseType)}
              </Badge>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-bg-primary p-2 text-center">
              <p className="text-xs text-text-tertiary">
                {t('purchase.detail.total', 'Total')}
              </p>
              <p className="text-sm font-semibold text-text-primary">
                ₹{purchase.financials.grandTotal.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-bg-primary p-2 text-center">
              <p className="text-xs text-text-tertiary">
                {t('purchase.detail.due', 'Due')}
              </p>
              <p className="text-sm font-semibold text-status-warning">
                ₹{purchase.payment.dueAmount.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-bg-primary p-2 text-center">
              <p className="text-xs text-text-tertiary">
                {t('purchase.detail.items', 'Items')}
              </p>
              <p className="text-sm font-semibold text-text-primary">
                {purchase.items.length}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="overflow-x-auto px-4">
          <Tabs
            tabs={tabItems}
            value={currentTab}
            onValueChange={handleTabChange}
            variant="underline"
            size="sm"
          />
        </div>
      </div>
    </div>
  )
}

export default MobilePurchaseDetailHeader