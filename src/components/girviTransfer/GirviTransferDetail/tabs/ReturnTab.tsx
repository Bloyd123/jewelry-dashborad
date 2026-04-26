// FILE: src/components/girviTransfer/GirviTransferDetail/tabs/ReturnTab.tsx

import React, { useState } from 'react'
import { useTranslation }  from 'react-i18next'
import { CheckCircle }     from 'lucide-react'
import { StatCard, StatCardGrid } from '@/components/ui/data-display/StatCard'
import { Wallet, Calendar } from 'lucide-react'
import { Button }          from '@/components/ui/button'
import { useNavigate }     from 'react-router-dom'
import { GirviReturnForm } from '@/components/girviTransfer/GirviTransferReturn'
import { buildRoute }      from '@/constants/routePaths'
import type { IGirviTransfer } from '@/types/girviTransfer.types'

interface ReturnTabProps {
  transfer:   IGirviTransfer
  shopId:     string
  girviId:    string
  transferId: string
}

export const ReturnTab: React.FC<ReturnTabProps> = ({
  transfer,
  shopId,
  girviId,
  transferId,
}) => {
  const { t }      = useTranslation()
  const navigate   = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const isReturned = transfer.status === 'returned'

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">

      {/* Already Returned Banner */}
      {isReturned && (
        <div className="flex items-center gap-3 rounded-lg border border-status-success bg-status-success/10 p-4">
          <CheckCircle className="h-5 w-5 text-status-success" />
          <div>
            <p className="text-sm font-semibold text-text-primary">
              {t('girviTransfer.return.returned', 'Transfer has been returned')}
            </p>
            <p className="text-xs text-text-secondary">
              {transfer.returnDate
                ? new Date(transfer.returnDate).toLocaleDateString()
                : '-'}
            </p>
          </div>
        </div>
      )}

      {/* Initiate Return — info card + toggle to form */}
      {transfer.status === 'completed' && !showForm && (
        <div className="rounded-lg border border-border-primary bg-bg-secondary p-5 space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">
            {t('girviTransfer.return.initiateReturn', 'Initiate Return')}
          </h3>
          <p className="text-sm text-text-secondary">
            {t('girviTransfer.return.returnDesc',
              'Return this transfer to restore girvi status back to active.')}
          </p>
          <div className="flex items-center gap-2 rounded-lg bg-bg-tertiary p-3 text-xs text-text-secondary">
            <span>⚠️</span>
            <span>
              {t('girviTransfer.return.returnWarning',
                'This will restore girvi to active status with party interest added to outstanding amount.')}
            </span>
          </div>
          <Button size="sm" className="gap-2" onClick={() => setShowForm(true)}>
            <CheckCircle className="h-4 w-4" />
            {t('girviTransfer.return.processReturn', 'Process Return')}
          </Button>
        </div>
      )}

      {/* Return Form — shown after clicking Process Return */}
      {transfer.status === 'completed' && showForm && (
        <GirviReturnForm
          shopId={shopId}
          girviId={girviId}
          transferId={transferId}
          onSuccess={() => navigate(buildRoute.girvi.list(shopId))}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Return Details (if already returned) */}
      {isReturned && (
        <>
          <StatCardGrid columns={3}>
            <StatCard
              title={t('girviTransfer.return.returnDate', 'Return Date')}
              value={transfer.returnDate
                ? new Date(transfer.returnDate).toLocaleDateString()
                : '-'}
              icon={Calendar}
              variant="info"
              size="md"
            />
            <StatCard
              title={t('girviTransfer.return.partyInterest', 'Party Interest Charged')}
              value={`₹${Number(transfer.partyInterestCharged || 0).toLocaleString()}`}
              icon={Wallet}
              variant="warning"
              size="md"
            />
            <StatCard
              title={t('girviTransfer.return.returnAmount', 'Return Amount Paid')}
              value={`₹${Number(transfer.returnAmount || 0).toLocaleString()}`}
              icon={Wallet}
              variant="error"
              size="md"
            />
          </StatCardGrid>

          <div className="rounded-lg border border-border-primary bg-bg-secondary p-5 space-y-2">
            <h3 className="text-sm font-semibold text-text-primary">
              {t('girviTransfer.return.details', 'Return Details')}
            </h3>
            {[
              { label: 'Return Date',            value: transfer.returnDate ? new Date(transfer.returnDate).toLocaleDateString() : '-' },
              { label: 'Party Interest Days',    value: transfer.partyInterestDays },
              { label: 'Party Interest Charged', value: `₹${Number(transfer.partyInterestCharged || 0).toLocaleString()}` },
              { label: 'Return Amount Paid',     value: `₹${Number(transfer.returnAmount || 0).toLocaleString()}` },
              { label: 'Payment Mode',           value: transfer.returnPaymentMode },
              { label: 'Transaction Ref',        value: transfer.returnTransactionReference },
              { label: 'Return Reason',          value: transfer.returnReason },
              { label: 'Remarks',                value: transfer.returnRemarks },
            ].filter(r => r.value).map(row => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">{row.label}</span>
                <span className="font-medium capitalize text-text-primary">{String(row.value)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}