// FILE: src/components/payments/PaymentTable/PaymentTable.tsx
// Main Payment Table Component

import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { DataTable } from '@/components/ui/data-display/DataTable'
import { paymentTableColumns } from './PaymentTableColumns'
import { getPaymentRowActions, BulkActionsBar } from './PaymentTableActions'
import type { Payment } from './PaymentTable.types'
import { usePaymentsList } from '@/hooks/payment/usePaymentsList'
import { usePaymentActions } from '@/hooks/payment/usePaymentActions'
import { useAuth } from '@/hooks/auth'
import {
  PaymentFilters,
  PaymentFilterState,
} from '@/components/payments/PaymentFilters'
import type {
  PaymentType,
  TransactionType,
  PaymentMode,
  PaymentStatus,
  PartyType,
} from '@/types/payment.types'
// MAIN COMPONENT

export const PaymentTable: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { currentShopId, userRole } = useAuth()
  const shopId = currentShopId || ''

  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())
  const [filters, setFilters] = useState<PaymentFilterState>({} as PaymentFilterState)

  const {
    payments,
    pagination,
    isLoading,
    updateFilter,
    updateFilters,
    resetFilters,
    goToPage,
  } = usePaymentsList(shopId, {
    search:          filters.search,
    paymentType:     filters.paymentType as any,
    transactionType: filters.transactionType as any,
    paymentMode:     filters.paymentMode as any,
    status:          filters.status as any,
    partyType:       filters.partyType as any,
    startDate:       filters.dateRange?.from?.toISOString(),
    endDate:         filters.dateRange?.to?.toISOString(),
    minAmount:       filters.amountRange?.min,
    maxAmount:       filters.amountRange?.max,
    ...(filters.isReconciled !== undefined && {
      // pass as query param — backend handles it
    }),
  })

  const {
    markAsCompleted,
    cancelPayment,
    reconcilePayment,
    deletePayment,
    bulkReconcile,
    bulkExport,
    bulkPrintReceipts,
    isMarkingCompleted,
    isCancelling,
    isReconciling,
    isDeleting,
  } = usePaymentActions(shopId)
  // FILTER HANDLER
const handleFilterChange = (newFilters: PaymentFilterState) => {
  setFilters(newFilters)
  updateFilters({
    search:          newFilters.search || undefined,
    paymentType:     newFilters.paymentType as PaymentType | undefined,
    transactionType: newFilters.transactionType as TransactionType | undefined,
    paymentMode:     newFilters.paymentMode as PaymentMode | undefined,
    status:          newFilters.status as PaymentStatus | undefined,
    partyType:       newFilters.partyType as PartyType | undefined,
    startDate:       newFilters.dateRange?.from?.toISOString(),
    endDate:         newFilters.dateRange?.to?.toISOString(),
    minAmount:       newFilters.amountRange?.min,
    maxAmount:       newFilters.amountRange?.max,
  })
}
const handleViewDetails = (payment: Payment) => {
  navigate(`/payments/${payment._id}`)
}

const handleEdit = (payment: Payment) => {
  navigate(`/payments/edit/${payment._id}`)
}

const handleViewReceipt = (payment: Payment) => {
  if (payment.receipt.receiptUrl) {
    window.open(payment.receipt.receiptUrl, '_blank')
  }
}

const handleSendReceipt = (payment: Payment) => {
  // TODO: open send receipt modal — wire when modal is ready
}

const handleMarkCompleted = async (payment: Payment) => {
  await markAsCompleted(payment._id)
}

const handleCancel = async (payment: Payment) => {
  const reason = window.prompt(t('payment.cancelReasonPrompt'))
  if (!reason) return
  await cancelPayment(payment._id, reason)
}

const handleReconcile = async (payment: Payment) => {
  const ref = window.prompt(t('payment.reconcileRefPrompt'))
  if (!ref) return
  await reconcilePayment(payment._id, { reconciledWith: ref })
}

const handleProcessRefund = (payment: Payment) => {
  navigate(`/payments/${payment._id}/refund`)
}

const handleDelete = async (payment: Payment) => {
  const confirmed = window.confirm(t('payment.deleteConfirm'))
  if (!confirmed) return
  await deletePayment(payment._id)
}



const handleBulkViewDetails = () => {
  if (selectedPayments.length === 1) {
    handleViewDetails(selectedPayments[0])
  }
}

const handleBulkViewReceipts = () => {
  selectedPayments.forEach(p => {
    if (p.receipt.receiptUrl) window.open(p.receipt.receiptUrl, '_blank')
  })
}

const handleBulkSendReceipts = () => {
  // TODO: open bulk send receipt modal
}

const handleBulkReconcile = async () => {
  const ref = window.prompt(t('payment.reconcileRefPrompt'))
  if (!ref) return
  await bulkReconcile({
    paymentIds:     selectedPayments.map(p => p._id),
    reconciledWith: ref,
  })
  setSelectedRows(new Set())
}

