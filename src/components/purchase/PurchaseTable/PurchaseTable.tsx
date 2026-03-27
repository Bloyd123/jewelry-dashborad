// FILE: src/components/purchase/PurchaseTable/PurchaseTable.tsx

import React, { useState, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/auth'
import { DataTable } from '@/components/ui/data-display/DataTable'
import { purchaseTableColumns } from './PurchaseTableColumns'
import { getPurchaseRowActions, BulkActionsBar } from './PurchaseTableActions'
import { PurchaseFilters } from '@/components/purchase/PurchaseFilters'
import { ConfirmDialog } from '@/components/ui/overlay/Dialog/ConfirmDialog'
import type { ConfirmDialogVariant } from '@/components/ui/overlay/Dialog/ConfirmDialog'
import { useNotification } from '@/hooks/useNotification'
import { usePurchaseList } from '@/hooks/purchase/usePurchasesList'
import { usePurchaseActions } from '@/hooks/purchase/usePurchaseActions'
import type { PurchaseFilterValues } from '@/components/purchase/PurchaseFilters/types'
import type { IPurchase } from '@/types/purchase.types'

export const PurchaseTable: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { currentShopId } = useAuth()
  const { showError } = useNotification()

  const shopId = currentShopId || ''

  // ── State ──
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())
  const [page,  setPage]  = useState(1)
  const [limit, setLimit] = useState(20)

  const [filters, setFilters] = useState<PurchaseFilterValues>({
    search:         '',
    supplierId:     undefined,
    status:         undefined,
    paymentStatus:  undefined,
    purchaseType:   undefined,
    approvalStatus: undefined,
    dateRange:      undefined,
  })

  // ✅ FIX 1: ConfirmDialogVariant import se — 'danger' not 'destructive'
  const [confirmDialog, setConfirmDialog] = useState<{
    open:      boolean
    title:     string
    desc:      string
    variant:   ConfirmDialogVariant
    onConfirm: () => Promise<void>
  }>({
    open:      false,
    title:     '',
    desc:      '',
    variant:   'warning',
    onConfirm: async () => {},
  })
  const [isConfirming, setIsConfirming] = useState(false)

  // ── Real API ──
  const { purchases, pagination, isLoading, deletePurchase, bulkDelete, bulkApprove } =
    usePurchaseList(shopId, {
      page,
      limit,
      search:        filters.search        || undefined,
      supplierId:    filters.supplierId    || undefined,
      status:        filters.status        as any || undefined,
      paymentStatus: filters.paymentStatus as any || undefined,
      startDate:     filters.dateRange?.from?.toISOString(),
      endDate:       filters.dateRange?.to?.toISOString(),
    })

  // ── Confirm helper ──
  const openConfirm = useCallback((
    title:     string,
    desc:      string,
    variant:   ConfirmDialogVariant,
    onConfirm: () => Promise<void>
  ) => {
    setConfirmDialog({ open: true, title, desc, variant, onConfirm })
  }, [])

  const handleConfirm = async () => {
    setIsConfirming(true)
    await confirmDialog.onConfirm()
    setIsConfirming(false)
    setConfirmDialog(prev => ({ ...prev, open: false }))
  }

  // ─────────────────────────────────────────────
  // ROW HANDLERS
  // ─────────────────────────────────────────────

  const handleViewDetails = useCallback((purchase: IPurchase) => {
    navigate(`/purchases/${purchase._id}`)
  }, [navigate])

  const handleEdit = useCallback((purchase: IPurchase) => {
    navigate(`/purchases/${purchase._id}/edit`)
  }, [navigate])

  const handleReceive = useCallback((purchase: IPurchase) => {
    navigate(`/purchases/${purchase._id}?tab=delivery`)
  }, [navigate])

  const handleAddPayment = useCallback((purchase: IPurchase) => {
    navigate(`/purchases/${purchase._id}?tab=payments`)
  }, [navigate])

  const handleApprove = useCallback((purchase: IPurchase) => {
    openConfirm(
      t('purchase.confirmApprove', 'Approve Purchase?'),
      t('purchase.confirmApproveDesc', `Approve ${purchase.purchaseNumber}?`),
      'success',
      async () => {
        // Per-row action: use purchaseApi directly
        const { useApprovePurchaseMutation } = await import('@/store/api/purchaseApi')
        // Fallback: navigate to detail for approve
        navigate(`/purchases/${purchase._id}`)
      }
    )
  }, [navigate, openConfirm, t])

  const handleReject = useCallback((purchase: IPurchase) => {
    openConfirm(
      t('purchase.confirmReject', 'Reject Purchase?'),
      t('purchase.confirmRejectDesc', `Reject ${purchase.purchaseNumber}?`),
      'danger',
      async () => {
        navigate(`/purchases/${purchase._id}`)
      }
    )
  }, [navigate, openConfirm, t])

  const handleCancel = useCallback((purchase: IPurchase) => {
    openConfirm(
      t('purchase.confirmCancel', 'Cancel Purchase?'),
      t('purchase.confirmCancelDesc', `Cancel ${purchase.purchaseNumber}? This cannot be undone.`),
      'danger',
      async () => {
        navigate(`/purchases/${purchase._id}`)
      }
    )
  }, [navigate, openConfirm, t])

  const handleDelete = useCallback((purchase: IPurchase) => {
    openConfirm(
      t('purchase.confirmDelete', 'Delete Purchase?'),
      t('purchase.confirmDeleteDesc', `Delete ${purchase.purchaseNumber}? Only drafts can be deleted.`),
      'danger',
      async () => {
        await deletePurchase(purchase._id)
      }
    )
  }, [deletePurchase, openConfirm, t])

  // ─────────────────────────────────────────────
  // BULK HANDLERS
  // ─────────────────────────────────────────────

  const selectedPurchases = useMemo(() => {
  const list = ((purchases as any)?.purchases ?? purchases ?? []) as IPurchase[]
return list.filter((p: IPurchase) => selectedRows.has(p._id))
  }, [purchases, selectedRows])

  const handleBulkViewDetails = () => {
    if (selectedPurchases.length === 1) handleViewDetails(selectedPurchases[0])
  }

  const handleBulkEdit = () => {
    if (selectedPurchases.length === 1) handleEdit(selectedPurchases[0])
  }

  const handleBulkApprove = () => {
   const ids = selectedPurchases.map((p: IPurchase) => p._id)
    openConfirm(
      t('purchase.confirmBulkApprove', 'Bulk Approve?'),
      t('purchase.confirmBulkApproveDesc', `Approve ${ids.length} purchases?`),
      'success',
      async () => {
        await bulkApprove(ids)
        setSelectedRows(new Set())
      }
    )
  }

  const handleBulkDelete = () => {
    const ids = selectedPurchases.map((p: IPurchase) => p._id)
    openConfirm(
      t('purchase.confirmBulkDelete', 'Bulk Delete?'),
      t('purchase.confirmBulkDeleteDesc', `Delete ${ids.length} draft purchases?`),
      'danger',
      async () => {
        await bulkDelete(ids)
        setSelectedRows(new Set())
      }
    )
  }

  const handleBulkExport   = () => console.log('Export:', selectedPurchases)
  const handleBulkPrint    = () => console.log('Print:',  selectedPurchases)
  const handleClearSelection = () => setSelectedRows(new Set())

  // ─────────────────────────────────────────────
  // FILTERS
  // ─────────────────────────────────────────────

  const handleFiltersChange = (newFilters: PurchaseFilterValues) => {
    setFilters(newFilters)
    setPage(1)
  }

  const handleClearAllFilters = () => {
    setFilters({
      search:         '',
      supplierId:     undefined,
      status:         undefined,
      paymentStatus:  undefined,
      purchaseType:   undefined,
      approvalStatus: undefined,
      dateRange:      undefined,
    })
    setPage(1)
  }

  // ─────────────────────────────────────────────
  // ROW ACTIONS
  // ─────────────────────────────────────────────

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
    [handleViewDetails, handleEdit, handleReceive, handleAddPayment,
     handleApprove, handleReject, handleCancel, handleDelete]
  )

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────

  return (
    <div className="w-full space-y-4">

      {/* Filters */}
      <PurchaseFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearAll={handleClearAllFilters}
        suppliers={[]}
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
   data={((purchases as any)?.purchases ?? purchases ?? []) as IPurchase[]}
        columns={purchaseTableColumns}

        // ✅ FIX 2: loading takes LoadingConfig object { isLoading }
        loading={{ isLoading }}

        sorting={{ enabled: true }}

        // ✅ FIX 3: pageIndex (0-based), onPaginationChange — no currentPage
        pagination={{
          enabled:              true,
          pageIndex:            page - 1,
          pageSize:             limit,
          totalItems: (pagination as any)?.totalItems,
          pageSizeOptions:      [10, 20, 50, 100],
          showPageSizeSelector: true,
          showPageInfo:         true,
          showFirstLastButtons: true,
          onPaginationChange: (state) => {
            setPage(state.pageIndex + 1)
            // ✅ FIX 4: explicitly typed — state.pageSize is number
            setLimit(state.pageSize as number)
          },
        }}

        selection={{
          enabled:           true,
          selectedRows,
          onSelectionChange: setSelectedRows,
          getRowId:          row => row._id,
          selectAllEnabled:  true,
        }}

        rowActions={{
          enabled:  true,
          actions:  rowActions,
          position: 'end',
        }}

        emptyState={{ message: t('table.noPurchases', 'No purchases found') }}

        style={{
          variant:      'default',
          size:         'md',
          stickyHeader: true,
          hoverEffect:  true,
          zebraStripes: false,
          showBorder:   true,
          rounded:      true,
          shadow:       true,
          fullWidth:    true,
        }}

        onRowClick={purchase => navigate(`/purchases/${purchase._id}`)}
        getRowId={row => row._id}
        testId="purchase-table"
        ariaLabel={t('table.ariaLabel', 'Purchase Table')}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={open => setConfirmDialog(prev => ({ ...prev, open }))}
        title={confirmDialog.title}
        description={confirmDialog.desc}
        variant={confirmDialog.variant}
        confirmLabel={t('common.confirm', 'Confirm')}
        cancelLabel={t('common.cancel',  'Cancel')}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
        loading={isConfirming}
      />
    </div>
  )
}

PurchaseTable.displayName = 'PurchaseTable'