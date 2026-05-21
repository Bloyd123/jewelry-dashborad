// FILE: src/components/scheme/SchemeTable/SchemeTableActions.tsx

import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  Archive,
  CheckCircle,
  XCircle,
  MoreVertical,
  Users,
  BarChart3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { RowAction } from '@/components/ui/data-display/DataTable'
import type { Scheme } from '@/types/scheme.types'
import { usePermissionCheck } from '@/hooks/auth/usePermissions'

// ─────────────────────────────────────────────
// ROW ACTIONS
// ─────────────────────────────────────────────
export const getSchemeRowActions = (
  onViewDetails:  (scheme: Scheme) => void,
  onEdit:         (scheme: Scheme) => void,
  onActivate:     (scheme: Scheme) => void,
  onPause:        (scheme: Scheme) => void,
  onArchive:      (scheme: Scheme) => void,
  onApprove:      (scheme: Scheme) => void,
  onReject:       (scheme: Scheme) => void,
  onViewEnrollments: (scheme: Scheme) => void,
  onDelete:       (scheme: Scheme) => void,
): RowAction<Scheme>[] => [
  {
    label:   'scheme.actions.viewDetails',
    icon:    <Eye className="h-4 w-4" />,
    onClick: onViewDetails,
    variant: 'default',
  },
  {
    label:   'scheme.actions.edit',
    icon:    <Edit className="h-4 w-4" />,
    onClick: onEdit,
    variant: 'default',
    hidden:  row => row.status === 'archived',
  },
  {
    label:   'scheme.actions.viewEnrollments',
    icon:    <Users className="h-4 w-4" />,
    onClick: onViewEnrollments,
    variant: 'default',
  },
  {
    label:   'scheme.actions.activate',
    icon:    <Play className="h-4 w-4" />,
    onClick: onActivate,
    variant: 'default',
    hidden:  row =>
      row.status === 'active' ||
      row.status === 'archived' ||
      row.approvalStatus !== 'approved',
  },
  {
    label:   'scheme.actions.pause',
    icon:    <Pause className="h-4 w-4" />,
    onClick: onPause,
    variant: 'default',
    hidden:  row => row.status !== 'active',
  },
  {
    label:   'scheme.actions.approve',
    icon:    <CheckCircle className="h-4 w-4" />,
    onClick: onApprove,
    variant: 'default',
    hidden:  row => row.approvalStatus !== 'pending',
  },
  {
    label:   'scheme.actions.reject',
    icon:    <XCircle className="h-4 w-4" />,
    onClick: onReject,
    variant: 'destructive',
    hidden:  row => row.approvalStatus !== 'pending',
  },
  {
    label:   'scheme.actions.archive',
    icon:    <Archive className="h-4 w-4" />,
    onClick: onArchive,
    variant: 'destructive',
    hidden:  row =>
      row.status === 'archived' ||
      row.statistics.activeEnrollments > 0,
  },
  {
    label:    'scheme.actions.delete',
    icon:     <Trash2 className="h-4 w-4" />,
    onClick:  onDelete,
    variant:  'destructive',
    disabled: row => row.statistics.activeEnrollments > 0,
    hidden:   row => row.status === 'active',
  },
]

// ─────────────────────────────────────────────
// BULK ACTIONS BAR
// ─────────────────────────────────────────────
interface BulkActionsBarProps {
  selectedCount:   number
  selectedSchemes: Scheme[]
  onViewDetails:   () => void
  onEdit:          () => void
  onActivate:      () => void
  onPause:         () => void
  onArchive:       () => void
  onDelete:        () => void
  onExport:        () => void
  onClearSelection:() => void
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  selectedSchemes,
  onViewDetails,
  onEdit,
  onActivate,
  onPause,
  onArchive,
  onDelete,
  onExport,
  onClearSelection,
}) => {
  const { t }   = useTranslation()
  const { can } = usePermissionCheck()

  const hasActiveEnrollments = selectedSchemes.some(
    s => s.statistics.activeEnrollments > 0
  )
  const allActive  = selectedSchemes.every(s => s.status === 'active')
  const allPaused  = selectedSchemes.every(s => s.status === 'paused')
  const allDraft   = selectedSchemes.every(s => s.status === 'draft')

  return (
    <div className="bg-accent/10 flex flex-col items-start justify-between gap-3 border-b border-border-primary px-4 py-3 sm:flex-row sm:items-center">
      {/* Count + Clear */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-text-primary">
          {t('table.selectedCount', { count: selectedCount })}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="h-8 text-xs text-text-secondary"
        >
          {t('common.clearSelection')}
        </Button>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {selectedCount === 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
            className="h-9 gap-2"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">{t('scheme.actions.viewDetails')}</span>
          </Button>
        )}

        {selectedCount === 1 && can('canManageSchemes') && (
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="h-9 gap-2"
          >
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">{t('scheme.actions.edit')}</span>
          </Button>
        )}

        {!allActive && can('canManageSchemes') && (
          <Button
            variant="outline"
            size="sm"
            onClick={onActivate}
            className="h-9 gap-2"
          >
            <Play className="h-4 w-4" />
            <span className="hidden sm:inline">{t('scheme.actions.activate')}</span>
          </Button>
        )}

        {allActive && can('canManageSchemes') && (
          <Button
            variant="outline"
            size="sm"
            onClick={onPause}
            className="h-9 gap-2"
          >
            <Pause className="h-4 w-4" />
            <span className="hidden sm:inline">{t('scheme.actions.pause')}</span>
          </Button>
        )}

        {can('canManageSchemes') && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="h-9 gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">{t('scheme.actions.export')}</span>
          </Button>
        )}

        {can('canManageSchemes') && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            disabled={hasActiveEnrollments}
            className="h-9 gap-2"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">{t('scheme.actions.delete')}</span>
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onExport}>
              {t('scheme.actions.exportSelected')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onArchive}
              className="text-status-error"
              disabled={hasActiveEnrollments}
            >
              {t('scheme.actions.archive')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}