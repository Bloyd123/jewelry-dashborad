// ============================================================================
// FILE: src/components/features/PurchaseTable/PurchaseTable.tsx
// Main Purchase Table Component
// ============================================================================

import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { DataTable } from '@/components/ui/data-display/DataTable'
import { purchaseTableColumns } from './PurchaseTableColumns'
import { getPurchaseRowActions, BulkActionsBar } from './PurchaseTableActions'
import { PurchaseFilters } from '@/components/purchase/PurchaseFilters'
import type { PurchaseFilterValues } from '@/components/purchase/PurchaseFilters/types'
import { dummyPurchases, dummySuppliers } from '@/pages/purchase/mock.data'
import type { IPurchase } from '@/types/purchase.types'

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const PurchaseTable: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // ========================================================================
  // STATE
  // ========================================================================

  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
    new Set()
  )

  const [filters, setFilters] = useState<PurchaseFilterValues>({
    search: '',
    supplierId: undefined,
    status: undefined,
    paymentStatus: undefined,
    purchaseType: undefined,
    approvalStatus: undefined,
    dateRange: undefined,
  })

  // ========================================================================
  // FILTERED DATA
  // ========================================================================

  const filteredPurchases = useMemo(() => {
    let result = [...dummyPurchases]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        p =>
          p.purchaseNumber.toLowerCase().includes(searchLower) ||
          p.supplierDetails.supplierName.toLowerCase().includes(searchLower) ||
          p.supplierDetails.supplierCode?.toLowerCase().includes(searchLower)
      )
    }

    // Supplier filter
    if (filters.supplierId) {
      result = result.filter(p => p.supplierId === filters.supplierId)
    }

    // Status filter
    if (filters.status) {
      result = result.filter(p => p.status === filters.status)
    }

    // Payment status filter
    if (filters.paymentStatus) {
      result = result.filter(
        p => p.payment.paymentStatus === filters.paymentStatus
      )
    }

    // Purchase type filter
    if (filters.purchaseType) {
      result = result.filter(p => p.purchaseType === filters.purchaseType)
    }

    // Approval status filter
    if (filters.approvalStatus) {
      result = result.filter(p => p.approvalStatus === filters.approvalStatus)
    }

    // Date range filter
    if (filters.dateRange?.from || filters.dateRange?.to) {
      result = result.filter(p => {
        const purchaseDate = new Date(p.purchaseDate)
        if (filters.dateRange?.from && purchaseDate < filters.dateRange.from)
          return false
        if (filters.dateRange?.to && purchaseDate > filters.dateRange.to)
          return false
        return true
      })
    }

    return result
  }, [dummyPurchases, filters])

  // ========================================================================
  // HANDLERS
  // ========================================================================

  const handleViewDetails = (purchase: IPurchase) => {
    console.log('View Details:', purchase)
    navigate(`/purchases/${purchase._id}`)
  }

  const handleEdit = (purchase: IPurchase) => {
    console.log('Edit Purchase:', purchase)
    navigate(`/purchases/edit/${purchase._id}`)
  }

  const handleReceive = (purchase: IPurchase) => {
    console.log('Receive Purchase:', purchase)
    // TODO: Open receive modal
  }

  const handleAddPayment = (purchase: IPurchase) => {
    console.log('Add Payment:', purchase)
    // TODO: Open payment modal
  }

  const handleApprove = (purchase: IPurchase) => {
    console.log('Approve Purchase:', purchase)
    // TODO: Show confirmation and approve
  }

  const handleReject = (purchase: IPurchase) => {
    console.log('Reject Purchase:', purchase)
    // TODO: Show reason modal and reject
  }

  const handleCancel = (purchase: IPurchase) => {
    console.log('Cancel Purchase:', purchase)
    // TODO: Show reason modal and cancel
  }

  const handleDelete = (purchase: IPurchase) => {
    console.log('Delete Purchase:', purchase)
    // TODO: Show confirmation and delete
  }

  // Bulk Actions
  const handleBulkViewDetails = () => {
    const selected = filteredPurchases.filter(p => selectedRows.has(p._id))
    if (selected.length === 1) {
      handleViewDetails(selected[0])
    }
  }

  const handleBulkEdit = () => {
    const selected = filteredPurchases.filter(p => selectedRows.has(p._id))
    if (selected.length === 1) {
      handleEdit(selected[0])
    }
  }

  const handleBulkApprove = () => {
    const selected = filteredPurchases.filter(p => selectedRows.has(p._id))
    console.log('Bulk Approve:', selected)
    // TODO: Bulk approve purchases
  }

  const handleBulkExport = () => {
    const selected = filteredPurchases.filter(p => selectedRows.has(p._id))
    console.log('Bulk Export:', selected)
    // TODO: Export selected purchases
  }

  const handleBulkPrint = () => {
    const selected = filteredPurchases.filter(p => selectedRows.has(p._id))
    console.log('Bulk Print:', selected)
    // TODO: Print selected purchases
  }

  const handleBulkDelete = () => {
    const selected = filteredPurchases.filter(p => selectedRows.has(p._id))
    console.log('Bulk Delete:', selected)
    // TODO: Show confirmation and bulk delete
  }

  const handleClearSelection = () => {
    setSelectedRows(new Set())
  }

  const handleFiltersChange = (newFilters: PurchaseFilterValues) => {
    setFilters(newFilters)
  }

  const handleClearAllFilters = () => {
    setFilters({
      search: '',
      supplierId: undefined,
      status: undefined,
      paymentStatus: undefined,
      purchaseType: undefined,
      approvalStatus: undefined,
      dateRange: undefined,
    })
  }

  // ========================================================================
  // ROW ACTIONS
  // ========================================================================

  const rowActions = useMemo(
    () =>
      getPurchaseRowActions(
        handleViewDetails,
        handleEdit,
        handleReceive,
        handleAddPayment,
        handleApprove,
        handleReject,
        handleCancel,
        handleDelete
      ),
    []
  )

  // ========================================================================
  // SELECTED PURCHASES
  // ========================================================================

  const selectedPurchases = useMemo(() => {
    return filteredPurchases.filter(purchase => selectedRows.has(purchase._id))
  }, [filteredPurchases, selectedRows])

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <div className="w-full space-y-4">
      {/* Filters */}
      <PurchaseFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearAll={handleClearAllFilters}
        suppliers={dummySuppliers.map(s => ({
          _id: s.supplierCode || '',
          businessName: s.supplierName,
          supplierCode: s.supplierCode || '',
        }))}
      />

      {/* Bulk Actions Bar */}
      {selectedRows.size > 0 && (
        <BulkActionsBar
          selectedCount={selectedRows.size}
          selectedPurchases={selectedPurchases}
          onViewDetails={handleBulkViewDetails}
          onEdit={handleBulkEdit}
          onBulkApprove={handleBulkApprove}
          onBulkExport={handleBulkExport}
          onBulkPrint={handleBulkPrint}
          onBulkDelete={handleBulkDelete}
          onClearSelection={handleClearSelection}
        />
      )}

      {/* DataTable */}
      <DataTable
        data={filteredPurchases}
        columns={purchaseTableColumns}
        // Sorting
        sorting={{
          enabled: true,
        }}
        // Pagination
        pagination={{
          enabled: true,
          pageSize: 20,
          pageSizeOptions: [10, 20, 50, 100],
          showPageSizeSelector: true,
          showPageInfo: true,
          showFirstLastButtons: true,
        }}
        // Selection
        selection={{
          enabled: true,
          selectedRows,
          onSelectionChange: setSelectedRows,
          getRowId: row => row._id,
          selectAllEnabled: true,
        }}
        // Row Actions
        rowActions={{
          enabled: true,
          actions: rowActions,
          position: 'end',
        }}
        // Empty State
        emptyState={{
          message: t('table.noPurchases'),
        }}
        // Style
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
        // Row Click
        onRowClick={purchase => {
          console.log('Row clicked:', purchase)
        }}
        // Get Row ID
        getRowId={row => row._id}
        // Test ID
        testId="purchase-table"
        ariaLabel={t('table.ariaLabel')}
      />
    </div>
  )
}

PurchaseTable.displayName = 'PurchaseTable'
