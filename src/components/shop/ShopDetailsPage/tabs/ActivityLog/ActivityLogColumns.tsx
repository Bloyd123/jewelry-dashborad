//
// FILE: src/components/shop/ShopDetailsPages/tabs/ActivityLog/ActivityLogColumns.tsx
//

import React from 'react'
import { Eye } from 'lucide-react'
import { Avatar } from '@/components/ui/data-display/Avatar'
import { Badge } from '@/components/ui/data-display/Badge'
import { Button } from '@/components/ui/button'
import type { DataTableColumn } from '@/components/ui/data-display/DataTable'
import type { ActivityLog } from '@/types/shop.types'

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'

  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} min${minutes > 1 ? 's' : ''} ago`
  }

  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  }

  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const getRoleVariant = (
  role: string
): 'vip' | 'info' | 'accent' | 'success' | 'default' => {
  const roleMap: Record<string, 'vip' | 'info' | 'accent' | 'success' | 'default'> = {
    super_admin: 'vip',
    org_admin: 'info',
    shop_admin: 'accent',
    manager: 'success',
    accountant: 'success',
    staff: 'default',
    system: 'default',
  }
  return roleMap[role] || 'default'
}

const getActionVariant = (
  action: string
): 'success' | 'info' | 'error' | 'default' => {
  const actionMap: Record<string, 'success' | 'info' | 'error' | 'default'> = {
    create: 'success',
    update: 'info',
    update_settings: 'info',
    delete: 'error',
    login: 'default',
    logout: 'default',
    view: 'default',
    export: 'default',
  }
  return actionMap[action] || 'default'
}

// ============================================
// COLUMN DEFINITIONS
// ============================================

export const activityLogColumns: DataTableColumn<ActivityLog>[] = [
  // 1. Date/Time
  {
    id: 'timestamp',
    header: 'shops.activityLog.columns.dateTime',
    accessorKey: 'createdAt',
    sortable: true,
    width: '180px',
    cell: ({ row }) => {
      const date = new Date(row.createdAt)
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-text-primary">
            {formatTimestamp(row.createdAt)}
          </span>
          <span className="text-xs text-text-tertiary">
            {date.toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      )
    },
  },

  // 2. User with Avatar and Role
  {
    id: 'user',
    header: 'shops.activityLog.columns.user',
    accessorFn: row => {
      const user = row.userId
      return user ? `${user.firstName} ${user.lastName}` : 'System'
    },
    sortable: true,
    width: '200px',
    cell: ({ row }) => {
      const user = row.userId
      const name = user ? `${user.firstName} ${user.lastName}` : 'System'
      const role = user?.role || 'system'
      return (
        <div className="flex items-center gap-3">
          <Avatar name={name} size="sm" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-text-primary">
              {name}
            </span>
            <Badge variant={getRoleVariant(role)} size="sm">
              {role.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>
      )
    },
  },

  // 3. Action Badge
  {
    id: 'action',
    header: 'shops.activityLog.columns.action',
    accessorKey: 'action',
    sortable: true,
    width: '120px',
    cell: ({ row }) => (
      <Badge variant={getActionVariant(row.action)} size="md">
        {row.action.toUpperCase()}
      </Badge>
    ),
  },

  // 4. Module
  {
    id: 'module',
    header: 'shops.activityLog.columns.module',
    accessorKey: 'module',
    sortable: true,
    width: '150px',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-text-primary">
        {row.module}
      </span>
    ),
  },

  // 5. Description
  {
    id: 'description',
    header: 'shops.activityLog.columns.description',
    accessorKey: 'description',
    sortable: false,
    width: 'auto',
    cell: ({ row }) => (
      <div className="max-w-md">
        <p
          className="truncate text-sm text-text-secondary"
          title={row.description}
        >
          {row.description}
        </p>
      </div>
    ),
  },

  // 6. Status Badge
  {
    id: 'status',
    header: 'shops.activityLog.columns.status',
    accessorKey: 'status',
    sortable: true,
    width: '100px',
    align: 'center',
    cell: ({ row }) => {
      const statusVariants: Record<string, 'success' | 'warning' | 'error'> = {
        success: 'success',
        pending: 'warning',
        failed: 'error',
      }
      return (
        <Badge variant={statusVariants[row.status]} dot size="sm">
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      )
    },
  },

  // 7. Details Button
  {
    id: 'details',
    header: 'shops.activityLog.columns.details',
    sortable: false,
    width: '80px',
    align: 'center',
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={e => {
          e.stopPropagation()
          alert(JSON.stringify(row.metadata, null, 2))
        }}
        className="h-8 w-8 p-0"
        aria-label="View details"
      >
        <Eye className="h-4 w-4" />
      </Button>
    ),
  },
]