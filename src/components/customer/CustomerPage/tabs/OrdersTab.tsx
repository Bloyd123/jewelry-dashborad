// FILE: src/components/customer/CustomerPage/tabs/OrdersTab.tsx

import React from 'react'
import { useTranslation } from 'react-i18next'
import { ShoppingBag, Calendar, Package } from 'lucide-react'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { StatCard, StatCardGrid } from '@/components/ui/data-display/StatCard'
import { DataTable } from '@/components/ui/data-display/DataTable/DataTable'
import type { Customer } from '@/types/customer.types'
import type { DataTableColumn } from '@/components/ui/data-display/DataTable/DataTable.types'
import { useSalesList } from '@/hooks/sales/useSalesList'  // ← hook use karo
import { useAuth } from '@/hooks/auth'

interface OrdersTabProps {
  customer: Customer
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ customer }) => {
  const { t } = useTranslation()
  const { currentShopId } = useAuth()

  // ← useSalesList ka initialFilters mein customerId pass karo
  const { sales, total, isLoading } = useSalesList(currentShopId!, {
    customerId: customer._id,
    page:       1,
    limit:      20,
  })

  const columns: DataTableColumn<any>[] = [
    {
      id:          'orderNumber',
      header:      t('customerOrders.orderNumber'),
      accessorKey: 'invoiceNumber',
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium text-text-primary">
          {row.invoiceNumber}
        </span>
      ),
    },
    {
      id:          'date',
      header:      t('customerOrders.date'),
      accessorKey: 'saleDate',
      cell: ({ row }) => (
        <span className="text-sm text-text-secondary">
          {new Date(row.saleDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      id:          'items',
      header:      t('customerOrders.items'),
      accessorKey: 'items',
      cell: ({ row }) => (
        <span className="text-sm text-text-secondary">
          {row.items?.length || 0}
        </span>
      ),
      align: 'center',
    },
    {
      id:          'amount',
      header:      t('customerOrders.amount'),
      accessorKey: 'financials',
      cell: ({ row }) => (
        <span className="text-sm font-semibold text-text-primary">
          ₹{row.financials?.grandTotal?.toLocaleString() || 0}
        </span>
      ),
      align: 'right',
    },
    {
      id:          'paymentStatus',
      header:      t('customerOrders.paymentStatus'),
      accessorKey: 'payment',
      cell: ({ row }) => (
        <Badge variant={row.payment?.paymentStatus} size="sm">
          {row.payment?.paymentStatus}
        </Badge>
      ),
      align: 'center',
    },
    {
      id:          'status',
      header:      t('customerOrders.status'),
      accessorKey: 'status',
      cell: ({ row }) => (
        <Badge variant={row.status} size="sm">
          {t(`customerOrders.status_${row.status}`)}
        </Badge>
      ),
      align: 'center',
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-text-tertiary">Loading...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4">
      <StatCardGrid columns={3}>
        <StatCard
          title={t('customerOrders.totalOrders')}
          value={customer.statistics?.totalOrders || total}
          icon={ShoppingBag}
          variant="info"
          size="md"
        />

        <StatCard
          title={t('customerOrders.lastOrder')}
          value={
            customer.statistics?.lastOrderDate
              ? new Date(customer.statistics.lastOrderDate).toLocaleDateString()
              : t('common.na')
          }
          icon={Calendar}
          variant="default"
          size="md"
        />

        <StatCard
          title={t('customerOrders.totalItems')}
          value={total}
          icon={Package}
          variant="success"
          size="md"
        />
      </StatCardGrid>

      <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
        <h3 className="mb-4 text-lg font-semibold text-text-primary">
          {t('customerOrders.orderHistory')}
        </h3>

        {sales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ShoppingBag className="mb-3 h-10 w-10 text-text-tertiary" />
            <p className="text-sm text-text-tertiary">
              {t('customerOrders.noOrders')}
            </p>
          </div>
        ) : (
          <DataTable
            data={sales}
            columns={columns}
            pagination={{
              enabled:              true,
              pageSize:             10,
              showPageSizeSelector: true,
            }}
            sorting={{
              enabled: true,
            }}
            style={{
              hoverEffect: true,
            }}
          />
        )}
      </div>
    </div>
  )
}

export default OrdersTab