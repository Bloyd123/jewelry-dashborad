// FILE: src/components/girviTransfer/GirviTransferFilters/TransferSearchBar.tsx

import * as React       from 'react'
import { useTranslation } from 'react-i18next'
import { SearchBar }      from '@/components/ui/SearchBar'

interface TransferSearchBarProps {
  value:     string
  onChange:  (value: string) => void
  className?: string
}

export const TransferSearchBar = React.forwardRef<
  HTMLInputElement,
  TransferSearchBarProps
>(({ value, onChange, className }, ref) => {
  const { t } = useTranslation()
  return (
    <SearchBar
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={t('girviTransfer.filters.searchPlaceholder', 'Search transfers...')}
      className={className}
      debounceMs={300}
    />
  )
})
TransferSearchBar.displayName = 'TransferSearchBar'