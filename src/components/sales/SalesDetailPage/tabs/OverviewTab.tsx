// ============================================================================
// FILE: src/components/features/Sales/tabs/OverviewTab.tsx
// Sales Overview Tab Component
// ============================================================================

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Receipt,
  User,
  Package,
  CreditCard,
  TrendingDown,
  Coins,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Copy,
  Check,
  FileText,
  IndianRupee,
  Percent,
  Hash,
} from 'lucide-react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/layout/Accordion/Accordion'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { Sale } from '@/types/sale.types'

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface OverviewTabProps {
  sale: Sale
}

// ============================================================================
// COPY BUTTON COMPONENT
// ============================================================================

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="h-6 w-6 p-0"
    >
      {copied ? (
        <Check className="h-3 w-3 text-status-success" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const OverviewTab: React.FC<OverviewTabProps> = ({ sale }) => {
  const { t } = useTranslation()

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

  // ========================================================================
  // SALE INFORMATION SECTION
  // ========================================================================

  const SaleInfoSection = () => (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Invoice Number */}
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-2 text-xs text-text-secondary">
            <Receipt className="h-3 w-3" />
            {t('sales.common.invoiceNumber')}
          </Label>
          <div className="flex items-center gap-2">
            <p className="font-mono text-sm font-semibold text-text-primary">
              {sale.invoiceNumber}
            </p>
            <CopyButton text={sale.invoiceNumber} />
          </div>
        </div>

        {/* Sale Date */}
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-2 text-xs text-text-secondary">
            <Calendar className="h-3 w-3" />
            {t('sales.common.saleDate')}
          </Label>
          <p className="text-sm font-medium text-text-primary">
            {formatDate(sale.saleDate)}
          </p>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('sales.common.status')}
          </Label>
          <Badge variant={getStatusVariant(sale.status)} size="sm" className="w-fit">
            {t(`sales.status.${sale.status}`)}
          </Badge>
        </div>

        {/* Payment Status */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('sales.common.paymentStatus')}
          </Label>
          <Badge
            variant={getPaymentStatusVariant(sale.payment.paymentStatus)}
            size="sm"
            className="w-fit"
          >
            {t(`sales.paymentStatus.${sale.payment.paymentStatus}`)}
          </Badge>
        </div>

        {/* Sale Type */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('sales.common.saleType')}
          </Label>
          <Badge variant="outline" size="sm" className="w-fit">
            {t(`sales.saleType.${sale.saleType}`)}
          </Badge>
        </div>

        {/* Sales Person */}
        {sale.salesPerson && (
          <div className="flex flex-col gap-1.5">
            <Label className="flex items-center gap-2 text-xs text-text-secondary">
              <User className="h-3 w-3" />
              {t('sales.common.salesPerson')}
            </Label>
            <p className="text-sm font-medium text-text-primary">
              {typeof sale.salesPerson === 'string' ? sale.salesPerson : 'N/A'}
            </p>
          </div>
        )}

        {/* Total Items */}
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-2 text-xs text-text-secondary">
            <Package className="h-3 w-3" />
            {t('sales.common.totalItems')}
          </Label>
          <p className="text-sm font-medium text-text-primary">
            {sale.items.length} {t('sales.common.items')}
          </p>
        </div>

        {/* Notes */}
        {sale.notes && (
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label className="text-xs text-text-secondary">
              {t('sales.common.notes')}
            </Label>
            <p className="text-sm text-text-secondary">{sale.notes}</p>
          </div>
        )}
      </div>
    </div>
  )

  // ========================================================================
  // CUSTOMER INFORMATION SECTION
  // ========================================================================

  const CustomerInfoSection = () => (
    <div className="space-y-4 p-4">
      {/* Customer Header */}
      <div className="flex items-start gap-4 rounded-lg border border-border-secondary bg-bg-tertiary p-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent/10">
          <User className="h-6 w-6 text-accent" />
        </div>
        <div className="flex-1">
          <h4 className="text-base font-semibold text-text-primary">
            {sale.customerDetails.customerName}
          </h4>
          <p className="text-xs text-text-secondary">
            {t('sales.common.customerCode')}: {sale.customerDetails.customerCode}
          </p>
        </div>
      </div>

      {/* Contact Details */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-2 text-xs text-text-secondary">
            <Phone className="h-3 w-3" />
            {t('sales.common.phone')}
          </Label>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-text-primary">
              {sale.customerDetails.phone || 'N/A'}
            </p>
            {sale.customerDetails.phone && (
              <CopyButton text={sale.customerDetails.phone} />
            )}
          </div>
        </div>

        {/* Email */}
        {sale.customerDetails.email && (
          <div className="flex flex-col gap-1.5">
            <Label className="flex items-center gap-2 text-xs text-text-secondary">
              <Mail className="h-3 w-3" />
              {t('sales.common.email')}
            </Label>
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium text-text-primary">
                {sale.customerDetails.email}
              </p>
              <CopyButton text={sale.customerDetails.email} />
            </div>
          </div>
        )}

        {/* Address */}
        {sale.customerDetails.address && (
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label className="flex items-center gap-2 text-xs text-text-secondary">
              <MapPin className="h-3 w-3" />
              {t('sales.common.address')}
            </Label>
            <p className="text-sm text-text-secondary">
              {sale.customerDetails.address}
            </p>
          </div>
        )}

        {/* GST Number */}
        {sale.customerDetails.gstNumber && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('sales.common.gstNumber')}
            </Label>
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm font-medium text-text-primary">
                {sale.customerDetails.gstNumber}
              </p>
              <CopyButton text={sale.customerDetails.gstNumber} />
            </div>
          </div>
        )}

        {/* PAN Number */}
        {sale.customerDetails.panNumber && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('sales.common.panNumber')}
            </Label>
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm font-medium text-text-primary">
                {sale.customerDetails.panNumber}
              </p>
              <CopyButton text={sale.customerDetails.panNumber} />
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // ========================================================================
  // FINANCIAL SUMMARY SECTION
  // ========================================================================

  const FinancialSummarySection = () => (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Subtotal */}
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-2 text-xs text-text-secondary">
            <IndianRupee className="h-3 w-3" />
            {t('sales.financials.subtotal')}
          </Label>
          <p className="text-sm font-medium text-text-primary">
            {formatCurrency(sale.financials.subtotal)}
          </p>
        </div>

        {/* Metal Value */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('sales.financials.metalValue')}
          </Label>
          <p className="text-sm font-medium text-text-primary">
            {formatCurrency(sale.financials.totalMetalValue)}
          </p>
        </div>

        {/* Stone Value */}
        {sale.financials.totalStoneValue > 0 && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('sales.financials.stoneValue')}
            </Label>
            <p className="text-sm font-medium text-text-primary">
              {formatCurrency(sale.financials.totalStoneValue)}
            </p>
          </div>
        )}

        {/* Making Charges */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('sales.financials.makingCharges')}
          </Label>
          <p className="text-sm font-medium text-text-primary">
            {formatCurrency(sale.financials.totalMakingCharges)}
          </p>
        </div>

        {/* Other Charges */}
        {sale.financials.totalOtherCharges > 0 && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('sales.financials.otherCharges')}
            </Label>
            <p className="text-sm font-medium text-text-primary">
              {formatCurrency(sale.financials.totalOtherCharges)}
            </p>
          </div>
        )}

        {/* Discount */}
        {sale.financials.totalDiscount > 0 && (
          <div className="flex flex-col gap-1.5">
            <Label className="flex items-center gap-2 text-xs text-text-secondary">
              <TrendingDown className="h-3 w-3" />
              {t('sales.financials.discount')}
            </Label>
            <p className="text-sm font-medium text-status-success">
              -{formatCurrency(sale.financials.totalDiscount)}
            </p>
          </div>
        )}

        {/* GST */}
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-2 text-xs text-text-secondary">
            <Percent className="h-3 w-3" />
            {t('sales.financials.gst')}
          </Label>
          <p className="text-sm font-medium text-text-primary">
            {formatCurrency(sale.financials.totalGST)}
          </p>
        </div>

        {/* Old Gold Value */}
        {sale.oldGoldExchange?.hasExchange && sale.financials.oldGoldValue > 0 && (
          <div className="flex flex-col gap-1.5">
            <Label className="flex items-center gap-2 text-xs text-text-secondary">
              <Coins className="h-3 w-3" />
              {t('sales.financials.oldGoldValue')}
            </Label>
            <p className="text-sm font-medium text-status-warning">
              -{formatCurrency(sale.financials.oldGoldValue)}
            </p>
          </div>
        )}

        {/* Grand Total */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <Label className="text-xs font-semibold text-text-secondary">
            {t('sales.financials.grandTotal')}
          </Label>
          <p className="text-lg font-bold text-text-primary">
            {formatCurrency(sale.financials.grandTotal)}
          </p>
        </div>

        {/* Net Payable */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <Label className="text-xs font-semibold text-text-secondary">
            {t('sales.financials.netPayable')}
          </Label>
          <p className="text-xl font-bold text-accent">
            {formatCurrency(sale.financials.netPayable)}
          </p>
        </div>
      </div>
    </div>
  )

  // ========================================================================
  // PAYMENT SUMMARY SECTION
  // ========================================================================

  const PaymentSummarySection = () => (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Total Amount */}
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-2 text-xs text-text-secondary">
            <CreditCard className="h-3 w-3" />
            {t('sales.payment.totalAmount')}
          </Label>
          <p className="text-sm font-medium text-text-primary">
            {formatCurrency(sale.payment.totalAmount)}
          </p>
        </div>

        {/* Paid Amount */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('sales.payment.paidAmount')}
          </Label>
          <p className="text-sm font-medium text-status-success">
            {formatCurrency(sale.payment.paidAmount)}
          </p>
        </div>

        {/* Due Amount */}
        {sale.payment.dueAmount > 0 && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('sales.payment.dueAmount')}
            </Label>
            <p className="text-sm font-medium text-status-error">
              {formatCurrency(sale.payment.dueAmount)}
            </p>
          </div>
        )}

        {/* Payment Mode */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('sales.payment.paymentMode')}
          </Label>
          <Badge variant="outline" size="sm" className="w-fit">
            {t(`sales.paymentMode.${sale.payment.paymentMode}`)}
          </Badge>
        </div>

        {/* Payment Status */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('sales.payment.status')}
          </Label>
          <Badge
            variant={getPaymentStatusVariant(sale.payment.paymentStatus)}
            size="sm"
            className="w-fit"
          >
            {t(`sales.paymentStatus.${sale.payment.paymentStatus}`)}
          </Badge>
        </div>

        {/* Due Date */}
        {sale.payment.dueDate && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('sales.payment.dueDate')}
            </Label>
            <p className="text-sm font-medium text-text-primary">
              {formatDate(sale.payment.dueDate)}
            </p>
          </div>
        )}

        {/* Number of Payments */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <Label className="flex items-center gap-2 text-xs text-text-secondary">
            <Hash className="h-3 w-3" />
            {t('sales.payment.numberOfPayments')}
          </Label>
          <p className="text-sm font-medium text-text-primary">
            {sale.payment.payments.length} {t('sales.payment.payments')}
          </p>
        </div>
      </div>
    </div>
  )

  // ========================================================================
  // OLD GOLD EXCHANGE SECTION
  // ========================================================================

  const OldGoldExchangeSection = () => {
    if (!sale.oldGoldExchange?.hasExchange || sale.oldGoldExchange.items.length === 0) {
      return (
        <div className="p-4">
          <p className="text-sm text-text-secondary">
            {t('sales.oldGold.noExchange')}
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-4 p-4">
        {/* Old Gold Items */}
        {sale.oldGoldExchange.items.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border border-border-secondary bg-bg-tertiary p-3"
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-text-tertiary">
                  {t('sales.oldGold.metalType')}
                </Label>
                <p className="text-sm font-medium text-text-primary">
                  {item.metalType} - {item.purity}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-xs text-text-tertiary">
                  {t('sales.oldGold.weight')}
                </Label>
                <p className="text-sm font-medium text-text-primary">
                  {item.netWeight}g (Gross: {item.grossWeight}g)
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-xs text-text-tertiary">
                  {t('sales.oldGold.ratePerGram')}
                </Label>
                <p className="text-sm font-medium text-text-primary">
                  {formatCurrency(item.ratePerGram)}/g
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-xs text-text-tertiary">
                  {t('sales.oldGold.totalValue')}
                </Label>
                <p className="text-sm font-semibold text-status-warning">
                  {formatCurrency(item.totalValue)}
                </p>
              </div>

              {item.description && (
                <div className="flex flex-col gap-1 md:col-span-2">
                  <Label className="text-xs text-text-tertiary">
                    {t('sales.oldGold.description')}
                  </Label>
                  <p className="text-sm text-text-secondary">{item.description}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Total Old Gold Value */}
        <div className="flex items-center justify-between rounded-lg border border-border-secondary bg-bg-primary p-3">
          <Label className="text-sm font-semibold text-text-primary">
            {t('sales.oldGold.totalValue')}
          </Label>
          <p className="text-lg font-bold text-status-warning">
            {formatCurrency(sale.oldGoldExchange.totalValue)}
          </p>
        </div>
      </div>
    )
  }

  // ========================================================================
  // DELIVERY INFORMATION SECTION
  // ========================================================================

  const DeliveryInfoSection = () => (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Delivery Type */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('sales.delivery.type')}
          </Label>
          <Badge variant="outline" size="sm" className="w-fit">
            {t(`sales.deliveryType.${sale.delivery.deliveryType}`)}
          </Badge>
        </div>

        {/* Delivery Date */}
        {sale.delivery.deliveryDate && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('sales.delivery.scheduledDate')}
            </Label>
            <p className="text-sm font-medium text-text-primary">
              {formatDate(sale.delivery.deliveryDate)}
            </p>
          </div>
        )}

        {/* Delivered At */}
        {sale.delivery.deliveredAt && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('sales.delivery.deliveredAt')}
            </Label>
            <p className="text-sm font-medium text-status-success">
              {formatDate(sale.delivery.deliveredAt)}
            </p>
          </div>
        )}

        {/* Delivery Address */}
        {sale.delivery.deliveryAddress && (
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label className="flex items-center gap-2 text-xs text-text-secondary">
              <MapPin className="h-3 w-3" />
              {t('sales.delivery.address')}
            </Label>
            <p className="text-sm text-text-secondary">
              {sale.delivery.deliveryAddress}
            </p>
          </div>
        )}

        {/* Courier Details */}
        {sale.delivery.courierDetails && (
          <>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-text-secondary">
                {t('sales.delivery.courierName')}
              </Label>
              <p className="text-sm font-medium text-text-primary">
                {sale.delivery.courierDetails.courierName}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-text-secondary">
                {t('sales.delivery.trackingNumber')}
              </Label>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm font-medium text-text-primary">
                  {sale.delivery.courierDetails.trackingNumber}
                </p>
                <CopyButton text={sale.delivery.courierDetails.trackingNumber} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )

  // ========================================================================
  // RENDER MAIN ACCORDION
  // ========================================================================

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      {/* Accordion Sections */}
      <Accordion
        type="multiple"
        defaultValue={['sale', 'customer', 'financials']}
        variant="separated"
        size="md"
      >
        {/* Sale Information */}
        <AccordionItem value="sale">
          <AccordionTrigger icon={<Receipt className="h-5 w-5" />}>
            {t('sales.sections.saleInformation')}
          </AccordionTrigger>
          <AccordionContent>
            <SaleInfoSection />
          </AccordionContent>
        </AccordionItem>

        {/* Customer Information */}
        <AccordionItem value="customer">
          <AccordionTrigger icon={<User className="h-5 w-5" />}>
            {t('sales.sections.customerInformation')}
          </AccordionTrigger>
          <AccordionContent>
            <CustomerInfoSection />
          </AccordionContent>
        </AccordionItem>

        {/* Financial Summary */}
        <AccordionItem value="financials">
          <AccordionTrigger icon={<IndianRupee className="h-5 w-5" />}>
            {t('sales.sections.financialSummary')}
          </AccordionTrigger>
          <AccordionContent>
            <FinancialSummarySection />
          </AccordionContent>
        </AccordionItem>

        {/* Payment Summary */}
        <AccordionItem value="payment">
          <AccordionTrigger icon={<CreditCard className="h-5 w-5" />}>
            {t('sales.sections.paymentSummary')}
          </AccordionTrigger>
          <AccordionContent>
            <PaymentSummarySection />
          </AccordionContent>
        </AccordionItem>

        {/* Old Gold Exchange */}
        {sale.oldGoldExchange?.hasExchange && (
          <AccordionItem value="oldgold">
            <AccordionTrigger icon={<Coins className="h-5 w-5" />}>
              {t('sales.sections.oldGoldExchange')}
            </AccordionTrigger>
            <AccordionContent>
              <OldGoldExchangeSection />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Delivery Information */}
        <AccordionItem value="delivery">
          <AccordionTrigger icon={<Package className="h-5 w-5" />}>
            {t('sales.sections.deliveryInformation')}
          </AccordionTrigger>
          <AccordionContent>
            <DeliveryInfoSection />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default OverviewTab