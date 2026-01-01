// ============================================================================
// FILE: src/components/features/Sales/MobileSalesDetailHeader.tsx
// Mobile Sales Detail Header Component
// ============================================================================

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Settings,
  Receipt,
  ChevronLeft,
  Package,
  CreditCard,
  FileText,
  History,
  Printer,
  Send,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Tabs } from '@/components/ui/navigation/Tabs/Tabs'
import type { Sale } from '@/types/sale.types'
import { dummySales } from '@/pages/sales/data'

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface MobileSalesDetailHeaderProps {
  saleId?: string
  activeTab?: string
  onTabChange?: (tab: string) => void
  onBackClick?: () => void
  onPrintClick?: () => void
  onSendClick?: () => void
}

// ============================================================================
// MOBILE SALES DETAIL HEADER COMPONENT
// ============================================================================

export const MobileSalesDetailHeader: React.FC<
  MobileSalesDetailHeaderProps
> = ({
  saleId,
  activeTab = 'overview',
  onTabChange,
  onBackClick,
  onPrintClick,
  onSendClick,
}) => {
  const { t } = useTranslation()
  const [currentTab, setCurrentTab] = useState(activeTab)

  // Get sale data from dummy data
  const sale: Sale = saleId
    ? dummySales.find(s => s._id === saleId) || dummySales[0]
    : dummySales[0]

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab)
    if (onTabChange) {
      onTabChange(tab)
    }
  }

  // Tab items
  const tabItems = [
    {
      value: 'overview',
      label: t('sales.tabs.overview'),
      icon: <Receipt className="h-4 w-4" />,
    },
    {
      value: 'items',
      label: t('sales.tabs.items'),
      icon: <Package className="h-4 w-4" />,
    },
    {
      value: 'payments',
      label: t('sales.tabs.payments'),
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      value: 'documents',
      label: t('sales.tabs.documents'),
      icon: <FileText className="h-4 w-4" />,
    },
    {
      value: 'history',
      label: t('sales.tabs.history'),
      icon: <History className="h-4 w-4" />,
    },
  ]

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'cancelled':
      case 'returned':
        return 'error'
      case 'confirmed':
      case 'delivered':
        return 'info'
      case 'draft':
      case 'pending':
        return 'warning'
      default:
        return 'default'
    }
  }

  // Get payment status badge variant
  const getPaymentStatusVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success'
      case 'unpaid':
      case 'overdue':
        return 'error'
      case 'partial':
        return 'warning'
      default:
        return 'default'
    }
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

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-0">
      {/* Header Section */}
      <div className="border-b border-border-secondary bg-bg-secondary">
        <div className="space-y-3 px-4 py-3">
          {/* Back Button and Actions */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackClick}
              className="gap-2 px-2"
            >
              <ChevronLeft className="h-4 w-4" />
              {t('sales.common.backToList')}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onPrintClick}
                className="gap-2"
              >
                <Printer className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={onSendClick}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Sale Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              {/* Sale Icon */}
              <div className="bg-accent/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                <Receipt className="h-6 w-6 text-accent" />
              </div>

              {/* Sale Info */}
              <div className="min-w-0 flex-1 space-y-2">
                <div className="space-y-1">
                  <h1 className="truncate text-lg font-bold text-text-primary">
                    {sale.invoiceNumber}
                  </h1>
                  <span className="text-sm text-text-tertiary">
                    {formatDate(sale.saleDate)}
                  </span>
                </div>

                {/* Badges - Mobile Compact */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant={getStatusVariant(sale.status)} size="sm">
                    {t(`sales.status.${sale.status}`)}
                  </Badge>

                  <Badge
                    variant={getPaymentStatusVariant(
                      sale.payment.paymentStatus
                    )}
                    size="sm"
                  >
                    {t(`sales.paymentStatus.${sale.payment.paymentStatus}`)}
                  </Badge>

                  {sale.saleType && (
                    <Badge variant="outline" size="sm">
                      {t(`sales.saleType.${sale.saleType}`)}
                    </Badge>
                  )}

                  {sale.oldGoldExchange?.hasExchange && (
                    <Badge variant="info" size="sm">
                      {t('sales.common.oldGoldExchange')}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Info - Mobile Card */}
            <div className="space-y-1.5 rounded-lg bg-bg-primary p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-text-tertiary">
                  {t('sales.common.customer')}:
                </span>
                <span className="font-medium text-text-secondary">
                  {sale.customerDetails.customerName}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-text-tertiary">
                  {t('sales.common.totalAmount')}:
                </span>
                <span className="font-semibold text-text-primary">
                  {formatCurrency(sale.financials.grandTotal)}
                </span>
              </div>

              {sale.payment.dueAmount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-text-tertiary">
                    {t('sales.common.dueAmount')}:
                  </span>
                  <span className="font-semibold text-status-error">
                    {formatCurrency(sale.payment.dueAmount)}
                  </span>
                </div>
              )}

              {sale.salesPerson && (
                <div className="flex items-center justify-between">
                  <span className="text-text-tertiary">
                    {t('sales.common.salesPerson')}:
                  </span>
                  <span className="font-medium text-text-secondary">
                    {typeof sale.salesPerson === 'string'
                      ? sale.salesPerson
                      : 'N/A'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation - Mobile Scrollable */}
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

export default MobileSalesDetailHeader
