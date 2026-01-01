// ============================================================================
// FILE: src/components/features/Sales/tabs/PaymentsTab.tsx
// Sales Payments Tab Component with Timeline & Add Payment
// ============================================================================

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CreditCard,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  IndianRupee,
  Receipt,
  Download,
  Send,
  Banknote,
  Wallet,
  Building2,
  Smartphone,
  FileText,
} from 'lucide-react'
import { StatCard, StatCardGrid } from '@/components/ui/data-display/StatCard'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/overlay/Sheet/Sheet'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import type { Payment, PaymentRecord, PaymentMode } from '@/types/sale.types'

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface PaymentsTabProps {
  payment: Payment
  invoiceNumber: string
  saleId: string
  onAddPayment?: (paymentData: Partial<PaymentRecord>) => Promise<void>
}

// ============================================================================
// ADD PAYMENT FORM COMPONENT
// ============================================================================

const AddPaymentForm: React.FC<{
  isOpen: boolean
  onClose: () => void
  dueAmount: number
  onSubmit: (data: Partial<PaymentRecord>) => Promise<void>
}> = ({ isOpen, onClose, dueAmount, onSubmit }) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<PaymentRecord>>({
    amount: dueAmount,
    paymentMode: 'cash',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: '',
  })

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
      onClose()
      // Reset form
      setFormData({
        amount: dueAmount,
        paymentMode: 'cash',
        paymentDate: new Date().toISOString().split('T')[0],
        notes: '',
      })
    } catch (error) {
      console.error('Payment submission error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent size="lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-accent" />
            {t('sales.payment.addPayment')}
          </SheetTitle>
          <SheetDescription>
            {t('sales.payment.remainingAmount')}: {formatCurrency(dueAmount)}
          </SheetDescription>
        </SheetHeader>

        <SheetBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                {t('sales.payment.amount')} <span className="text-status-error">*</span>
              </Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
                <Input
                  id="amount"
                  type="number"
                  min="0.01"
                  max={dueAmount}
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: parseFloat(e.target.value) })
                  }
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-text-tertiary">
                {t('sales.payment.maxAmount')}: {formatCurrency(dueAmount)}
              </p>
            </div>

            {/* Payment Mode */}
            <div className="space-y-2">
              <Label htmlFor="paymentMode" className="text-sm font-medium">
                {t('sales.payment.paymentMode')} <span className="text-status-error">*</span>
              </Label>
              <Select
                value={formData.paymentMode}
                onValueChange={(value) =>
                  setFormData({ ...formData, paymentMode: value as PaymentMode })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">
                    <div className="flex items-center gap-2">
                      <Banknote className="h-4 w-4" />
                      {t('sales.paymentMode.cash')}
                    </div>
                  </SelectItem>
                  <SelectItem value="card">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      {t('sales.paymentMode.card')}
                    </div>
                  </SelectItem>
                  <SelectItem value="upi">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      {t('sales.paymentMode.upi')}
                    </div>
                  </SelectItem>
                  <SelectItem value="bank_transfer">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {t('sales.paymentMode.bank_transfer')}
                    </div>
                  </SelectItem>
                  <SelectItem value="cheque">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {t('sales.paymentMode.cheque')}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Date */}
            <div className="space-y-2">
              <Label htmlFor="paymentDate" className="text-sm font-medium">
                {t('sales.payment.paymentDate')} <span className="text-status-error">*</span>
              </Label>
              <Input
                id="paymentDate"
                type="date"
                value={formData.paymentDate}
                onChange={(e) =>
                  setFormData({ ...formData, paymentDate: e.target.value })
                }
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Transaction ID (for card/UPI/bank) */}
            {['card', 'upi', 'bank_transfer'].includes(formData.paymentMode || '') && (
              <div className="space-y-2">
                <Label htmlFor="transactionId" className="text-sm font-medium">
                  {t('sales.payment.transactionId')}
                </Label>
                <Input
                  id="transactionId"
                  type="text"
                  placeholder={t('sales.payment.enterTransactionId')}
                  value={formData.transactionId || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, transactionId: e.target.value })
                  }
                />
              </div>
            )}

            {/* Cheque Number */}
            {formData.paymentMode === 'cheque' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="chequeNumber" className="text-sm font-medium">
                    {t('sales.payment.chequeNumber')}
                  </Label>
                  <Input
                    id="chequeNumber"
                    type="text"
                    placeholder={t('sales.payment.enterChequeNumber')}
                    value={formData.chequeNumber || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, chequeNumber: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chequeDate" className="text-sm font-medium">
                    {t('sales.payment.chequeDate')}
                  </Label>
                  <Input
                    id="chequeDate"
                    type="date"
                    value={formData.chequeDate || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, chequeDate: e.target.value })
                    }
                  />
                </div>
              </>
            )}

            {/* Bank Name */}
            {['card', 'bank_transfer', 'cheque'].includes(formData.paymentMode || '') && (
              <div className="space-y-2">
                <Label htmlFor="bankName" className="text-sm font-medium">
                  {t('sales.payment.bankName')}
                </Label>
                <Input
                  id="bankName"
                  type="text"
                  placeholder={t('sales.payment.enterBankName')}
                  value={formData.bankName || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, bankName: e.target.value })
                  }
                />
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                {t('sales.payment.notes')}
              </Label>
              <Textarea
                id="notes"
                placeholder={t('sales.payment.enterNotes')}
                value={formData.notes || ''}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
              />
            </div>
          </form>
        </SheetBody>

        <SheetFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <span className="mr-2">...</span>}
            {t('sales.payment.addPayment')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

// ============================================================================
// PAYMENT TIMELINE COMPONENT
// ============================================================================

const PaymentTimeline: React.FC<{
  payments: PaymentRecord[]
}> = ({ payments }) => {
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

  // Get payment mode icon
  const getPaymentModeIcon = (mode: PaymentMode) => {
    switch (mode) {
      case 'cash':
        return <Banknote className="h-4 w-4" />
      case 'card':
        return <CreditCard className="h-4 w-4" />
      case 'upi':
        return <Smartphone className="h-4 w-4" />
      case 'bank_transfer':
        return <Building2 className="h-4 w-4" />
      case 'cheque':
        return <FileText className="h-4 w-4" />
      default:
        return <Wallet className="h-4 w-4" />
    }
  }

  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-border-secondary bg-bg-tertiary py-12">
        <Receipt className="mb-3 h-12 w-12 text-text-tertiary" />
        <p className="text-sm text-text-secondary">
          {t('sales.payment.noPaymentsYet')}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {payments.map((payment, index) => (
        <div
          key={payment._id || index}
          className="relative rounded-lg border border-border-secondary bg-bg-tertiary p-4 transition-all hover:shadow-md"
        >
          {/* Timeline Line */}
          {index < payments.length - 1 && (
            <div className="absolute left-8 top-16 h-full w-0.5 bg-border-secondary" />
          )}

          <div className="flex gap-4">
            {/* Icon */}
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-status-success/10">
              {getPaymentModeIcon(payment.paymentMode)}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-semibold text-text-primary">
                    {formatCurrency(payment.amount)}
                  </h4>
                  <p className="text-xs text-text-tertiary">
                    {formatDate(payment.paymentDate)}
                  </p>
                </div>
                <Badge variant="success" size="sm" dot>
                  {t(`sales.paymentMode.${payment.paymentMode}`)}
                </Badge>
              </div>

              {/* Transaction Details */}
              {(payment.transactionId ||
                payment.referenceNumber ||
                payment.chequeNumber) && (
                <div className="grid grid-cols-1 gap-2 rounded-md bg-bg-secondary p-3 text-xs md:grid-cols-2">
                  {payment.transactionId && (
                    <div>
                      <span className="text-text-tertiary">
                        {t('sales.payment.transactionId')}:
                      </span>
                      <p className="font-mono text-text-primary">
                        {payment.transactionId}
                      </p>
                    </div>
                  )}
                  {payment.referenceNumber && (
                    <div>
                      <span className="text-text-tertiary">
                        {t('sales.payment.referenceNumber')}:
                      </span>
                      <p className="font-mono text-text-primary">
                        {payment.referenceNumber}
                      </p>
                    </div>
                  )}
                  {payment.chequeNumber && (
                    <div>
                      <span className="text-text-tertiary">
                        {t('sales.payment.chequeNumber')}:
                      </span>
                      <p className="font-mono text-text-primary">
                        {payment.chequeNumber}
                      </p>
                    </div>
                  )}
                  {payment.bankName && (
                    <div>
                      <span className="text-text-tertiary">
                        {t('sales.payment.bank')}:
                      </span>
                      <p className="text-text-primary">{payment.bankName}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              {payment.notes && (
                <p className="text-sm text-text-secondary">{payment.notes}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const PaymentsTab: React.FC<PaymentsTabProps> = ({
  payment,
  invoiceNumber,
  saleId,
  onAddPayment,
}) => {
  const { t } = useTranslation()
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false)

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Get payment status variant
  const getStatusVariant = (status: string) => {
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

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return CheckCircle
      case 'unpaid':
        return AlertCircle
      case 'partial':
        return Clock
      default:
        return Clock
    }
  }

  const handleAddPayment = async (paymentData: Partial<PaymentRecord>) => {
    if (onAddPayment) {
      await onAddPayment(paymentData)
    }
    console.log('Payment added:', paymentData)
  }

  const handleDownloadReceipt = () => {
    console.log('Download receipt for:', invoiceNumber)
    // TODO: Implement receipt download
  }

  const handleSendReceipt = () => {
    console.log('Send receipt for:', invoiceNumber)
    // TODO: Implement send receipt
  }

  return (
    <div className="space-y-6">
      {/* Payment Summary Statistics */}
      <StatCardGrid columns={4} gap="md">
        <StatCard
          title={t('sales.payment.totalAmount')}
          value={formatCurrency(payment.totalAmount)}
          icon={IndianRupee}
          variant="default"
          size="md"
        />

        <StatCard
          title={t('sales.payment.paidAmount')}
          value={formatCurrency(payment.paidAmount)}
          icon={CheckCircle}
          variant="success"
          size="md"
        />

        <StatCard
          title={t('sales.payment.dueAmount')}
          value={formatCurrency(payment.dueAmount)}
          icon={AlertCircle}
          variant={payment.dueAmount > 0 ? 'error' : 'success'}
          size="md"
        />

        <StatCard
          title={t('sales.payment.numberOfPayments')}
          value={payment.payments.length}
          icon={Receipt}
          variant="info"
          size="md"
        />
      </StatCardGrid>

      {/* Payment Status Card */}
      <div className="rounded-lg border border-border-secondary bg-bg-secondary p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-text-primary">
                {t('sales.payment.paymentStatus')}
              </h3>
              <Badge variant={getStatusVariant(payment.paymentStatus)} size="md">
                {t(`sales.paymentStatus.${payment.paymentStatus}`)}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div>
                <span className="text-text-tertiary">
                  {t('sales.payment.paymentMode')}:
                </span>
                <span className="ml-2 font-medium text-text-primary">
                  {t(`sales.paymentMode.${payment.paymentMode}`)}
                </span>
              </div>

              {payment.dueDate && (
                <div>
                  <span className="text-text-tertiary">
                    {t('sales.payment.dueDate')}:
                  </span>
                  <span className="ml-2 font-medium text-text-primary">
                    {new Date(payment.dueDate).toLocaleDateString('en-IN')}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadReceipt}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {t('sales.payment.downloadReceipt')}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSendReceipt}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {t('sales.payment.sendReceipt')}
            </Button>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {payment.dueAmount > 0 && (
        <div className="flex justify-end">
          <Button
            onClick={() => setIsAddPaymentOpen(true)}
            className="gap-2"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            {t('sales.payment.addPayment')}
          </Button>
        </div>
      )}

      {/* Payment Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">
            {t('sales.payment.paymentHistory')}
          </h3>
          <Badge variant="outline" size="sm">
            {payment.payments.length} {t('sales.payment.payments')}
          </Badge>
        </div>

        <PaymentTimeline payments={payment.payments} />
      </div>

      {/* Add Payment Sheet */}
      <AddPaymentForm
        isOpen={isAddPaymentOpen}
        onClose={() => setIsAddPaymentOpen(false)}
        dueAmount={payment.dueAmount}
        onSubmit={handleAddPayment}
      />
    </div>
  )
}

export default PaymentsTab