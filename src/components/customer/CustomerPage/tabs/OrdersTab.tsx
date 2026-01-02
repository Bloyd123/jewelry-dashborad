// FILE: src/components/customer/CustomerPage/tabs/OrdersTab.tsx
// Orders History Tab

import React from 'react'
import { useTranslation } from 'react-i18next'
import { ShoppingBag, Calendar, Package } from 'lucide-react'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { StatCard, StatCardGrid } from '@/components/ui/data-display/StatCard'
import { DataTable } from '@/components/ui/data-display/DataTable/DataTable'
import { MOCK_CUSTOMERS } from '@/pages/customer/AddCustomer/mockdata'
import type { Customer } from '@/types/customer.types'
import type { DataTableColumn } from '@/components/ui/data-display/DataTable/DataTable.types'

// MOCK ORDER DATA

interface Order {
  id: string
  orderNumber: string
  date: string
  amount: number
  status: 'completed' | 'pending' | 'cancelled'
  items: number
}

const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    date: '2024-12-15',
    amount: 45000,
    status: 'completed',
    items: 3,
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    date: '2024-11-20',
    amount: 32000,
    status: 'completed',
    items: 2,
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    date: '2024-10-10',
    amount: 28000,
    status: 'completed',
    items: 1,
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    date: '2024-09-05',
    amount: 55000,
    status: 'completed',
    items: 4,
  },
]

// COMPONENT PROPS

interface OrdersTabProps {
  customerId?: string
}

// ORDERS TAB COMPONENT

export const OrdersTab: React.FC<OrdersTabProps> = ({ customerId }) => {
  const { t } = useTranslation()

  // Get customer data from mock
  const customer: Customer = customerId
    ? MOCK_CUSTOMERS.find(c => c._id === customerId) || MOCK_CUSTOMERS[0]
    : MOCK_CUSTOMERS[0]

  // Define columns for DataTable
  const columns: DataTableColumn<Order>[] = [
    {
      id: 'orderNumber',
      header: t('customerOrders.orderNumber'),
      accessorKey: 'orderNumber',
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium text-text-primary">
          {row.orderNumber}
        </span>
      ),
    },
    {
      id: 'date',
      header: t('customerOrders.date'),
      accessorKey: 'date',
      cell: ({ row }) => (
        <span className="text-sm text-text-secondary">
          {new Date(row.date).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: 'items',
      header: t('customerOrders.items'),
      accessorKey: 'items',
      cell: ({ row }) => (
        <span className="text-sm text-text-secondary">{row.items}</span>
      ),
      align: 'center',
    },
    {
      id: 'amount',
      header: t('customerOrders.amount'),
      accessorKey: 'amount',
      cell: ({ row }) => (
        <span className="text-sm font-semibold text-text-primary">
          ₹{row.amount.toLocaleString()}
        </span>
      ),
      align: 'right',
    },
    {
      id: 'status',
      header: t('customerOrders.status'),
      accessorKey: 'status',
      cell: ({ row }) => (
        <Badge variant={row.status} size="sm">
          {t(`customerOrders.status_${row.status}`)}
        </Badge>
      ),
      align: 'center',
    },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4">
      {/* Order Statistics */}
      <StatCardGrid columns={3}>
        <StatCard
          title={t('customerOrders.totalOrders')}
          value={MOCK_ORDERS.length}
          icon={ShoppingBag}
          variant="info"
          size="md"
        />

        <StatCard
          title={t('customerOrders.lastOrder')}
          value={
            customer.lastPurchaseDate
              ? new Date(customer.lastPurchaseDate).toLocaleDateString()
              : t('common.na')
          }
          icon={Calendar}
          variant="default"
          size="md"
        />

        <StatCard
          title={t('customerOrders.totalItems')}
          value={MOCK_ORDERS.reduce((sum, order) => sum + order.items, 0)}
          icon={Package}
          variant="success"
          size="md"
        />
      </StatCardGrid>

      {/* Orders Table */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
        <h3 className="mb-4 text-lg font-semibold text-text-primary">
          {t('customerOrders.orderHistory')}
        </h3>

        <DataTable
          data={MOCK_ORDERS}
          columns={columns}
          pagination={{
            enabled: true,
            pageSize: 10,
            showPageSizeSelector: true,
          }}
          sorting={{
            enabled: true,
          }}
          style={{
            hoverEffect: true,
          }}
        />
      </div>
    </div>
  )
}

export default OrdersTab
