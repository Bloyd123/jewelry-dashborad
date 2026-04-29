// FILE: src/components/user/UserFilters/UserFilters.tsx

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchBar }      from '@/components/ui/SearchBar'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import type { UserRole, Department } from '@/types/user.types'

export interface UserFilterValues {
  search:      string
  role?:       UserRole
  department?: Department
  isActive?:   'active' | 'inactive'
}

interface UserFiltersProps {
  filters:         UserFilterValues
  onFiltersChange: (filters: UserFilterValues) => void
  onClearAll:      () => void
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearAll,
}) => {
  const { t } = useTranslation()

  const hasActiveFilters =
    filters.search ||
    filters.role ||
    filters.department ||
    filters.isActive !== undefined

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      {/* Search */}
      <div className="w-full sm:w-64">
        <SearchBar
          value={filters.search}
          onChange={val => onFiltersChange({ ...filters, search: val })}
          placeholder={t('user.filters.searchPlaceholder')}
          debounceMs={400}
        />
      </div>

      {/* Role Filter */}
      <Select
        value={filters.role || 'all'}
        onValueChange={val =>
          onFiltersChange({
            ...filters,
            role: val === 'all' ? undefined : (val as UserRole),
          })
        }
      >
        <SelectTrigger className="h-10 w-full sm:w-[160px]">
          <SelectValue placeholder={t('user.filters.allRoles')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('user.filters.allRoles')}</SelectItem>
          <SelectItem value="org_admin">{t('roles.org_admin')}</SelectItem>
          <SelectItem value="shop_admin">{t('roles.shop_admin')}</SelectItem>
          <SelectItem value="manager">{t('roles.manager')}</SelectItem>
          <SelectItem value="staff">{t('roles.staff')}</SelectItem>
          <SelectItem value="accountant">{t('roles.accountant')}</SelectItem>
          <SelectItem value="viewer">{t('roles.viewer')}</SelectItem>
        </SelectContent>
      </Select>

      {/* Department Filter */}
      <Select
        value={filters.department || 'all'}
        onValueChange={val =>
          onFiltersChange({
            ...filters,
            department: val === 'all' ? undefined : (val as Department),
          })
        }
      >
        <SelectTrigger className="h-10 w-full sm:w-[170px]">
          <SelectValue placeholder={t('user.filters.allDepartments')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('user.filters.allDepartments')}</SelectItem>
          <SelectItem value="sales">{t('departments.sales')}</SelectItem>
          <SelectItem value="purchase">{t('departments.purchase')}</SelectItem>
          <SelectItem value="inventory">{t('departments.inventory')}</SelectItem>
          <SelectItem value="accounts">{t('departments.accounts')}</SelectItem>
          <SelectItem value="management">{t('departments.management')}</SelectItem>
          <SelectItem value="workshop">{t('departments.workshop')}</SelectItem>
          <SelectItem value="quality_check">{t('departments.quality_check')}</SelectItem>
          <SelectItem value="customer_service">{t('departments.customer_service')}</SelectItem>
          <SelectItem value="other">{t('departments.other')}</SelectItem>
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select
        value={filters.isActive ?? 'all'}
        onValueChange={val =>
          onFiltersChange({
            ...filters,
            isActive: val === 'all' ? undefined : (val as 'active' | 'inactive'),
          })
        }
      >
        <SelectTrigger className="h-10 w-full sm:w-[140px]">
          <SelectValue placeholder={t('user.filters.allStatus')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('user.filters.allStatus')}</SelectItem>
          <SelectItem value="active">{t('common.active')}</SelectItem>
          <SelectItem value="inactive">{t('common.inactive')}</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear All */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-10 gap-1.5 text-text-secondary hover:text-status-error"
        >
          <X className="h-4 w-4" />
          {t('common.clearAll')}
        </Button>
      )}
    </div>
  )
}