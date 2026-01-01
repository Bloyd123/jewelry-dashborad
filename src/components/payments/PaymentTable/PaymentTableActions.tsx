// ============================================================================
// FILE: src/components/features/PaymentTable/PaymentTableActions.tsx
// Payment Table Row Actions & Bulk Actions with Role-Based Permissions
// ============================================================================

import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Eye,
  Edit,
  FileText,
  Send,
  CheckCircle2,
  XCircle,
  Ban,
  RotateCcw,
  Trash2,
  Download,
  Printer,
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
import type { Payment } from '@/types/payment.types'

// ============================================================================
// ROW ACTIONS (Individual Payment Actions)
// ============================================================================

export const getPaymentRowActions = (
  onViewDetails: (payment: Payment) => void,
  onEdit: (payment: Payment) => void,
  onViewReceipt: (payment: Payment) => void,
  onSendReceipt: (payment: Payment) => void,
  onMarkCompleted: (payment: Payment) => void,
  onReconcile: (payment: Payment) => void,
  onProcessRefund: (payment: Payment) => void,
  onCancel: (payment: Payment) => void,
  onDelete: (payment: Payment) => void,
  userRole: string
): RowAction<Payment>[] => {
  const actions: RowAction<Payment>[] = [
    {
      label: 'payment.actions.viewDetails',
      icon: <Eye className="h-4 w-4" />,
      onClick: onViewDetails,
      variant: 'default',
    },
    {
      label: 'payment.actions.edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: onEdit,
      variant: 'default',
      hidden: row => 
        row.status !== 'pending' || userRole === 'staff',
    },
    {
      label: 'payment.actions.viewReceipt',
      icon: <FileText className="h-4 w-4" />,
      onClick: onViewReceipt,
      variant: 'default',
      hidden: row => !row.receipt.receiptGenerated,
    },
    {
      label: 'payment.actions.sendReceipt',
      icon: <Send className="h-4 w-4" />,
      onClick: onSendReceipt,
      variant: 'default',
      hidden: row => 
        !row.receipt.receiptGenerated || 
        !['super_admin', 'org_admin', 'shop_admin', 'manager'].includes(userRole),
    },
    {
      label: 'payment.actions.markCompleted',
      icon: <CheckCircle2 className="h-4 w-4" />,
      onClick: onMarkCompleted,
      variant: 'default',
      hidden: row => 
        row.status !== 'pending' || 
        !['super_admin', 'org_admin', 'shop_admin', 'manager'].includes(userRole),
    },
    {
      label: 'payment.actions.reconcile',
      icon: <CheckCircle2 className="h-4 w-4" />,
      onClick: onReconcile,
      variant: 'default',
      hidden: row =>
        row.status !== 'completed' || 
        row.reconciliation.isReconciled ||
        !['super_admin', 'org_admin', 'shop_admin'].includes(userRole),
    },
    {
      label: 'payment.actions.processRefund',
      icon: <RotateCcw className="h-4 w-4" />,
      onClick: onProcessRefund,
      variant: 'default',
      hidden: row =>
        row.status !== 'completed' ||
        row.refund.isRefund ||
        row.transactionType !== 'receipt' ||
        !['super_admin', 'org_admin', 'shop_admin'].includes(userRole),
    },
    {
      label: 'payment.actions.cancel',
      icon: <XCircle className="h-4 w-4" />,
      onClick: onCancel,
      variant: 'destructive',
      hidden: row => 
        (row.status === 'cancelled' || row.status === 'completed') ||
        !['super_admin', 'org_admin', 'shop_admin'].includes(userRole),
    },
  ]

  // Only super_admin and org_admin can delete
  if (['super_admin', 'org_admin'].includes(userRole)) {
    actions.push({
      label: 'payment.actions.delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: onDelete,
      variant: 'destructive',
      hidden: row => row.status !== 'pending',
    })
  }

  return actions
}

// ============================================================================
// BULK ACTIONS BAR (Shows when rows are selected)
// ============================================================================

