// FILE: src/components/girvi/GirviTable/GirviTableActions.tsx

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, Edit, Unlock, Trash2, Calculator, MoreVertical, Download, ArrowRightLeft, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { RowAction } from '@/components/ui/data-display/DataTable'
import type { Girvi } from '@/types/girvi.types'


export const getGirviRowActions = (
  onView:      (g: Girvi) => void,
  onEdit:      (g: Girvi) => void,
  onRelease:   (g: Girvi) => void,
  onCalculate: (g: Girvi) => void,
  onDelete:    (g: Girvi) => void,
  onTransfer:  (g: Girvi) => void,
  onPayments:  (g: Girvi) => void,
  userRole: string
): RowAction<Girvi>[] => {
  const isAdmin   = ['super_admin', 'org_admin', 'shop_admin'].includes(userRole)
  const isManager = [...['super_admin', 'org_admin', 'shop_admin'], 'manager'].includes(userRole)

  const actions: RowAction<Girvi>[] = [
    {
      label:   'girvi.actions.viewDetails',
      icon:    <Eye className="h-4 w-4" />,
      onClick: onView,
      variant: 'default',
    },
    {
      label:   'girvi.actions.edit',
      icon:    <Edit className="h-4 w-4" />,
      onClick: onEdit,
      variant: 'default',
      // Only editable if active/overdue AND has permission
      hidden: row =>
        (row.status !== 'active' && row.status !== 'overdue') ||
        !isManager,
    },
    {
      label:   'girvi.actions.calculateInterest',
      icon:    <Calculator className="h-4 w-4" />,
      onClick: onCalculate,
      variant: 'default',
      hidden: row => row.status !== 'active' && row.status !== 'overdue',
    },
    {
  label:   'girvi.actions.payments',
  icon:    <Receipt className="h-4 w-4" />,
  onClick: onPayments,
  variant: 'default',
  hidden: row => row.status === 'active' || row.status === 'overdue' ? false : false,
},
    {
      label:   'girvi.actions.release',
      icon:    <Unlock className="h-4 w-4" />,
      onClick: onRelease,
      variant: 'default',
      hidden: row =>
        (row.status !== 'active' && row.status !== 'overdue') ||
        !isManager,
    },
    {
  label:   'girvi.actions.transfer',
  icon:    <ArrowRightLeft className="h-4 w-4" />,
  onClick: onTransfer,
  variant: 'default',
  hidden: row =>
    (row.status !== 'active' && row.status !== 'overdue') ||
    row.isTransferred ||
    !isManager,
},
  ]

  if (isAdmin) {
    actions.push({
      label:   'girvi.actions.delete',
      icon:    <Trash2 className="h-4 w-4" />,
      onClick: onDelete,
      variant: 'destructive',
      hidden: row => row.status === 'active' || row.status === 'overdue',
    })
  }

  return actions
}


interface BulkActionsBarProps {
  selectedCount:    number
  selectedGirvis:   Girvi[]
  onViewDetails:    () => void
  onBulkExport:     () => void
  onClearSelection: () => void
  userRole: string
}

export const GirviBulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  selectedGirvis,
  onViewDetails,
  onBulkExport,
  onClearSelection,
  userRole,
}) => {
  const { t } = useTranslation()

  return (
    <div className="bg-accent/10 flex flex-col items-start justify-between gap-3 border-b border-border-primary px-4 py-3 sm:flex-row sm:items-center">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-text-primary">
          {t('table.selectedCount', { count: selectedCount })}
        </span>
        <Button variant="ghost" size="sm" onClick={onClearSelection} className="h-8 text-xs text-text-secondary hover:text-text-primary">
          {t('common.clearSelection')}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {selectedCount === 1 && (
          <Button variant="outline" size="sm" onClick={onViewDetails} className="h-9 gap-2">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">{t('girvi.actions.viewDetails')}</span>
          </Button>
        )}

        <Button variant="outline" size="sm" onClick={onBulkExport} className="h-9 gap-2">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">{t('girvi.actions.export')}</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onBulkExport}>
              <Download className="mr-2 h-4 w-4" />
              {t('girvi.actions.exportSelected')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}