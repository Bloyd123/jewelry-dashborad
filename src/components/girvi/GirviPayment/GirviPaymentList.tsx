// FILE: src/components/girvi/GirviPayment/GirviPaymentList.tsx
import { useTranslation } from 'react-i18next'
import { Trash2, Receipt, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { Badge }  from '@/components/ui/data-display/Badge'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/overlay/Dialog/ConfirmDialog'
import { useGirviPayments }       from '@/hooks/girvi/useGirviPayments'
import { useGirviPaymentActions } from '@/hooks/girvi/useGirviPaymentActions'
import { GirviPaymentSummaryCard } from './GirviPaymentSummaryCard'
import type { GirviPayment } from '@/types/girvi.types'

const TYPE_VARIANTS: Record<string, any> = {
  interest_only:      'info',
  principal_partial:  'warning',
  principal_full:     'success',
  interest_principal: 'retail',
  release_payment:    'completed',
}

const TYPE_LABELS: Record<string, string> = {
  interest_only:      'Interest Only',
  principal_partial:  'Partial Principal',
  principal_full:     'Full Principal',
  interest_principal: 'Interest + Principal',
  release_payment:    'Release Payment',
}

const MODE_LABELS: Record<string, string> = {
  cash:          'Cash',
  upi:           'UPI',
  bank_transfer: 'Bank',
  cheque:        'Cheque',
}

const formatDate = (d: string) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(new Date(d))

const PaymentRow = ({
  payment,
  canDelete,
  onDelete,
  isDeleting,
}: {
  payment:    GirviPayment
  canDelete:  boolean
  onDelete:   (p: GirviPayment) => void
  isDeleting: boolean
}) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-lg border border-border-primary bg-bg-secondary">
      <div
        className="flex cursor-pointer items-center justify-between p-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10">
            <Receipt className="h-4 w-4 text-accent" />
          </div>
          <div>
            <p className="font-mono text-sm font-semibold text-text-primary">
              {payment.receiptNumber}
            </p>
            <p className="text-xs text-text-tertiary">{formatDate(payment.paymentDate)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={TYPE_VARIANTS[payment.paymentType]}>
            {TYPE_LABELS[payment.paymentType]}
          </Badge>
          <p className="font-bold text-accent">
            ₹{payment.netAmountReceived.toLocaleString('en-IN')}
          </p>
          {canDelete && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDelete(payment) }}
              disabled={isDeleting}
              className="rounded-lg p-1.5 text-status-error hover:bg-status-error/10 disabled:opacity-50"
              aria-label="Delete payment"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          {expanded
            ? <ChevronUp className="h-4 w-4 text-text-tertiary" />
            : <ChevronDown className="h-4 w-4 text-text-tertiary" />
          }
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border-primary px-4 pb-4 pt-3">
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
            <div>
              <p className="text-xs text-text-tertiary">Interest Received</p>
              <p className="font-medium text-text-primary">
                ₹{payment.interestReceived.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Principal Received</p>
              <p className="font-medium text-text-primary">
                ₹{payment.principalReceived.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Discount Given</p>
              <p className="font-medium text-status-warning">
                ₹{payment.discountGiven.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Payment Mode</p>
              <p className="font-medium text-text-primary">
                {MODE_LABELS[payment.paymentMode]}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Interest Type</p>
              <p className="font-medium capitalize text-text-primary">{payment.interestType}</p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Interest Days</p>
              <p className="font-medium text-text-primary">{payment.interestDays ?? '—'} days</p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Principal Before</p>
              <p className="font-medium text-text-primary">
                ₹{payment.principalBefore.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Principal After</p>
              <p className="font-medium text-status-success">
                ₹{payment.principalAfter.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {payment.transactionReference && (
            <p className="mt-2 text-xs text-text-tertiary">
              Ref: <span className="font-mono text-text-secondary">{payment.transactionReference}</span>
            </p>
          )}
          {payment.remarks && (
            <p className="mt-1 text-xs text-text-secondary">{payment.remarks}</p>
          )}
        </div>
      )}
    </div>
  )
}


interface GirviPaymentListProps {
  shopId:    string
  girviId:   string
  userRole?: string
}

export const GirviPaymentList = ({
  shopId,
  girviId,
  userRole = 'staff',
}: GirviPaymentListProps) => {
  const { t } = useTranslation()

  const {
    payments, summary, pagination,
    isLoading, goToPage,
  } = useGirviPayments(shopId, girviId)

  const { deletePayment, isDeleting } = useGirviPaymentActions(shopId)

  const [pendingDelete, setPendingDelete] = useState<GirviPayment | null>(null)

  const canDelete = ['super_admin', 'org_admin', 'shop_admin'].includes(userRole)

  const handleDeleteConfirmed = async () => {
    if (!pendingDelete) return
    await deletePayment(girviId, pendingDelete._id)
    setPendingDelete(null)
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-bg-tertiary" />
        ))}
      </div>
    )
  }

  if (!payments.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-border-primary bg-bg-secondary py-12 text-center">
        <Receipt className="mb-3 h-10 w-10 text-text-tertiary" />
        <p className="text-sm text-text-tertiary">{t('girviPayment.noPaymentsYet')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <GirviPaymentSummaryCard summary={summary} />

      <div className="space-y-2">
        {payments.map((payment) => (
          <PaymentRow
            key={payment._id}
            payment={payment}
            canDelete={canDelete}
            onDelete={setPendingDelete}
            isDeleting={isDeleting}
          />
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
          >
            {t('common.previous')}
          </Button>
          <span className="text-sm text-text-secondary">
            {pagination.currentPage} / {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
          >
            {t('common.next')}
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) => { if (!open) setPendingDelete(null) }}
        title={t('girviPayment.confirmDelete')}
        description={t('girviPayment.confirmDeleteDescription', {
          receipt: pendingDelete?.receiptNumber,
          amount:  pendingDelete?.netAmountReceived.toLocaleString('en-IN'),
        })}
        variant="danger"
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setPendingDelete(null)}
        loading={isDeleting}
      />
    </div>
  )
}