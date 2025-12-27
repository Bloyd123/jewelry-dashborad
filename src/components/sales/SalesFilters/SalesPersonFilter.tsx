// ============================================================================
// FILE: src/components/sales/SalesFilters/SalesPersonFilter.tsx
// Sales Person Filter
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { User, UserCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SalesPerson {
  _id: string
  firstName: string
  lastName: string
  email: string
}

interface SalesPersonFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  salesPersons?: SalesPerson[]
  className?: string
  disabled?: boolean
}

export const SalesPersonFilter = React.forwardRef<
  HTMLSelectElement,
  SalesPersonFilterProps
>(
  (
    { value, onChange, salesPersons = [], className, disabled = false },
    ref
  ) => {
    const { t } = useTranslation()

    const handleChange = (newValue: string) => {
      if (newValue === 'all') {
        onChange(undefined)
      } else {
        onChange(newValue)
      }
    }

    return (
      <div className={cn('relative', className)}>
        <UserCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
        <select
          ref={ref}
          value={value || 'all'}
          onChange={e => handleChange(e.target.value)}
          disabled={disabled}
          className="flex h-10 w-full appearance-none rounded-md border border-border-primary bg-bg-secondary px-3 pl-10 pr-10 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="all">{t('sales.filters.allSalesPersons')}</option>
          {salesPersons.map(person => (
            <option key={person._id} value={person._id}>
              {person.firstName} {person.lastName}
            </option>
          ))}
        </select>
      </div>
    )
  }
)

SalesPersonFilter.displayName = 'SalesPersonFilter'
