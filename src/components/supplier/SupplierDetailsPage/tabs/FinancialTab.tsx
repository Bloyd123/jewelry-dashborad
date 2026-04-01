import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  TrendingUp,
  DollarSign,
  Calendar,
  CreditCard,
  AlertCircle,
  Plus,
  Download,
} from 'lucide-react'
import { StatCard } from '@/components/ui/data-display/StatCard/StatCard'
import { DataTable } from '@/components/ui/data-display/DataTable/DataTable'
import { Button } from '@/components/ui/button'
import type { DataTableColumn } from '@/components/ui/data-display/DataTable/DataTable.types'
import { SupplierManagementModal } from '@/components/supplier/SupplierManagementModal'
import type { ManagementAction } from '@/components/supplier/SupplierManagementModal/SupplierManagementModal.types'
import type { Supplier } from '@/types/supplier.types'
import type { Payment } from '@/types/payment.types'

// ─── HOOKS ──────────────────────────────────────────────────────────────────
import { useSupplierPayments } from '@/hooks/payment/usePaymentsList'
import { usePaymentActions } from '@/hooks/payment/usePaymentActions'
import { useAuth } from '@/hooks/auth'

// ─── PROPS ──────────────────────────────────────────────────────────────────
interface SupplierFinancialTabProps {
  supplier: Supplier
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
const SupplierFinancialTab: React.FC<SupplierFinancialTabProps> = ({ supplier }) => {
  const { t } = useTranslation()
  const { currentShopId } = useAuth()
  const shopId = currentShopId!

  // ── State ────────────────────────────────────────────────────────────────
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false)
  const [managementAction, setManagementAction] = useState<ManagementAction | null>(null)
  const [page, setPage] = useState(1)
  const limit = 10

  // ── Real API ─────────────────────────────────────────────────────────────
  const { payments, pagination, isLoading } = useSupplierPayments(
    shopId,
    supplier._id,
    { page, limit }
  )

  const { createPayment, isCreating } = usePaymentActions(shopId)

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleManagementSuccess = () => {
    setIsManagementModalOpen(false)
    setManagementAction(null)
  }

  const handleAddPayment = async () => {
    // Payment modal open hoga — abhi direct create nahi karte
    // Future mein AddPaymentModal banana hoga
    setManagementAction('update-balance')
    setIsManagementModalOpen(true)
  }

  // ── Formatters ───────────────────────────────────────────────────────────
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(Math.abs(amount))
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  // ── Credit Utilization ───────────────────────────────────────────────────
  const creditUtilization =
    supplier.creditLimit > 0
      ? Math.round((Math.abs(supplier.currentBalance) / supplier.creditLimit) * 100)
      : 0

