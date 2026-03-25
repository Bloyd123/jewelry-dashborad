//
// FILE: src/components/features/ShopTable/ShopTable.tsx
// Main Shop Table Component
//

import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { DataTable } from '@/components/ui/data-display/DataTable'
import { shopTableColumns } from './ShopTableColumns'
import { getShopRowActions, BulkActionsBar } from './ShopTableActions'
import { useShopsList, useShopActions } from '@/hooks/shop'
import { useAuthState } from '@/hooks/auth'
import type { Shop, ShopType, ShopCategory } from '@/types/shop.types'
import { ConfirmDialog } from '@/components/ui/overlay/Dialog'
import type { ShopFilterValues } from '@/components/shop/ShopFilters'
//
// MAIN COMPONENT
//
interface ShopTableProps {
  filters?: ShopFilterValues
}

export const ShopTable: React.FC<ShopTableProps> = ({ filters }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // STATE — order matters, page pehle
  const [page, setPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
    new Set()
  )
const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    description: string
    variant: 'danger' | 'warning' | 'info' | 'success' | 'default'
    onConfirm: () => Promise<void>
  }>({
    open: false,
    title: '',
    description: '',
    variant: 'danger',
    onConfirm: async () => {},
  })
  // AUTH
  const { userRole } = useAuthState()

  // API HOOKS
const { shops, isLoading } = useShopsList({
  page,
  limit: 10,
  search: filters?.search,
  isActive: filters?.isActive === 'true' ? true : filters?.isActive === 'false' ? false : undefined,
  isVerified: filters?.isVerified === 'true' ? true : filters?.isVerified === 'false' ? false : undefined,
  shopType: filters?.shopType as ShopType | undefined,
  category: filters?.category as ShopCategory | undefined,
  city: filters?.city,
  state: filters?.state,
  sort: filters?.sort,
})
  const { deleteShop } = useShopActions()

  // SELECTED SHOPS — shops dependency sahi
  const selectedShops = useMemo(() => {
    return shops.filter(shop => selectedRows.has(shop._id))
  }, [selectedRows, shops])

  // --------------------------------------------------------
  // ROW HANDLERS
  // --------------------------------------------------------

  const handleViewDetails = (shop: Shop) => {
    navigate(`/shops/${shop._id}`)
  }

  const handleEdit = (shop: Shop) => {
    navigate(`/shops/edit/${shop._id}`)
  }

  const handleSettings = (shop: Shop) => {
    navigate(`/shops/${shop._id}/settings`)
  }

  const handleUpdateRates = (shop: Shop) => {
    // TODO: Open metal rates modal
    console.log('Update Metal Rates:', shop)
  }

  const handleStatistics = (shop: Shop) => {
    navigate(`/shops/${shop._id}/statistics`)
  }
const handleToggleStatus = async (shop: Shop) => {
  // TODO: Backend API nahi hai abhi
  console.log('Toggle status:', shop._id, !shop.isActive)
}
const handleDelete = (shop: Shop) => {
  setConfirmDialog({
    open: true,
    title: t('shops.confirmDelete'),
    description: t('shops.confirmDeleteDescription', { name: shop.name }),
 variant: 'danger',
    onConfirm: async () => {
      await deleteShop(shop._id)
      setConfirmDialog(prev => ({ ...prev, open: false }))
    },
  })
}

  // --------------------------------------------------------
  // BULK ACTION HANDLERS
  // --------------------------------------------------------

  const handleBulkViewDetails = () => {
    const selected = selectedShops[0]
    if (selected) handleViewDetails(selected)
  }

  const handleBulkEdit = () => {
    const selected = selectedShops[0]
    if (selected) handleEdit(selected)
  }

  const handleBulkSettings = () => {
    // TODO: bulk settings
    console.log('Bulk Settings:', selectedShops)
  }

  const handleBulkUpdateRates = () => {
    // TODO: bulk metal rates modal
    console.log('Bulk Update Rates:', selectedShops)
  }

const handleBulkActivate = async () => {
  // TODO: Backend API nahi hai abhi
  console.log('Bulk activate:', selectedShops.map(s => s._id))
  setSelectedRows(new Set())
}

const handleBulkDeactivate = async () => {
  // TODO: Backend API nahi hai abhi
  console.log('Bulk deactivate:', selectedShops.map(s => s._id))
  setSelectedRows(new Set())
}
const handleBulkDelete = async () => {
  // TODO: Backend API nahi hai abhi
  console.log('Bulk delete:', selectedShops.map(s => s._id))
  setSelectedRows(new Set())
}

  const handleClearSelection = () => {
    setSelectedRows(new Set())
  }

  // --------------------------------------------------------
  // ROW ACTIONS
  // --------------------------------------------------------

  const rowActions = useMemo(
    () =>
      getShopRowActions(
        handleViewDetails,
        handleEdit,
        handleSettings,
        handleUpdateRates,
        handleStatistics,
        handleToggleStatus,
        handleDelete,
        userRole ?? 'staff'
      ),
    [userRole]
  )

  // --------------------------------------------------------
  // RENDER
  // --------------------------------------------------------

  return (
    <div className="w-full space-y-4">
      {/* Bulk Actions Bar */}
      {selectedRows.size > 0 && (
        <BulkActionsBar
          selectedCount={selectedRows.size}
          selectedShops={selectedShops}
          onViewDetails={handleBulkViewDetails}
          onEdit={handleBulkEdit}
          onSettings={handleBulkSettings}
          onUpdateRates={handleBulkUpdateRates}
          onActivate={handleBulkActivate}
          onDeactivate={handleBulkDeactivate}
          onDelete={handleBulkDelete}
          onClearSelection={handleClearSelection}
          userRole={userRole ?? 'staff'}
        />
      )}

      {/* DataTable */}
      <DataTable
        data={shops}
        columns={shopTableColumns}
        sorting={{
          enabled: true,
        }}
pagination={{
  enabled: true,
  pageSize: 10,
  pageSizeOptions: [10, 20, 50, 100],
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
        loading={{
          isLoading,
          loadingRows: 10,
        }}
        emptyState={{
          message: t('table.noShops'),
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
        onRowClick={shop => {
          console.log('Row clicked:', shop)
        }}
        getRowId={row => row._id}
        testId="shop-table"
        ariaLabel={t('table.ariaLabel')}
      />
            <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={open => setConfirmDialog(prev => ({ ...prev, open }))}
        title={confirmDialog.title}
        description={confirmDialog.description}
        variant={confirmDialog.variant}
        confirmLabel={t('common.confirm')}
        cancelLabel={t('common.cancel')}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
      />
    </div>
  )
}

ShopTable.displayName = 'ShopTable'
