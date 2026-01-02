
// FILE: src/components/purchase/PurchaseTable/PurchaseTableActions.tsx
// Purchase Table Row Actions & Bulk Actions


import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Package,
  CreditCard,
  FileText,
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
import type { IPurchase } from '@/types/purchase.types'


// ROW ACTIONS (Individual Purchase Actions)


export const getPurchaseRowActions = (
  onViewDetails: (purchase: IPurchase) => void,
  onEdit: (purchase: IPurchase) => void,
  onReceive: (purchase: IPurchase) => void,
  onAddPayment: (purchase: IPurchase) => void,
  onApprove: (purchase: IPurchase) => void,
  onReject: (purchase: IPurchase) => void,
  onCancel: (purchase: IPurchase) => void,
  onDelete: (purchase: IPurchase) => void
): RowAction<IPurchase>[] => [
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
    hidden: row => !['draft', 'pending'].includes(row.status),
  },
  {
    label: 'actions.receive',
    icon: <Package className="h-4 w-4" />,
    onClick: onReceive,
    variant: 'default',
    hidden: row => ['completed', 'cancelled', 'returned'].includes(row.status),
  },
  {
    label: 'actions.addPayment',
    icon: <CreditCard className="h-4 w-4" />,
    onClick: onAddPayment,
    variant: 'default',
    hidden: row =>
      row.payment.paymentStatus === 'paid' || row.status === 'cancelled',
  },
  {
    label: 'actions.approve',
    icon: <CheckCircle className="h-4 w-4" />,
    onClick: onApprove,
    variant: 'default',
    hidden: row => row.approvalStatus !== 'pending',
  },
  {
    label: 'actions.reject',
    icon: <XCircle className="h-4 w-4" />,
    onClick: onReject,
    variant: 'destructive',
    hidden: row => row.approvalStatus !== 'pending',
  },
  {
    label: 'actions.cancel',
    icon: <XCircle className="h-4 w-4" />,
    onClick: onCancel,
    variant: 'destructive',
    hidden: row => ['completed', 'cancelled', 'returned'].includes(row.status),
  },
  {
    label: 'actions.delete',
    icon: <Trash2 className="h-4 w-4" />,
    onClick: onDelete,
    variant: 'destructive',
    hidden: row => row.status !== 'draft',
  },
]


// BULK ACTIONS BAR


interface BulkActionsBarProps {
  selectedCount: number
  selectedPurchases: IPurchase[]
  onViewDetails: () => void
  onEdit: () => void
  onBulkApprove: () => void
  onBulkExport: () => void
  onBulkPrint: () => void
  onBulkDelete: () => void
  onClearSelection: () => void
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  selectedPurchases,
  onViewDetails,
  onEdit,
  onBulkApprove,
  onBulkExport,
  onBulkPrint,
  onBulkDelete,
  onClearSelection,
}) => {
  const { t } = useTranslation()

  // Check conditions
  const allPendingApproval = selectedPurchases.every(
    p => p.approvalStatus === 'pending'
  )
  const allDraft = selectedPurchases.every(p => p.status === 'draft')
  const hasCancelled = selectedPurchases.some(p => p.status === 'cancelled')

  return (
    <div className="bg-accent/10 flex flex-col items-start justify-between gap-3 border-b border-border-primary px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
      {/* Left Section */}
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

      {/* Right Section - Actions */}
      <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
        {/* View Details - Single selection */}
        {selectedCount === 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
            className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">{t('actions.viewDetails')}</span>
          </Button>
        )}

        {/* Edit - Single selection, draft/pending only */}
        {selectedCount === 1 &&
          selectedPurchases[0] &&
          ['draft', 'pending'].includes(selectedPurchases[0].status) && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm"
            >
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">{t('actions.edit')}</span>
            </Button>
          )}

        {/* Bulk Approve - Only pending approvals */}
        {allPendingApproval && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkApprove}
            className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm"
          >
            <CheckCircle className="h-4 w-4" />
            <span className="hidden sm:inline">{t('actions.bulkApprove')}</span>
          </Button>
        )}

        {/* Export */}
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkExport}
          className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">{t('actions.export')}</span>
        </Button>

        {/* Print */}
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkPrint}
          className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm"
        >
          <Printer className="h-4 w-4" />
          <span className="hidden sm:inline">{t('actions.print')}</span>
        </Button>

        {/* Delete - Only drafts */}
        {allDraft && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onBulkDelete}
            className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">{t('actions.delete')}</span>
          </Button>
        )}

        {/* More Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>{t('actions.exportPDF')}</DropdownMenuItem>
            <DropdownMenuItem>{t('actions.exportExcel')}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t('actions.sendEmail')}</DropdownMenuItem>
            <DropdownMenuItem>{t('actions.generateReport')}</DropdownMenuItem>
            {allDraft && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-status-error">
                  {t('actions.bulkDelete')}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
