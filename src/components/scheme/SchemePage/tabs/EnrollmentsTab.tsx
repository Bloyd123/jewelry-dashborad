// FILE: src/components/scheme/SchemePage/tabs/EnrollmentsTab.tsx
import { EnrollmentForm } from '@/components/scheme/EnrollmentForm'
import React, { useState } from 'react'
import { useTranslation }  from 'react-i18next'
import { Users, Plus }     from 'lucide-react'
import { DataTable }       from '@/components/ui/data-display/DataTable'
import { Badge }           from '@/components/ui/data-display/Badge'
import { Button }          from '@/components/ui/button'
import { ConfirmDialog }   from '@/components/ui/overlay/Dialog/ConfirmDialog'
import { Textarea }        from '@/components/ui/textarea'
import { Label }           from '@/components/ui/label'
import { Input }           from '@/components/ui/input'
import { StatCard, StatCardGrid } from '@/components/ui/data-display/StatCard'
import { useSchemeEnrollments }   from '@/hooks/scheme/useEnrollments'
import { useSchemeActions }       from '@/hooks/scheme/useSchemeActions'
import { usePermissionCheck }     from '@/hooks/auth/usePermissions'
import type { Scheme, SchemeEnrollment } from '@/types/scheme.types'
import type { DataTableColumn }   from '@/components/ui/data-display/DataTable'

interface EnrollmentsTabProps {
  scheme: Scheme
  shopId: string
}

