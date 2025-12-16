// ============================================================================
// FILE: src/components/features/ShopTable/ShopTableActions.tsx
// Shop Table Row Actions & Bulk Actions
// ============================================================================

import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Eye,
  Edit,
  Trash2,
  Settings,
  TrendingUp,
  BarChart3,
  Power,
  PowerOff,
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
import type { Shop } from '@/types/shop.types'

// ============================================================================
// ROW ACTIONS (Individual Shop Actions)
// ============================================================================

export const getShopRowActions = (
  onViewDetails: (shop: Shop) => void,
  onEdit: (shop: Shop) => void,
  onSettings: (shop: Shop) => void,
  onUpdateRates: (shop: Shop) => void,
  onStatistics: (shop: Shop) => void,
  onToggleStatus: (shop: Shop) => void,
  onDelete: (shop: Shop) => void,
  userRole: string
): RowAction<Shop>[] => {
  const actions: RowAction<Shop>[] = [
    {
      label: 'actions.viewDetails',
      icon: <Eye className="h-4 w-4" />,
      onClick: onViewDetails,
      variant: 'default',
    },
    {
      label: 'actions.edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: onEdit,
      variant: 'default',
      hidden: (row) => userRole === 'staff',
    },
    {
      label: 'actions.settings',
      icon: <Settings className="h-4 w-4" />,
      onClick: onSettings,
      variant: 'default',
      hidden: (row) => !['super_admin', 'org_admin', 'shop_admin'].includes(userRole),
    },
    {
      label: 'actions.updateRates',
      icon: <TrendingUp className="h-4 w-4" />,
      onClick: onUpdateRates,
      variant: 'default',
      hidden: (row) => !['super_admin', 'org_admin', 'shop_admin', 'manager'].includes(userRole),
    },
    {
      label: 'actions.statistics',
      icon: <BarChart3 className="h-4 w-4" />,
      onClick: onStatistics,
      variant: 'default',
    },
    {
      label: 'actions.activate',
      icon: <Power className="h-4 w-4" />,
      onClick: onToggleStatus,
      variant: 'default',
      hidden: (row) => row.isActive || !['super_admin', 'org_admin'].includes(userRole),
    },
    {
      label: 'actions.deactivate',
      icon: <PowerOff className="h-4 w-4" />,
      onClick: onToggleStatus,
      variant: 'destructive',
      hidden: (row) => !row.isActive || !['super_admin', 'org_admin'].includes(userRole),
    },
  ]

  // Only super_admin and org_admin can delete
  if (['super_admin', 'org_admin'].includes(userRole)) {
    actions.push({
      label: 'actions.delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: onDelete,
      variant: 'destructive',
    })
  }

  return actions
}

// ============================================================================
// BULK ACTIONS BAR (Shows when rows are selected)
// ============================================================================

interface BulkActionsBarProps {
  selectedCount: number
  selectedShops: Shop[]
  onViewDetails: () => void
  onEdit: () => void
  onSettings: () => void
  onUpdateRates: () => void
  onActivate: () => void
  onDeactivate: () => void
  onDelete: () => void
  onClearSelection: () => void
  userRole: string
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  selectedShops,
  onViewDetails,
  onEdit,
  onSettings,
  onUpdateRates,
  onActivate,
  onDeactivate,
  onDelete,
  onClearSelection,
  userRole,
}) => {
  const { t } = useTranslation()

  const allActive = selectedShops.every((s) => s.isActive)
  const allInactive = selectedShops.every((s) => !s.isActive)
  const canManage = ['super_admin', 'org_admin', 'shop_admin'].includes(userRole)
  const canDelete = ['super_admin', 'org_admin'].includes(userRole)

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 px-4 py-3 bg-accent/10 border-b border-border-primary">
      {/* Left Section - Selection Info */}
      <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <span className="text-sm font-medium text-text-primary">
          {t('table.selectedCount', { count: selectedCount })}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="h-8 text-text-secondary hover:text-text-primary text-xs sm:text-sm"
        >
          {t('common.clearSelection')}
        </Button>
      </div>

      {/* Right Section - Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        {/* View Details - Only if single selection */}
        {selectedCount === 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
            className="h-9 gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">{t('actions.viewDetails')}</span>
          </Button>
        )}

        {/* Edit - Only if single selection and has permission */}
        {selectedCount === 1 && canManage && (
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="h-9 gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap"
          >
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">{t('actions.edit')}</span>
          </Button>
        )}

        {/* Settings - Only if has permission */}
        {canManage && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSettings}
            className="h-9 gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">{t('actions.settings')}</span>
          </Button>
        )}

        {/* Update Rates */}
        {canManage && (
          <Button
            variant="outline"
            size="sm"
            onClick={onUpdateRates}
            className="h-9 gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap"
          >
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">{t('actions.updateRates')}</span>
          </Button>
        )}

        {/* Activate - Only if all inactive */}
        {allInactive && canDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={onActivate}
            className="h-9 gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap text-status-success border-status-success/20 hover:bg-status-success/10"
          >
            <Power className="h-4 w-4" />
            <span className="hidden sm:inline">{t('actions.activate')}</span>
          </Button>
        )}

        {/* Deactivate - Only if all active */}
        {allActive && canDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDeactivate}
            className="h-9 gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap text-status-warning border-status-warning/20 hover:bg-status-warning/10"
          >
            <PowerOff className="h-4 w-4" />
            <span className="hidden sm:inline">{t('actions.deactivate')}</span>
          </Button>
        )}

        {/* Delete - Only if has permission */}
        {canDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            className="h-9 gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">{t('actions.delete')}</span>
          </Button>
        )}

        {/* More Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              {t('actions.exportSelected')}
            </DropdownMenuItem>
            <DropdownMenuItem>
              {t('actions.sendNotification')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-status-error">
              {t('actions.bulkDelete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}