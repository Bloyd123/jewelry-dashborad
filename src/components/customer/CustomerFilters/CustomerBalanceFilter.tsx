// ============================================================================
// FILE: src/components/customer/CustomerFilters/CustomerBalanceFilter.tsx
// Customer Balance Filter - Uses Reusable TypeFilter
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { TypeFilter } from '@/components/ui/filters/TypeFilter'
import type { FilterOption } from '@/components/ui/filters/TypeFilter'
import { DollarSign, CheckCircle } from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

interface CustomerBalanceFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  showAllOption?: boolean
  className?: string
  disabled?: boolean
}

// ============================================================================
// CUSTOMER BALANCE FILTER COMPONENT
// ============================================================================

export const CustomerBalanceFilter = React.forwardRef<
  HTMLButtonElement,
  CustomerBalanceFilterProps
>(
  (
    { value, onChange, showAllOption = true, className, disabled = false },
    ref
  ) => {
    const { t } = useTranslation()

    const balanceOptions: FilterOption[] = [
      {
        value: 'has_balance',
        label: t('filters.hasBalance'),
        icon: <DollarSign className="h-4 w-4 text-status-warning" />,
      },
      {
        value: 'no_balance',
        label: t('filters.noBalance'),
        icon: <CheckCircle className="h-4 w-4 text-status-success" />,
      },
    ]

    return (
      <TypeFilter
        ref={ref}
        options={balanceOptions}
        value={value}
        onChange={onChange}
        placeholder={t('customer.filters.balance')}
        showAllOption={showAllOption}
        allOptionLabel={t('customer.filters.allBalances')}
        className={className}
        disabled={disabled}
      />
    )
  }
)

CustomerBalanceFilter.displayName = 'CustomerBalanceFilter'
