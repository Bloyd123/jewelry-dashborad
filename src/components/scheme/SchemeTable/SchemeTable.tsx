// FILE: src/components/scheme/SchemeTable/SchemeTable.tsx

import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/auth'
import { usePermissionCheck } from '@/hooks/auth/usePermissions'
import { useSchemesList } from '@/hooks/scheme/useSchemesList'
import { useSchemeActions } from '@/hooks/scheme/useSchemeActions'
import { DataTable } from '@/components/ui/data-display/DataTable'
import { ConfirmDialog } from '@/components/ui/overlay/Dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { schemeTableColumns } from './SchemeTableColumns'
import { getSchemeRowActions, BulkActionsBar } from './SchemeTableActions'
import { SchemeFilters } from '@/components/scheme/SchemeFilters'
import type { Scheme } from '@/types/scheme.types'
import type { SchemeFilterValues } from './SchemeTable.types'

export const SchemeTable: React.FC = () => {
  const { t }          = useTranslation()
  const navigate       = useNavigate()
  const { can }        = usePermissionCheck()
  const { currentShopId } = useAuth()

  // ─────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────
  const [currentPage,  setCurrentPage]  = useState(1)
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())

  const [filters, setFilters] = useState<SchemeFilterValues>({
    search:      '',
    status:      undefined,
    schemeType:  undefined,
    isActive:    undefined,
    isFeatured:  undefined,
  })

  // Dialogs
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean; scheme: Scheme | null
  }>({ open: false, scheme: null })

  const [pauseDialog, setPauseDialog] = useState<{
    open: boolean; scheme: Scheme | null; reason: string
  }>({ open: false, scheme: null, reason: '' })

  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean; scheme: Scheme | null; reason: string
  }>({ open: false, scheme: null, reason: '' })

  const [approveDialog, setApproveDialog] = useState<{
    open: boolean; scheme: Scheme | null; notes: string
  }>({ open: false, scheme: null, notes: '' })

  const [archiveDialog, setArchiveDialog] = useState<{
    open: boolean; scheme: Scheme | null
  }>({ open: false, scheme: null })

  const [activateDialog, setActivateDialog] = useState<{
    open: boolean; scheme: Scheme | null
  }>({ open: false, scheme: null })

  // ─────────────────────────────────────────────
  // DATA
  // ─────────────────────────────────────────────
  const { schemes, pagination, isLoading } = useSchemesList(
    currentShopId!,
    {
      page:       currentPage,
      limit:      10,
      search:     filters.search     || undefined,
      status:     filters.status     || undefined,
      schemeType: filters.schemeType || undefined,
      isActive:   filters.isActive === 'true'
        ? true
        : filters.isActive === 'false'
        ? false
        : undefined,
      isFeatured: filters.isFeatured === 'true'
        ? true
        : undefined,
    }
  )

  const {
    deleteScheme,    isDeleting,
    activateScheme,  isActivating,
    pauseScheme,     isPausing,
    archiveScheme,   isArchiving,
    approveScheme,   isApproving,
    rejectScheme,    isRejecting,
    bulkExportSchemes,
  } = useSchemeActions(currentShopId!)

  // ─────────────────────────────────────────────
  // HANDLERS — NAVIGATION
  // ─────────────────────────────────────────────
  const handleViewDetails = (scheme: Scheme) =>
    navigate(`/schemes/${scheme._id}`)

  const handleEdit = (scheme: Scheme) =>
    navigate(`/schemes/edit/${scheme._id}`)

  const handleViewEnrollments = (scheme: Scheme) =>
    navigate(`/schemes/${scheme._id}?tab=enrollments`)

  // ─────────────────────────────────────────────
  // HANDLERS — DIALOGS OPEN
  // ─────────────────────────────────────────────
  const handleActivate = (scheme: Scheme) =>
    setActivateDialog({ open: true, scheme })

  const handlePause = (scheme: Scheme) =>
    setPauseDialog({ open: true, scheme, reason: '' })

  const handleArchive = (scheme: Scheme) =>
    setArchiveDialog({ open: true, scheme })

  const handleApprove = (scheme: Scheme) =>
    setApproveDialog({ open: true, scheme, notes: '' })

  const handleReject = (scheme: Scheme) =>
    setRejectDialog({ open: true, scheme, reason: '' })

  const handleDelete = (scheme: Scheme) =>
    setDeleteDialog({ open: true, scheme })

  // ─────────────────────────────────────────────
  // HANDLERS — CONFIRM ACTIONS
  // ─────────────────────────────────────────────
  const handleConfirmActivate = async () => {
    if (!activateDialog.scheme) return
    await activateScheme(activateDialog.scheme._id)
    setActivateDialog({ open: false, scheme: null })
  }

  const handleConfirmPause = async () => {
    if (!pauseDialog.scheme) return
    await pauseScheme(pauseDialog.scheme._id, pauseDialog.reason)
    setPauseDialog({ open: false, scheme: null, reason: '' })
  }

  const handleConfirmArchive = async () => {
    if (!archiveDialog.scheme) return
    await archiveScheme(archiveDialog.scheme._id)
    setArchiveDialog({ open: false, scheme: null })
  }

  const handleConfirmApprove = async () => {
    if (!approveDialog.scheme) return
    await approveScheme(approveDialog.scheme._id, approveDialog.notes)
    setApproveDialog({ open: false, scheme: null, notes: '' })
  }

  const handleConfirmReject = async () => {
    if (!rejectDialog.scheme || !rejectDialog.reason.trim()) return
    await rejectScheme(rejectDialog.scheme._id, rejectDialog.reason)
    setRejectDialog({ open: false, scheme: null, reason: '' })
  }

  const handleConfirmDelete = async () => {
    if (!deleteDialog.scheme) return
    await deleteScheme(deleteDialog.scheme._id)
    setDeleteDialog({ open: false, scheme: null })
  }

  // ─────────────────────────────────────────────
  // HANDLERS — BULK
  // ─────────────────────────────────────────────
  const handleBulkViewDetails = () => {
    if (selectedSchemes.length === 1) handleViewDetails(selectedSchemes[0])
  }

  const handleBulkEdit = () => {
    if (selectedSchemes.length === 1) handleEdit(selectedSchemes[0])
  }

  const handleBulkActivate = async () => {
    for (const scheme of selectedSchemes) {
      if (scheme.status !== 'active') await activateScheme(scheme._id)
    }
    setSelectedRows(new Set())
  }

  const handleBulkPause = async () => {
    for (const scheme of selectedSchemes) {
      if (scheme.status === 'active') await pauseScheme(scheme._id)
    }
    setSelectedRows(new Set())
  }

  const handleBulkArchive = async () => {
    for (const scheme of selectedSchemes) {
      await archiveScheme(scheme._id)
    }
    setSelectedRows(new Set())
  }

  const handleBulkDelete = async () => {
    for (const scheme of selectedSchemes) {
      await deleteScheme(scheme._id)
    }
    setSelectedRows(new Set())
  }

  const handleBulkExport = async () => {
    await bulkExportSchemes({
      schemeIds: selectedSchemes.map(s => s._id),
      format:    'excel',
    })
  }

  const handleClearSelection = () => setSelectedRows(new Set())

  // ─────────────────────────────────────────────
  // FILTERS
  // ─────────────────────────────────────────────
  const handleFiltersChange = (newFilters: SchemeFilterValues) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleClearAllFilters = () => {
    setFilters({
      search:     '',
      status:     undefined,
      schemeType: undefined,
      isActive:   undefined,
      isFeatured: undefined,
    })
    setCurrentPage(1)
  }

  // ─────────────────────────────────────────────
  // DERIVED
  // ─────────────────────────────────────────────
  const selectedSchemes = useMemo(
    () => schemes.filter(s => selectedRows.has(s._id)),
    [schemes, selectedRows]
  )

  const rowActions = useMemo(
    () =>
      getSchemeRowActions(
        handleViewDetails,
        can('canManageSchemes') ? handleEdit          : () => {},
        can('canManageSchemes') ? handleActivate      : () => {},
        can('canManageSchemes') ? handlePause         : () => {},
        can('canManageSchemes') ? handleArchive       : () => {},
        can('canManageSchemes') ? handleApprove       : () => {},
        can('canManageSchemes') ? handleReject        : () => {},
        handleViewEnrollments,
        can('canManageSchemes') ? handleDelete        : () => {},
      ),
    [can]
  )

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div className="w-full space-y-4">

      {/* Filters */}
      <SchemeFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearAll={handleClearAllFilters}
      />

      {/* Bulk Actions */}
      {selectedRows.size > 0 && can('canManageSchemes') && (
        <BulkActionsBar
          selectedCount={selectedRows.size}
          selectedSchemes={selectedSchemes}
          onViewDetails={handleBulkViewDetails}
          onEdit={handleBulkEdit}
          onActivate={handleBulkActivate}
          onPause={handleBulkPause}
          onArchive={handleBulkArchive}
          onDelete={handleBulkDelete}
          onExport={handleBulkExport}
          onClearSelection={handleClearSelection}
        />
      )}

      {/* Table */}
      <DataTable
        data={schemes}
        columns={schemeTableColumns}
        sorting={{ enabled: true }}
        pagination={{
          enabled:              true,
          pageSize:             10,
          pageIndex:            currentPage - 1,
          totalItems:           pagination?.total,
          totalPages:           pagination?.pages,
          pageSizeOptions:      [10, 20, 50],
          showPageSizeSelector: true,
          showPageInfo:         true,
          showFirstLastButtons: true,
          onPaginationChange:   ({ pageIndex }) =>
            setCurrentPage(pageIndex + 1),
        }}
        selection={{
          enabled:          true,
          selectedRows,
          onSelectionChange:setSelectedRows,
          getRowId:         row => row._id,
          selectAllEnabled: true,
        }}
        rowActions={{
          enabled:  true,
          actions:  rowActions,
          position: 'end',
        }}
        emptyState={{
          message: isLoading
            ? t('table.loading')
            : t('scheme.table.noSchemes'),
        }}
        style={{
          variant:     'default',
          size:        'md',
          stickyHeader: true,
          hoverEffect: true,
          zebraStripes:false,
          showBorder:  true,
          rounded:     true,
          shadow:      true,
          fullWidth:   true,
        }}
        getRowId={row => row._id}
      />

      {/* ── DIALOGS ─────────────────────────── */}

      {/* Activate */}
      <ConfirmDialog
        open={activateDialog.open}
        onOpenChange={open => setActivateDialog(prev => ({ ...prev, open }))}
        title={t('scheme.actions.activate')}
        description={t('scheme.confirmActivate', {
          name: activateDialog.scheme?.schemeName,
        })}
        variant="success"
        confirmLabel={t('scheme.actions.activate')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleConfirmActivate}
        loading={isActivating}
      />

      {/* Pause */}
      <ConfirmDialog
        open={pauseDialog.open}
        onOpenChange={open => setPauseDialog(prev => ({ ...prev, open }))}
        title={t('scheme.actions.pause')}
        variant="warning"
        confirmLabel={t('scheme.actions.pause')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleConfirmPause}
        loading={isPausing}
      >
        <div className="px-6 pb-4">
          <Label className="mb-1">{t('scheme.pauseReason')}</Label>
          <Textarea
            value={pauseDialog.reason}
            onChange={e =>
              setPauseDialog(prev => ({ ...prev, reason: e.target.value }))
            }
            rows={3}
            placeholder={t('scheme.pauseReasonPlaceholder')}
          />
        </div>
      </ConfirmDialog>

      {/* Archive */}
      <ConfirmDialog
        open={archiveDialog.open}
        onOpenChange={open => setArchiveDialog(prev => ({ ...prev, open }))}
        title={t('scheme.actions.archive')}
        description={t('scheme.confirmArchive', {
          name: archiveDialog.scheme?.schemeName,
        })}
        variant="warning"
        confirmLabel={t('scheme.actions.archive')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleConfirmArchive}
        loading={isArchiving}
      />

      {/* Approve */}
      <ConfirmDialog
        open={approveDialog.open}
        onOpenChange={open => setApproveDialog(prev => ({ ...prev, open }))}
        title={t('scheme.actions.approve')}
        variant="success"
        confirmLabel={t('scheme.actions.approve')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleConfirmApprove}
        loading={isApproving}
      >
        <div className="px-6 pb-4">
          <Label className="mb-1">{t('scheme.approveNotes')}</Label>
          <Textarea
            value={approveDialog.notes}
            onChange={e =>
              setApproveDialog(prev => ({ ...prev, notes: e.target.value }))
            }
            rows={3}
            placeholder={t('scheme.approveNotesPlaceholder')}
          />
        </div>
      </ConfirmDialog>

      {/* Reject */}
      <ConfirmDialog
        open={rejectDialog.open}
        onOpenChange={open => setRejectDialog(prev => ({ ...prev, open }))}
        title={t('scheme.actions.reject')}
        variant="danger"
        confirmLabel={t('scheme.actions.reject')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleConfirmReject}
        loading={isRejecting}
        disabled={!rejectDialog.reason.trim()}
      >
        <div className="px-6 pb-4">
          <Label className="mb-1">{t('scheme.rejectReason')} *</Label>
          <Textarea
            value={rejectDialog.reason}
            onChange={e =>
              setRejectDialog(prev => ({ ...prev, reason: e.target.value }))
            }
            rows={3}
            placeholder={t('scheme.rejectReasonPlaceholder')}
          />
        </div>
      </ConfirmDialog>

      {/* Delete */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={open => setDeleteDialog(prev => ({ ...prev, open }))}
        title={t('scheme.actions.delete')}
        description={t('scheme.confirmDelete', {
          name: deleteDialog.scheme?.schemeName,
        })}
        variant="danger"
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />
    </div>
  )
}

SchemeTable.displayName = 'SchemeTable'