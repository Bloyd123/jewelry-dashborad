// ============================================================================
// FILE: src/components/products/ProductTable/ProductTableActions.tsx
// Product Table Row Actions & Bulk Actions
// ============================================================================

import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Eye,
  Edit,
  Trash2,
  Copy,
  Calculator,
  Package,
  Tag,
  MoreVertical,
  Download,
  Printer,
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
import type { Product } from './ProductTable.types'

// ============================================================================
// ROW ACTIONS (Individual Product Actions)
// ============================================================================

export const getProductRowActions = (
  onViewDetails: (product: Product) => void,
  onEdit: (product: Product) => void,
  onDuplicate: (product: Product) => void,
  onUpdateStock: (product: Product) => void,
  onCalculatePrice: (product: Product) => void,
  onPrintLabel: (product: Product) => void,
  onDelete: (product: Product) => void
): RowAction<Product>[] => [
  {
    label: 'product.actions.viewDetails',
    icon: <Eye className="h-4 w-4" />,
    onClick: onViewDetails,
    variant: 'default',
  },
  {
    label: 'product.actions.edit',
    icon: <Edit className="h-4 w-4" />,
    onClick: onEdit,
    variant: 'default',
  },
  {
    label: 'product.actions.duplicate',
    icon: <Copy className="h-4 w-4" />,
    onClick: onDuplicate,
    variant: 'default',
  },
  {
    label: 'product.actions.updateStock',
    icon: <Package className="h-4 w-4" />,
    onClick: onUpdateStock,
    variant: 'default',
    hidden: row => row.status === 'sold',
  },
  {
    label: 'product.actions.calculatePrice',
    icon: <Calculator className="h-4 w-4" />,
    onClick: onCalculatePrice,
    variant: 'default',
  },
  {
    label: 'product.actions.printLabel',
    icon: <Tag className="h-4 w-4" />,
    onClick: onPrintLabel,
    variant: 'default',
  },
  {
    label: 'product.actions.delete',
    icon: <Trash2 className="h-4 w-4" />,
    onClick: onDelete,
    variant: 'destructive',
    disabled: row => row.saleStatus === 'sold' || row.saleStatus === 'reserved',
  },
]

// ============================================================================
// BULK ACTIONS BAR (Shows when rows are selected)
// ============================================================================

interface BulkActionsBarProps {
  selectedCount: number
  selectedProducts: Product[]
  onViewDetails: () => void
  onEdit: () => void
  onBulkUpdateStatus: () => void
  onBulkPrint: () => void
  onBulkExport: () => void
  onBulkDelete: () => void
  onClearSelection: () => void
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  selectedProducts,
  onViewDetails,
  onEdit,
  onBulkUpdateStatus,
  onBulkPrint,
  onBulkExport,
  onBulkDelete,
  onClearSelection,
}) => {
  const { t } = useTranslation()

  // Check if any selected product is sold or reserved
  const hasSoldOrReserved = selectedProducts.some(
    p => p.saleStatus === 'sold' || p.saleStatus === 'reserved'
  )

  // Check if any selected product is inactive
  const hasInactive = selectedProducts.some(p => !p.isActive)

  return (
    <div className="bg-accent/10 flex flex-col items-start justify-between gap-3 border-b border-border-primary px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
      {/* Left Section - Selection Info */}
      <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-4">
        <span className="text-sm font-medium text-text-primary">
          {t('product.table.selectedCount', { count: selectedCount })}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="h-8 text-xs text-text-secondary hover:text-text-primary sm:text-sm"
        >
          {t('product.common.clearSelection')}
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
            <span className="hidden sm:inline">{t('product.actions.viewDetails')}</span>
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
            <span className="hidden sm:inline">{t('product.actions.edit')}</span>
          </Button>
        )}

        {/* Update Status */}
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkUpdateStatus}
          className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm"
        >
          <Package className="h-4 w-4" />
          <span className="hidden sm:inline">{t('product.actions.updateStatus')}</span>
        </Button>

        {/* Print Labels */}
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkPrint}
          className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm"
        >
          <Printer className="h-4 w-4" />
          <span className="hidden sm:inline">{t('product.actions.printLabels')}</span>
        </Button>

        {/* Export */}
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkExport}
          className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">{t('product.actions.export')}</span>
        </Button>

        {/* Delete - Disabled if any sold/reserved */}
        <Button
          variant="destructive"
          size="sm"
          onClick={onBulkDelete}
          disabled={hasSoldOrReserved}
          className="h-9 gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">{t('product.actions.delete')}</span>
        </Button>

        {/* More Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>{t('product.actions.bulkEdit')}</DropdownMenuItem>
            <DropdownMenuItem>{t('product.actions.changeCategory')}</DropdownMenuItem>
            <DropdownMenuItem>
              {t('product.actions.recalculatePrices')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t('product.actions.exportPDF')}</DropdownMenuItem>
            <DropdownMenuItem>{t('product.actions.exportExcel')}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-status-error">
              {t('product.actions.bulkDelete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
