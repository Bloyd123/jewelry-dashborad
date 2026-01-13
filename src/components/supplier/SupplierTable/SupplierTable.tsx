//
// FILE: src/components/features/SupplierTable/SupplierTable.tsx
// Main Supplier Table Component
//

import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DataTable } from '@/components/ui/data-display/DataTable'
import { supplierTableColumns } from './SupplierTableColumns'
import { getSupplierRowActions, BulkActionsBar } from './SupplierTableActions'
import { dummySuppliers, type Supplier } from './SupplierTable.types'
import { useNavigate } from 'react-router-dom'
import { SupplierFilters } from '@/components/supplier/SupplierFilters'
import type { SupplierFilterValues } from '@/components/supplier/SupplierFilters'
// import { TopSuppliersPanel } from '@/components/supplier/TopSuppliersPanel'
//
// MAIN COMPONENT
//

export const SupplierTable: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  //
  // STATE
  //

  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
    new Set()
  )

  // Filter State
  const [filters, setFilters] = useState<SupplierFilterValues>({
    search: '',
    supplierType: undefined,
    supplierCategory: undefined,
    isActive: undefined,
    isPreferred: undefined,
    isVerified: undefined,
  })

  //
  // FILTER HANDLERS
  //

  const handleFiltersChange = (newFilters: SupplierFilterValues) => {
    setFilters(newFilters)
    // TODO: Call API with filters or filter dummySuppliers locally
    console.log('Filters changed:', newFilters)
  }

  const handleClearAllFilters = () => {
    setFilters({
      search: '',
      supplierType: undefined,
      supplierCategory: undefined,
      isActive: undefined,
      isPreferred: undefined,
      isVerified: undefined,
    })
  }

  //
  // HANDLERS
  //

  const handleViewDetails = (supplier: Supplier) => {
    console.log('View Details:', supplier)
    // TODO: Open supplier details modal/drawer
  }

  const handleEdit = (supplier: Supplier) => {
    console.log('Edit Supplier:', supplier)
    navigate(`/suppliers/edit/${supplier._id}`)
  }

  const handleUpdateRating = (supplier: Supplier) => {
    console.log('Update Rating:', supplier)
    // TODO: Open rating modal
  }

  const handleBlacklist = (supplier: Supplier) => {
    console.log('Blacklist/Remove Blacklist:', supplier)
    // TODO: Handle blacklist action
  }

  const handleMarkPreferred = (supplier: Supplier) => {
    console.log('Mark/Remove Preferred:', supplier)
    // TODO: Handle preferred action
  }

  const handleDelete = (supplier: Supplier) => {
    console.log('Delete Supplier:', supplier)
    // TODO: Show confirmation and delete
  }

  // Bulk Actions Handlers
  const handleBulkViewDetails = () => {
    if (selectedSuppliers.length === 1) {
      handleViewDetails(selectedSuppliers[0])
    }
  }

  const handleBulkEdit = () => {
    if (selectedSuppliers.length === 1) {
      navigate(`/suppliers/edit/${selectedSuppliers[0]._id}`)
    }
  }

  const handleBulkUpdateRating = () => {
    console.log('Bulk Update Rating:', selectedSuppliers)
    // TODO: Open bulk rating modal
  }

  const handleBulkBlacklist = () => {
    console.log('Bulk Blacklist:', selectedSuppliers)
    // TODO: Handle bulk blacklist
  }

  const handleBulkMarkPreferred = () => {
    console.log('Bulk Mark Preferred:', selectedSuppliers)
    // TODO: Handle bulk preferred
  }

  const handleBulkDelete = () => {
    console.log('Bulk Delete:', selectedSuppliers)
    // TODO: Show confirmation and bulk delete
  }

  const handleClearSelection = () => {
    setSelectedRows(new Set())
  }
  //   const handleViewAll = () => {
  //   navigate('/suppliers')
  // }

  // const handleSupplierClick = (supplier: Supplier) => {
  //   navigate(`/suppliers/${supplier._id}`)
  //   // OR open modal/drawer
  // }

  //
  // ROW ACTIONS
  //

  const rowActions = useMemo(
    () =>
      getSupplierRowActions(
        handleViewDetails,
        handleEdit,
        handleUpdateRating,
        handleBlacklist,
        handleMarkPreferred,
        handleDelete
      ),
    []
  )

  //
  // SELECTED SUPPLIERS
  //

  const selectedSuppliers = useMemo(() => {
    return dummySuppliers.filter(supplier => selectedRows.has(supplier._id))
  }, [selectedRows])

  //
  // RENDER
  //

  return (
    <div className="w-full space-y-4">
      {/* <TopSuppliersPanel
          limit={5}
          showViewAll={true}
          onViewAll={handleViewAll}
          onSupplierClick={handleSupplierClick}
        /> */}
      {/* Filters Component */}
      <SupplierFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearAll={handleClearAllFilters}
      />

      {/* Bulk Actions Bar - Shows when rows are selected */}
      {selectedRows.size > 0 && (
        <BulkActionsBar
          selectedCount={selectedRows.size}
          selectedSuppliers={selectedSuppliers}
          onViewDetails={handleBulkViewDetails}
          onEdit={handleBulkEdit}
          onUpdateRating={handleBulkUpdateRating}
          onBlacklist={handleBulkBlacklist}
          onMarkPreferred={handleBulkMarkPreferred}
          onDelete={handleBulkDelete}
          onClearSelection={handleClearSelection}
        />
      )}

      {/* DataTable */}
      <DataTable
        data={dummySuppliers}
        columns={supplierTableColumns}
        // Sorting Configuration
        sorting={{
          enabled: true,
        }}
        // Pagination Configuration
        pagination={{
          enabled: true,
          pageSize: 10,
          pageSizeOptions: [10, 20, 50],
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
          message: t('suppliers.table.noSuppliers'),
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
        onRowClick={supplier => {
          console.log('Row clicked:', supplier)
          // Optional: Open details on row click
          // handleViewDetails(supplier)
        }}
        // Get Row ID
        getRowId={row => row._id}
        // Test ID
        testId="supplier-table"
        ariaLabel={t('suppliers.table.ariaLabel')}
      />
    </div>
  )
}

SupplierTable.displayName = 'SupplierTable'
