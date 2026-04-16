// FILE: src/components/girviTransfer/GirviTransferTable/GirviTransferTable.tsx

import React, { useState, useMemo, useCallback } from 'react'
import { useTranslation }   from 'react-i18next'
import { useNavigate }      from 'react-router-dom'
import { DataTable }        from '@/components/ui/data-display/DataTable'
import { ConfirmDialog }    from '@/components/ui/overlay/Dialog/ConfirmDialog'
import type { ConfirmDialogVariant } from '@/components/ui/overlay/Dialog/ConfirmDialog'
import { useShopTransferList }       from '@/hooks/girviTransfer'
import { useGirviTransferActions }   from '@/hooks/girviTransfer'
import { girviTransferTableColumns } from './GirviTransferTableColumns'
import { getGirviTransferRowActions } from './GirviTransferTableActions'
import type { IGirviTransfer }        from '@/types/girviTransfer.types'
import type { GirviTransferTableProps } from './GirviTransferTable.types'

export const GirviTransferTable: React.FC<GirviTransferTableProps> = ({
  shopId,
  girviId,
}) => {
  const { t }      = useTranslation()
  const navigate   = useNavigate()

  const [page,  setPage]  = useState(1)
  const [limit, setLimit] = useState(20)

  const [confirmDialog, setConfirmDialog] = useState<{
    open:      boolean
    title:     string
    desc:      string
    variant:   ConfirmDialogVariant
    onConfirm: () => Promise<void>
  }>({
    open: false, title: '', desc: '', variant: 'warning', onConfirm: async () => {},
  })
  const [isConfirming, setIsConfirming] = useState(false)

  // ── Data ──
  const { transfers, pagination, isLoading } = useShopTransferList(shopId, {
    page, limit,
  })

  // ── Actions ──
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

  const handleViewDetails = useCallback((transfer: IGirviTransfer) => {
    navigate(`/girvi/${transfer.girviId}/transfers/${transfer._id}`)
  }, [navigate])

  const handleReturn = useCallback((transfer: IGirviTransfer) => {
    navigate(`/girvi/${transfer.girviId}/transfers/${transfer._id}?action=return`)
  }, [navigate])

  const handleCancel = useCallback((transfer: IGirviTransfer) => {
    const { cancelTransfer } = useGirviTransferActions(shopId, String(transfer.girviId), transfer._id)
    openConfirm(
      t('girviTransfer.confirmCancel', 'Cancel Transfer?'),
      t('girviTransfer.confirmCancelDesc', `Cancel ${transfer.transferNumber}?`),
      'danger',
      async () => { await cancelTransfer() }
    )
  }, [shopId, openConfirm, t])

  const rowActions = useMemo(
    () => getGirviTransferRowActions(handleViewDetails, handleReturn, handleCancel),
    [handleViewDetails, handleReturn, handleCancel]
  )

  return (
    <div className="w-full space-y-4">
      <DataTable
        data={transfers}
        columns={girviTransferTableColumns}
        loading={{ isLoading }}
        sorting={{ enabled: true }}
        pagination={{
          enabled:              true,
          pageIndex:            page - 1,
          pageSize:             limit,
          totalItems:           pagination?.total,
          pageSizeOptions:      [10, 20, 50],
          showPageSizeSelector: true,
          showPageInfo:         true,
          showFirstLastButtons: true,
          onPaginationChange: state => {
            setPage(state.pageIndex + 1)
            setLimit(state.pageSize as number)
          },
        }}
        rowActions={{
          enabled:  true,
          actions:  rowActions,
          position: 'end',
        }}
        emptyState={{ message: t('table.noTransfers', 'No transfers found') }}
        style={{
          variant:      'default',
          size:         'md',
          stickyHeader: true,
          hoverEffect:  true,
          showBorder:   true,
          rounded:      true,
          shadow:       true,
          fullWidth:    true,
        }}
        onRowClick={transfer =>
          navigate(`/girvi/${transfer.girviId}/transfers/${transfer._id}`)
        }
        getRowId={row => row._id}
        testId="girvi-transfer-table"
      />

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