  // ── Table Columns ────────────────────────────────────────────────────────
  const paymentColumns: DataTableColumn<Payment>[] = [
    {
      id: 'date',
      header: 'suppliers.financial.table.date',
      accessorKey: 'paymentDate',
      cell: ({ value }) => (
        <span className="text-text-primary">{formatDate(value)}</span>
      ),
      sortable: true,
    },
    {
      id: 'type',
      header: 'suppliers.financial.table.type',
      accessorKey: 'paymentType',
      cell: ({ value }) => {
        const typeStyles: Record<string, string> = {
          sale_payment:     'bg-status-success/10 text-status-success',
          purchase_payment: 'bg-status-info/10 text-status-info',
          refund:           'bg-status-warning/10 text-status-warning',
          advance_payment:  'bg-accent/10 text-accent',
          other:            'bg-bg-tertiary text-text-secondary',
        }
        return (
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize ${typeStyles[value] || typeStyles.other}`}
          >
            {value?.replace('_', ' ')}
          </span>
        )
      },
      sortable: true,
    },
    {
      id: 'paymentMode',
      header: 'suppliers.financial.table.mode',
      accessorKey: 'paymentMode',
      cell: ({ value }) => (
        <span className="text-sm capitalize text-text-secondary">
          {value}
        </span>
      ),
      sortable: true,
    },
    {
      id: 'amount',
      header: 'suppliers.financial.table.amount',
      accessorKey: 'amount',
      cell: ({ value, row }) => {
        const isReceipt = row.transactionType === 'receipt'
        return (
          <span
            className={`font-semibold ${isReceipt ? 'text-status-success' : 'text-status-error'}`}
          >
            {isReceipt ? '+' : '-'}
            {formatCurrency(value)}
          </span>
        )
      },
      align: 'right',
      sortable: true,
    },
    {
      id: 'status',
      header: 'suppliers.financial.table.status',
      accessorKey: 'status',
      cell: ({ value }) => {
        const statusStyles: Record<string, string> = {
          completed: 'bg-status-success/10 text-status-success',
          pending:   'bg-status-warning/10 text-status-warning',
          failed:    'bg-status-error/10 text-status-error',
          cancelled: 'bg-bg-tertiary text-text-secondary',
        }
        return (
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize ${statusStyles[value] || ''}`}
          >
            {value}
          </span>
        )
      },
      sortable: true,
    },
    {
      id: 'notes',
      header: 'suppliers.financial.table.note',
      accessorKey: 'notes',
      cell: ({ value }) => (
        <span className="text-sm text-text-secondary">{value || '-'}</span>
      ),
    },
  ]

  // ── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('suppliers.financial.currentBalance')}
          value={formatCurrency(supplier.currentBalance)}
          icon={DollarSign}
          variant={supplier.currentBalance > 0 ? 'error' : 'success'}
          size="md"
          subtitle={
            supplier.currentBalance > 0
              ? t('suppliers.financial.due')
              : t('suppliers.financial.advance')
          }
        />
        <StatCard
          title={t('suppliers.financial.totalDue')}
          value={formatCurrency(supplier.totalDue)}
          icon={AlertCircle}
          variant="warning"
          size="md"
          subtitle={t('suppliers.financial.overdueAmount', { days: 0 })}
        />
        <StatCard
          title={t('suppliers.financial.totalPurchases')}
          value={formatCurrency(supplier.totalPurchases)}
          icon={TrendingUp}
          variant="info"
          size="md"
          subtitle={t('suppliers.financial.lastMonths', { months: 6 })}
        />
        <StatCard
          title={t('suppliers.financial.totalPaid')}
          value={formatCurrency(supplier.totalPaid)}
          icon={CreditCard}
          variant="success"
          size="md"
          subtitle={t('suppliers.financial.allTime')}
        />
      </div>

      {/* Advance Payment & Credit Details */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">
            {t('suppliers.financial.advanceAndCredit')}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setManagementAction('update-balance')
              setIsManagementModalOpen(true)
            }}
            className="gap-2"
          >
            <span>{t('suppliers.financial.updateBalance')}</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border-secondary pb-2">
              <span className="text-sm text-text-secondary">
                {t('suppliers.financial.advancePayment')}
              </span>
              <span className="font-medium text-status-success">
                {formatCurrency(supplier.advancePayment || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-border-secondary pb-2">
              <span className="text-sm text-text-secondary">
                {t('suppliers.financial.creditLimit')}
              </span>
              <span className="font-medium text-text-primary">
                {formatCurrency(supplier.creditLimit)}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-border-secondary pb-2">
              <span className="text-sm text-text-secondary">
                {t('suppliers.financial.creditUsed')}
              </span>
              <span className="font-medium text-text-primary">
                {formatCurrency(Math.abs(supplier.currentBalance))} ({creditUtilization}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                {t('suppliers.financial.availableCredit')}
              </span>
              <span className="font-medium text-status-success">
                {formatCurrency(supplier.creditLimit - Math.abs(supplier.currentBalance))}
              </span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-text-secondary">
                  {t('suppliers.financial.creditUtilization')}
                </span>
                <span className="font-medium text-text-primary">{creditUtilization}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-bg-tertiary">
                <div
                  className={`h-full rounded-full transition-all ${
                    creditUtilization > 80
                      ? 'bg-status-error'
                      : creditUtilization > 60
                        ? 'bg-status-warning'
                        : 'bg-status-success'
                  }`}
                  style={{ width: `${Math.min(creditUtilization, 100)}%` }}
                />
              </div>
            </div>
            <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 flex-shrink-0 text-accent" />
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {t('suppliers.financial.paymentTerms')}
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">
                    {supplier.paymentTerms} • {supplier.creditPeriod}{' '}
                    {t('suppliers.financial.days')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History Table — REAL API */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary">
        <div className="flex items-center justify-between border-b border-border-primary px-6 py-4">
          <h3 className="text-lg font-semibold text-text-primary">
            {t('suppliers.financial.paymentHistory')}
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              <span>{t('suppliers.financial.export')}</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleAddPayment}
              disabled={isCreating}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>{t('suppliers.financial.addPayment')}</span>
            </Button>
          </div>
        </div>

        <DataTable
          data={payments}
          columns={paymentColumns}
          isLoading={isLoading}
          pagination={{
            enabled: true,
            pageSize: limit,
            pageSizeOptions: [5, 10, 20, 50],
            showPageInfo: true,
            showFirstLastButtons: true,
            currentPage: page,
            totalItems: pagination?.total ?? 0,
            onPageChange: setPage,
          }}
          sorting={{ enabled: true }}
          style={{ hoverEffect: true, zebraStripes: false }}
          emptyState={{
            message: t('suppliers.financial.noPayments'),
          }}
        />
      </div>

      {/* Management Modal */}
      <SupplierManagementModal
        open={isManagementModalOpen}
        onOpenChange={setIsManagementModalOpen}
        supplier={supplier}
        action={managementAction}
        onSuccess={handleManagementSuccess}
      />
    </div>
  )
}

export default SupplierFinancialTab