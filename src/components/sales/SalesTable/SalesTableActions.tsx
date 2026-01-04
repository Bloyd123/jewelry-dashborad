//
// FILE: src/components/features/SalesTable/SalesTableActions.tsx
// Sales Table Row Actions & Bulk Actions
//

import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  CreditCard,
  Truck,
  RefreshCw,
  FileText,
  Printer,
  Download,
  Send,
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
import type { Sale } from '@/types/sale.types'

//
// ROW ACTIONS
//

export const getSalesRowActions = (
  onViewDetails: (sale: Sale) => void,
  onEdit: (sale: Sale) => void,
  onAddPayment: (sale: Sale) => void,
  onDeliver: (sale: Sale) => void,
  onComplete: (sale: Sale) => void,
  onReturn: (sale: Sale) => void,
  onCancel: (sale: Sale) => void,
  onPrint: (sale: Sale) => void,
  onDelete: (sale: Sale) => void
): RowAction<Sale>[] => [
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
    label: 'actions.addPayment',
    icon: <CreditCard className="h-4 w-4" />,
    onClick: onAddPayment,
    variant: 'default',
    hidden: row =>
      row.payment.paymentStatus === 'paid' || row.status === 'cancelled',
  },
  {
    label: 'actions.deliver',
    icon: <Truck className="h-4 w-4" />,
    onClick: onDeliver,
    variant: 'default',
    hidden: row =>
      ['delivered', 'completed', 'cancelled', 'returned'].includes(row.status),
  },
  {
    label: 'actions.complete',
    icon: <CheckCircle className="h-4 w-4" />,
    onClick: onComplete,
    variant: 'default',
    hidden: row => row.status !== 'delivered',
  },
  {
    label: 'actions.return',
    icon: <RefreshCw className="h-4 w-4" />,
    onClick: onReturn,
    variant: 'default',
    hidden: row =>
      !['completed', 'delivered'].includes(row.status) ||
      row.return?.isReturned,
  },
  {
    label: 'actions.printInvoice',
    icon: <Printer className="h-4 w-4" />,
    onClick: onPrint,
    variant: 'default',
    hidden: row => row.status === 'draft',
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

//
// BULK ACTIONS BAR
//

interface BulkActionsBarProps {
  selectedCount: number
  selectedSales: Sale[]
  onViewDetails: () => void
  onEdit: () => void
  onBulkPrint: () => void
  onBulkExport: () => void
  onBulkSendInvoice: () => void
  onBulkReminders: () => void
  onBulkDelete: () => void
  onClearSelection: () => void
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  selectedSales,
  onViewDetails,
  onEdit,
  onBulkPrint,
  onBulkExport,
  onBulkSendInvoice,
  onBulkReminders,
  onBulkDelete,
  onClearSelection,
}) => {
  const { t } = useTranslation()

  const allDraft = selectedSales.every(s => s.status === 'draft')
  const hasUnpaid = selectedSales.some(
    s =>
      s.payment.paymentStatus === 'unpaid' ||
      s.payment.paymentStatus === 'partial'
  )

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
        {/* View Details - Single */}
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

        {/* Edit - Single, Draft/Pending */}
        {selectedCount === 1 &&
          selectedSales[0] &&
          ['draft', 'pending'].includes(selectedSales[0].status) && (
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

        {/* Send Invoice */}
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkSendInvoice}
          className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm"
        >
          <Send className="h-4 w-4" />
          <span className="hidden sm:inline">{t('actions.sendInvoice')}</span>
        </Button>

        {/* Reminders - Unpaid */}
        {hasUnpaid && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkReminders}
            className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t('actions.sendReminder')}
            </span>
          </Button>
        )}

        {/* Delete - Draft only */}
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
            <DropdownMenuItem>{t('actions.sendSMS')}</DropdownMenuItem>
            <DropdownMenuItem>{t('actions.sendWhatsApp')}</DropdownMenuItem>
            <DropdownMenuSeparator />
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
