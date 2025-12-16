// ============================================================================
// FILE: src/components/features/ShopTable/ShopTable.tsx
// Main Shop Table Component
// ============================================================================

import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { DataTable } from '@/components/ui/data-display/DataTable'
import { shopTableColumns } from './ShopTableColumns'
import { getShopRowActions, BulkActionsBar } from './ShopTableActions'
import { dummyShops } from '@/pages/shops/data'
import type { Shop } from '@/types/shop.types'

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const ShopTable: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // For demo purposes - in real app, get from Redux/Context
  const userRole = 'shop_admin' // 'super_admin' | 'org_admin' | 'shop_admin' | 'manager' | 'staff'

  // ========================================================================
  // STATE
  // ========================================================================

  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())

  // ========================================================================
  // HANDLERS
  // ========================================================================

  const handleViewDetails = (shop: Shop) => {
    console.log('View Details:', shop)
    navigate(`/shops/${shop._id}`)
  }

  const handleEdit = (shop: Shop) => {
    console.log('Edit Shop:', shop)
    navigate(`/shops/edit/${shop._id}`)
  }

  const handleSettings = (shop: Shop) => {
    console.log('Shop Settings:', shop)
    navigate(`/shops/${shop._id}/settings`)
  }

  const handleUpdateRates = (shop: Shop) => {
    console.log('Update Metal Rates:', shop)
    // TODO: Open metal rates modal
  }

  const handleStatistics = (shop: Shop) => {
    console.log('View Statistics:', shop)
    navigate(`/shops/${shop._id}/statistics`)
  }

  const handleToggleStatus = (shop: Shop) => {
    console.log('Toggle Status:', shop)
    // TODO: API call to toggle status
  }

  const handleDelete = (shop: Shop) => {
    console.log('Delete Shop:', shop)
    // TODO: Show confirmation and delete
  }

  // Bulk Actions Handlers
  const handleBulkViewDetails = () => {
    const selected = selectedShops[0]
    if (selected) {
      handleViewDetails(selected)
    }
  }

  const handleBulkEdit = () => {
    const selected = selectedShops[0]
    if (selected) {
      handleEdit(selected)
    }
  }

  const handleBulkSettings = () => {
    console.log('Bulk Settings:', selectedShops)
    // TODO: Handle bulk settings update
  }

  const handleBulkUpdateRates = () => {
    console.log('Bulk Update Rates:', selectedShops)
    // TODO: Open bulk metal rates modal
  }

  const handleBulkActivate = () => {
    console.log('Bulk Activate:', selectedShops)
    // TODO: API call to activate selected shops
  }

  const handleBulkDeactivate = () => {
    console.log('Bulk Deactivate:', selectedShops)
    // TODO: API call to deactivate selected shops
  }

  const handleBulkDelete = () => {
    console.log('Bulk Delete:', selectedShops)
    // TODO: Show confirmation and bulk delete
  }

  const handleClearSelection = () => {
    setSelectedRows(new Set())
  }

  // ========================================================================
  // ROW ACTIONS
  // ========================================================================

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
        userRole
      ),
    [userRole]
  )

  // ========================================================================
  // SELECTED SHOPS
  // ========================================================================

  const selectedShops = useMemo(() => {
    return dummyShops.filter((shop) => selectedRows.has(shop._id))
  }, [selectedRows])

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <div className="w-full space-y-4">
      {/* Bulk Actions Bar - Shows when rows are selected */}
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
          userRole={userRole}
        />
      )}

      {/* DataTable */}
      <DataTable
        data={dummyShops}
        columns={shopTableColumns}
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
          getRowId: (row) => row._id,
          selectAllEnabled: true,
        }}
        // Row Actions Configuration
        rowActions={{
          enabled: true,
          actions: rowActions,
          position: 'end',
        }}
        // Loading Configuration
        loading={{
          isLoading: false, // Set to true when fetching data
          loadingRows: 10,
        }}
        // Empty State Configuration
        emptyState={{
          message: t('table.noShops'),
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
        onRowClick={(shop) => {
          console.log('Row clicked:', shop)
          // Optional: Open details on row click
          // handleViewDetails(shop)
        }}
        // Get Row ID
        getRowId={(row) => row._id}
        // Test ID
        testId="shop-table"
        ariaLabel={t('table.ariaLabel')}
      />
    </div>
  )
}

ShopTable.displayName = 'ShopTable'