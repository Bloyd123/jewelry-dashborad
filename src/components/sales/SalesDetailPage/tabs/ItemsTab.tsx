// ============================================================================
// FILE: src/components/features/Sales/tabs/ItemsTab.tsx
// Sales Items Tab Component with DataTable & Sheet Modal
// ============================================================================

import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Package,
  Coins,
  Eye,
  Info,
  Verified,
  Diamond,
  Weight,
  IndianRupee,
} from 'lucide-react'
import { DataTable } from '@/components/ui/data-display/DataTable/DataTable'
import { StatCard, StatCardGrid } from '@/components/ui/data-display/StatCard'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/overlay/Sheet/Sheet'
import { Label } from '@/components/ui/label'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import type { DataTableColumn } from '@/components/ui/data-display/DataTable/DataTable.types'
import type { SaleItem, OldGoldExchange, OldGoldItem } from '@/types/sale.types'

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface ItemsTabProps {
  items: SaleItem[]
  oldGoldExchange?: OldGoldExchange
}

// ============================================================================
// ITEM DETAIL MODAL/SHEET COMPONENT
// ============================================================================

const ItemDetailView: React.FC<{
  item: SaleItem | null
  isOpen: boolean
  onClose: () => void
}> = ({ item, isOpen, onClose }) => {
  const { t } = useTranslation()
  const isMobile = useMediaQuery('(max-width: 768px)')

  if (!item) return null

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const content = (
    <div className="space-y-6">
      {/* Basic Details */}
      <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-4">
        <h4 className="mb-3 text-sm font-semibold text-text-primary">
          {t('sales.items.basicDetails')}
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-text-tertiary">
              {t('sales.items.category')}
            </Label>
            <p className="text-sm font-medium text-text-primary">
              {item.category || 'N/A'}
            </p>
          </div>
          <div>
            <Label className="text-xs text-text-tertiary">
              {t('sales.items.hsnCode')}
            </Label>
            <p className="text-sm font-medium text-text-primary">
              {item.hsnCode || 'N/A'}
            </p>
          </div>
          <div>
            <Label className="text-xs text-text-tertiary">
              {t('sales.items.metalType')}
            </Label>
            <Badge variant="outline" size="sm" className="mt-1">
              {item.metalType}
            </Badge>
          </div>
          <div>
            <Label className="text-xs text-text-tertiary">
              {t('sales.items.purity')}
            </Label>
            <p className="text-sm font-medium text-text-primary">
              {item.purity || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Weight Details */}
      <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-4">
        <h4 className="mb-3 text-sm font-semibold text-text-primary">
          {t('sales.items.weightDetails')}
        </h4>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label className="text-xs text-text-tertiary">
              {t('sales.items.grossWeight')}
            </Label>
            <p className="text-sm font-medium text-text-primary">
              {item.grossWeight}g
            </p>
          </div>
          <div>
            <Label className="text-xs text-text-tertiary">
              {t('sales.items.stoneWeight')}
            </Label>
            <p className="text-sm font-medium text-text-primary">
              {item.stoneWeight}g
            </p>
          </div>
          <div>
            <Label className="text-xs text-text-tertiary">
              {t('sales.items.netWeight')}
            </Label>
            <p className="text-sm font-semibold text-accent">
              {item.netWeight}g
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Details */}
      <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-4">
        <h4 className="mb-3 text-sm font-semibold text-text-primary">
          {t('sales.items.pricingDetails')}
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-text-tertiary">
              {t('sales.items.metalValue')}
            </Label>
            <p className="text-sm font-medium text-text-primary">
              {formatCurrency(item.metalValue)}
            </p>
          </div>
          {item.stoneValue > 0 && (
            <div className="flex items-center justify-between">
              <Label className="text-xs text-text-tertiary">
                {t('sales.items.stoneValue')}
              </Label>
              <p className="text-sm font-medium text-text-primary">
                {formatCurrency(item.stoneValue)}
              </p>
            </div>
          )}
          <div className="flex items-center justify-between">
            <Label className="text-xs text-text-tertiary">
              {t('sales.items.makingCharges')}
            </Label>
            <p className="text-sm font-medium text-text-primary">
              {formatCurrency(item.makingCharges)}
            </p>
          </div>
          {item.otherCharges > 0 && (
            <div className="flex items-center justify-between">
              <Label className="text-xs text-text-tertiary">
                {t('sales.items.otherCharges')}
              </Label>
              <p className="text-sm font-medium text-text-primary">
                {formatCurrency(item.otherCharges)}
              </p>
            </div>
          )}
          {item.discount.amount > 0 && (
            <div className="flex items-center justify-between">
              <Label className="text-xs text-text-tertiary">
                {t('sales.items.discount')}
              </Label>
              <p className="text-sm font-medium text-status-success">
                -{formatCurrency(item.discount.amount)} ({item.discount.value}
                {item.discount.type === 'percentage' ? '%' : ''})
              </p>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-border-secondary pt-2">
            <Label className="text-xs text-text-tertiary">
              {t('sales.items.gst')} ({item.gstPercentage}%)
            </Label>
            <p className="text-sm font-medium text-text-primary">
              {formatCurrency(item.totalGst)}
            </p>
          </div>
          <div className="flex items-center justify-between border-t border-border-secondary pt-2">
            <Label className="text-sm font-semibold text-text-primary">
              {t('sales.items.itemTotal')}
            </Label>
            <p className="text-lg font-bold text-accent">
              {formatCurrency(item.itemTotal)}
            </p>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      {(item.isHallmarked ||
        item.huid ||
        item.warrantyPeriod ||
        item.notes) && (
        <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-4">
          <h4 className="mb-3 text-sm font-semibold text-text-primary">
            {t('sales.items.additionalInfo')}
          </h4>
          <div className="space-y-2">
            {item.isHallmarked && (
              <div className="flex items-center gap-2">
                <Verified className="h-4 w-4 text-status-success" />
                <span className="text-sm text-text-secondary">
                  {t('sales.items.hallmarked')}
                  {item.huid && ` - ${item.huid}`}
                </span>
              </div>
            )}
            {item.warrantyPeriod && (
              <div className="flex items-center justify-between">
                <Label className="text-xs text-text-tertiary">
                  {t('sales.items.warranty')}
                </Label>
                <p className="text-sm font-medium text-text-primary">
                  {item.warrantyPeriod} {t('sales.items.months')}
                </p>
              </div>
            )}
            {item.notes && (
              <div>
                <Label className="text-xs text-text-tertiary">
                  {t('sales.items.notes')}
                </Label>
                <p className="text-sm text-text-secondary">{item.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )

  // Mobile: Use Sheet (Bottom Sheet)
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent size="lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-accent" />
              {item.productName}
            </SheetTitle>
            <SheetDescription>
              {t('sales.items.itemDetails')} - {item.productCode}
            </SheetDescription>
          </SheetHeader>
          <SheetBody>{content}</SheetBody>
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop: Use Dialog (will be replaced with your Dialog component)
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent size="lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-accent" />
            {item.productName}
          </SheetTitle>
          <SheetDescription>
            {t('sales.items.itemDetails')} - {item.productCode}
          </SheetDescription>
        </SheetHeader>
        <SheetBody>{content}</SheetBody>
      </SheetContent>
    </Sheet>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ItemsTab: React.FC<ItemsTabProps> = ({ items, oldGoldExchange }) => {
  const { t } = useTranslation()
  const [selectedItem, setSelectedItem] = useState<SaleItem | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Calculate summary statistics
  const summary = useMemo(() => {
    const totalItems = items.length
    const totalValue = items.reduce((sum, item) => sum + item.itemTotal, 0)
    const totalWeight = items.reduce((sum, item) => sum + item.netWeight, 0)
    const totalDiscount = items.reduce(
      (sum, item) => sum + item.discount.amount,
      0
    )

    return { totalItems, totalValue, totalWeight, totalDiscount }
  }, [items])

  // Define table columns
  const columns: DataTableColumn<SaleItem>[] = [
    {
      id: 'productName',
      header: t('sales.items.productName'),
      accessorKey: 'productName',
      sortable: true,
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium text-text-primary">
            {row.productName}
          </span>
          <span className="text-xs text-text-tertiary">{row.productCode}</span>
        </div>
      ),
      minWidth: '200px',
    },
    {
      id: 'category',
      header: t('sales.items.category'),
      accessorKey: 'category',
      sortable: true,
      cell: ({ row }) => (
        <Badge variant="outline" size="sm">
          {row.category || 'N/A'}
        </Badge>
      ),
    },
    {
      id: 'metalType',
      header: t('sales.items.metalType'),
      accessorKey: 'metalType',
      sortable: true,
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-text-primary">
            {row.metalType}
          </span>
          <span className="text-xs text-text-tertiary">{row.purity}</span>
        </div>
      ),
    },
    {
      id: 'weight',
      header: t('sales.items.weight'),
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-text-primary">
            {row.netWeight}g
          </span>
          <span className="text-xs text-text-tertiary">
            Gross: {row.grossWeight}g
          </span>
        </div>
      ),
      align: 'right',
    },
    {
      id: 'quantity',
      header: t('sales.items.quantity'),
      accessorKey: 'quantity',
      sortable: true,
      cell: ({ value }) => (
        <span className="text-sm font-medium text-text-primary">{value}</span>
      ),
      align: 'center',
    },
    {
      id: 'ratePerGram',
      header: t('sales.items.rate'),
      accessorKey: 'ratePerGram',
      sortable: true,
      cell: ({ value }) => (
        <span className="text-sm text-text-secondary">
          {formatCurrency(value)}/g
        </span>
      ),
      align: 'right',
    },
    {
      id: 'itemTotal',
      header: t('sales.items.total'),
      accessorKey: 'itemTotal',
      sortable: true,
      cell: ({ value }) => (
        <span className="text-sm font-semibold text-accent">
          {formatCurrency(value)}
        </span>
      ),
      align: 'right',
    },
    {
      id: 'badges',
      header: t('sales.items.status'),
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.isHallmarked && (
            <Badge variant="success" size="sm" dot>
              <Verified className="mr-1 h-3 w-3" />
              BIS
            </Badge>
          )}
          {row.stoneValue > 0 && (
            <Badge variant="info" size="sm" dot>
              <Diamond className="mr-1 h-3 w-3" />
              Stone
            </Badge>
          )}
        </div>
      ),
    },
  ]

  // Row actions
  const rowActions = [
    {
      label: t('sales.items.viewDetails'),
      icon: <Eye className="h-4 w-4" />,
      onClick: (item: SaleItem) => {
        setSelectedItem(item)
        setIsDetailModalOpen(true)
      },
    },
  ]

  // ========================================================================
  // OLD GOLD SECTION
  // ========================================================================

  const OldGoldSection = () => {
    if (!oldGoldExchange?.hasExchange || oldGoldExchange.items.length === 0) {
      return null
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-status-warning" />
          <h3 className="text-lg font-semibold text-text-primary">
            {t('sales.oldGold.title')}
          </h3>
        </div>

        <div className="space-y-3">
          {oldGoldExchange.items.map((item: OldGoldItem, index: number) => (
            <div
              key={index}
              className="rounded-lg border border-border-secondary bg-bg-tertiary p-4"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div>
                  <Label className="text-xs text-text-tertiary">
                    {t('sales.oldGold.metalType')}
                  </Label>
                  <p className="text-sm font-medium text-text-primary">
                    {item.metalType} - {item.purity}
                  </p>
                </div>

                <div>
                  <Label className="text-xs text-text-tertiary">
                    {t('sales.oldGold.weight')}
                  </Label>
                  <p className="text-sm font-medium text-text-primary">
                    {item.netWeight}g
                    <span className="ml-1 text-xs text-text-tertiary">
                      (Gross: {item.grossWeight}g)
                    </span>
                  </p>
                </div>

                <div>
                  <Label className="text-xs text-text-tertiary">
                    {t('sales.oldGold.rate')}
                  </Label>
                  <p className="text-sm font-medium text-text-primary">
                    {formatCurrency(item.ratePerGram)}/g
                  </p>
                </div>

                <div>
                  <Label className="text-xs text-text-tertiary">
                    {t('sales.oldGold.value')}
                  </Label>
                  <p className="text-sm font-semibold text-status-warning">
                    {formatCurrency(item.totalValue)}
                  </p>
                </div>

                {item.description && (
                  <div className="md:col-span-4">
                    <Label className="text-xs text-text-tertiary">
                      {t('sales.oldGold.description')}
                    </Label>
                    <p className="text-sm text-text-secondary">
                      {item.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Old Gold Total */}
          <div className="bg-status-warning/5 flex items-center justify-between rounded-lg border-2 border-status-warning p-4">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-status-warning" />
              <span className="font-semibold text-text-primary">
                {t('sales.oldGold.totalExchangeValue')}
              </span>
            </div>
            <span className="text-xl font-bold text-status-warning">
              -{formatCurrency(oldGoldExchange.totalValue)}
            </span>
          </div>
        </div>
      </div>
    )
  }

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <StatCardGrid columns={4} gap="md">
        <StatCard
          title={t('sales.items.totalItems')}
          value={summary.totalItems}
          icon={Package}
          variant="default"
          size="md"
        />

        <StatCard
          title={t('sales.items.totalValue')}
          value={formatCurrency(summary.totalValue)}
          icon={IndianRupee}
          variant="success"
          size="md"
        />

        <StatCard
          title={t('sales.items.totalWeight')}
          value={`${summary.totalWeight.toFixed(2)}g`}
          icon={Weight}
          variant="info"
          size="md"
        />

        {summary.totalDiscount > 0 && (
          <StatCard
            title={t('sales.items.totalDiscount')}
            value={formatCurrency(summary.totalDiscount)}
            icon={Info}
            variant="warning"
            size="md"
          />
        )}
      </StatCardGrid>

      {/* Items Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">
            {t('sales.items.itemsList')}
          </h3>
        </div>

        <DataTable
          data={items}
          columns={columns}
          rowActions={{
            enabled: true,
            actions: rowActions,
            position: 'end',
          }}
          style={{
            variant: 'bordered',
            size: 'md',
            hoverEffect: true,
            zebraStripes: true,
          }}
          pagination={{
            enabled: items.length > 10,
            pageSize: 10,
            pageSizeOptions: [5, 10, 20],
          }}
          sorting={{
            enabled: true,
          }}
        />
      </div>

      {/* Old Gold Exchange Section */}
      {oldGoldExchange?.hasExchange && <OldGoldSection />}

      {/* Item Detail Modal/Sheet */}
      <ItemDetailView
        item={selectedItem}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedItem(null)
        }}
      />
    </div>
  )
}

export default ItemsTab
