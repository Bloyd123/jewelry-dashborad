// FILE: src/components/sales/SalesFilters/SalesSearchBar.tsx
// Sales Search Bar

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SalesSearchBarProps {
  value: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
}

export const SalesSearchBar = React.forwardRef<
  HTMLInputElement,
  SalesSearchBarProps
>(({ value, onChange, className, disabled = false }, ref) => {
  const { t } = useTranslation()

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={t('sales.filters.searchPlaceholder')}
        disabled={disabled}
        className="flex h-10 w-full rounded-md border border-border-primary bg-bg-secondary px-3 pl-10 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  )
})

SalesSearchBar.displayName = 'SalesSearchBar'
