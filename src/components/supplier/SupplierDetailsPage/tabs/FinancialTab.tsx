import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  TrendingUp,
  TrendingDown,
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
import { dummySupplier } from '@/pages/suppliers/data'
import { SupplierManagementModal } from '@/components/supplier/SupplierManagementModal'
import type { ManagementAction } from '@/components/supplier/SupplierManagementModal/SupplierManagementModal.types'

//
// PAYMENT HISTORY TYPE
//

interface PaymentHistory {
  _id: string
  date: string
  type: 'Payment' | 'Purchase' | 'Refund' | 'Adjustment'
  amount: number
  balance: number
  note: string
  user: string
}

//
// DUMMY PAYMENT HISTORY DATA
//

const dummyPaymentHistory: PaymentHistory[] = [
  {
    _id: 'pay_001',
    date: '2024-12-15',
    type: 'Payment',
    amount: -200000,
    balance: 250000,
    note: 'Partial payment received',
    user: 'Amit Kumar',
  },
  {
    _id: 'pay_002',
    date: '2024-12-10',
    type: 'Purchase',
    amount: 450000,
    balance: 450000,
    note: 'Gold bars purchase',
    user: 'Rajesh Singh',
  },
  {
    _id: 'pay_003',
    date: '2024-12-05',
    type: 'Payment',
    amount: -300000,
    balance: 0,
    note: 'Full payment',
    user: 'Amit Kumar',
  },
  {
    _id: 'pay_004',
    date: '2024-12-01',
    type: 'Purchase',
    amount: 300000,
    balance: 300000,
    note: 'Gold coins',
    user: 'Rajesh Singh',
  },
  {
    _id: 'pay_005',
    date: '2024-11-25',
    type: 'Payment',
    amount: -500000,
    balance: 0,
    note: 'Full payment',
    user: 'Amit Kumar',
  },
  {
    _id: 'pay_006',
    date: '2024-11-20',
    type: 'Purchase',
    amount: 500000,
    balance: 500000,
    note: '22K gold purchase',
    user: 'Rajesh Singh',
  },
  {
    _id: 'pay_007',
    date: '2024-11-15',
    type: 'Refund',
    amount: -50000,
    balance: 0,
    note: 'Return credit',
    user: 'Amit Kumar',
  },
  {
    _id: 'pay_008',
    date: '2024-11-10',
    type: 'Purchase',
    amount: 350000,
    balance: 50000,
    note: '24K gold bars',
    user: 'Rajesh Singh',
  },
  {
    _id: 'pay_009',
    date: '2024-11-05',
    type: 'Payment',
    amount: -300000,
    balance: -300000,
    note: 'Advance payment',
    user: 'Amit Kumar',
  },
  {
    _id: 'pay_010',
    date: '2024-11-01',
    type: 'Purchase',
    amount: 400000,
    balance: 0,
    note: 'Gold purchase',
    user: 'Rajesh Singh',
  },
]

//
// MAIN COMPONENT
//

