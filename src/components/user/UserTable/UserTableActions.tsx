// FILE: src/components/user/UserTable/UserTableActions.tsx

import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Eye, Edit, Trash2, UserCheck, UserX,
  KeyRound, MoreVertical,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { RowAction } from '@/components/ui/data-display/DataTable'
import type { User } from '@/types/user.types'

// ── Row Actions ────────────────────────────────────────────
export const getUserRowActions = (
  onViewDetails:     (user: User) => void,
  onEdit:            (user: User) => void,
  onActivate:        (user: User) => void,
  onDeactivate:      (user: User) => void,
  onResetPassword:   (user: User) => void,
  onDelete:          (user: User) => void,
): RowAction<User>[] => [
  {
    label: 'user.actions.viewDetails',
    icon: <Eye className="h-4 w-4" />,
    onClick: onViewDetails,
    variant: 'default',
  },
  {
    label: 'user.actions.edit',
    icon: <Edit className="h-4 w-4" />,
    onClick: onEdit,
    variant: 'default',
  },
  {
    label: 'user.actions.activate',
    icon: <UserCheck className="h-4 w-4" />,
    onClick: onActivate,
    variant: 'default',
    hidden: (row) => row.isActive,
  },
  {
    label: 'user.actions.deactivate',
    icon: <UserX className="h-4 w-4" />,
    onClick: onDeactivate,
    variant: 'destructive',
    hidden: (row) => !row.isActive,
  },
  {
    label: 'user.actions.resetPassword',
    icon: <KeyRound className="h-4 w-4" />,
    onClick: onResetPassword,
    variant: 'default',
  },
  {
    label: 'user.actions.delete',
    icon: <Trash2 className="h-4 w-4" />,
    onClick: onDelete,
    variant: 'destructive',
  },
]

// ── Bulk Actions Bar ───────────────────────────────────────
interface BulkActionsBarProps {
  selectedCount:   number
  selectedUsers:   User[]
  onViewDetails:   () => void
  onEdit:          () => void
  onActivate:      () => void
  onDeactivate:    () => void
  onDelete:        () => void
  onClearSelection: () => void
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  selectedUsers,
  onViewDetails,
  onEdit,
  onActivate,
  onDeactivate,
  onDelete,
  onClearSelection,
}) => {
  const { t } = useTranslation()

  const allActive   = selectedUsers.every(u => u.isActive)
  const allInactive = selectedUsers.every(u => !u.isActive)

  return (
    <div className="bg-accent/10 flex flex-col items-start justify-between gap-3 border-b border-border-primary px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
      {/* Count + Clear */}
      <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-4">
        <span className="text-sm font-medium text-text-primary">
          {t('table.selectedCount', { count: selectedCount })}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="h-8 text-xs text-text-secondary hover:text-text-primary sm:text-sm"
        >
          {t('common.clearSelection')}
        </Button>
      </div>

      {/* Actions */}
      <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
        {selectedCount === 1 && (
          <Button variant="outline" size="sm" onClick={onViewDetails} className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">{t('user.actions.viewDetails')}</span>
          </Button>
        )}

        {selectedCount === 1 && (
          <Button variant="outline" size="sm" onClick={onEdit} className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm">
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">{t('user.actions.edit')}</span>
          </Button>
        )}

        {!allActive && (
          <Button variant="outline" size="sm" onClick={onActivate} className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm">
            <UserCheck className="h-4 w-4" />
            <span className="hidden sm:inline">{t('user.actions.activate')}</span>
          </Button>
        )}

        {!allInactive && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDeactivate}
            className="border-status-error/20 hover:bg-status-error/10 h-9 gap-2 text-status-error"
          >
            <UserX className="h-4 w-4" />
            <span className="hidden sm:inline">{t('user.actions.deactivate')}</span>
          </Button>
        )}

        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">{t('user.actions.delete')}</span>
        </Button>

        {/* More dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>{t('user.actions.exportSelected')}</DropdownMenuItem>
            <DropdownMenuItem>{t('user.actions.sendEmail')}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-status-error">
              {t('user.actions.bulkDelete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}