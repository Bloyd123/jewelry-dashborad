// ============================================================================
// FILE: src/components/customer/CustomerFilters/CustomerTypeFilter.tsx
// Customer Type Filter - Uses Reusable TypeFilter
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { TypeFilter } from '@/components/ui/filters/TypeFilter'
import type { FilterOption } from '@/components/ui/filters/TypeFilter'
import { Crown, ShoppingBag, Tag, User } from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

interface CustomerTypeFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  showAllOption?: boolean
  className?: string
  disabled?: boolean
}

// ============================================================================
// CUSTOMER TYPE FILTER COMPONENT
// ============================================================================

export const CustomerTypeFilter = React.forwardRef<
  HTMLButtonElement,
  CustomerTypeFilterProps
>(
  (
    { value, onChange, showAllOption = true, className, disabled = false },
    ref
  ) => {
    const { t } = useTranslation()

    // Customer Type Options
    const customerTypeOptions: FilterOption[] = [
      {
        value: 'vip',
        label: t('customer.type.vip'),
        icon: <Crown className="h-4 w-4 text-accent" />,
      },
      {
        value: 'wholesale',
        label: t('customer.type.wholesale'),
        icon: <ShoppingBag className="h-4 w-4 text-status-info" />,
      },
      {
        value: 'retail',
        label: t('customer.type.retail'),
        icon: <Tag className="h-4 w-4 text-status-success" />,
      },
      {
        value: 'regular',
        label: t('customer.type.regular'),
        icon: <User className="h-4 w-4 text-text-secondary" />,
      },
    ]

    return (
      <TypeFilter
        ref={ref}
        options={customerTypeOptions}
        value={value}
        onChange={onChange}
        placeholder={t('filters.customerType')}
        showAllOption={showAllOption}
        allOptionLabel={t('filters.allTypes')}
        className={className}
        disabled={disabled}
      />
    )
  }
)

CustomerTypeFilter.displayName = 'CustomerTypeFilter'
