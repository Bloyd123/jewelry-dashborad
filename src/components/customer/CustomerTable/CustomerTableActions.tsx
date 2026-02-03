// FILE: src/components/features/CustomerTable/CustomerTableActions.tsx
// Customer Table Row Actions & Bulk Actions

import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Eye,
  Edit,
  Trash2,
  Award,
  Ban,
  ShieldOff,
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
import type { Customer } from '@/types/customer.types'

// ROW ACTIONS (Individual Customer Actions)

export const getCustomerRowActions = (
  onViewDetails: (customer: Customer) => void,
  onEdit: (customer: Customer) => void,
  onAddPoints: (customer: Customer) => void,
  onBlacklist: (customer: Customer) => void,
  onDelete: (customer: Customer) => void
): RowAction<Customer>[] => [
  {
    label: 'customer.actions.viewDetails',
    icon: <Eye className="h-4 w-4" />,
    onClick: onViewDetails,
    variant: 'default',
  },
  {
    label: 'customer.actions.edit',
    icon: <Edit className="h-4 w-4" />,
    onClick: onEdit,
    variant: 'default',
  },
  {
    label: 'customer.actions.addPoints',
    icon: <Award className="h-4 w-4" />,
    onClick: onAddPoints,
    variant: 'default',
    hidden: row => !row.isActive,
  },
  {
    label: 'customer.actions.blacklist',
    icon: <Ban className="h-4 w-4" />,
    onClick: onBlacklist,
    variant: 'destructive',
    hidden: row => row.isBlacklisted,
  },
  {
    label: 'customer.actions.removeBlacklist',
    icon: <ShieldOff className="h-4 w-4" />,
    onClick: onBlacklist,
    variant: 'default',
    hidden: row => !row.isBlacklisted,
  },
  {
    label: 'customer.actions.delete',
    icon: <Trash2 className="h-4 w-4" />,
    onClick: onDelete,
    variant: 'destructive',
    disabled: row => row.totalDue > 0,
  },
]

// BULK ACTIONS BAR (Shows when rows are selected)

interface BulkActionsBarProps {
  selectedCount: number
  selectedCustomers: Customer[]
  onViewDetails: () => void
  onEdit: () => void
  onAddPoints: () => void
  onBlacklist: () => void
  onDelete: () => void
  onClearSelection: () => void
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  selectedCustomers,
  onViewDetails,
  onEdit,
  onAddPoints,
  onBlacklist,
  onDelete,
  onClearSelection,
}) => {
  const { t } = useTranslation()

  // Check if any selected customer has outstanding balance
  const hasOutstandingBalance = selectedCustomers.some(c => c.totalDue > 0)

  // Check if any selected customer is inactive
  const hasInactive = selectedCustomers.some(c => !c.isActive)

  // Check if all selected are blacklisted or not
  const allBlacklisted = selectedCustomers.every(c => c.isBlacklisted)
  const someBlacklisted = selectedCustomers.some(c => c.isBlacklisted)

  return (
    <div className="bg-accent/10 flex flex-col items-start justify-between gap-3 border-b border-border-primary px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
      {/* Left Section - Selection Info */}
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
              {t('customer.actions.viewDetails')}
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
              {t('customer.actions.edit')}
            </span>
          </Button>
        )}

        {/* Add Loyalty Points - Only for active customers */}
        {!hasInactive && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAddPoints}
            className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm"
          >
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t('customer.actions.addPoints')}
            </span>
          </Button>
        )}

        {/* Blacklist/Remove Blacklist */}
        {!allBlacklisted && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBlacklist}
            className="border-status-error/20 hover:bg-status-error/10 h-9 gap-2 text-status-error"
          >
            <Ban className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t('customer.actions.blacklist')}
            </span>
          </Button>
        )}

        {someBlacklisted && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBlacklist}
            className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm"
          >
            <ShieldOff className="h-4 w-4" />
            <span className="hidden sm:inline"></span>
            {t('customer.actions.removeBlacklist')}
            <span />
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
            {t('customer.actions.delete')}
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
              {t('customer.actions.exportSelected')}
            </DropdownMenuItem>
            <DropdownMenuItem>
              {t('customer.actions.sendEmail')}
            </DropdownMenuItem>
            <DropdownMenuItem>{t('customer.actions.sendSMS')}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-status-error">
              {t('customer.actions.bulkDelete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