interface BulkActionsBarProps {
  selectedCount: number
  selectedPayments: Payment[]
  onViewDetails: () => void
  onEdit: () => void
  onViewReceipts: () => void
  onSendReceipts: () => void
  onMarkCompleted: () => void
  onBulkReconcile: () => void
  onBulkExport: () => void
  onBulkPrint: () => void
  onCancel: () => void
  onDelete: () => void
  onClearSelection: () => void
  userRole: string
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  selectedPayments,
  onViewDetails,
  onEdit,
  onViewReceipts,
  onSendReceipts,
  onMarkCompleted,
  onBulkReconcile,
  onBulkExport,
  onBulkPrint,
  onCancel,
  onDelete,
  onClearSelection,
  userRole,
}) => {
  const { t } = useTranslation()

  // Calculate what actions are available
  const canEdit = 
    selectedCount === 1 && 
    selectedPayments.every(p => p.status === 'pending') &&
    userRole !== 'staff'
  
  const hasReceipts = selectedPayments.some(p => p.receipt.receiptGenerated)
  
  const canMarkCompleted = 
    selectedPayments.every(p => p.status === 'pending') &&
    ['super_admin', 'org_admin', 'shop_admin', 'manager'].includes(userRole)
  
  const canReconcile = 
    selectedPayments.some(p => p.status === 'completed' && !p.reconciliation.isReconciled) &&
    ['super_admin', 'org_admin', 'shop_admin'].includes(userRole)
  
  const canCancel = 
    selectedPayments.some(p => p.status !== 'cancelled' && p.status !== 'completed') &&
    ['super_admin', 'org_admin', 'shop_admin'].includes(userRole)
  
  const canDelete = 
    selectedPayments.some(p => p.status === 'pending') &&
    ['super_admin', 'org_admin'].includes(userRole)

  const canManage = ['super_admin', 'org_admin', 'shop_admin', 'manager'].includes(userRole)

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
              {t('payment.actions.viewDetails')}
            </span>
          </Button>
        )}

        {/* Edit - Only if single selection and has permission */}
        {canEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm"
          >
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t('payment.actions.edit')}
            </span>
          </Button>
        )}

        {/* View Receipts */}
        {hasReceipts && (
          <Button
            variant="outline"
            size="sm"
            onClick={onViewReceipts}
            className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t('payment.actions.viewReceipts')}
            </span>
          </Button>
        )}

        {/* Send Receipts */}
        {hasReceipts && canManage && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSendReceipts}
            className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t('payment.actions.sendReceipts')}
            </span>
          </Button>
        )}

        {/* Mark Completed */}
        {canMarkCompleted && (
          <Button
            variant="outline"
            size="sm"
            onClick={onMarkCompleted}
            className="border-status-success/20 hover:bg-status-success/10 h-9 gap-1 whitespace-nowrap text-xs text-status-success sm:gap-2 sm:text-sm"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t('payment.actions.markCompleted')}
            </span>
          </Button>
        )}

        {/* Bulk Reconcile */}
        {canReconcile && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkReconcile}
            className="border-status-info/20 hover:bg-status-info/10 h-9 gap-1 whitespace-nowrap text-xs text-status-info sm:gap-2 sm:text-sm"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t('payment.actions.reconcile')}
            </span>
          </Button>
        )}

        {/* Bulk Export */}
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkExport}
          className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">
            {t('payment.actions.export')}
          </span>
        </Button>

        {/* Bulk Print */}
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkPrint}
          className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm"
        >
          <Printer className="h-4 w-4" />
          <span className="hidden sm:inline">
            {t('payment.actions.print')}
          </span>
        </Button>

        {/* Cancel */}
        {canCancel && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="border-status-warning/20 hover:bg-status-warning/10 h-9 gap-1 whitespace-nowrap text-xs text-status-warning sm:gap-2 sm:text-sm"
          >
            <Ban className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t('payment.actions.cancel')}
            </span>
          </Button>
        )}

        {/* Delete */}
        {canDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t('payment.actions.delete')}
            </span>
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
            <DropdownMenuItem onClick={onBulkExport}>
              <Download className="mr-2 h-4 w-4" />
              {t('payment.actions.exportSelected')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onBulkPrint}>
              <Printer className="mr-2 h-4 w-4" />
              {t('payment.actions.printSelected')}
            </DropdownMenuItem>
            {hasReceipts && canManage && (
              <DropdownMenuItem onClick={onSendReceipts}>
                <Send className="mr-2 h-4 w-4" />
                {t('payment.actions.sendReceiptsEmail')}
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {canReconcile && (
              <DropdownMenuItem onClick={onBulkReconcile}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {t('payment.actions.bulkReconcile')}
              </DropdownMenuItem>
            )}
            {canCancel && (
              <DropdownMenuItem 
                onClick={onCancel}
                className="text-status-warning"
              >
                <Ban className="mr-2 h-4 w-4" />
                {t('payment.actions.bulkCancel')}
              </DropdownMenuItem>
            )}
            {canDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={onDelete}
                  className="text-status-error"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('payment.actions.bulkDelete')}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}