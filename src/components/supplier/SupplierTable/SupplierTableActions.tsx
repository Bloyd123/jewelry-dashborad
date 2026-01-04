//
// FILE: src/components/features/SupplierTable/SupplierTableActions.tsx
// Supplier Table Row Actions & Bulk Actions
//

import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Eye,
  Edit,
  Trash2,
  Star,
  StarOff,
  Ban,
  ShieldOff,
  Award,
  MoreVertical,
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
import type { Supplier } from './SupplierTable.types'

//
// ROW ACTIONS (Individual Supplier Actions)
//

export const getSupplierRowActions = (
  onViewDetails: (supplier: Supplier) => void,
  onEdit: (supplier: Supplier) => void,
  onUpdateRating: (supplier: Supplier) => void,
  onBlacklist: (supplier: Supplier) => void,
  onMarkPreferred: (supplier: Supplier) => void,
  onDelete: (supplier: Supplier) => void
): RowAction<Supplier>[] => [
  {
    label: 'suppliers.actions.viewDetails',
    icon: <Eye className="h-4 w-4" />,
    onClick: onViewDetails,
    variant: 'default',
  },
  {
    label: 'suppliers.actions.edit',
    icon: <Edit className="h-4 w-4" />,
    onClick: onEdit,
    variant: 'default',
  },
  {
    label: 'suppliers.actions.updateRating',
    icon: <Award className="h-4 w-4" />,
    onClick: onUpdateRating,
    variant: 'default',
    hidden: row => !row.isActive || row.isBlacklisted,
  },
  {
    label: 'suppliers.actions.markPreferred',
    icon: <Star className="h-4 w-4" />,
    onClick: onMarkPreferred,
    variant: 'default',
    hidden: row => row.isPreferred || row.isBlacklisted,
  },
  {
    label: 'suppliers.actions.removePreferred',
    icon: <StarOff className="h-4 w-4" />,
    onClick: onMarkPreferred,
    variant: 'default',
    hidden: row => !row.isPreferred,
  },
  {
    label: 'suppliers.actions.blacklist',
    icon: <Ban className="h-4 w-4" />,
    onClick: onBlacklist,
    variant: 'destructive',
    hidden: row => row.isBlacklisted,
  },
  {
    label: 'suppliers.actions.removeBlacklist',
    icon: <ShieldOff className="h-4 w-4" />,
    onClick: onBlacklist,
    variant: 'default',
    hidden: row => !row.isBlacklisted,
  },
  {
    label: 'suppliers.actions.delete',
    icon: <Trash2 className="h-4 w-4" />,
    onClick: onDelete,
    variant: 'destructive',
    disabled: row => row.totalDue > 0,
  },
]

//
// BULK ACTIONS BAR (Shows when rows are selected)
//

interface BulkActionsBarProps {
  selectedCount: number
  selectedSuppliers: Supplier[]
  onViewDetails: () => void
  onEdit: () => void
  onUpdateRating: () => void
  onBlacklist: () => void
  onMarkPreferred: () => void
  onDelete: () => void
  onClearSelection: () => void
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  selectedSuppliers,
  onViewDetails,
  onEdit,
  onUpdateRating,
  onBlacklist,
  onMarkPreferred,
  onDelete,
  onClearSelection,
}) => {
  const { t } = useTranslation()

  // Check conditions
  const hasOutstandingBalance = selectedSuppliers.some(s => s.totalDue > 0)
  const hasInactive = selectedSuppliers.some(s => !s.isActive)
  const allBlacklisted = selectedSuppliers.every(s => s.isBlacklisted)
  const someBlacklisted = selectedSuppliers.some(s => s.isBlacklisted)
  const allPreferred = selectedSuppliers.every(s => s.isPreferred)
  const somePreferred = selectedSuppliers.some(s => s.isPreferred)

  return (
    <div className="bg-accent/10 flex flex-col items-start justify-between gap-3 rounded-lg border-b border-border-primary px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
      {/* Left Section - Selection Info */}
      <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-4">
        <span className="text-sm font-medium text-text-primary">
          {t('suppliers.table.selectedCount', { count: selectedCount })}
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

      {/* Right Section - Action Buttons */}
      <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
        {/* View Details - Only if single selection */}
        {selectedCount === 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
            className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t('suppliers.actions.viewDetails')}
            </span>
          </Button>
        )}

        {/* Edit - Only if single selection */}
        {selectedCount === 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm"
          >
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t('suppliers.actions.edit')}
            </span>
          </Button>
        )}

        {/* Update Rating - Only for active, non-blacklisted */}
        {!hasInactive && !someBlacklisted && (
          <Button
            variant="outline"
            size="sm"
            onClick={onUpdateRating}
            className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm"
          >
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t('suppliers.actions.updateRating')}
            </span>
          </Button>
        )}

        {/* Mark Preferred - Only if not blacklisted */}
        {!allPreferred && !someBlacklisted && (
          <Button
            variant="outline"
            size="sm"
            onClick={onMarkPreferred}
            className="border-warning/20 text-warning hover:bg-warning/10 h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm"
          >
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t('suppliers.actions.markPreferred')}
            </span>
          </Button>
        )}

        {/* Remove Preferred */}
        {somePreferred && !allBlacklisted && (
          <Button
            variant="outline"
            size="sm"
            onClick={onMarkPreferred}
            className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm"
          >
            <StarOff className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t('suppliers.actions.removePreferred')}
            </span>
          </Button>
        )}

        {/* Blacklist */}
        {!allBlacklisted && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBlacklist}
            className="border-status-error/20 hover:bg-status-error/10 h-9 gap-1 whitespace-nowrap text-xs text-status-error sm:gap-2 sm:text-sm"
          >
            <Ban className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t('suppliers.actions.blacklist')}
            </span>
          </Button>
        )}

        {/* Remove Blacklist */}
        {someBlacklisted && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBlacklist}
            className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm"
          >
            <ShieldOff className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t('suppliers.actions.removeBlacklist')}
            </span>
          </Button>
        )}

        {/* Delete - Disabled if any has outstanding balance */}
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          disabled={hasOutstandingBalance}
          className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">
            {t('suppliers.actions.delete')}
          </span>
        </Button>

        {/* More Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              {t('suppliers.actions.exportSelected')}
            </DropdownMenuItem>
            <DropdownMenuItem>
              {t('suppliers.actions.sendEmail')}
            </DropdownMenuItem>
            <DropdownMenuItem>
              {t('suppliers.actions.updateBalance')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-status-error">
              {t('suppliers.actions.bulkDelete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
