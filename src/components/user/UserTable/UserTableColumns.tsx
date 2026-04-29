// FILE: src/components/user/UserTable/UserTableColumns.tsx

import { Copy } from 'lucide-react'
import { Avatar } from '@/components/ui/data-display/Avatar/Avatar'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import type { DataTableColumn } from '@/components/ui/data-display/DataTable'
import type { User } from '@/types/user.types'

const formatDate = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

export const userTableColumns: DataTableColumn<User>[] = [
  // ── Name + Email ──────────────────────────────────────
  {
    id: 'fullName',
    header: 'user.table.name',
    accessorKey: 'fullName',
    sortable: true,
    width: '220px',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar
          src={row.profileImage || undefined}
          name={row.fullName || `${row.firstName} ${row.lastName || ''}`}
          size="md"
          status={row.isActive ? 'online' : 'offline'}
        />
        <div className="flex flex-col">
          <span className="font-medium text-text-primary">
            {row.fullName || `${row.firstName} ${row.lastName || ''}`}
          </span>
          <span className="text-xs text-text-tertiary">{row.email}</span>
        </div>
      </div>
    ),
  },

  // ── Username ──────────────────────────────────────────
  {
    id: 'username',
    header: 'user.table.username',
    accessorKey: 'username',
    sortable: true,
    width: '140px',
    cell: ({ row }) => (
      <span className="font-mono text-sm text-text-secondary">
        @{row.username}
      </span>
    ),
  },

  // ── Phone ─────────────────────────────────────────────
  {
    id: 'phone',
    header: 'user.table.phone',
    accessorKey: 'phone',
    sortable: false,
    width: '150px',
    cell: ({ row }) =>
      row.phone ? (
        <div className="flex items-center gap-2">
          <span className="text-text-primary">{row.phone}</span>
          <button
            onClick={e => {
              e.stopPropagation()
              copyToClipboard(row.phone!)
            }}
            className="rounded p-1 text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
            aria-label="Copy phone number"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <span className="text-xs text-text-tertiary">—</span>
      ),
  },

  // ── Role ──────────────────────────────────────────────
  {
    id: 'role',
    header: 'user.table.role',
    accessorKey: 'role',
    sortable: true,
    width: '130px',
    cell: ({ row }) => {
      const roleVariants: Record<string, any> = {
        super_admin: 'vip',
        org_admin:   'warning',
        shop_admin:  'info',
        manager:     'default',
        staff:       'default',
        accountant:  'default',
        viewer:      'inactive',
      }
      return (
        <Badge variant={roleVariants[row.role] || 'default'}>
          {row.role.replace('_', ' ').toUpperCase()}
        </Badge>
      )
    },
  },

  // ── Department ────────────────────────────────────────
  {
    id: 'department',
    header: 'user.table.department',
    accessorKey: 'department',
    sortable: true,
    width: '140px',
    cell: ({ row }) => (
      <span className="text-sm capitalize text-text-secondary">
        {row.department?.replace('_', ' ') || '—'}
      </span>
    ),
  },

  // ── Email Verified ────────────────────────────────────
  {
    id: 'isEmailVerified',
    header: 'user.table.emailVerified',
    accessorKey: 'isEmailVerified',
    sortable: true,
    width: '130px',
    align: 'center',
    cell: ({ row }) => (
      <Badge variant={row.isEmailVerified ? 'success' : 'warning'} dot>
        {row.isEmailVerified ? 'Verified' : 'Pending'}
      </Badge>
    ),
  },

  // ── Status ────────────────────────────────────────────
  {
    id: 'isActive',
    header: 'user.table.status',
    accessorKey: 'isActive',
    sortable: true,
    width: '110px',
    cell: ({ row }) => (
      <Badge variant={row.isActive ? 'active' : 'inactive'} dot>
        {row.isActive ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },

  // ── Last Login ────────────────────────────────────────
  {
    id: 'lastLogin',
    header: 'user.table.lastLogin',
    accessorKey: 'lastLogin',
    sortable: true,
    width: '130px',
    cell: ({ row }) => (
      <span className="text-sm text-text-secondary">
        {row.lastLogin ? formatDate(row.lastLogin) : '—'}
      </span>
    ),
  },

  // ── Joined ────────────────────────────────────────────
  {
    id: 'createdAt',
    header: 'user.table.joinedAt',
    accessorKey: 'createdAt',
    sortable: true,
    width: '130px',
    cell: ({ row }) => (
      <span className="text-sm text-text-secondary">
        {formatDate(row.createdAt)}
      </span>
    ),
  },
]