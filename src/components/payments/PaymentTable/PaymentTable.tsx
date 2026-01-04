// FILE: src/components/payments/PaymentTable/PaymentTable.tsx
// Main Payment Table Component

import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { DataTable } from '@/components/ui/data-display/DataTable'
import { paymentTableColumns } from './PaymentTableColumns'
import { getPaymentRowActions, BulkActionsBar } from './PaymentTableActions'
import { MOCK_PAYMENTS, type Payment } from './PaymentTable.types'
import {
  PaymentFilters,
  PaymentFilterState,
} from '@/components/payments/PaymentFilters'

// MAIN COMPONENT

export const PaymentTable: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // STATE

  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
    new Set()
  )
  const [filters, setFilters] = useState<PaymentFilterState>({})

  // FILTER HANDLER

  const handleFilterChange = (newFilters: PaymentFilterState) => {
    setFilters(newFilters)
    console.log('Filters changed:', newFilters)
    // TODO: Call API with filters or filter MOCK_PAYMENTS locally
  }

  // ROW ACTION HANDLERS

  const handleViewDetails = (payment: Payment) => {
    console.log('View Payment Details:', payment)
    // TODO: Navigate to payment details or open modal
    navigate(`/payments/${payment._id}`)
  }

  const handleEdit = (payment: Payment) => {
    console.log('Edit Payment:', payment)
    navigate(`/payments/edit/${payment._id}`)
  }

  const handleViewReceipt = (payment: Payment) => {
    console.log('View Receipt:', payment)
    // TODO: Open receipt in new tab or modal
    if (payment.receipt.receiptUrl) {
      window.open(payment.receipt.receiptUrl, '_blank')
    }
  }

  const handleSendReceipt = (payment: Payment) => {
    console.log('Send Receipt:', payment)
    // TODO: Open send receipt modal
  }

  const handleMarkCompleted = (payment: Payment) => {
    console.log('Mark as Completed:', payment)
    // TODO: API call to mark payment as completed
  }

  const handleCancel = (payment: Payment) => {
    console.log('Cancel Payment:', payment)
    // TODO: Show confirmation and cancel payment
  }

  const handleReconcile = (payment: Payment) => {
    console.log('Reconcile Payment:', payment)
    // TODO: Open reconciliation modal
  }

  const handleProcessRefund = (payment: Payment) => {
    console.log('Process Refund:', payment)
    // TODO: Open refund modal
  }

  const handleDelete = (payment: Payment) => {
    console.log('Delete Payment:', payment)
    // TODO: Show confirmation and delete
  }

  // BULK ACTION HANDLERS

  const handleBulkViewDetails = () => {
    if (selectedPayments.length === 1) {
      handleViewDetails(selectedPayments[0])
    }
  }

  const handleBulkViewReceipts = () => {
    console.log('Bulk View Receipts:', selectedPayments)
    // TODO: Open multiple receipts or download as PDF
  }

  const handleBulkSendReceipts = () => {
    console.log('Bulk Send Receipts:', selectedPayments)
    // TODO: Open bulk send receipt modal
  }

  const handleBulkReconcile = () => {
    console.log('Bulk Reconcile:', selectedPayments)
    // TODO: Open bulk reconciliation modal
  }

  const handleBulkExport = () => {
    console.log('Bulk Export:', selectedPayments)
    // TODO: Export selected payments to Excel/CSV
  }

  const handleBulkPrint = () => {
    console.log('Bulk Print:', selectedPayments)
    // TODO: Print selected receipts
  }

  const handleBulkCancel = () => {
    console.log('Bulk Cancel:', selectedPayments)
    // TODO: Show confirmation and bulk cancel
  }

  const handleBulkDelete = () => {
    console.log('Bulk Delete:', selectedPayments)
    // TODO: Show confirmation and bulk delete
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
        handleDelete
      ),
    []
  )

  // ========================================================================
  // SELECTED PAYMENTS
  // ========================================================================

  const selectedPayments = useMemo(() => {
    return MOCK_PAYMENTS.filter(payment => selectedRows.has(payment._id))
  }, [selectedRows])

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <div className="w-full space-y-4">
      {/* Filters */}
      <PaymentFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Bulk Actions Bar */}
      {selectedRows.size > 0 && (
        <BulkActionsBar
          selectedCount={selectedRows.size}
          selectedPayments={selectedPayments}
          onViewDetails={handleBulkViewDetails}
          onViewReceipts={handleBulkViewReceipts}
          onSendReceipts={handleBulkSendReceipts}
          onBulkReconcile={handleBulkReconcile}
          onBulkExport={handleBulkExport}
          onBulkPrint={handleBulkPrint}
          onCancel={handleBulkCancel}
          onDelete={handleBulkDelete}
          onClearSelection={handleClearSelection}
        />
      )}

      {/* DataTable */}
      <DataTable
        data={MOCK_PAYMENTS}
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
          console.log('Row clicked:', payment)
          // Optional: Open details on row click
          // handleViewDetails(payment)
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
