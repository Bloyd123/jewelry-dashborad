// FILE: src/components/purchase/PurchaseDetailPage/tabs/DeliveryTab.tsx

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle, Truck, MapPin, Calendar, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { StatCard, StatCardGrid } from '@/components/ui/data-display/StatCard'
import { ConfirmDialog } from '@/components/ui/overlay/Dialog/ConfirmDialog'
import { usePurchaseActions } from '@/hooks/purchase/usePurchaseActions'
import type { IPurchase } from '@/types/purchase.types'

interface DeliveryTabProps {
  purchase:   IPurchase
  shopId:     string
  purchaseId: string
}

export const DeliveryTab: React.FC<DeliveryTabProps> = ({
  purchase,
  shopId,
  purchaseId,
}) => {
  const { t } = useTranslation()
  const isReceived = !!purchase.delivery?.receivedDate

  const [showDialog,   setShowDialog]   = useState(false)
  const [receiveData,  setReceiveData]  = useState({
    receivedDate: new Date().toISOString().split('T')[0],
    notes:        '',
  })

  const { receivePurchase, isReceiving } = usePurchaseActions(shopId, purchaseId)

  const handleReceive = async () => {
    await receivePurchase({
      receivedDate: receiveData.receivedDate,
      notes:        receiveData.notes,
    })
    setShowDialog(false)
  }

  const timelineSteps = [
    {
      label:     'Order Placed',
      date:      new Date(purchase.createdAt).toLocaleDateString(),
      done:      true,
    },
    {
      label:     'Approved',
      date:      purchase.approvedAt ? new Date(purchase.approvedAt).toLocaleDateString() : null,
      done:      !!purchase.approvedAt,
    },
    {
      label:     'Expected Delivery',
      date:      purchase.delivery?.expectedDate
        ? new Date(purchase.delivery.expectedDate).toLocaleDateString()
        : 'Not set',
      done:      false,
      isCurrent: !isReceived,
    },
    {
      label: 'Received',
      date:  purchase.delivery?.receivedDate
        ? new Date(purchase.delivery.receivedDate).toLocaleDateString()
        : null,
      done: isReceived,
    },
  ]

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">

      {/* ── Summary Cards ── */}
      <StatCardGrid columns={4}>
        <StatCard
          title="Order Date"
          value={new Date(purchase.createdAt).toLocaleDateString()}
          icon={Calendar}
          variant="info"
          size="md"
        />
        <StatCard
          title="Expected"
          value={purchase.delivery?.expectedDate
            ? new Date(purchase.delivery.expectedDate).toLocaleDateString()
            : '-'}
          icon={Truck}
          variant="default"
          size="md"
        />
        <StatCard
          title="Received"
          value={purchase.delivery?.receivedDate
            ? new Date(purchase.delivery.receivedDate).toLocaleDateString()
            : 'Not yet'}
          icon={CheckCircle}
          variant={isReceived ? 'success' : 'warning'}
          size="md"
        />
        <StatCard
          title="Status"
          value={isReceived ? 'Delivered' : 'Pending'}
          icon={MapPin}
          variant={isReceived ? 'success' : 'warning'}
          size="md"
        />
      </StatCardGrid>

      {/* ── Delivery Details ── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border-primary bg-bg-secondary p-5 space-y-3">
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Delivery Address
          </h3>
          <p className="text-sm text-text-secondary">
            {purchase.delivery?.deliveryAddress ?? 'Not specified'}
          </p>
        </div>

        {isReceived && (
          <div className="rounded-lg border border-border-primary bg-bg-secondary p-5 space-y-3">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-status-success" />
              Receipt Details
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-text-secondary">Received On</Label>
                <p className="text-sm font-medium text-text-primary">
                  {new Date(purchase.delivery!.receivedDate!).toLocaleDateString()}
                </p>
              </div>
              {purchase.delivery?.notes && (
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-text-secondary">Notes</Label>
                  <p className="text-sm text-text-secondary">{purchase.delivery.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Timeline ── */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-5 space-y-4">
        <h3 className="text-sm font-semibold text-text-primary">Delivery Timeline</h3>
        <div className="relative space-y-4 pl-4">
          {timelineSteps.map((step, idx) => (
            <div key={idx} className="relative flex items-start gap-3">
              {idx < timelineSteps.length - 1 && (
                <div className="absolute left-[7px] top-5 h-full w-px bg-border-secondary" />
              )}
              <div className={`relative z-10 mt-0.5 h-4 w-4 flex-shrink-0 rounded-full border-2 ${
                step.done
                  ? 'border-status-success bg-status-success'
                  : step.isCurrent
                    ? 'border-status-warning bg-status-warning'
                    : 'border-border-secondary bg-bg-primary'
              }`} />
              <div className="flex-1 pb-4">
                <p className={`text-sm font-medium ${step.done ? 'text-text-primary' : 'text-text-tertiary'}`}>
                  {step.label}
                </p>
                {step.date && (
                  <p className="text-xs text-text-tertiary">{step.date}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mark as Received ── */}
      {!isReceived && purchase.status !== 'cancelled' && purchase.status !== 'returned' && (
        <div className="rounded-lg border border-border-primary bg-bg-secondary p-5 space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">Mark as Received</h3>
          <p className="text-sm text-text-secondary">
            Marking as received will update inventory and create ledger entries.
          </p>
          <div className="flex items-center gap-2 rounded-lg bg-bg-tertiary p-3 text-xs text-text-secondary">
            <span>⚠️</span>
            <span>This will update purchase status to Completed, add items to inventory, and update stock levels.</span>
          </div>
          <Button
            variant="default"
            size="sm"
            className="gap-2"
            onClick={() => setShowDialog(true)}
          >
            <CheckCircle className="h-4 w-4" />
            Confirm Receipt
          </Button>
        </div>
      )}

      {/* ── Confirm Dialog ── */}
      <ConfirmDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        title="Mark as Received?"
        variant="success"
        confirmLabel="Confirm Receipt"
        cancelLabel="Cancel"
        onConfirm={handleReceive}
        loading={isReceiving}
      >
        <div className="mt-3 space-y-3">
          <div>
            <Label className="text-xs text-text-secondary">Received Date</Label>
            <input
              type="date"
              value={receiveData.receivedDate}
              onChange={e => setReceiveData(prev => ({ ...prev, receivedDate: e.target.value }))}
              className="mt-1 w-full rounded-md border border-border-primary bg-bg-secondary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <Label className="text-xs text-text-secondary">Notes (Optional)</Label>
            <textarea
              value={receiveData.notes}
              onChange={e => setReceiveData(prev => ({ ...prev, notes: e.target.value }))}
              rows={2}
              placeholder="All items received in good condition..."
              className="mt-1 w-full rounded-md border border-border-primary bg-bg-secondary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>
      </ConfirmDialog>
    </div>
  )
}

export default DeliveryTab