export const EnrollmentsTab: React.FC<EnrollmentsTabProps> = ({
  scheme,
  shopId,
}) => {
  const { t }   = useTranslation()
  const { can } = usePermissionCheck()
const [showEnrollModal, setShowEnrollModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string | undefined>()

  // Dialogs
  const [cancelDialog, setCancelDialog] = useState<{
    open: boolean; enrollment: SchemeEnrollment | null; reason: string
  }>({ open: false, enrollment: null, reason: '' })

  const [paymentDialog, setPaymentDialog] = useState<{
    open: boolean
    enrollment: SchemeEnrollment | null
    amount: number
    paymentMode: string
    notes: string
  }>({
    open: false, enrollment: null,
    amount: 0, paymentMode: 'cash', notes: '',
  })

  const [redeemDialog, setRedeemDialog] = useState<{
    open: boolean
    enrollment: SchemeEnrollment | null
    redemptionMode: string
  }>({ open: false, enrollment: null, redemptionMode: 'cash' })

  const { enrollments, pagination, isLoading,refetch  } = useSchemeEnrollments(
    shopId,
    scheme._id,
    { page: currentPage, limit: 10, status: statusFilter }
  )

  const {
    cancelEnrollment,  isCancellingEnroll,
    recordPayment,     isRecordingPayment,
    matureEnrollment,  isMaturing,
    redeemEnrollment,  isRedeeming,
  } = useSchemeActions(shopId)

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(amount)

  const paymentModeOptions = [
    { value: 'cash',          label: t('common.paymentMode.cash')         },
    { value: 'card',          label: t('common.paymentMode.card')         },
    { value: 'upi',           label: t('common.paymentMode.upi')          },
    { value: 'cheque',        label: t('common.paymentMode.cheque')       },
    { value: 'bank_transfer', label: t('common.paymentMode.bankTransfer') },
  ]

  // ── Columns ──────────────────────────────────
  const columns: DataTableColumn<SchemeEnrollment>[] = [
    {
      id:          'enrollmentNumber',
      header:      t('scheme.enrollment.enrollmentNumber'),
      accessorKey: 'enrollmentNumber',
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium text-text-primary">
          {row.enrollmentNumber}
        </span>
      ),
    },
    {
      id:          'customer',
      header:      t('scheme.enrollment.customer'),
      accessorKey: 'customerDetails',
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium text-text-primary">
            {row.customerDetails?.customerName}
          </p>
          <p className="text-xs text-text-tertiary">
            {row.customerDetails?.phone}
          </p>
        </div>
      ),
    },
    {
      id:          'progress',
      header:      t('scheme.enrollment.progress'),
      accessorKey: 'paidInstallments',
      cell: ({ row }) => (
        <div className="w-32">
          <div className="mb-1 flex justify-between text-xs text-text-tertiary">
            <span>{row.paidInstallments}/{row.totalInstallments}</span>
            <span>
              {Math.round(
                (row.paidInstallments / row.totalInstallments) * 100
              )}%
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-bg-tertiary">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{
                width: `${
                  (row.paidInstallments / row.totalInstallments) * 100
                }%`,
              }}
            />
          </div>
        </div>
      ),
    },
    {
      id:          'totalPaid',
      header:      t('scheme.enrollment.totalPaid'),
      accessorKey: 'totalPaidAmount',
      align:       'right',
      cell: ({ row }) => (
        <span className="text-sm font-semibold text-text-primary">
          {formatCurrency(row.totalPaidAmount)}
        </span>
      ),
    },
    {
      id:          'nextDue',
      header:      t('scheme.enrollment.nextDue'),
      accessorKey: 'nextDueDate',
      cell: ({ row }) => (
        <span className="text-sm text-text-secondary">
          {row.nextDueDate
            ? new Date(row.nextDueDate).toLocaleDateString('en-IN')
            : '—'}
        </span>
      ),
    },
    {
      id:          'status',
      header:      t('scheme.enrollment.status'),
      accessorKey: 'status',
      cell: ({ row }) => {
        const variants: Record<string, string> = {
          active:    'active',
          matured:   'success',
          cancelled: 'error',
          redeemed:  'info',
        }
        return (
          <Badge variant={variants[row.status] as any} size="sm" dot>
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </Badge>
        )
      },
    },
    {
      id:     'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex gap-2">
          {row.status === 'active' && can('canManageSchemes') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPaymentDialog({
                  open:        true,
                  enrollment:  row,
                  amount:      row.installmentAmount,
                  paymentMode: 'cash',
                  notes:       '',
                })
              }
              className="h-7 text-xs"
            >
              {t('scheme.actions.recordPayment')}
            </Button>
          )}
          {row.status === 'active' &&
           row.paidInstallments >= row.totalInstallments &&
           can('canManageSchemes') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => matureEnrollment(row._id)}
              className="h-7 text-xs text-status-success"
            >
              {t('scheme.actions.mature')}
            </Button>
          )}
          {row.status === 'matured' && can('canManageSchemes') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setRedeemDialog({
                  open:           true,
                  enrollment:     row,
                  redemptionMode: 'cash',
                })
              }
              className="h-7 text-xs text-accent"
            >
              {t('scheme.actions.redeem')}
            </Button>
          )}
          {row.status === 'active' && can('canManageSchemes') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setCancelDialog({
                  open:       true,
                  enrollment: row,
                  reason:     '',
                })
              }
              className="h-7 text-xs text-status-error"
            >
              {t('scheme.actions.cancel')}
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4">
      {/* Stats */}
      <StatCardGrid columns={4} gap="md">
        <StatCard
          title={t('scheme.enrollment.total')}
          value={scheme.statistics?.totalEnrollments || 0}
          icon={Users}
          variant="info"
          size="md"
        />
        <StatCard
          title={t('scheme.enrollment.active')}
          value={scheme.statistics?.activeEnrollments || 0}
          icon={Users}
          variant="success"
          size="md"
        />
        <StatCard
          title={t('scheme.enrollment.completed')}
          value={scheme.statistics?.completedEnrollments || 0}
          icon={Users}
          variant="default"
          size="md"
        />
        <StatCard
          title={t('scheme.totalRevenue')}
          value={formatCurrency(scheme.statistics?.totalRevenue || 0)}
          icon={Users}
          variant="warning"
          size="md"
        />
      </StatCardGrid>

      {/* Table */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">
            {t('scheme.enrollment.list')}
          </h3>
{can('canManageSchemes') && (
  <Button
    variant="default"
    size="sm"
    className="gap-2"
    onClick={() => setShowEnrollModal(true)}  // ✅
  >
    <Plus className="h-4 w-4" />
    {t('scheme.actions.enroll')}
  </Button>
)}
        </div>

        <DataTable
          data={enrollments}
          columns={columns}
          pagination={{
            enabled:   true,
            pageSize:  10,
            pageIndex: currentPage - 1,
            totalItems:pagination?.total,
            totalPages:pagination?.pages,
            onPaginationChange: ({ pageIndex }) =>
              setCurrentPage(pageIndex + 1),
          }}
          sorting={{ enabled: true }}
          emptyState={{
            message: isLoading
              ? t('table.loading')
              : t('scheme.enrollment.noEnrollments'),
          }}
          style={{ hoverEffect: true, showBorder: true, rounded: true }}
        />
      </div>

      {/* Cancel Dialog */}
      <ConfirmDialog
        open={cancelDialog.open}
        onOpenChange={open => setCancelDialog(prev => ({ ...prev, open }))}
        title={t('scheme.actions.cancelEnrollment')}
        variant="danger"
        confirmLabel={t('scheme.actions.cancelEnrollment')}
        cancelLabel={t('common.cancel')}
        onConfirm={async () => {
          if (!cancelDialog.enrollment || !cancelDialog.reason.trim()) return
          await cancelEnrollment({
            enrollmentId: cancelDialog.enrollment._id,
            reason:       cancelDialog.reason,
          })
          setCancelDialog({ open: false, enrollment: null, reason: '' })
        }}
        loading={isCancellingEnroll}
        disabled={!cancelDialog.reason.trim()}
      >
        <div className="px-6 pb-4">
          <Label className="mb-1">{t('scheme.cancellationReason')} *</Label>
          <Textarea
            value={cancelDialog.reason}
            onChange={e =>
              setCancelDialog(prev => ({ ...prev, reason: e.target.value }))
            }
            rows={3}
            placeholder={t('scheme.cancellationReasonPlaceholder')}
          />
        </div>
      </ConfirmDialog>

      {/* Payment Dialog */}
      <ConfirmDialog
        open={paymentDialog.open}
        onOpenChange={open => setPaymentDialog(prev => ({ ...prev, open }))}
        title={t('scheme.actions.recordPayment')}
        variant="success"
        confirmLabel={t('scheme.actions.recordPayment')}
        cancelLabel={t('common.cancel')}
        onConfirm={async () => {
          if (!paymentDialog.enrollment || !paymentDialog.amount) return
          await recordPayment({
            enrollmentId: paymentDialog.enrollment._id,
            amount:       paymentDialog.amount,
            paymentMode:  paymentDialog.paymentMode as any,
            notes:        paymentDialog.notes,
          })
          setPaymentDialog({
            open: false, enrollment: null,
            amount: 0, paymentMode: 'cash', notes: '',
          })
        }}
        loading={isRecordingPayment}
        disabled={!paymentDialog.amount}
      >
        <div className="space-y-3 px-6 pb-4">
          <div>
            <Label className="mb-1">{t('scheme.payment.amount')} *</Label>
            <Input
              type="number"
              min={1}
              value={paymentDialog.amount || ''}
              onChange={e =>
                setPaymentDialog(prev => ({
                  ...prev,
                  amount: Number(e.target.value),
                }))
              }
              placeholder={t('scheme.payment.amountPlaceholder')}
            />
          </div>
          <div>
            <Label className="mb-1">{t('scheme.payment.paymentMode')} *</Label>
            <select
              value={paymentDialog.paymentMode}
              onChange={e =>
                setPaymentDialog(prev => ({
                  ...prev,
                  paymentMode: e.target.value,
                }))
              }
              className="w-full rounded-md border border-border-primary bg-bg-secondary px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
            >
              {paymentModeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label className="mb-1">{t('scheme.payment.notes')}</Label>
            <Textarea
              value={paymentDialog.notes}
              onChange={e =>
                setPaymentDialog(prev => ({ ...prev, notes: e.target.value }))
              }
              rows={2}
              placeholder={t('scheme.payment.notesPlaceholder')}
            />
          </div>
        </div>
      </ConfirmDialog>

      {/* Redeem Dialog */}
      <ConfirmDialog
        open={redeemDialog.open}
        onOpenChange={open => setRedeemDialog(prev => ({ ...prev, open }))}
        title={t('scheme.actions.redeem')}
        variant="info"
        confirmLabel={t('scheme.actions.redeem')}
        cancelLabel={t('common.cancel')}
        onConfirm={async () => {
          if (!redeemDialog.enrollment) return
          await redeemEnrollment({
            enrollmentId:   redeemDialog.enrollment._id,
            redemptionMode: redeemDialog.redemptionMode as any,
          })
          setRedeemDialog({ open: false, enrollment: null, redemptionMode: 'cash' })
        }}
        loading={isRedeeming}
      >
        <div className="px-6 pb-4">
          <Label className="mb-1">{t('scheme.redemption.mode')} *</Label>
          <select
            value={redeemDialog.redemptionMode}
            onChange={e =>
              setRedeemDialog(prev => ({
                ...prev,
                redemptionMode: e.target.value,
              }))
            }
            className="w-full rounded-md border border-border-primary bg-bg-secondary px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
          >
            <option value="cash">{t('scheme.redemption.cash')}</option>
            <option value="jewelry">{t('scheme.redemption.jewelry')}</option>
          </select>
        </div>
      </ConfirmDialog>
      <EnrollmentForm
  shopId={shopId}
  schemeId={scheme._id}
  scheme={scheme}
  open={showEnrollModal}
  onClose={() => setShowEnrollModal(false)}
  onSuccess={() => {
    setShowEnrollModal(false)
    refetch()           // enrollments list refresh
  }}
/>
    </div>
    
  )
}