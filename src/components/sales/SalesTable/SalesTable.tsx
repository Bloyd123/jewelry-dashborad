//
// FILE: src/components/sales/SalesTable/SalesTable.tsx
// Main Sales Table Component
//

import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { DataTable } from '@/components/ui/data-display/DataTable'
import { salesTableColumns } from './SalesTableColumns'
import { getSalesRowActions, BulkActionsBar } from './SalesTableActions'
import { dummySales } from '@/pages/sales/data'
import type { Sale } from '@/types/sale.types'
import { SalesFilters } from '@/components/sales/SalesFilters'
import type { SalesFilterValues } from '@/components/sales/SalesFilters/SalesFilters.tsx'

//
// MAIN COMPONENT
//

export const SalesTable: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // STATE

  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
    new Set()
  )
  const [filters, setFilters] = useState<SalesFilterValues>({
    search: '',
    customerId: undefined,
    salesPerson: undefined,
    status: undefined,
    paymentStatus: undefined,
    saleType: undefined,
    paymentMode: undefined, // ✅ ADD THIS
    dateRange: undefined, // ✅ CHANGED from startDate/endDate
    amountRange: undefined, // ✅ CHANGED from minAmount/maxAmount
  })

  // FILTERED DATA

  // Add these handler functions before RENDER section
  const handleFiltersChange = (newFilters: SalesFilterValues) => {
    setFilters(newFilters)
    console.log('Filters changed:', newFilters)
  }

  const handleClearAllFilters = () => {
    setFilters({
      search: '',
      customerId: undefined,
      salesPerson: undefined,
      status: undefined,
      paymentStatus: undefined,
      saleType: undefined,
      paymentMode: undefined,
      dateRange: undefined,
      amountRange: undefined,
    })
  }

  const filteredSales = useMemo(() => {
    let result = [...dummySales]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        s =>
          s.invoiceNumber.toLowerCase().includes(searchLower) ||
          s.customerDetails.customerName.toLowerCase().includes(searchLower) ||
          s.customerDetails.phone.includes(searchLower) ||
          s.customerDetails.customerCode.toLowerCase().includes(searchLower)
      )
    }

    // Customer filter
    if (filters.customerId) {
      result = result.filter(s => s.customerId === filters.customerId)
    }

    // Status filter
    if (filters.status) {
      result = result.filter(s => s.status === filters.status)
    }

    // Payment status filter
    if (filters.paymentStatus) {
      result = result.filter(
        s => s.payment.paymentStatus === filters.paymentStatus
      )
    }

    // Sale type filter
    if (filters.saleType) {
      result = result.filter(s => s.saleType === filters.saleType)
    }

    return result
  }, [dummySales, filters])

  // HANDLERS

  const handleViewDetails = (sale: Sale) => {
    console.log('View Details:', sale)
    navigate(`/sales/${sale._id}`)
  }

  const handleEdit = (sale: Sale) => {
    console.log('Edit Sale:', sale)
    navigate(`/sales/edit/${sale._id}`)
  }

  const handleAddPayment = (sale: Sale) => {
    console.log('Add Payment:', sale)
    // TODO: Open payment modal
  }

  const handleDeliver = (sale: Sale) => {
    console.log('Mark as Delivered:', sale)
    // TODO: Open delivery modal
  }

  const handleComplete = (sale: Sale) => {
    console.log('Complete Sale:', sale)
    // TODO: Show confirmation
  }

  const handleReturn = (sale: Sale) => {
    console.log('Return Sale:', sale)
    // TODO: Open return modal
  }

  const handleCancel = (sale: Sale) => {
    console.log('Cancel Sale:', sale)
    // TODO: Show reason modal and cancel
  }

  const handlePrint = (sale: Sale) => {
    console.log('Print Invoice:', sale)
    // TODO: Open print dialog
  }

  const handleDelete = (sale: Sale) => {
    console.log('Delete Sale:', sale)
    // TODO: Show confirmation and delete
  }

  // Bulk Actions
  const handleBulkViewDetails = () => {
    const selected = filteredSales.filter(s => selectedRows.has(s._id))
    if (selected.length === 1) {
      handleViewDetails(selected[0])
    }
  }

  const handleBulkEdit = () => {
    const selected = filteredSales.filter(s => selectedRows.has(s._id))
    if (selected.length === 1) {
      handleEdit(selected[0])
    }
  }

  const handleBulkPrint = () => {
    const selected = filteredSales.filter(s => selectedRows.has(s._id))
    console.log('Bulk Print:', selected)
    // TODO: Print all selected invoices
  }

  const handleBulkExport = () => {
    const selected = filteredSales.filter(s => selectedRows.has(s._id))
    console.log('Bulk Export:', selected)
    // TODO: Export selected sales
  }

  const handleBulkSendInvoice = () => {
    const selected = filteredSales.filter(s => selectedRows.has(s._id))
    console.log('Bulk Send Invoice:', selected)
    // TODO: Send invoices to customers
  }

  const handleBulkReminders = () => {
    const selected = filteredSales.filter(s => selectedRows.has(s._id))
    console.log('Bulk Send Reminders:', selected)
    // TODO: Send payment reminders
  }

  const handleBulkDelete = () => {
    const selected = filteredSales.filter(s => selectedRows.has(s._id))
    console.log('Bulk Delete:', selected)
    // TODO: Show confirmation and bulk delete
  }

  const handleClearSelection = () => {
    setSelectedRows(new Set())
  }

  // ROW ACTIONS

  const rowActions = useMemo(
    () =>
      getSalesRowActions(
        handleViewDetails,
        handleEdit,
        handleAddPayment,
        handleDeliver,
        handleComplete,
        handleReturn,
        handleCancel,
        handlePrint,
        handleDelete
      ),
    []
  )

  // SELECTED SALES

  const selectedSales = useMemo(() => {
    return filteredSales.filter(sale => selectedRows.has(sale._id))
  }, [filteredSales, selectedRows])

  // RENDER

  return (
    <div className="w-full space-y-4">
      {/* TODO: Add SalesFilters component here */}
      <SalesFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearAll={handleClearAllFilters}
        customers={[]} // TODO: Pass actual customers data
        salesPersons={[]} // TODO: Pass actual sales persons data
      />

      {/* Bulk Actions Bar */}
      {selectedRows.size > 0 && (
        <BulkActionsBar
          selectedCount={selectedRows.size}
          selectedSales={selectedSales}
          onViewDetails={handleBulkViewDetails}
          onEdit={handleBulkEdit}
          onBulkPrint={handleBulkPrint}
          onBulkExport={handleBulkExport}
          onBulkSendInvoice={handleBulkSendInvoice}
          onBulkReminders={handleBulkReminders}
          onBulkDelete={handleBulkDelete}
          onClearSelection={handleClearSelection}
        />
      )}

      {/* DataTable */}
      <DataTable
        data={filteredSales}
        columns={salesTableColumns}
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
          message: t('table.noSales'),
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
        onRowClick={sale => {
          console.log('Row clicked:', sale)
        }}
        // Get Row ID
        getRowId={row => row._id}
        // Test ID
        testId="sales-table"
        ariaLabel={t('table.ariaLabel')}
      />
    </div>
  )
}

SalesTable.displayName = 'SalesTable'
