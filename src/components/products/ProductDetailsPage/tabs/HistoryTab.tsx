// FILE: src/components/products/ProductDetailsPage/tabs/HistoryTab.tsx
// Product History Tab - Accordion-based Layout

import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  History,
  Package,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ShoppingCart,
  AlertCircle,
  Calendar,
  Activity,
  BarChart3,
} from 'lucide-react'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Avatar } from '@/components/ui/data-display/Avatar/Avatar'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/layout/Accordion/Accordion'
import type { Product, InventoryTransaction } from '@/types/product.types'
import { format } from 'date-fns'

// COMPONENT PROPS

interface HistoryTabProps {
  product: Product
  transactions?: InventoryTransaction[]
  loading?: boolean
  onLoadMore?: () => void
  hasMore?: boolean
}

// MOCK TRANSACTION DATA

const mockTransactions: InventoryTransaction[] = [
  {
    _id: '1',
    organizationId: 'org123',
    shopId: 'shop123',
    productId: 'prod123',
    productCode: 'PRD000001',
    transactionType: 'RESERVED',
    quantity: 1,
    previousQuantity: 3,
    newQuantity: 2,
    transactionDate: '2024-01-24T10:30:00Z',
    referenceType: 'reservation',
    performedBy: 'user123',
    reason: 'Reserved for customer - Ramesh Singh',
    createdAt: '2024-01-24T10:30:00Z',
    updatedAt: '2024-01-24T10:30:00Z',
  },
  {
    _id: '2',
    organizationId: 'org123',
    shopId: 'shop123',
    productId: 'prod123',
    productCode: 'PRD000001',
    transactionType: 'ADJUSTMENT',
    quantity: 0,
    previousQuantity: 3,
    newQuantity: 3,
    transactionDate: '2024-01-20T15:45:00Z',
    referenceType: 'manual_adjustment',
    performedBy: 'user456',
    reason: 'Price recalculated due to metal rate change',
    value: 148000,
    createdAt: '2024-01-20T15:45:00Z',
    updatedAt: '2024-01-20T15:45:00Z',
  },
  {
    _id: '3',
    organizationId: 'org123',
    shopId: 'shop123',
    productId: 'prod123',
    productCode: 'PRD000001',
    transactionType: 'OUT',
    quantity: 2,
    previousQuantity: 5,
    newQuantity: 3,
    transactionDate: '2024-01-18T09:15:00Z',
    referenceType: 'manual_adjustment',
    performedBy: 'user456',
    reason: 'Manual stock reduction',
    createdAt: '2024-01-18T09:15:00Z',
    updatedAt: '2024-01-18T09:15:00Z',
  },
  {
    _id: '4',
    organizationId: 'org123',
    shopId: 'shop123',
    productId: 'prod123',
    productCode: 'PRD000001',
    transactionType: 'IN',
    quantity: 5,
    previousQuantity: 0,
    newQuantity: 5,
    transactionDate: '2024-01-15T08:00:00Z',
    referenceType: 'product_creation',
    referenceId: 'prod123',
    performedBy: 'user789',
    reason: 'Initial stock entry',
    value: 145000,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
  },
]

// HELPER FUNCTIONS

const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'IN':
      return TrendingUp
    case 'OUT':
      return TrendingDown
    case 'SALE':
      return ShoppingCart
    case 'RESERVED':
      return Package
    case 'ADJUSTMENT':
      return RefreshCw
    default:
      return AlertCircle
  }
}

const getTransactionBadgeVariant = (type: string) => {
  switch (type) {
    case 'IN':
      return 'success'
    case 'OUT':
      return 'error'
    case 'SALE':
      return 'accent'
    case 'RESERVED':
      return 'warning'
    case 'ADJUSTMENT':
      return 'info'
    default:
      return 'default'
  }
}

// HISTORY TAB COMPONENT

