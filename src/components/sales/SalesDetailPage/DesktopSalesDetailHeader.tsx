// ============================================================================
// FILE: src/components/features/Sales/DesktopSalesDetailHeader.tsx
// Desktop Sales Detail Header Component
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
  MoreVertical,
  Edit,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Breadcrumb } from '@/components/ui/navigation/Breadcrumb/Breadcrumb'
import { Tabs } from '@/components/ui/navigation/Tabs/Tabs'
import { Separator } from '@/components/ui/layout/Separator/Separator'
import type { Sale } from '@/types/sale.types'
import { dummySales } from '@/pages/sales/data'

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface DesktopSalesDetailHeaderProps {
  saleId?: string
  activeTab?: string
  onTabChange?: (tab: string) => void
  onBackClick?: () => void
  onEditClick?: () => void
  onDeleteClick?: () => void
  onPrintClick?: () => void
  onSendClick?: () => void
}

// ============================================================================
// DESKTOP SALES DETAIL HEADER COMPONENT
// ============================================================================

export const DesktopSalesDetailHeader: React.FC<
  DesktopSalesDetailHeaderProps
> = ({
  saleId,
  activeTab = 'overview',
  onTabChange,
  onBackClick,
  onEditClick,
  onDeleteClick,
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

  // Breadcrumb items
  const breadcrumbItems = [
    {
      label: t('sales.title'),
      onClick: onBackClick,
    },
    {
      label: sale.invoiceNumber,
    },
  ]

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
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="border-b border-border-secondary bg-bg-secondary">
        <div className="space-y-4 px-6 py-4">
          {/* Back Button and Breadcrumb */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackClick}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                {t('sales.common.backToList')}
              </Button>

              <Separator orientation="vertical" className="h-6" />

              <Breadcrumb items={breadcrumbItems} showHome={true} />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onPrintClick}
                className="gap-2"
              >
                <Printer className="h-4 w-4" />
                {t('sales.common.print')}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={onSendClick}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                {t('sales.common.send')}
              </Button>

              {(sale.status === 'draft' || sale.status === 'pending') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEditClick}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  {t('sales.common.edit')}
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* Sale Details */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Sale Icon */}
              <div className="bg-accent/10 flex h-16 w-16 items-center justify-center rounded-lg">
                <Receipt className="h-8 w-8 text-accent" />
              </div>

              {/* Sale Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-text-primary">
                    {sale.invoiceNumber}
                  </h1>
                  <span className="text-text-tertiary">
                    {formatDate(sale.saleDate)}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Status */}
                  <Badge variant={getStatusVariant(sale.status)} size="sm">
                    {t(`sales.status.${sale.status}`)}
                  </Badge>

                  {/* Payment Status */}
                  <Badge
                    variant={getPaymentStatusVariant(
                      sale.payment.paymentStatus
                    )}
                    size="sm"
                  >
                    {t(`sales.paymentStatus.${sale.payment.paymentStatus}`)}
                  </Badge>

                  {/* Sale Type */}
                  {sale.saleType && (
                    <Badge variant="outline" size="sm">
                      {t(`sales.saleType.${sale.saleType}`)}
                    </Badge>
                  )}

                  {/* Old Gold Exchange */}
                  {sale.oldGoldExchange?.hasExchange && (
                    <Badge variant="info" size="sm">
                      {t('sales.common.oldGoldExchange')}
                    </Badge>
                  )}

                  {/* Approval Status */}
                  {sale.approvalStatus === 'approved' && (
                    <Badge variant="success" size="sm">
                      {t('sales.common.approved')}
                    </Badge>
                  )}
                </div>

                {/* Additional Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                  <div className="flex items-center gap-1">
                    <span className="text-text-tertiary">
                      {t('sales.common.customer')}:
                    </span>
                    <span className="font-medium">
                      {sale.customerDetails.customerName}
                    </span>
                    <span className="text-text-tertiary">
                      ({sale.customerDetails.customerCode})
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-text-tertiary">
                      {t('sales.common.totalAmount')}:
                    </span>
                    <span className="font-semibold text-text-primary">
                      {formatCurrency(sale.financials.grandTotal)}
                    </span>
                  </div>

                  {sale.payment.dueAmount > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-text-tertiary">
                        {t('sales.common.dueAmount')}:
                      </span>
                      <span className="font-semibold text-status-error">
                        {formatCurrency(sale.payment.dueAmount)}
                      </span>
                    </div>
                  )}

                  {sale.salesPerson && (
                    <div className="flex items-center gap-1">
                      <span className="text-text-tertiary">
                        {t('sales.common.salesPerson')}:
                      </span>
                      <span>
                        {typeof sale.salesPerson === 'string'
                          ? sale.salesPerson
                          : 'N/A'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className="rounded-lg border border-border-secondary bg-bg-primary p-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between gap-8">
                  <span className="text-text-tertiary">
                    {t('sales.common.items')}:
                  </span>
                  <span className="font-medium text-text-primary">
                    {sale.items.length}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-8">
                  <span className="text-text-tertiary">
                    {t('sales.common.subtotal')}:
                  </span>
                  <span className="font-medium text-text-primary">
                    {formatCurrency(sale.financials.subtotal)}
                  </span>
                </div>
                {sale.financials.totalDiscount > 0 && (
                  <div className="flex items-center justify-between gap-8">
                    <span className="text-text-tertiary">
                      {t('sales.common.discount')}:
                    </span>
                    <span className="font-medium text-status-success">
                      -{formatCurrency(sale.financials.totalDiscount)}
                    </span>
                  </div>
                )}
                {sale.oldGoldExchange?.hasExchange &&
                  sale.financials.oldGoldValue > 0 && (
                    <div className="flex items-center justify-between gap-8">
                      <span className="text-text-tertiary">
                        {t('sales.common.oldGold')}:
                      </span>
                      <span className="font-medium text-status-warning">
                        -{formatCurrency(sale.financials.oldGoldValue)}
                      </span>
                    </div>
                  )}
                <Separator />
                <div className="flex items-center justify-between gap-8">
                  <span className="font-medium text-text-primary">
                    {t('sales.common.netPayable')}:
                  </span>
                  <span className="text-lg font-bold text-text-primary">
                    {formatCurrency(sale.financials.netPayable)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
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

export default DesktopSalesDetailHeader
