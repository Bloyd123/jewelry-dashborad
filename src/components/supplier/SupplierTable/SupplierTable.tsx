// FILE: src/components/features/SupplierTable/SupplierTable.tsx

import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DataTable } from '@/components/ui/data-display/DataTable'
import { supplierTableColumns } from './SupplierTableColumns'
import { getSupplierRowActions, BulkActionsBar } from './SupplierTableActions'
import type {
  Supplier,
  SupplierType,
  SupplierCategory,
} from '@/types/supplier.types'
import { useSuppliersList, useSupplierActions } from '@/hooks/supplier'
import { useAuth } from '@/hooks/auth'
import { useNavigate } from 'react-router-dom'
import { SupplierFilters } from '@/components/supplier/SupplierFilters'
import type { SupplierFilterValues } from '@/components/supplier/SupplierFilters'
import { SupplierManagementModal } from '@/components/supplier/SupplierManagementModal'
import type { ManagementAction } from '@/components/supplier/SupplierManagementModal/SupplierManagementModal.types'

export const SupplierTable: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { currentShopId } = useAuth()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>( new Set())

  const [filters, setFilters] = useState<SupplierFilterValues>({
    search: '',
    supplierType: undefined,
    supplierCategory: undefined,
    isActive: undefined,
    isPreferred: undefined,
    isVerified: undefined,
  })
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false)
  const [managementAction, setManagementAction] =
    useState<ManagementAction | null>(null)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  )

  if (!currentShopId) {
    return (
      <div className="p-6 text-center text-status-error">
        {t('suppliers.errors.noShopSelected')}
      </div>
    )
  }

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

  const { suppliers, pagination, isLoading, refetch } = useSuppliersList(
    currentShopId,
    {
      page,
      limit,
      ...apiFilters,
    }
  )

  const {
    deleteSupplier,
    blacklistSupplier,
    markAsPreferred,
    removePreferred,
  } = useSupplierActions(currentShopId)


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

  const handleViewDetails = (supplier: Supplier) => {
    navigate(`/suppliers/${supplier._id}`)
  }

  const handleEdit = (supplier: Supplier) => {
    navigate(`/suppliers/edit/${supplier._id}`)
  }

  const handleUpdateRating = (supplier: Supplier) => {
      console.log('supplier:', supplier)  
    setSelectedSupplier(supplier)
    setManagementAction('update-rating')
    setIsManagementModalOpen(true)
  }

  const handleBlacklist = async (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setManagementAction('blacklist')
    setIsManagementModalOpen(true)
  }

  const handleMarkPreferred = async (supplier: Supplier) => {
    if (supplier.isPreferred) {
      await removePreferred(supplier._id, supplier.businessName)
    } else {
      await markAsPreferred(supplier._id, supplier.businessName)
    }
    refetch()
  }

  const handleDelete = async (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setManagementAction('delete')
    setIsManagementModalOpen(true)
  }


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
    alert('Please select one supplier at a time for rating updates')
  }

  const handleBulkBlacklist = async () => {
    const reason = prompt('Enter blacklist reason:')
    if (!reason) return

    for (const supplier of selectedSuppliers) {
      if (!supplier.isBlacklisted) {
        await blacklistSupplier(supplier._id, reason, supplier.businessName)
      }
    }

    setSelectedRows(new Set())
    refetch()
  }

  const handleBulkMarkPreferred = async () => {
    for (const supplier of selectedSuppliers) {
      if (!supplier.isPreferred) {
        await markAsPreferred(supplier._id, supplier.businessName)
      }
    }

    setSelectedRows(new Set())
    refetch()
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedSuppliers.length} suppliers?`)) return

    for (const supplier of selectedSuppliers) {
      await deleteSupplier(supplier._id, supplier.businessName)
    }

    setSelectedRows(new Set())
    refetch()
  }

  const handleClearSelection = () => {
    setSelectedRows(new Set())
  }

  const handleManagementSuccess = async () => {
    await refetch()
    setIsManagementModalOpen(false)
    setManagementAction(null)
    setSelectedSupplier(null)
  }


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

  const selectedSuppliers = useMemo(
    () => suppliers.filter(s => selectedRows.has(s._id)),
    [suppliers, selectedRows]
  )

  return (
    <div className="w-full space-y-4">
      <SupplierFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearAll={handleClearAllFilters}
      />
      {/* {selectedRows.size > 0 && (
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
      )} */}
      <DataTable
        data={suppliers}
        columns={supplierTableColumns}
        loading={{ isLoading }}
        sorting={{
          enabled: true,
        }}
        pagination={{
          enabled: true,
          pageSize: limit,
          pageSizeOptions: [10, 20, 50],
          showPageSizeSelector: true,
          showPageInfo: true,
          showFirstLastButtons: true,
        }}
        selection={{
          enabled: true,
          selectedRows,
          onSelectionChange: setSelectedRows,
          getRowId: row => row._id,
          selectAllEnabled: true,
        }}
        rowActions={{
          enabled: true,
          actions: rowActions,
          position: 'end',
        }}
        emptyState={{
          message: t('suppliers.table.noSuppliers'),
        }}
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
onRowClick={undefined}
        getRowId={row => row._id}
        testId="supplier-table"
        ariaLabel={t('suppliers.table.ariaLabel')}
      />
      <SupplierManagementModal
        open={isManagementModalOpen}
        onOpenChange={setIsManagementModalOpen}
        supplier={selectedSupplier}
        action={managementAction}
        onSuccess={handleManagementSuccess}
      />
    </div>
  )
}

SupplierTable.displayName = 'SupplierTable'