const handleBulkExport = async () => {
  await bulkExport({
    paymentIds: selectedPayments.map(p => p._id),
    format:     'excel',
  })
}

const handleBulkPrint = async () => {
  await bulkPrintReceipts(selectedPayments.map(p => p._id))
}

const handleBulkCancel = async () => {
  const reason = window.prompt(t('payment.cancelReasonPrompt'))
  if (!reason) return
  for (const p of selectedPayments) {
    await cancelPayment(p._id, reason)
  }
  setSelectedRows(new Set())
}

const handleBulkDelete = async () => {
  const confirmed = window.confirm(
    t('payment.bulkDeleteConfirm', { count: selectedPayments.length })
  )
  if (!confirmed) return
  for (const p of selectedPayments) {
    if (p.status === 'pending') await deletePayment(p._id)
  }
  setSelectedRows(new Set())
}

  const handleClearSelection = () => {
    setSelectedRows(new Set())
  }

  // ROW ACTIONS

  const rowActions = useMemo(
    () =>
      getPaymentRowActions(
        handleViewDetails,
        handleEdit,
        handleViewReceipt,
        handleSendReceipt,
        handleMarkCompleted,
        handleCancel,
        handleReconcile,
        handleProcessRefund,
        handleDelete,
        userRole ?? 'staff'  
      ),
  [userRole, handleMarkCompleted, handleCancel, handleReconcile, handleDelete]
  )

  // SELECTED PAYMENTS

const selectedPayments = useMemo(() => {
  return payments.filter(payment => selectedRows.has(payment._id))
}, [selectedRows, payments])

  // RENDER

  return (
    <div className="w-full space-y-4">
      {/* Filters */}
<PaymentFilters
  filters={filters}
  onFiltersChange={handleFilterChange}
onClearAll={() => {
  setFilters({} as PaymentFilterState)
  resetFilters()
  updateFilters({
    search:          undefined,
    paymentType:     undefined,
    transactionType: undefined,
    paymentMode:     undefined,
    status:          undefined,
    partyType:       undefined,
    startDate:       undefined,
    endDate:         undefined,
    minAmount:       undefined,
    maxAmount:       undefined,
  })
}}
/>
      {/* Bulk Actions Bar */}
      {selectedRows.size > 0 && (
        <BulkActionsBar
          selectedCount={selectedRows.size}
          selectedPayments={selectedPayments}
          onViewDetails={handleBulkViewDetails}
          onViewReceipts={handleBulkViewReceipts}
          onSendReceipts={handleBulkSendReceipts}
          onBulkReconcile={handleBulkReconcile}
          onEdit={() => {
  if (selectedPayments.length === 1) handleEdit(selectedPayments[0])
}}
onMarkCompleted={async () => {
  for (const p of selectedPayments) {
    if (p.status === 'pending') await markAsCompleted(p._id)
  }
  setSelectedRows(new Set())
}}
 userRole={userRole ?? 'staff'}
          onBulkExport={handleBulkExport}
          onBulkPrint={handleBulkPrint}
          onCancel={handleBulkCancel}
          onDelete={handleBulkDelete}
          onClearSelection={handleClearSelection}
        />
      )}

      {/* DataTable */}
      <DataTable
   data={payments}
  loading={{isLoading}}
        columns={paymentTableColumns}
        // Sorting Configuration
        sorting={{
          enabled: true,
        }}
        // Pagination Configuration
        pagination={{
          enabled: true,
          pageSize: 10,
          pageSizeOptions: [10, 20, 50, 100],
          showPageSizeSelector: true,
          showPageInfo: true,
          showFirstLastButtons: true,
        }}
        // Selection Configuration
        selection={{
          enabled: true,
          selectedRows,
          onSelectionChange: setSelectedRows,
          getRowId: row => row._id,
          selectAllEnabled: true,
        }}
        // Row Actions Configuration
        rowActions={{
          enabled: true,
          actions: rowActions,
          position: 'end',
        }}
        // Empty State Configuration
        emptyState={{
          message: t('payment.table.noPayments'),
        }}
        // Style Configuration
        style={{
          variant: 'default',
          size: 'md',
          stickyHeader: true,
          hoverEffect: true,
          zebraStripes: false,
          showBorder: true,
          rounded: true,
          shadow: true,
          fullWidth: true,
        }}
        // Row Click Handler
onRowClick={payment => {
  // handleViewDetails(payment)  // uncomment when needed
}}
        // Get Row ID
        getRowId={row => row._id}
        // Test ID
        testId="payment-table"
        ariaLabel={t('payment.table.ariaLabel')}
      />
    </div>
  )
}

PaymentTable.displayName = 'PaymentTable'
