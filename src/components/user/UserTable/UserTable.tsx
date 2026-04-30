// FILE: src/components/user/UserTable/UserTable.tsx

import React, { useState, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { DataTable } from '@/components/ui/data-display/DataTable'
import { ConfirmDialog } from '@/components/ui/overlay/Dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { userTableColumns } from './UserTableColumns'
import { getUserRowActions, BulkActionsBar } from './UserTableActions'
import { UserFilters } from '@/components/user/UserFilters/UserFilters'
import type { UserFilterValues } from '@/components/user/UserFilters/UserFilters'
import { useUsersList } from '@/hooks/user/useUsersList'
import { useUserActions } from '@/hooks/user/useUserActions'
import { usePermissionCheck } from '@/hooks/auth/usePermissions'
import type { User } from '@/types/user.types'

export const UserTable: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { can } = usePermissionCheck()

  // ── Selection ──────────────────────────────────────────
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())

  // ── Dialog States ──────────────────────────────────────
  const [deleteDialog,     setDeleteDialog]     = useState<{ open: boolean; user: User | null }>({ open: false, user: null })
  const [deactivateDialog, setDeactivateDialog] = useState<{ open: boolean; user: User | null }>({ open: false, user: null })
  const [resetPwdDialog,   setResetPwdDialog]   = useState<{ open: boolean; user: User | null; password: string; confirm: string }>({ open: false, user: null, password: '', confirm: '' })

  // ── Filters ────────────────────────────────────────────
  const [filters, setFilters] = useState<UserFilterValues>({
    search: '',
    role: undefined,
    department: undefined,
    isActive: undefined,
  })

  // ── Data & Actions ─────────────────────────────────────
  const { users, pagination, isLoading, setPage } = useUsersList({
    search:     filters.search || undefined,
    role:       filters.role,
    department: filters.department,
    isActive:
      filters.isActive === 'active'
        ? true
        : filters.isActive === 'inactive'
          ? false
          : undefined,
  })

  const {
    deleteUser, isDeleting,
    activateUser, isActivating,
    deactivateUser, isDeactivating,
    adminResetPassword, isResettingPassword,
  } = useUserActions()

// AFTER
const handleViewDetails = useCallback((user: User) =>
  navigate(`/users/${user._id}`), [navigate])

const handleEdit = useCallback((user: User) =>
  navigate(`/users/edit/${user._id}`), [navigate])

const handleActivate = useCallback(async (user: User) => {
  await activateUser(user._id)
}, [activateUser])

const handleDeactivate = useCallback((user: User) =>
  setDeactivateDialog({ open: true, user }), [])

const handleDelete = useCallback((user: User) =>
  setDeleteDialog({ open: true, user }), [])

const handleResetPassword = useCallback((user: User) =>
  setResetPwdDialog({ open: true, user, password: '', confirm: '' }), [])
// AFTER
const handleConfirmDelete = async () => {
  if (!deleteDialog.user) return
  await deleteUser(deleteDialog.user._id)
  setDeleteDialog({ open: false, user: null })
}

const handleConfirmDeactivate = async () => {
  if (!deactivateDialog.user) return
  await deactivateUser(deactivateDialog.user._id)
  setDeactivateDialog({ open: false, user: null })
}

const handleConfirmResetPassword = async () => {

    if (!resetPwdDialog.user || !resetPwdDialog.password) return
    if (resetPwdDialog.password !== resetPwdDialog.confirm) return
    await adminResetPassword(resetPwdDialog.user._id, resetPwdDialog.password)
    setResetPwdDialog({ open: false, user: null, password: '', confirm: '' })
  }

  // ── Bulk ───────────────────────────────────────────────
  const selectedUsers = useMemo(
    () => users.filter(u => selectedRows.has(u._id)),
    [users, selectedRows]
  )

  const handleClearSelection = () => setSelectedRows(new Set())

  // ── Row Actions ────────────────────────────────────────
