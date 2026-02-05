//
// FILE: src/components/features/SupplierTable/SupplierTable.tsx
// Main Supplier Table Component
//

import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DataTable } from '@/components/ui/data-display/DataTable'
import { supplierTableColumns } from './SupplierTableColumns'
import { getSupplierRowActions, BulkActionsBar } from './SupplierTableActions'
import type { Supplier } from '@/types/supplier.types'
import { useSuppliersList } from '@/hooks/supplier'
import { useSupplierActions } from '@/hooks/supplier'
import { SupplierType, SupplierCategory } from '@/types/supplier.types'
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
const shopId = 'CURRENT_SHOP_ID' // replace with real source
const [page, setPage] = useState(1)
const [limit, setLimit] = useState(10)

  //
  // STATE
  //
const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())



  // Filter State
  const [filters, setFilters] = useState<SupplierFilterValues>({
    search: '',
    supplierType: undefined,
    supplierCategory: undefined,
    isActive: undefined,
    isPreferred: undefined,
    isVerified: undefined,
  })
const apiFilters = useMemo(
  () => ({
    search: filters.search || undefined,

    supplierType: filters.supplierType
      ? (filters.supplierType as SupplierType)
      : undefined,

    supplierCategory: filters.supplierCategory
      ? (filters.supplierCategory as SupplierCategory)
      : undefined,

    isActive:
      filters.isActive === 'active'
        ? true
        : filters.isActive === 'inactive'
          ? false
          : undefined,

    isPreferred:
      filters.isPreferred === 'preferred'
        ? true
        : filters.isPreferred === 'not_preferred'
          ? false
          : undefined,

    isVerified:
      filters.isVerified === 'verified'
        ? true
        : filters.isVerified === 'not_verified'
          ? false
          : undefined,
  }),
  [filters]
)

const {
  suppliers,
  pagination,
  isLoading,
} = useSuppliersList(shopId, {
  page,
  limit,
  ...apiFilters,
})

const {
  deleteSupplier,
  blacklistSupplier,
  removeBlacklist,
  markAsPreferred,
  removePreferred,
} = useSupplierActions(shopId)

  //
  // FILTER HANDLERS
  //
const handleFiltersChange = (newFilters: SupplierFilterValues) => {
  setFilters(newFilters)
  setPage(1)
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
  setPage(1)
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

const handleBlacklist = async (supplier: Supplier) => {
  if (supplier.isBlacklisted) {
    await removeBlacklist(supplier._id, supplier.businessName)
  } else {
    await blacklistSupplier(supplier._id, 'Blacklisted by admin', supplier.businessName)
  }
}

const handleMarkPreferred = async (supplier: Supplier) => {
  if (supplier.isPreferred) {
    await removePreferred(supplier._id, supplier.businessName)
  } else {
    await markAsPreferred(supplier._id, supplier.businessName)
  }
}

const handleDelete = async (supplier: Supplier) => {
  await deleteSupplier(supplier._id, supplier.businessName)
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
  [
    handleViewDetails,
    handleEdit,
    handleUpdateRating,
    handleBlacklist,
    handleMarkPreferred,
    handleDelete,
  ]
)


  //
  // SELECTED SUPPLIERS
  //

const selectedSuppliers = useMemo(
  () => suppliers.filter(s => selectedRows.has(s._id)),
  [suppliers, selectedRows]
)


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
        data={suppliers}
          loading={{ isLoading }}
        columns={supplierTableColumns}
        // Sorting Configuration
        sorting={{
          enabled: true,
        }}
        // Pagination Configuration
pagination={{
  enabled: true,
  pageSize: limit,
  showPageSizeSelector: true,
  showPageInfo: true,
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
