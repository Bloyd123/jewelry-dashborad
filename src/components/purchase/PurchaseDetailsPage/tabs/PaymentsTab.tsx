// FILE: src/components/purchase/PurchaseDetailPage/tabs/PaymentsTab.tsx

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PlusCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Label } from '@/components/ui/label'
import { StatCard, StatCardGrid } from '@/components/ui/data-display/StatCard'
import { Wallet, CreditCard, Calendar } from 'lucide-react'
import { usePurchasePayments } from '@/hooks/purchase/usePurchasePayments'
import type { IPurchase, PaymentMode } from '@/types/purchase.types'

interface PaymentsTabProps {
  purchase:   IPurchase
  shopId:     string
  purchaseId: string
}

const getPaymentVariant = (status: string) => {
  const map: Record<string, string> = {
    paid: 'success', partial: 'warning', unpaid: 'error', overdue: 'error',
  }
  return map[status] ?? 'default'
}

const getModeLabel = (mode: string) =>
  mode.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())

export const PaymentsTab: React.FC<PaymentsTabProps> = ({
  purchase,
  shopId,
  purchaseId,
}) => {
  const { t } = useTranslation()
  const [showForm, setShowForm] = useState(false)
  const [errors,   setErrors]   = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    amount:          0,
    paymentMode:     'cash' as PaymentMode,
    paymentDate:     new Date().toISOString().split('T')[0],
    transactionId:   '',
    chequeNumber:    '',
    bankName:        '',
    notes:           '',
  })

  const { payments, isLoading, isAddingPayment, addPayment } =
    usePurchasePayments(shopId, purchaseId)

  const paidPercent = purchase.financials.grandTotal > 0
    ? Math.round((purchase.payment.paidAmount / purchase.financials.grandTotal) * 100)
    : 0

  const daysUntilDue = purchase.payment.dueDate
    ? Math.ceil((new Date(purchase.payment.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => { const e = { ...prev }; delete e[field]; return e })
  }

  const handleSubmit = async () => {
    if (!formData.amount || Number(formData.amount) <= 0) {
      setErrors({ amount: 'Amount must be greater than 0' })
      return
    }
    const result = await addPayment(
      { ...formData, amount: Number(formData.amount) },
      setErrors
    )
    if (result.success) {
      setShowForm(false)
      setFormData({
        amount: 0, paymentMode: 'cash',
        paymentDate: new Date().toISOString().split('T')[0],
        transactionId: '', chequeNumber: '', bankName: '', notes: '',
      })
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">

      {/* ── Summary Cards ── */}
      <StatCardGrid columns={4}>
        <StatCard
          title="Total Amount"
          value={`₹${purchase.financials.grandTotal.toLocaleString()}`}
          icon={Wallet}
          variant="info"
          size="md"
        />
        <StatCard
          title="Paid"
          value={`₹${purchase.payment.paidAmount.toLocaleString()}`}
          icon={CreditCard}
          variant="success"
          size="md"
        />
        <StatCard
          title="Due"
          value={`₹${purchase.payment.dueAmount.toLocaleString()}`}
          icon={Wallet}
          variant="warning"
          size="md"
        />
        <StatCard
          title="Due Date"
          value={purchase.payment.dueDate
            ? new Date(purchase.payment.dueDate).toLocaleDateString()
            : 'N/A'}
          icon={Calendar}
          variant="default"
          size="md"
        />
      </StatCardGrid>

      {/* ── Progress Bar ── */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">Payment Progress</h3>
          {purchase.payment.paymentStatus !== 'paid' && purchase.status !== 'cancelled' && (
            <Button size="sm" className="gap-2" onClick={() => setShowForm(prev => !prev)}>
              <PlusCircle className="h-4 w-4" />
              Add Payment
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <div className="h-3 w-full overflow-hidden rounded-full bg-bg-tertiary">
            <div
              className="h-full rounded-full bg-status-success transition-all duration-500"
              style={{ width: `${paidPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>{paidPercent}% paid</span>
            {daysUntilDue !== null && (
              <span className={daysUntilDue < 0 ? 'text-status-error' : 'text-text-secondary'}>
                {daysUntilDue < 0
                  ? `${Math.abs(daysUntilDue)} days overdue`
                  : `${daysUntilDue} days remaining`}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm pt-1">
          <div>
            <Label className="text-xs text-text-secondary">Payment Terms</Label>
            <p className="text-sm font-medium text-text-primary mt-0.5">
              {purchase.payment.paymentTerms ?? '-'}
            </p>
          </div>
          <div>
            <Label className="text-xs text-text-secondary">Payment Mode</Label>
            <p className="text-sm font-medium capitalize text-text-primary mt-0.5">
              {getModeLabel(purchase.payment.paymentMode)}
            </p>
          </div>
          <div>
            <Label className="text-xs text-text-secondary">Status</Label>
            <div className="mt-0.5">
              <Badge variant={getPaymentVariant(purchase.payment.paymentStatus) as any} size="sm">
                {purchase.payment.paymentStatus}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* ── Add Payment Form ── */}
      {showForm && (
        <div className="rounded-lg border border-border-primary bg-bg-secondary p-5 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">New Payment</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label className="text-xs text-text-secondary">Amount *</Label>
              <input
                type="number"
                value={formData.amount}
                onChange={e => handleChange('amount', e.target.value)}
                className="mt-1 w-full rounded-md border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="0"
              />
              {errors.amount && <p className="text-xs text-status-error mt-1">{errors.amount}</p>}
            </div>

            <div>
              <Label className="text-xs text-text-secondary">Payment Mode *</Label>
              <select
                value={formData.paymentMode}
                onChange={e => handleChange('paymentMode', e.target.value)}
                className="mt-1 w-full rounded-md border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              >
                {['cash', 'card', 'upi', 'cheque', 'bank_transfer'].map(m => (
                  <option key={m} value={m}>{getModeLabel(m)}</option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-xs text-text-secondary">Payment Date</Label>
              <input
                type="date"
                value={formData.paymentDate}
                onChange={e => handleChange('paymentDate', e.target.value)}
                className="mt-1 w-full rounded-md border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            {['upi', 'card', 'bank_transfer'].includes(formData.paymentMode) && (
              <div>
                <Label className="text-xs text-text-secondary">Transaction ID</Label>
                <input
                  type="text"
                  value={formData.transactionId}
                  onChange={e => handleChange('transactionId', e.target.value)}
                  className="mt-1 w-full rounded-md border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            )}

            {formData.paymentMode === 'cheque' && (
              <>
                <div>
                  <Label className="text-xs text-text-secondary">Cheque Number</Label>
                  <input
                    type="text"
                    value={formData.chequeNumber}
                    onChange={e => handleChange('chequeNumber', e.target.value)}
                    className="mt-1 w-full rounded-md border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div>
                  <Label className="text-xs text-text-secondary">Bank Name</Label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={e => handleChange('bankName', e.target.value)}
                    className="mt-1 w-full rounded-md border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <Label className="text-xs text-text-secondary">Notes</Label>
              <textarea
                value={formData.notes}
                onChange={e => handleChange('notes', e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-md border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSubmit} disabled={isAddingPayment}>
              {isAddingPayment
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Adding...</>
                : 'Add Payment'
              }
            </Button>
          </div>
        </div>
      )}

      {/* ── Payment History ── */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-5 space-y-4">
        <h3 className="text-sm font-semibold text-text-primary">
          Payment History ({isLoading ? '...' : payments.length})
        </h3>

        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
          </div>
        ) : payments.length === 0 ? (
          <p className="text-sm text-text-tertiary py-4 text-center">No payments made yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-secondary text-left">
                  {['Date', 'Amount', 'Mode', 'Ref No.'].map(h => (
                    <th key={h} className="pb-2 pr-4 text-xs font-medium text-text-secondary">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-secondary">
                {(Array.isArray(payments) ? payments : []).map((pay: any, idx: number) => (
                  <tr key={pay._id ?? idx} className="hover:bg-bg-tertiary transition-colors">
                    <td className="py-3 pr-4 text-text-secondary">
                      {new Date(pay.paymentDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-4 font-semibold text-text-primary">
                      ₹{Number(pay.amount).toLocaleString()}
                    </td>
                    <td className="py-3 pr-4 capitalize text-text-secondary">
                      {getModeLabel(pay.paymentMode)}
                    </td>
                    <td className="py-3 pr-4 text-text-secondary font-mono text-xs">
                      {pay.transactionId ?? pay.chequeNumber ?? pay.referenceNumber ?? '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentsTab