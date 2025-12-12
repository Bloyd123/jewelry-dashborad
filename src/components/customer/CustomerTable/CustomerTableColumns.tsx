// ============================================================================
// FILE: src/features/customer/components/CustomerTable/CustomerTableColumns.tsx
// Customer Table Column Definitions
// ============================================================================

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Phone, Mail, Calendar } from 'lucide-react'
import type { DataTableColumn } from '@/components/ui/data-display/DataTable'
import type { CustomerListItem } from '@/types'

// ============================================================================
// BADGE COMPONENT (Simple inline component)
// ============================================================================

const Badge: React.FC<{
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  children: React.ReactNode
  className?: string
}> = ({ variant = 'default', children, className = '' }) => {
  const variantClasses = {
    default: 'bg-bg-tertiary text-text-primary',
    success: 'bg-status-success/10 text-status-success border border-status-success/20',
    warning: 'bg-status-warning/10 text-status-warning border border-status-warning/20',
    error: 'bg-status-error/10 text-status-error border border-status-error/20',
    info: 'bg-status-info/10 text-status-info border border-status-info/20',
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

// ============================================================================
// TIER BADGE COMPONENT
// ============================================================================

const TierBadge: React.FC<{ tier: string }> = ({ tier }) => {
  const { t } = useTranslation()

  const tierConfig: Record<string, { bg: string; text: string; border: string }> = {
    standard: {
      bg: 'bg-bg-tertiary',
      text: 'text-text-primary',
      border: 'border-border-primary',
    },
    silver: {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-300',
    },
    gold: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-300',
    },
    platinum: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-300',
    },
  }

  const config = tierConfig[tier.toLowerCase()] || tierConfig.standard

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      {t(`customer.membershipTiers.${tier.toLowerCase()}`)}
    </span>
  )
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const formatPhone = (phone: string): string => {
  // Format: +91 98765 43210
  if (phone.startsWith('+91')) {
    const number = phone.slice(3).replace(/\s/g, '')
    return `+91 ${number.slice(0, 5)} ${number.slice(5)}`
  }
  return phone
}

// ============================================================================
// COLUMN DEFINITIONS
// ============================================================================

export const getCustomerTableColumns = (): DataTableColumn<CustomerListItem>[] => {
  const { t } = useTranslation()

  return [
    // ========================================================================
    // CUSTOMER CODE
    // ========================================================================
    {
      id: 'customerCode',
      header: 'customer.fields.customerCode',
      accessorKey: 'customerCode',
      sortable: true,
      width: 140,
      cell: ({ value, row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-accent hover:underline cursor-pointer">
            {value}
          </span>
          {row.isBlacklisted && (
            <Badge variant="error" className="mt-1 w-fit">
              {t('customer.status.blacklisted')}
            </Badge>
          )}
        </div>
      ),
    },

    // ========================================================================
    // CUSTOMER NAME & PHONE
    // ========================================================================
    {
      id: 'name',
      header: 'customer.fields.name',
      accessorFn: (row) => `${row.firstName} ${row.lastName || ''}`.trim(),
      sortable: true,
      width: 220,
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="font-medium text-text-primary">
            {row.firstName} {row.lastName}
            {row.customerType === 'vip' && (
              <span className="ml-2 text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-semibold">
                VIP
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-text-tertiary">
            <Phone className="h-3 w-3" />
            {formatPhone(row.phone)}
          </div>
        </div>
      ),
    },

    // ========================================================================
    // EMAIL
    // ========================================================================
    {
      id: 'email',
      header: 'customer.fields.email',
      accessorKey: 'email',
      sortable: false,
      width: 200,
      cell: ({ value }) => {
        if (!value) return <span className="text-text-tertiary">-</span>

        return (
          <div className="flex items-center gap-1 text-text-secondary">
            <Mail className="h-3 w-3" />
            <span className="truncate">{value}</span>
          </div>
        )
      },
    },

    // ========================================================================
    // CUSTOMER TYPE
    // ========================================================================
    {
      id: 'customerType',
      header: 'customer.fields.customerType',
      accessorKey: 'customerType',
      sortable: true,
      width: 130,
      align: 'center',
      cell: ({ value }) => {
        const variantMap: Record<string, 'default' | 'success' | 'warning' | 'info'> = {
          retail: 'default',
          wholesale: 'warning',
          vip: 'success',
          regular: 'info',
        }

        return (
          <Badge variant={variantMap[value] || 'default'}>
            {t(`customer.customerTypes.${value}`)}
          </Badge>
        )
      },
    },

    // ========================================================================
    // MEMBERSHIP TIER
    // ========================================================================
    {
      id: 'membershipTier',
      header: 'customer.fields.membershipTier',
      accessorKey: 'membershipTier',
      sortable: true,
      width: 130,
      align: 'center',
      cell: ({ value }) => {
        if (!value) return <span className="text-text-tertiary">-</span>
        return <TierBadge tier={value} />
      },
    },

    // ========================================================================
    // LOYALTY POINTS
    // ========================================================================
    {
      id: 'loyaltyPoints',
      header: 'customer.fields.loyaltyPoints',
      accessorKey: 'loyaltyPoints',
      sortable: true,
      width: 130,
      align: 'right',
      cell: ({ value }) => (
        <div className="flex flex-col items-end">
          <span className="font-medium text-accent">
            {value?.toLocaleString() || 0}
          </span>
          <span className="text-xs text-text-tertiary">
            {t('customer.fields.points')}
          </span>
        </div>
      ),
    },

    // ========================================================================
    // TOTAL PURCHASES
    // ========================================================================
    {
      id: 'totalPurchases',
      header: 'customer.fields.totalPurchases',
      accessorKey: 'totalPurchases',
      sortable: true,
      width: 150,
      align: 'right',
      cell: ({ value }) => (
        <span className="font-medium text-text-primary">
          {formatCurrency(value || 0)}
        </span>
      ),
    },

    // ========================================================================
    // OUTSTANDING DUE
    // ========================================================================
    {
      id: 'totalDue',
      header: 'customer.fields.totalDue',
      accessorKey: 'totalDue',
      sortable: true,
      width: 140,
      align: 'right',
      cell: ({ value }) => {
        const amount = value || 0

        if (amount === 0) {
          return <span className="text-text-tertiary">-</span>
        }

        return (
          <div className="flex flex-col items-end">
            <span className="font-semibold text-status-error">
              {formatCurrency(amount)}
            </span>
            <span className="text-xs text-status-error/70">
              {t('customer.fields.outstanding')}
            </span>
          </div>
        )
      },
    },

    // ========================================================================
    // LAST ORDER DATE
    // ========================================================================
    {
      id: 'lastOrderDate',
      header: 'customer.fields.lastOrderDate',
      accessorKey: 'statistics.lastOrderDate',
      accessorFn: (row) => row.statistics?.lastOrderDate,
      sortable: true,
      width: 140,
      cell: ({ value }) => {
        if (!value) {
          return (
            <span className="text-text-tertiary text-sm">
              {t('customer.noOrders')}
            </span>
          )
        }

        return (
          <div className="flex items-center gap-1 text-text-secondary">
            <Calendar className="h-3 w-3" />
            <span className="text-sm">{formatDate(value)}</span>
          </div>
        )
      },
    },

    // ========================================================================
    // STATUS
    // ========================================================================
    {
      id: 'status',
      header: 'customer.fields.status',
      accessorKey: 'isActive',
      sortable: true,
      width: 100,
      align: 'center',
      cell: ({ value, row }) => {
        if (row.isBlacklisted) {
          return (
            <Badge variant="error">
              {t('customer.status.blacklisted')}
            </Badge>
          )
        }

        return (
          <Badge variant={value ? 'success' : 'default'}>
            {value ? t('common.active') : t('common.inactive')}
          </Badge>
        )
      },
    },

    // ========================================================================
    // CREATED DATE
    // ========================================================================
    {
      id: 'createdAt',
      header: 'customer.fields.createdAt',
      accessorKey: 'createdAt',
      sortable: true,
      width: 130,
      cell: ({ value }) => (
        <span className="text-sm text-text-secondary">
          {formatDate(value)}
        </span>
      ),
    },
  ]
}

// ============================================================================
// COMPACT COLUMNS (For Mobile/Tablet)
// ============================================================================

export const getCompactCustomerTableColumns = (): DataTableColumn<CustomerListItem>[] => {
  return [
    {
      id: 'customer',
      header: 'customer.fields.customer',
      accessorFn: (row) => `${row.firstName} ${row.lastName || ''}`.trim(),
      sortable: true,
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 py-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-text-primary">
              {row.firstName} {row.lastName}
            </span>
            {row.customerType === 'vip' && (
              <Badge variant="success" className="text-xs">VIP</Badge>
            )}
          </div>
          <div className="text-sm text-accent">{row.customerCode}</div>
          <div className="text-sm text-text-tertiary">{formatPhone(row.phone)}</div>
        </div>
      ),
    },
    {
      id: 'summary',
      header: 'customer.fields.summary',
      sortable: false,
      align: 'right',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 items-end py-1">
          <div className="font-medium text-text-primary">
            {formatCurrency(row.totalPurchases || 0)}
          </div>
          {row.totalDue && row.totalDue > 0 && (
            <div className="text-sm text-status-error font-medium">
              {t('customer.fields.due')}: {formatCurrency(row.totalDue)}
            </div>
          )}
          <Badge variant={row.isActive ? 'success' : 'default'} className="text-xs">
            {row.isActive ? t('common.active') : t('common.inactive')}
          </Badge>
        </div>
      ),
    },
  ]
}

// ============================================================================
// EXPORT
// ============================================================================

export default getCustomerTableColumns