const SupplierFinancialTab: React.FC = () => {
  const { t } = useTranslation()

  const [paymentHistory] = useState<PaymentHistory[]>(dummyPaymentHistory)
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false)
  const [managementAction, setManagementAction] =
    useState<ManagementAction | null>(null)
  const handleManagementSuccess = () => {
    console.log('Action completed:', managementAction)
    // Refresh supplier data here
    setIsManagementModalOpen(false)
    setManagementAction(null)
  }

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(Math.abs(amount))
  }

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  // Calculate credit utilization percentage
  const creditUtilization = Math.round(
    (Math.abs(dummySupplier.currentBalance) / dummySupplier.creditLimit) * 100
  )

  // Payment history table columns
  const paymentColumns: DataTableColumn<PaymentHistory>[] = [
    {
      id: 'date',
      header: 'suppliers.financial.table.date',
      accessorKey: 'date',
      cell: ({ value }) => (
        <span className="text-text-primary">{formatDate(value)}</span>
      ),
      sortable: true,
    },
    {
      id: 'type',
      header: 'suppliers.financial.table.type',
      accessorKey: 'type',
      cell: ({ value }) => {
        const typeStyles = {
          Payment: 'bg-status-success/10 text-status-success',
          Purchase: 'bg-status-info/10 text-status-info',
          Refund: 'bg-status-warning/10 text-status-warning',
          Adjustment: 'bg-accent/10 text-accent',
        }
        return (
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${typeStyles[value as keyof typeof typeStyles]}`}
          >
            {value}
          </span>
        )
      },
      sortable: true,
    },
    {
      id: 'amount',
      header: 'suppliers.financial.table.amount',
      accessorKey: 'amount',
      cell: ({ value }) => (
        <span
          className={`font-semibold ${value > 0 ? 'text-status-error' : 'text-status-success'}`}
        >
          {value > 0 ? '+' : ''}
          {formatCurrency(value)}
        </span>
      ),
      align: 'right',
      sortable: true,
    },
    {
      id: 'balance',
      header: 'suppliers.financial.table.balance',
      accessorKey: 'balance',
      cell: ({ value }) => (
        <span
          className={`font-medium ${value > 0 ? 'text-status-error' : value < 0 ? 'text-status-success' : 'text-text-secondary'}`}
        >
          {formatCurrency(value)}
        </span>
      ),
      align: 'right',
      sortable: true,
    },
    {
      id: 'note',
      header: 'suppliers.financial.table.note',
      accessorKey: 'note',
      cell: ({ value }) => (
        <span className="text-sm text-text-secondary">{value}</span>
      ),
    },
    {
      id: 'user',
      header: 'suppliers.financial.table.user',
      accessorKey: 'user',
      cell: ({ value }) => (
        <span className="text-sm text-text-primary">{value}</span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Current Balance */}
        <StatCard
          title={t('suppliers.financial.currentBalance')}
          value={formatCurrency(dummySupplier.currentBalance)}
          icon={DollarSign}
          variant={dummySupplier.currentBalance > 0 ? 'error' : 'success'}
          size="md"
          subtitle={
            dummySupplier.currentBalance > 0
              ? t('suppliers.financial.due')
              : t('suppliers.financial.advance')
          }
        />

        {/* Total Due */}
        <StatCard
          title={t('suppliers.financial.totalDue')}
          value={formatCurrency(dummySupplier.totalDue)}
          icon={AlertCircle}
          variant="warning"
          size="md"
          subtitle={t('suppliers.financial.overdueAmount', { days: 0 })}
        />

        {/* Total Purchases */}
        <StatCard
          title={t('suppliers.financial.totalPurchases')}
          value={formatCurrency(dummySupplier.totalPurchases)}
          icon={TrendingUp}
          variant="info"
          size="md"
          subtitle={t('suppliers.financial.lastMonths', { months: 6 })}
        />

        {/* Total Paid */}
        <StatCard
          title={t('suppliers.financial.totalPaid')}
          value={formatCurrency(dummySupplier.totalPaid)}
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
                {formatCurrency(dummySupplier.advancePayment || 0)}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-border-secondary pb-2">
              <span className="text-sm text-text-secondary">
                {t('suppliers.financial.creditLimit')}
              </span>
              <span className="font-medium text-text-primary">
                {formatCurrency(dummySupplier.creditLimit)}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-border-secondary pb-2">
              <span className="text-sm text-text-secondary">
                {t('suppliers.financial.creditUsed')}
              </span>
              <span className="font-medium text-text-primary">
                {formatCurrency(Math.abs(dummySupplier.currentBalance))} (
                {creditUtilization}%)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                {t('suppliers.financial.availableCredit')}
              </span>
              <span className="font-medium text-status-success">
                {formatCurrency(
                  dummySupplier.creditLimit -
                    Math.abs(dummySupplier.currentBalance)
                )}
              </span>
            </div>
          </div>

          {/* Right Column - Progress Bar */}
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-text-secondary">
                  {t('suppliers.financial.creditUtilization')}
                </span>
                <span className="font-medium text-text-primary">
                  {creditUtilization}%
                </span>
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
                    {dummySupplier.paymentTerms} • {dummySupplier.creditPeriod}{' '}
                    {t('suppliers.financial.days')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary">
        <div className="flex items-center justify-between border-b border-border-primary px-6 py-4">
          <h3 className="text-lg font-semibold text-text-primary">
            {t('suppliers.financial.paymentHistory')}
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {}}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              <span>{t('suppliers.financial.export')}</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => {}}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>{t('suppliers.financial.addPayment')}</span>
            </Button>
          </div>
        </div>

        <DataTable
          data={paymentHistory}
          columns={paymentColumns}
          pagination={{
            enabled: true,
            pageSize: 10,
            pageSizeOptions: [5, 10, 20, 50],
            showPageInfo: true,
            showFirstLastButtons: true,
          }}
          sorting={{
            enabled: true,
          }}
          style={{
            hoverEffect: true,
            zebraStripes: false,
          }}
        />
      </div>
      <SupplierManagementModal
        open={isManagementModalOpen}
        onOpenChange={setIsManagementModalOpen}
        supplier={dummySupplier}
        action={managementAction}
        onSuccess={handleManagementSuccess}
      />
    </div>
  )
}

export default SupplierFinancialTab