// AFTER
const rowActions = useMemo(
  () =>
    getUserRowActions(
      handleViewDetails,
      can('canEditUsers') ? handleEdit : () => {},
      handleActivate,
      can('canEditUsers') ? handleDeactivate : () => {},
      can('canEditUsers') ? handleResetPassword : () => {},
    ),
  [can, handleViewDetails, handleEdit, handleActivate, handleDeactivate, handleResetPassword]
)

  return (
    <div className="w-full space-y-4">
      {/* Filters */}
      <UserFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearAll={() =>
          setFilters({ search: '', role: undefined, department: undefined, isActive: undefined })
        }
      />

      {/* Bulk Actions */}
      {selectedRows.size > 0 && can('canManageUsers') && (
        <BulkActionsBar
          selectedCount={selectedRows.size}
          selectedUsers={selectedUsers}
          onViewDetails={() => selectedUsers.length === 1 && handleViewDetails(selectedUsers[0])}
          onEdit={() => selectedUsers.length === 1 && handleEdit(selectedUsers[0])}
          onActivate={() => selectedUsers.forEach(u => activateUser(u._id))}
          onDeactivate={() => selectedUsers.length === 1 && handleDeactivate(selectedUsers[0])}
          onClearSelection={handleClearSelection}
        />
      )}

      {/* DataTable - reusing the shared DataTable component */}
      <DataTable
        data={users}
        columns={userTableColumns}
        sorting={{ enabled: true }}
        pagination={{
          enabled: true,
          pageSize: pagination.limit,
          pageSizeOptions: [10, 20, 50],
          showPageSizeSelector: true,
          showPageInfo: true,
          showFirstLastButtons: true,
          totalItems: pagination.total,
          totalPages: pagination.totalPages,
          pageIndex: pagination.page - 1,
          onPaginationChange: ({ pageIndex }) => setPage(pageIndex + 1),
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
          message: isLoading ? t('table.loading') : t('table.noUsers'),
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
        // onRowClick={user => navigate(`/users/${user._id}`)}
        getRowId={row => row._id}
        testId="user-table"
        ariaLabel={t('user.table.ariaLabel')}
      />

      {/* ── Dialogs ── */}

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={open => setDeleteDialog(prev => ({ ...prev, open }))}
        title={t('user.actions.delete')}
        description={t('user.deleteConfirm', { name: deleteDialog.user?.fullName || deleteDialog.user?.username })}
        variant="danger"
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />

      {/* Deactivate Confirm */}
      <ConfirmDialog
        open={deactivateDialog.open}
        onOpenChange={open => setDeactivateDialog(prev => ({ ...prev, open }))}
        title={t('user.actions.deactivate')}
        description={t('user.deactivateConfirm', { name: deactivateDialog.user?.fullName || deactivateDialog.user?.username })}
        variant="warning"
        confirmLabel={t('user.actions.deactivate')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleConfirmDeactivate}
        loading={isDeactivating}
      />

      {/* Reset Password Dialog */}
      <ConfirmDialog
        open={resetPwdDialog.open}
        onOpenChange={open => setResetPwdDialog(prev => ({ ...prev, open }))}
        title={t('user.actions.resetPassword')}
        variant="info"
        confirmLabel={t('user.actions.resetPassword')}
        cancelLabel={t('common.cancel')}
        loading={isResettingPassword}
onConfirm={
  !resetPwdDialog.password ||
  resetPwdDialog.password !== resetPwdDialog.confirm ||
  resetPwdDialog.password.length < 6
    ? undefined
    : handleConfirmResetPassword
}
      >
        <div className="space-y-3 px-6 pb-2">
          <div>
            <Label className="mb-1">{t('user.newPassword')} *</Label>
            <Input
              type="password"
              value={resetPwdDialog.password}
              onChange={e =>
                setResetPwdDialog(prev => ({ ...prev, password: e.target.value }))
              }
              placeholder={t('user.newPasswordPlaceholder')}
            />
          </div>
          <div>
            <Label className="mb-1">{t('user.confirmNewPassword')} *</Label>
            <Input
              type="password"
              value={resetPwdDialog.confirm}
              onChange={e =>
                setResetPwdDialog(prev => ({ ...prev, confirm: e.target.value }))
              }
              placeholder={t('user.confirmNewPasswordPlaceholder')}
            />
            {resetPwdDialog.password &&
              resetPwdDialog.confirm &&
              resetPwdDialog.password !== resetPwdDialog.confirm && (
                <p className="mt-1 text-xs text-status-error">
                  {t('validation.passwordsDoNotMatch')}
                </p>
              )}
          </div>
        </div>
      </ConfirmDialog>
    </div>
  )
}

UserTable.displayName = 'UserTable'