export const HistoryTab: React.FC<HistoryTabProps> = ({
  product,
  transactions = mockTransactions,
  loading = false,
  onLoadMore,
  hasMore = false,
}) => {
  const { t } = useTranslation()

  // Calculate statistics
  const totalTransactions = transactions.length
  const stockIn = transactions.filter(t => t.transactionType === 'IN').length
  const stockOut = transactions.filter(t => t.transactionType === 'OUT').length
  const adjustments = transactions.filter(
    t => t.transactionType === 'ADJUSTMENT'
  ).length

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-lg bg-bg-tertiary"
          />
        ))}
      </div>
    )
  }

  // TRANSACTION STATISTICS SECTION

  const TransactionStatisticsSection = () => (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-4">
          <p className="flex items-center gap-2 text-xs text-text-secondary">
            <History className="h-3 w-3" />
            {t('product.productDetail.history.totalTransactions')}
          </p>
          <p className="mt-2 text-3xl font-bold text-text-primary">
            {totalTransactions}
          </p>
        </div>

        <div className="border-status-success/20 bg-status-success/5 rounded-lg border p-4">
          <p className="flex items-center gap-2 text-xs text-text-secondary">
            <TrendingUp className="h-3 w-3" />
            {t('product.productDetail.history.stockIn')}
          </p>
          <p className="mt-2 text-3xl font-bold text-status-success">
            {stockIn}
          </p>
        </div>

        <div className="border-status-error/20 bg-status-error/5 rounded-lg border p-4">
          <p className="flex items-center gap-2 text-xs text-text-secondary">
            <TrendingDown className="h-3 w-3" />
            {t('product.productDetail.history.stockOut')}
          </p>
          <p className="mt-2 text-3xl font-bold text-status-error">
            {stockOut}
          </p>
        </div>

        <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-4">
          <p className="flex items-center gap-2 text-xs text-text-secondary">
            <RefreshCw className="h-3 w-3" />
            {t('product.productDetail.history.adjustments')}
          </p>
          <p className="mt-2 text-3xl font-bold text-status-info">
            {adjustments}
          </p>
        </div>
      </div>
    </div>
  )

  // TRANSACTION HISTORY SECTION

  const TransactionHistorySection = () => {
    if (transactions.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8">
          <History className="mb-4 h-16 w-16 text-text-tertiary" />
          <p className="text-lg font-medium text-text-primary">
            {t('product.productDetail.history.noHistory')}
          </p>
          <p className="mt-1 text-sm text-text-tertiary">
            {t('product.productDetail.history.noHistoryDescription')}
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-4 p-4">
        {/* Timeline View */}
        <div className="space-y-4">
          {transactions.map(transaction => {
            const Icon = getTransactionIcon(transaction.transactionType)
            return (
              <div
                key={transaction._id}
                className="relative border-l-2 border-border-secondary pb-6 pl-8 last:pb-0"
              >
                {/* Timeline Icon */}
                <div className="absolute -left-3 top-0 rounded-full bg-bg-secondary p-1">
                  <Icon className="h-5 w-5 text-accent" />
                </div>

                {/* Transaction Card */}
                <div className="hover:border-accent/30 rounded-lg border border-border-secondary bg-bg-primary p-4 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left Content */}
                    <div className="flex-1 space-y-2">
                      {/* Header */}
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={
                            getTransactionBadgeVariant(
                              transaction.transactionType
                            ) as any
                          }
                          size="sm"
                        >
                          {transaction.transactionType}
                        </Badge>

                        <span className="text-sm text-text-tertiary">
                          {format(
                            new Date(transaction.transactionDate),
                            'dd MMM yyyy, hh:mm a'
                          )}
                        </span>
                      </div>

                      {/* Reason */}
                      <p className="text-sm font-medium text-text-primary">
                        {transaction.reason}
                      </p>

                      {/* Details */}
                      <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                        {transaction.quantity !== 0 && (
                          <div>
                            <span className="text-text-tertiary">Qty: </span>
                            <span className="font-medium">
                              {transaction.transactionType === 'OUT' && '-'}
                              {transaction.transactionType === 'IN' && '+'}
                              {transaction.quantity}
                            </span>
                          </div>
                        )}

                        <div>
                          <span className="text-text-tertiary">Balance: </span>
                          <span className="font-medium">
                            {transaction.previousQuantity} →{' '}
                            {transaction.newQuantity}
                          </span>
                        </div>

                        {transaction.value && (
                          <div>
                            <span className="text-text-tertiary">Value: </span>
                            <span className="font-medium text-accent">
                              ₹{transaction.value.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Reference */}
                      {transaction.referenceType && (
                        <div className="text-xs text-text-tertiary">
                          Ref: {transaction.referenceType}
                          {transaction.referenceId &&
                            ` - ${transaction.referenceId}`}
                        </div>
                      )}
                    </div>

                    {/* Performed By */}
                    <div className="flex items-center gap-2">
                      <Avatar name="User" size="sm" />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {hasMore && onLoadMore && (
            <div className="flex justify-center pt-4">
              <Button variant="outline" onClick={onLoadMore} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                {t('product.common.loadMore')}
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // PRODUCT LIFECYCLE SECTION

  const ProductLifecycleSection = () => (
    <div className="space-y-3 p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-3">
          <p className="text-xs text-text-secondary">
            {t('product.productDetail.history.created')}
          </p>
          <p className="mt-1 text-sm font-medium text-text-primary">
            {format(new Date(product.createdAt), 'dd MMM yyyy, hh:mm a')}
          </p>
        </div>

        <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-3">
          <p className="text-xs text-text-secondary">
            {t('product.productDetail.history.lastUpdated')}
          </p>
          <p className="mt-1 text-sm font-medium text-text-primary">
            {format(new Date(product.updatedAt), 'dd MMM yyyy, hh:mm a')}
          </p>
        </div>

        {product.soldDate && (
          <div className="border-accent/20 bg-accent/5 rounded-lg border p-3 md:col-span-2">
            <p className="text-xs text-text-secondary">
              {t('product.productDetail.history.soldOn')}
            </p>
            <p className="mt-1 text-sm font-medium text-accent">
              {format(new Date(product.soldDate), 'dd MMM yyyy, hh:mm a')}
            </p>
          </div>
        )}
      </div>
    </div>
  )

  // RENDER MAIN ACCORDION

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4 p-4">
      <Accordion
        type="multiple"
        defaultValue={['statistics', 'history']}
        variant="separated"
        size="md"
      >
        {/* Transaction Statistics */}
        <AccordionItem value="statistics">
          <AccordionTrigger
            icon={<BarChart3 className="h-5 w-5" />}
            badge={
              <Badge variant="info" size="sm">
                {totalTransactions} Transactions
              </Badge>
            }
          >
            {t('product.productDetail.history.statistics')}
          </AccordionTrigger>
          <AccordionContent>
            <TransactionStatisticsSection />
          </AccordionContent>
        </AccordionItem>

        {/* Transaction History */}
        <AccordionItem value="history">
          <AccordionTrigger icon={<Activity className="h-5 w-5" />}>
            {t('product.productDetail.history.transactionHistory')}
          </AccordionTrigger>
          <AccordionContent>
            <TransactionHistorySection />
          </AccordionContent>
        </AccordionItem>

        {/* Product Lifecycle */}
        <AccordionItem value="lifecycle">
          <AccordionTrigger icon={<Calendar className="h-5 w-5" />}>
            {t('product.productDetail.history.lifecycle')}
          </AccordionTrigger>
          <AccordionContent>
            <ProductLifecycleSection />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default HistoryTab
