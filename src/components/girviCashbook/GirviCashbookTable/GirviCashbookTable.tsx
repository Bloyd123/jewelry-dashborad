// FILE: src/components/girviCashbook/GirviCashbookTable/GirviCashbookTable.tsx

import React, { useState, useMemo, useCallback } from 'react'
import { useTranslation }   from 'react-i18next'
import { Trash2 }           from 'lucide-react'
import { DataTable }        from '@/components/ui/data-display/DataTable'
import { ConfirmDialog }    from '@/components/ui/overlay/Dialog/ConfirmDialog'
import type { ConfirmDialogVariant } from '@/components/ui/overlay/Dialog/ConfirmDialog'
import { useGirviCashbookList }    from '@/hooks/girviCashbook/useGirviCashbookList'
import { useGirviSpecificCashbook } from '@/hooks/girviCashbook/'
import { useGirviCashbookActions } from '@/hooks/girviCashbook/useGirviCashbookActions'
import { girviCashbookTableColumns } from './GirviCashbookTableColumns'
import type { IGirviCashbookEntry }  from '@/types/girviCashbook.types'
import type { GirviCashbookTableProps } from './GirviCashbookTable.types'
import type { RowAction } from '@/components/ui/data-display/DataTable'

export const GirviCashbookTable: React.FC<GirviCashbookTableProps> = ({
  shopId,
  girviId,
}) => {
  const { t } = useTranslation()

  const [page,  setPage]  = useState(1)
  const [limit, setLimit] = useState(50)

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
    variant:   'danger',
    onConfirm: async () => {},
  })
  const [isConfirming, setIsConfirming] = useState(false)

  const listHook    = useGirviCashbookList(shopId, { page, limit })
  const girviHook   = useGirviSpecificCashbook(shopId, girviId ?? '')

  const entries     = girviId ? girviHook.entries    : listHook.entries
  const pagination  = girviId ? undefined            : listHook.pagination
  const isLoading   = girviId ? girviHook.isLoading  : listHook.isLoading

  const { deleteEntry, isDeleting } = useGirviCashbookActions(shopId)

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

  const handleDelete = useCallback((entry: IGirviCashbookEntry) => {
    openConfirm(
      t('girviCashbook.confirmDelete', 'Delete Entry?'),
      t('girviCashbook.confirmDeleteDesc',
        `Delete entry ${entry.entryNumber}? This action cannot be undone.`),
      'danger',
      async () => { await deleteEntry(entry._id) }
    )
  }, [deleteEntry, openConfirm, t])

  const rowActions: RowAction<IGirviCashbookEntry>[] = useMemo(() => [
    {
      label:   'actions.delete',
      icon:    <Trash2 className="h-4 w-4" />,
      onClick: handleDelete,
      variant: 'destructive',
    },
  ], [handleDelete])

  return (
    <div className="w-full space-y-4">
      <DataTable
        data={entries}
        columns={girviCashbookTableColumns}
        loading={{ isLoading }}
        sorting={{ enabled: true }}
        pagination={
          !girviId
            ? {
                enabled:              true,
                pageIndex:            page - 1,
                pageSize:             limit,
                totalItems:           pagination?.total,
                pageSizeOptions:      [20, 50, 100],
                showPageSizeSelector: true,
                showPageInfo:         true,
                showFirstLastButtons: true,
                onPaginationChange: state => {
                  setPage(state.pageIndex + 1)
                  setLimit(state.pageSize as number)
                },
              }
            : { enabled: false }
        }
        rowActions={{
          enabled:  true,
          actions:  rowActions,
          position: 'end',
        }}
        emptyState={{
          message: t('table.noEntries', 'No cashbook entries found'),
        }}
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
        getRowId={row => row._id}
        testId="girvi-cashbook-table"
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
        loading={isConfirming || isDeleting}
      />
    </div>
  )
}