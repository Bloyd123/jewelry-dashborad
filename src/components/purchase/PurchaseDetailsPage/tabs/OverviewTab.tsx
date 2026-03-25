// FILE: src/components/purchase/PurchaseDetailPage/tabs/OverviewTab.tsx

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, Tag, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Label } from '@/components/ui/label'
import { StatCard, StatCardGrid } from '@/components/ui/data-display/StatCard'
import { ConfirmDialog } from '@/components/ui/overlay/Dialog/ConfirmDialog'
import { Wallet, TrendingDown, Package } from 'lucide-react'
import { usePurchaseActions } from '@/hooks/purchase/usePurchaseActions'
import { useNavigate } from 'react-router-dom'
import type { IPurchase } from '@/types/purchase.types'

interface OverviewTabProps {
  purchase:   IPurchase
  shopId:     string
  purchaseId: string
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  purchase,
  shopId,
  purchaseId,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [approveDialog, setApproveDialog] = useState(false)
  const [rejectDialog,  setRejectDialog]  = useState(false)
  const [rejectReason,  setRejectReason]  = useState('')

  const { approvePurchase, rejectPurchase, isApproving, isRejecting } =
    usePurchaseActions(shopId, purchaseId)

  const handleApprove = async () => {
    await approvePurchase()
    setApproveDialog(false)
  }

  const handleReject = async () => {
    await rejectPurchase(rejectReason)
    setRejectDialog(false)
    setRejectReason('')
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">

      {/* ── Approval Banner ── */}
      {purchase.approvalStatus === 'pending' && (
        <div className="flex items-center justify-between rounded-lg border border-status-warning bg-status-warning/10 p-4">
          <p className="text-sm font-medium text-text-primary">
            {t('purchase.overview.pendingApproval', 'This purchase is pending approval')}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setRejectDialog(true)}
              disabled={isRejecting}
              className="gap-2 border-status-error text-status-error hover:bg-status-error/10"
            >
              <XCircle className="h-4 w-4" />
              {t('purchase.actions.reject', 'Reject')}
            </Button>
            <Button
              size="sm"
              onClick={() => setApproveDialog(true)}
              disabled={isApproving}
              className="gap-2"
            >
              {isApproving
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <CheckCircle className="h-4 w-4" />
              }
              {t('purchase.actions.approve', 'Approve')}
            </Button>
          </div>
        </div>
      )}

      {/* ── Quick Summary Cards ── */}
      <StatCardGrid columns={4}>
        <StatCard
          title={t('purchase.overview.grandTotal', 'Grand Total')}
          value={`₹${purchase.financials.grandTotal.toLocaleString()}`}
          icon={Wallet}
          variant="info"
          size="md"
        />
        <StatCard
          title={t('purchase.overview.paidAmount', 'Paid Amount')}
          value={`₹${purchase.payment.paidAmount.toLocaleString()}`}
          icon={TrendingDown}
          variant="success"
          size="md"
        />
        <StatCard
          title={t('purchase.overview.dueAmount', 'Due Amount')}
          value={`₹${purchase.payment.dueAmount.toLocaleString()}`}
          icon={Wallet}
          variant="warning"
          size="md"
        />
        <StatCard
          title={t('purchase.overview.items', 'Items')}
          value={purchase.items.length}
          icon={Package}
          variant="default"
          size="md"
        />
      </StatCardGrid>

      {/* ── Supplier + Purchase Info ── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        {/* Supplier Details */}
        <div className="rounded-lg border border-border-primary bg-bg-secondary p-5 space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">
            {t('purchase.overview.supplierDetails', 'Supplier Details')}
          </h3>
          <div className="space-y-2">
            {[
              { label: 'Name',    value: purchase.supplierDetails.supplierName },
              { label: 'Code',    value: purchase.supplierDetails.supplierCode },
              { label: 'Contact', value: purchase.supplierDetails.contactPerson },
              { label: 'Phone',   value: purchase.supplierDetails.phone },
              { label: 'Email',   value: purchase.supplierDetails.email },
              { label: 'GST',     value: purchase.supplierDetails.gstNumber },
            ].filter(r => r.value).map(row => (
              <div key={row.label} className="flex items-center justify-between">
                <Label className="text-xs text-text-secondary">{row.label}</Label>
                <p className="text-sm font-medium text-text-primary">{row.value}</p>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 mt-2"
            onClick={() => navigate(`/suppliers/${purchase.supplierId}`)}
          >
            <Eye className="h-4 w-4" />
            {t('purchase.supplier.viewDetails', 'View Supplier Details')}
          </Button>
        </div>

        {/* Purchase Info */}
        <div className="rounded-lg border border-border-primary bg-bg-secondary p-5 space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">
            {t('purchase.overview.purchaseInfo', 'Purchase Information')}
          </h3>
          <div className="space-y-2">
            {[
              { label: 'PO Number',     value: purchase.purchaseNumber },
              { label: 'Purchase Date', value: new Date(purchase.purchaseDate).toLocaleDateString() },
              { label: 'Purchase Type', value: purchase.purchaseType.replace('_', ' ') },
              { label: 'Due Date',      value: purchase.payment.dueDate ? new Date(purchase.payment.dueDate).toLocaleDateString() : '-' },
              { label: 'Payment Terms', value: purchase.payment.paymentTerms ?? '-' },
              { label: 'Approval',      value: purchase.approvalStatus },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between">
                <Label className="text-xs text-text-secondary">{row.label}</Label>
                <p className="text-sm font-medium capitalize text-text-primary">{row.value}</p>
              </div>
            ))}
          </div>

          {/* Status Timeline */}
          <div className="mt-3 space-y-1 border-t border-border-secondary pt-3">
            <Label className="text-xs text-text-secondary">Status Timeline</Label>
            <div className="flex flex-col gap-1 pt-1">
              {[
                { label: 'Created',  date: new Date(purchase.createdAt).toLocaleDateString(), done: true },
                { label: 'Approved', date: purchase.approvedAt ? new Date(purchase.approvedAt).toLocaleDateString() : null, done: !!purchase.approvedAt },
                { label: 'Received', date: purchase.delivery?.receivedDate ? new Date(purchase.delivery.receivedDate).toLocaleDateString() : null, done: !!purchase.delivery?.receivedDate },
              ].map(step => (
                <div key={step.label} className="flex items-center gap-2 text-xs">
                  <span className={step.done ? 'text-status-success' : 'text-text-tertiary'}>
                    {step.done ? '✅' : '⭕'}
                  </span>
                  <span className={step.done ? 'text-text-primary' : 'text-text-tertiary'}>
                    {step.label}
                  </span>
                  {step.date && <span className="text-text-tertiary">— {step.date}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Items Table ── */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">Purchase Items</h3>
          <span className="text-xs text-text-tertiary">{purchase.items.length} items</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-secondary text-left">
                {['#', 'Product', 'Metal', 'Purity', 'Gross', 'Net', 'Rate/g', 'Total'].map(h => (
                  <th key={h} className="pb-2 pr-4 text-xs font-medium text-text-secondary">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-secondary">
              {purchase.items.map((item, idx) => (
                <tr key={item._id ?? idx} className="hover:bg-bg-tertiary transition-colors">
                  <td className="py-3 pr-4 text-text-tertiary">{idx + 1}</td>
                  <td className="py-3 pr-4">
                    <p className="font-medium text-text-primary">{item.productName}</p>
                    {item.huid && <p className="text-xs text-text-tertiary">HUID: {item.huid}</p>}
                  </td>
                  <td className="py-3 pr-4 capitalize text-text-secondary">{item.metalType}</td>
                  <td className="py-3 pr-4 text-text-secondary">{item.purity}</td>
                  <td className="py-3 pr-4 text-text-secondary">{item.grossWeight}g</td>
                  <td className="py-3 pr-4 text-text-secondary">{item.netWeight}g</td>
                  <td className="py-3 pr-4 text-text-secondary">₹{item.ratePerGram}/g</td>
                  <td className="py-3 font-semibold text-text-primary">
                    ₹{Number(item.itemTotal).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Financial + Weight Summary ── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border-primary bg-bg-secondary p-5 space-y-2">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Financial Breakdown</h3>
          {[
            { label: 'Subtotal',  value: purchase.financials.subtotal },
            { label: 'Total GST', value: purchase.financials.totalGst },
            { label: 'Round Off', value: purchase.financials.roundOff },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">{row.label}</span>
              <span className="text-text-primary">₹{Number(row.value).toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t border-border-secondary pt-2 mt-2 flex items-center justify-between">
            <span className="font-semibold text-text-primary">Grand Total</span>
            <span className="text-lg font-bold text-text-primary">
              ₹{purchase.financials.grandTotal.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-border-primary bg-bg-secondary p-5 space-y-2">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Weight Summary</h3>
          {[
            { label: 'Total Gross', value: `${purchase.items.reduce((s, i) => s + i.grossWeight * i.quantity, 0).toFixed(2)}g` },
            { label: 'Total Stone', value: `${purchase.items.reduce((s, i) => s + i.stoneWeight * i.quantity, 0).toFixed(2)}g` },
            { label: 'Total Net',   value: `${purchase.items.reduce((s, i) => s + i.netWeight   * i.quantity, 0).toFixed(2)}g` },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">{row.label}</span>
              <span className="font-medium text-text-primary">{row.value}</span>
            </div>
          ))}
          <div className="border-t border-border-secondary pt-2 mt-2">
            <p className="text-xs text-text-secondary mb-2">By Metal Type</p>
            {Object.entries(
              purchase.items.reduce<Record<string, number>>((acc, item) => {
                const key = `${item.metalType} ${item.purity}`
                acc[key] = (acc[key] ?? 0) + item.netWeight * item.quantity
                return acc
              }, {})
            ).map(([key, weight]) => (
              <div key={key} className="flex items-center justify-between text-xs">
                <span className="text-text-tertiary capitalize">{key}</span>
                <span className="text-text-secondary">{(weight as number).toFixed(2)}g</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Notes + Tags ── */}
      {(purchase.notes || purchase.internalNotes || (purchase.tags?.length ?? 0) > 0) && (
        <div className="rounded-lg border border-border-primary bg-bg-secondary p-5 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">Notes & Tags</h3>
          {purchase.notes && (
            <div className="space-y-1">
              <Label className="text-xs text-text-secondary">Notes</Label>
              <p className="text-sm text-text-secondary">{purchase.notes}</p>
            </div>
          )}
          {purchase.internalNotes && (
            <div className="space-y-1">
              <Label className="text-xs text-text-secondary">🔒 Internal Notes</Label>
              <p className="text-sm text-text-secondary">{purchase.internalNotes}</p>
            </div>
          )}
          {purchase.tags && purchase.tags.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs text-text-secondary flex items-center gap-1">
                <Tag className="h-3 w-3" /> Tags
              </Label>
              <div className="flex flex-wrap gap-2">
                {purchase.tags.map(tag => (
                  <Badge key={tag} variant="outline" size="sm">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Approve Dialog ── */}
      <ConfirmDialog
        open={approveDialog}
        onOpenChange={setApproveDialog}
        title="Approve Purchase?"
        description={`Approve ${purchase.purchaseNumber}?`}
        variant="success"
        confirmLabel="Approve"
        cancelLabel="Cancel"
        onConfirm={handleApprove}
        loading={isApproving}
      />

      {/* ── Reject Dialog ── */}
      <ConfirmDialog
        open={rejectDialog}
        onOpenChange={setRejectDialog}
        title="Reject Purchase?"
        variant="danger"
        confirmLabel="Reject"
        cancelLabel="Cancel"
        onConfirm={handleReject}
        loading={isRejecting}
      >
        <textarea
          className="mt-2 w-full rounded-md border border-border-primary bg-bg-secondary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
          rows={3}
          placeholder="Enter rejection reason..."
          value={rejectReason}
          onChange={e => setRejectReason(e.target.value)}
        />
      </ConfirmDialog>
    </div>
  )
}

export default OverviewTab